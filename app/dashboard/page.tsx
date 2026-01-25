/**
 * 대시보드 페이지
 * 로그인한 사용자의 제안서 관리 및 통계를 표시합니다.
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  FileText, 
  Plus, 
  Clock, 
  CheckCircle2, 
  TrendingUp,
  ArrowRight,
  Trash2
} from 'lucide-react';
import { getCurrentUser, signOut } from '@/lib/supabase/auth';
import { getMyProposals, deleteProposal } from '@/lib/supabase/proposals';
import type { Proposal } from '@/lib/supabase/types';
import { Header } from '@/components/landing';

/**
 * 사용자 타입
 */
interface User {
  email: string;
  name?: string;
}

/**
 * 대시보드 페이지 컴포넌트
 */
const DashboardPage = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    draft: 0,
    completed: 0,
  });

  /**
   * 사용자 세션 확인 및 데이터 로드
   */
  useEffect(() => {
    async function loadData() {
      try {
        // 사용자 확인
        const currentUser = await getCurrentUser();
        
        if (!currentUser) {
          toast.error('로그인이 필요합니다');
          router.push('/login');
          return;
        }

        setUser({
          email: currentUser.email || '',
          name: currentUser.user_metadata?.full_name || undefined,
        });

        // 제안서 목록 조회
        const { data, error } = await getMyProposals({ limit: 10 });

        if (error) {
          toast.error(error);
          if (error.includes('로그인')) {
            router.push('/login');
          }
        } else if (data) {
          setProposals(data);
          
          // 통계 계산
          setStats({
            total: data.length,
            draft: data.filter(p => p.status === 'draft').length,
            completed: data.filter(p => p.status === 'completed').length,
          });
        }
      } catch (error) {
        console.error('[데이터 로드 실패]', error);
        toast.error('데이터를 불러오는데 실패했습니다');
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [router]);

  /**
   * 로그아웃 핸들러
   */
  const handleLogout = async () => {
    try {
      const result = await signOut();
      
      if (result.success) {
        toast.success('로그아웃되었습니다');
        router.push('/');
      } else {
        toast.error(result.error || '로그아웃에 실패했습니다');
      }
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
      // 목록에서 제거
      setProposals(prev => prev.filter(p => p.id !== id));
      // 통계 업데이트
      const deletedProposal = proposals.find(p => p.id === id);
      if (deletedProposal) {
        setStats(prev => ({
          total: prev.total - 1,
          draft: prev.draft - (deletedProposal.status === 'draft' ? 1 : 0),
          completed: prev.completed - (deletedProposal.status === 'completed' ? 1 : 0),
        }));
      }
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
      {/* 헤더 */}
      <Header user={user} onLogout={handleLogout} />

      {/* 메인 컨텐츠 */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* 환영 메시지 */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">
              안녕하세요, {user?.name || '사용자'}님! 👋
            </h1>
            <p className="text-muted-foreground">
              제안서를 작성하고 관리하세요
            </p>
          </div>

          {/* 통계 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">전체 제안서</CardTitle>
                <FileText className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">
                  작성한 제안서 총 개수
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">임시저장</CardTitle>
                <Clock className="w-4 h-4 text-amber-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.draft}</div>
                <p className="text-xs text-muted-foreground">
                  작성 중인 제안서
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">완료</CardTitle>
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.completed}</div>
                <p className="text-xs text-muted-foreground">
                  완성된 제안서
                </p>
              </CardContent>
            </Card>
          </div>

          {/* 빠른 작업 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button size="lg" asChild className="h-auto py-6">
              <Link href="/proposal/new" className="flex flex-col items-center gap-2">
                <Plus className="w-6 h-6" />
                <div className="text-center">
                  <div className="font-semibold">새 제안서 작성</div>
                  <div className="text-xs opacity-80">17개 질문으로 시작하기</div>
                </div>
              </Link>
            </Button>

            <Button size="lg" variant="outline" asChild className="h-auto py-6">
              <Link href="/proposal/drafts" className="flex flex-col items-center gap-2">
                <FileText className="w-6 h-6" />
                <div className="text-center">
                  <div className="font-semibold">전체 제안서 보기</div>
                  <div className="text-xs opacity-80">모든 제안서 검색 및 관리</div>
                </div>
              </Link>
            </Button>
          </div>

          {/* 최근 제안서 목록 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">최근 제안서</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/proposal/drafts" className="gap-2">
                  전체 보기
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>

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
                  <Button asChild>
                    <Link href="/proposal/new">새 제안서 작성하기</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {proposals.slice(0, 5).map((proposal) => (
                  <Card 
                    key={proposal.id}
                    className="border-2 hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={() => handleLoadProposal(proposal)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <CardTitle className="flex items-center gap-2">
                              <FileText className="w-5 h-5 text-primary" />
                              {proposal.title}
                            </CardTitle>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              proposal.status === 'completed' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-amber-100 text-amber-700'
                            }`}>
                              {proposal.status === 'completed' ? '완료' : '임시저장'}
                            </span>
                          </div>
                          <CardDescription>
                            {proposal.expertise} | {proposal.industry}
                          </CardDescription>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleDelete(proposal.id, e)}
                          className="flex-shrink-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4 text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            {getAnsweredCount(proposal.answers)} / 17 질문 답변
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formatDate(proposal.created_at)}
                          </span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLoadProposal(proposal);
                          }}
                        >
                          {proposal.status === 'completed' ? '다시 보기' : '이어서 작성하기'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
