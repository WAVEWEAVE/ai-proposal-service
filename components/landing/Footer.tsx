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
        <div className="flex flex-col items-center space-y-6 text-center">
          {/* 브랜드 */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">Proposal Flow</span>
          </div>

          {/* 회사 정보 */}
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>웨이브위브｜대표자 김유나｜사업자등록번호 237-26-02027</p>
            <p>인천광역시 연수구 인천타워대로 323, 에이동 20층 A-211호(송도동, 송도 센트로드)</p>
          </div>

          {/* 링크 */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/terms" className="hover:text-foreground transition-colors">
              이용약관
            </Link>
            <span>｜</span>
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              개인정보처리방침
            </Link>
          </div>

          {/* 저작권 */}
          <p className="text-sm text-muted-foreground">
            © 2026 waveweave All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
