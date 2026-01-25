import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "제안서 작성",
  description: "AI와 함께 전문적인 제안서를 작성하세요.",
  openGraph: {
    title: "제안서 작성 | Proposal Flow",
    description: "AI와 함께 전문적인 제안서를 작성하세요.",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProposalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
