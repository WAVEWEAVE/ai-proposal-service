import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "대시보드",
  description: "내 제안서를 관리하고 새로운 제안서를 작성하세요.",
  openGraph: {
    title: "대시보드 | Proposal Flow",
    description: "내 제안서를 관리하고 새로운 제안서를 작성하세요.",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
