"use client";

import { useEffect, useState } from "react";

interface TopNavProps {
  name: string;
  handle: string;
  status: string;
  contactHref?: string;
}

const navItems = [
  { label: "소개", href: "#about" },
  { label: "공부 기록", href: "#study-log" },
  { label: "연습 작품", href: "#projects" },
  { label: "배우는 기술", href: "#stack" },
  { label: "연락처", href: "#contact" },
];

export default function TopNav({
  name,
  handle,
  status,
  contactHref = "#contact",
}: TopNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  return (
    <>
      <nav
        aria-label="Global Navigation"
        className="w-full bg-[var(--color-surface-black)] text-[var(--color-body-on-dark)]"
      >
        <div className="mx-auto flex h-[44px] max-w-[980px] items-center justify-between px-5 sm:px-6">
          <a
            href="#about"
            className="type-nav-link inline-flex items-center gap-2 text-white/90 transition-colors hover:text-white focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0071e3]"
          >
            <svg
              aria-hidden="true"
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              className="shrink-0 text-white"
            >
              <rect
                x="2"
                y="2"
                width="12"
                height="12"
                rx="3.5"
                stroke="currentColor"
                strokeWidth="1.4"
              />
              <path
                d="M5.5 8.5L7.2 10.2L10.8 6.2"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="whitespace-nowrap">{handle}</span>
          </a>

          <div className="hidden items-center gap-7 min-[834px]:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="type-nav-link whitespace-nowrap text-white/80 transition-colors hover:text-white focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0071e3]"
              >
                {item.label}
              </a>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "메뉴 닫기" : "메뉴 열기"}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white/90 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0071e3] min-[834px]:hidden"
          >
            <svg
              aria-hidden="true"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              {mobileOpen ? (
                <>
                  <path
                    d="M3.5 3.5L12.5 12.5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                  <path
                    d="M12.5 3.5L3.5 12.5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </>
              ) : (
                <>
                  <path
                    d="M2.5 5.5H13.5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                  <path
                    d="M2.5 10.5H13.5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </>
              )}
            </svg>
          </button>
        </div>

        {mobileOpen ? (
          <div className="border-t border-white/10 bg-[var(--color-surface-black)] px-5 pb-5 pt-3 min-[834px]:hidden">
            <div className="mx-auto flex max-w-[980px] flex-col">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="type-body border-b border-white/[0.08] py-3 text-white/90 transition-colors last:border-b-0 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0071e3]"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        ) : null}
      </nav>

      <header className="sticky top-0 z-40 h-[52px] w-full border-b border-black/[0.08] bg-[rgba(245,245,247,0.8)] backdrop-blur-[20px] backdrop-saturate-[180%]">
        <div className="mx-auto flex h-full max-w-[980px] items-center justify-between gap-4 px-5 sm:px-6">
          <div className="flex min-w-0 items-baseline gap-2.5">
            <a
              href="#about"
              className="type-tagline whitespace-nowrap text-[var(--color-ink)] focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0071e3]"
            >
              {name}
            </a>
            <span className="type-fine-print hidden whitespace-nowrap text-[var(--color-ink-muted-48)] sm:inline">
              {status}
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-5">
            <a
              href="#study-log"
              className="type-nav-link hidden whitespace-nowrap text-[var(--color-ink-muted-80)] transition-colors hover:text-[var(--color-primary)] focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0071e3] sm:inline"
            >
              오늘의 기록
            </a>
            <a
              href="#projects"
              className="type-nav-link hidden whitespace-nowrap text-[var(--color-ink-muted-80)] transition-colors hover:text-[var(--color-primary)] focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0071e3] sm:inline"
            >
              연습 작품
            </a>
            <a
              href={contactHref}
              className="type-nav-link inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full bg-[var(--color-primary)] px-3.5 py-1.5 text-white transition-transform duration-150 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0071e3]"
            >
              연락하기
            </a>
          </div>
        </div>
      </header>
    </>
  );
}
