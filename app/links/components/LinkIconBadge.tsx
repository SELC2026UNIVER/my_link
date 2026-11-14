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

interface IconBadgeConfig {
  Icon: LucideIcon;
  containerClass: string;
}

const ICON_STYLE_MAP: Record<LinkIconKey, IconBadgeConfig> = {
  github: {
    Icon: Code2,
    containerClass: "bg-[#f2f4f6] text-[#191f28]",
  },
  blog: {
    Icon: BookOpen,
    containerClass: "bg-[#e8f3ff] text-[#1b64da]",
  },
  portfolio: {
    Icon: FolderCode,
    containerClass: "bg-[#ecfbf2] text-[#0b7a4b]",
  },
  youtube: {
    Icon: Video,
    containerClass: "bg-[#ffefef] text-[#c82829]",
  },
  instagram: {
    Icon: Camera,
    containerClass: "bg-[#f8effe] text-[#7b2cbf]",
  },
  email: {
    Icon: Mail,
    containerClass: "bg-[#fff6e6] text-[#9c5700]",
  },
  link: {
    Icon: Link2,
    containerClass: "bg-[#e8f3ff] text-[#1b64da]",
  },
};

interface LinkIconBadgeProps {
  icon: LinkIconKey;
  className?: string;
}

/**
 * TDS 스타일 스쿼클(squircle) 파스텔 아이콘 배지.
 */
export function LinkIconBadge({ icon, className }: LinkIconBadgeProps) {
  const { Icon, containerClass } = ICON_STYLE_MAP[icon] ?? ICON_STYLE_MAP.link;

  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex size-11 shrink-0 items-center justify-center rounded-[14px] transition-transform duration-200 group-hover:scale-105",
        containerClass,
        className
      )}
    >
      <Icon className="size-5" strokeWidth={2} />
    </div>
  );
}
