/**
 * 질문 답변 입력 필드 컴포넌트
 * 모든 질문에 동일한 높이의 textarea를 표시합니다.
 */

'use client';

import { Textarea } from '@/components/ui/textarea';

interface QuestionInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}

/**
 * 질문 입력 필드 컴포넌트
 * 
 * @param value - 현재 값
 * @param onChange - 값 변경 핸들러
 * @param placeholder - 플레이스홀더 텍스트
 * @param error - 에러 메시지
 */
export const QuestionInput: React.FC<QuestionInputProps> = ({
  value,
  onChange,
  placeholder,
  error,
}) => {
  // 입력값 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="h-full flex flex-col space-y-2">
      <Textarea
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={`
          resize-none text-base flex-1 h-full overflow-y-auto
          ${error ? 'border-destructive focus-visible:ring-destructive' : ''}
        `}
      />

      {/* 에러 메시지 */}
      {error && (
        <p className="text-sm text-destructive font-medium flex-shrink-0">{error}</p>
      )}
    </div>
  );
};
