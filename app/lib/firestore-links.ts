import { FirebaseError } from "firebase/app";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { LINK_ICON_LABELS, recommendIconForUrl } from "@/app/lib/icon-matcher";
import type { LinkIcon } from "@/app/lib/types";
import { LINK_ICON_VALUES } from "@/app/lib/validators";
import { getFirestoreDb } from "@/lib/firebase";

export interface HomeLinkItem {
  id: string;
  title: string;
  url: string;
  icon: LinkIcon;
  category: string;
}

export interface CreateUserLinkInput {
  title: string;
  url: string;
  icon: LinkIcon;
}

export interface UpdateUserLinkInput {
  id: string;
  title: string;
  url: string;
  icon: LinkIcon;
  category: string;
}

const VALID_LINK_ICON_SET = new Set<string>(LINK_ICON_VALUES);

function assertValidUid(uid: string): string {
  const trimmed = uid.trim();
  if (!trimmed) {
    throw new Error("로그인한 사용자 정보를 확인할 수 없습니다. 다시 로그인해 주세요.");
  }
  return trimmed;
}

function getUserLinksCollection(uid: string) {
  return collection(getFirestoreDb(), "users", assertValidUid(uid), "links");
}

function getUserLinkDoc(uid: string, linkId: string) {
  return doc(getFirestoreDb(), "users", assertValidUid(uid), "links", linkId);
}

function resolveValidLinkIcon(rawIcon: unknown, url: string): LinkIcon {
  if (typeof rawIcon === "string" && VALID_LINK_ICON_SET.has(rawIcon)) {
    return rawIcon as LinkIcon;
  }
  return recommendIconForUrl(url);
}

/**
 * URL 변경 여부에 따라 링크 수정 시 사용할 아이콘과 카테고리 라벨을 결정한다.
 */
export function resolveUpdatedLinkIcon(
  previousUrl: string,
  previousIcon: LinkIcon,
  previousCategory: string,
  nextNormalizedUrl: string
): { icon: LinkIcon; category: string } {
  if (nextNormalizedUrl === previousUrl) {
    return { icon: previousIcon, category: previousCategory };
  }

  const recommendedNext = recommendIconForUrl(nextNormalizedUrl);
  const recommendedPrev = recommendIconForUrl(previousUrl);
  const resolvedIcon =
    recommendedNext !== "link"
      ? recommendedNext
      : previousIcon === recommendedPrev
        ? "link"
        : previousIcon;

  return {
    icon: resolvedIcon,
    category:
      resolvedIcon === previousIcon
        ? previousCategory
        : LINK_ICON_LABELS[resolvedIcon],
  };
}

/**
 * Firestore 예외 코드를 사용자 친화적인 한국어 메시지로 변환한다.
 */
export function formatFirestoreErrorMessage(
  error: unknown,
  fallbackMessage: string
): string {
  if (error instanceof FirebaseError) {
    if (error.code === "permission-denied") {
      return "Firestore 접근 권한이 없습니다. 로그인 상태와 보안 규칙(users/{uid}/links)을 확인해 주세요.";
    }
    if (error.code === "unavailable") {
      return "네트워크 연결을 확인한 뒤 다시 시도해 주세요.";
    }
    if (error.code === "not-found") {
      return "이미 삭제되었거나 존재하지 않는 링크입니다. 목록을 새로고침해 주세요.";
    }
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallbackMessage;
}

/**
 * Firestore users/{uid}/links 컬렉션에서 createdAt 최신순으로 링크 목록을 일회성 조회(getDocs)한다.
 */
export async function fetchUserLinks(uid: string): Promise<HomeLinkItem[]> {
  const linksQuery = query(
    getUserLinksCollection(uid),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(linksQuery);

  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data();
    const url = typeof data.url === "string" ? data.url : "";
    const title =
      typeof data.title === "string" && data.title.trim()
        ? data.title
        : "제목 없는 링크";
    const icon = resolveValidLinkIcon(data.icon, url);
    const category =
      typeof data.category === "string" && data.category.trim()
        ? data.category
        : LINK_ICON_LABELS[icon];

    return {
      id: docSnap.id,
      title,
      url,
      icon,
      category,
    };
  });
}

/**
 * Firestore users/{uid}/links 컬렉션에 새 링크 문서를 저장한다.
 */
export async function createUserLink(
  uid: string,
  input: CreateUserLinkInput
): Promise<HomeLinkItem> {
  const category = LINK_ICON_LABELS[input.icon];
  const docRef = await addDoc(getUserLinksCollection(uid), {
    title: input.title,
    url: input.url,
    icon: input.icon,
    category,
    createdAt: serverTimestamp(),
  });

  return {
    id: docRef.id,
    title: input.title,
    url: input.url,
    icon: input.icon,
    category,
  };
}

/**
 * Firestore users/{uid}/links/{id} 문서를 수정하고 updatedAt 서버 타임스탬프를 갱신한다.
 */
export async function updateUserLink(
  uid: string,
  input: UpdateUserLinkInput
): Promise<HomeLinkItem> {
  await updateDoc(getUserLinkDoc(uid, input.id), {
    title: input.title,
    url: input.url,
    icon: input.icon,
    category: input.category,
    updatedAt: serverTimestamp(),
  });

  return {
    id: input.id,
    title: input.title,
    url: input.url,
    icon: input.icon,
    category: input.category,
  };
}

/**
 * Firestore users/{uid}/links/{id} 문서를 삭제한다.
 */
export async function deleteUserLink(
  uid: string,
  linkId: string
): Promise<void> {
  await deleteDoc(getUserLinkDoc(uid, linkId));
}
