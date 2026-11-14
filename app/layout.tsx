import type { Metadata } from "next";
import { Inter, Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/app/components/AuthProvider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
});

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-kr",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  preload: false,
});

function resolveMetadataBase(): URL {
  const candidate =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "") ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
    "http://localhost:3000";

  try {
    return new URL(
      candidate.startsWith("http://") || candidate.startsWith("https://")
        ? candidate
        : `https://${candidate}`
    );
  } catch {
    return new URL("http://localhost:3000");
  }
}

export const metadata: Metadata = {
  metadataBase: resolveMetadataBase(),
  title: "홍길동 | 초보 웹 개발자",
  description:
    "열심히 배우고 매일 노력하며 최선을 다하는 초보 개발자 홍길동의 웹 프로필입니다.",
  openGraph: {
    title: "홍길동 | 초보 웹 개발자",
    description:
      "열심히 배우고 매일 노력하며 최선을 다하는 초보 개발자 홍길동의 웹 프로필입니다.",
    images: ["/desk-studio.jpg"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={cn("h-full antialiased", inter.variable, notoSansKr.variable)}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-primary/15 selection:text-foreground">
        <TooltipProvider>
          <AuthProvider>{children}</AuthProvider>
          <Toaster position="bottom-right" />
        </TooltipProvider>
      </body>
    </html>
  );
}
