/**
 * 제안서 작성 페이지
 * 17개 질문을 단계별로 표시하고 답변을 수집합니다.
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ProposalWizard } from '@/components/proposal';
import { EXAMPLE_ANSWERS } from '@/components/proposal/exampleAnswers';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Lightbulb } from 'lucide-react';
import Link from 'next/link';
import { createProposal } from '@/lib/supabase/proposals';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

/**
 * 제안서 작성 페이지 컴포넌트
 */
const NewProposalPage = () => {
  const router = useRouter();
  const [quickStartData, setQuickStartData] = useState<{
    expertise: string;
    industry: string;
  } | null>(null);
  const [initialAnswers, setInitialAnswers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [showExampleDialog, setShowExampleDialog] = useState(false);

  /**
   * 빠른 시작 데이터 및 임시저장 답변 로드
   */
  useEffect(() => {
    // quickStart 데이터 로드
    const savedData = sessionStorage.getItem('quick-start-data');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        setQuickStartData(data);
      } catch (error) {
        console.error('[빠른 시작 데이터 파싱 실패]', error);
      }
    }

    // 임시저장 답변 데이터 로드
    const savedAnswers = sessionStorage.getItem('draft-answers');
    if (savedAnswers) {
      try {
        const answers = JSON.parse(savedAnswers);
        setInitialAnswers(answers);
        // 한 번 읽었으면 삭제
        sessionStorage.removeItem('draft-answers');
        console.log('[임시저장 답변 복원 완료]', Object.keys(answers).length, '개 답변');
        
        toast.success('임시저장된 답변을 불러왔습니다!', {
          description: `${Object.keys(answers).length}개의 답변이 복원되었습니다.`,
        });
      } catch (error) {
        console.error('[답변 데이터 로드 실패]', error);
      }
    }

    setIsLoading(false);
  }, []);

  /**
   * 제안서 작성 완료 핸들러
   */
  const handleComplete = (answers: Record<string, string>) => {
    console.log('[제안서 작성 완료]', answers);
    
    // sessionStorage에 답변 저장
    sessionStorage.setItem('proposal-answers', JSON.stringify(answers));
    
    toast.success('제안서 생성을 시작합니다!', {
      description: 'AI가 전문적인 제안서를 작성합니다.',
    });

    // 결과 페이지로 이동
    router.push('/proposal/result');
  };

  /**
   * 임시저장 핸들러
   */
  const handleSaveDraft = async (answers: Record<string, string>) => {
    // 답변 수 계산
    const answeredCount = Object.keys(answers).filter(
      (key) => answers[key]?.trim().length > 0
    ).length;

    // 제목 생성 (전문분야 또는 기본값)
    const title = quickStartData?.expertise 
      ? `${quickStartData.expertise} 제안서`
      : '제안서';

    // Supabase에 임시저장
    const { data, error } = await createProposal({
      title,
      expertise: quickStartData?.expertise || '미지정',
      industry: quickStartData?.industry || '미지정',
      answers,
      status: 'draft',
    });

    if (error) {
      toast.error(error, {
        description: '임시저장에 실패했습니다.',
      });
      console.error('[임시저장 실패]', error);
      
      // 인증 오류 시 로그인 페이지로
      if (error.includes('로그인')) {
        setTimeout(() => router.push('/login'), 2000);
      }
      return;
    }

    toast.success('임시저장 완료!', {
      description: `${answeredCount}개의 답변이 저장되었습니다.`,
    });

    console.log('[임시저장 완료]', data?.id, `${answeredCount}개 답변`);
  };

  /**
   * 예시 답변 불러오기 핸들러
   */
  const handleLoadExample = (currentAnswers: Record<string, string>) => {
    // 이미 작성된 답변이 있는지 확인
    const hasAnswers = Object.keys(currentAnswers).some(
      (key) => currentAnswers[key]?.trim().length > 0
    );

    if (hasAnswers) {
      // 답변이 있으면 확인 다이얼로그 표시
      setShowExampleDialog(true);
    } else {
      // 답변이 없으면 바로 예시 적용
      applyExampleAnswers();
    }
  };

  /**
   * 예시 답변 적용
   */
  const applyExampleAnswers = () => {
    setInitialAnswers(EXAMPLE_ANSWERS);
    setShowExampleDialog(false);

    toast.success('예시 답변이 입력되었습니다!', {
      description: '17개의 답변이 자동으로 채워졌습니다.',
    });

    console.log('[예시 답변 적용]', EXAMPLE_ANSWERS);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* 상단 네비게이션 */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                홈으로 돌아가기
              </Link>
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleLoadExample(initialAnswers)}
                className="gap-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
              >
                <Lightbulb className="w-4 h-4" />
                <span className="hidden sm:inline">예시 답변 넣기</span>
                <span className="sm:hidden">예시</span>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/proposal/drafts" className="gap-2">
                  <Save className="w-4 h-4" />
                  <span className="hidden sm:inline">임시저장 목록</span>
                  <span className="sm:hidden">목록</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 인사말 (빠른 시작 데이터가 있는 경우) */}
      {quickStartData && (
        <div className="container mx-auto px-4 pt-8">
          <div className="max-w-3xl mx-auto">
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
              <p className="text-sm text-foreground">
                <strong>{quickStartData.expertise}</strong> 전문가를 위한 제안서를 작성합니다.
                <br />
                타겟 고객: <strong>{quickStartData.industry}</strong>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 제안서 위저드 */}
      {!isLoading && (
        <ProposalWizard 
          onComplete={handleComplete}
          onSaveDraft={handleSaveDraft}
          onLoadExample={handleLoadExample}
          initialAnswers={initialAnswers}
        />
      )}

      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
            <p className="text-sm text-muted-foreground">불러오는 중...</p>
          </div>
        </div>
      )}

      {/* 예시 답변 확인 다이얼로그 */}
      <AlertDialog open={showExampleDialog} onOpenChange={setShowExampleDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>예시 답변을 불러올까요?</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <div>현재 작성 중인 답변이 모두 삭제되고 예시 답변으로 대체됩니다.</div>
              <div className="font-medium text-amber-600">
                💡 예시 답변은 웹 개발 프리랜서가 식품 스타트업에 제안하는 시나리오입니다.
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={applyExampleAnswers}>
              예시 답변 불러오기
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default NewProposalPage;
