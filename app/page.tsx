import Image from "next/image";

// 프로필 데이터 (원하는 내용으로 자유롭게 수정하세요)
const profile = {
  name: "홍길동",
  role: "Full-Stack Developer",
  subRole: "Computer Science Student",
  intro:
    "사용자 경험을 집요하게 고민하고, 아이디어를 빠르게 제품으로 만드는 개발자입니다. React · Next.js 기반의 웹 서비스부터 AI를 활용한 바이브 코딩까지, 매일 한 줄씩 더 나은 코드를 씁니다.",
};

const stats = [
  { value: "12+", label: "Projects" },
  { value: "1.2k", label: "Commits" },
  { value: "∞", label: "Coffee" },
];

const stack = [
  { name: "TypeScript", color: "bg-sky-400" },
  { name: "React", color: "bg-cyan-400" },
  { name: "Next.js", color: "bg-zinc-100" },
  { name: "Tailwind", color: "bg-teal-400" },
  { name: "Node.js", color: "bg-lime-400" },
  { name: "Python", color: "bg-yellow-300" },
];

const links = [
  {
    label: "GitHub",
    href: "https://github.com/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
        <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a10.9 10.9 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.39-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
      </svg>
    ),
  },
  {
    label: "Blog",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
      </svg>
    ),
  },
  {
    label: "Contact",
    href: "mailto:hello@example.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-10 6L2 7" />
      </svg>
    ),
  },
];

export default function Home() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#070712] px-4 py-16 text-zinc-100">
      {/* 배경: 그리드 + 네온 글로우 */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(129,140,248,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(129,140,248,0.07)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-indigo-600/30 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-fuchsia-600/20 blur-[120px]" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-cyan-500/10 blur-[110px]" />

      {/* 메인 프로필 카드 */}
      <section className="relative z-10 w-full max-w-md">
        {/* 카드 테두리 그라데이션 */}
        <div className="absolute -inset-px rounded-[2rem] bg-gradient-to-b from-indigo-400/50 via-fuchsia-500/20 to-transparent" />

        <div className="relative overflow-hidden rounded-[2rem] bg-zinc-950/80 px-7 pt-8 pb-7 shadow-[0_30px_80px_-20px_rgba(99,102,241,0.45)] backdrop-blur-2xl">
          {/* 상단 바 */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 font-mono text-[11px] font-medium text-emerald-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Open to work
            </span>
          </div>

          {/* 아바타 (2.5D 일러스트) */}
          <div className="relative mx-auto mb-7 h-44 w-44 animate-float">
            <div className="absolute -inset-1.5 animate-spin-slow rounded-full bg-[conic-gradient(from_0deg,#6366f1,#a855f7,#ec4899,#22d3ee,#6366f1)] opacity-90 blur-[2px]" />
            <div className="absolute -inset-6 rounded-full bg-indigo-500/25 blur-2xl" />
            <div className="relative h-full w-full overflow-hidden rounded-full border-4 border-zinc-950 bg-zinc-900">
              <Image
                src="/avatar.jpg"
                alt={`${profile.name} 개발자 프로필 일러스트`}
                fill
                sizes="176px"
                loading="eager"
                fetchPriority="high"
                className="origin-[50%_35%] scale-[1.15] object-cover"
              />
            </div>
            <span className="absolute -right-1 bottom-3 rounded-xl border border-white/10 bg-zinc-900/90 px-2 py-1 font-mono text-xs text-fuchsia-300 shadow-lg backdrop-blur">
              {"</>"}
            </span>
          </div>

          {/* 이름 & 직무 */}
          <div className="text-center">
            <h1 className="text-3xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent">
                {profile.name}
              </span>
            </h1>
            <p className="mt-2 font-mono text-sm text-indigo-300">
              <span className="text-fuchsia-400">~/</span>
              {profile.role}
              <span className="ml-0.5 inline-block h-4 w-[7px] translate-y-[3px] animate-blink bg-indigo-300" />
            </p>
            <p className="mt-1 text-xs tracking-wide text-zinc-500 uppercase">{profile.subRole}</p>
          </div>

          {/* 소개글 */}
          <p className="mt-6 text-center text-[14.5px] leading-relaxed text-zinc-300 break-keep">
            {profile.intro}
          </p>

          {/* 통계 */}
          <div className="mt-7 grid grid-cols-3 divide-x divide-white/5 rounded-2xl border border-white/5 bg-white/[0.03]">
            {stats.map((s) => (
              <div key={s.label} className="py-3.5 text-center">
                <div className="bg-gradient-to-b from-white to-indigo-300 bg-clip-text text-xl font-bold text-transparent">
                  {s.value}
                </div>
                <div className="mt-0.5 font-mono text-[10px] tracking-widest text-zinc-500 uppercase">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* 코드 스니펫 */}
          <div className="mt-5 rounded-2xl border border-white/5 bg-black/40 p-4 font-mono text-[12.5px] leading-6">
            <div>
              <span className="text-fuchsia-400">const</span> <span className="text-sky-300">developer</span>{" "}
              <span className="text-zinc-500">=</span> {"{"}
            </div>
            <div className="pl-4">
              <span className="text-indigo-300">focus</span>
              <span className="text-zinc-500">:</span> <span className="text-emerald-300">&quot;Web · AI&quot;</span>,
            </div>
            <div className="pl-4">
              <span className="text-indigo-300">motto</span>
              <span className="text-zinc-500">:</span>{" "}
              <span className="text-emerald-300">&quot;Ship fast, learn faster&quot;</span>,
            </div>
            <div>{"};"}</div>
          </div>

          {/* 기술 스택 */}
          <div className="mt-6">
            <h2 className="mb-3 font-mono text-[11px] tracking-widest text-zinc-500 uppercase">
              {"// Tech Stack"}
            </h2>
            <div className="flex flex-wrap gap-2">
              {stack.map((t) => (
                <span
                  key={t.name}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-medium text-zinc-300 transition-colors hover:border-indigo-400/40 hover:text-white"
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${t.color}`} />
                  {t.name}
                </span>
              ))}
            </div>
          </div>

          {/* 링크 버튼 */}
          <div className="mt-7 grid grid-cols-3 gap-2.5">
            {links.map((l, i) => (
              <a
                key={l.label}
                href={l.href}
                target={l.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className={
                  i === 0
                    ? "inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:brightness-110"
                    : "inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] py-2.5 text-sm font-semibold text-zinc-200 transition hover:border-white/20 hover:bg-white/[0.08]"
                }
              >
                {l.icon}
                {l.label}
              </a>
            ))}
          </div>
        </div>

        <p className="mt-6 text-center font-mono text-[11px] text-zinc-600">
          © 2026 {profile.name} · Built with Next.js
        </p>
      </section>
    </main>
  );
}
