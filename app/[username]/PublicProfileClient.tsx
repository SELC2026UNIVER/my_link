"use client";

import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/components/AuthProvider";
import { PublicProfileSkeleton } from "@/app/components/PublicProfileSkeleton";
import { PublicProfileView } from "@/app/components/PublicProfileView";
import { fetchUserLinks, type HomeLinkItem } from "@/app/lib/firestore-links";
import type { LinkItem, UserProfile } from "@/app/lib/types";
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

interface LiveLinksState {
  uid: string;
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
 * 로그인한 사용자의 공개 URL(`/{displayName}`) 또는 Zustand 시드 프로필(`/gildong`)을 조회하고
 * 리다이렉트·404·방문/클릭 통계를 처리한다.
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

  const [liveLinksState, setLiveLinksState] = useState<LiveLinksState | null>(
    null
  );
  const [liveLinksErrorUid, setLiveLinksErrorUid] = useState<string | null>(
    null
  );

  const { trimmed: requestedTrimmed, normalized: requestedNormalized } =
    decodeNormalizedUsername(rawUsername);

  const isOwnedAuthProfile =
    Boolean(authUser) &&
    Boolean(requestedNormalized) &&
    authUser!.displayName.toLowerCase() === requestedNormalized;

  const needsCanonicalRedirect =
    isOwnedAuthProfile && requestedTrimmed !== authUser!.displayName;

  useEffect(() => {
    if (!useMyLinkStore.persist.hasHydrated()) {
      void useMyLinkStore.persist.rehydrate();
    } else if (!useMyLinkStore.getState()._hasHydrated) {
      useMyLinkStore.getState().setHasHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!needsCanonicalRedirect || !authUser) return;
    router.replace(`/${encodeURIComponent(authUser.displayName)}`);
  }, [authUser, needsCanonicalRedirect, router]);

  useEffect(() => {
    if (!isOwnedAuthProfile || needsCanonicalRedirect || !authUser) {
      return;
    }

    let isCancelled = false;
    const targetUid = authUser.uid;

    async function loadOwnedLinks() {
      try {
        const fetched = await fetchUserLinks(targetUid);
        if (!isCancelled) {
          setLiveLinksState({ uid: targetUid, items: fetched });
          setLiveLinksErrorUid((prev) => (prev === targetUid ? null : prev));
        }
      } catch {
        if (!isCancelled) {
          setLiveLinksState({ uid: targetUid, items: [] });
          setLiveLinksErrorUid(targetUid);
        }
      }
    }

    void loadOwnedLinks();

    return () => {
      isCancelled = true;
    };
  }, [authUser, isOwnedAuthProfile, needsCanonicalRedirect]);

  const resolution =
    hasHydrated && !isOwnedAuthProfile
      ? resolveUsernameTarget({ profiles, usernameHistory }, rawUsername)
      : null;

  const targetRedirectUsername =
    resolution?.kind === "redirect" ? resolution.targetUsername : null;
  const activeProfile =
    resolution?.kind === "profile" ? resolution.profile : null;

  useEffect(() => {
    if (!targetRedirectUsername) return;
    router.replace(`/${encodeURIComponent(targetRedirectUsername)}`);
  }, [router, targetRedirectUsername]);

  useEffect(() => {
    if (isOwnedAuthProfile && authUser && !needsCanonicalRedirect) {
      document.title = `${authUser.displayName} (@${authUser.displayName}) | MyLink`;
      return;
    }
    if (!activeProfile) return;
    document.title = `${activeProfile.displayName} (@${activeProfile.username}) | MyLink`;
    recordVisit(activeProfile.id);
  }, [activeProfile, authUser, isOwnedAuthProfile, needsCanonicalRedirect, recordVisit]);

  if (isAuthLoading) {
    return <PublicProfileSkeleton />;
  }

  if (isOwnedAuthProfile && authUser) {
    if (
      needsCanonicalRedirect ||
      (liveLinksState?.uid !== authUser.uid && liveLinksErrorUid !== authUser.uid)
    ) {
      return <PublicProfileSkeleton />;
    }

    const nowIso = new Date().toISOString();
    const ownedProfile: UserProfile = {
      id: authUser.uid,
      email: authUser.email ?? "",
      username: authUser.displayName,
      displayName: authUser.googleDisplayName || `@${authUser.displayName}`,
      bio: `@${authUser.displayName}님의 MyLink 공개 프로필 페이지입니다.`,
      avatarUrl: authUser.photoURL,
      themePreset: "apple-classic",
      buttonStyle: "card",
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    const ownedItems: LinkItem[] = (liveLinksState?.items ?? []).map(
      (item, index) => ({
        id: item.id,
        userId: authUser.uid,
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
          profile={ownedProfile}
          socialLinks={[]}
          items={ownedItems}
        />
      </main>
    );
  }

  if (!hasHydrated || resolution === null || resolution.kind === "redirect") {
    return <PublicProfileSkeleton />;
  }

  if (resolution.kind === "not-found") {
    return (
      <main className="flex min-h-dvh w-full flex-col items-center justify-center bg-secondary px-4 py-12 text-foreground">
        <Card className="w-full max-w-[460px] gap-5 rounded-[18px] border border-border bg-card p-8 text-center shadow-none ring-0">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-secondary text-muted-foreground">
            <AlertTriangle className="size-5" aria-hidden="true" />
          </div>

          <div>
            <h1 className="type-display-md text-[24px] sm:text-[28px] text-foreground">
              페이지를 찾을 수 없습니다
            </h1>
            <p className="mt-2.5 text-[15px] font-normal leading-[1.5] text-muted-foreground">
              요청하신 마이링크 페이지
              {resolution.requestedUsername
                ? `(@${resolution.requestedUsername})`
                : ""}
              가 존재하지 않습니다.
            </p>
          </div>

          <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className={cn(
                buttonVariants({ variant: "default", size: "lg", shape: "pill" }),
                "min-h-[44px] px-5 text-[15px] font-normal active:scale-95"
              )}
            >
              홈으로 가기
            </Link>
            <Link
              href="/gildong"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg", shape: "pill" }),
                "min-h-[44px] border-primary px-5 text-[15px] font-normal text-primary hover:bg-primary/5 hover:text-primary active:scale-95"
              )}
            >
              예시 보기 (/gildong)
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
