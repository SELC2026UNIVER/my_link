import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const hasRequiredFirebaseConfig = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.appId
);

/**
 * Next.js 클라이언트 번들 및 HMR 환경에서 중복 초기화를 방지하는 Firebase App 싱글톤.
 */
export const firebaseApp: FirebaseApp | null = hasRequiredFirebaseConfig
  ? getApps().length > 0
    ? getApp()
    : initializeApp(firebaseConfig)
  : null;

export const db: Firestore | null = firebaseApp
  ? getFirestore(firebaseApp)
  : null;

/**
 * 초기화된 Firestore 인스턴스를 반환한다.
 * .env.local 환경 변수가 누락된 경우 명시적인 오류를 발생시킨다.
 */
export function getFirestoreDb(): Firestore {
  if (!db) {
    throw new Error(
      "Firebase 환경 변수(.env.local의 NEXT_PUBLIC_FIREBASE_*)가 설정되지 않았습니다."
    );
  }
  return db;
}
