import type { Metadata } from "next";
import { IBM_Plex_Mono, Noto_Sans_KR, Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "700"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-kr",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  title: "홍길동 | 초보 개발자 프로필",
  description:
    "열심히 배우고 매일 조금씩 노력하며 최선을 다하는 초보 개발자 홍길동의 웹 프로필입니다.",
  openGraph: {
    title: "홍길동 | 초보 개발자 프로필",
    description:
      "열심히 배우고 매일 조금씩 노력하며 최선을 다하는 초보 개발자 홍길동의 웹 프로필입니다.",
    images: ["/banner-scrapbook.jpg"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={`${spaceGrotesk.variable} ${ibmPlexMono.variable} ${notoSansKr.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#F7F3E9] text-[#161616] selection:bg-[#F2C14E] selection:text-[#161616]">
        {children}
      </body>
    </html>
  );
}
