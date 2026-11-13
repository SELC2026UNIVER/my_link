"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import type { VisualProjectItem, WorkspaceHighlight } from "@/app/profile-data";

type ModalPayload =
  | { kind: "workspace"; item: WorkspaceHighlight }
  | { kind: "project"; item: VisualProjectItem };

interface ProfileShowcaseProps {
  terminalSlot: ReactNode;
  workspace: WorkspaceHighlight;
  projects: VisualProjectItem[];
}

export default function ProfileShowcase({
  terminalSlot,
  workspace,
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
      {/* Bento Row: 코드/스택 (7 cols) + 데스크 셋업 이미지 카드 (5 cols) */}
      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-12">
        <div className="md:col-span-7">{terminalSlot}</div>

        <article className="group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#080915]/85 shadow-[0_20px_60px_-20px_rgba(79,70,229,0.35)] backdrop-blur-xl transition hover:border-indigo-400/35 md:col-span-5">
          <button
            type="button"
            onClick={() => setSelected({ kind: "workspace", item: workspace })}
            aria-label={`${workspace.title} 이미지 크게 보기`}
            className="relative flex h-full min-h-[290px] w-full cursor-pointer flex-col justify-end text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
          >
            <Image
              src={workspace.image}
              alt={workspace.imageAlt}
              fill
              placeholder="blur"
              sizes="(max-width: 768px) 100vw, 380px"
              className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#060711] via-[#060711]/55 to-transparent" />

            {/* 우측 상단 확대 힌트 배지 */}
            <span className="absolute top-4 right-4 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/50 px-2.5 py-1 font-mono text-[10px] text-zinc-200 backdrop-blur-md transition group-hover:border-indigo-400/50 group-hover:bg-indigo-500/20">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3 w-3"
                aria-hidden
              >
                <path d="M15 3h6v6" />
                <path d="M9 21H3v-6" />
                <path d="M21 3l-7 7" />
                <path d="M3 21l7-7" />
              </svg>
              VIEW
            </span>

            <div className="relative z-10 p-5 sm:p-6">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-fuchsia-400/25 bg-fuchsia-500/15 px-2.5 py-0.5 font-mono text-[10px] font-medium tracking-wider text-fuchsia-200 backdrop-blur-md">
                {workspace.eyebrow}
              </span>
              <h2 className="mt-2.5 text-lg font-bold tracking-tight text-white">
                {workspace.title}
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-zinc-300 break-keep">
                {workspace.subtitle}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {workspace.specs.map((spec) => (
                  <span
                    key={spec}
                    className="rounded-md border border-white/10 bg-black/45 px-2 py-0.5 font-mono text-[10px] text-zinc-300 backdrop-blur-sm"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          </button>
        </article>
      </div>

      {/* Featured Visual Projects */}
      <section id="projects" aria-labelledby="featured-projects-heading" className="mt-5">
        <div className="mb-3.5 flex items-center justify-between px-1">
          <div className="flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.85)]" />
            <h2
              id="featured-projects-heading"
              className="font-mono text-xs font-semibold tracking-widest text-zinc-400 uppercase"
            >
              {"// Featured Projects"}
            </h2>
          </div>
          <span className="text-xs text-zinc-500">카드를 눌러 자세히 보기</span>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {projects.map((project) => (
            <article
              key={project.id}
              className="group flex flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#080915]/85 shadow-[0_20px_60px_-20px_rgba(79,70,229,0.28)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-indigo-400/35"
            >
              <button
                type="button"
                onClick={() => setSelected({ kind: "project", item: project })}
                aria-label={`${project.title} 프로젝트 프리뷰 열기`}
                className="relative aspect-[16/9] w-full cursor-pointer overflow-hidden border-b border-white/10 bg-zinc-950 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
              >
                <Image
                  src={project.image}
                  alt={project.imageAlt}
                  fill
                  placeholder="blur"
                  sizes="(max-width: 768px) 100vw, 430px"
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080915]/80 via-transparent to-black/20" />
                <div className="absolute inset-x-4 top-3.5 flex items-center justify-between">
                  <span className="rounded-full border border-indigo-400/30 bg-indigo-500/20 px-2.5 py-0.5 font-mono text-[10px] font-medium text-indigo-200 backdrop-blur-md">
                    {project.badge}
                  </span>
                  <span className="rounded-full border border-white/15 bg-black/50 px-2.5 py-0.5 font-mono text-[10px] text-zinc-300 backdrop-blur-md">
                    {project.year}
                  </span>
                </div>
              </button>

              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-bold tracking-tight text-white">
                    {project.title}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setSelected({ kind: "project", item: project })}
                    className="shrink-0 cursor-pointer rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[11px] text-zinc-300 transition hover:border-indigo-400/40 hover:bg-indigo-500/15 hover:text-white"
                  >
                    상세보기
                  </button>
                </div>

                <p className="mt-2 text-sm leading-relaxed text-zinc-300 break-keep">
                  {project.summary}
                </p>

                <div className="mt-auto pt-4">
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-0.5 font-mono text-[11px] text-zinc-300"
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

      {/* Lightbox Modal */}
      {selected && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="showcase-modal-title"
          onClick={() => setSelected(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[1.75rem] border border-white/15 bg-[#0a0b1a] shadow-[0_30px_100px_rgba(99,102,241,0.45)]"
          >
            <button
              type="button"
              onClick={() => setSelected(null)}
              aria-label="창 닫기"
              className="absolute top-3.5 right-3.5 z-20 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-black/60 text-zinc-200 backdrop-blur-md transition hover:border-white/30 hover:bg-black/80 hover:text-white"
            >
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
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>

            <div className="relative aspect-[16/9] w-full bg-zinc-950">
              <Image
                src={selected.item.image}
                alt={selected.item.imageAlt}
                fill
                placeholder="blur"
                sizes="(max-width: 672px) 100vw, 672px"
                className="object-cover object-center"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a0b1a] via-transparent to-transparent" />
            </div>

            <div className="p-6 sm:p-7">
              {selected.kind === "workspace" ? (
                <>
                  <span className="inline-flex rounded-full border border-fuchsia-400/30 bg-fuchsia-500/15 px-2.5 py-0.5 font-mono text-[11px] text-fuchsia-200">
                    {selected.item.eyebrow}
                  </span>
                  <h3
                    id="showcase-modal-title"
                    className="mt-2.5 text-2xl font-bold tracking-tight text-white"
                  >
                    {selected.item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-300 break-keep">
                    {selected.item.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {selected.item.specs.map((spec) => (
                      <span
                        key={spec}
                        className="rounded-lg border border-white/10 bg-white/[0.05] px-3 py-1 font-mono text-xs text-zinc-200"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex rounded-full border border-indigo-400/30 bg-indigo-500/15 px-2.5 py-0.5 font-mono text-[11px] text-indigo-200">
                      {selected.item.badge}
                    </span>
                    <span className="font-mono text-xs text-zinc-500">
                      {selected.item.year}
                    </span>
                  </div>
                  <h3
                    id="showcase-modal-title"
                    className="mt-2.5 text-2xl font-bold tracking-tight text-white"
                  >
                    {selected.item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-300 break-keep">
                    {selected.item.summary}
                  </p>
                  <ul className="mt-4 space-y-1.5 text-sm text-zinc-300">
                    {selected.item.highlights.map((hl) => (
                      <li key={hl} className="flex items-start gap-2">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                        <span className="break-keep">{hl}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
                    <div className="flex flex-wrap gap-1.5">
                      {selected.item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[11px] text-zinc-300"
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
                        className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:brightness-110"
                      >
                        GitHub 보기
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-3.5 w-3.5"
                          aria-hidden
                        >
                          <path d="M7 17 17 7" />
                          <path d="M7 7h10v10" />
                        </svg>
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
