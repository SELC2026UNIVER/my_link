export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-pink-50 px-4 py-12 dark:from-zinc-950 dark:via-zinc-900 dark:to-indigo-950">
      {/* 배경 은은한 빛 효과 */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl dark:bg-indigo-500/10" />
      <div className="pointer-events-none absolute -right-24 -bottom-24 h-96 w-96 rounded-full bg-pink-200/40 blur-3xl dark:bg-pink-500/10" />

      {/* 메인 프로필 카드 */}
      <div className="relative z-10 flex w-full max-w-sm flex-col items-center rounded-[2rem] border border-white/60 bg-white/80 px-8 py-12 text-center shadow-[0_20px_50px_rgba(79,70,229,0.08)] backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1 dark:border-zinc-800/80 dark:bg-zinc-900/80 dark:shadow-none">
        {/* 상단 배지 */}
        <span className="mb-6 inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3.5 py-1 text-xs font-semibold text-indigo-600 ring-1 ring-indigo-500/10 dark:bg-indigo-500/10 dark:text-indigo-300 dark:ring-indigo-400/20">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
          Vibe Coding Student
        </span>

        {/* 프로필 아바타 */}
        <div className="relative mb-6">
          <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-1 shadow-lg shadow-indigo-500/25">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-4xl dark:bg-zinc-900">
              🧑‍💻
            </div>
          </div>
          <span
            className="absolute right-1 bottom-1 flex h-7 w-7 items-center justify-center rounded-full bg-white text-sm shadow-md ring-1 ring-zinc-100 dark:bg-zinc-800 dark:ring-zinc-700"
            title="열공 중!"
          >
            ✨
          </span>
        </div>

        {/* 이름 */}
        <h1 className="mb-2 text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          홍길동
        </h1>

        {/* 구분선 */}
        <div className="my-3 h-1 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 opacity-80" />

        {/* 소개글 */}
        <p className="mt-2 text-[15px] leading-relaxed font-medium text-zinc-600 break-keep dark:text-zinc-300">
          안녕하세요! 바이브 코딩을 배우고 있는 대학생 입니다!
        </p>

        {/* 관심사 태그 */}
        <div className="mt-7 flex flex-wrap justify-center gap-2">
          <span className="rounded-lg bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
            #대학생
          </span>
          <span className="rounded-lg bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
            #바이브코딩
          </span>
          <span className="rounded-lg bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
            #Next.js
          </span>
        </div>
      </div>
    </main>
  );
}
