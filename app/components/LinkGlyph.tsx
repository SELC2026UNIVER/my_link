import type { LucideIcon } from "lucide-react";
import {
  AtSign,
  BookOpen,
  Camera,
  Code2,
  Compass,
  FolderCode,
  Link2,
  Mail,
  MessageCircle,
  Music2,
  ShoppingBag,
  Video,
} from "lucide-react";
import type { LinkIcon, SocialPlatform } from "@/app/lib/types";

type GlyphKey = LinkIcon | SocialPlatform;

const GLYPH_MAP: Record<GlyphKey, LucideIcon> = {
  link: Link2,
  instagram: Camera,
  youtube: Video,
  tiktok: Music2,
  x: AtSign,
  threads: MessageCircle,
  github: Code2,
  kakao: MessageCircle,
  naver: Compass,
  blog: BookOpen,
  email: Mail,
  shop: ShoppingBag,
  portfolio: FolderCode,
};

interface LinkGlyphProps {
  icon?: GlyphKey;
  className?: string;
}

/**
 * 링크 및 소셜 플랫폼 아이콘을 단일 매핑 테이블로 렌더링한다.
 */
export function LinkGlyph({ icon = "link", className = "size-[18px]" }: LinkGlyphProps) {
  const Icon = GLYPH_MAP[icon] ?? Link2;
  return <Icon className={className} strokeWidth={1.75} aria-hidden="true" />;
}
