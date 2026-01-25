# 📝 제안서 작성 페이지

제안서 작성 및 관리 페이지 모음입니다.

## 📁 구조

```
app/proposal/
└── new/
    └── page.tsx          # 제안서 작성 페이지 (17개 질문)
```

## 🎯 주요 기능

### `/proposal/new` - 제안서 작성 페이지

#### 기능
- ✅ 17개 질문 단계별 표시 (한 번에 하나씩)
- ✅ 7단계 프로그레스 바
- ✅ 이전/다음 네비게이션
- ✅ 필수 질문 유효성 검사
- ✅ 답변 임시 저장 (상태 관리)
- ✅ 빠른 시작 데이터 표시
- ✅ 홈으로 돌아가기 버튼

#### 사용된 컴포넌트
- `ProposalWizard` - 메인 위저드 컴포넌트
- `StepProgress` - 7단계 진행 표시
- `QuestionCard` - 질문 카드
- `NavigationButtons` - 이전/다음 버튼

#### 데이터 흐름
```
1. 메인 페이지에서 전문분야/고객업종 입력
   ↓
2. 유효성 검사 (toast 알림)
   ↓
3. sessionStorage에 저장
   ↓
4. /proposal/new로 이동
   ↓
5. 빠른 시작 데이터 로드 및 표시
   ↓
6. 17개 질문 답변
   ↓
7. 완료 후 onComplete 콜백 실행
   ↓
8. AI 제안서 생성 (TODO)
```

## 🔧 유효성 검사

### 메인 페이지 (HeroSection)
```typescript
// 전문분야 필수 확인
if (!formData.expertise.trim()) {
  toast.error('전문분야를 입력해주세요');
  return;
}

// 고객 업종 필수 확인
if (!formData.industry.trim()) {
  toast.error('고객 업종을 입력해주세요');
  return;
}
```

### 질문 페이지 (ProposalWizard)
```typescript
// 필수 질문 유효성 검사
if (currentQuestion.required && !currentAnswer.trim()) {
  setErrors({ [currentQuestion.id]: '이 질문은 필수 항목입니다.' });
  return false;
}
```

## 📱 Toast 알림

### 에러 토스트
```typescript
toast.error('전문분야를 입력해주세요', {
  description: '제안서를 작성하려면 전문분야 정보가 필요합니다.',
});
```

### 성공 토스트
```typescript
toast.success('제안서 작성을 시작합니다!', {
  description: `${formData.expertise} 전문가를 위한 제안서를 준비하고 있습니다.`,
});
```

### 토스트 설정
- **위치**: layout.tsx에 `<Toaster />` 추가
- **라이브러리**: Sonner
- **아이콘**: Lucide React 아이콘 사용
- **테마**: 다크모드 자동 지원

## 💾 데이터 저장

### SessionStorage 사용
```typescript
// 저장
sessionStorage.setItem('quick-start-data', JSON.stringify(formData));

// 불러오기
const savedData = sessionStorage.getItem('quick-start-data');
const data = JSON.parse(savedData);
```

### 저장되는 데이터
```typescript
interface QuickStartData {
  expertise: string;    // 전문분야
  industry: string;     // 고객 업종
}
```

## 🎨 UI 구성

### 질문 페이지 레이아웃
```
┌─────────────────────────────────────┐
│ [← 홈으로 돌아가기]                    │
├─────────────────────────────────────┤
│ [전문분야] 전문가를 위한 제안서        │
│ 타겟 고객: [고객업종]                 │
├─────────────────────────────────────┤
│ [7단계 프로그레스 바]                 │
├─────────────────────────────────────┤
│                                     │
│   [질문 카드]                        │
│   - 제목                            │
│   - 설명                            │
│   - 입력 필드                        │
│                                     │
├─────────────────────────────────────┤
│ [← 이전]              [다음 →]       │
├─────────────────────────────────────┤
│ 질문 1 / 17                         │
└─────────────────────────────────────┘
```

## 🔄 다음 단계 (TODO)

### 1. AI 제안서 생성
```typescript
// app/proposal/new/page.tsx
const handleComplete = async (answers: Record<string, string>) => {
  // AI API 호출
  const response = await fetch('/api/generate-proposal', {
    method: 'POST',
    body: JSON.stringify({
      quickStart: quickStartData,
      answers,
    }),
  });
  
  const proposal = await response.json();
  
  // 결과 페이지로 이동
  router.push(`/proposal/result/${proposal.id}`);
};
```

### 2. 결과 페이지 생성
```
app/proposal/result/[id]/page.tsx
- AI 생성된 제안서 표시
- 실시간 스트리밍
- 다운로드 버튼 (Markdown, PDF)
- 수정 버튼
```

### 3. 제안서 저장
```typescript
// Supabase에 저장
const { data, error } = await supabase
  .from('proposals')
  .insert({
    user_id: user.id,
    quick_start: quickStartData,
    answers,
    content: generatedProposal,
    status: 'completed',
  });
```

### 4. 제안서 목록 페이지
```
app/proposal/list/page.tsx
- 사용자의 제안서 히스토리
- 카드 형식 목록
- 검색 및 필터
```

## 🧪 테스트

### 유효성 검사 테스트
- [ ] 전문분야 없이 시작 시 에러 토스트 표시
- [ ] 고객 업종 없이 시작 시 에러 토스트 표시
- [ ] 모두 입력 시 성공 토스트 표시
- [ ] 페이지 이동 정상 작동

### 질문 페이지 테스트
- [ ] 17개 질문이 순서대로 표시
- [ ] 프로그레스 바가 정상 업데이트
- [ ] 이전/다음 버튼 작동
- [ ] 필수 질문 검증 작동
- [ ] 마지막 질문에서 제출 버튼 표시
- [ ] 빠른 시작 데이터 정상 표시

### 반응형 테스트
- [ ] 모바일에서 정상 작동
- [ ] 태블릿에서 정상 작동
- [ ] 데스크톱에서 정상 작동

## 📚 관련 문서

- [PRD 문서](../../doc/prd.md)
- [개발 규칙](../../.cursor/rules/project-rules.mdc)
- [Proposal 컴포넌트](../../components/proposal/README.md)

---

**작성일**: 2026-01-23  
**버전**: 1.0.0
