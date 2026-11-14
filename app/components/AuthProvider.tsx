"use client";

import { onAuthStateChanged } from "firebase/auth";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  formatAuthErrorMessage,
  isPopupCancelledError,
  signInWithGooglePopup,
  signOutFirebaseUser,
  syncFirebaseUserDisplayName,
  toAuthUser,
  type AuthUser,
} from "@/app/lib/firebase-auth";
import {
  ensureUserProfile,
  updateUserProfile,
  type UpdateUserProfileInput,
  type UserProfileDoc,
} from "@/app/lib/firestore-profile";
import { auth } from "@/lib/firebase";

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isProfileLoading: boolean;
  isAuthActionPending: boolean;
  authError: string | null;
  signInWithGoogle: () => Promise<boolean>;
  signOut: () => Promise<boolean>;
  updateUserProfileInfo: (
    input: Pick<UpdateUserProfileInput, "username" | "bio">
  ) => Promise<UserProfileDoc>;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Firebase onAuthStateChanged로 로그인 상태를 실시간 감지하고
 * Firestore `users/{uid}` 사용자 프로필 문서(username, bio)와 동기화하는 Provider.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loadedProfileUid, setLoadedProfileUid] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(Boolean(auth));
  const [isAuthActionPending, setIsAuthActionPending] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (!auth) {
      return;
    }

    let activeUid: string | null = null;

    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        if (!firebaseUser) {
          activeUid = null;
          setUser(null);
          setLoadedProfileUid(null);
          setIsLoading(false);
          return;
        }

        const baseUser = toAuthUser(firebaseUser);
        activeUid = baseUser.uid;
        setUser((prev) =>
          prev?.uid === baseUser.uid
            ? {
                ...baseUser,
                displayName: prev.displayName,
                bio: prev.bio,
              }
            : baseUser
        );
        setIsLoading(false);

        void ensureUserProfile({
          uid: baseUser.uid,
          defaultUsername: baseUser.displayName,
          name: baseUser.googleDisplayName,
          email: baseUser.email,
          photoURL: baseUser.photoURL,
        })
          .then((profileDoc) => {
            if (activeUid !== baseUser.uid) return;
            setUser((prev) =>
              prev?.uid === baseUser.uid
                ? {
                    ...prev,
                    displayName: profileDoc.username,
                    bio: profileDoc.bio,
                  }
                : prev
            );
            void syncFirebaseUserDisplayName(profileDoc.username);
          })
          .catch(() => {
            // Firestore 오프라인/권한 대기 시에도 기본 인증 프로필로 계속 동작한다.
          })
          .finally(() => {
            if (activeUid === baseUser.uid) {
              setLoadedProfileUid(baseUser.uid);
            }
          });
      },
      (error) => {
        setAuthError(
          formatAuthErrorMessage(
            error,
            "인증 상태를 확인하는 중 오류가 발생했습니다."
          )
        );
        setIsLoading(false);
      }
    );

    return () => {
      activeUid = null;
      unsubscribe();
    };
  }, []);

  const signInWithGoogle = useCallback(async (): Promise<boolean> => {
    if (isAuthActionPending) return false;
    setIsAuthActionPending(true);
    setAuthError(null);

    try {
      const signedInUser = await signInWithGooglePopup();
      setUser(signedInUser);

      try {
        const profileDoc = await ensureUserProfile({
          uid: signedInUser.uid,
          defaultUsername: signedInUser.displayName,
          name: signedInUser.googleDisplayName,
          email: signedInUser.email,
          photoURL: signedInUser.photoURL,
        });
        setUser((prev) =>
          prev?.uid === signedInUser.uid
            ? {
                ...prev,
                displayName: profileDoc.username,
                bio: profileDoc.bio,
              }
            : prev
        );
        void syncFirebaseUserDisplayName(profileDoc.username);
      } catch {
        // 프로필 문서 초기화 실패 시 기본 인증 정보 유지
      } finally {
        setLoadedProfileUid(signedInUser.uid);
      }

      return true;
    } catch (error) {
      if (!isPopupCancelledError(error)) {
        setAuthError(
          formatAuthErrorMessage(
            error,
            "Google 로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
          )
        );
      }
      return false;
    } finally {
      setIsAuthActionPending(false);
    }
  }, [isAuthActionPending]);

  const signOut = useCallback(async (): Promise<boolean> => {
    if (isAuthActionPending) return false;
    setIsAuthActionPending(true);
    setAuthError(null);

    try {
      await signOutFirebaseUser();
      setUser(null);
      setLoadedProfileUid(null);
      return true;
    } catch (error) {
      setAuthError(
        formatAuthErrorMessage(
          error,
          "로그아웃 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
        )
      );
      return false;
    } finally {
      setIsAuthActionPending(false);
    }
  }, [isAuthActionPending]);

  const updateUserProfileInfo = useCallback(
    async (
      input: Pick<UpdateUserProfileInput, "username" | "bio">
    ): Promise<UserProfileDoc> => {
      if (!user) {
        throw new Error("로그인 후 프로필을 수정할 수 있습니다.");
      }

      const updatedDoc = await updateUserProfile(user.uid, {
        username: input.username,
        bio: input.bio,
        name: user.googleDisplayName,
        email: user.email,
        photoURL: user.photoURL,
      });

      setUser((prev) =>
        prev?.uid === user.uid
          ? {
              ...prev,
              displayName: updatedDoc.username,
              bio: updatedDoc.bio,
            }
          : prev
      );
      void syncFirebaseUserDisplayName(updatedDoc.username);
      return updatedDoc;
    },
    [user]
  );

  const clearAuthError = useCallback(() => {
    setAuthError(null);
  }, []);

  const isProfileLoading = Boolean(user) && loadedProfileUid !== user?.uid;

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isProfileLoading,
      isAuthActionPending,
      authError,
      signInWithGoogle,
      signOut,
      updateUserProfileInfo,
      clearAuthError,
    }),
    [
      user,
      isLoading,
      isProfileLoading,
      isAuthActionPending,
      authError,
      signInWithGoogle,
      signOut,
      updateUserProfileInfo,
      clearAuthError,
    ]
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}

/**
 * AuthProvider 하위에서 현재 Firebase 인증 사용자와 로그인/로그아웃/프로필 수정 액션을 조회한다.
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth는 AuthProvider 내부에서만 사용할 수 있습니다.");
  }
  return context;
}
