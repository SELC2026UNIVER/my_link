"use client";

import { create } from "zustand";
import { persist, type PersistStorage, type StorageValue } from "zustand/middleware";
import { createInitialSeedData } from "@/app/lib/mock-seed";
import type {
  AnalyticsData,
  LinkItem,
  SocialLink,
  UserProfile,
  UsernameHistoryEntry,
} from "@/app/lib/types";

export const MYLINK_STORAGE_KEY = "mylink-demo-storage";

interface PersistedMyLinkState {
  profiles: UserProfile[];
  socialLinks: SocialLink[];
  links: LinkItem[];
  usernameHistory: UsernameHistoryEntry[];
  analytics: Record<string, AnalyticsData>;
}

export interface MyLinkStoreState extends PersistedMyLinkState {
  _hasHydrated: boolean;
  storageRecovered: boolean;
  setHasHydrated: (hydrated: boolean, recovered?: boolean) => void;
  dismissStorageRecovered: () => void;
  recordVisit: (userId: string) => void;
  recordLinkClick: (linkId: string) => void;
  resetDemoData: () => void;
}

let detectedCorruptedStorage = false;
let shouldSeedStorageAfterHydration = false;

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
      } catch {
        // Ignore storage write errors in restricted contexts.
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
      _hasHydrated: false,
      storageRecovered: false,

      setHasHydrated: (hydrated, recovered = false) =>
        set((state) => ({
          _hasHydrated: hydrated,
          storageRecovered: recovered || state.storageRecovered,
        })),

      dismissStorageRecovered: () => set({ storageRecovered: false }),

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
          storageRecovered: false,
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
