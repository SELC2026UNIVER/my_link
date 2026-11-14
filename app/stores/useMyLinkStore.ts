"use client";

import { create } from "zustand";
import { persist, type PersistStorage, type StorageValue } from "zustand/middleware";
import { recommendIconForUrl } from "@/app/lib/icon-matcher";
import { createInitialSeedData, GILDONG_USER_ID } from "@/app/lib/mock-seed";
import type {
  AnalyticsData,
  LinkIcon,
  LinkItem,
  SocialLink,
  UserProfile,
  UsernameHistoryEntry,
} from "@/app/lib/types";
import {
  MAX_ACTIVE_ITEMS,
  validateLinkTitle,
  validateLinkUrl,
} from "@/app/lib/validators";

export const MYLINK_STORAGE_KEY = "mylink-demo-storage";
const STORAGE_QUOTA_ERROR = "브라우저 저장 공간이 부족합니다";

export interface AddLinkInput {
  userId: string;
  title: string;
  url: string;
  icon?: LinkIcon;
}

export type AddLinkResult =
  | { ok: true; item: LinkItem }
  | {
      ok: false;
      error: string;
      field?: "title" | "url" | "limit" | "storage";
    };

interface PersistedMyLinkState {
  profiles: UserProfile[];
  socialLinks: SocialLink[];
  links: LinkItem[];
  usernameHistory: UsernameHistoryEntry[];
  analytics: Record<string, AnalyticsData>;
  currentUserId: string | null;
}

export interface MyLinkStoreState extends PersistedMyLinkState {
  _hasHydrated: boolean;
  storageRecovered: boolean;
  storageError: string | null;
  setHasHydrated: (hydrated: boolean, recovered?: boolean) => void;
  dismissStorageRecovered: () => void;
  clearStorageError: () => void;
  ensureDemoSession: () => void;
  addLink: (input: AddLinkInput) => AddLinkResult;
  recordVisit: (userId: string) => void;
  recordLinkClick: (linkId: string) => void;
  resetDemoData: () => void;
}

let detectedCorruptedStorage = false;
let shouldSeedStorageAfterHydration = false;
let lastStorageWriteError: string | null = null;

function getLocalDateKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isValidPersistedPayload(
  parsed: unknown
): parsed is StorageValue<Partial<PersistedMyLinkState>> {
  if (!parsed || typeof parsed !== "object") return false;
  const candidate = parsed as { state?: unknown };
  if (!candidate.state || typeof candidate.state !== "object") return false;
  const state = candidate.state as Partial<PersistedMyLinkState>;
  return (
    Array.isArray(state.profiles) &&
    Array.isArray(state.socialLinks) &&
    Array.isArray(state.links) &&
    Array.isArray(state.usernameHistory) &&
    typeof state.analytics === "object" &&
    state.analytics !== null
  );
}

function createSafeLocalStorage(): PersistStorage<PersistedMyLinkState> | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }

  return {
    getItem: (name) => {
      try {
        const raw = window.localStorage.getItem(name);
        if (raw === null) {
          shouldSeedStorageAfterHydration = true;
          return null;
        }
        const parsed: unknown = JSON.parse(raw);
        if (!isValidPersistedPayload(parsed)) {
          detectedCorruptedStorage = true;
          shouldSeedStorageAfterHydration = true;
          window.localStorage.removeItem(name);
          return null;
        }
        return parsed as StorageValue<PersistedMyLinkState>;
      } catch {
        detectedCorruptedStorage = true;
        shouldSeedStorageAfterHydration = true;
        try {
          window.localStorage.removeItem(name);
        } catch {
          // Ignore storage cleanup errors in restricted browser contexts.
        }
        return null;
      }
    },
    setItem: (name, value) => {
      try {
        window.localStorage.setItem(name, JSON.stringify(value));
        lastStorageWriteError = null;
      } catch {
        lastStorageWriteError = STORAGE_QUOTA_ERROR;
      }
    },
    removeItem: (name) => {
      try {
        window.localStorage.removeItem(name);
      } catch {
        // Ignore storage removal errors.
      }
    },
  };
}

function upsertDailyStat(
  analyticsMap: Record<string, AnalyticsData>,
  userId: string,
  dateKey: string,
  deltaVisits: number,
  deltaClicks: number
): Record<string, AnalyticsData> {
  const existing = analyticsMap[userId] ?? {
    userId,
    totalVisits: 0,
    dailyStats: [],
  };

  const hasToday = existing.dailyStats.some((point) => point.date === dateKey);
  const nextDaily = hasToday
    ? existing.dailyStats.map((point) =>
        point.date === dateKey
          ? {
              ...point,
              visits: point.visits + deltaVisits,
              clicks: point.clicks + deltaClicks,
            }
          : point
      )
    : [
        ...existing.dailyStats,
        { date: dateKey, visits: deltaVisits, clicks: deltaClicks },
      ].slice(-14);

  return {
    ...analyticsMap,
    [userId]: {
      userId,
      totalVisits: existing.totalVisits + deltaVisits,
      dailyStats: nextDaily,
    },
  };
}

const initialSeed = createInitialSeedData();

export const useMyLinkStore = create<MyLinkStoreState>()(
  persist(
    (set, get) => ({
      ...initialSeed,
      currentUserId: null,
      _hasHydrated: false,
      storageRecovered: false,
      storageError: null,

      setHasHydrated: (hydrated, recovered = false) =>
        set((state) => ({
          _hasHydrated: hydrated,
          storageRecovered: recovered || state.storageRecovered,
        })),

      dismissStorageRecovered: () => set({ storageRecovered: false }),

      clearStorageError: () => set({ storageError: null }),

      ensureDemoSession: () => {
        const state = get();
        const hasValidSession =
          Boolean(state.currentUserId) &&
          state.profiles.some((profile) => profile.id === state.currentUserId);
        if (hasValidSession) return;

        const demoProfile =
          state.profiles.find((profile) => profile.id === GILDONG_USER_ID) ??
          state.profiles[0] ??
          null;
        if (demoProfile) {
          set({ currentUserId: demoProfile.id });
        }
      },

      addLink: (input) => {
        const titleCheck = validateLinkTitle(input.title);
        if (!titleCheck.valid) {
          return {
            ok: false,
            error: titleCheck.error ?? "제목을 입력해 주세요",
            field: "title",
          };
        }

        const urlCheck = validateLinkUrl(input.url);
        if (!urlCheck.valid) {
          return {
            ok: false,
            error:
              urlCheck.error ??
              "올바른 URL 형식이 아닙니다 (예: https://example.com 또는 mailto:name@example.com)",
            field: "url",
          };
        }

        const state = get();
        const userItems = state.links.filter(
          (item) => item.userId === input.userId
        );
        const activeCount = userItems.filter(
          (item) => item.deletedAt === null
        ).length;

        if (activeCount >= MAX_ACTIVE_ITEMS) {
          return {
            ok: false,
            error: `항목은 최대 ${MAX_ACTIVE_ITEMS}개까지 등록할 수 있습니다`,
            field: "limit",
          };
        }

        const nextOrder =
          userItems.reduce((max, item) => Math.max(max, item.order), -1) + 1;
        const now = new Date().toISOString();
        const generatedId =
          typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
            ? `link-${crypto.randomUUID()}`
            : `link-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

        const newItem: LinkItem = {
          id: generatedId,
          userId: input.userId,
          kind: "link",
          title: titleCheck.normalized,
          url: urlCheck.normalized,
          icon: input.icon ?? recommendIconForUrl(urlCheck.normalized),
          order: nextOrder,
          clickCount: 0,
          isVisible: true,
          deletedAt: null,
          createdAt: now,
          updatedAt: now,
        };

        const previousLinks = state.links;
        lastStorageWriteError = null;
        set({
          links: [...state.links, newItem],
          storageError: null,
        });

        if (lastStorageWriteError) {
          const writeError = lastStorageWriteError;
          lastStorageWriteError = null;
          set({
            links: previousLinks,
            storageError: writeError,
          });
          return {
            ok: false,
            error: writeError,
            field: "storage",
          };
        }

        return { ok: true, item: newItem };
      },

      recordVisit: (userId) => {
        if (typeof window !== "undefined") {
          const sessionKey = `mylink_visited_${userId}`;
          try {
            if (window.sessionStorage.getItem(sessionKey) === "1") {
              return;
            }
            window.sessionStorage.setItem(sessionKey, "1");
          } catch {
            // Proceed even if sessionStorage is unavailable.
          }
        }

        const dateKey = getLocalDateKey();
        set((state) => ({
          analytics: upsertDailyStat(state.analytics, userId, dateKey, 1, 0),
        }));
      },

      recordLinkClick: (linkId) => {
        const targetLink = get().links.find((item) => item.id === linkId);
        if (!targetLink || targetLink.kind !== "link") return;

        const dateKey = getLocalDateKey();
        set((state) => ({
          links: state.links.map((item) =>
            item.id === linkId
              ? { ...item, clickCount: item.clickCount + 1 }
              : item
          ),
          analytics: upsertDailyStat(
            state.analytics,
            targetLink.userId,
            dateKey,
            0,
            1
          ),
        }));
      },

      resetDemoData: () => {
        const fresh = createInitialSeedData();
        set({
          ...fresh,
          currentUserId: null,
          storageRecovered: false,
          storageError: null,
        });
      },
    }),
    {
      name: MYLINK_STORAGE_KEY,
      version: 1,
      skipHydration: true,
      storage: createSafeLocalStorage(),
      partialize: (state) => ({
        profiles: state.profiles,
        socialLinks: state.socialLinks,
        links: state.links,
        usernameHistory: state.usernameHistory,
        analytics: state.analytics,
        currentUserId: state.currentUserId,
      }),
      onRehydrateStorage: () => (state) => {
        const recovered = detectedCorruptedStorage;
        const shouldSeed = shouldSeedStorageAfterHydration;
        detectedCorruptedStorage = false;
        shouldSeedStorageAfterHydration = false;

        if (!state) return;

        // First visit or post-corruption: persist initial seed cleanly via setHasHydrated
        if (shouldSeed) {
          state.setHasHydrated(true, recovered);
          return;
        }

        state.setHasHydrated(true, recovered);
      },
    }
  )
);

export type UsernameResolution =
  | { kind: "profile"; profile: UserProfile }
  | { kind: "redirect"; targetUsername: string }
  | { kind: "not-found"; requestedUsername: string };

/**
 * URL 파라미터 username을 활성 프로필, 대소문자/이전 username 리다이렉트, 404 중 하나로 판별한다.
 */
export function resolveUsernameTarget(
  state: Pick<MyLinkStoreState, "profiles" | "usernameHistory">,
  rawUsername: string
): UsernameResolution {
  let decoded = rawUsername;
  try {
    decoded = decodeURIComponent(rawUsername);
  } catch {
    decoded = rawUsername;
  }

  const trimmed = decoded.trim();
  const normalized = trimmed.toLowerCase();

  if (!normalized) {
    return { kind: "not-found", requestedUsername: "" };
  }

  const activeProfile = state.profiles.find(
    (profile) => profile.username.toLowerCase() === normalized
  );
  if (activeProfile) {
    if (trimmed !== activeProfile.username) {
      return { kind: "redirect", targetUsername: activeProfile.username };
    }
    return { kind: "profile", profile: activeProfile };
  }

  const historyEntry = state.usernameHistory.find(
    (entry) => entry.oldUsername.toLowerCase() === normalized
  );
  if (historyEntry) {
    const owner = state.profiles.find(
      (profile) => profile.id === historyEntry.userId
    );
    if (owner) {
      return { kind: "redirect", targetUsername: owner.username };
    }
  }

  return { kind: "not-found", requestedUsername: normalized };
}
