import { profile } from "@/app/profile-data";

export type LinkIconKey =
  | "github"
  | "blog"
  | "portfolio"
  | "youtube"
  | "instagram"
  | "email"
  | "link";

export interface MyLinkItem {
  id: string;
  title: string;
  url: string;
  icon: LinkIconKey;
  category: string;
}

export const linkListProfile = {
  name: profile.name,
  handle: profile.handle,
  bio: "매일 한 걸음씩 성장하는 초보 웹 개발자의 링크 모음입니다.",
  avatar: profile.avatar,
  avatarAlt: profile.avatarAlt,
};

/**
 * 마이링크 목록 화면용 더미 데이터 (제목 · URL · 아이콘 · 카테고리).
 */
export const dummyLinks: MyLinkItem[] = [
  {
    id: "link-github",
    title: "GitHub 공부 저장소",
    url: "https://github.com/gildong-study",
    icon: "github",
    category: "코드",
  },
  {
    id: "link-blog",
    title: "오늘의 개발 블로그 (TIL)",
    url: "https://velog.io/@gildong_study",
    icon: "blog",
    category: "기록",
  },
  {
    id: "link-portfolio",
    title: "연습 프로젝트 모음집",
    url: "https://gildong-lab.vercel.app",
    icon: "portfolio",
    category: "작품",
  },
  {
    id: "link-youtube",
    title: "유튜브 코딩 브이로그",
    url: "https://youtube.com/@gildong_dev",
    icon: "youtube",
    category: "영상",
  },
  {
    id: "link-instagram",
    title: "인스타그램 개발 일상",
    url: "https://instagram.com/gildong_study",
    icon: "instagram",
    category: "SNS",
  },
  {
    id: "link-email",
    title: "응원 · 협업 이메일 보내기",
    url: `mailto:${profile.email}`,
    icon: "email",
    category: "문의",
  },
];

const SAFE_URL_PROTOCOLS = ["http:", "https:", "mailto:"] as const;

/**
 * 허용된 스킴(http, https, mailto)인지 검증해 안전한 href만 반환한다.
 */
export function resolveSafeHref(rawUrl: string): string {
  try {
    const parsed = new URL(rawUrl);
    if (
      SAFE_URL_PROTOCOLS.includes(
        parsed.protocol as (typeof SAFE_URL_PROTOCOLS)[number]
      )
    ) {
      return rawUrl;
    }
  } catch {
    return "#";
  }
  return "#";
}

/**
 * 새 탭(_blank)으로 열어야 하는 외부 HTTP(S) 링크인지 판별한다.
 */
export function isExternalHttpUrl(url: string): boolean {
  return url.startsWith("https://") || url.startsWith("http://");
}
