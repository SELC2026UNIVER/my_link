"use client";

import { Check, Copy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { toast } from "sonner";
import { copyTextToClipboard } from "@/app/lib/clipboard";
import { SOCIAL_PLATFORM_LABELS } from "@/app/lib/icon-matcher";
import { getThemeTokens } from "@/app/lib/themes";
import type { LinkItem, SocialLink, UserProfile } from "@/app/lib/types";
import {
  formatDisplayUrl,
  isExternalHttpUrl,
  resolveSafeHref,
} from "@/app/lib/validators";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { LinkCard } from "./LinkCard";
import { LinkGlyph } from "./LinkGlyph";

interface PublicProfileViewProps {
  profile: UserProfile;
  socialLinks: SocialLink[];
  items: LinkItem[];
  isPreview?: boolean;
  onLinkClick?: (linkId: string) => void;
}

/**
 * 공개 프로필(/[username]) 화면을 렌더링하는 shadcn/ui + Tailwind CSS 기반 뷰.
 */
export function PublicProfileView({
  profile,
  socialLinks,
  items,
  isPreview = false,
  onLinkClick,
}: PublicProfileViewProps) {
  const [avatarErrorKey, setAvatarErrorKey] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [previewNotice, setPreviewNotice] = useState(false);

  const copyTimerRef = useRef<number | null>(null);
  const previewTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current !== null) {
        window.clearTimeout(copyTimerRef.current);
      }
      if (previewTimerRef.current !== null) {
        window.clearTimeout(previewTimerRef.current);
      }
    };
  }, []);

  const theme = getThemeTokens(profile.themePreset);

  const sortedSocials = [...socialLinks].sort((a, b) => a.order - b.order);
  const visibleItems = [...items]
    .filter((item) => item.deletedAt === null && item.isVisible)
    .sort((a, b) => a.order - b.order);

  const hasVisibleLinks = visibleItems.some((item) => item.kind === "link");
  const avatarLoadFailed =
    profile.avatarUrl !== null && avatarErrorKey === profile.avatarUrl;
  const shouldRenderAvatarImage =
    Boolean(profile.avatarUrl) && !avatarLoadFailed;
  const fallbackInitial =
    (profile.displayName.trim() || profile.username.trim() || "M")
      .charAt(0)
      .toUpperCase();

  const handleCopyProfileUrl = async () => {
    const shareUrl = window.location.href;
    const copied = await copyTextToClipboard(shareUrl);

    if (!copied) {
      toast.error("링크 복사에 실패했습니다. 다시 시도해 주세요.");
      return;
    }

    toast.success("공개 페이지 링크가 복사되었습니다", {
      description: shareUrl,
    });
    setCopiedUrl(true);
    if (copyTimerRef.current !== null) {
      window.clearTimeout(copyTimerRef.current);
    }
    copyTimerRef.current = window.setTimeout(() => {
      setCopiedUrl(false);
      copyTimerRef.current = null;
    }, 2000);
  };

  const triggerPreviewNotice = () => {
    setPreviewNotice(true);
    if (previewTimerRef.current !== null) {
      window.clearTimeout(previewTimerRef.current);
    }
    previewTimerRef.current = window.setTimeout(() => {
      setPreviewNotice(false);
      previewTimerRef.current = null;
    }, 2000);
  };

  const handleItemClick = (
    event: MouseEvent<HTMLAnchorElement>,
    item: LinkItem
  ) => {
    if (isPreview) {
      event.preventDefault();
      triggerPreviewNotice();
      return;
    }

    const safeHref = resolveSafeHref(item.url);
    if (safeHref === "#") {
      event.preventDefault();
      return;
    }

    onLinkClick?.(item.id);
  };

  const handleSocialClick = (
    event: MouseEvent<HTMLAnchorElement>,
    safeHref: string
  ) => {
    if (isPreview) {
      event.preventDefault();
      triggerPreviewNotice();
      return;
    }

    if (safeHref === "#") {
      event.preventDefault();
    }
  };

  const HeadingTag = isPreview ? "h2" : "h1";
  const isUnoptimizedAvatar =
    profile.avatarUrl?.startsWith("data:") ||
    profile.avatarUrl?.startsWith("blob:") ||
    profile.avatarUrl?.startsWith("http://") ||
    profile.avatarUrl?.startsWith("https://");

  return (
    <div className="flex min-h-dvh w-full flex-col">
      {/* 상단 프로필 타일 (Light/Dark 테마별 풀블리드) */}
      <section
        aria-label="프로필 정보"
        className={cn("w-full transition-colors duration-200", theme.topSurfaceClass)}
      >
        {!isPreview ? (
          <div className="mx-auto flex w-full max-w-[680px] items-center justify-between px-5 pt-5">
            <Link
              href="/"
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full px-2 text-[14px] font-normal tracking-[-0.016em] opacity-75 transition-opacity hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary-focus)]"
            >
              <span>MyLink</span>
            </Link>

            <Button
              type="button"
              variant="outline"
              size="sm"
              shape="pill"
              onClick={handleCopyProfileUrl}
              aria-live="polite"
              className={cn(
                "h-9 gap-1.5 px-3.5 text-[13px] font-normal tracking-[-0.016em] active:scale-95",
                theme.topUtilityPillClass
              )}
            >
              {copiedUrl ? (
                <>
                  <Check className="size-3.5" aria-hidden="true" />
                  <span>주소 복사됨</span>
                </>
              ) : (
                <>
                  <Copy className="size-3.5" aria-hidden="true" />
                  <span>페이지 공유</span>
                </>
              )}
            </Button>
          </div>
        ) : null}

        <div
          className={cn(
            "mx-auto max-w-[680px] px-5 text-center",
            isPreview ? "py-8" : "pt-6 pb-12 sm:pt-10 sm:pb-16"
          )}
        >
          <div
            className={cn(
              "mx-auto overflow-hidden rounded-full shadow-product",
              isPreview ? "size-[88px]" : "size-[120px]"
            )}
          >
            {shouldRenderAvatarImage && profile.avatarUrl ? (
              isUnoptimizedAvatar ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={profile.avatarUrl}
                  alt={`${profile.displayName} 프로필 아바타`}
                  referrerPolicy="no-referrer"
                  className="size-full object-cover object-center"
                  onError={() => setAvatarErrorKey(profile.avatarUrl)}
                />
              ) : (
                <Image
                  src={profile.avatarUrl}
                  alt={`${profile.displayName} 프로필 아바타`}
                  width={120}
                  height={120}
                  priority={!isPreview}
                  className="size-full object-cover object-center"
                  onError={() => setAvatarErrorKey(profile.avatarUrl)}
                />
              )
            ) : (
              <div
                aria-label={`${profile.displayName} 기본 아바타`}
                className={cn(
                  "flex size-full items-center justify-center font-semibold",
                  isPreview ? "text-[28px]" : "text-[36px]",
                  theme.avatarFallbackClass
                )}
              >
                {fallbackInitial}
              </div>
            )}
          </div>

          <HeadingTag
            className={cn(
              "mt-5 font-semibold tracking-[-0.024em]",
              isPreview
                ? "text-[24px] leading-[1.2]"
                : "text-[28px] leading-[1.16] sm:text-[34px]",
              theme.topTitleClass
            )}
          >
            {profile.displayName}
          </HeadingTag>

          <p
            className={cn(
              "mt-1 text-[15px] font-normal tracking-[-0.01em]",
              theme.topHandleClass
            )}
          >
            @{profile.username}
          </p>

          {profile.bio.trim() ? (
            <p
              className={cn(
                "mx-auto mt-4 max-w-[520px] whitespace-pre-line font-normal tracking-[-0.022em]",
                isPreview
                  ? "text-[15px] leading-[1.45]"
                  : "text-[17px] leading-[1.47]",
                theme.topBioClass
              )}
            >
              {profile.bio}
            </p>
          ) : null}

          {sortedSocials.length > 0 ? (
            <nav
              aria-label="소셜 미디어 링크"
              className="mt-6 flex flex-wrap items-center justify-center gap-2.5"
            >
              {sortedSocials.map((social) => {
                const safeHref = resolveSafeHref(social.url);
                const isExternal = isExternalHttpUrl(safeHref);
                const label = SOCIAL_PLATFORM_LABELS[social.platform];

                return (
                  <a
                    key={social.id}
                    href={safeHref}
                    target={isExternal && !isPreview ? "_blank" : undefined}
                    rel={
                      isExternal && !isPreview
                        ? "noopener noreferrer"
                        : undefined
                    }
                    aria-label={`${label} 바로가기`}
                    title={label}
                    onClick={(event) => handleSocialClick(event, safeHref)}
                    className={cn(
                      buttonVariants({
                        variant: "outline",
                        size: "icon",
                        shape: "pill",
                      }),
                      "size-11 active:scale-95",
                      theme.socialButtonClass
                    )}
                  >
                    <LinkGlyph icon={social.platform} className="size-[18px]" />
                  </a>
                );
              })}
            </nav>
          ) : null}
        </div>
      </section>

      {/* 하단 링크 목록 타일 (Apple 클래식 기준 Dark Tile #272729) */}
      <section
        aria-label="링크 목록"
        className={cn(
          "flex w-full flex-1 flex-col transition-colors duration-200",
          theme.bottomSurfaceClass
        )}
      >
        <div
          className={cn(
            "mx-auto flex w-full max-w-[680px] flex-1 flex-col px-5",
            isPreview ? "py-7" : "py-10 sm:py-14"
          )}
        >
          {isPreview && previewNotice ? (
            <div
              role="status"
              aria-live="polite"
              className="mb-4 rounded-full border border-[var(--color-primary-on-dark)]/40 bg-[var(--color-primary-on-dark)]/15 px-3.5 py-2 text-center text-[13px] font-normal text-white"
            >
              미리보기 모드입니다 (클릭 통계에 합산되지 않음)
            </div>
          ) : null}

          {!hasVisibleLinks && visibleItems.length === 0 ? (
            <div className="flex flex-1 items-center justify-center py-12 text-center">
              <p className={cn("type-body", theme.emptyTextClass)}>
                아직 등록된 링크가 없습니다
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {visibleItems.map((item) => {
                if (item.kind === "header") {
                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 pt-4 pb-1 first:pt-0"
                    >
                      <h2
                        className={cn(
                          "shrink-0 text-[13px] font-semibold leading-[1.3] tracking-[-0.01em]",
                          theme.headerTextClass
                        )}
                      >
                        {item.title}
                      </h2>
                      {item.showDivider !== false ? (
                        <Separator
                          aria-hidden="true"
                          className={cn(
                            "min-w-0 flex-1 data-horizontal:w-auto",
                            theme.headerLineClass
                          )}
                        />
                      ) : null}
                    </div>
                  );
                }

                return (
                  <LinkCard
                    key={item.id}
                    title={item.title}
                    url={item.url ?? ""}
                    subtitle={formatDisplayUrl(item.url)}
                    icon={item.icon ?? "link"}
                    buttonStyle={profile.buttonStyle}
                    styleTokens={theme}
                    isPreview={isPreview}
                    onClick={(event) => handleItemClick(event, item)}
                  />
                );
              })}
            </div>
          )}

          <footer
            className={cn(
              "mt-auto border-t text-center",
              isPreview ? "mt-8 pt-6" : "mt-12 pt-8",
              theme.footerBorderClass
            )}
          >
            <Link
              href="/"
              className={cn(
                "inline-flex min-h-[44px] items-center justify-center gap-1 rounded-full px-3 text-[15px] font-normal tracking-[-0.016em] focus-visible:outline-2 focus-visible:outline-offset-2",
                theme.footerLinkClass
              )}
            >
              <span>MyLink로 나만의 페이지 만들기</span>
              <span aria-hidden="true">›</span>
            </Link>
            <p className={cn("type-fine-print mt-1", theme.footerMetaClass)}>
              © 2026 MyLink · @{profile.username}
            </p>
          </footer>
        </div>
      </section>
    </div>
  );
}
