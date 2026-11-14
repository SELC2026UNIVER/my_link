"use client";

import { ExternalLink, Smartphone } from "lucide-react";
import Link from "next/link";
import type { LinkItem, SocialLink, UserProfile } from "@/app/lib/types";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PublicProfileView } from "./PublicProfileView";

interface MobilePreviewFrameProps {
  profile: UserProfile;
  socialLinks: SocialLink[];
  items: LinkItem[];
}

/**
 * 대시보드 우측 및 모바일 [미리보기] 탭에서 공개 페이지를 실시간 미리보기로 표시하는 프레임.
 */
export function MobilePreviewFrame({
  profile,
  socialLinks,
  items,
}: MobilePreviewFrameProps) {
  return (
    <aside aria-label="실시간 모바일 미리보기" className="w-full">
      <div className="mb-3 flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5 text-[13px] font-semibold text-foreground">
          <Smartphone className="size-4 text-primary" aria-hidden="true" />
          <span>실시간 미리보기</span>
        </div>

        <Link
          href={`/${encodeURIComponent(profile.username)}`}
          className={cn(
            buttonVariants({ variant: "outline", size: "xs", shape: "pill" }),
            "h-7 gap-1 border-border bg-card px-2.5 text-[12px] font-normal text-primary hover:border-primary/40 hover:bg-[var(--color-surface-pearl)]"
          )}
        >
          <span>/{profile.username} 열기</span>
          <ExternalLink className="size-3" aria-hidden="true" />
        </Link>
      </div>

      <div className="mx-auto w-full max-w-[390px] rounded-[32px] border border-border bg-card p-2.5 shadow-product">
        <div className="flex items-center justify-between px-4 pb-2 pt-1 text-[11px] font-semibold text-muted-foreground">
          <span>9:41</span>
          <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-normal text-muted-foreground">
            @{profile.username}
          </span>
        </div>

        <div className="h-[620px] overflow-y-auto rounded-[24px] border border-border/70 bg-background">
          <PublicProfileView
            profile={profile}
            socialLinks={socialLinks}
            items={items}
            isPreview
          />
        </div>
      </div>

      <p className="mt-2.5 text-center text-[12px] text-muted-foreground">
        미리보기 내부 클릭은 통계에 합산되지 않습니다.
      </p>
    </aside>
  );
}
