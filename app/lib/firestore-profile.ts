import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  setDoc,
  where,
  type DocumentData,
} from "firebase/firestore";
import { validateUsernameFormat } from "@/app/lib/validators";
import { getFirestoreDb } from "@/lib/firebase";

/** 한 줄 소개(bio) 최대 글자 수. */
export const MAX_BIO_LENGTH = 80;

/** 최초 프로필 문서 생성 시 사용되는 기본 한 줄 소개(bio). */
export const DEFAULT_USER_BIO =
  "나만의 링크와 기록을 모으는 마이링크 프로필입니다.";

/**
 * Firestore `users/{uid}` 사용자 프로필 문서 모델.
 * `username`은 개인 공개 페이지 URL(`/{username}`) 및 디스플레이 네임으로 사용된다.
 */
export interface UserProfileDoc {
  uid: string;
  username: string;
  bio: string;
  name: string | null;
  email: string | null;
  photoURL: string | null;
}

export interface EnsureUserProfileInput {
  uid: string;
  defaultUsername: string;
  name: string | null;
  email: string | null;
  photoURL: string | null;
}

export interface UpdateUserProfileInput {
  username: string;
  bio: string;
  name?: string | null;
  email?: string | null;
  photoURL?: string | null;
}

/**
 * 다른 사용자가 이미 사용 중인 username으로 변경을 시도할 때 발생하는 오류.
 */
export class UsernameTakenError extends Error {
  constructor(username: string) {
    super(`'${username}'은(는) 이미 사용 중인 디스플레이 네임입니다.`);
    this.name = "UsernameTakenError";
  }
}

function getUsersCollection() {
  return collection(getFirestoreDb(), "users");
}

function getUserProfileRef(uid: string) {
  return doc(getFirestoreDb(), "users", uid);
}

function toUserProfileDoc(uid: string, data: DocumentData): UserProfileDoc {
  return {
    uid,
    username: typeof data.username === "string" ? data.username.trim().toLowerCase() : "",
    bio: typeof data.bio === "string" ? data.bio : "",
    name: typeof data.name === "string" && data.name.trim() ? data.name : null,
    email:
      typeof data.email === "string" && data.email.trim() ? data.email : null,
    photoURL:
      typeof data.photoURL === "string" && data.photoURL.trim()
        ? data.photoURL
        : null,
  };
}

/**
 * 한 줄 소개(bio) 규칙(줄바꿈 제거·앞뒤 공백 제거 후 최대 80자)을 검사한다.
 */
export function validateBio(rawBio: string): {
  valid: boolean;
  normalized: string;
  error?: string;
} {
  const normalized = rawBio.replace(/[\r\n]+/g, " ").trim();
  if (normalized.length > MAX_BIO_LENGTH) {
    return {
      valid: false,
      normalized,
      error: `한 줄 소개는 최대 ${MAX_BIO_LENGTH}자까지 입력할 수 있습니다`,
    };
  }
  return { valid: true, normalized };
}

function buildUsernameCandidates(uid: string, base: string): string[] {
  const uidToken = uid.toLowerCase().replace(/[^a-z0-9]/g, "");
  const trimmedBase = base.slice(0, 15).replace(/[._]+$/g, "") || "user";
  const candidates = [
    base,
    `${trimmedBase}_${uidToken.slice(0, 4)}`,
    `${trimmedBase}_${uidToken.slice(0, 6)}`,
    `user_${uidToken.slice(0, 10)}`,
  ];

  return Array.from(
    new Set(
      candidates.filter((candidate) => validateUsernameFormat(candidate).valid)
    )
  );
}

async function isUsernameAvailableForUid(
  username: string,
  uid: string
): Promise<boolean> {
  const usersQuery = query(
    getUsersCollection(),
    where("username", "==", username),
    limit(5)
  );
  const snapshot = await getDocs(usersQuery);
  return snapshot.docs.every((docSnap) => docSnap.id === uid);
}

/**
 * 로그인 사용자의 `users/{uid}` 프로필 문서를 조회하고,
 * 문서가 없거나 username이 비어 있으면 기본 username(구글 이메일 앞부분)으로 생성한다.
 */
export async function ensureUserProfile(
  input: EnsureUserProfileInput
): Promise<UserProfileDoc> {
  const profileRef = getUserProfileRef(input.uid);
  const profileSnap = await getDoc(profileRef);

  if (profileSnap.exists()) {
    const existing = toUserProfileDoc(input.uid, profileSnap.data());
    if (validateUsernameFormat(existing.username).valid) {
      return {
        ...existing,
        name: existing.name ?? input.name,
        email: existing.email ?? input.email,
        photoURL: existing.photoURL ?? input.photoURL,
      };
    }
  }

  const candidates = buildUsernameCandidates(input.uid, input.defaultUsername);
  let selectedUsername = candidates[0] ?? `user_${input.uid.slice(0, 6).toLowerCase()}`;

  for (const candidate of candidates) {
    const available = await isUsernameAvailableForUid(candidate, input.uid);
    if (available) {
      selectedUsername = candidate;
      break;
    }
  }

  const existingData = profileSnap.exists() ? profileSnap.data() : null;
  const initialBio =
    existingData && typeof existingData.bio === "string"
      ? existingData.bio
      : DEFAULT_USER_BIO;

  const nextProfile: UserProfileDoc = {
    uid: input.uid,
    username: selectedUsername,
    bio: initialBio,
    name: input.name,
    email: input.email,
    photoURL: input.photoURL,
  };

  await setDoc(
    profileRef,
    {
      ...nextProfile,
      ...(profileSnap.exists() ? {} : { createdAt: serverTimestamp() }),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  return nextProfile;
}

/**
 * 사용자 프로필(`users/{uid}`)의 디스플레이 네임(username)과 바이오(한 줄 소개)를 수정한다.
 */
export async function updateUserProfile(
  uid: string,
  input: UpdateUserProfileInput
): Promise<UserProfileDoc> {
  const usernameCheck = validateUsernameFormat(input.username);
  if (!usernameCheck.valid) {
    throw new Error(usernameCheck.error ?? "올바른 디스플레이 네임이 아닙니다.");
  }

  const bioCheck = validateBio(input.bio);
  if (!bioCheck.valid) {
    throw new Error(bioCheck.error ?? "올바른 한 줄 소개가 아닙니다.");
  }

  const nextUsername = usernameCheck.normalized;
  const nextBio = bioCheck.normalized;

  const available = await isUsernameAvailableForUid(nextUsername, uid);
  if (!available) {
    throw new UsernameTakenError(nextUsername);
  }

  const profileRef = getUserProfileRef(uid);
  const profileSnap = await getDoc(profileRef);
  const current = profileSnap.exists()
    ? toUserProfileDoc(uid, profileSnap.data())
    : null;

  const nextProfile: UserProfileDoc = {
    uid,
    username: nextUsername,
    bio: nextBio,
    name: input.name !== undefined ? input.name : (current?.name ?? null),
    email: input.email !== undefined ? input.email : (current?.email ?? null),
    photoURL:
      input.photoURL !== undefined
        ? input.photoURL
        : (current?.photoURL ?? null),
  };

  await setDoc(
    profileRef,
    {
      ...nextProfile,
      ...(profileSnap.exists() ? {} : { createdAt: serverTimestamp() }),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  return nextProfile;
}

/**
 * 공개 페이지(`/[username]`)용으로 `users` 컬렉션에서 `username`이 일치하는 프로필 문서를 조회한다.
 * 존재하지 않으면 null을 반환한다. (로그인 여부와 관계없이 읽기 가능)
 */
export async function fetchPublicProfileByUsername(
  rawUsername: string
): Promise<UserProfileDoc | null> {
  const username = rawUsername.trim().toLowerCase();
  if (!validateUsernameFormat(username).valid) {
    return null;
  }

  const usersQuery = query(
    getUsersCollection(),
    where("username", "==", username),
    limit(1)
  );
  const snapshot = await getDocs(usersQuery);
  if (snapshot.empty) {
    return null;
  }

  const docSnap = snapshot.docs[0];
  return toUserProfileDoc(docSnap.id, docSnap.data());
}
