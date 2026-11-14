"use client";

import { AlertCircle, CheckCircle2, Pencil, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import {
  createAnonymousLink,
  deleteAnonymousLink,
  fetchAnonymousLinks,
  formatFirestoreErrorMessage,
  resolveUpdatedLinkIcon,
  updateAnonymousLink,
  type HomeLinkItem,
} from "@/app/lib/firestore-links";
import {
  formatDisplayUrl,
  MAX_ACTIVE_ITEMS,
  MAX_LINK_TITLE_LENGTH,
  validateLinkTitle,
  validateLinkUrl,
} from "@/app/lib/validators";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import {
  AddLinkDialog,
  type AddLinkDraft,
  type AddLinkSubmitResult,
} from "./AddLinkDialog";
import CopyEmailButton from "./CopyEmailButton";
import { DeleteLinkDialog } from "./DeleteLinkDialog";
import { LinkCard } from "./LinkCard";

interface HomeLinkManagerProps {
  githubHref: string;
  email: string;
  intro: string;
}

/**
 * 루트(/) 홈 화면에서 Firestore(users/anonymous/links) 링크 목록 조회·모달 추가(AddLinkDialog) 및
 * 인라인 편집·삭제 UI를 관리하는 컴포넌트.
 */
export function HomeLinkManager({
  githubHref,
  email,
  intro,
}: HomeLinkManagerProps) {
  const [links, setLinks] = useState<HomeLinkItem[]>([]);
  const [isLoadingLinks, setIsLoadingLinks] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editError, setEditError] = useState<string | null>(null);
  const [editErrorField, setEditErrorField] = useState<
    "title" | "url" | "submit" | null
  >(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<HomeLinkItem | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);
  const isActionBusy = isUpdating || isDeleting;

  useEffect(() => {
    let isCancelled = false;

    async function loadInitialLinks() {
      try {
        const fetchedLinks = await fetchAnonymousLinks();
        if (!isCancelled) {
          setLinks(fetchedLinks);
          setLoadError(null);
        }
      } catch (error) {
        if (!isCancelled) {
          setLoadError(
            formatFirestoreErrorMessage(
              error,
              "링크 목록을 불러오는 중 오류가 발생했습니다."
            )
          );
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingLinks(false);
        }
      }
    }

    void loadInitialLinks();

    return () => {
      isCancelled = true;
      if (toastTimerRef.current !== null) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const refreshLinks = useCallback(async () => {
    setIsLoadingLinks(true);
    setLoadError(null);
    try {
      const fetchedLinks = await fetchAnonymousLinks();
      setLinks(fetchedLinks);
    } catch (error) {
      setLoadError(
        formatFirestoreErrorMessage(
          error,
          "링크 목록을 불러오는 중 오류가 발생했습니다."
        )
      );
      throw error;
    } finally {
      setIsLoadingLinks(false);
    }
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
      try {
        await refreshLinks();
      } catch {
        // Firestore 저장 성공 직후 재조회만 실패한 경우 중복 저장 방지를 위해 목록 선두에 반영한다.
        setLinks((prev) => [createdItem, ...prev]);
        setLoadError(null);
      }
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

  const resetInlineEditState = () => {
    setEditingId(null);
    setEditTitle("");
    setEditUrl("");
    setEditError(null);
    setEditErrorField(null);
  };

  const startInlineEdit = (item: HomeLinkItem) => {
    if (isActionBusy) return;
    setEditingId(item.id);
    setEditTitle(item.title);
    setEditUrl(item.url);
    setEditError(null);
    setEditErrorField(null);
  };

  const cancelInlineEdit = () => {
    if (isUpdating) return;
    resetInlineEditState();
  };

  const handleInlineSave = async (event: FormEvent, targetId: string) => {
    event.preventDefault();
    if (isUpdating) return;

    const targetItem = links.find((item) => item.id === targetId);
    if (!targetItem) {
      resetInlineEditState();
      return;
    }

    const titleCheck = validateLinkTitle(editTitle);
    if (!titleCheck.valid) {
      setEditError(titleCheck.error ?? "제목을 입력해 주세요");
      setEditErrorField("title");
      return;
    }

    const urlCheck = validateLinkUrl(editUrl);
    if (!urlCheck.valid) {
      setEditError(
        urlCheck.error ??
          "올바른 URL 형식이 아닙니다 (예: https://example.com 또는 mailto:name@example.com)"
      );
      setEditErrorField("url");
      return;
    }

    const { icon, category } = resolveUpdatedLinkIcon(
      targetItem.url,
      targetItem.icon,
      targetItem.category,
      urlCheck.normalized
    );

    setIsUpdating(true);
    setEditError(null);
    setEditErrorField(null);

    try {
      const updatedItem = await updateAnonymousLink({
        id: targetId,
        title: titleCheck.normalized,
        url: urlCheck.normalized,
        icon,
        category,
      });

      setLinks((prev) =>
        prev.map((item) => (item.id === targetId ? updatedItem : item))
      );
      resetInlineEditState();
      showToast(`링크가 수정되었습니다 (${updatedItem.title})`);
    } catch (error) {
      setEditError(
        formatFirestoreErrorMessage(
          error,
          "링크를 수정하는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
        )
      );
      setEditErrorField("submit");
    } finally {
      setIsUpdating(false);
    }
  };

  const openDeleteDialog = (item: HomeLinkItem) => {
    if (isActionBusy) return;
    setDeleteTarget(item);
    setDeleteError(null);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && isDeleting) return;
    setDeleteDialogOpen(nextOpen);
    if (!nextOpen) {
      setDeleteError(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget || isDeleting) return;

    const target = deleteTarget;
    setIsDeleting(true);
    setDeleteError(null);

    try {
      await deleteAnonymousLink(target.id);
      if (editingId === target.id) {
        resetInlineEditState();
      }
      setLinks((prev) => prev.filter((link) => link.id !== target.id));
      setDeleteDialogOpen(false);
      setDeleteError(null);
      showToast(`링크가 삭제되었습니다 (${target.title})`);
    } catch (error) {
      setDeleteError(
        formatFirestoreErrorMessage(
          error,
          "링크를 삭제하는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
        )
      );
    } finally {
      setIsDeleting(false);
    }
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
                {isLoadingLinks && links.length === 0
                  ? "불러오는 중"
                  : `전체 ${links.length}개`}
              </Badge>
            </div>
            <p className="text-[12px] tracking-[-0.01em] text-muted-foreground">
              Firestore 연동 · createdAt 최신순
            </p>
          </div>

          {isLoadingLinks && links.length === 0 ? (
            <div
              role="status"
              aria-live="polite"
              className="flex min-h-[168px] flex-col items-center justify-center gap-3 rounded-[18px] border border-border/80 bg-card px-5 py-10 text-center"
            >
              <Spinner decorative className="size-6 text-muted-foreground" />
              <p className="text-[14px] font-normal tracking-[-0.016em] text-muted-foreground">
                링크를 불러오는 중...
              </p>
            </div>
          ) : loadError && links.length === 0 ? (
            <div
              role="alert"
              className="flex flex-col items-center justify-center gap-3 rounded-[18px] border border-destructive/25 bg-card px-5 py-8 text-center"
            >
              <p className="text-[14px] font-semibold text-destructive">
                {loadError}
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                shape="pill"
                onClick={() => {
                  void refreshLinks().catch(() => {});
                }}
                className="min-h-9 px-4 text-[13px] font-normal"
              >
                다시 시도
              </Button>
            </div>
          ) : links.length === 0 ? (
            <div className="rounded-[18px] border border-dashed border-border bg-card px-5 py-8 text-center">
              <p className="text-[15px] font-semibold text-foreground">
                등록된 링크가 없습니다
              </p>
              <p className="mt-1 text-[13px] text-muted-foreground">
                상단의 &apos;링크 추가&apos; 버튼을 눌러 새 링크를 추가해 보세요.
              </p>
            </div>
          ) : (
            <div className="relative">
              <ul
                className={cn(
                  "flex flex-col gap-3 transition-opacity duration-150",
                  isLoadingLinks && "pointer-events-none opacity-45"
                )}
              >
              {links.map((item) => {
                const isEditing = editingId === item.id;

                if (isEditing) {
                  return (
                    <li key={item.id}>
                      <form
                        onSubmit={(event) => {
                          void handleInlineSave(event, item.id);
                        }}
                        onKeyDown={(event) => {
                          if (event.key === "Escape" && !isUpdating) {
                            event.preventDefault();
                            cancelInlineEdit();
                          }
                        }}
                        noValidate
                        className="flex flex-col gap-3 rounded-[18px] border border-primary/40 bg-card p-4"
                      >
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center justify-between gap-2">
                              <Label
                                htmlFor={`edit-title-${item.id}`}
                                className="text-[12px] font-semibold text-foreground"
                              >
                                제목
                              </Label>
                              <span
                                className={cn(
                                  "text-[11px] tabular-nums",
                                  editTitle.length >= MAX_LINK_TITLE_LENGTH ||
                                    editErrorField === "title"
                                    ? "font-semibold text-destructive"
                                    : "text-muted-foreground"
                                )}
                              >
                                {editTitle.length}/{MAX_LINK_TITLE_LENGTH}
                              </span>
                            </div>
                            <Input
                              id={`edit-title-${item.id}`}
                              type="text"
                              value={editTitle}
                              maxLength={MAX_LINK_TITLE_LENGTH}
                              autoFocus
                              disabled={isUpdating}
                              aria-invalid={editErrorField === "title"}
                              aria-describedby={
                                editError ? `edit-error-${item.id}` : undefined
                              }
                              onChange={(event) => {
                                setEditTitle(
                                  event.target.value.slice(
                                    0,
                                    MAX_LINK_TITLE_LENGTH
                                  )
                                );
                                setEditError(null);
                                setEditErrorField(null);
                              }}
                              className="h-9 rounded-lg text-[14px]"
                            />
                          </div>

                          <div className="flex flex-col gap-1">
                            <Label
                              htmlFor={`edit-url-${item.id}`}
                              className="text-[12px] font-semibold text-foreground"
                            >
                              주소 (URL)
                            </Label>
                            <Input
                              id={`edit-url-${item.id}`}
                              type="text"
                              inputMode="url"
                              placeholder="https://example.com 또는 mailto:name@example.com"
                              value={editUrl}
                              disabled={isUpdating}
                              aria-invalid={editErrorField === "url"}
                              aria-describedby={
                                editError ? `edit-error-${item.id}` : undefined
                              }
                              onChange={(event) => {
                                setEditUrl(event.target.value);
                                setEditError(null);
                                setEditErrorField(null);
                              }}
                              className="h-9 rounded-lg text-[14px]"
                            />
                          </div>
                        </div>

                        {editError ? (
                          <p
                            id={`edit-error-${item.id}`}
                            role="alert"
                            className="flex items-center gap-1.5 text-[12px] font-semibold text-destructive"
                          >
                            <AlertCircle
                              className="size-3.5 shrink-0"
                              aria-hidden="true"
                            />
                            <span>{editError}</span>
                          </p>
                        ) : null}

                        <div className="flex items-center justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            shape="pill"
                            data-cancel-action="true"
                            disabled={isUpdating}
                            onMouseDown={(event) => event.preventDefault()}
                            onClick={cancelInlineEdit}
                            className="min-h-9 px-3.5 text-[13px] font-normal shadow-none"
                          >
                            취소
                          </Button>
                          <Button
                            type="submit"
                            size="sm"
                            shape="pill"
                            disabled={isUpdating}
                            aria-busy={isUpdating}
                            className="min-h-9 min-w-[84px] gap-1.5 bg-primary px-4 text-[13px] text-primary-foreground shadow-[0_1px_6px_rgba(0,0,0,0.12)] hover:bg-[#333336] disabled:cursor-not-allowed disabled:opacity-65"
                          >
                            {isUpdating ? (
                              <>
                                <Spinner
                                  decorative
                                  className="size-3.5 text-primary-foreground"
                                />
                                <span>저장 중...</span>
                              </>
                            ) : (
                              <span>저장</span>
                            )}
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
                    <div className="flex shrink-0 items-stretch gap-1.5">
                      <button
                        type="button"
                        disabled={isActionBusy}
                        onClick={() => startInlineEdit(item)}
                        aria-label={`${item.title} 수정`}
                        title="수정"
                        className={cn(
                          "inline-flex min-h-[64px] w-10 cursor-pointer items-center justify-center rounded-[16px] border border-border bg-card text-muted-foreground transition-colors sm:w-11 sm:rounded-[18px]",
                          "hover:border-primary/40 hover:bg-[var(--color-surface-pearl)] hover:text-primary active:scale-95",
                          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary-focus)]",
                          "disabled:pointer-events-none disabled:opacity-50"
                        )}
                      >
                        <Pencil className="size-4" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        disabled={isActionBusy}
                        onClick={() => openDeleteDialog(item)}
                        aria-label={`${item.title} 삭제`}
                        title="삭제"
                        className={cn(
                          "inline-flex min-h-[64px] w-10 cursor-pointer items-center justify-center rounded-[16px] border border-border bg-card text-muted-foreground transition-colors sm:w-11 sm:rounded-[18px]",
                          "hover:border-destructive/40 hover:bg-destructive/5 hover:text-destructive active:scale-95",
                          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary-focus)]",
                          "disabled:pointer-events-none disabled:opacity-50"
                        )}
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                      </button>
                    </div>
                  </li>
                );
              })}
              </ul>

              {isLoadingLinks ? (
                <div
                  role="status"
                  aria-live="polite"
                  className="absolute inset-0 flex items-center justify-center rounded-[18px]"
                >
                  <div className="inline-flex items-center gap-2.5 rounded-full border border-border bg-card/95 px-4 py-2 shadow-[0_2px_10px_rgba(0,0,0,0.08)] backdrop-blur-sm">
                    <Spinner decorative className="size-4 text-muted-foreground" />
                    <span className="text-[13px] font-normal tracking-[-0.016em] text-muted-foreground">
                      목록 불러오는 중...
                    </span>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </Card>
      </section>

      <AddLinkDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        activeItemCount={links.length}
        onAddLink={handleAddLink}
      />

      <DeleteLinkDialog
        target={deleteTarget}
        open={deleteDialogOpen}
        isDeleting={isDeleting}
        errorMessage={deleteError}
        onOpenChange={handleDeleteDialogOpenChange}
        onConfirmDelete={handleConfirmDelete}
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
