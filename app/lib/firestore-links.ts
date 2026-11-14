import { FirebaseError } from "firebase/app";
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
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

export interface CreateAnonymousLinkInput {
  title: string;
  url: string;
  icon: LinkIcon;
}

const VALID_LINK_ICON_SET = new Set<string>(LINK_ICON_VALUES);

function getAnonymousLinksCollection() {
  return collection(getFirestoreDb(), "users", "anonymous", "links");
}

function resolveValidLinkIcon(rawIcon: unknown, url: string): LinkIcon {
  if (typeof rawIcon === "string" && VALID_LINK_ICON_SET.has(rawIcon)) {
    return rawIcon as LinkIcon;
  }
  return recommendIconForUrl(url);
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
      return "Firestore 접근 권한이 없습니다. 보안 규칙을 확인해 주세요.";
    }
    if (error.code === "unavailable") {
      return "네트워크 연결을 확인한 뒤 다시 시도해 주세요.";
    }
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallbackMessage;
}

/**
 * Firestore users/anonymous/links 컬렉션에서 createdAt 최신순으로 링크 목록을 일회성 조회(getDocs)한다.
 */
export async function fetchAnonymousLinks(): Promise<HomeLinkItem[]> {
  const linksQuery = query(
    getAnonymousLinksCollection(),
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
 * Firestore users/anonymous/links 컬렉션에 새 링크 문서를 저장한다.
 */
export async function createAnonymousLink(
  input: CreateAnonymousLinkInput
): Promise<HomeLinkItem> {
  const category = LINK_ICON_LABELS[input.icon];
  const docRef = await addDoc(getAnonymousLinksCollection(), {
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
