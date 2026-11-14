"use client";

import { AlertCircle, AlertTriangle } from "lucide-react";
import type { HomeLinkItem } from "@/app/lib/firestore-links";
import { formatDisplayUrl } from "@/app/lib/validators";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { LinkGlyph } from "./LinkGlyph";

interface DeleteLinkDialogProps {
  target: HomeLinkItem | null;
  open: boolean;
  isDeleting: boolean;
  errorMessage: string | null;
  onOpenChange: (open: boolean) => void;
  onConfirmDelete: () => Promise<void> | void;
}

/**
 * 링크 삭제 전 대상 링크명과 복구 불가 경고를 표시하는 shadcn/ui Dialog 기반 확인 모달.
 */
export function DeleteLinkDialog({
  target,
  open,
  isDeleting,
  errorMessage,
  onOpenChange,
  onConfirmDelete,
}: DeleteLinkDialogProps) {
  const handleDialogOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && isDeleting) {
      return;
    }
    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent
        showCloseButton={!isDeleting}
        className="gap-5 rounded-[18px] border border-border bg-card p-6 text-foreground shadow-product ring-0 sm:max-w-[420px]"
      >
        <DialogHeader className="gap-1.5 pr-7">
          <DialogTitle className="text-[19px] font-semibold tracking-[-0.02em] text-foreground">
            정말 삭제하시겠습니까?
          </DialogTitle>
          <DialogDescription className="text-[14px] leading-[1.45] text-muted-foreground">
            선택한 링크가 내 링크 목록에서 영구적으로 삭제됩니다.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          {target ? (
            <div className="flex items-center gap-3 rounded-[12px] border border-border bg-secondary/60 px-3.5 py-3">
              <span
                aria-hidden="true"
                className="flex size-9 shrink-0 items-center justify-center rounded-[10px] border border-black/[0.05] bg-card text-foreground"
              >
                <LinkGlyph icon={target.icon} className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-semibold tracking-[-0.016em] text-foreground">
                  {target.title}
                </p>
                <p className="truncate text-[12px] text-muted-foreground">
                  {formatDisplayUrl(target.url) || target.url}
                </p>
              </div>
            </div>
          ) : null}

          <p className="flex items-center gap-2 rounded-[10px] border border-destructive/25 bg-destructive/5 px-3 py-2.5 text-[13px] font-semibold text-destructive">
            <AlertTriangle className="size-4 shrink-0" aria-hidden="true" />
            <span>이 작업은 되돌릴 수 없습니다</span>
          </p>

          {errorMessage ? (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-[10px] border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-[13px] text-destructive"
            >
              <AlertCircle
                className="mt-0.5 size-4 shrink-0"
                aria-hidden="true"
              />
              <span>{errorMessage}</span>
            </div>
          ) : null}
        </div>

        <DialogFooter className="-mx-6 -mb-6 mt-1 rounded-b-[18px] border-t border-border bg-secondary/70 px-6 py-4">
          <Button
            type="button"
            variant="outline"
            shape="pill"
            disabled={isDeleting}
            onClick={() => handleDialogOpenChange(false)}
            className="min-h-10 px-4 text-[14px] font-normal shadow-[0_1px_4px_rgba(0,0,0,0.05)]"
          >
            취소
          </Button>
          <Button
            type="button"
            variant="destructive"
            shape="pill"
            disabled={isDeleting}
            aria-busy={isDeleting}
            onClick={() => {
              void onConfirmDelete();
            }}
            className="min-h-11 min-w-[112px] gap-2 border border-destructive/20 bg-destructive px-[22px] text-[15px] font-normal tracking-[-0.022em] text-destructive-foreground shadow-[0_2px_10px_rgba(227,0,0,0.18)] transition-all duration-150 hover:bg-destructive/90 active:translate-y-0 active:scale-95 focus-visible:border-destructive focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-destructive focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-65"
          >
            {isDeleting ? (
              <>
                <Spinner
                  decorative
                  className="size-4 text-destructive-foreground"
                />
                <span>삭제 중...</span>
              </>
            ) : (
              <span>삭제하기</span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
