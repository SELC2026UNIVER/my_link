"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { PracticeProjectItem } from "../profile-data";

interface ProfileShowcaseProps {
  projects: PracticeProjectItem[];
}

export default function ProfileShowcase({ projects }: ProfileShowcaseProps) {
  const [selectedProject, setSelectedProject] =
    useState<PracticeProjectItem | null>(null);

  useEffect(() => {
    if (!selectedProject) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedProject(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedProject]);

  return (
    <>
      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <article
            key={project.id}
            className="flex flex-col justify-between rounded-[18px] border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-6 sm:p-8"
          >
            <div>
              <p className="type-caption numeric-spec text-[var(--color-ink-muted-48)]">
                {project.badge} · {project.year}
              </p>
              <h3 className="type-tagline mt-1.5 text-[var(--color-ink)]">
                {project.title}
              </h3>

              <button
                type="button"
                onClick={() => setSelectedProject(project)}
                aria-label={`${project.title} 자세히 보기`}
                className="mt-6 block w-full cursor-pointer overflow-hidden rounded-[8px] bg-[var(--color-canvas-parchment)] text-left shadow-product transition-transform duration-200 hover:scale-[1.01] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary-focus)]"
              >
                <Image
                  src={project.image}
                  alt={project.imageAlt}
                  placeholder="blur"
                  className="aspect-square w-full object-cover"
                />
              </button>

              <p className="type-body mt-6 text-[var(--color-ink)]">
                {project.summary}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="type-caption rounded-full border border-[var(--color-hairline)] bg-[var(--color-canvas-parchment)] px-3 py-1 text-[var(--color-ink-muted-80)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-black/[0.04] pt-5">
              <button
                type="button"
                onClick={() => setSelectedProject(project)}
                className="type-button-utility inline-flex cursor-pointer items-center justify-center rounded-full bg-[var(--color-primary)] px-4 py-2 text-white transition-all duration-150 hover:brightness-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary-focus)]"
              >
                자세히 보기
              </button>

              {project.href ? (
                <a
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="type-caption-strong inline-flex items-center gap-1 text-[var(--color-primary)] hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-primary-focus)]"
                >
                  <span>코드 보기</span>
                  <span aria-hidden="true">›</span>
                </a>
              ) : null}
            </div>
          </article>
        ))}
      </div>

      {selectedProject ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedProject(null);
            }
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
        >
          <div className="relative max-h-[90vh] w-full max-w-[680px] overflow-y-auto rounded-[18px] border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-6 sm:p-10">
            <button
              type="button"
              onClick={() => setSelectedProject(null)}
              aria-label="창 닫기"
              className="sticky top-0 float-right flex h-[44px] w-[44px] cursor-pointer items-center justify-center rounded-full bg-[var(--color-surface-chip-translucent)] text-[var(--color-ink)] transition-all duration-150 hover:brightness-95 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary-focus)]"
            >
              <svg
                aria-hidden="true"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M3.5 3.5L12.5 12.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
                <path
                  d="M12.5 3.5L3.5 12.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <p className="type-caption numeric-spec text-[var(--color-ink-muted-48)]">
              {selectedProject.badge} · {selectedProject.year}
            </p>
            <h3
              id="project-modal-title"
              className="type-display-md mt-1 text-[var(--color-ink)]"
            >
              {selectedProject.title}
            </h3>

            <div className="mt-6 overflow-hidden rounded-[8px] bg-[var(--color-canvas-parchment)] shadow-product">
              <Image
                src={selectedProject.image}
                alt={selectedProject.imageAlt}
                placeholder="blur"
                className="aspect-square max-h-[340px] w-full object-cover"
              />
            </div>

            <p className="type-body mt-6 text-[var(--color-ink)]">
              {selectedProject.summary}
            </p>

            <div className="mt-6 border-t border-[var(--color-hairline)] pt-5">
              <p className="type-caption-strong text-[var(--color-ink-muted-48)]">
                만들면서 노력한 점
              </p>
              <ul className="mt-3 space-y-2.5">
                {selectedProject.highlights.map((item) => (
                  <li key={item} className="type-body flex items-start gap-2.5">
                    <span
                      aria-hidden="true"
                      className="mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary)]"
                    />
                    <span className="text-[var(--color-ink)]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {selectedProject.tags.map((tag) => (
                <span
                  key={tag}
                  className="type-caption rounded-full border border-[var(--color-hairline)] bg-[var(--color-canvas-parchment)] px-3 py-1 text-[var(--color-ink-muted-80)]"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-[var(--color-hairline)] pt-6">
              {selectedProject.href ? (
                <a
                  href={selectedProject.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="type-button-utility inline-flex items-center justify-center rounded-full bg-[var(--color-primary)] px-5 py-2.5 text-white transition-all duration-150 hover:brightness-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary-focus)]"
                >
                  GitHub에서 보기
                </a>
              ) : null}
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="type-button-utility inline-flex cursor-pointer items-center justify-center rounded-full border border-black/[0.08] bg-[var(--color-surface-pearl)] px-5 py-2.5 text-[var(--color-ink-muted-80)] transition-all duration-150 hover:bg-[var(--color-canvas-parchment)] active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary-focus)]"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
