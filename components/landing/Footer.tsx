/**
 * 푸터 컴포넌트
 * 사이트 하단 정보를 표시합니다.
 */

'use client';

import Link from 'next/link';
import { Sparkles } from 'lucide-react';

/**
 * 푸터 컴포넌트
 */
export const Footer: React.FC = () => {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 브랜드 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold">Proposal Flow</span>
            </div>
            <p className="text-sm text-muted-foreground">
              AI 기반 제안서 빌더로
              <br />
              프리랜서의 영업을 돕습니다.
            </p>
          </div>

          {/* 제품 */}
          <div className="space-y-4">
            <h3 className="font-semibold">제품</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/features" className="hover:text-foreground transition-colors">
                  주요 기능
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-foreground transition-colors">
                  가격 안내
                </Link>
              </li>
              <li>
                <Link href="/examples" className="hover:text-foreground transition-colors">
                  제안서 예시
                </Link>
              </li>
            </ul>
          </div>

          {/* 지원 */}
          <div className="space-y-4">
            <h3 className="font-semibold">지원</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/docs" className="hover:text-foreground transition-colors">
                  사용 가이드
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-foreground transition-colors">
                  자주 묻는 질문
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground transition-colors">
                  문의하기
                </Link>
              </li>
            </ul>
          </div>

          {/* 법적 */}
          <div className="space-y-4">
            <h3 className="font-semibold">법적 고지</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/terms" className="hover:text-foreground transition-colors">
                  이용약관
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-foreground transition-colors">
                  개인정보처리방침
                </Link>
              </li>
              <li>
                <Link href="/legal" className="hover:text-foreground transition-colors">
                  법적 고지
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* 하단 저작권 */}
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© 2026 Proposal Flow. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
