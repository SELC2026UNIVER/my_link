import { LinkCard as SharedLinkCard } from "@/app/components/LinkCard";
import type { MyLinkItem } from "../links-data";

interface LinkCardProps {
  item: MyLinkItem;
}

/**
 * /links 페이지 전용 래퍼 — 공용 shadcn/ui LinkCard를 재사용한다.
 */
export function LinkCard({ item }: LinkCardProps) {
  return (
    <SharedLinkCard
      title={item.title}
      url={item.url}
      subtitle={item.url}
      icon={item.icon}
      category={item.category}
    />
  );
}
