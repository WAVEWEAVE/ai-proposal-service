/**
 * 제안서 빌더 관련 타입 정의
 */

/**
 * 제안서 단계 정의
 */
export type ProposalStep = 1 | 2 | 3 | 4 | 5 | 6 | 7;

/**
 * 질문 타입 (텍스트 입력 또는 긴 텍스트)
 */
export type QuestionType = 'text' | 'textarea' | 'file';

/**
 * 개별 질문 데이터 구조
 */
export interface Question {
  id: string;
  step: ProposalStep;
  order: number;
  title: string;
  placeholder?: string;
  description?: string;
  type: QuestionType;
  required: boolean;
}

/**
 * 사용자 답변 데이터
 */
export interface Answer {
  questionId: string;
  value: string;
  fileUrl?: string;
}

/**
 * 제안서 생성 데이터
 */
export interface ProposalData {
  id?: string;
  userId?: string;
  answers: Record<string, string>;
  generatedContent?: string;
  status: 'draft' | 'generating' | 'completed';
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * 단계별 제안서 진행 상태
 */
export interface WizardState {
  currentStep: ProposalStep;
  currentQuestionIndex: number;
  answers: Record<string, string>;
  isGenerating: boolean;
}
