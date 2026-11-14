import type { LinkIcon, SocialPlatform } from "./types";
import { normalizeUrlInput } from "./validators";

const DOMAIN_ICON_RULES: Array<{ hosts: string[]; icon: LinkIcon }> = [
  { hosts: ["instagram.com"], icon: "instagram" },
  { hosts: ["youtube.com", "youtu.be"], icon: "youtube" },
  { hosts: ["tiktok.com"], icon: "tiktok" },
  { hosts: ["x.com", "twitter.com"], icon: "x" },
  { hosts: ["threads.net"], icon: "threads" },
  { hosts: ["github.com"], icon: "github" },
  {
    hosts: ["kakao.com", "open.kakao.com", "pf.kakao.com"],
    icon: "kakao",
  },
  {
    hosts: ["naver.com", "blog.naver.com", "smartstore.naver.com"],
    icon: "naver",
  },
  { hosts: ["velog.io", "tistory.com", "brunch.co.kr"], icon: "blog" },
];

/**
 * 입력한 URL의 스킴과 도메인을 바탕으로 적합한 아이콘 키를 자동 추천한다.
 */
export function recommendIconForUrl(rawUrl: string): LinkIcon {
  const trimmed = rawUrl.trim();
  if (!trimmed) return "link";

  if (trimmed.toLowerCase().startsWith("mailto:")) {
    return "email";
  }

  try {
    const normalized = normalizeUrlInput(trimmed);
    const parsed = new URL(normalized);
    if (parsed.protocol === "mailto:") {
      return "email";
    }
    const hostname = parsed.hostname.toLowerCase().replace(/^www\./, "");

    for (const rule of DOMAIN_ICON_RULES) {
      if (
        rule.hosts.some(
          (host) => hostname === host || hostname.endsWith(`.${host}`)
        )
      ) {
        return rule.icon;
      }
    }
  } catch {
    return "link";
  }

  return "link";
}

export const LINK_ICON_LABELS: Record<LinkIcon, string> = {
  link: "일반 링크",
  instagram: "Instagram",
  youtube: "YouTube",
  tiktok: "TikTok",
  x: "X",
  threads: "Threads",
  github: "GitHub",
  kakao: "Kakao",
  naver: "Naver",
  blog: "블로그",
  email: "이메일",
  shop: "스토어",
  portfolio: "포트폴리오",
};

export const SOCIAL_PLATFORM_LABELS: Record<SocialPlatform, string> = {
  instagram: "Instagram",
  youtube: "YouTube",
  tiktok: "TikTok",
  x: "X",
  threads: "Threads",
  github: "GitHub",
  kakao: "KakaoTalk",
  naver: "Naver",
  email: "이메일",
};
