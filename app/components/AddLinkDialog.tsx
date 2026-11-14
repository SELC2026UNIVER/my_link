"use client";

import { AlertCircle } from "lucide-react";
import { useState, type FocusEvent, type FormEvent } from "react";
import { LINK_ICON_LABELS, recommendIconForUrl } from "@/app/lib/icon-matcher";
import type { LinkIcon } from "@/app/lib/types";
import {
  MAX_ACTIVE_ITEMS,
  MAX_LINK_TITLE_LENGTH,
  normalizeUrlInput,
  validateLinkTitle,
  validateLinkUrl,
} from "@/app/lib/validators";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { LinkGlyph } from "./LinkGlyph";

const SELECTABLE_LINK_ICONS: LinkIcon[] = [
  "link",
  "instagram",
  "youtube",
  "tiktok",
  "x",
  "threads",
  "github",
  "kakao",
  "naver",
  "blog",
  "email",
  "shop",
  "portfolio",
];

export interface AddLinkDraft {
  title: string;
  url: string;
  icon: LinkIcon;
}

export type AddLinkSubmitResult =
  | { ok: true }
  | { ok: false; error: string; field?: "title" | "url" | "limit" };

interface AddLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeItemCount: number;
  onAddLink: (draft: AddLinkDraft) => AddLinkSubmitResult;
}

/**
 * PRD F-02 규칙(제목 1~50자, URL 스킴/자동 보정, 도메인 아이콘 자동 추천,
 * 오류 피드백 #e30000)을 따르는 shadcn/ui Dialog 기반 링크 추가 폼.
 */
export function AddLinkDialog({
  open,
  onOpenChange,
  activeItemCount,
  onAddLink,
}: AddLinkDialogProps) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [icon, setIcon] = useState<LinkIcon>("link");
  const [iconManuallySelected, setIconManuallySelected] = useState(false);

  const [titleError, setTitleError] = useState<string | null>(null);
  const [urlError, setUrlError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isAtLimit = activeItemCount >= MAX_ACTIVE_ITEMS;
  const isTitleAtLimit = title.length >= MAX_LINK_TITLE_LENGTH;

  const resetForm = () => {
    setTitle("");
    setUrl("");
    setIcon("link");
    setIconManuallySelected(false);
    setTitleError(null);
    setUrlError(null);
    setSubmitError(null);
  };

  const handleDialogOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      resetForm();
    }
    onOpenChange(nextOpen);
  };

  const handleTitleChange = (nextValue: string) => {
    const clamped = nextValue.slice(0, MAX_LINK_TITLE_LENGTH);
    setTitle(clamped);
    setSubmitError(null);
    if (titleError) {
      const check = validateLinkTitle(clamped);
      setTitleError(check.valid ? null : (check.error ?? null));
    }
  };

  const handleTitleBlur = (event: FocusEvent<HTMLInputElement>) => {
    if (event.relatedTarget?.getAttribute("data-cancel-action") === "true") {
      return;
    }
    const check = validateLinkTitle(title);
    setTitleError(check.valid ? null : (check.error ?? null));
  };

  const handleUrlChange = (nextValue: string) => {
    setUrl(nextValue);
    setSubmitError(null);
    if (!iconManuallySelected) {
      setIcon(recommendIconForUrl(nextValue));
    }
    if (urlError) {
      const check = validateLinkUrl(nextValue);
      setUrlError(check.valid ? null : (check.error ?? null));
    }
  };

  const handleUrlBlur = (event: FocusEvent<HTMLInputElement>) => {
    if (event.relatedTarget?.getAttribute("data-cancel-action") === "true") {
      return;
    }
    const trimmed = url.trim();
    if (!trimmed) {
      const check = validateLinkUrl("");
      setUrlError(check.error ?? null);
      return;
    }

    const normalized = normalizeUrlInput(trimmed);
    const check = validateLinkUrl(normalized);
    if (check.valid) {
      setUrl(check.normalized);
      setUrlError(null);
      if (!iconManuallySelected) {
        setIcon(recommendIconForUrl(check.normalized));
      }
      return;
    }

    setUrlError(check.error ?? null);
  };

  const handleIconChange = (nextValue: string | null) => {
    if (!nextValue) return;
    setIcon(nextValue as LinkIcon);
    setIconManuallySelected(true);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);

    const titleCheck = validateLinkTitle(title);
    const urlCheck = validateLinkUrl(url);

    setTitleError(titleCheck.valid ? null : (titleCheck.error ?? null));
    setUrlError(urlCheck.valid ? null : (urlCheck.error ?? null));

    if (!titleCheck.valid || !urlCheck.valid) {
      return;
    }

    const resolvedIcon = iconManuallySelected
      ? icon
      : recommendIconForUrl(urlCheck.normalized);

    const result = onAddLink({
      title: titleCheck.normalized,
      url: urlCheck.normalized,
      icon: resolvedIcon,
    });

    if (!result.ok) {
      if (result.field === "title") {
        setTitleError(result.error);
      } else if (result.field === "url") {
        setUrlError(result.error);
      } else {
        setSubmitError(result.error);
      }
      return;
    }

    handleDialogOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="gap-5 rounded-[18px] border border-border bg-card p-6 text-foreground shadow-product ring-0 sm:max-w-[440px]">
        <DialogHeader className="gap-1.5 pr-7">
          <DialogTitle className="text-[19px] font-semibold tracking-[-0.02em] text-foreground">
            새 링크 추가
          </DialogTitle>
          <DialogDescription className="text-[14px] leading-[1.45] text-muted-foreground">
            제목과 URL을 입력하면 도메인에 맞춰 아이콘이 자동 추천됩니다.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-2">
              <Label
                htmlFor="add-link-title"
                className="text-[14px] font-semibold text-foreground"
              >
                <span>제목</span>
                <span className="text-destructive" aria-hidden="true">
                  *
                </span>
              </Label>
              <span
                className={cn(
                  "text-[12px] tabular-nums",
                  isTitleAtLimit || titleError
                    ? "font-semibold text-destructive"
                    : "text-muted-foreground"
                )}
              >
                {title.length}/{MAX_LINK_TITLE_LENGTH}
              </span>
            </div>

            <Input
              id="add-link-title"
              type="text"
              value={title}
              maxLength={MAX_LINK_TITLE_LENGTH}
              onChange={(event) => handleTitleChange(event.target.value)}
              onBlur={handleTitleBlur}
              placeholder="예: 내 인스타그램"
              aria-required="true"
              aria-invalid={Boolean(titleError)}
              aria-describedby={titleError ? "add-link-title-error" : undefined}
              className="h-10 rounded-[10px] border-border bg-background px-3 text-[15px]"
              autoFocus
            />

            {titleError ? (
              <p
                id="add-link-title-error"
                role="alert"
                className="text-[13px] font-normal text-destructive"
              >
                {titleError}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="add-link-url"
              className="text-[14px] font-semibold text-foreground"
            >
              <span>URL</span>
              <span className="text-destructive" aria-hidden="true">
                *
              </span>
            </Label>

            <Input
              id="add-link-url"
              type="text"
              inputMode="url"
              value={url}
              onChange={(event) => handleUrlChange(event.target.value)}
              onBlur={handleUrlBlur}
              placeholder="https://example.com 또는 mailto:name@example.com"
              aria-required="true"
              aria-invalid={Boolean(urlError)}
              aria-describedby={
                urlError ? "add-link-url-error" : "add-link-url-hint"
              }
              className="h-10 rounded-[10px] border-border bg-background px-3 text-[15px]"
            />

            {urlError ? (
              <p
                id="add-link-url-error"
                role="alert"
                className="text-[13px] font-normal text-destructive"
              >
                {urlError}
              </p>
            ) : (
              <p
                id="add-link-url-hint"
                className="text-[12px] text-muted-foreground"
              >
                프로토콜을 생략하면 포커스 이동 또는 저장 시 https://가 자동 보정됩니다.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-2">
              <Label
                htmlFor="add-link-icon"
                className="text-[14px] font-semibold text-foreground"
              >
                아이콘
              </Label>
              <span className="text-[12px] text-muted-foreground">
                {iconManuallySelected
                  ? "직접 선택"
                  : icon === "link"
                    ? "기본 아이콘"
                    : "도메인 자동 추천"}
              </span>
            </div>

            <Select value={icon} onValueChange={handleIconChange}>
              <SelectTrigger
                id="add-link-icon"
                aria-label="링크 아이콘 선택"
                className="h-10 w-full rounded-[10px] border-border bg-background px-3 text-[15px]"
              >
                <SelectValue>
                  <span className="flex items-center gap-2 text-foreground">
                    <LinkGlyph
                      icon={icon}
                      className="size-4 text-primary"
                    />
                    <span>{LINK_ICON_LABELS[icon]}</span>
                  </span>
                </SelectValue>
              </SelectTrigger>

              <SelectContent className="rounded-[12px] border border-border bg-card shadow-product">
                {SELECTABLE_LINK_ICONS.map((iconKey) => (
                  <SelectItem
                    key={iconKey}
                    value={iconKey}
                    className="min-h-9 rounded-lg px-2.5 text-[14px]"
                  >
                    <LinkGlyph
                      icon={iconKey}
                      className="size-4 text-muted-foreground"
                    />
                    <span>{LINK_ICON_LABELS[iconKey]}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {submitError || isAtLimit ? (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-[10px] border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-[13px] text-destructive"
            >
              <AlertCircle
                className="mt-0.5 size-4 shrink-0"
                aria-hidden="true"
              />
              <span>
                {submitError ??
                  `항목은 최대 ${MAX_ACTIVE_ITEMS}개까지 등록할 수 있습니다`}
              </span>
            </div>
          ) : null}

          <DialogFooter className="-mx-6 -mb-6 mt-2 rounded-b-[18px] border-t border-border bg-secondary/70 px-6 py-4">
            <Button
              type="button"
              variant="outline"
              shape="pill"
              data-cancel-action="true"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => handleDialogOpenChange(false)}
              className="min-h-10 px-4 text-[14px] font-normal"
            >
              취소
            </Button>
            <Button
              type="submit"
              variant="default"
              shape="pill"
              disabled={isAtLimit}
              className="min-h-11 min-w-[92px] bg-primary px-[22px] text-[15px] font-normal tracking-[-0.022em] text-primary-foreground transition-all duration-150 hover:bg-primary hover:brightness-110 active:translate-y-0 active:scale-95 focus-visible:border-[var(--color-primary-focus)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary-focus)] focus-visible:ring-0"
            >
              저장
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
