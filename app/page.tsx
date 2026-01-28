/**
 * 메인 랜딩 페이지
 * 서비스 소개 및 제안서 작성 시작 기능을 제공합니다.
 * 로그인 상태에 따라 다른 콘텐츠를 표시합니다.
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Header,
  HeroSection,
  FeaturesSection,
  HowItWorksSection,
  CTASection,
  Footer,
} from '@/components/landing';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Clock, Plus, Trash2 } from 'lucide-react';
import { getMyProposals, deleteProposal } from '@/lib/supabase/proposals';
import type { Proposal } from '@/lib/supabase/types';
import { toast } from 'sonner';
import { useAuthStore } from '@/lib/store/auth';

/**
 * 메인 페이지 컴포넌트
 */
const HomePage = () => {
  const router = useRouter();
  const { user, isLoading, initialize, reset } = useAuthStore();
  const [proposals, setProposals] = useState<Proposal[]>([]);

  /**
   * 인증 상태 초기화 및 데이터 로드
   */
  useEffect(() => {
    // Auth store 초기화
    initialize();
  }, [initialize]);

  /**
   * 사용자 로그인 시 제안서 로드
   */
  useEffect(() => {
    async function loadProposals() {
      if (user) {
        try {
          const { data, error } = await getMyProposals({ limit: 50 });
          
          if (error) {
            toast.error(error);
          } else if (data) {
            setProposals(data);
          }
        } catch (error) {
          console.error('[제안서 로드 실패]', error);
        }
      } else {
        // 로그아웃 시 제안서 목록 초기화
        setProposals([]);
      }
    }

    if (!isLoading) {
      loadProposals();
    }
  }, [user, isLoading]);

  /**
   * 로그아웃 핸들러
   */
  const handleLogout = async () => {
    try {
      await reset();
      setProposals([]);
      toast.success('로그아웃되었습니다');
      router.refresh();
    } catch (error) {
      console.error('[로그아웃 실패]', error);
      toast.error('로그아웃 중 오류가 발생했습니다');
    }
  };

  /**
   * 제안서 삭제 핸들러
   */
  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const confirmed = confirm('이 제안서를 삭제하시겠습니까?');
    if (!confirmed) return;

    const { success, error } = await deleteProposal(id);

    if (success) {
      toast.success('제안서가 삭제되었습니다');
      setProposals(prev => prev.filter(p => p.id !== id));
    } else {
      toast.error(error || '삭제에 실패했습니다');
    }
  };

  /**
   * 제안서 불러오기
   */
  const handleLoadProposal = (proposal: Proposal) => {
    const quickStartData = {
      expertise: proposal.expertise,
      industry: proposal.industry,
    };
    
    sessionStorage.setItem('quick-start-data', JSON.stringify(quickStartData));
    sessionStorage.setItem('draft-answers', JSON.stringify(proposal.answers));
    
    router.push('/proposal/new');
  };

  /**
   * 날짜 포맷 함수
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;
    
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  /**
   * 답변 수 계산
   */
  const getAnsweredCount = (answers: Record<string, string>) => {
    return Object.keys(answers).filter(key => answers[key]?.trim().length > 0).length;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="text-sm text-muted-foreground">불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* 헤더 */}
      <Header 
        user={user ? {
          email: user.email || '',
          name: user.user_metadata?.full_name
        } : null} 
        onLogout={handleLogout} 
      />

      {/* 메인 컨텐츠 */}
      <main className="flex-1">
        {/* 히어로 섹션 - 항상 표시 */}
        <HeroSection />

        {user ? (
          // 로그인한 사용자: 제안서 목록 표시
          <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="max-w-7xl mx-auto space-y-8">
                {/* 헤더 */}
                <div className="flex flex-col items-center justify-center text-center">
  <div className="space-y-2">
    <h2 className="text-3xl font-bold">내 제안서</h2>
    <p className="text-muted-foreground">
      작성한 제안서를 확인하고 관리하세요
    </p>
  </div>
</div>

                {/* 제안서 그리드 */}
                {proposals.length === 0 ? (
                  <Card className="border-2 border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-16 space-y-4">
                      <FileText className="w-12 h-12 text-muted-foreground" />
                      <div className="text-center space-y-2">
                        <p className="text-lg font-medium">제안서가 없습니다</p>
                        <p className="text-sm text-muted-foreground">
                          첫 번째 제안서를 작성해보세요
                        </p>
                      </div>

                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {proposals.map((proposal) => (
                      <Card 
                        key={proposal.id}
                        className="border-2 hover:border-primary/50 transition-all cursor-pointer hover:shadow-lg"
                        onClick={() => handleLoadProposal(proposal)}
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 space-y-1">
                              <CardTitle className="flex items-center gap-2 text-lg">
                                <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                                <span className="line-clamp-1">{proposal.title}</span>
                              </CardTitle>
                              <div className="flex items-center gap-2">
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  proposal.status === 'completed' 
                                    ? 'bg-green-100 text-green-700' 
                                    : 'bg-amber-100 text-amber-700'
                                }`}>
                                  {proposal.status === 'completed' ? '완료' : '임시저장'}
                                </span>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => handleDelete(proposal.id, e)}
                              className="flex-shrink-0 text-destructive hover:text-destructive h-8 w-8 p-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <CardDescription className="line-clamp-2">
                            {proposal.expertise} | {proposal.industry}
                          </CardDescription>
                          
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <FileText className="w-4 h-4" />
                              <span>{getAnsweredCount(proposal.answers)} / 17 질문 답변</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="w-4 h-4" />
                              <span>{formatDate(proposal.created_at)}</span>
                            </div>
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLoadProposal(proposal);
                            }}
                          >
                            {proposal.status === 'completed' ? '다시 보기' : '이어서 작성하기'}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        ) : (
          // 비로그인 사용자: 랜딩 페이지 섹션 표시
          <>
            <FeaturesSection />
            <HowItWorksSection />
            <CTASection />
          </>
        )}
      </main>

      {/* 푸터 */}
      <Footer />
    </div>
  );
};

export default HomePage;
