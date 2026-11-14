import { Loader2Icon } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

interface SpinnerProps extends ComponentProps<"svg"> {
  /** 버튼 내부 등 인접 텍스트가 상태를 설명할 때 true로 지정해 중복 스크린 리더 안내를 방지한다. */
  decorative?: boolean;
}

/**
 * 애플 미니멀 모노톤 테마용 로딩 스피너 프리미티브.
 */
function Spinner({
  className,
  decorative = false,
  ...props
}: SpinnerProps) {
  return (
    <Loader2Icon
      role={decorative ? undefined : "status"}
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : (props["aria-label"] ?? "불러오는 중")}
      strokeWidth={1.75}
      className={cn("size-4 animate-spin text-muted-foreground", className)}
      {...props}
    />
  );
}

export { Spinner };
