import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CopyPageUrlButton } from "./components/CopyPageUrlButton";
import { LinkCard } from "./components/LinkCard";
import { dummyLinks, linkListProfile } from "./links-data";

export const metadata: Metadata = {
  title: `${linkListProfile.name} | MyLink 링크 목록`,
  description:
    "제목, URL, 아이콘으로 정리된 홍길동의 MyLink Apple 스타일 링크 목록 페이지입니다.",
};

export default function LinksPage() {
  return (
    <div className="flex min-h-dvh w-full flex-col items-center justify-center bg-secondary px-4 py-10 text-foreground sm:py-16">
      <main className="w-full max-w-[460px]">
        <div className="mb-4 flex items-center justify-between px-1">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[14px] font-normal tracking-[-0.016em] text-muted-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            <span>프로필 홈</span>
          </Link>

          <Link
            href="/gildong"
            className="inline-flex h-7 items-center rounded-full border border-border bg-card px-2.5 text-[12px] font-semibold tracking-[-0.01em] text-primary transition-colors hover:border-primary/40 hover:bg-[var(--color-surface-pearl)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            /gildong 공개 뷰 ›
          </Link>
        </div>

        {/* Apple 유틸리티 카드 (18px 둥근 모서리 · 헤어라인 보더 · 아바타에만 shadow-product 적용) */}
        <Card className="gap-4 rounded-[18px] border border-border bg-card p-6 shadow-none ring-0">
          <div className="flex items-center gap-4">
            <div className="relative size-14 shrink-0 overflow-hidden rounded-full bg-secondary shadow-product">
              <Image
                src={linkListProfile.avatar}
                alt={linkListProfile.avatarAlt}
                width={56}
                height={56}
                priority
                placeholder="blur"
                className="size-14 object-cover object-center"
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <h1 className="text-[21px] font-semibold leading-[1.19] tracking-[-0.02em] text-foreground">
                  {linkListProfile.name}
                </h1>
                <span className="text-[14px] font-normal text-muted-foreground">
                  {linkListProfile.handle}
                </span>
              </div>
              <p className="mt-1.5 text-[14px] font-normal leading-[1.45] tracking-[-0.016em] text-muted-foreground">
                {linkListProfile.bio}
              </p>
            </div>
          </div>

          <Separator className="bg-border/70" />

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-[14px] font-normal tracking-[-0.016em] text-muted-foreground">
              <span
                aria-hidden="true"
                className="inline-block size-1.5 rounded-full bg-primary"
              />
              <span>전체 링크 {dummyLinks.length}개</span>
            </div>

            <CopyPageUrlButton />
          </div>
        </Card>

        {/* 링크 목록 */}
        <section aria-label="마이링크 목록" className="mt-3">
          <ul className="flex flex-col gap-3">
            {dummyLinks.map((item) => (
              <li key={item.id}>
                <LinkCard item={item} />
              </li>
            ))}
          </ul>
        </section>

        <footer className="mt-8 text-center">
          <p className="type-fine-print text-muted-foreground">
            © 2026 MyLink · {linkListProfile.name} ({linkListProfile.handle})
          </p>
        </footer>
      </main>
    </div>
  );
}
