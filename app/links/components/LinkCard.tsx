import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  isExternalHttpUrl,
  resolveSafeHref,
  type MyLinkItem,
} from "../links-data";
import { LinkIconBadge } from "./LinkIconBadge";

interface LinkCardProps {
  item: MyLinkItem;
}

/**
 * shadcn/ui Card + Apple 디자인 시스템(design.md) 기반 링크 목록 카드 컴포넌트.
 * 카드 그림자 없이 18px 둥근 모서리와 1px 헤어라인 보더를 사용한다.
 */
export function LinkCard({ item }: LinkCardProps) {
  const href = resolveSafeHref(item.url);
  const isExternal = isExternalHttpUrl(href);

  return (
    <Card className="group gap-0 rounded-[18px] border border-border bg-card p-0 py-0 shadow-none ring-0 transition-all duration-150 hover:border-primary/40 hover:bg-[var(--color-surface-pearl)] has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-ring has-[a:focus-visible]:ring-offset-2 has-[a:focus-visible]:ring-offset-secondary active:scale-[0.985]">
      <a
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className="flex min-h-[68px] w-full items-center gap-3.5 rounded-[18px] px-4 py-3.5 outline-none"
      >
        <LinkIconBadge icon={item.icon} />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-[17px] font-semibold leading-[1.24] tracking-[-0.022em] text-foreground transition-colors group-hover:text-primary">
              {item.title}
            </span>
            {item.category ? (
              <Badge
                variant="secondary"
                className="h-5 shrink-0 rounded-full bg-secondary px-2 text-[11px] font-normal text-muted-foreground"
              >
                {item.category}
              </Badge>
            ) : null}
          </div>

          <p
            className="mt-0.5 truncate text-[13px] font-normal leading-[1.4] tracking-[-0.01em] text-muted-foreground"
            title={item.url}
          >
            {item.url}
          </p>
        </div>

        <ChevronRight
          aria-hidden="true"
          className="size-[18px] shrink-0 text-muted-foreground/70 transition-all duration-150 group-hover:translate-x-0.5 group-hover:text-primary"
          strokeWidth={1.75}
        />
      </a>
    </Card>
  );
}
