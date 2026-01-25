# 🌟 랜딩 페이지 컴포넌트

메인 홈페이지를 구성하는 컴포넌트 모음입니다.

## 📁 구조

```
components/landing/
├── Header.tsx              # 헤더 (로고, 사용자 정보, 로그아웃)
├── HeroSection.tsx         # 히어로 섹션 (메인 타이틀, 입력 폼, CTA)
├── FeaturesSection.tsx     # 주요 기능 소개
├── HowItWorksSection.tsx   # 7단계 프로세스 안내
├── CTASection.tsx          # 최종 행동 유도
├── Footer.tsx              # 푸터
└── index.ts                # Export 모듈
```

## 🎨 페이지 구성

### 1. Header (헤더)
**위치**: 상단 고정 (sticky)

#### 기능
- ✅ 서비스 로고 (Sparkles 아이콘)
- ✅ 로그인/비로그인 상태 분기
- ✅ 사용자 정보 표시 (Avatar + 이메일)
- ✅ 로그아웃 버튼
- ✅ 반응형 (모바일에서 간소화)

#### Props
```typescript
interface HeaderProps {
  user?: {
    email: string;
    name?: string;
  } | null;
  onLogout?: () => void;
}
```

#### 사용 예시
```tsx
<Header 
  user={{ email: 'user@example.com', name: '홍길동' }} 
  onLogout={handleLogout}
/>
```

---

### 2. HeroSection (히어로)
**위치**: 최상단 섹션

#### 기능
- ✅ 메인 타이틀: "영업의 심리적 장벽을 AI로 제거하세요"
- ✅ 서브 타이틀: 17개 질문, 제안서 자동 생성
- ✅ 빠른 시작 입력 폼
  - 전문분야 입력
  - 제안 고객 업종 입력
- ✅ CTA 버튼: "제안서 작성 시작하기"
- ✅ 통계 표시 (17개 질문, 5분, AI)
- ✅ 그라디언트 배경 + 블러 장식

#### 동작
- 입력값 수집 후 `/proposal/new` 페이지로 이동
- 로그인 없이도 시작 가능 안내

---

### 3. FeaturesSection (주요 기능)
**위치**: 히어로 다음

#### 기능
- ✅ 4개 주요 기능 카드
  1. 단계별 질문 가이드
  2. AI 자동 생성
  3. 다양한 포맷 다운로드
  4. 개인 히스토리 관리
- ✅ 아이콘 + 제목 + 설명
- ✅ 호버 효과 (테두리 색상 변경)

---

### 4. HowItWorksSection (사용 방법)
**위치**: 기능 섹션 다음

#### 기능
- ✅ 7단계 프로세스 표시
  - 각 단계별 제목, 설명, 질문 수
  - 단계 번호 원형 배지
  - 완료 체크 아이콘 (장식)
- ✅ 평균 작성 시간 안내
- ✅ 질문 건너뛰기 가능 안내

#### 단계 구성 (PRD 기반)
```
1단계: 제안 대상 및 현황 (3개 질문)
2단계: 서비스 내용 및 프로세스 (3개 질문)
3단계: 전문성 및 실행 역량 (3개 질문)
4단계: 브랜드 스토리 (3개 질문)
5단계: 기대 효과 및 목표 (2개 질문)
6단계: 서비스 비용 및 조건 (2개 질문)
7단계: 마무리 및 연결 (1개 질문)
```

---

### 5. CTASection (행동 유도)
**위치**: 프로세스 섹션 다음

#### 기능
- ✅ 최종 CTA: "지금 바로 시작하세요"
- ✅ 버튼 2개
  - 무료로 시작하기 → `/signup`
  - 로그인 → `/login`
- ✅ 신뢰 요소 (무료, 신용카드 불필요, 언제든 취소)
- ✅ 그라디언트 배경

---

### 6. Footer (푸터)
**위치**: 최하단

#### 기능
- ✅ 브랜드 로고 + 설명
- ✅ 4개 컬럼
  - 제품 (주요 기능, 가격, 예시)
  - 지원 (가이드, FAQ, 문의)
  - 법적 고지 (약관, 개인정보, 법적)
- ✅ 저작권 표시

---

## 🚀 사용 방법

### app/page.tsx에서 조합

```tsx
import {
  Header,
  HeroSection,
  FeaturesSection,
  HowItWorksSection,
  CTASection,
  Footer,
} from '@/components/landing';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} onLogout={handleLogout} />
      
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <CTASection />
      </main>
      
      <Footer />
    </div>
  );
}
```

---

## 🎨 디자인 특징

### 컬러 팔레트
- **Primary**: Indigo (#6366F1) - 브랜드 컬러
- **Background**: 그라디언트 (background → primary/5)
- **Card**: border-2, hover:border-primary/50

### 타이포그래피
- **H1**: text-4xl md:text-6xl font-bold
- **H2**: text-3xl md:text-4xl font-bold
- **Body**: text-lg md:text-xl

### 간격
- **Section**: py-20 md:py-32
- **Container**: max-w-5xl mx-auto
- **Gap**: space-y-4 ~ space-y-8

---

## 📱 반응형 디자인

### 모바일 (< 768px)
- Header: 사용자 아바타만 표시
- Hero: 입력 필드 세로 배치
- Features: 단일 컬럼
- Steps: 체크 아이콘 숨김

### 태블릿 (768px ~ 1024px)
- Features: 2컬럼 그리드
- Footer: 2x2 그리드

### 데스크톱 (> 1024px)
- 모든 요소 최대 너비 적용
- Footer: 4컬럼 그리드

---

## 🔧 TODO: 데이터 연동

### 1. 사용자 인증 (Supabase)
```typescript
// Header 컴포넌트
const { data: { user } } = await supabase.auth.getUser();

const handleLogout = async () => {
  await supabase.auth.signOut();
};
```

### 2. 빠른 시작 폼 데이터 저장
```typescript
// HeroSection 컴포넌트
const handleStart = () => {
  // 세션 스토리지에 저장
  sessionStorage.setItem('quick-start', JSON.stringify(formData));
  router.push('/proposal/new');
};
```

### 3. 통계 데이터 실시간 표시
```typescript
// HeroSection - 실제 사용자 수, 제안서 수 등
const stats = await fetchStats();
```

---

## ✅ 컴포넌트 체크리스트

### Header
- [x] 로고 및 브랜드명
- [x] 로그인/비로그인 분기
- [x] 사용자 정보 표시
- [x] 로그아웃 버튼
- [x] 반응형 디자인

### HeroSection
- [x] 메인 타이틀
- [x] 전문분야 입력
- [x] 고객 업종 입력
- [x] CTA 버튼
- [x] 통계 표시
- [x] 그라디언트 배경

### FeaturesSection
- [x] 4개 기능 카드
- [x] 아이콘 + 제목 + 설명
- [x] 호버 효과

### HowItWorksSection
- [x] 7단계 프로세스
- [x] 단계별 질문 수
- [x] 안내 문구

### CTASection
- [x] 최종 행동 유도
- [x] 2개 버튼 (회원가입, 로그인)
- [x] 신뢰 요소

### Footer
- [x] 브랜드 정보
- [x] 링크 그룹 (제품, 지원, 법적)
- [x] 저작권

---

## 🎯 개발 규칙 준수

- ✅ 화살표 함수 사용
- ✅ 파스칼 케이스 파일명
- ✅ 한글 JSDoc 주석
- ✅ TypeScript strict 모드
- ✅ Tailwind CSS 스타일링
- ✅ Shadcn/ui 컴포넌트 활용
- ✅ 반응형 디자인

---

## 📚 관련 문서

- [PRD 문서](../../doc/prd.md)
- [개발 규칙](../../.cursor/rules/project-rules.mdc)
- [Proposal 컴포넌트](../proposal/README.md)

---

**작성일**: 2026-01-23  
**버전**: 1.0.0
