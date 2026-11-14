"use client";

import {
  CheckCircle2,
  ExternalLink,
  Layers,
  Link2,
  Plus,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { LinkItem } from "@/app/lib/types";
import {
  formatDisplayUrl,
  MAX_ACTIVE_ITEMS,
} from "@/app/lib/validators";
import { useMyLinkStore } from "@/app/stores/useMyLinkStore";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { AddLinkDialog } from "./AddLinkDialog";
import { LinkCard } from "./LinkCard";
import { MobilePreviewFrame } from "./MobilePreviewFrame";

function AdminDashboardSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="대시보드를 불러오는 중입니다"
      className="min-h-dvh w-full bg-secondary text-foreground"
    >
      <div className="h-14 w-full border-b border-border bg-card" />
      <div className="mx-auto grid max-w-[1120px] gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_390px]">
        <div className="flex flex-col gap-4">
          <div className="h-24 w-full animate-pulse rounded-[18px] border border-border bg-card" />
          <div className="h-96 w-full animate-pulse rounded-[18px] border border-border bg-card" />
        </div>
        <div className="hidden h-[660px] w-full animate-pulse rounded-[32px] border border-border bg-card lg:block" />
      </div>
    </div>
  );
}

/**
 * PRD 기준 대시보드(/admin) 클라이언트.
 * 좌측 링크 목록 관리(+ 링크 추가 다이얼로그)와 우측 실시간 모바일 목업 프리뷰를 제공한다.
 */
export function AdminDashboardClient() {
  const hasHydrated = useMyLinkStore((state) => state._hasHydrated);
  const profiles = useMyLinkStore((state) => state.profiles);
  const socialLinks = useMyLinkStore((state) => state.socialLinks);
  const links = useMyLinkStore((state) => state.links);
  const currentUserId = useMyLinkStore((state) => state.currentUserId);
  const storageRecovered = useMyLinkStore((state) => state.storageRecovered);
  const ensureDemoSession = useMyLinkStore((state) => state.ensureDemoSession);
  const dismissStorageRecovered = useMyLinkStore(
    (state) => state.dismissStorageRecovered
  );

  const [dialogOpen, setDialogOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<"edit" | "preview">("edit");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!useMyLinkStore.persist.hasHydrated()) {
      void useMyLinkStore.persist.rehydrate();
    } else if (!useMyLinkStore.getState()._hasHydrated) {
      useMyLinkStore.getState().setHasHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;
    ensureDemoSession();
  }, [hasHydrated, ensureDemoSession]);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current !== null) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToastMessage(null);
      toastTimerRef.current = null;
    }, 3500);
  };

  if (!hasHydrated) {
    return <AdminDashboardSkeleton />;
  }

  const activeProfile =
    profiles.find((profile) => profile.id === currentUserId) ??
    profiles[0] ??
    null;

  if (!activeProfile) {
    return <AdminDashboardSkeleton />;
  }

  const profileSocials = socialLinks.filter(
    (item) => item.userId === activeProfile.id
  );
  const profileItems = links.filter((item) => item.userId === activeProfile.id);
  const activeItems = [...profileItems]
    .filter((item) => item.deletedAt === null)
    .sort((a, b) => a.order - b.order);

  const activeLinkItems = activeItems.filter((item) => item.kind === "link");
  const isAtItemLimit = activeItems.length >= MAX_ACTIVE_ITEMS;
  const fallbackInitial =
    (activeProfile.displayName.trim() || activeProfile.username.trim() || "M")
      .charAt(0)
      .toUpperCase();

  const handleLinkAdded = (addedItem: LinkItem) => {
    showToast(`링크가 추가되었습니다 (${addedItem.title})`);
  };

  const editorContent = (
    <div className="flex flex-col gap-5">
      {/* 현재 편집 중인 데모/사용자 프로필 요약 카드 */}
      <Card className="gap-4 rounded-[18px] border border-border bg-card p-5 shadow-none ring-0 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3.5">
            <div className="relative size-14 shrink-0 overflow-hidden rounded-full bg-secondary shadow-product">
              {activeProfile.avatarUrl ? (
                <Image
                  src={activeProfile.avatarUrl}
                  alt={`${activeProfile.displayName} 아바타`}
                  width={56}
                  height={56}
                  className="size-14 object-cover object-center"
                />
              ) : (
                <div className="flex size-full items-center justify-center bg-foreground text-[20px] font-semibold text-card">
                  {fallbackInitial}
                </div>
              )}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="truncate text-[19px] font-semibold tracking-[-0.02em] text-foreground">
                  {activeProfile.displayName}
                </h1>
                <Badge
                  variant="secondary"
                  className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-normal text-muted-foreground"
                >
                  @{activeProfile.username} · 데모 세션
                </Badge>
              </div>
              <p className="mt-1 line-clamp-2 text-[14px] leading-[1.45] text-muted-foreground">
                {activeProfile.bio || "소개가 아직 등록되지 않았습니다."}
              </p>
            </div>
          </div>

          <Link
            href={`/${encodeURIComponent(activeProfile.username)}`}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm", shape: "pill" }),
              "min-h-10 gap-1.5 border-primary/40 px-4 text-[13px] font-normal text-primary hover:bg-primary/5 hover:text-primary"
            )}
          >
            <span>내 공개 페이지 보기</span>
            <ExternalLink className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
      </Card>

      {/* 링크 목록 관리 카드 */}
      <Card className="gap-4 rounded-[18px] border border-border bg-card p-5 shadow-none ring-0 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[19px] font-semibold tracking-[-0.02em] text-foreground">
                링크 목록
              </h2>
              <Badge
                variant="secondary"
                className="rounded-full bg-secondary px-2.5 py-0.5 text-[12px] font-normal text-muted-foreground tabular-nums"
              >
                링크 {activeLinkItems.length}개 · 전체 {activeItems.length}/
                {MAX_ACTIVE_ITEMS}
              </Badge>
            </div>
            <p className="mt-1 text-[13px] text-muted-foreground">
              추가한 링크는 브라우저 로컬 저장소(useMyLinkStore)에 저장되며 미리보기와 /{activeProfile.username}에 즉시 반영됩니다.
            </p>
          </div>

          <Button
            type="button"
            variant="default"
            shape="pill"
            disabled={isAtItemLimit}
            onClick={() => setDialogOpen(true)}
            className="min-h-11 gap-1.5 px-5 text-[14px] font-normal active:scale-95"
          >
            <Plus className="size-4" aria-hidden="true" />
            <span>링크 추가</span>
          </Button>
        </div>

        {isAtItemLimit ? (
          <p
            role="status"
            className="rounded-[10px] border border-destructive/30 bg-destructive/5 px-3.5 py-2.5 text-[13px] text-destructive"
          >
            항목은 최대 {MAX_ACTIVE_ITEMS}개까지 등록할 수 있습니다
          </p>
        ) : null}

        <Separator className="bg-border/70" />

        {activeItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[14px] border border-dashed border-border bg-secondary/40 px-6 py-12 text-center">
            <div className="flex size-11 items-center justify-center rounded-full bg-card text-muted-foreground shadow-xs">
              <Link2 className="size-5" aria-hidden="true" />
            </div>
            <p className="mt-3 text-[16px] font-semibold text-foreground">
              첫 링크를 추가해 보세요
            </p>
            <p className="mt-1 text-[13px] text-muted-foreground">
              상단 &lsquo;+ 링크 추가&rsquo; 버튼을 눌러 나만의 링크 목록을 만들어 보세요.
            </p>
            <Button
              type="button"
              variant="default"
              shape="pill"
              onClick={() => setDialogOpen(true)}
              className="mt-4 min-h-11 gap-1.5 px-5 text-[14px] font-normal active:scale-95"
            >
              <Plus className="size-4" aria-hidden="true" />
              <span>링크 추가</span>
            </Button>
          </div>
        ) : (
          <ul className="flex flex-col gap-3" aria-label="등록된 링크 및 섹션 목록">
            {activeItems.map((item) => {
              if (item.kind === "header") {
                return (
                  <li
                    key={item.id}
                    className="flex items-center gap-2.5 rounded-[12px] border border-border/80 bg-secondary/70 px-3.5 py-2.5"
                  >
                    <Layers
                      className="size-4 shrink-0 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <span className="text-[12px] font-semibold text-muted-foreground">
                      섹션 헤더
                    </span>
                    <span className="truncate text-[14px] font-semibold text-foreground">
                      {item.title}
                    </span>
                  </li>
                );
              }

              return (
                <li key={item.id}>
                  <LinkCard
                    title={item.title}
                    url={item.url ?? ""}
                    subtitle={formatDisplayUrl(item.url)}
                    icon={item.icon ?? "link"}
                    category={`클릭 ${item.clickCount}`}
                    buttonStyle="card"
                  />
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );

  return (
    <div className="min-h-dvh w-full bg-secondary text-foreground">
      {/* 상단 유틸리티 바 */}
      <header className="sticky top-0 z-30 border-b border-border bg-card/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[1120px] items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-2.5">
            <Link
              href="/"
              className="text-[16px] font-semibold tracking-[-0.02em] text-foreground hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              MyLink Admin
            </Link>
            <span className="hidden text-muted-foreground/50 sm:inline">/</span>
            <Link
              href={`/${encodeURIComponent(activeProfile.username)}`}
              className="hidden items-center gap-1 truncate text-[13px] text-primary hover:underline sm:inline-flex"
            >
              <span>/{activeProfile.username}</span>
              <ExternalLink className="size-3" aria-hidden="true" />
            </Link>
          </div>

          <nav
            aria-label="대시보드 보조 메뉴"
            className="flex shrink-0 items-center gap-2"
          >
            <Link
              href="/links"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm", shape: "pill" }),
                "min-h-9 px-3 text-[13px] font-normal text-muted-foreground hover:text-foreground"
              )}
            >
              링크 목록
            </Link>
            <Link
              href={`/${encodeURIComponent(activeProfile.username)}`}
              className={cn(
                buttonVariants({ variant: "outline", size: "sm", shape: "pill" }),
                "min-h-9 border-border bg-card px-3 text-[13px] font-normal text-primary hover:border-primary/40 hover:bg-[var(--color-surface-pearl)]"
              )}
            >
              공개 페이지
            </Link>
          </nav>
        </div>
      </header>

      {storageRecovered ? (
        <div
          role="status"
          aria-live="polite"
          className="border-b border-border bg-card px-4 py-2.5 text-center text-[13px] text-foreground"
        >
          <span>
            저장된 브라우저 데이터가 손상되어 기본 데모 데이터(/gildong)로 안전하게 복구했습니다.
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

      <main className="mx-auto max-w-[1120px] px-4 py-6 sm:px-6 sm:py-8">
        {/* 모바일 뷰 (<= 1023px): [편집 | 미리보기] 탭 전환 */}
        <div className="lg:hidden">
          <Tabs
            value={mobileTab}
            onValueChange={(value) => {
              if (value === "edit" || value === "preview") {
                setMobileTab(value);
              }
            }}
            className="gap-5"
          >
            <TabsList className="grid h-11 w-full grid-cols-2 rounded-full border border-border bg-card p-1 group-data-horizontal/tabs:h-11">
              <TabsTrigger
                value="edit"
                className="h-full rounded-full text-[14px] font-medium data-active:bg-primary data-active:text-primary-foreground data-active:shadow-none"
              >
                편집
              </TabsTrigger>
              <TabsTrigger
                value="preview"
                className="h-full rounded-full text-[14px] font-medium data-active:bg-primary data-active:text-primary-foreground data-active:shadow-none"
              >
                미리보기
              </TabsTrigger>
            </TabsList>

            <TabsContent value="edit">{editorContent}</TabsContent>
            <TabsContent value="preview">
              <MobilePreviewFrame
                profile={activeProfile}
                socialLinks={profileSocials}
                items={profileItems}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* PC 뷰 (>= 1024px): 좌측 편집 + 우측 실시간 모바일 목업 2단 분할 */}
        <div className="hidden lg:grid lg:grid-cols-[minmax(0,1fr)_390px] lg:items-start lg:gap-8">
          <section aria-label="링크 편집 영역">{editorContent}</section>

          <div className="sticky top-20">
            <MobilePreviewFrame
              profile={activeProfile}
              socialLinks={profileSocials}
              items={profileItems}
            />
          </div>
        </div>
      </main>

      <AddLinkDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        userId={activeProfile.id}
        activeItemCount={activeItems.length}
        onAdded={handleLinkAdded}
      />

      {toastMessage ? (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2.5 rounded-full bg-foreground px-4 py-2.5 text-[13px] font-normal text-background shadow-product"
        >
          <CheckCircle2
            className="size-4 shrink-0 text-[var(--color-primary-on-dark)]"
            aria-hidden="true"
          />
          <span className="whitespace-nowrap">{toastMessage}</span>
          <button
            type="button"
            aria-label="알림 닫기"
            onClick={() => setToastMessage(null)}
            className="ml-1 inline-flex size-6 items-center justify-center rounded-full text-background/70 transition-colors hover:bg-background/10 hover:text-background"
          >
            <X className="size-3.5" aria-hidden="true" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
