/**
 * 제안서 작성 위저드 메인 컴포넌트
 * 17개 질문을 단계별로 표시하고 답변을 수집합니다.
 */

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { StepProgress } from './StepProgress';
import { QuestionCard } from './QuestionCard';
import { NavigationButtons } from './NavigationButtons';
import { PROPOSAL_QUESTIONS } from './questions';
import { WizardState } from './types';

interface ProposalWizardProps {
  onComplete: (answers: Record<string, string>) => void;
  onSaveDraft?: (answers: Record<string, string>) => void;
  onLoadExample?: (answers: Record<string, string>) => void;
  initialAnswers?: Record<string, string>;
}

/**
 * 제안서 위저드 컴포넌트
 * 
 * @param onComplete - 모든 질문 완료 시 호출되는 콜백
 * @param onSaveDraft - 임시저장 시 호출되는 콜백
 * @param onLoadExample - 예시 답변 불러오기 콜백
 * @param initialAnswers - 초기 답변 데이터 (수정 모드)
 */
export const ProposalWizard: React.FC<ProposalWizardProps> = ({
  onComplete,
  onSaveDraft,
  onLoadExample,
  initialAnswers = {},
}) => {
  // 위저드 상태 관리
  const [state, setState] = useState<WizardState>({
    currentStep: 1,
    currentQuestionIndex: 0,
    answers: initialAnswers,
    isGenerating: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // initialAnswers가 변경될 때 state 업데이트 (임시저장 불러오기)
  useEffect(() => {
    if (Object.keys(initialAnswers).length > 0) {
      setState((prev) => ({
        ...prev,
        answers: initialAnswers,
      }));
      console.log('[임시저장 답변 복원]', initialAnswers);
    }
  }, [initialAnswers]);

  // 현재 질문
  const currentQuestion = PROPOSAL_QUESTIONS[state.currentQuestionIndex];
  const currentAnswer = state.answers[currentQuestion.id] || '';

  // 유효성 검사
  const validateCurrentQuestion = (): boolean => {
    if (currentQuestion.required && !currentAnswer.trim()) {
      setErrors({
        [currentQuestion.id]: '이 질문은 필수 항목입니다.',
      });
      return false;
    }
    setErrors({});
    return true;
  };

  // 답변 변경 핸들러
  const handleAnswerChange = (value: string) => {
    setState((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [currentQuestion.id]: value,
      },
    }));
    // 에러 초기화
    if (errors[currentQuestion.id]) {
      setErrors({});
    }
  };

  // 다음 질문으로 이동
  const handleNext = () => {
    if (!validateCurrentQuestion()) return;

    const nextIndex = state.currentQuestionIndex + 1;
    const nextQuestion = PROPOSAL_QUESTIONS[nextIndex];

    setState((prev) => ({
      ...prev,
      currentQuestionIndex: nextIndex,
      currentStep: nextQuestion.step,
    }));
  };

  // 이전 질문으로 이동
  const handlePrevious = () => {
    const prevIndex = state.currentQuestionIndex - 1;
    const prevQuestion = PROPOSAL_QUESTIONS[prevIndex];

    setState((prev) => ({
      ...prev,
      currentQuestionIndex: prevIndex,
      currentStep: prevQuestion.step,
    }));
  };

  // 제출 처리
  const handleSubmit = () => {
    if (!validateCurrentQuestion()) return;

    setState((prev) => ({ ...prev, isGenerating: true }));
    onComplete(state.answers);
  };

  // 네비게이션 상태
  const canGoPrevious = state.currentQuestionIndex > 0;
  const canGoNext = currentAnswer.trim().length > 0;
  const isLastQuestion =
    state.currentQuestionIndex === PROPOSAL_QUESTIONS.length - 1;

  // 답변한 질문 수 계산
  const answeredCount = Object.keys(state.answers).filter(
    (key) => state.answers[key]?.trim().length > 0
  ).length;

  // 임시저장 핸들러
  const handleSaveDraft = () => {
    if (onSaveDraft) {
      onSaveDraft(state.answers);
    }
  };

  // 예시 답변 불러오기 핸들러
  const handleLoadExample = () => {
    if (onLoadExample) {
      onLoadExample(state.answers);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-8 px-4">
      {/* 질문 답변 진행 표시 */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <StepProgress
            answeredCount={answeredCount}
            totalQuestions={PROPOSAL_QUESTIONS.length}
          />
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {onLoadExample && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleLoadExample}
              className="hidden sm:flex"
            >
              예시 넣기
            </Button>
          )}
          {onSaveDraft && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveDraft}
              disabled={answeredCount === 0}
            >
              <span className="hidden sm:inline">임시저장</span>
              <span className="sm:hidden">저장</span>
            </Button>
          )}
        </div>
      </div>

      {/* 현재 질문 카드 - 고정 높이 */}
      <div className="h-[500px]">
        <QuestionCard
          question={currentQuestion}
          value={currentAnswer}
          onChange={handleAnswerChange}
          error={errors[currentQuestion.id]}
        />
      </div>

      {/* 네비게이션 버튼 */}
      <NavigationButtons
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSubmit={handleSubmit}
        canGoPrevious={canGoPrevious}
        canGoNext={canGoNext}
        isLastQuestion={isLastQuestion}
        isLoading={state.isGenerating}
      />

      {/* 진행 안내 메시지 */}
      <div className="text-center text-sm text-muted-foreground">
        질문 {state.currentQuestionIndex + 1} / {PROPOSAL_QUESTIONS.length}
      </div>
    </div>
  );
};
