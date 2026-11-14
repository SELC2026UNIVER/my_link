/**
 * 공개 프로필 로딩 및 하이드레이션 대기용 정적 셸 스켈레톤.
 */
export function PublicProfileSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="프로필을 불러오는 중"
      className="flex min-h-dvh w-full flex-col"
    >
      <section className="w-full bg-[var(--color-canvas)] pt-14 pb-12 sm:pt-16 sm:pb-16">
        <div className="mx-auto flex max-w-[680px] flex-col items-center px-5 text-center">
          <div className="size-[120px] animate-pulse rounded-full bg-[var(--color-canvas-parchment)]" />
          <div className="mt-5 h-8 w-36 animate-pulse rounded-full bg-[var(--color-canvas-parchment)]" />
          <div className="mt-2 h-4 w-24 animate-pulse rounded-full bg-[var(--color-canvas-parchment)]" />
          <div className="mt-5 h-5 w-72 max-w-full animate-pulse rounded-full bg-[var(--color-canvas-parchment)]" />
          <div className="mt-6 flex items-center gap-2.5">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="size-11 animate-pulse rounded-full bg-[var(--color-canvas-parchment)]"
              />
            ))}
          </div>
        </div>
      </section>

      <section className="w-full flex-1 bg-[var(--color-surface-tile-1)] py-10 sm:py-14">
        <div className="mx-auto flex max-w-[680px] flex-col gap-3 px-5">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-[60px] w-full animate-pulse rounded-[18px] border border-white/10 bg-[var(--color-surface-tile-2)]"
            />
          ))}
        </div>
      </section>
    </div>
  );
}
