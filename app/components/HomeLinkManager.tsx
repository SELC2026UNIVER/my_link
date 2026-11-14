"use client";

import {
  AlertCircle,
  ExternalLink,
  Lock,
  LogIn,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import {
  createUserLink,
  DEFAULT_EXAMPLE_LINKS,
  deleteUserLink,
  fetchUserLinks,
  formatFirestoreErrorMessage,
  resolveUpdatedLinkIcon,
  updateUserLink,
  type HomeLinkItem,
} from "@/app/lib/firestore-links";
import {
  MAX_BIO_LENGTH,
  UsernameTakenError,
  validateBio,
} from "@/app/lib/firestore-profile";
import {
  formatDisplayUrl,
  MAX_ACTIVE_ITEMS,
  MAX_LINK_TITLE_LENGTH,
  validateLinkTitle,
  validateLinkUrl,
  validateUsernameFormat,
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
import { useAuth } from "./AuthProvider";
import CopyEmailButton from "./CopyEmailButton";
import { DeleteLinkDialog } from "./DeleteLinkDialog";
import { LinkCard } from "./LinkCard";

interface HomeLinkManagerProps {
  defaultName: string;
  defaultRole: string;
  defaultHandle: string;
  githubHref: string;
  email: string;
  intro: string;
}

interface ScopedLinksState {
  uid: string;
  items: HomeLinkItem[];
}

interface ScopedLoadError {
  uid: string;
  message: string;
}

const MAX_USERNAME_LENGTH = 20;

/**
 * 루트(/) 홈 화면에서 로그인 사용자의 프로필(username, bio) 인라인 편집 및
 * UID 기반 Firestore(users/{uid}/links) 링크 목록 조회·추가·인라인 편집·삭제를 관리하는 컴포넌트.
 */
export function HomeLinkManager({
  defaultName,
  defaultRole,
  defaultHandle,
  githubHref,
  email,
  intro,
}: HomeLinkManagerProps) {
  const {
    user,
    isLoading: isAuthLoading,
    isProfileLoading,
    isAuthActionPending,
    signInWithGoogle,
    updateUserProfileInfo,
  } = useAuth();
  const activeUid = user?.uid ?? null;

  const [editingProfileUid, setEditingProfileUid] = useState<string | null>(
    null
  );
  const [profileUsernameDraft, setProfileUsernameDraft] = useState("");
  const [profileBioDraft, setProfileBioDraft] = useState("");
  const [profileEditError, setProfileEditError] = useState<string | null>(null);
  const [profileEditErrorField, setProfileEditErrorField] = useState<
    "username" | "bio" | "submit" | null
  >(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const isEditingProfile =
    Boolean(activeUid) && editingProfileUid === activeUid;

  const [linksState, setLinksState] = useState<ScopedLinksState | null>(null);
  const [loadErrorState, setLoadErrorState] = useState<ScopedLoadError | null>(
    null
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [editingUid, setEditingUid] = useState<string | null>(null);
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

  const activeEditingId =
    activeUid && editingUid === activeUid ? editingId : null;

  const links =
    activeUid && linksState?.uid === activeUid ? linksState.items : [];
  const loadError =
    activeUid && loadErrorState?.uid === activeUid
      ? loadErrorState.message
      : null;
  const isInitialUserLoad =
    Boolean(activeUid) &&
    linksState?.uid !== activeUid &&
    loadErrorState?.uid !== activeUid;
  const isLoadingLinks = isInitialUserLoad || isRefreshing;

  useEffect(() => {
    if (!activeUid) {
      return;
    }

    let isCancelled = false;
    const targetUid = activeUid;

    async function loadUserLinks() {
      try {
        const fetchedLinks = await fetchUserLinks(targetUid);
        if (!isCancelled) {
          setLinksState({ uid: targetUid, items: fetchedLinks });
          setLoadErrorState((prev) => (prev?.uid === targetUid ? null : prev));
        }
      } catch (error) {
        if (!isCancelled) {
          setLoadErrorState({
            uid: targetUid,
            message: formatFirestoreErrorMessage(
              error,
              "링크 목록을 불러오는 중 오류가 발생했습니다."
            ),
          });
        }
      }
    }

    void loadUserLinks();

    return () => {
      isCancelled = true;
    };
  }, [activeUid]);

  const startProfileEdit = () => {
    if (!user || isSavingProfile) return;
    setEditingProfileUid(user.uid);
    setProfileUsernameDraft(user.displayName);
    setProfileBioDraft(user.bio);
    setProfileEditError(null);
    setProfileEditErrorField(null);
  };

  const cancelProfileEdit = () => {
    if (isSavingProfile) return;
    setEditingProfileUid(null);
    setProfileUsernameDraft("");
    setProfileBioDraft("");
    setProfileEditError(null);
    setProfileEditErrorField(null);
  };

  const handleProfileSave = async (event: FormEvent) => {
    event.preventDefault();
    if (!user || isSavingProfile) return;

    const usernameCheck = validateUsernameFormat(profileUsernameDraft);
    if (!usernameCheck.valid) {
      setProfileEditError(
        usernameCheck.error ?? "올바른 디스플레이 네임 형식이 아닙니다."
      );
      setProfileEditErrorField("username");
      return;
    }

    const bioCheck = validateBio(profileBioDraft);
    if (!bioCheck.valid) {
      setProfileEditError(
        bioCheck.error ??
          `한 줄 소개는 최대 ${MAX_BIO_LENGTH}자까지 입력할 수 있습니다.`
      );
      setProfileEditErrorField("bio");
      return;
    }

    setIsSavingProfile(true);
    setProfileEditError(null);
    setProfileEditErrorField(null);

    try {
      const updated = await updateUserProfileInfo({
        username: usernameCheck.normalized,
        bio: bioCheck.normalized,
      });
      setEditingProfileUid(null);
      toast.success(`프로필이 저장되었습니다 (@${updated.username})`);
    } catch (error) {
      if (error instanceof UsernameTakenError) {
        setProfileEditError(error.message);
        setProfileEditErrorField("username");
      } else {
        setProfileEditError(
          formatFirestoreErrorMessage(
            error,
            "프로필을 저장하는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
          )
        );
        setProfileEditErrorField("submit");
      }
    } finally {
      setIsSavingProfile(false);
    }
  };

  const refreshLinks = useCallback(async () => {
    if (!activeUid) return;
    const targetUid = activeUid;
    setIsRefreshing(true);
    setLoadErrorState((prev) => (prev?.uid === targetUid ? null : prev));
    try {
      const fetchedLinks = await fetchUserLinks(targetUid);
      setLinksState({ uid: targetUid, items: fetchedLinks });
    } catch (error) {
      setLoadErrorState({
        uid: targetUid,
        message: formatFirestoreErrorMessage(
          error,
          "링크 목록을 불러오는 중 오류가 발생했습니다."
        ),
      });
      throw error;
    } finally {
      setIsRefreshing(false);
    }
  }, [activeUid]);

  const handleAddLink = async (
    draft: AddLinkDraft
  ): Promise<AddLinkSubmitResult> => {
    if (!activeUid) {
      return {
        ok: false,
        error: "로그인 후 링크를 추가할 수 있습니다.",
      };
    }

    if (links.length >= MAX_ACTIVE_ITEMS) {
      return {
        ok: false,
        error: `항목은 최대 ${MAX_ACTIVE_ITEMS}개까지 등록할 수 있습니다`,
        field: "limit",
      };
    }

    try {
      const createdItem = await createUserLink(activeUid, draft);
      try {
        await refreshLinks();
      } catch {
        setLinksState((prev) => ({
          uid: activeUid,
          items: [
            createdItem,
            ...(prev?.uid === activeUid ? prev.items : []),
          ],
        }));
        setLoadErrorState((prev) => (prev?.uid === activeUid ? null : prev));
      }
      toast.success(`링크가 추가되었습니다 (${createdItem.title})`);
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

  const isActionBusy = isUpdating || isDeleting;

  const resetInlineEditState = () => {
    setEditingUid(null);
    setEditingId(null);
    setEditTitle("");
    setEditUrl("");
    setEditError(null);
    setEditErrorField(null);
  };

  const startInlineEdit = (item: HomeLinkItem) => {
    if (isActionBusy || !activeUid) return;
    setEditingUid(activeUid);
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
    if (isUpdating || !activeUid) return;

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
      const updatedItem = await updateUserLink(activeUid, {
        id: targetId,
        title: titleCheck.normalized,
        url: urlCheck.normalized,
        icon,
        category,
      });

      setLinksState((prev) =>
        prev?.uid === activeUid
          ? {
              uid: activeUid,
              items: prev.items.map((item) =>
                item.id === targetId ? updatedItem : item
              ),
            }
          : prev
      );
      resetInlineEditState();
      toast.success(`링크가 수정되었습니다 (${updatedItem.title})`);
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
    if (isActionBusy || !activeUid) return;
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
    if (!deleteTarget || isDeleting || !activeUid) return;

    const target = deleteTarget;
    setIsDeleting(true);
    setDeleteError(null);

    try {
      await deleteUserLink(activeUid, target.id);
      if (activeEditingId === target.id) {
        resetInlineEditState();
      }
      setLinksState((prev) =>
        prev?.uid === activeUid
          ? {
              uid: activeUid,
              items: prev.items.filter((link) => link.id !== target.id),
            }
          : prev
      );
      setDeleteDialogOpen(false);
      setDeleteError(null);
      toast.success(`링크가 삭제되었습니다 (${target.title})`);
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

  const heroDisplayName = user ? user.displayName : defaultName;
  const heroSubtitle = user
    ? `${user.googleDisplayName || defaultRole} · @${user.displayName}`
    : `${defaultRole} · ${defaultHandle}`;
  const heroBio = user
    ? user.bio.trim() || "한 줄 소개를 추가해 나만의 프로필을 완성해 보세요."
    : intro;

  return (
    <>
      {user && isEditingProfile ? (
        <form
          onSubmit={(event) => {
            void handleProfileSave(event);
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape" && !isSavingProfile) {
              event.preventDefault();
              cancelProfileEdit();
            }
          }}
          noValidate
          aria-label="프로필 인라인 수정"
          className="mx-auto mt-5 max-w-[540px] rounded-[20px] border border-black/[0.08] bg-card p-5 text-left shadow-[0_4px_20px_rgba(0,0,0,0.06)] sm:p-6"
        >
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="text-[16px] font-semibold tracking-[-0.02em] text-foreground">
                내 프로필 수정
              </h2>
              <p className="mt-0.5 text-[12px] text-muted-foreground">
                디스플레이 네임과 한 줄 소개는 공개 페이지에도 바로 반영됩니다.
              </p>
            </div>
            <Badge
              variant="secondary"
              className="rounded-full bg-[#e8e8ed] px-2.5 py-0.5 text-[11px] font-medium text-[#515154]"
            >
              인라인 편집
            </Badge>
          </div>

          <div className="mt-4 flex flex-col gap-3.5">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between gap-2">
                <Label
                  htmlFor="profile-edit-username"
                  className="text-[12px] font-semibold text-foreground"
                >
                  디스플레이 네임 (username)
                </Label>
                <span
                  className={cn(
                    "text-[11px] tabular-nums",
                    profileUsernameDraft.length >= MAX_USERNAME_LENGTH ||
                      profileEditErrorField === "username"
                      ? "font-semibold text-destructive"
                      : "text-muted-foreground"
                  )}
                >
                  {profileUsernameDraft.length}/{MAX_USERNAME_LENGTH}
                </span>
              </div>

              <div className="flex items-center rounded-xl border border-input bg-background px-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                <span
                  aria-hidden="true"
                  className="select-none pr-1 text-[14px] font-medium text-muted-foreground"
                >
                  @
                </span>
                <Input
                  id="profile-edit-username"
                  type="text"
                  value={profileUsernameDraft}
                  maxLength={MAX_USERNAME_LENGTH}
                  autoFocus
                  disabled={isSavingProfile}
                  placeholder="username"
                  aria-invalid={profileEditErrorField === "username"}
                  aria-describedby={
                    profileEditError ? "profile-edit-error" : "profile-edit-hint"
                  }
                  onChange={(event) => {
                    setProfileUsernameDraft(
                      event.target.value
                        .toLowerCase()
                        .slice(0, MAX_USERNAME_LENGTH)
                    );
                    setProfileEditError(null);
                    setProfileEditErrorField(null);
                  }}
                  className="h-10 border-0 bg-transparent px-0 text-[14px] shadow-none focus-visible:ring-0"
                />
              </div>
              <p
                id="profile-edit-hint"
                className="text-[11px] text-muted-foreground"
              >
                영문 소문자·숫자·밑줄(_)·마침표(.) 3~20자 · 내 공개 주소:{" "}
                <span className="font-medium text-foreground">
                  /{profileUsernameDraft.trim() || user.displayName}
                </span>
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between gap-2">
                <Label
                  htmlFor="profile-edit-bio"
                  className="text-[12px] font-semibold text-foreground"
                >
                  바이오 (한 줄 소개)
                </Label>
                <span
                  className={cn(
                    "text-[11px] tabular-nums",
                    profileBioDraft.length >= MAX_BIO_LENGTH ||
                      profileEditErrorField === "bio"
                      ? "font-semibold text-destructive"
                      : "text-muted-foreground"
                  )}
                >
                  {profileBioDraft.length}/{MAX_BIO_LENGTH}
                </span>
              </div>
              <Input
                id="profile-edit-bio"
                type="text"
                value={profileBioDraft}
                maxLength={MAX_BIO_LENGTH}
                disabled={isSavingProfile}
                placeholder="나를 표현하는 한 줄 소개를 입력해 주세요"
                aria-invalid={profileEditErrorField === "bio"}
                aria-describedby={
                  profileEditError ? "profile-edit-error" : undefined
                }
                onChange={(event) => {
                  setProfileBioDraft(
                    event.target.value.slice(0, MAX_BIO_LENGTH)
                  );
                  setProfileEditError(null);
                  setProfileEditErrorField(null);
                }}
                className="h-10 rounded-xl text-[14px]"
              />
            </div>
          </div>

          {profileEditError ? (
            <p
              id="profile-edit-error"
              role="alert"
              className="mt-3 flex items-center gap-1.5 text-[12px] font-semibold text-destructive"
            >
              <AlertCircle
                className="size-3.5 shrink-0"
                aria-hidden="true"
              />
              <span>{profileEditError}</span>
            </p>
          ) : null}

          <div className="mt-4 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              shape="pill"
              disabled={isSavingProfile}
              onMouseDown={(event) => event.preventDefault()}
              onClick={cancelProfileEdit}
              className="min-h-9 rounded-full border border-black/[0.08] bg-[#e8e8ed] px-4 text-[13px] font-medium text-[#1d1d1f] shadow-none hover:bg-[#dcdce1]"
            >
              취소
            </Button>
            <Button
              type="submit"
              size="sm"
              shape="pill"
              disabled={isSavingProfile}
              aria-busy={isSavingProfile}
              className="min-h-9 min-w-[88px] gap-1.5 rounded-full bg-[#1d1d1f] px-4 text-[13px] font-medium text-white shadow-[0_1px_6px_rgba(0,0,0,0.12)] hover:bg-[#333336] disabled:cursor-not-allowed disabled:opacity-65"
            >
              {isSavingProfile ? (
                <>
                  <Spinner decorative className="size-3.5 text-white" />
                  <span>저장 중...</span>
                </>
              ) : (
                <span>저장</span>
              )}
            </Button>
          </div>
        </form>
      ) : (
        <>
          <h1 className="type-hero-display mt-2 text-[var(--color-ink)]">
            {heroDisplayName}
          </h1>

          <p className="type-lead mt-2 text-[var(--color-ink-muted-80)]">
            {heroSubtitle}
          </p>

          <p
            className={cn(
              "type-body mx-auto mt-5 max-w-[640px] text-[var(--color-ink)] transition-opacity",
              isProfileLoading && "opacity-70"
            )}
          >
            {heroBio}
          </p>
        </>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3.5">
        {user ? (
          <>
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

            {!isEditingProfile ? (
              <Button
                type="button"
                variant="secondary"
                shape="pill"
                disabled={isProfileLoading}
                onClick={startProfileEdit}
                className="h-auto min-h-11 cursor-pointer gap-2 rounded-full border border-black/[0.08] bg-[#e8e8ed] px-[20px] py-[11px] text-[16px] font-normal leading-none tracking-[-0.022em] text-[#1d1d1f] shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-all duration-150 hover:bg-[#dcdce1] active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary-focus)] disabled:opacity-60"
              >
                <Pencil className="size-4 text-[#515154]" aria-hidden="true" />
                <span>프로필 수정</span>
              </Button>
            ) : null}

            <Link
              href={`/${encodeURIComponent(user.displayName)}`}
              className="inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-black/[0.08] bg-[#e8e8ed] px-[20px] py-[11px] text-[16px] font-normal leading-none tracking-[-0.022em] text-[#1d1d1f] shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-all duration-150 hover:bg-[#dcdce1] active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary-focus)]"
            >
              <span>내 페이지 바로가기</span>
              <ExternalLink
                className="size-4 text-[#515154]"
                aria-hidden="true"
              />
            </Link>
          </>
        ) : null}

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
                {isAuthLoading
                  ? "인증 확인 중"
                  : !user
                    ? `기본 예시 ${DEFAULT_EXAMPLE_LINKS.length}개 · 로그인 필요`
                    : isLoadingLinks && links.length === 0
                      ? "불러오는 중"
                      : `전체 ${links.length}개`}
              </Badge>
            </div>
            <p className="text-[12px] tracking-[-0.01em] text-muted-foreground">
              {user
                ? `@${user.displayName} · createdAt 최신순`
                : "Google 계정 연동 · 개인별 저장소"}
            </p>
          </div>

          {isAuthLoading ? (
            <div
              role="status"
              aria-live="polite"
              className="flex min-h-[168px] flex-col items-center justify-center gap-3 rounded-[18px] border border-border/80 bg-card px-5 py-10 text-center"
            >
              <Spinner decorative className="size-6 text-muted-foreground" />
              <p className="text-[14px] font-normal tracking-[-0.016em] text-muted-foreground">
                로그인 상태를 확인하는 중...
              </p>
            </div>
          ) : !user ? (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col items-center justify-center gap-4 rounded-[18px] border border-dashed border-border bg-card px-6 py-8 text-center">
                <div
                  aria-hidden="true"
                  className="flex size-12 items-center justify-center rounded-full border border-black/[0.06] bg-secondary text-foreground/75"
                >
                  <Lock className="size-5" />
                </div>
                <div className="max-w-[380px]">
                  <h3 className="text-[17px] font-semibold tracking-[-0.02em] text-foreground">
                    로그인하고 나만의 링크를 관리하세요
                  </h3>
                  <p className="mt-1.5 text-[14px] leading-[1.5] text-muted-foreground">
                    Google 계정으로 로그인하면 내 고유 계정에 링크가 안전하게
                    저장되고, 언제든 수정·삭제할 수 있습니다.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  shape="pill"
                  disabled={isAuthActionPending}
                  aria-busy={isAuthActionPending}
                  onClick={() => {
                    void signInWithGoogle().then((signedIn) => {
                      if (signedIn) {
                        toast.success("Google 계정으로 로그인되었습니다");
                      }
                    });
                  }}
                  className="min-h-11 gap-2 rounded-full border border-black/[0.08] bg-[#e8e8ed] px-5 text-[15px] font-medium tracking-[-0.018em] text-[#1d1d1f] shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-all hover:bg-[#dcdce1] active:scale-95 disabled:opacity-60"
                >
                  {isAuthActionPending ? (
                    <>
                      <Spinner decorative className="size-4 text-[#1d1d1f]" />
                      <span>로그인 중...</span>
                    </>
                  ) : (
                    <>
                      <LogIn
                        className="size-4 text-[#515154]"
                        aria-hidden="true"
                      />
                      <span>Google로 로그인하기</span>
                    </>
                  )}
                </Button>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[13px] font-semibold text-muted-foreground">
                    기본 링크 예시 ({DEFAULT_EXAMPLE_LINKS.length}개)
                  </span>
                  <span className="text-[12px] text-muted-foreground">
                    로그인 후 수정·삭제 가능
                  </span>
                </div>
                <ul className="flex flex-col gap-3">
                  {DEFAULT_EXAMPLE_LINKS.map((item) => (
                    <li key={item.id}>
                      <LinkCard
                        title={item.title}
                        url={item.url}
                        subtitle={formatDisplayUrl(item.url)}
                        icon={item.icon}
                        category={item.category}
                        buttonStyle="card"
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : isLoadingLinks && links.length === 0 ? (
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
                  const isEditing = activeEditingId === item.id;

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
        open={Boolean(user) && dialogOpen}
        onOpenChange={setDialogOpen}
        activeItemCount={links.length}
        onAddLink={handleAddLink}
      />

      <DeleteLinkDialog
        target={deleteTarget}
        open={Boolean(user) && deleteDialogOpen}
        isDeleting={isDeleting}
        errorMessage={deleteError}
        onOpenChange={handleDeleteDialogOpenChange}
        onConfirmDelete={handleConfirmDelete}
      />
    </>
  );
}
