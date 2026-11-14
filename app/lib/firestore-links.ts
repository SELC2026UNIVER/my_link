import { FirebaseError } from "firebase/app";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { LINK_ICON_LABELS } from "@/app/lib/icon-matcher";
import type { LinkIcon } from "@/app/lib/types";
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

function getAnonymousLinksCollection() {
  return collection(getFirestoreDb(), "users", "anonymous", "links");
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
