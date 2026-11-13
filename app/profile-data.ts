import type { StaticImageData } from "next/image";
import avatarImg from "@/public/avatar.jpg";
import heroBannerImg from "@/public/hero-banner.jpg";
import projectAiImg from "@/public/project-ai.jpg";
import projectWebImg from "@/public/project-web.jpg";
import workspaceImg from "@/public/workspace.jpg";

export interface VisualProjectItem {
  id: string;
  title: string;
  badge: string;
  year: string;
  summary: string;
  image: StaticImageData;
  imageAlt: string;
  tags: string[];
  highlights: string[];
  href?: string;
}

export interface WorkspaceHighlight {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
  image: StaticImageData;
  imageAlt: string;
  specs: string[];
}

// 프로필 및 프로젝트 데이터 (원하는 내용으로 자유롭게 수정하세요)
export const profile = {
  name: "홍길동",
  handle: "@gildong.dev",
  role: "Full-Stack Developer",
  subRole: "Computer Science Student",
  location: "Seoul, KR",
  status: "Open to work",
  email: "hello@example.com",
  intro:
    "사용자 경험을 집요하게 고민하고, 아이디어를 빠르게 제품으로 만드는 개발자입니다. React · Next.js 기반의 웹 서비스부터 AI를 활용한 바이브 코딩까지, 매일 한 줄씩 더 나은 코드를 씁니다.",
  avatar: avatarImg,
  avatarAlt: "홍길동 개발자 프로필 3D 일러스트",
  banner: heroBannerImg,
  bannerAlt: "네온 노드와 유리 웨이브가 빛나는 3D 개발자 프로필 커버 배너",
};

export const stats = [
  { value: "12+", label: "Projects", hint: "Web & AI" },
  { value: "1.2k", label: "Commits", hint: "This year" },
  { value: "∞", label: "Coffee", hint: "Daily fuel" },
];

export const developerSnippet = {
  focus: "Web · AI",
  motto: "Ship fast, learn faster",
  currently: "Building Next.js experiences",
};

export const stack = [
  { name: "TypeScript", category: "Language", color: "bg-sky-400" },
  { name: "React", category: "Frontend", color: "bg-cyan-400" },
  { name: "Next.js", category: "Framework", color: "bg-zinc-100" },
  { name: "Tailwind", category: "Styling", color: "bg-teal-400" },
  { name: "Node.js", category: "Backend", color: "bg-lime-400" },
  { name: "Python", category: "AI / Script", color: "bg-yellow-300" },
];

export const workspaceHighlight: WorkspaceHighlight = {
  id: "workspace-desk",
  eyebrow: "MY DESK SETUP",
  title: "Late-Night Vibe Desk",
  subtitle: "코드와 커피가 만나는 나만의 작업 공간",
  description:
    "어두운 밤, 은은한 인디고·바이올렛 조명 아래서 몰입하는 개발 환경을 좋아합니다. 깔끔한 에디터 테마와 빠른 키보드, 그리고 따뜻한 커피 한 잔으로 아이디어를 구현합니다.",
  image: workspaceImg,
  imageAlt: "네온 조명과 코드 모니터, 커피 머그잔이 놓인 3D 개발자 데스크 일러스트",
  specs: ["VS Code", "Next.js 16", "TypeScript", "Dark Roast"],
};

export const featuredProjects: VisualProjectItem[] = [
  {
    id: "neural-vibe-studio",
    title: "Neural Vibe Studio",
    badge: "AI · Featured",
    year: "2026",
    summary:
      "AI 페어 프로그래밍과 실시간 UI 프리뷰를 결합해 아이디어를 즉시 인터랙티브 웹 프로토타입으로 전환하는 워크스페이스입니다.",
    image: projectAiImg,
    imageAlt: "보라빛 AI 뉴럴 구체와 다크 글래스 대시보드 카드들이 떠 있는 3D 일러스트",
    tags: ["Next.js", "TypeScript", "AI Workflow", "Tailwind"],
    highlights: [
      "스트리밍 AI 코드 생성 및 실시간 컴포넌트 프리뷰",
      "다크 글래스모피즘 기반의 집중형 스튜디오 UI",
      "프롬프트 히스토리 및 버전 스냅샷 관리",
    ],
    href: "https://github.com/",
  },
  {
    id: "bento-glass-ui",
    title: "Bento Glass UI",
    badge: "Design System",
    year: "2026",
    summary:
      "모던 다크 테마 서비스와 개인 포트폴리오를 위해 설계한 모듈형 벤토 그리드 및 글래스 UI 컴포넌트 모음입니다.",
    image: projectWebImg,
    imageAlt: "아이소메트릭 다크 글래스 브라우저 창과 모듈형 UI 카드가 배치된 3D 일러스트",
    tags: ["React 19", "Tailwind v4", "Design System"],
    highlights: [
      "부드러운 마이크로 인터랙션과 키보드 접근성 지원",
      "반응형 벤토 그리드 레이아웃 프리셋 제공",
      "가볍고 커스터마이징하기 쉬운 CSS 토큰 구조",
    ],
    href: "https://github.com/",
  },
];

export const contactLinks = [
  {
    id: "github",
    label: "GitHub",
    description: "코드와 오픈소스 프로젝트",
    href: "https://github.com/",
    primary: true,
  },
  {
    id: "blog",
    label: "Blog",
    description: "개발 기록과 트러블슈팅",
    href: "#",
    primary: false,
  },
  {
    id: "contact",
    label: "Contact",
    description: "협업 및 커피챗 문의",
    href: `mailto:${profile.email}`,
    primary: false,
  },
];
