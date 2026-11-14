export type LinkIcon =
  | "link"
  | "instagram"
  | "youtube"
  | "tiktok"
  | "x"
  | "threads"
  | "github"
  | "kakao"
  | "naver"
  | "blog"
  | "email"
  | "shop"
  | "portfolio";

export type SocialPlatform =
  | "instagram"
  | "youtube"
  | "tiktok"
  | "x"
  | "threads"
  | "github"
  | "kakao"
  | "naver"
  | "email";

export type ThemePreset =
  | "apple-classic"
  | "pure-light"
  | "midnight-dark"
  | "soft-blue";

export type ButtonStyle = "card" | "pill";

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string | null;
  themePreset: ThemePreset;
  buttonStyle: ButtonStyle;
  createdAt: string;
  updatedAt: string;
}

export interface SocialLink {
  id: string;
  userId: string;
  platform: SocialPlatform;
  url: string;
  order: number;
}

export interface LinkItem {
  id: string;
  userId: string;
  kind: "link" | "header";
  title: string;
  url?: string;
  icon?: LinkIcon;
  showDivider?: boolean;
  order: number;
  clickCount: number;
  isVisible: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UsernameHistoryEntry {
  oldUsername: string;
  userId: string;
  changedAt: string;
}

export interface DailyStatPoint {
  date: string;
  visits: number;
  clicks: number;
}

export interface AnalyticsData {
  userId: string;
  totalVisits: number;
  dailyStats: DailyStatPoint[];
}
