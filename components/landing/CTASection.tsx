/**
 * CTA (Call to Action) 섹션 컴포넌트
 * 최종 행동 유도 섹션입니다.
 */

'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

/**
 * CTA 섹션 컴포넌트
 */
export const CTASection: React.FC = () => {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-br from-primary/10 via-primary/5 to-background">
      <div className="container mx-auto">
        <div className="mx-auto max-w-3xl text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold">
              지금 바로 시작하세요
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground">
              플랫폼 수수료에서 벗어나 직접 영업을 시작할 시간입니다.
              <br />
              첫 제안서는 무료로 작성할 수 있습니다.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="h-12 px-8 text-base w-full sm:w-auto" asChild>
              <Link href="/signup">
                첫 제안 시작하기
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-12 px-8 text-base w-full sm:w-auto"
              asChild
           ></Button>
          </div>

         </div>
      </div>
    </section>
  );
};
