import { FirebaseError } from "firebase/app";
import {
  browserLocalPersistence,
  setPersistence,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { RESERVED_USERNAMES } from "@/app/lib/validators";
import { createGoogleAuthProvider, getFirebaseAuth } from "@/lib/firebase";

export interface AuthUser {
  uid: string;
  email: string | null;
  /** 개인 URL 주소(`/[username]`)로 활용할 수 있는 기본 디스플레이 네임(구글 이메일 앞부분 영문 아이디). */
  displayName: string;
  googleDisplayName: string | null;
  photoURL: string | null;
}

const MAX_HANDLE_LENGTH = 20;
const MIN_HANDLE_LENGTH = 3;

function sanitizeHandleCandidate(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[-+\s]+/g, "_")
    .replace(/[^a-z0-9_.]/g, "")
    .replace(/\.{2,}/g, ".")
    .replace(/^_+|_+$/g, "")
    .replace(/^\.+|\.+$/g, "");
}

/**
 * 구글 이메일 앞부분(영문 아이디)을 개인 URL 주소용 기본 디스플레이 네임으로 정규화한다.
 * 영문/숫자/밑줄/마침표 외 문자를 제거하고 예약어나 3자 미만인 경우 UID 접미사로 보정한다.
 */
export function deriveDefaultDisplayName(user: {
  email?: string | null;
  displayName?: string | null;
  uid: string;
}): string {
  const emailLocalPart = user.email ? user.email.split("@")[0] ?? "" : "";
  const primaryCandidate = sanitizeHandleCandidate(emailLocalPart);
  const secondaryCandidate = user.displayName
    ? sanitizeHandleCandidate(user.displayName)
    : "";

  let handle = primaryCandidate || secondaryCandidate;
  const uidSuffix = user.uid
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 6);

  if (!handle) {
    handle = `user_${uidSuffix || "member"}`;
  } else if (handle.length < MIN_HANDLE_LENGTH || RESERVED_USERNAMES.has(handle)) {
    const base = handle.slice(0, MAX_HANDLE_LENGTH - 5);
    handle = `${base}_${uidSuffix.slice(0, 4) || "user"}`;
  }

  return handle.slice(0, MAX_HANDLE_LENGTH).replace(/\.+$/g, "");
}

/**
 * Firebase User 객체를 앱 공용 AuthUser 모델로 변환한다.
 */
export function toAuthUser(user: User): AuthUser {
  return {
    uid: user.uid,
    email: user.email,
    displayName: deriveDefaultDisplayName(user),
    googleDisplayName: user.displayName,
    photoURL: user.photoURL,
  };
}

/**
 * Firebase Authentication 에러 코드를 사용자 안내용 한국어 메시지로 변환한다.
 */
export function formatAuthErrorMessage(
  error: unknown,
  fallbackMessage: string
): string {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "auth/popup-closed-by-user":
        return "로그인 창이 닫혀 로그인을 취소했습니다.";
      case "auth/cancelled-popup-request":
        return "이전 로그인 요청이 취소되었습니다. 다시 시도해 주세요.";
      case "auth/popup-blocked":
        return "브라우저에서 로그인 팝업이 차단되었습니다. 팝업 허용 후 다시 시도해 주세요.";
      case "auth/unauthorized-domain":
        return "현재 도메인이 Firebase 인증 허용 도메인에 등록되지 않았습니다.";
      case "auth/operation-not-allowed":
        return "Firebase 콘솔에서 Google 로그인 제공업체 사용 설정을 확인해 주세요.";
      case "auth/network-request-failed":
        return "네트워크 연결을 확인한 뒤 다시 시도해 주세요.";
      default:
        break;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallbackMessage;
}

export function isPopupCancelledError(error: unknown): boolean {
  return (
    error instanceof FirebaseError &&
    (error.code === "auth/popup-closed-by-user" ||
      error.code === "auth/cancelled-popup-request")
  );
}

/**
 * 브라우저 로컬 세션을 유지하면서 Google 팝업 로그인을 수행한다.
 * 로그인 직후 개인 URL 주소로 쓸 수 있도록 이메일 앞부분 기본 디스플레이 네임을 동기화한다.
 */
export async function signInWithGooglePopup(): Promise<AuthUser> {
  const firebaseAuth = getFirebaseAuth();
  await setPersistence(firebaseAuth, browserLocalPersistence);
  const result = await signInWithPopup(firebaseAuth, createGoogleAuthProvider());

  const defaultDisplayName = deriveDefaultDisplayName(result.user);
  if (result.user.displayName !== defaultDisplayName) {
    await updateProfile(result.user, {
      displayName: defaultDisplayName,
    }).catch(() => {
      // 프로필 동기화 실패가 로그인 자체를 막지 않도록 무시한다.
    });
  }

  return toAuthUser(result.user);
}

/**
 * 현재 Firebase Auth 세션을 로그아웃한다.
 */
export async function signOutFirebaseUser(): Promise<void> {
  const firebaseAuth = getFirebaseAuth();
  await signOut(firebaseAuth);
}
