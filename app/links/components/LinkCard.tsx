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
 * shadcn/ui Card 기반 토스(TDS) 스타일 링크 목록 카드 컴포넌트.
 */
export function LinkCard({ item }: LinkCardProps) {
  const href = resolveSafeHref(item.url);
  const isExternal = isExternalHttpUrl(href);

  return (
    <Card className="group gap-0 rounded-[20px] border border-black/[0.04] bg-white p-0 py-0 shadow-[0_2px_12px_rgba(15,23,42,0.04)] ring-0 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#3182f6]/25 hover:bg-[#fcfdff] hover:shadow-[0_8px_24px_rgba(49,130,246,0.10)] has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-[#3182f6] has-[a:focus-visible]:ring-offset-2 has-[a:focus-visible]:ring-offset-[#f2f4f6] active:translate-y-0 active:scale-[0.985]">
      <a
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className="flex w-full items-center gap-3.5 rounded-[20px] px-4 py-3.5 outline-none"
      >
        <LinkIconBadge icon={item.icon} />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-[16px] font-semibold leading-snug tracking-[-0.02em] text-[#191f28] transition-colors group-hover:text-[#1b64da]">
              {item.title}
            </span>
            {item.category ? (
              <Badge
                variant="secondary"
                className="h-5 shrink-0 rounded-full bg-[#f2f4f6] px-2 text-[11px] font-medium text-[#4e5968]"
              >
                {item.category}
              </Badge>
            ) : null}
          </div>

          <p
            className="mt-0.5 truncate text-[13px] font-normal leading-normal text-[#6b7684]"
            title={item.url}
          >
            {item.url}
          </p>
        </div>

        <ChevronRight
          aria-hidden="true"
          className="size-5 shrink-0 text-[#b0b8c1] transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-[#3182f6]"
        />
      </a>
    </Card>
  );
}
