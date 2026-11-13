"use client";

import { useState } from "react";

interface CopyEmailButtonProps {
  email: string;
  variant?: "primary" | "secondary" | "pearl";
  label?: string;
}

export default function CopyEmailButton({
  email,
  variant = "primary",
  label = "이메일 복사",
}: CopyEmailButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = email;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
    }

    window.setTimeout(() => setCopied(false), 2000);
  };

  const variantClasses =
    variant === "primary"
      ? "bg-[var(--color-primary)] text-white border border-transparent hover:brightness-105"
      : variant === "pearl"
        ? "bg-[var(--color-surface-pearl)] text-[var(--color-ink-muted-80)] border border-black/[0.08] hover:bg-white"
        : "bg-transparent text-[var(--color-primary)] border border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white";

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-live="polite"
      className={`inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full px-[22px] py-[11px] text-[17px] font-normal leading-none tracking-[-0.022em] transition-all duration-150 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary-focus)] ${variantClasses}`}
    >
      {copied ? (
        <>
          <svg
            aria-hidden="true"
            width="15"
            height="15"
            viewBox="0 0 16 16"
            fill="none"
            className="shrink-0"
          >
            <path
              d="M3.5 8.5L6.5 11.5L12.5 5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>복사됨</span>
        </>
      ) : (
        <span>{label}</span>
      )}
    </button>
  );
}
