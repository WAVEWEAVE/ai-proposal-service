import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "회원가입",
  description: "무료로 가입하고 AI 기반 제안서 작성을 시작하세요. 이메일만으로 간편하게 가입할 수 있습니다.",
  openGraph: {
    title: "회원가입 | Proposal Flow",
    description: "무료로 가입하고 AI 기반 제안서 작성을 시작하세요.",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
