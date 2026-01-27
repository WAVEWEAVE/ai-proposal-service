/**
 * 임시저장 목록 페이지
 * 저장된 제안서 초안 목록을 표시합니다.
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, FileText, Trash2, Clock, Search, Filter } from 'lucide-react';
import { getMyProposals, deleteProposal } from '@/lib/supabase/proposals';
import type { Proposal, ProposalStatus } from '@/lib/supabase/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

/**
 * 임시저장 목록 페이지 컴포넌트
 */
const DraftsPage = () => {
  const router = useRouter();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ProposalStatus>('all');

  /**
   * 제안서 목록 불러오기
   */
  const loadProposals = async () => {
    setIsLoading(true);
    
    const { data, error } = await getMyProposals({
      status: statusFilter,
      searchKeyword: searchKeyword || undefined,
    });

    if (error) {
      toast.error(error);
      console.error('[제안서 조회 실패]', error);
      
      // 인증 오류 시 메인 페이지로
      if (error.includes('로그인')) {
        setTimeout(() => router.push('/'), 2000);
      }
    } else {
      setProposals(data || []);
      console.log('[제안서 조회 성공]', data?.length || 0, '개');
    }
    
    setIsLoading(false);
  };

  /**
   * 초기 로드
   */
  useEffect(() => {
    loadProposals();
  }, []);

  /**
   * 검색/필터 변경 시 (디바운스)
   */
  useEffect(() => {
    const debounce = setTimeout(() => {
      loadProposals();
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchKeyword, statusFilter]);

  /**
   * 제안서 삭제 핸들러
   */
  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const confirmed = confirm('이 제안서를 삭제하시겠습니까?');
    if (!confirmed) return;

    const { success, error } = await deleteProposal(id);

    if (success) {
      toast.success('제안서가 삭제되었습니다.');
      loadProposals(); // 목록 새로고침
    } else {
      toast.error(error || '삭제에 실패했습니다.');
      console.error('[삭제 실패]', error);
      
      // 인증 오류 시 메인 페이지로
      if (error?.includes('로그인')) {
        setTimeout(() => router.push('/'), 2000);
      }
    }
  };

  /**
   * 제안서 불러오기 (수정 페이지로 이동)
   */
  const handleLoadProposal = (proposal: Proposal) => {
    // sessionStorage에 데이터 저장
    const quickStartData = {
      expertise: proposal.expertise,
      industry: proposal.industry,
    };
    
    sessionStorage.setItem('quick-start-data', JSON.stringify(quickStartData));
    sessionStorage.setItem('draft-answers', JSON.stringify(proposal.answers));
    
    toast.success('제안서를 불러왔습니다.', {
      description: '제안서 작성을 이어서 진행하세요.',
    });

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* 상단 네비게이션 */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/proposal/new" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              제안서 작성으로 돌아가기
            </Link>
          </Button>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* 헤더 */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">제안서 목록</h1>
            <p className="text-muted-foreground">
              작성 중이던 제안서를 이어서 진행하거나 완료된 제안서를 확인하세요
            </p>
          </div>

          {/* 검색 & 필터 */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* 검색 */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="제목으로 검색..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* 필터 */}
            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="상태 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="draft">임시저장</SelectItem>
                <SelectItem value="completed">완료</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 제안서 목록 */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
                <p className="text-sm text-muted-foreground">불러오는 중...</p>
              </div>
            </div>
          ) : proposals.length === 0 ? (
            <Card className="border-2 border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16 space-y-4">
                <FileText className="w-12 h-12 text-muted-foreground" />
                <div className="text-center space-y-2">
                  <p className="text-lg font-medium">
                    {searchKeyword || statusFilter !== 'all' 
                      ? '검색 결과가 없습니다' 
                      : '제안서가 없습니다'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {searchKeyword || statusFilter !== 'all'
                      ? '다른 검색어나 필터를 시도해보세요'
                      : '제안서 작성 중 임시저장 버튼을 눌러 저장하세요'}
                  </p>
                </div>
                <Button asChild>
                  <Link href="/proposal/new">새 제안서 작성하기</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {proposals.map((proposal) => (
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
    </div>
  );
};

export default DraftsPage;
