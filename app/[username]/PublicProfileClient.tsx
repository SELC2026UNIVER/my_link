"use client";

import { AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/components/AuthProvider";
import { PublicProfileSkeleton } from "@/app/components/PublicProfileSkeleton";
import { PublicProfileView } from "@/app/components/PublicProfileView";
import { fetchUserLinks, type HomeLinkItem } from "@/app/lib/firestore-links";
import {
  DEFAULT_USER_BIO,
  fetchPublicProfileByUsername,
  type UserProfileDoc,
} from "@/app/lib/firestore-profile";
import type { LinkItem, UserProfile } from "@/app/lib/types";
import { validateUsernameFormat } from "@/app/lib/validators";
import {
  resolveUsernameTarget,
  useMyLinkStore,
} from "@/app/stores/useMyLinkStore";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PublicProfileClientProps {
  rawUsername: string;
}

interface FirestorePublicLookupState {
  requestedUsername: string;
  status: "found" | "not-found";
  profileDoc: UserProfileDoc | null;
  items: HomeLinkItem[];
}

function decodeNormalizedUsername(raw: string): {
  trimmed: string;
  normalized: string;
} {
  let decoded = raw;
  try {
    decoded = decodeURIComponent(raw);
  } catch {
    decoded = raw;
  }
  const trimmed = decoded.trim();
  return { trimmed, normalized: trimmed.toLowerCase() };
}

/**
 * 비로그인 방문자를 포함한 모든 사용자에게 `/[username]` 공개 프로필 및
 * 등록된 링크 목록(`users/{uid}/links`)을 읽기 전용(Read-Only) 카드 목록으로 표시한다.
 * 존재하지 않는 `username`인 경우 404 안내 화면을 렌더링한다.
 */
export function PublicProfileClient({ rawUsername }: PublicProfileClientProps) {
  const router = useRouter();
  const { user: authUser, isLoading: isAuthLoading } = useAuth();

  const hasHydrated = useMyLinkStore((state) => state._hasHydrated);
  const profiles = useMyLinkStore((state) => state.profiles);
  const socialLinks = useMyLinkStore((state) => state.socialLinks);
  const links = useMyLinkStore((state) => state.links);
  const usernameHistory = useMyLinkStore((state) => state.usernameHistory);
  const storageRecovered = useMyLinkStore((state) => state.storageRecovered);
  const dismissStorageRecovered = useMyLinkStore(
    (state) => state.dismissStorageRecovered
  );
  const recordVisit = useMyLinkStore((state) => state.recordVisit);
  const recordLinkClick = useMyLinkStore((state) => state.recordLinkClick);

  const [lookupState, setLookupState] =
    useState<FirestorePublicLookupState | null>(null);

  const { trimmed: requestedTrimmed, normalized: requestedNormalized } =
    decodeNormalizedUsername(rawUsername);

  const isFormatValid = validateUsernameFormat(requestedNormalized).valid;
  const needsCanonicalLowerRedirect =
    isFormatValid && requestedTrimmed !== requestedNormalized;

  const isOwnedAuthProfile =
    Boolean(authUser) &&
    Boolean(requestedNormalized) &&
    authUser!.displayName.toLowerCase() === requestedNormalized;

  useEffect(() => {
    if (!useMyLinkStore.persist.hasHydrated()) {
      void useMyLinkStore.persist.rehydrate();
    } else if (!useMyLinkStore.getState()._hasHydrated) {
      useMyLinkStore.getState().setHasHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!needsCanonicalLowerRedirect) return;
    router.replace(`/${encodeURIComponent(requestedNormalized)}`);
  }, [needsCanonicalLowerRedirect, requestedNormalized, router]);

  useEffect(() => {
    if (needsCanonicalLowerRedirect || !requestedNormalized) {
      return;
    }

    let isCancelled = false;
    const targetUsername = requestedNormalized;

    async function loadFirestorePublicProfile() {
      if (!validateUsernameFormat(targetUsername).valid) {
        if (!isCancelled) {
          setLookupState({
            requestedUsername: targetUsername,
            status: "not-found",
            profileDoc: null,
            items: [],
          });
        }
        return;
      }

      try {
        const fetchedProfile =
          await fetchPublicProfileByUsername(targetUsername);

        if (fetchedProfile) {
          const fetchedItems = await fetchUserLinks(fetchedProfile.uid).catch(
            () => []
          );
          if (!isCancelled) {
            setLookupState({
              requestedUsername: targetUsername,
              status: "found",
              profileDoc: fetchedProfile,
              items: fetchedItems,
            });
          }
          return;
        }

        // 로그인한 본인의 공개 페이지인데 아직 프로필 문서 색인이 반영되기 전인 경우 본인 UID로 폴백 조회
        if (
          authUser &&
          authUser.displayName.toLowerCase() === targetUsername
        ) {
          const fallbackItems = await fetchUserLinks(authUser.uid).catch(
            () => []
          );
          if (!isCancelled) {
            setLookupState({
              requestedUsername: targetUsername,
              status: "found",
              profileDoc: {
                uid: authUser.uid,
                username: authUser.displayName,
                bio: authUser.bio || DEFAULT_USER_BIO,
                name: authUser.googleDisplayName,
                email: authUser.email,
                photoURL: authUser.photoURL,
              },
              items: fallbackItems,
            });
          }
          return;
        }

        if (!isCancelled) {
          setLookupState({
            requestedUsername: targetUsername,
            status: "not-found",
            profileDoc: null,
            items: [],
          });
        }
      } catch {
        if (
          authUser &&
          authUser.displayName.toLowerCase() === targetUsername
        ) {
          const fallbackItems = await fetchUserLinks(authUser.uid).catch(
            () => []
          );
          if (!isCancelled) {
            setLookupState({
              requestedUsername: targetUsername,
              status: "found",
              profileDoc: {
                uid: authUser.uid,
                username: authUser.displayName,
                bio: authUser.bio || DEFAULT_USER_BIO,
                name: authUser.googleDisplayName,
                email: authUser.email,
                photoURL: authUser.photoURL,
              },
              items: fallbackItems,
            });
          }
          return;
        }

        if (!isCancelled) {
          setLookupState({
            requestedUsername: targetUsername,
            status: "not-found",
            profileDoc: null,
            items: [],
          });
        }
      }
    }

    void loadFirestorePublicProfile();

    return () => {
      isCancelled = true;
    };
  }, [authUser, needsCanonicalLowerRedirect, requestedNormalized]);

  const isFirestoreLookupPending =
    Boolean(requestedNormalized) &&
    !needsCanonicalLowerRedirect &&
    lookupState?.requestedUsername !== requestedNormalized;

  const matchedFirestoreProfile =
    lookupState?.requestedUsername === requestedNormalized &&
    lookupState.status === "found"
      ? lookupState.profileDoc
      : null;

  const resolution =
    hasHydrated && !matchedFirestoreProfile && !isFirestoreLookupPending
      ? resolveUsernameTarget({ profiles, usernameHistory }, rawUsername)
      : null;

  const targetRedirectUsername =
    resolution?.kind === "redirect" ? resolution.targetUsername : null;
  const activeSeedProfile =
    resolution?.kind === "profile" ? resolution.profile : null;

  useEffect(() => {
    if (!targetRedirectUsername) return;
    router.replace(`/${encodeURIComponent(targetRedirectUsername)}`);
  }, [router, targetRedirectUsername]);

  useEffect(() => {
    if (matchedFirestoreProfile) {
      const titleName =
        matchedFirestoreProfile.name || matchedFirestoreProfile.username;
      document.title = `${titleName} (@${matchedFirestoreProfile.username}) | MyLink`;
      return;
    }
    if (!activeSeedProfile) return;
    document.title = `${activeSeedProfile.displayName} (@${activeSeedProfile.username}) | MyLink`;
    recordVisit(activeSeedProfile.id);
  }, [activeSeedProfile, matchedFirestoreProfile, recordVisit]);

  if (
    needsCanonicalLowerRedirect ||
    isFirestoreLookupPending ||
    (isAuthLoading && isOwnedAuthProfile)
  ) {
    return <PublicProfileSkeleton />;
  }

  if (matchedFirestoreProfile) {
    const nowIso = new Date().toISOString();
    const resolvedUsername = isOwnedAuthProfile && authUser
      ? authUser.displayName
      : matchedFirestoreProfile.username;
    const resolvedBio = isOwnedAuthProfile && authUser
      ? authUser.bio
      : matchedFirestoreProfile.bio;

    const publicProfile: UserProfile = {
      id: matchedFirestoreProfile.uid,
      email: matchedFirestoreProfile.email ?? "",
      username: resolvedUsername,
      displayName: matchedFirestoreProfile.name || resolvedUsername,
      bio: resolvedBio,
      avatarUrl: matchedFirestoreProfile.photoURL,
      themePreset: "apple-classic",
      buttonStyle: "card",
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    const publicItems: LinkItem[] = (lookupState?.items ?? []).map(
      (item, index) => ({
        id: item.id,
        userId: matchedFirestoreProfile.uid,
        kind: "link",
        title: item.title,
        url: item.url,
        icon: item.icon,
        order: index,
        clickCount: 0,
        isVisible: true,
        deletedAt: null,
        createdAt: nowIso,
        updatedAt: nowIso,
      })
    );

    return (
      <main className="flex min-h-dvh w-full flex-col">
        <PublicProfileView
          profile={publicProfile}
          socialLinks={[]}
          items={publicItems}
        />
      </main>
    );
  }

  if (!hasHydrated || resolution === null || resolution.kind === "redirect") {
    return <PublicProfileSkeleton />;
  }

  if (resolution.kind === "not-found") {
    return (
      <main className="flex min-h-dvh w-full flex-col items-center justify-center bg-[#f5f5f7] px-4 py-12 text-[#1d1d1f]">
        <Card className="w-full max-w-[460px] gap-5 rounded-[22px] border border-black/[0.08] bg-card p-8 text-center shadow-[0_8px_28px_rgba(0,0,0,0.06)] ring-0 sm:p-10">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full border border-black/[0.06] bg-[#e8e8ed] text-[#515154]">
            <AlertTriangle className="size-5" aria-hidden="true" />
          </div>

          <div>
            <p className="text-[12px] font-semibold tracking-[0.06em] text-[#86868b] uppercase">
              404 Not Found
            </p>
            <h1 className="type-display-md mt-1 text-[24px] text-[#1d1d1f] sm:text-[28px]">
              페이지를 찾을 수 없습니다
            </h1>
            <p className="mt-2.5 text-[15px] font-normal leading-[1.5] text-[#6e6e73]">
              요청하신 공개 페이지
              {requestedTrimmed ? (
                <span className="font-medium text-[#1d1d1f]">
                  {" "}
                  (@{requestedTrimmed})
                </span>
              ) : null}
              를 찾을 수 없습니다. 주소를 다시 확인해 주세요.
            </p>
          </div>

          <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className={cn(
                buttonVariants({ variant: "default", size: "lg", shape: "pill" }),
                "min-h-[44px] gap-1.5 bg-[#1d1d1f] px-5 text-[15px] font-normal text-white hover:bg-[#333336] active:scale-95"
              )}
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              <span>홈으로 가기</span>
            </Link>
            <Link
              href="/gildong"
              className={cn(
                buttonVariants({
                  variant: "secondary",
                  size: "lg",
                  shape: "pill",
                }),
                "min-h-[44px] border border-black/[0.08] bg-[#e8e8ed] px-5 text-[15px] font-normal text-[#1d1d1f] hover:bg-[#dcdce1] active:scale-95"
              )}
            >
              예시 프로필 보기 (/gildong)
            </Link>
          </div>
        </Card>
      </main>
    );
  }

  const profile = resolution.profile;
  const profileSocials = socialLinks.filter(
    (item) => item.userId === profile.id
  );
  const profileLinks = links.filter((item) => item.userId === profile.id);

  return (
    <main className="flex min-h-dvh w-full flex-col">
      {storageRecovered ? (
        <div
          role="status"
          aria-live="polite"
          className="border-b border-border bg-secondary px-4 py-2.5 text-center text-[13px] text-foreground"
        >
          <span>
            저장된 브라우저 데이터가 손상되어 기본 데모 데이터(/gildong)로 안전하게 초기화했습니다.
          </span>
          <button
            type="button"
            onClick={dismissStorageRecovered}
            className="ml-3 font-semibold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            확인
          </button>
        </div>
      ) : null}

      <PublicProfileView
        profile={profile}
        socialLinks={profileSocials}
        items={profileLinks}
        onLinkClick={recordLinkClick}
      />
    </main>
  );
}
