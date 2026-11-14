import { dummyLinks, linkListProfile } from "@/app/links/links-data";
import type {
  AnalyticsData,
  LinkItem,
  SocialLink,
  UserProfile,
  UsernameHistoryEntry,
} from "./types";

export const GILDONG_USER_ID = "user-gildong";
const SEED_TIMESTAMP = "2026-11-15T00:00:00.000Z";

export interface MyLinkSeedData {
  profiles: UserProfile[];
  socialLinks: SocialLink[];
  links: LinkItem[];
  usernameHistory: UsernameHistoryEntry[];
  analytics: Record<string, AnalyticsData>;
}

const INITIAL_CLICK_COUNTS: Record<string, number> = {
  "link-github": 148,
  "link-blog": 112,
  "link-portfolio": 94,
  "link-youtube": 76,
  "link-instagram": 65,
  "link-email": 41,
};

/**
 * PRD v3.5 및 app/links/links-data.ts 기반 /gildong 초기 Mock 시드 데이터를 생성한다.
 */
export function createInitialSeedData(): MyLinkSeedData {
  const gildongProfile: UserProfile = {
    id: GILDONG_USER_ID,
    email: "hello@example.com",
    username: "gildong",
    displayName: linkListProfile.name,
    bio: linkListProfile.bio,
    avatarUrl: "/avatar.jpg",
    themePreset: "apple-classic",
    buttonStyle: "card",
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
  };

  const socialLinks: SocialLink[] = [
    {
      id: "social-instagram",
      userId: GILDONG_USER_ID,
      platform: "instagram",
      url: "https://instagram.com/gildong_study",
      order: 0,
    },
    {
      id: "social-youtube",
      userId: GILDONG_USER_ID,
      platform: "youtube",
      url: "https://youtube.com/@gildong_dev",
      order: 1,
    },
    {
      id: "social-github",
      userId: GILDONG_USER_ID,
      platform: "github",
      url: "https://github.com/gildong-study",
      order: 2,
    },
    {
      id: "social-email",
      userId: GILDONG_USER_ID,
      platform: "email",
      url: "mailto:hello@example.com",
      order: 3,
    },
  ];

  const devLinks = dummyLinks.slice(0, 3);
  const channelLinks = dummyLinks.slice(3);

  const links: LinkItem[] = [
    {
      id: "header-dev-work",
      userId: GILDONG_USER_ID,
      kind: "header",
      title: "작은 연습 작품 & 공부 기록",
      showDivider: true,
      order: 0,
      clickCount: 0,
      isVisible: true,
      deletedAt: null,
      createdAt: SEED_TIMESTAMP,
      updatedAt: SEED_TIMESTAMP,
    },
    ...devLinks.map((item, idx) => ({
      id: item.id,
      userId: GILDONG_USER_ID,
      kind: "link" as const,
      title: item.title,
      url: item.url,
      icon: item.icon,
      order: idx + 1,
      clickCount: INITIAL_CLICK_COUNTS[item.id] ?? 10,
      isVisible: true,
      deletedAt: null,
      createdAt: SEED_TIMESTAMP,
      updatedAt: SEED_TIMESTAMP,
    })),
    {
      id: "header-channels",
      userId: GILDONG_USER_ID,
      kind: "header",
      title: "채널 & 소통",
      showDivider: true,
      order: devLinks.length + 1,
      clickCount: 0,
      isVisible: true,
      deletedAt: null,
      createdAt: SEED_TIMESTAMP,
      updatedAt: SEED_TIMESTAMP,
    },
    ...channelLinks.map((item, idx) => ({
      id: item.id,
      userId: GILDONG_USER_ID,
      kind: "link" as const,
      title: item.title,
      url: item.url,
      icon: item.icon,
      order: devLinks.length + 2 + idx,
      clickCount: INITIAL_CLICK_COUNTS[item.id] ?? 10,
      isVisible: true,
      deletedAt: null,
      createdAt: SEED_TIMESTAMP,
      updatedAt: SEED_TIMESTAMP,
    })),
  ];

  const usernameHistory: UsernameHistoryEntry[] = [
    {
      oldUsername: "gildong_study",
      userId: GILDONG_USER_ID,
      changedAt: SEED_TIMESTAMP,
    },
  ];

  const analytics: Record<string, AnalyticsData> = {
    [GILDONG_USER_ID]: {
      userId: GILDONG_USER_ID,
      totalVisits: 942,
      dailyStats: [
        { date: "2026-11-09", visits: 98, clicks: 54 },
        { date: "2026-11-10", visits: 124, clicks: 71 },
        { date: "2026-11-11", visits: 115, clicks: 63 },
        { date: "2026-11-12", visits: 146, clicks: 89 },
        { date: "2026-11-13", visits: 138, clicks: 77 },
        { date: "2026-11-14", visits: 162, clicks: 94 },
        { date: "2026-11-15", visits: 159, clicks: 88 },
      ],
    },
  };

  return {
    profiles: [gildongProfile],
    socialLinks,
    links,
    usernameHistory,
    analytics,
  };
}
