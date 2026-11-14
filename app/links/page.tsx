import type { Metadata } from "next";
import { ArrowLeft, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CopyPageUrlButton } from "./components/CopyPageUrlButton";
import { LinkCard } from "./components/LinkCard";
import { dummyLinks, linkListProfile } from "./links-data";

export const metadata: Metadata = {
  title: `${linkListProfile.name} | MyLink 링크 목록`,
  description:
    "제목, URL, 아이콘으로 정리된 홍길동의 MyLink 추천 링크 목록 페이지입니다.",
};

export default function LinksPage() {
  return (
    <div className="flex min-h-dvh w-full flex-col items-center justify-center bg-[#f2f4f6] px-4 py-10 text-[#191f28] sm:py-14">
      <main className="w-full max-w-[460px]">
        <div className="mb-4 flex items-center justify-between px-1">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[13px] font-medium text-[#4e5968] transition-colors hover:bg-black/[0.04] hover:text-[#191f28] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3182f6]"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            <span>프로필 홈</span>
          </Link>

          <Badge
            variant="secondary"
            className="h-6 gap-1 rounded-full bg-white px-2.5 text-[12px] font-semibold text-[#1b64da] shadow-[0_1px_4px_rgba(15,23,42,0.05)] ring-1 ring-black/[0.04]"
          >
            <Sparkles className="size-3" aria-hidden="true" />
            <span>MyLink</span>
          </Badge>
        </div>

        {/* TDS Profile Summary Card */}
        <Card className="gap-4 rounded-[24px] border border-black/[0.04] bg-white p-5 shadow-[0_4px_24px_rgba(15,23,42,0.05)] ring-0">
          <div className="flex items-center gap-3.5">
            <div className="relative size-14 shrink-0 overflow-hidden rounded-full bg-[#f2f4f6] ring-1 ring-black/[0.06]">
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
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                <h1 className="text-[20px] font-bold leading-tight tracking-[-0.03em] text-[#191f28]">
                  {linkListProfile.name}
                </h1>
                <span className="text-[13px] font-medium text-[#6b7684]">
                  {linkListProfile.handle}
                </span>
              </div>
              <p className="mt-1 text-[14px] leading-snug text-[#4e5968]">
                {linkListProfile.bio}
              </p>
            </div>
          </div>

          <Separator className="bg-[#f2f4f6]" />

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-[13px] font-medium text-[#4e5968]">
              <span
                aria-hidden="true"
                className="inline-block size-2 rounded-full bg-[#3182f6]"
              />
              <span>전체 링크 {dummyLinks.length}개</span>
            </div>

            <CopyPageUrlButton />
          </div>
        </Card>

        {/* TDS Link List Cards */}
        <section aria-label="마이링크 목록" className="mt-4">
          <ul className="flex flex-col gap-3">
            {dummyLinks.map((item) => (
              <li key={item.id}>
                <LinkCard item={item} />
              </li>
            ))}
          </ul>
        </section>

        <footer className="mt-8 text-center">
          <p className="text-[12px] font-medium text-[#6b7684]">
            © 2026 MyLink · {linkListProfile.name} ({linkListProfile.handle})
          </p>
        </footer>
      </main>
    </div>
  );
}
