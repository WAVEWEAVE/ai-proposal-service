# 📝 Proposal 컴포넌트

제안서 작성 위저드를 위한 컴포넌트 모음입니다.

## 📁 구조

```
components/proposal/
├── types.ts                   # 타입 정의
├── questions.ts              # 17개 질문 데이터
├── ProposalWizard.tsx        # 메인 위저드 컨테이너
├── StepProgress.tsx          # 7단계 진행 표시
├── QuestionCard.tsx          # 질문 카드
├── QuestionInput.tsx         # 답변 입력 필드
├── NavigationButtons.tsx     # 이전/다음 버튼
├── ProposalPreview.tsx       # 제안서 미리보기
├── AIStreamingResult.tsx     # AI 스트리밍 결과
├── ProposalActions.tsx       # 다운로드/수정 액션
└── index.ts                  # Export 모듈
```

## 🚀 사용법

### 1. 기본 위저드 사용

```tsx
import { ProposalWizard } from '@/components/proposal';

export default function ProposalPage() {
  const handleComplete = (answers: Record<string, string>) => {
    console.log('모든 답변:', answers);
    // AI 제안서 생성 로직
  };

  return <ProposalWizard onComplete={handleComplete} />;
}
```

### 2. 수정 모드 (기존 답변 불러오기)

```tsx
const initialAnswers = {
  q1: '기존 답변 1',
  q2: '기존 답변 2',
  // ...
};

<ProposalWizard 
  onComplete={handleComplete}
  initialAnswers={initialAnswers}
/>
```

### 3. 개별 컴포넌트 사용

#### StepProgress - 진행 표시

```tsx
import { StepProgress } from '@/components/proposal';

<StepProgress currentStep={3} totalSteps={7} />
```

#### QuestionCard - 질문 표시

```tsx
import { QuestionCard } from '@/components/proposal';

<QuestionCard
  question={question}
  value={answer}
  onChange={(value) => setAnswer(value)}
  error={error}
/>
```

#### AIStreamingResult - 스트리밍 결과

```tsx
import { AIStreamingResult } from '@/components/proposal';

<AIStreamingResult
  content={streamingContent}
  isStreaming={true}
/>
```

#### ProposalActions - 액션 버튼

```tsx
import { ProposalActions } from '@/components/proposal';

<ProposalActions
  onDownloadMarkdown={handleDownloadMd}
  onDownloadPDF={handleDownloadPdf}
  onEdit={handleEdit}
  onCopy={handleCopy}
/>
```

## 📋 질문 데이터 구조

```typescript
// 7단계, 총 17개 질문
const PROPOSAL_QUESTIONS = [
  {
    id: 'q1',
    step: 1,  // 1-7
    order: 1,
    title: '제안서를 받으실 잠재 고객사는 누구인가요?',
    placeholder: '예: 스타트업 A사 마케팅팀',
    type: 'text',  // 'text' | 'textarea' | 'file'
    required: true,
  },
  // ... 17개 질문
];
```

## 🎨 스타일링

- Tailwind CSS 기반
- Shadcn/ui 컴포넌트 활용
- 다크모드 지원
- 반응형 디자인

## 🔄 상태 흐름

```
1. 사용자가 ProposalWizard 시작
   ↓
2. 질문 1 → 답변 → 다음 버튼
   ↓
3. 17개 질문 완료
   ↓
4. onComplete 콜백 실행
   ↓
5. AI 제안서 생성 (부모 컴포넌트)
   ↓
6. AIStreamingResult로 스트리밍 표시
   ↓
7. ProposalPreview로 최종 결과 표시
   ↓
8. ProposalActions로 다운로드/수정
```

## 🎯 주요 기능

### ProposalWizard
- ✅ 17개 질문 단계별 표시
- ✅ 답변 유효성 검사
- ✅ 진행 상황 시각화
- ✅ 이전/다음 네비게이션
- ✅ 답변 자동 저장 (상태 관리)

### StepProgress
- ✅ 7단계 프로그레스 바
- ✅ 완료/진행/대기 상태 표시
- ✅ 애니메이션 효과

### NavigationButtons
- ✅ 이전/다음 버튼
- ✅ 마지막 질문에서 제출 버튼
- ✅ 로딩 상태 처리

### AIStreamingResult
- ✅ 실시간 스트리밍 표시
- ✅ 타이핑 커서 애니메이션
- ✅ 스켈레톤 로더

### ProposalActions
- ✅ 마크다운 다운로드
- ✅ PDF 다운로드
- ✅ 내용 복사
- ✅ 답변 수정

## 💡 팁

### 답변 임시 저장

```tsx
// 브라우저 로컬 스토리지 활용
useEffect(() => {
  localStorage.setItem('proposal-draft', JSON.stringify(answers));
}, [answers]);

// 페이지 재진입 시 불러오기
const savedDraft = localStorage.getItem('proposal-draft');
const initialAnswers = savedDraft ? JSON.parse(savedDraft) : {};
```

### 진행률 추적

```tsx
import { TOTAL_QUESTIONS } from '@/components/proposal';

const progress = (Object.keys(answers).length / TOTAL_QUESTIONS) * 100;
```

### 커스텀 질문 추가

```typescript
// questions.ts에 질문 추가
{
  id: 'q18',
  step: 7,
  order: 18,
  title: '추가 질문',
  type: 'textarea',
  required: false,
}
```

## 🔗 관련 페이지

- `/app/proposal/new` - 새 제안서 작성
- `/app/proposal/[id]` - 제안서 보기/수정
- `/app/proposal/result` - AI 생성 결과

## 📚 의존성

- `@/components/ui/*` - Shadcn/ui 컴포넌트
- `lucide-react` - 아이콘
- `next` - Next.js 프레임워크
- `react` - React 라이브러리
