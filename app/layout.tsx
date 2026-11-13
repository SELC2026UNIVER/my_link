import type { Metadata } from "next";
import { Inter, Noto_Sans_KR } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
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
      className={`${inter.variable} ${notoSansKr.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#ffffff] text-[#1d1d1f] selection:bg-[#0066cc]/15 selection:text-[#1d1d1f]">
        {children}
      </body>
    </html>
  );
}
