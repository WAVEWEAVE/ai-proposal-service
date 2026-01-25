import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "로그인",
  description: "Proposal Flow 계정으로 로그인하여 제안서 작성을 시작하세요.",
  openGraph: {
    title: "로그인 | Proposal Flow",
    description: "Proposal Flow 계정으로 로그인하여 제안서 작성을 시작하세요.",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
