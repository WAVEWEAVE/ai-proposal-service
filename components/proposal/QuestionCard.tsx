/**
 * 개별 질문을 표시하는 카드 컴포넌트
 * 질문 제목, 설명, 입력 필드를 포함합니다.
 */

'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Question } from './types';
import { QuestionInput } from './QuestionInput';

interface QuestionCardProps {
  question: Question;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

/**
 * 질문 카드 컴포넌트
 * 
 * @param question - 질문 데이터
 * @param value - 현재 입력된 답변
 * @param onChange - 답변 변경 핸들러
 * @param error - 유효성 검사 에러 메시지
 */
export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  value,
  onChange,
  error,
}) => {
  return (
    <Card className="border-2 shadow-sm h-[500px] flex flex-col">
      {/* 헤더: 고정 높이 영역 */}
      <CardHeader className="space-y-3 flex-shrink-0">
        {/* 단계 표시 */}
        <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <span className="px-2 py-1 rounded bg-muted font-medium">
            {question.step}단계
          </span>
          <span>·</span>
          <span>질문 {question.order}</span>
        </div>

        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-2xl font-bold leading-tight">
            {question.title}
          </CardTitle>
          {question.required && (
            <span className="flex-shrink-0 px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded">
              필수
            </span>
          )}
        </div>
        {question.description && (
          <CardDescription className="text-base line-clamp-2">
            {question.description}
          </CardDescription>
        )}
      </CardHeader>
      
      {/* 컨텐츠: 스크롤 가능한 답변 영역 */}
      <CardContent className="flex-1 overflow-hidden">
        <QuestionInput
          value={value}
          onChange={onChange}
          placeholder={question.placeholder}
          error={error}
        />
      </CardContent>
    </Card>
  );
};
