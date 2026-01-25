/**
 * 질문 답변 진행 상태를 표시하는 프로그레스 바 컴포넌트
 * 답변한 질문 수에 따라 진행률을 표시합니다.
 */

'use client';

import { Progress } from '@/components/ui/progress';

interface StepProgressProps {
  answeredCount: number;
  totalQuestions: number;
}

/**
 * 질문 진행 프로그레스 바 컴포넌트
 * 
 * @param answeredCount - 답변한 질문 수
 * @param totalQuestions - 전체 질문 수
 */
export const StepProgress: React.FC<StepProgressProps> = ({
  answeredCount,
  totalQuestions,
}) => {
  // 진행률 계산 (0-100%)
  const progressPercentage = (answeredCount / totalQuestions) * 100;

  return (
    <div className="w-full space-y-2">
      {/* 프로그레스 바 */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>진행 상황</span>
          <span className="font-medium text-foreground">
            {answeredCount} / {totalQuestions} 질문 완료
          </span>
        </div>
        <Progress value={progressPercentage} className="h-3" />
      </div>
    </div>
  );
};
