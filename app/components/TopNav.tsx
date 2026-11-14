"use client";

import { AlertCircle, LogIn, LogOut, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "./AuthProvider";

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
  { label: "링크 목록", href: "/links" },
  { label: "공개 프로필", href: "/gildong" },
  { label: "연락처", href: "#contact" },
];

export default function TopNav({
  name,
  handle,
  status,
  contactHref = "#contact",
}: TopNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const {
    user,
    isLoading: isAuthLoading,
    isAuthActionPending,
    authError,
    signInWithGoogle,
    signOut,
    clearAuthError,
  } = useAuth();

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
            {navItems.map((item) =>
              item.href.startsWith("/") ? (
                <Link
                  key={item.href}
                  href={item.href}
                  className="type-nav-link whitespace-nowrap text-white/80 transition-colors hover:text-white focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0071e3]"
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.href}
                  href={item.href}
                  className="type-nav-link whitespace-nowrap text-white/80 transition-colors hover:text-white focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0071e3]"
                >
                  {item.label}
                </a>
              )
            )}
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
              {navItems.map((item) =>
                item.href.startsWith("/") ? (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="type-body border-b border-white/[0.08] py-3 text-white/90 transition-colors last:border-b-0 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0071e3]"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="type-body border-b border-white/[0.08] py-3 text-white/90 transition-colors last:border-b-0 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0071e3]"
                  >
                    {item.label}
                  </a>
                )
              )}
            </div>
          </div>
        ) : null}
      </nav>

      <header className="sticky top-0 z-40 h-[52px] w-full border-b border-black/[0.08] bg-[rgba(245,245,247,0.8)] backdrop-blur-[20px] backdrop-saturate-[180%]">
        <div className="mx-auto flex h-full max-w-[980px] items-center justify-between gap-3 px-4 min-[401px]:gap-4 min-[401px]:px-5 sm:px-6">
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

          <div className="flex shrink-0 items-center gap-2.5 min-[401px]:gap-4 sm:gap-5">
            <Link
              href="/links"
              className="type-nav-link hidden whitespace-nowrap text-[var(--color-ink-muted-80)] transition-colors hover:text-[var(--color-primary)] focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0071e3] min-[480px]:inline"
            >
              링크 목록
            </Link>
            <Link
              href="/gildong"
              className="type-nav-link hidden whitespace-nowrap text-[var(--color-ink-muted-80)] transition-colors hover:text-[var(--color-primary)] focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0071e3] min-[560px]:inline"
            >
              공개 프로필
            </Link>
            <a
              href="#study-log"
              className="type-nav-link hidden whitespace-nowrap text-[var(--color-ink-muted-80)] transition-colors hover:text-[var(--color-primary)] focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0071e3] md:inline"
            >
              오늘의 기록
            </a>
            <a
              href="#projects"
              className="type-nav-link hidden whitespace-nowrap text-[var(--color-ink-muted-80)] transition-colors hover:text-[var(--color-primary)] focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0071e3] md:inline"
            >
              연습 작품
            </a>
            <a
              href={contactHref}
              className="type-nav-link hidden whitespace-nowrap text-[var(--color-ink-muted-80)] transition-colors hover:text-[var(--color-primary)] focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0071e3] sm:inline"
            >
              연락하기
            </a>

            {isAuthLoading ? (
              <div
                role="status"
                aria-label="로그인 상태 확인 중"
                className="h-8 w-[82px] animate-pulse rounded-full border border-black/[0.06] bg-[#e8e8ed]"
              />
            ) : user ? (
              <div className="flex items-center gap-2">
                <span
                  title={user.email ?? `@${user.displayName}`}
                  className="hidden max-w-[132px] truncate rounded-full border border-black/[0.06] bg-white/80 px-2.5 py-1 text-[12px] font-medium tracking-[-0.012em] text-[#424245] min-[401px]:inline-block"
                >
                  @{user.displayName}
                </span>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  shape="pill"
                  disabled={isAuthActionPending}
                  aria-busy={isAuthActionPending}
                  aria-label="로그아웃"
                  onClick={() => {
                    void signOut();
                  }}
                  className="h-8 gap-1.5 border border-black/[0.08] bg-[#e8e8ed] px-3.5 text-[12px] font-medium tracking-[-0.014em] text-[#1d1d1f] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all hover:bg-[#dcdce1] active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0071e3] disabled:opacity-60"
                >
                  {isAuthActionPending ? (
                    <Spinner decorative className="size-3.5 text-[#1d1d1f]" />
                  ) : (
                    <LogOut className="size-3.5 text-[#515154]" aria-hidden="true" />
                  )}
                  <span>로그아웃</span>
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                shape="pill"
                disabled={isAuthActionPending}
                aria-busy={isAuthActionPending}
                aria-label="Google 계정으로 로그인"
                onClick={() => {
                  void signInWithGoogle();
                }}
                className="h-8 gap-1.5 border border-black/[0.08] bg-[#e8e8ed] px-3.5 text-[12px] font-medium tracking-[-0.014em] text-[#1d1d1f] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all hover:bg-[#dcdce1] active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0071e3] disabled:opacity-60"
              >
                {isAuthActionPending ? (
                  <>
                    <Spinner decorative className="size-3.5 text-[#1d1d1f]" />
                    <span>로그인 중...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="size-3.5 text-[#515154]" aria-hidden="true" />
                    <span>로그인</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </header>

      {authError ? (
        <div
          role="alert"
          className="border-b border-destructive/20 bg-destructive/5 px-4 py-2 text-[13px] text-destructive"
        >
          <div className="mx-auto flex max-w-[980px] items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
              <span>{authError}</span>
            </div>
            <button
              type="button"
              onClick={clearAuthError}
              aria-label="인증 오류 닫기"
              className="inline-flex size-7 items-center justify-center rounded-full text-destructive/80 transition-colors hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="size-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
