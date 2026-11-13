import Image from "next/image";
import type { ReactNode } from "react";
import CopyEmailButton from "@/app/components/CopyEmailButton";
import ProfileShowcase from "@/app/components/ProfileShowcase";
import {
  contactLinks,
  developerSnippet,
  featuredProjects,
  profile,
  stack,
  stats,
  workspaceHighlight,
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
      strokeWidth={2}
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
      strokeWidth={2}
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
  const terminalAndStackCard = (
    <section className="flex h-full flex-col justify-between rounded-[1.75rem] border border-white/10 bg-[#080915]/85 p-5 shadow-[0_20px_60px_-20px_rgba(79,70,229,0.28)] backdrop-blur-xl sm:p-6">
      {/* 코드 스니펫 블록 */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
            </div>
            <span className="ml-1 font-mono text-[11px] text-zinc-400">
              developer.ts
            </span>
          </div>
          <span className="rounded-md border border-indigo-400/20 bg-indigo-500/10 px-2 py-0.5 font-mono text-[10px] text-indigo-300">
            TypeScript
          </span>
        </div>

        <div className="rounded-2xl border border-white/[0.07] bg-black/50 p-4 font-mono text-[12.5px] leading-6">
          <div>
            <span className="mr-3 select-none text-zinc-600">01</span>
            <span className="text-fuchsia-400">const</span>{" "}
            <span className="text-sky-300">developer</span>{" "}
            <span className="text-zinc-500">=</span> {"{"}
          </div>
          <div className="pl-5">
            <span className="mr-3 -ml-5 select-none text-zinc-600">02</span>
            <span className="text-indigo-300">focus</span>
            <span className="text-zinc-500">:</span>{" "}
            <span className="text-emerald-300">&quot;{developerSnippet.focus}&quot;</span>,
          </div>
          <div className="pl-5">
            <span className="mr-3 -ml-5 select-none text-zinc-600">03</span>
            <span className="text-indigo-300">motto</span>
            <span className="text-zinc-500">:</span>{" "}
            <span className="text-emerald-300">&quot;{developerSnippet.motto}&quot;</span>,
          </div>
          <div className="pl-5">
            <span className="mr-3 -ml-5 select-none text-zinc-600">04</span>
            <span className="text-indigo-300">currently</span>
            <span className="text-zinc-500">:</span>{" "}
            <span className="text-cyan-300">&quot;{developerSnippet.currently}&quot;</span>,
          </div>
          <div>
            <span className="mr-3 select-none text-zinc-600">05</span>
            {"};"}
          </div>
        </div>
      </div>

      {/* 기술 스택 */}
      <div className="mt-5 border-t border-white/[0.07] pt-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-mono text-[11px] font-semibold tracking-widest text-zinc-400 uppercase">
            {"// Tech Stack"}
          </h2>
          <span className="font-mono text-[10px] text-zinc-500">Core Skills</span>
        </div>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {stack.map((t) => (
            <div
              key={t.name}
              className="flex flex-col gap-0.5 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 transition hover:border-indigo-400/40 hover:bg-white/[0.06]"
            >
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-200">
                <span className={`h-2 w-2 shrink-0 rounded-full ${t.color}`} />
                {t.name}
              </span>
              <span className="pl-4 font-mono text-[10px] text-zinc-500">
                {t.category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050510] px-4 py-10 text-zinc-100 sm:px-6 sm:py-14">
      {/* 배경: 미세 그리드 + 네온 글로우 */}
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(129,140,248,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(129,140,248,0.06)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_top,black_35%,transparent_80%)]" />
      <div className="pointer-events-none fixed -top-44 left-1/2 h-[30rem] w-[34rem] -translate-x-1/2 rounded-full bg-indigo-600/25 blur-[130px]" />
      <div className="pointer-events-none fixed -bottom-40 -left-24 h-96 w-96 rounded-full bg-fuchsia-600/18 blur-[120px]" />
      <div className="pointer-events-none fixed top-1/3 -right-24 h-80 w-80 rounded-full bg-cyan-500/12 blur-[120px]" />

      <div className="relative z-10 mx-auto w-full max-w-4xl">
        {/* Hero Profile Card */}
        <section className="animate-fade-up relative overflow-hidden rounded-[2rem] p-px bg-gradient-to-b from-indigo-400/50 via-fuchsia-500/20 to-white/5 shadow-[0_30px_90px_-20px_rgba(99,102,241,0.42)]">
          <div className="relative overflow-hidden rounded-[calc(2rem-1px)] bg-[#080915]/92 backdrop-blur-2xl">
            {/* 커버 배너 이미지 */}
            <div className="relative h-48 w-full overflow-hidden sm:h-60">
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
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080915] via-[#080915]/40 to-black/25" />

              {/* 배너 상단 상태 바 */}
              <div className="absolute inset-x-4 top-4 flex items-center justify-between gap-2 sm:inset-x-6 sm:top-5">
                <div className="inline-flex min-w-0 items-center gap-2 rounded-full border border-white/10 bg-zinc-950/65 px-3 py-1.5 backdrop-blur-md sm:gap-2.5 sm:px-3.5">
                  <div className="flex shrink-0 gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
                  </div>
                  <span className="truncate font-mono text-[11px] text-zinc-300">
                    ~/<span className="hidden sm:inline">profile/</span>{profile.handle}
                  </span>
                </div>

                <span className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-emerald-400/25 bg-zinc-950/65 px-3 py-1.5 font-mono text-[11px] font-medium text-emerald-300 backdrop-blur-md">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  </span>
                  {profile.status}
                </span>
              </div>
            </div>

            {/* 프로필 본문 */}
            <div className="relative px-6 pb-7 sm:px-8 sm:pb-8">
              <div className="flex flex-col items-center gap-5 md:flex-row md:items-end md:justify-between">
                {/* 아바타 + 이름/직무 */}
                <div className="flex flex-col items-center gap-5 md:flex-row md:items-end">
                  <div className="relative -mt-20 h-36 w-36 shrink-0 animate-float sm:-mt-24 sm:h-40 sm:w-40">
                    <div className="absolute -inset-1.5 animate-spin-slow rounded-full bg-[conic-gradient(from_0deg,#6366f1,#a855f7,#ec4899,#22d3ee,#6366f1)] opacity-90 blur-[2px]" />
                    <div className="absolute -inset-5 rounded-full bg-indigo-500/25 blur-2xl" />
                    <div className="relative h-full w-full overflow-hidden rounded-full border-4 border-[#080915] bg-zinc-900">
                      <Image
                        src={profile.avatar}
                        alt={profile.avatarAlt}
                        fill
                        sizes="160px"
                        loading="eager"
                        fetchPriority="high"
                        placeholder="blur"
                        className="origin-[50%_35%] scale-[1.15] object-cover"
                      />
                    </div>
                    <span className="absolute right-0 bottom-2 rounded-xl border border-white/15 bg-zinc-900/95 px-2.5 py-1 font-mono text-xs text-fuchsia-300 shadow-lg backdrop-blur">
                      {"</>"}
                    </span>
                  </div>

                  <div className="text-center md:pb-1 md:text-left">
                    <div className="flex flex-wrap items-center justify-center gap-2.5 md:justify-start">
                      <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                        <span className="bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent">
                          {profile.name}
                        </span>
                      </h1>
                      <span className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-0.5 font-mono text-xs text-zinc-400">
                        {profile.handle}
                      </span>
                    </div>

                    <p className="mt-1.5 font-mono text-sm text-indigo-300 sm:text-[15px]">
                      <span className="text-fuchsia-400">~/</span>
                      {profile.role}
                      <span className="ml-0.5 inline-block h-4 w-[7px] translate-y-[3px] animate-blink bg-indigo-300" />
                    </p>

                    <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-xs text-zinc-400 md:justify-start">
                      <span className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-0.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                        {profile.subRole}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-0.5">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-3 w-3 text-cyan-400"
                          aria-hidden
                        >
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        {profile.location}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 상단 빠른 액션 */}
                <div className="flex flex-wrap items-center justify-center gap-2 md:pb-1">
                  <a
                    href="https://github.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:brightness-110"
                  >
                    {linkIcons.github}
                    GitHub
                  </a>
                  <CopyEmailButton email={profile.email} />
                </div>
              </div>

              {/* 소개글 + 통계 */}
              <div className="mt-6 grid grid-cols-1 gap-6 border-t border-white/[0.07] pt-6 md:grid-cols-12 md:items-center">
                <p className="text-center text-[15px] leading-relaxed text-zinc-300 break-keep md:col-span-7 md:text-left">
                  {profile.intro}
                </p>

                <div className="grid grid-cols-3 divide-x divide-white/[0.07] rounded-2xl border border-white/10 bg-white/[0.03] md:col-span-5">
                  {stats.map((s) => (
                    <div key={s.label} className="px-2 py-3.5 text-center">
                      <div className="bg-gradient-to-b from-white to-indigo-300 bg-clip-text text-xl font-extrabold text-transparent sm:text-2xl">
                        {s.value}
                      </div>
                      <div className="mt-0.5 font-mono text-[10px] tracking-widest text-zinc-400 uppercase">
                        {s.label}
                      </div>
                      <div className="mt-0.5 text-[10px] text-zinc-500">
                        {s.hint}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bento Showcase (Terminal + Stack + Workspace + Featured Projects + Lightbox) */}
        <ProfileShowcase
          terminalSlot={terminalAndStackCard}
          workspace={workspaceHighlight}
          projects={featuredProjects}
        />

        {/* Links Bar */}
        <section aria-label="소셜 및 연락처 링크" className="mt-5">
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
            {contactLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                className={
                  link.primary
                    ? "group flex items-center justify-between rounded-2xl bg-gradient-to-r from-indigo-500/90 to-fuchsia-500/90 p-4 text-white shadow-lg shadow-indigo-500/25 transition hover:-translate-y-0.5 hover:brightness-110"
                    : "group flex items-center justify-between rounded-2xl border border-white/10 bg-[#080915]/85 p-4 text-zinc-200 backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-indigo-400/40 hover:bg-white/[0.06]"
                }
              >
                <div className="flex items-center gap-3.5">
                  <span
                    className={
                      link.primary
                        ? "inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-white"
                        : "inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-indigo-300 transition group-hover:border-indigo-400/35 group-hover:text-white"
                    }
                  >
                    {linkIcons[link.id]}
                  </span>
                  <div>
                    <div className="text-sm font-bold">{link.label}</div>
                    <div
                      className={
                        link.primary
                          ? "text-xs text-indigo-100/85"
                          : "text-xs text-zinc-400"
                      }
                    >
                      {link.description}
                    </div>
                  </div>
                </div>

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 opacity-70 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                  aria-hidden
                >
                  <path d="M7 17 17 7" />
                  <path d="M7 7h10v10" />
                </svg>
              </a>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-8 pb-2 text-center font-mono text-[11px] text-zinc-500">
          © 2026 {profile.name} · Built with Next.js &amp; Tailwind CSS
        </footer>
      </div>
    </main>
  );
}
