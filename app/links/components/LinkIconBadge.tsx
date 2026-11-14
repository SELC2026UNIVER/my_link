import { LinkGlyph } from "@/app/components/LinkGlyph";
import { cn } from "@/lib/utils";
import type { LinkIconKey } from "../links-data";

interface LinkIconBadgeProps {
  icon: LinkIconKey;
  className?: string;
}

/**
 * Apple 유틸리티 카드 스타일의 단색 아이콘 컨테이너.
 */
export function LinkIconBadge({ icon, className }: LinkIconBadgeProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-[10px] border border-black/[0.05] bg-secondary text-foreground transition-colors duration-150 group-hover:border-primary/20 group-hover:bg-primary/10 group-hover:text-primary",
        className
      )}
    >
      <LinkGlyph icon={icon} className="size-[18px]" />
    </div>
  );
}
