import type { StaticImageData } from "next/image";
import avatarImg from "@/public/avatar.jpg";
import deskStudioImg from "@/public/desk-studio.jpg";
import projectCafeCleanImg from "@/public/project-cafe-clean.jpg";
import projectTodoCleanImg from "@/public/project-todo-clean.jpg";

export interface PracticeProjectItem {
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

export interface DeskHighlight {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
  image: StaticImageData;
  imageAlt: string;
  specs: string[];
}

export interface ChecklistGoal {
  id: string;
  text: string;
  done: boolean;
}

// 초보 개발자 프로필 데이터
export const profile = {
  name: "홍길동",
  handle: "@gildong_study",
  role: "초보 웹 개발자",
  subRole: "컴퓨터공학 공부 중",
  location: "서울",
  status: "열심히 배우는 중",
  email: "hello@example.com",
  intro:
    "안녕하세요! 아직 배울 게 많은 초보 개발자 홍길동입니다. 처음 화면에 글자를 띄웠던 날의 기쁨을 기억하며, 오늘도 조금씩 앞으로 나아가려고 열심히 공부하고 있습니다. 서툴더라도 포기하지 않고 끝까지 노력하며, 작은 기능 하나에도 최선을 다해 만들어 보고 있습니다.",
  avatar: avatarImg,
  avatarAlt:
    "단정한 차콜 스웨터와 동그란 안경을 쓰고 밝은 오프화이트 스튜디오 배경 앞에서 온화하게 웃고 있는 초보 개발자 홍길동 프로필 사진",
  desk: deskStudioImg,
  deskAlt:
    "자연광이 들어오는 하얀 미니멀 책상 위에 실버 노트북과 흰색 스프링 노트, 은색 펜, 따뜻한 커피 머그컵이 깔끔하게 놓여 있는 공부 책상 사진",
};

export const beginnerMilestones = [
  { label: "연습 작품", value: "3개", note: "차근차근 제작 중" },
  { label: "공부 목표", value: "매일 1커밋", note: "꾸준히 노력 중" },
  { label: "에너지", value: "아이스 커피", note: "오늘도 최선" },
];

export const studyLog = {
  badge: "TODAY'S TIL",
  title: "오늘의 공부 기록",
  date: "2026.11.14",
  entries: [
    {
      topic: "HTML · CSS",
      text: "시맨틱 태그와 Flexbox 정렬이 자꾸 헷갈려서 예제를 다섯 번 다시 만들어 보며 열심히 익혔습니다.",
    },
    {
      topic: "JavaScript",
      text: "map과 filter로 목록을 걸러내는 연습 중입니다. 아직 손에 안 익어서 콘솔을 자주 찍어보며 노력하고 있어요.",
    },
    {
      topic: "React · Next.js",
      text: "컴포넌트끼리 props를 넘겨주는 흐름을 연습장에 그림으로 그려가며 최선을 다해 이해하는 중입니다.",
    },
  ],
  dailyMemo:
    "남들과 비교해서 조급해하지 말고, 어제의 나보다 딱 한 줄만 더 이해하려고 노력하자!",
};

export const initialChecklist: ChecklistGoal[] = [
  {
    id: "goal-1",
    text: "모르는 에러가 나와도 겁먹지 않고 열심히 검색해 보기",
    done: true,
  },
  {
    id: "goal-2",
    text: "매일 1커밋 목표로 조금이라도 코드 만지려 노력하기",
    done: true,
  },
  {
    id: "goal-3",
    text: "작은 연습 화면이라도 대충 넘기지 않고 최선을 다하기",
    done: true,
  },
  {
    id: "goal-4",
    text: "주말마다 이번 주 배운 내용 블로그에 한 편씩 정리하기",
    done: false,
  },
];

export const learningStack = [
  { name: "HTML & CSS", level: "기초 다지기" },
  { name: "JavaScript", level: "열심히 공부 중" },
  { name: "TypeScript", level: "조금씩 익히는 중" },
  { name: "React", level: "컴포넌트 연습" },
  { name: "Next.js", level: "페이지 만들기" },
  { name: "Git & GitHub", level: "매일 커밋 노력" },
];

export const deskHighlight: DeskHighlight = {
  id: "study-desk",
  eyebrow: "MY STUDY DESK",
  title: "오늘도 앉아 있는 공부 책상",
  subtitle: "노트에 적고, 코드 치고, 다시 고쳐 보기",
  description:
    "노트북 옆에 항상 스프링 노트와 펜을 두고 공부합니다. 처음 보는 개념은 직접 손으로 적어 가며 열심히 익히려고 노력합니다.",
  image: deskStudioImg,
  imageAlt:
    "자연광이 들어오는 하얀 미니멀 책상 위에 실버 노트북과 흰색 스프링 노트, 은색 펜, 따뜻한 커피 머그컵이 깔끔하게 놓여 있는 공부 책상 사진",
  specs: ["스프링 노트", "볼펜 필기", "따뜻한 커피", "초보의 자세"],
};

export const practiceProjects: PracticeProjectItem[] = [
  {
    id: "mini-todo",
    title: "미니 할 일 메모장",
    badge: "연습작 #01",
    year: "2026",
    summary:
      "해야 할 일을 적고 완료 표시를 남길 수 있는 작은 웹 메모장입니다. 처음이라 코드가 투박하지만, 직접 화면을 움직이게 만들려고 열심히 찾아보며 완성했습니다.",
    image: projectTodoCleanImg,
    imageAlt:
      "밝은 스튜디오 배경 위에 세워진 태블릿 화면에 파란색 체크 버튼과 목록 줄이 단정하게 담긴 미니 할 일 메모장 미리보기",
    tags: ["HTML", "CSS", "JavaScript"],
    highlights: [
      "할 일 추가, 완료 체크 줄 긋기, 삭제 버튼 직접 구현",
      "새로고침해도 목록이 남도록 브라우저 저장소 연습",
      "작은 휴대폰 화면에서도 버튼이 안 겹치게 고치려 노력",
    ],
    href: "https://github.com/",
  },
  {
    id: "cafe-menu-clone",
    title: "동네 카페 메뉴판 클론 코딩",
    badge: "연습작 #02",
    year: "2026",
    summary:
      "자주 가는 동네 카페 메뉴판을 웹 화면으로 옮겨 본 연습 프로젝트입니다. 글씨 크기와 카드 간격을 맞추려고 최선을 다해 여러 번 수정해 보았습니다.",
    image: projectCafeCleanImg,
    imageAlt:
      "실버 메탈 스탠드 위의 스마트폰 화면에 따뜻한 커피 사진과 카페 메뉴 카드가 정갈하게 배치된 동네 카페 메뉴판 클론 코딩 미리보기",
    tags: ["React", "Tailwind CSS"],
    highlights: [
      "음료·디저트 탭을 눌러 종류별로 골라 보기 연습",
      "화면 폭에 맞춰 카드 줄 수가 바뀌는 반응형 배치",
      "카드를 누르면 상세 안내 창이 열리도록 직접 연결",
    ],
    href: "https://github.com/",
  },
];

export const contactLinks = [
  {
    id: "github",
    label: "GitHub",
    description: "공부 흔적 & 1일 1커밋 기록",
    href: "https://github.com/",
  },
  {
    id: "blog",
    label: "공부 블로그",
    description: "초보 개발자의 배움 메모",
    href: "#study-log",
  },
  {
    id: "contact",
    label: "이메일 보내기",
    description: "응원과 조언 모두 감사합니다",
    href: `mailto:${profile.email}`,
  },
];
