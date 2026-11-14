import type { ButtonStyle, ThemePreset } from "./types";

export interface ThemeTokens {
  id: ThemePreset;
  name: string;
  description: string;
  /** 상단 프로필 타일 스타일 */
  topSurfaceClass: string;
  topTitleClass: string;
  topHandleClass: string;
  topBioClass: string;
  avatarFallbackClass: string;
  socialButtonClass: string;
  topUtilityPillClass: string;
  /** 하단 링크 목록 타일 스타일 */
  bottomSurfaceClass: string;
  isBottomDark: boolean;
  headerTextClass: string;
  headerLineClass: string;
  cardClass: string;
  iconBadgeClass: string;
  cardTitleClass: string;
  cardSubtitleClass: string;
  chevronClass: string;
  emptyTextClass: string;
  footerBorderClass: string;
  footerLinkClass: string;
  footerMetaClass: string;
}

export const THEME_PRESETS: Record<ThemePreset, ThemeTokens> = {
  "apple-classic": {
    id: "apple-classic",
    name: "Apple 클래식",
    description: "상단 화이트 프로필 + 하단 다크 타일 교차",
    topSurfaceClass: "bg-[var(--color-canvas)] text-[var(--color-ink)]",
    topTitleClass: "text-[var(--color-ink)]",
    topHandleClass: "text-[#6e6e73]",
    topBioClass: "text-[var(--color-ink-muted-80)]",
    avatarFallbackClass: "bg-[var(--color-canvas-parchment)] text-[var(--color-ink)]",
    socialButtonClass:
      "border border-[var(--color-hairline)] bg-[var(--color-canvas-parchment)] text-[var(--color-ink)] hover:border-[var(--color-primary)] hover:bg-[var(--color-surface-pearl)] hover:text-[var(--color-primary)] focus-visible:outline-[var(--color-primary-focus)]",
    topUtilityPillClass:
      "border border-[var(--color-hairline)] bg-[var(--color-canvas-parchment)] text-[var(--color-ink-muted-80)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]",
    bottomSurfaceClass: "bg-[var(--color-surface-tile-1)] text-white",
    isBottomDark: true,
    headerTextClass: "text-[var(--color-body-muted)]",
    headerLineClass: "bg-white/12",
    cardClass:
      "border border-white/10 bg-[var(--color-surface-tile-2)] hover:border-[var(--color-primary-on-dark)]/70 hover:bg-[#323236] has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-[var(--color-primary-focus)] has-[a:focus-visible]:ring-offset-2 has-[a:focus-visible]:ring-offset-[var(--color-surface-tile-1)]",
    iconBadgeClass:
      "border border-white/10 bg-white/[0.06] text-white group-hover:border-[var(--color-primary-on-dark)]/40 group-hover:bg-[var(--color-primary-on-dark)]/15 group-hover:text-[var(--color-primary-on-dark)]",
    cardTitleClass:
      "text-white group-hover:text-[var(--color-primary-on-dark)]",
    cardSubtitleClass: "text-[var(--color-body-muted)]",
    chevronClass:
      "text-white/55 group-hover:translate-x-0.5 group-hover:text-[var(--color-primary-on-dark)]",
    emptyTextClass: "text-[var(--color-body-muted)]",
    footerBorderClass: "border-white/10",
    footerLinkClass:
      "text-[var(--color-primary-on-dark)] hover:underline focus-visible:outline-[var(--color-primary-focus)]",
    footerMetaClass: "text-white/60",
  },
  "pure-light": {
    id: "pure-light",
    name: "퓨어 라이트",
    description: "전체 화이트 & 파치먼트 유틸리티 카드",
    topSurfaceClass: "bg-[var(--color-canvas)] text-[var(--color-ink)]",
    topTitleClass: "text-[var(--color-ink)]",
    topHandleClass: "text-[#6e6e73]",
    topBioClass: "text-[var(--color-ink-muted-80)]",
    avatarFallbackClass: "bg-[var(--color-canvas-parchment)] text-[var(--color-ink)]",
    socialButtonClass:
      "border border-[var(--color-hairline)] bg-[var(--color-canvas-parchment)] text-[var(--color-ink)] hover:border-[var(--color-primary)] hover:bg-[var(--color-surface-pearl)] hover:text-[var(--color-primary)] focus-visible:outline-[var(--color-primary-focus)]",
    topUtilityPillClass:
      "border border-[var(--color-hairline)] bg-[var(--color-canvas-parchment)] text-[var(--color-ink-muted-80)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]",
    bottomSurfaceClass:
      "border-t border-[var(--color-hairline)] bg-[var(--color-canvas-parchment)] text-[var(--color-ink)]",
    isBottomDark: false,
    headerTextClass: "text-[#6e6e73]",
    headerLineClass: "bg-black/10",
    cardClass:
      "border border-[var(--color-hairline)] bg-[var(--color-canvas)] hover:border-[var(--color-primary)]/50 hover:bg-[var(--color-surface-pearl)] has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-[var(--color-primary-focus)] has-[a:focus-visible]:ring-offset-2 has-[a:focus-visible]:ring-offset-[var(--color-canvas-parchment)]",
    iconBadgeClass:
      "border border-black/[0.06] bg-[var(--color-canvas-parchment)] text-[var(--color-ink)] group-hover:border-[var(--color-primary)]/25 group-hover:bg-[var(--color-primary)]/10 group-hover:text-[var(--color-primary)]",
    cardTitleClass: "text-[var(--color-ink)] group-hover:text-[var(--color-primary)]",
    cardSubtitleClass: "text-[#6e6e73]",
    chevronClass:
      "text-[#6e6e73] group-hover:translate-x-0.5 group-hover:text-[var(--color-primary)]",
    emptyTextClass: "text-[#6e6e73]",
    footerBorderClass: "border-[var(--color-hairline)]",
    footerLinkClass:
      "text-[var(--color-primary)] hover:underline focus-visible:outline-[var(--color-primary-focus)]",
    footerMetaClass: "text-[#6e6e73]",
  },
  "midnight-dark": {
    id: "midnight-dark",
    name: "미드나잇 다크",
    description: "전체 다크 타일 & 스카이 블루 강조",
    topSurfaceClass: "bg-[var(--color-surface-tile-1)] text-white",
    topTitleClass: "text-white",
    topHandleClass: "text-[var(--color-body-muted)]",
    topBioClass: "text-[var(--color-body-muted)]",
    avatarFallbackClass: "bg-[var(--color-surface-tile-2)] text-white",
    socialButtonClass:
      "border border-white/12 bg-[var(--color-surface-tile-2)] text-white hover:border-[var(--color-primary-on-dark)] hover:text-[var(--color-primary-on-dark)] focus-visible:outline-[var(--color-primary-focus)]",
    topUtilityPillClass:
      "border border-white/12 bg-[var(--color-surface-tile-2)] text-[var(--color-body-muted)] hover:border-[var(--color-primary-on-dark)] hover:text-white",
    bottomSurfaceClass:
      "border-t border-white/[0.08] bg-[var(--color-surface-tile-3)] text-white",
    isBottomDark: true,
    headerTextClass: "text-[var(--color-body-muted)]",
    headerLineClass: "bg-white/12",
    cardClass:
      "border border-white/10 bg-[var(--color-surface-tile-2)] hover:border-[var(--color-primary-on-dark)]/70 hover:bg-[#323236] has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-[var(--color-primary-focus)] has-[a:focus-visible]:ring-offset-2 has-[a:focus-visible]:ring-offset-[var(--color-surface-tile-3)]",
    iconBadgeClass:
      "border border-white/10 bg-white/[0.06] text-white group-hover:border-[var(--color-primary-on-dark)]/40 group-hover:bg-[var(--color-primary-on-dark)]/15 group-hover:text-[var(--color-primary-on-dark)]",
    cardTitleClass:
      "text-white group-hover:text-[var(--color-primary-on-dark)]",
    cardSubtitleClass: "text-[var(--color-body-muted)]",
    chevronClass:
      "text-white/55 group-hover:translate-x-0.5 group-hover:text-[var(--color-primary-on-dark)]",
    emptyTextClass: "text-[var(--color-body-muted)]",
    footerBorderClass: "border-white/10",
    footerLinkClass:
      "text-[var(--color-primary-on-dark)] hover:underline focus-visible:outline-[var(--color-primary-focus)]",
    footerMetaClass: "text-white/60",
  },
  "soft-blue": {
    id: "soft-blue",
    name: "소프트 블루",
    description: "은은한 블루 틴트 & 액션 블루 포인트",
    topSurfaceClass: "bg-[var(--color-canvas)] text-[var(--color-ink)]",
    topTitleClass: "text-[var(--color-ink)]",
    topHandleClass: "text-[#4b5e77]",
    topBioClass: "text-[var(--color-ink-muted-80)]",
    avatarFallbackClass: "bg-[#eef4fb] text-[var(--color-action-blue)]",
    socialButtonClass:
      "border border-[#d5e2f2] bg-[#f4f8fd] text-[var(--color-ink)] hover:border-[var(--color-action-blue)] hover:bg-[#e8f1fc] hover:text-[var(--color-action-blue)] focus-visible:outline-[var(--color-primary-focus)]",
    topUtilityPillClass:
      "border border-[#d5e2f2] bg-[#f4f8fd] text-[#4b5e77] hover:border-[var(--color-action-blue)] hover:text-[var(--color-action-blue)]",
    bottomSurfaceClass:
      "border-t border-[#dce7f5] bg-[#eef4fb] text-[var(--color-ink)]",
    isBottomDark: false,
    headerTextClass: "text-[#4b5e77]",
    headerLineClass: "bg-[#c6d7eb]",
    cardClass:
      "border border-[#d5e2f2] bg-[var(--color-canvas)] hover:border-[var(--color-action-blue)]/55 hover:bg-[#f8fbff] has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-[var(--color-primary-focus)] has-[a:focus-visible]:ring-offset-2 has-[a:focus-visible]:ring-offset-[#eef4fb]",
    iconBadgeClass:
      "border border-[#dce7f5] bg-[#f4f8fd] text-[var(--color-action-blue)] group-hover:border-[var(--color-action-blue)]/30 group-hover:bg-[var(--color-action-blue)]/12",
    cardTitleClass: "text-[var(--color-ink)] group-hover:text-[var(--color-action-blue)]",
    cardSubtitleClass: "text-[#4b5e77]",
    chevronClass:
      "text-[#4b5e77] group-hover:translate-x-0.5 group-hover:text-[var(--color-action-blue)]",
    emptyTextClass: "text-[#4b5e77]",
    footerBorderClass: "border-[#d5e2f5]",
    footerLinkClass:
      "text-[var(--color-action-blue)] hover:underline focus-visible:outline-[var(--color-primary-focus)]",
    footerMetaClass: "text-[#4b5e77]",
  },
};

export function getThemeTokens(preset?: ThemePreset): ThemeTokens {
  return THEME_PRESETS[preset ?? "apple-classic"] ?? THEME_PRESETS["apple-classic"];
}

export function getButtonRadiusClass(style?: ButtonStyle): string {
  return style === "pill" ? "rounded-full" : "rounded-[18px]";
}
