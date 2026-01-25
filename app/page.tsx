/**
 * 메인 랜딩 페이지
 * 서비스 소개 및 제안서 작성 시작 기능을 제공합니다.
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Header,
  HeroSection,
  FeaturesSection,
  HowItWorksSection,
  CTASection,
  Footer,
} from '@/components/landing';
import { getCurrentUser, signOut } from '@/lib/supabase/auth';
import { toast } from 'sonner';

/**
 * 사용자 타입
 */
interface User {
  email: string;
  name?: string;
}

/**
 * 메인 페이지 컴포넌트
 */
const HomePage = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * 사용자 세션 확인 및 리다이렉트
   */
  useEffect(() => {
    async function loadUser() {
      try {
        const currentUser = await getCurrentUser();
        
        if (currentUser) {
          // 로그인한 사용자는 대시보드로 리다이렉트
          console.log('[로그인 감지] 대시보드로 이동');
          router.push('/dashboard');
          return;
        }
      } catch (error) {
        console.error('[사용자 로드 실패]', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, [router]);

  /**
   * 로그아웃 핸들러
   */
  const handleLogout = async () => {
    try {
      const result = await signOut();
      
      if (result.success) {
        setUser(null);
        toast.success('로그아웃되었습니다');
        router.push('/login');
        router.refresh();
      } else {
        toast.error(result.error || '로그아웃에 실패했습니다');
      }
    } catch (error) {
      console.error('[로그아웃 실패]', error);
      toast.error('로그아웃 중 오류가 발생했습니다');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* 헤더 */}
      <Header user={user} onLogout={handleLogout} />

      {/* 메인 컨텐츠 */}
      <main className="flex-1">
        {/* 히어로 섹션 */}
        <HeroSection />

        {/* 주요 기능 섹션 */}
        <FeaturesSection />

        {/* 사용 방법 섹션 */}
        <HowItWorksSection />

        {/* CTA 섹션 */}
        <CTASection />
      </main>

      {/* 푸터 */}
      <Footer />
    </div>
  );
};

export default HomePage;
