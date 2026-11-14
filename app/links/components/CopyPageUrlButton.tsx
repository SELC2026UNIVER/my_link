"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

/**
 * 현재 마이링크 페이지 URL을 클립보드에 복사하는 TDS 스타일 필 버튼.
 */
export function CopyPageUrlButton() {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleCopy = async () => {
    const targetUrl = window.location.href;
    try {
      await navigator.clipboard.writeText(targetUrl);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = targetUrl;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }

    setCopied(true);
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => {
      setCopied(false);
      timerRef.current = null;
    }, 2000);
  };

  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      shape="pill"
      onClick={handleCopy}
      aria-live="polite"
      className="h-8 gap-1.5 bg-[#e8f3ff] px-3 text-[13px] font-semibold text-[#1b64da] hover:bg-[#d8ebff] active:scale-95 focus-visible:ring-[#3182f6]"
    >
      {copied ? (
        <>
          <Check className="size-3.5" aria-hidden="true" />
          <span>주소 복사됨</span>
        </>
      ) : (
        <>
          <Copy className="size-3.5" aria-hidden="true" />
          <span>링크 공유</span>
        </>
      )}
    </Button>
  );
}
