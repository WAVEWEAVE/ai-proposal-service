/**
 * 히어로 섹션 컴포넌트
 * 메인 텍스트, 입력 필드, CTA 버튼을 포함합니다.
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useAuthStore } from '@/lib/store/auth';

/**
 * 히어로 섹션 컴포넌트
 */
export const HeroSection: React.FC = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    expertise: '',
    industry: '',
  });

  /**
   * 제안서 작성 시작 핸들러
   */
  const handleStart = () => {
    // 유효성 검사
    if (!formData.expertise.trim()) {
      toast.error('전문분야를 입력해주세요', {
        description: '제안서를 작성하려면 전문분야 정보가 필요합니다.',
      });
      return;
    }

    if (!formData.industry.trim()) {
      toast.error('고객 업종을 입력해주세요', {
        description: '제안하실 고객의 업종 정보가 필요합니다.',
      });
      return;
    }

    // 세션 스토리지에 저장
    sessionStorage.setItem('quick-start-data', JSON.stringify(formData));
    
    console.log('[제안서 시작]', formData);

    // 로그인 상태 확인 (Zustand 사용)
    if (!user) {
      // 로그인 안 되어 있으면 알림만 표시
      toast.info('로그인이 필요합니다', {
        description: '상단의 Google로 로그인 버튼을 클릭해주세요.',
      });
      return;
    }
    
    // 로그인 되어 있으면 제안서 작성 페이지로
    toast.success('제안서 작성을 시작합니다!', {
      description: `${formData.expertise} 전문가를 위한 제안서를 준비하고 있습니다.`,
    });
    
    setTimeout(() => {
      router.push('/proposal/new');
    }, 500);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 py-20 md:py-32">
      {/* 배경 장식 */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto">
        <div className="mx-auto max-w-4xl text-center space-y-8">
          {/* 뱃지 */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-background/50 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">AI 기반 제안서 빌더</span>
          </div>

          {/* 메인 타이틀 */}
          <div className="space-y-10">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
              플랫폼 밖에서
              <br />
              <span className="text-primary">첫 고객을 만드는 시작</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              17개의 간단한 질문으로 전문적인 비즈니스 제안서를 자동 생성합니다.
              <br />
              플랫폼 수수료에서 벗어나 직접 영업을 시작하세요.
            </p>
          </div>

          {/* 빠른 시작 폼 - 카드 형식 */}
          <Card className="mx-auto max-w-2xl border-2 shadow-lg bg-background/50 backdrop-blur-sm">
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-left">빠른 시작</h3>
                <p className="text-sm text-muted-foreground text-left">
                  간단한 정보를 입력하고 제안서 작성을 시작하세요
                </p>
              </div>

              <div className="flex flex-col gap-4">
                {/* 전문분야 입력 */}
                <div className="space-y-2">
                  <Label htmlFor="expertise" className="text-left block">
                    전문분야
                  </Label>
                  <Input
                    id="expertise"
                    placeholder="예: 웹 개발, 디자인"
                    value={formData.expertise}
                    onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
                    className="h-12 text-base"
                  />
                </div>

                {/* 제안 고객 업종 입력 */}
                <div className="space-y-2">
                  <Label htmlFor="industry" className="text-left block">
                    고객 업종
                  </Label>
                  <Input
                    id="industry"
                    placeholder="예: 스타트업, 중소기업"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="h-12 text-base"
                  />
                </div>
              </div>

              {/* CTA 버튼 */}
              <Button
                size="lg"
                onClick={handleStart}
                className="w-full h-12 px-8 text-base"
              >
                제안서 작성 시작하기
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              {/* 안내 문구 */}
              <p className="text-sm text-muted-foreground text-center">
                💡 3초 가입하고 첫 제안서 무료로 시작하기
              </p>
            </CardContent>
          </Card>

          
        </div>
      </div>
    </section>
  );
};
