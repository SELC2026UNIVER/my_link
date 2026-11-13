import Image from "next/image";
import type { ReactNode } from "react";
import BeginnerChecklist from "@/app/components/BeginnerChecklist";
import CopyEmailButton from "@/app/components/CopyEmailButton";
import ProfileShowcase from "@/app/components/ProfileShowcase";
import {
  beginnerMilestones,
  contactLinks,
  deskHighlight,
  initialChecklist,
  learningStack,
  practiceProjects,
  profile,
  studyLog,
} from "@/app/profile-data";

const linkIcons: Record<string, ReactNode> = {
  github: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a10.9 10.9 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.39-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  ),
  blog: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  ),
  contact: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 6L2 7" />
    </svg>
  ),
};

export default function Home() {
  // 좌측 컬럼: 오늘의 공부 기록 (TIL) + 배우는 중인 기술
  const leftColumnCard = (
    <>
      <section
        aria-labelledby="til-heading"
        className="relative rounded-2xl border-[3px] border-[#161616] bg-[#FFFDF7] p-5 shadow-[6px_6px_0px_#161616] sm:p-6"
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b-[2.5px] border-dashed border-[#161616]/30 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="-rotate-2 rounded-lg border-2 border-[#161616] bg-[#E67E66] px-2.5 py-0.5 font-mono text-[11px] font-bold text-[#161616] shadow-[2px_2px_0px_#161616]">
              {studyLog.badge}
            </span>
            <h2
              id="til-heading"
              className="text-lg font-black tracking-tight text-[#161616]"
            >
              {studyLog.title}
            </h2>
          </div>
          <span className="font-mono text-xs font-semibold text-[#161616]/70">
            {studyLog.date}
          </span>
        </div>

        <div className="space-y-3">
          {studyLog.entries.map((entry) => (
            <div
              key={entry.topic}
              className="rounded-xl border-2 border-[#161616] bg-[#EFE6D5] p-3.5"
            >
              <span
                className={`inline-block rounded-md border-2 border-[#161616] px-2 py-0.5 font-mono text-[11px] font-bold text-[#161616] ${entry.badgeBg}`}
              >
                {entry.topic}
              </span>
              <p className="mt-2 text-sm leading-relaxed font-medium text-[#161616] break-keep">
                {entry.text}
              </p>
            </div>
          ))}
        </div>

        {/* 노란 메모지 스티커 */}
        <div className="mt-4 -rotate-[0.5deg] rounded-xl border-2 border-[#161616] bg-[#F2C14E] p-3.5 shadow-[4px_4px_0px_#161616]">
          <div className="font-mono text-[10px] font-bold tracking-wider text-[#161616] uppercase">
            ★ 오늘의 한 줄 메모
          </div>
          <p className="mt-1 text-sm font-bold leading-snug text-[#161616] break-keep">
            &ldquo;{studyLog.dailyMemo}&rdquo;
          </p>
        </div>
      </section>

      {/* 배우고 있는 기술 스택 스티커 카드 */}
      <section
        aria-labelledby="learning-stack-heading"
        className="rounded-2xl border-[3px] border-[#161616] bg-[#FFFDF7] p-5 shadow-[6px_6px_0px_#161616] sm:p-6"
      >
        <div className="mb-4 flex items-center justify-between gap-2">
          <h2
            id="learning-stack-heading"
            className="text-lg font-black tracking-tight text-[#161616]"
          >
            열심히 배우고 있는 기술들
          </h2>
          <span className="rotate-2 rounded-lg border-2 border-[#161616] bg-[#A6BC78] px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#161616]">
            LEARNING
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {learningStack.map((item, idx) => (
            <div
              key={item.name}
              className={`rounded-xl border-2 border-[#161616] p-3 shadow-[3px_3px_0px_#161616] transition-transform duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 ${
                item.bg
              } ${idx % 2 === 0 ? "-rotate-[0.6deg]" : "rotate-[0.6deg]"}`}
            >
              <div className="text-sm font-black text-[#161616]">
                {item.name}
              </div>
              <div className="mt-1 font-mono text-[11px] font-semibold text-[#161616]/80">
                {item.level}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );

  return (
    <main className="min-h-screen px-4 py-8 text-[#161616] sm:px-6 sm:py-12">
      <div className="mx-auto w-full max-w-4xl">
        {/* Hero 스크랩북 카드 */}
        <section
          aria-label="초보 개발자 프로필 소개"
          className="relative rounded-3xl border-[3px] border-[#161616] bg-[#FFFDF7] shadow-[8px_8px_0px_#161616]"
        >
          {/* 상단 스크랩북 배너 이미지 */}
          <div className="relative h-36 w-full overflow-hidden rounded-t-[calc(1.5rem-3px)] border-b-[3px] border-[#161616] bg-[#EFE6D5] sm:h-44">
            <Image
              src={profile.banner}
              alt={profile.bannerAlt}
              fill
              loading="eager"
              fetchPriority="high"
              placeholder="blur"
              sizes="(max-width: 896px) 100vw, 896px"
              className="object-cover object-center"
            />

            {/* 배너 위 스티커 라벨 바 */}
            <div className="absolute inset-x-4 top-3.5 flex items-center justify-between gap-2 sm:inset-x-6 sm:top-4">
              <span className="-rotate-1 rounded-lg border-2 border-[#161616] bg-[#FFFDF7] px-3 py-1 font-mono text-[11px] font-bold text-[#161616] shadow-[3px_3px_0px_#161616]">
                {profile.handle} · SCRAPBOOK
              </span>
              <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border-2 border-[#161616] bg-[#A6BC78] px-3 py-1 font-mono text-[11px] font-bold text-[#161616] shadow-[3px_3px_0px_#161616]">
                <span className="h-2 w-2 rounded-full border border-[#161616] bg-[#F2C14E]" />
                {profile.status}
              </span>
            </div>
          </div>

          {/* 프로필 본문 */}
          <div className="px-5 pb-6 sm:px-8 sm:pb-8">
            <div className="flex flex-col items-center gap-5 md:flex-row md:items-end md:justify-between">
              {/* 120x120px 프로필 아바타 + 이름/역할 */}
              <div className="flex flex-col items-center gap-5 md:flex-row md:items-end">
                <div className="relative -mt-14 shrink-0 md:-mt-16">
                  {/* 정확한 120px x 120px 프로필 이미지 프레임 */}
                  <div className="rounded-2xl border-[3px] border-[#161616] bg-[#FFFDF7] shadow-[5px_5px_0px_#161616]">
                    <div className="relative h-[120px] w-[120px] overflow-hidden rounded-[calc(1rem-3px)]">
                      <Image
                        src={profile.avatar}
                        alt={profile.avatarAlt}
                        width={120}
                        height={120}
                        loading="eager"
                        fetchPriority="high"
                        placeholder="blur"
                        className="h-[120px] w-[120px] object-cover"
                      />
                    </div>
                  </div>
                  <span className="absolute -right-2.5 -bottom-2.5 rotate-6 rounded-lg border-2 border-[#161616] bg-[#F2C14E] px-2 py-0.5 font-mono text-[11px] font-black text-[#161616] shadow-[2px_2px_0px_#161616]">
                    초보!
                  </span>
                </div>

                <div className="text-center md:pb-1 md:text-left">
                  <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
                    <h1 className="text-3xl font-black tracking-tight text-[#161616] sm:text-4xl">
                      {profile.name}
                    </h1>
                    <span className="-rotate-2 rounded-lg border-2 border-[#161616] bg-[#F2C14E] px-2.5 py-0.5 font-mono text-xs font-bold text-[#161616] shadow-[2px_2px_0px_#161616]">
                      {profile.role}
                    </span>
                  </div>

                  <div className="mt-2.5 flex flex-wrap items-center justify-center gap-2 text-xs font-bold md:justify-start">
                    <span className="rounded-md border-2 border-[#161616] bg-[#EFE6D5] px-2.5 py-0.5 text-[#161616]">
                      {profile.subRole}
                    </span>
                    <span className="rounded-md border-2 border-[#161616] bg-[#E67E66] px-2.5 py-0.5 text-[#161616]">
                      📍 {profile.location}
                    </span>
                    <span className="rotate-1 rounded-md border-2 border-[#161616] bg-[#A6BC78] px-2.5 py-0.5 text-[#161616]">
                      #노력파
                    </span>
                  </div>
                </div>
              </div>

              {/* 상단 액션 버튼 */}
              <div className="flex flex-wrap items-center justify-center gap-2.5 md:pb-1">
                <a
                  href="https://github.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border-[2.5px] border-[#161616] bg-[#F2C14E] px-4 py-2 text-xs font-extrabold text-[#161616] shadow-[4px_4px_0px_#161616] transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#161616] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
                >
                  {linkIcons.github}
                  GitHub
                </a>
                <CopyEmailButton email={profile.email} />
              </div>
            </div>

            {/* 초보 개발자 소개글 + 3개 마일스톤 스티커 */}
            <div className="mt-6 grid grid-cols-1 gap-5 border-t-[2.5px] border-dashed border-[#161616]/30 pt-6 md:grid-cols-12 md:items-center">
              <p className="rounded-2xl border-2 border-[#161616] bg-[#EFE6D5] p-4 text-sm leading-relaxed font-medium text-[#161616] break-keep sm:text-[15px] md:col-span-7">
                {profile.intro}
              </p>

              <div className="grid grid-cols-3 gap-2.5 md:col-span-5">
                {beginnerMilestones.map((item, idx) => (
                  <div
                    key={item.label}
                    className={`rounded-xl border-2 border-[#161616] p-3 text-center shadow-[3px_3px_0px_#161616] ${
                      item.bg
                    } ${idx === 1 ? "rotate-1" : "-rotate-1"}`}
                  >
                    <div className="font-mono text-[10px] font-bold text-[#161616]/80">
                      {item.label}
                    </div>
                    <div className="mt-1 text-base font-black text-[#161616] sm:text-lg">
                      {item.value}
                    </div>
                    <div className="mt-0.5 text-[10px] font-bold text-[#161616]/85">
                      {item.note}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 하단 스크랩북 테이프 배너 */}
          <div className="overflow-hidden rounded-b-[calc(1.5rem-3px)] border-t-[3px] border-[#161616] bg-[#161616] px-4 py-2 text-center font-mono text-[11px] font-bold tracking-wide text-[#F2C14E] sm:text-xs">
            ★ 초보 개발자 홍길동 · 열심히 배우고 · 매일 노력하고 · 끝까지 최선을 다합니다 ★
          </div>
        </section>

        {/* Bento 스크랩북 섹션 (TIL + 체크리스트 + 공부 책상 + 연습 프로젝트 + 모달) */}
        <ProfileShowcase
          leftColumnSlot={leftColumnCard}
          checklistSlot={<BeginnerChecklist items={initialChecklist} />}
          desk={deskHighlight}
          projects={practiceProjects}
        />

        {/* 링크 & 인사하기 섹션 */}
        <section aria-label="개발자 링크 및 인사하기" className="mt-8">
          <div className="mb-3.5 flex flex-wrap items-center gap-2.5">
            <span className="rotate-1 shrink-0 rounded-lg border-2 border-[#161616] bg-[#E67E66] px-3 py-1 font-mono text-xs font-bold text-[#161616] shadow-[3px_3px_0px_#161616]">
              LINKS
            </span>
            <h2 className="text-xl font-black tracking-tight text-[#161616] break-keep">
              저의 공부 기록과 연락처예요
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {contactLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                className={`group flex items-center justify-between rounded-2xl border-[3px] border-[#161616] p-4 text-[#161616] shadow-[5px_5px_0px_#161616] transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0px_#161616] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none ${link.bg}`}
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[#161616] bg-[#FFFDF7] text-[#161616] shadow-[2px_2px_0px_#161616]">
                    {linkIcons[link.id]}
                  </span>
                  <div>
                    <div className="text-sm font-black">{link.label}</div>
                    <div className="text-xs font-semibold text-[#161616]/80">
                      {link.description}
                    </div>
                  </div>
                </div>

                <span
                  aria-hidden
                  className="font-mono text-base font-black transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                >
                  ↗
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* 푸터 */}
        <footer className="mt-10 pb-2 text-center font-mono text-xs font-bold text-[#161616]/75">
          © 2026 {profile.name} · 오늘도 열심히 공부하고 노력하는 초보 개발자
        </footer>
      </div>
    </main>
  );
}
