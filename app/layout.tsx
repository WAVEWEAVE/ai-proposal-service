import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Proposal Flow - AI 기반 제안서 작성 서비스",
    template: "%s | Proposal Flow"
  },
  description: "17개의 간단한 질문으로 AI가 전문적인 제안서를 자동 생성합니다. 프리랜서와 1인 기업가를 위한 가장 빠른 제안서 작성 도구.",
  keywords: [
    "제안서",
    "제안서 작성",
    "AI 제안서",
    "프리랜서",
    "1인 기업",
    "비즈니스 제안",
    "제안서 자동화",
    "제안서 템플릿",
    "사업 제안서"
  ],
  authors: [{ name: "Proposal Flow" }],
  creator: "Proposal Flow",
  publisher: "Proposal Flow",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "/",
    siteName: "Proposal Flow",
    title: "Proposal Flow - AI 기반 제안서 작성",
    description: "17개 질문으로 전문 제안서를 자동 생성하세요",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Proposal Flow - AI 기반 제안서 작성 서비스"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Proposal Flow - AI 기반 제안서 작성",
    description: "17개 질문으로 전문 제안서를 자동 생성하세요",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
