"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import type { DeskHighlight, PracticeProjectItem } from "@/app/profile-data";

type ModalPayload =
  | { kind: "desk"; item: DeskHighlight }
  | { kind: "project"; item: PracticeProjectItem };

interface ProfileShowcaseProps {
  leftColumnSlot: ReactNode;
  checklistSlot: ReactNode;
  desk: DeskHighlight;
  projects: PracticeProjectItem[];
}

export default function ProfileShowcase({
  leftColumnSlot,
  checklistSlot,
  desk,
  projects,
}: ProfileShowcaseProps) {
  const [selected, setSelected] = useState<ModalPayload | null>(null);

  useEffect(() => {
    if (!selected) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setSelected(null);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selected]);

  return (
    <>
      {/* 2단 스크랩북 Bento 그리드: (좌) 오늘의 공부 기록 + 스택 / (우) 초보 다짐 체크리스트 + 책상 사진 */}
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-12">
        <div className="flex flex-col gap-6 md:col-span-7">{leftColumnSlot}</div>

        <div className="flex flex-col gap-6 md:col-span-5">
          {checklistSlot}

          {/* 공부 책상 스크랩북 사진 카드 */}
          <article className="group relative rounded-2xl border-[3px] border-[#161616] bg-[#EFE6D5] p-3.5 shadow-[6px_6px_0px_#161616]">
            {/* 마스킹 테이프 스티커 데코 */}
            <div
              aria-hidden
              className="pointer-events-none absolute -top-3 left-6 z-10 h-6 w-20 -rotate-3 border-2 border-[#161616] bg-[#F2C14E]/95 shadow-[2px_2px_0px_#161616]"
            />

            <button
              type="button"
              onClick={() => setSelected({ kind: "desk", item: desk })}
              aria-label={`${desk.title} 일러스트 크게 보기`}
              className="block w-full cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#161616]"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border-[2.5px] border-[#161616] bg-[#FFFDF7]">
                <Image
                  src={desk.image}
                  alt={desk.imageAlt}
                  fill
                  placeholder="blur"
                  sizes="(max-width: 768px) 100vw, 360px"
                  className="object-cover object-center transition-transform duration-300 group-hover:scale-[1.03]"
                />
                <span className="absolute right-2.5 bottom-2.5 rounded-lg border-2 border-[#161616] bg-[#FFFDF7] px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#161616] shadow-[2px_2px_0px_#161616]">
                  크게 보기 ↗
                </span>
              </div>

              <div className="mt-3 px-0.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-block rounded-md border-2 border-[#161616] bg-[#E67E66] px-2 py-0.5 font-mono text-[10px] font-bold text-[#161616]">
                    {desk.eyebrow}
                  </span>
                </div>
                <h3 className="mt-2 text-base font-extrabold tracking-tight text-[#161616]">
                  {desk.title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-[#161616]/80 break-keep">
                  {desk.subtitle}
                </p>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {desk.specs.map((spec) => (
                    <span
                      key={spec}
                      className="rounded-md border-2 border-[#161616] bg-[#FFFDF7] px-2 py-0.5 font-mono text-[10px] font-semibold text-[#161616]"
                    >
                      #{spec}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          </article>
        </div>
      </div>

      {/* 작지만 직접 만든 연습 프로젝트 섹션 */}
      <section
        id="projects"
        aria-labelledby="practice-projects-heading"
        className="mt-8"
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="-rotate-2 shrink-0 rounded-lg border-2 border-[#161616] bg-[#F2C14E] px-3 py-1 font-mono text-xs font-bold text-[#161616] shadow-[3px_3px_0px_#161616]">
              PRACTICE
            </span>
            <h2
              id="practice-projects-heading"
              className="text-xl font-black tracking-tight text-[#161616] break-keep"
            >
              작지만 직접 만든 연습 프로젝트
            </h2>
          </div>
          <span className="rounded-full border-2 border-[#161616] bg-[#FFFDF7] px-3 py-1 font-mono text-[11px] font-semibold text-[#161616]">
            카드를 누르면 상세 메모가 열려요
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {projects.map((project, idx) => (
            <article
              key={project.id}
              className="group flex flex-col overflow-hidden rounded-2xl border-[3px] border-[#161616] bg-[#FFFDF7] shadow-[6px_6px_0px_#161616] transition-transform duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0px_#161616]"
            >
              {/* 상단 컬러 바 */}
              <div
                className={`flex items-center justify-between border-b-[3px] border-[#161616] px-4 py-2.5 ${project.accentBg}`}
              >
                <span className="font-mono text-xs font-bold text-[#161616]">
                  {project.badge}
                </span>
                <span
                  className={`rounded-md border-2 border-[#161616] bg-[#FFFDF7] px-2 py-0.5 font-mono text-[10px] font-bold text-[#161616] ${
                    idx % 2 === 0 ? "-rotate-2" : "rotate-2"
                  }`}
                >
                  {project.year}
                </span>
              </div>

              {/* 프로젝트 일러스트 */}
              <button
                type="button"
                onClick={() => setSelected({ kind: "project", item: project })}
                aria-label={`${project.title} 프로젝트 자세히 보기`}
                className="relative aspect-[16/9] w-full cursor-pointer overflow-hidden border-b-[3px] border-[#161616] bg-[#EFE6D5] text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#161616]"
              >
                <Image
                  src={project.image}
                  alt={project.imageAlt}
                  fill
                  placeholder="blur"
                  sizes="(max-width: 768px) 100vw, 430px"
                  className="object-cover object-center transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </button>

              {/* 프로젝트 설명 */}
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-black tracking-tight text-[#161616]">
                    {project.title}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setSelected({ kind: "project", item: project })}
                    className="shrink-0 cursor-pointer rounded-lg border-2 border-[#161616] bg-[#F2C14E] px-2.5 py-1 font-mono text-[11px] font-bold text-[#161616] shadow-[2px_2px_0px_#161616] transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#161616] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                  >
                    자세히
                  </button>
                </div>

                <p className="mt-2.5 text-sm leading-relaxed text-[#161616]/85 break-keep">
                  {project.summary}
                </p>

                <div className="mt-auto pt-4">
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md border-2 border-[#161616] bg-[#EFE6D5] px-2.5 py-0.5 font-mono text-[11px] font-bold text-[#161616]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 네오브루탈리즘 라이트박스 모달 */}
      {selected && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="scrapbook-modal-title"
          onClick={() => setSelected(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#161616]/65 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border-[3px] border-[#161616] bg-[#FFFDF7] shadow-[8px_8px_0px_#161616]"
          >
            {/* 모달 상단 타이틀 바 */}
            <div
              className={`flex items-center justify-between border-b-[3px] border-[#161616] px-5 py-3 ${
                selected.kind === "desk"
                  ? "bg-[#E67E66]"
                  : selected.item.accentBg
              }`}
            >
              <span className="font-mono text-xs font-bold text-[#161616]">
                {selected.kind === "desk"
                  ? selected.item.eyebrow
                  : `${selected.item.badge} · ${selected.item.year}`}
              </span>
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="창 닫기"
                className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border-2 border-[#161616] bg-[#FFFDF7] text-sm font-black text-[#161616] shadow-[2px_2px_0px_#161616] transition-all duration-150 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
              >
                ✕
              </button>
            </div>

            {/* 모달 이미지 */}
            <div className="relative aspect-[16/9] w-full border-b-[3px] border-[#161616] bg-[#EFE6D5]">
              <Image
                src={selected.item.image}
                alt={selected.item.imageAlt}
                fill
                placeholder="blur"
                sizes="(max-width: 672px) 100vw, 672px"
                className="object-cover object-center"
              />
            </div>

            {/* 모달 본문 */}
            <div className="p-5 sm:p-6">
              {selected.kind === "desk" ? (
                <>
                  <h3
                    id="scrapbook-modal-title"
                    className="text-2xl font-black tracking-tight text-[#161616]"
                  >
                    {selected.item.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-[#161616]/85 break-keep">
                    {selected.item.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {selected.item.specs.map((spec) => (
                      <span
                        key={spec}
                        className="rounded-lg border-2 border-[#161616] bg-[#F2C14E] px-3 py-1 font-mono text-xs font-bold text-[#161616] shadow-[2px_2px_0px_#161616]"
                      >
                        #{spec}
                      </span>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <h3
                    id="scrapbook-modal-title"
                    className="text-2xl font-black tracking-tight text-[#161616]"
                  >
                    {selected.item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#161616]/85 break-keep">
                    {selected.item.summary}
                  </p>
                  <ul className="mt-4 space-y-2 rounded-xl border-2 border-[#161616] bg-[#EFE6D5] p-4 text-sm text-[#161616]">
                    {selected.item.highlights.map((hl) => (
                      <li key={hl} className="flex items-start gap-2.5">
                        <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded border border-[#161616] bg-[#A6BC78] text-[10px] font-black">
                          ✓
                        </span>
                        <span className="font-medium break-keep">{hl}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-1.5">
                      {selected.item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md border-2 border-[#161616] bg-[#FFFDF7] px-2.5 py-1 font-mono text-[11px] font-bold text-[#161616]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    {selected.item.href && (
                      <a
                        href={selected.item.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl border-2 border-[#161616] bg-[#F2C14E] px-4 py-2 text-xs font-extrabold text-[#161616] shadow-[3px_3px_0px_#161616] transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#161616] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
                      >
                        GitHub 코드 보기 ↗
                      </a>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
