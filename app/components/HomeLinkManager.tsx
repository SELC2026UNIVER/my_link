"use client";

import { CheckCircle2, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  createAnonymousLink,
  formatFirestoreErrorMessage,
  type HomeLinkItem,
} from "@/app/lib/firestore-links";
import { LINK_ICON_LABELS, recommendIconForUrl } from "@/app/lib/icon-matcher";
import {
  formatDisplayUrl,
  MAX_ACTIVE_ITEMS,
  MAX_LINK_TITLE_LENGTH,
  validateLinkTitle,
  validateLinkUrl,
} from "@/app/lib/validators";
import { dummyLinks } from "@/app/links/links-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  AddLinkDialog,
  type AddLinkDraft,
  type AddLinkSubmitResult,
} from "./AddLinkDialog";
import CopyEmailButton from "./CopyEmailButton";
import { LinkCard } from "./LinkCard";

interface HomeLinkManagerProps {
  githubHref: string;
  email: string;
  intro: string;
}

/**
 * 루트(/) 홈 화면에서 링크 목록 조회·Firestore 모달 추가(AddLinkDialog)·인라인 편집·삭제를 관리하는 컴포넌트.
 */
export function HomeLinkManager({
  githubHref,
  email,
  intro,
}: HomeLinkManagerProps) {
  const [links, setLinks] = useState<HomeLinkItem[]>(() => [...dummyLinks]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editError, setEditError] = useState<string | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current !== null) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToastMessage(null);
      toastTimerRef.current = null;
    }, 3500);
  };

  const handleAddLink = async (
    draft: AddLinkDraft
  ): Promise<AddLinkSubmitResult> => {
    if (links.length >= MAX_ACTIVE_ITEMS) {
      return {
        ok: false,
        error: `항목은 최대 ${MAX_ACTIVE_ITEMS}개까지 등록할 수 있습니다`,
        field: "limit",
      };
    }

    try {
      const createdItem = await createAnonymousLink(draft);
      setLinks((prev) => [createdItem, ...prev]);
      showToast(`링크가 추가되었습니다 (${createdItem.title})`);
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        error: formatFirestoreErrorMessage(
          error,
          "링크를 저장하는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
        ),
      };
    }
  };

  const startInlineEdit = (item: HomeLinkItem) => {
    setEditingId(item.id);
    setEditTitle(item.title);
    setEditUrl(item.url);
    setEditError(null);
  };

  const cancelInlineEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditUrl("");
    setEditError(null);
  };

  const handleInlineSave = (event: FormEvent, targetId: string) => {
    event.preventDefault();

    const titleCheck = validateLinkTitle(editTitle);
    if (!titleCheck.valid) {
      setEditError(titleCheck.error ?? "제목을 입력해 주세요");
      return;
    }

    const urlCheck = validateLinkUrl(editUrl);
    if (!urlCheck.valid) {
      setEditError(
        urlCheck.error ??
          "올바른 URL 형식이 아닙니다 (예: https://example.com 또는 mailto:name@example.com)"
      );
      return;
    }

    const resolvedIcon = recommendIconForUrl(urlCheck.normalized);
    setLinks((prev) =>
      prev.map((item) =>
        item.id === targetId
          ? {
              ...item,
              title: titleCheck.normalized,
              url: urlCheck.normalized,
              icon: resolvedIcon,
              category: LINK_ICON_LABELS[resolvedIcon],
            }
          : item
      )
    );
    cancelInlineEdit();
    showToast(`링크가 수정되었습니다 (${titleCheck.normalized})`);
  };

  const handleDeleteLink = (item: HomeLinkItem) => {
    if (editingId === item.id) {
      cancelInlineEdit();
    }
    setLinks((prev) => prev.filter((link) => link.id !== item.id));
    showToast(`링크가 삭제되었습니다 (${item.title})`);
  };

  return (
    <>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3.5">
        <Button
          type="button"
          shape="pill"
          onClick={() => setDialogOpen(true)}
          className="h-auto min-h-11 cursor-pointer gap-2 rounded-full border border-black/10 bg-primary px-[22px] py-[11px] text-[17px] font-normal leading-none tracking-[-0.022em] text-primary-foreground shadow-[0_2px_10px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.06)] transition-all duration-150 hover:bg-[#333336] hover:shadow-[0_4px_14px_rgba(0,0,0,0.16),0_2px_4px_rgba(0,0,0,0.08)] active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary-focus)]"
        >
          <span
            className="inline-flex size-5 items-center justify-center rounded-full bg-white/15 text-white"
            aria-hidden="true"
          >
            <Plus className="size-3.5 stroke-[2.25]" />
          </span>
          <span>링크 추가</span>
        </Button>

        <a
          href={githubHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-full border border-[var(--color-primary)] bg-background px-[22px] py-[11px] text-[17px] font-normal leading-none tracking-[-0.022em] text-[var(--color-primary)] shadow-[0_1px_4px_rgba(0,0,0,0.05)] transition-all duration-150 hover:bg-[var(--color-primary)] hover:text-white hover:shadow-[0_2px_8px_rgba(0,0,0,0.10)] active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary-focus)]"
        >
          GitHub
        </a>

        <CopyEmailButton email={email} variant="secondary" />
      </div>

      <p className="type-body mx-auto mt-8 max-w-[640px] text-[var(--color-ink)]">
        {intro}
      </p>

      <section
        id="my-links"
        aria-label="내 링크 목록"
        className="mx-auto mt-10 max-w-[680px] scroll-mt-[112px] text-left"
      >
        <Card className="gap-4 rounded-[18px] border border-border bg-secondary/50 p-5 shadow-none ring-0 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <h2 className="text-[19px] font-semibold tracking-[-0.02em] text-foreground">
                내 링크 목록
              </h2>
              <Badge
                variant="secondary"
                className="rounded-full bg-card px-2.5 py-0.5 text-[12px] font-semibold text-muted-foreground"
              >
                전체 {links.length}개
              </Badge>
            </div>
            <p className="text-[12px] tracking-[-0.01em] text-muted-foreground">
              로컬 메모리 상태 · 모달 추가 &amp; 인라인 편집
            </p>
          </div>

          {links.length === 0 ? (
            <div className="rounded-[18px] border border-dashed border-border bg-card px-5 py-8 text-center">
              <p className="text-[15px] font-semibold text-foreground">
                등록된 링크가 없습니다
              </p>
              <p className="mt-1 text-[13px] text-muted-foreground">
                상단의 &apos;링크 추가&apos; 버튼을 눌러 새 링크를 추가해 보세요.
              </p>
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {links.map((item) => {
                const isEditing = editingId === item.id;

                if (isEditing) {
                  return (
                    <li key={item.id}>
                      <form
                        onSubmit={(event) => handleInlineSave(event, item.id)}
                        noValidate
                        className="flex flex-col gap-3 rounded-[18px] border border-primary/40 bg-card p-4"
                      >
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <div className="flex flex-col gap-1">
                            <Label
                              htmlFor={`edit-title-${item.id}`}
                              className="text-[12px] font-semibold text-foreground"
                            >
                              제목
                            </Label>
                            <Input
                              id={`edit-title-${item.id}`}
                              type="text"
                              value={editTitle}
                              maxLength={MAX_LINK_TITLE_LENGTH}
                              onChange={(event) => {
                                setEditTitle(
                                  event.target.value.slice(
                                    0,
                                    MAX_LINK_TITLE_LENGTH
                                  )
                                );
                                setEditError(null);
                              }}
                              className="h-9 rounded-lg text-[14px]"
                            />
                          </div>

                          <div className="flex flex-col gap-1">
                            <Label
                              htmlFor={`edit-url-${item.id}`}
                              className="text-[12px] font-semibold text-foreground"
                            >
                              URL
                            </Label>
                            <Input
                              id={`edit-url-${item.id}`}
                              type="text"
                              inputMode="url"
                              value={editUrl}
                              onChange={(event) => {
                                setEditUrl(event.target.value);
                                setEditError(null);
                              }}
                              className="h-9 rounded-lg text-[14px]"
                            />
                          </div>
                        </div>

                        {editError ? (
                          <p
                            role="alert"
                            className="text-[12px] font-semibold text-destructive"
                          >
                            {editError}
                          </p>
                        ) : null}

                        <div className="flex items-center justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            shape="pill"
                            onClick={cancelInlineEdit}
                            className="h-8 px-3.5 text-[13px] shadow-none"
                          >
                            취소
                          </Button>
                          <Button
                            type="submit"
                            size="sm"
                            shape="pill"
                            className="h-8 bg-primary px-4 text-[13px] text-primary-foreground shadow-[0_1px_6px_rgba(0,0,0,0.12)] hover:bg-[#333336]"
                          >
                            저장
                          </Button>
                        </div>
                      </form>
                    </li>
                  );
                }

                return (
                  <li key={item.id} className="flex items-stretch gap-2">
                    <LinkCard
                      title={item.title}
                      url={item.url}
                      subtitle={formatDisplayUrl(item.url)}
                      icon={item.icon}
                      category={item.category}
                      buttonStyle="card"
                      className="min-w-0 flex-1"
                    />
                    <div className="flex shrink-0 flex-col gap-1.5 sm:flex-row sm:items-stretch">
                      <button
                        type="button"
                        onClick={() => startInlineEdit(item)}
                        aria-label={`${item.title} 수정`}
                        title="인라인 수정"
                        className={cn(
                          "inline-flex flex-1 cursor-pointer items-center justify-center rounded-[14px] border border-border bg-card px-2.5 text-muted-foreground transition-colors sm:w-10 sm:rounded-[18px] sm:px-0",
                          "hover:border-primary/40 hover:bg-[var(--color-surface-pearl)] hover:text-primary active:scale-95",
                          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary-focus)]"
                        )}
                      >
                        <Pencil className="size-3.5" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteLink(item)}
                        aria-label={`${item.title} 삭제`}
                        title="삭제"
                        className={cn(
                          "inline-flex flex-1 cursor-pointer items-center justify-center rounded-[14px] border border-border bg-card px-2.5 text-muted-foreground transition-colors sm:w-10 sm:rounded-[18px] sm:px-0",
                          "hover:border-destructive/40 hover:bg-destructive/5 hover:text-destructive active:scale-95",
                          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary-focus)]"
                        )}
                      >
                        <Trash2 className="size-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </section>

      <AddLinkDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        activeItemCount={links.length}
        onAddLink={handleAddLink}
      />

      {toastMessage ? (
        <div
          role="status"
          aria-live="polite"
          className="fixed right-5 bottom-5 z-50 flex items-center gap-2 rounded-full border border-border bg-foreground px-4 py-2.5 text-[14px] font-normal tracking-[-0.016em] text-background"
        >
          <CheckCircle2
            className="size-4 shrink-0 text-[#4cd964]"
            aria-hidden="true"
          />
          <span>{toastMessage}</span>
        </div>
      ) : null}
    </>
  );
}
