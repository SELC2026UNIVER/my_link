import type { Metadata } from "next";
import { Suspense } from "react";
import { PublicProfileSkeleton } from "@/app/components/PublicProfileSkeleton";
import { PublicProfileClient } from "./PublicProfileClient";

export function generateStaticParams() {
  return [{ username: "gildong" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  let decoded = username;
  try {
    decoded = decodeURIComponent(username);
  } catch {
    decoded = username;
  }
  const normalized = decoded.trim().toLowerCase();

  return {
    title: `@${normalized} | MyLink`,
    description: `@${normalized}님의 마이링크 공개 프로필 및 링크 목록 페이지입니다.`,
  };
}

export default function PublicUsernamePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  return (
    <Suspense fallback={<PublicProfileSkeleton />}>
      <PublicUsernameContent params={params} />
    </Suspense>
  );
}

async function PublicUsernameContent({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  return <PublicProfileClient rawUsername={username} />;
}
