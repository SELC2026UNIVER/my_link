import { ChevronRight } from "lucide-react";
import type { MouseEvent } from "react";
import { getButtonRadiusClass } from "@/app/lib/themes";
import type { ButtonStyle, LinkIcon, SocialPlatform } from "@/app/lib/types";
import { isExternalHttpUrl, resolveSafeHref } from "@/app/lib/validators";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LinkGlyph } from "./LinkGlyph";

export interface LinkCardStyleTokens {
  cardClass: string;
  iconBadgeClass: string;
  cardTitleClass: string;
  cardSubtitleClass: string;
  chevronClass: string;
}

const DEFAULT_LIGHT_CARD_TOKENS: LinkCardStyleTokens = {
  cardClass:
    "border border-border bg-card hover:border-primary/40 hover:bg-[var(--color-surface-pearl)] has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-ring has-[a:focus-visible]:ring-offset-2 has-[a:focus-visible]:ring-offset-secondary",
  iconBadgeClass:
    "border border-black/[0.05] bg-secondary text-foreground group-hover:border-primary/20 group-hover:bg-primary/10 group-hover:text-primary",
  cardTitleClass: "text-foreground group-hover:text-primary",
  cardSubtitleClass: "text-muted-foreground",
  chevronClass:
    "text-muted-foreground/70 group-hover:translate-x-0.5 group-hover:text-primary",
};

export interface LinkCardProps {
  title: string;
  url: string;
  subtitle?: string;
  icon?: LinkIcon | SocialPlatform;
  category?: string;
  buttonStyle?: ButtonStyle;
  styleTokens?: LinkCardStyleTokens;
  isPreview?: boolean;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  className?: string;
}

/**
 * shadcn/ui Card + Tailwind CSS 기반의 공용 링크 카드 컴포넌트.
 * 카드 그림자 없이 18px(또는 pill) 모서리와 1px 헤어라인 보더를 사용한다.
 */
export function LinkCard({
  title,
  url,
  subtitle,
  icon = "link",
  category,
  buttonStyle = "card",
  styleTokens = DEFAULT_LIGHT_CARD_TOKENS,
  isPreview = false,
  onClick,
  className,
}: LinkCardProps) {
  const safeHref = resolveSafeHref(url);
  const isExternal = isExternalHttpUrl(safeHref);
  const cardRadiusClass = getButtonRadiusClass(buttonStyle);
  const isPillButton = buttonStyle === "pill";

  return (
    <Card
      className={cn(
        "group gap-0 p-0 py-0 shadow-none ring-0 transition-all duration-150 active:scale-[0.985]",
        cardRadiusClass,
        styleTokens.cardClass,
        className
      )}
    >
      <a
        href={safeHref}
        target={isExternal && !isPreview ? "_blank" : undefined}
        rel={isExternal && !isPreview ? "noopener noreferrer" : undefined}
        onClick={onClick}
        aria-label={title}
        title={url ? `${title} (${url})` : title}
        className={cn(
          "flex min-h-[64px] w-full items-center justify-center gap-3.5 px-4 py-3.5 outline-none min-[401px]:justify-start",
          cardRadiusClass
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "flex size-11 shrink-0 items-center justify-center transition-colors duration-150 min-[401px]:size-10",
            isPillButton ? "rounded-full" : "rounded-[10px]",
            styleTokens.iconBadgeClass
          )}
        >
          <LinkGlyph
            icon={icon}
            className="size-5 min-[401px]:size-[18px]"
          />
        </span>

        <span className="hidden min-w-0 flex-1 text-left min-[401px]:block">
          <span className="flex items-center gap-2">
            <span
              className={cn(
                "truncate text-[17px] font-semibold leading-[1.24] tracking-[-0.022em] transition-colors",
                styleTokens.cardTitleClass
              )}
            >
              {title}
            </span>
            {category ? (
              <Badge
                variant="secondary"
                className="h-5 shrink-0 rounded-full bg-secondary px-2 text-[11px] font-normal text-muted-foreground"
              >
                {category}
              </Badge>
            ) : null}
          </span>

          {subtitle ? (
            <span
              className={cn(
                "mt-0.5 block truncate text-[13px] font-normal leading-[1.4] tracking-[-0.01em]",
                styleTokens.cardSubtitleClass
              )}
              title={url}
            >
              {subtitle}
            </span>
          ) : null}
        </span>

        <ChevronRight
          aria-hidden="true"
          className={cn(
            "hidden size-[18px] shrink-0 transition-all duration-150 min-[401px]:block",
            styleTokens.chevronClass
          )}
          strokeWidth={1.75}
        />
      </a>
    </Card>
  );
}
