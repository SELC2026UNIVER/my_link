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
  toAuthUser,
  type AuthUser,
} from "@/app/lib/firebase-auth";
import { auth } from "@/lib/firebase";

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthActionPending: boolean;
  authError: string | null;
  signInWithGoogle: () => Promise<boolean>;
  signOut: () => Promise<boolean>;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Firebase onAuthStateChanged로 로그인 상태를 실시간 감지하고 브라우저 세션을 유지하는 Provider.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(Boolean(auth));
  const [isAuthActionPending, setIsAuthActionPending] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (!auth) {
      return;
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        setUser(firebaseUser ? toAuthUser(firebaseUser) : null);
        setIsLoading(false);
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

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = useCallback(async (): Promise<boolean> => {
    if (isAuthActionPending) return false;
    setIsAuthActionPending(true);
    setAuthError(null);

    try {
      const signedInUser = await signInWithGooglePopup();
      setUser(signedInUser);
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

  const clearAuthError = useCallback(() => {
    setAuthError(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthActionPending,
      authError,
      signInWithGoogle,
      signOut,
      clearAuthError,
    }),
    [
      user,
      isLoading,
      isAuthActionPending,
      authError,
      signInWithGoogle,
      signOut,
      clearAuthError,
    ]
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}

/**
 * AuthProvider 하위에서 현재 Firebase 인증 사용자와 로그인/로그아웃 액션을 조회한다.
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth는 AuthProvider 내부에서만 사용할 수 있습니다.");
  }
  return context;
}
