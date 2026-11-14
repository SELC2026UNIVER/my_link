import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Camera,
  Code2,
  FolderCode,
  Link2,
  Mail,
  Video,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { LinkIconKey } from "../links-data";

const ICON_COMPONENT_MAP: Record<LinkIconKey, LucideIcon> = {
  github: Code2,
  blog: BookOpen,
  portfolio: FolderCode,
  youtube: Video,
  instagram: Camera,
  email: Mail,
  link: Link2,
};

interface LinkIconBadgeProps {
  icon: LinkIconKey;
  className?: string;
}

/**
 * Apple 유틸리티 카드 스타일의 단색 아이콘 컨테이너.
 * design.md 단일 액센트(#0066cc) 원칙에 따라 기본은 뉴트럴(Parchment), 호버 시 Action Blue로 전환된다.
 */
export function LinkIconBadge({ icon, className }: LinkIconBadgeProps) {
  const Icon = ICON_COMPONENT_MAP[icon] ?? ICON_COMPONENT_MAP.link;

  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-[10px] border border-black/[0.05] bg-secondary text-foreground transition-colors duration-150 group-hover:border-primary/20 group-hover:bg-primary/10 group-hover:text-primary",
        className
      )}
    >
      <Icon className="size-[18px]" strokeWidth={1.75} />
    </div>
  );
}
