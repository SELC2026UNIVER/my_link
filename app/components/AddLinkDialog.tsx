"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import { useState, type FocusEvent } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { LINK_ICON_LABELS, recommendIconForUrl } from "@/app/lib/icon-matcher";
import type { LinkIcon } from "@/app/lib/types";
import {
  addLinkFormSchema,
  LINK_ICON_VALUES,
  MAX_ACTIVE_ITEMS,
  MAX_LINK_TITLE_LENGTH,
  normalizeUrlInput,
  validateLinkUrl,
  type AddLinkFormValues,
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
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { LinkGlyph } from "./LinkGlyph";

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
  onAddLink: (
    draft: AddLinkDraft
  ) => Promise<AddLinkSubmitResult> | AddLinkSubmitResult;
}

const DEFAULT_FORM_VALUES: AddLinkFormValues = {
  title: "",
  url: "",
  icon: "link",
};

/**
 * Zod + React Hook Form 기반 링크 추가 모달 다이얼로그.
 * 제목 공백, URL 형식 검증 및 성공 시 입력값 초기화를 수행한다.
 */
export function AddLinkDialog({
  open,
  onOpenChange,
  activeItemCount,
  onAddLink,
}: AddLinkDialogProps) {
  const [iconManuallySelected, setIconManuallySelected] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    reset,
    formState: { errors },
  } = useForm<AddLinkFormValues>({
    resolver: zodResolver(addLinkFormSchema),
    defaultValues: DEFAULT_FORM_VALUES,
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const watchedTitle = useWatch({ control, name: "title" }) ?? "";
  const watchedIcon = useWatch({ control, name: "icon" }) ?? "link";

  const isAtLimit = activeItemCount >= MAX_ACTIVE_ITEMS;
  const isTitleAtLimit = watchedTitle.length >= MAX_LINK_TITLE_LENGTH;

  const resetDialogForm = () => {
    reset(DEFAULT_FORM_VALUES);
    setIconManuallySelected(false);
    setSubmitError(null);
  };

  const handleDialogOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && isSubmitting) {
      return;
    }
    if (!nextOpen) {
      resetDialogForm();
    }
    onOpenChange(nextOpen);
  };

  const titleField = register("title");
  const urlField = register("url");

  const handleTitleBlur = (event: FocusEvent<HTMLInputElement>) => {
    if (event.relatedTarget?.getAttribute("data-cancel-action") === "true") {
      return;
    }
    titleField.onBlur(event);
  };

  const handleUrlBlur = (event: FocusEvent<HTMLInputElement>) => {
    if (event.relatedTarget?.getAttribute("data-cancel-action") === "true") {
      return;
    }
    const trimmed = event.target.value.trim();
    if (trimmed) {
      const check = validateLinkUrl(trimmed);
      if (check.valid) {
        setValue("url", check.normalized, { shouldValidate: true });
        if (!iconManuallySelected) {
          setValue("icon", recommendIconForUrl(check.normalized), {
            shouldValidate: false,
          });
        }
        return;
      }
    }
    urlField.onBlur(event);
  };

  const onValidSubmit = async (values: AddLinkFormValues) => {
    if (isSubmitting) return;
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const urlCheck = validateLinkUrl(values.url);
      const normalizedUrl = urlCheck.valid
        ? urlCheck.normalized
        : normalizeUrlInput(values.url);

      const resolvedIcon = iconManuallySelected
        ? values.icon
        : recommendIconForUrl(normalizedUrl);

      const result = await onAddLink({
        title: values.title.trim(),
        url: normalizedUrl,
        icon: resolvedIcon,
      });

      if (!result.ok) {
        if (result.field === "title") {
          setError("title", { type: "manual", message: result.error });
        } else if (result.field === "url") {
          setError("url", { type: "manual", message: result.error });
        } else {
          setSubmitError(result.error);
        }
        return;
      }

      // 검증 및 Firestore 저장 성공 시 모든 입력 칸을 비우고 다이얼로그를 닫는다.
      resetDialogForm();
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
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

        <form
          onSubmit={handleSubmit(onValidSubmit)}
          noValidate
          className="flex flex-col gap-4"
        >
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
                  isTitleAtLimit || errors.title
                    ? "font-semibold text-destructive"
                    : "text-muted-foreground"
                )}
              >
                {watchedTitle.length}/{MAX_LINK_TITLE_LENGTH}
              </span>
            </div>

            <Input
              id="add-link-title"
              type="text"
              maxLength={MAX_LINK_TITLE_LENGTH}
              placeholder="예: 내 인스타그램"
              aria-required="true"
              aria-invalid={Boolean(errors.title)}
              aria-describedby={errors.title ? "add-link-title-error" : undefined}
              className="h-10 rounded-[10px] border-border bg-background px-3 text-[15px]"
              autoFocus
              {...titleField}
              onChange={(event) => {
                titleField.onChange(event);
                setSubmitError(null);
              }}
              onBlur={handleTitleBlur}
            />

            {errors.title?.message ? (
              <p
                id="add-link-title-error"
                role="alert"
                className="text-[13px] font-normal text-destructive"
              >
                {errors.title.message}
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
              placeholder="https://example.com 또는 mailto:name@example.com"
              aria-required="true"
              aria-invalid={Boolean(errors.url)}
              aria-describedby={
                errors.url ? "add-link-url-error" : "add-link-url-hint"
              }
              className="h-10 rounded-[10px] border-border bg-background px-3 text-[15px]"
              {...urlField}
              onChange={(event) => {
                urlField.onChange(event);
                setSubmitError(null);
                if (!iconManuallySelected) {
                  setValue("icon", recommendIconForUrl(event.target.value), {
                    shouldValidate: false,
                  });
                }
              }}
              onBlur={handleUrlBlur}
            />

            {errors.url?.message ? (
              <p
                id="add-link-url-error"
                role="alert"
                className="text-[13px] font-normal text-destructive"
              >
                {errors.url.message}
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
                  : watchedIcon === "link"
                    ? "기본 아이콘"
                    : "도메인 자동 추천"}
              </span>
            </div>

            <Controller
              control={control}
              name="icon"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(nextValue) => {
                    if (!nextValue) return;
                    field.onChange(nextValue as LinkIcon);
                    setIconManuallySelected(true);
                  }}
                >
                  <SelectTrigger
                    id="add-link-icon"
                    aria-label="링크 아이콘 선택"
                    className="h-10 w-full rounded-[10px] border-border bg-background px-3 text-[15px]"
                  >
                    <SelectValue>
                      <span className="flex items-center gap-2 text-foreground">
                        <LinkGlyph
                          icon={field.value}
                          className="size-4 text-primary"
                        />
                        <span>{LINK_ICON_LABELS[field.value]}</span>
                      </span>
                    </SelectValue>
                  </SelectTrigger>

                  <SelectContent className="rounded-[12px] border border-border bg-card shadow-product">
                    {LINK_ICON_VALUES.map((iconKey) => (
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
              )}
            />
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
              disabled={isSubmitting}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => handleDialogOpenChange(false)}
              className="min-h-10 px-4 text-[14px] font-normal shadow-[0_1px_4px_rgba(0,0,0,0.05)]"
            >
              취소
            </Button>
            <Button
              type="submit"
              variant="default"
              shape="pill"
              disabled={isAtLimit || isSubmitting}
              aria-busy={isSubmitting}
              className="min-h-11 min-w-[104px] gap-2 border border-black/10 bg-primary px-[22px] text-[15px] font-normal tracking-[-0.022em] text-primary-foreground shadow-[0_2px_10px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.06)] transition-all duration-150 hover:bg-[#333336] hover:shadow-[0_4px_14px_rgba(0,0,0,0.16)] active:translate-y-0 active:scale-95 focus-visible:border-[var(--color-primary-focus)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary-focus)] focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-65"
            >
              {isSubmitting ? (
                <>
                  <Spinner decorative className="size-4 text-primary-foreground" />
                  <span>저장 중...</span>
                </>
              ) : (
                <span>저장</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
