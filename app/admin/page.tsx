import type { Metadata } from "next";
import { AdminDashboardClient } from "@/app/components/AdminDashboardClient";

export const metadata: Metadata = {
  title: "대시보드 | MyLink Admin",
  description:
    "MyLink 링크 추가 다이얼로그, 로컬 저장소 관리 및 실시간 모바일 미리보기를 제공하는 대시보드입니다.",
};

export default function AdminPage() {
  return <AdminDashboardClient />;
}
