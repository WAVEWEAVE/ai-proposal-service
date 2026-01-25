/**
 * 위저드 네비게이션 버튼 컴포넌트
 * 이전/다음 버튼과 제출 버튼을 제공합니다.
 */

'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';

interface NavigationButtonsProps {
  onPrevious?: () => void;
  onNext?: () => void;
  onSubmit?: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
  isLastQuestion: boolean;
  isLoading?: boolean;
  nextLabel?: string;
}

/**
 * 네비게이션 버튼 컴포넌트
 * 
 * @param onPrevious - 이전 버튼 클릭 핸들러
 * @param onNext - 다음 버튼 클릭 핸들러
 * @param onSubmit - 제출 버튼 클릭 핸들러 (마지막 질문)
 * @param canGoPrevious - 이전 버튼 활성화 여부
 * @param canGoNext - 다음 버튼 활성화 여부
 * @param isLastQuestion - 마지막 질문 여부
 * @param isLoading - 로딩 상태
 * @param nextLabel - 다음 버튼 커스텀 레이블
 */
export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  onPrevious,
  onNext,
  onSubmit,
  canGoPrevious,
  canGoNext,
  isLastQuestion,
  isLoading = false,
  nextLabel = '다음',
}) => {
  return (
    <div className="flex items-center justify-between gap-4">
      {/* 이전 버튼 */}
      <Button
        variant="outline"
        size="lg"
        onClick={onPrevious}
        disabled={!canGoPrevious || isLoading}
        className="min-w-[120px]"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        이전
      </Button>

      {/* 다음/제출 버튼 */}
      {isLastQuestion ? (
        <Button
          size="lg"
          onClick={onSubmit}
          disabled={!canGoNext || isLoading}
          className="min-w-[160px]"
        >
          {isLoading ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              제안서 생성 중...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              제안서 생성하기
            </>
          )}
        </Button>
      ) : (
        <Button
          size="lg"
          onClick={onNext}
          disabled={!canGoNext || isLoading}
          className="min-w-[120px]"
        >
          {nextLabel}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      )}
    </div>
  );
};
