# 🔐 인증 페이지

로그인 및 회원가입 페이지 모음입니다.

## 📁 구조

```
app/
├── login/
│   └── page.tsx          # 로그인 페이지
└── signup/
    └── page.tsx          # 회원가입 페이지
```

## 🎨 디자인 특징

### 미니멀리스트 Apple/Dyson 스타일
- ✅ 깔끔한 카드 UI
- ✅ 그라디언트 배경
- ✅ 아이콘과 함께하는 입력 필드
- ✅ 부드러운 애니메이션
- ✅ 다크모드 지원

### 브랜드 컬러
- **Primary**: Indigo (#6366F1) - 엠파워먼트 바이올렛
- **배경**: 그라디언트 (background → primary/5)

## 🚀 페이지 기능

### 1. 로그인 페이지 (`/login`)

#### 필수 요소
- [x] 서비스 로고 (Sparkles 아이콘)
- [x] 서비스 소개 문구
- [x] 이메일 입력 필드
- [x] 비밀번호 입력 필드
- [x] 로그인 버튼
- [x] 회원가입 페이지 링크
- [x] 비밀번호 찾기 링크
- [x] 약관 동의 안내

#### 주요 기능
```tsx
// 로그인 처리
const handleSubmit = async (e: React.FormEvent) => {
  // 1. 유효성 검사
  // 2. Supabase Auth 로그인
  // 3. 대시보드로 리다이렉트
};
```

#### 상태 관리
- 로딩 상태 (버튼 비활성화 + 로딩 텍스트)
- 에러 메시지 표시
- 입력 필드 실시간 유효성 검사

### 2. 회원가입 페이지 (`/signup`)

#### 필수 요소
- [x] 서비스 로고 (Sparkles 아이콘)
- [x] 서비스 소개 문구
- [x] 이메일 입력 필드
- [x] 비밀번호 입력 필드
- [x] 비밀번호 확인 필드
- [x] 회원가입 버튼
- [x] 로그인 페이지 링크
- [x] 서비스 특징 요약 (17개 질문, AI 생성, PDF 다운로드)
- [x] 약관 동의 안내

#### 주요 기능
```tsx
// 회원가입 처리
const handleSubmit = async (e: React.FormEvent) => {
  // 1. 유효성 검사
  // 2. 비밀번호 일치 확인
  // 3. Supabase Auth 회원가입
  // 4. 성공 메시지 표시
};

// 비밀번호 유효성 검사
const validatePassword = (): boolean => {
  // - 최소 8자 이상
  // - 비밀번호 확인 일치
};
```

#### 회원가입 성공 화면
- 체크마크 아이콘
- 이메일 인증 안내
- 로그인 페이지 이동 버튼

## 🔧 TODO: Supabase 연동

### 1. 환경변수 설정
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 2. Supabase 클라이언트 생성
```typescript
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';

export const createClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};
```

### 3. 로그인 구현
```typescript
// app/login/page.tsx
const supabase = createClient();

const { data, error } = await supabase.auth.signInWithPassword({
  email: formData.email,
  password: formData.password,
});

if (error) throw error;

// 로그인 성공 후
router.push('/dashboard');
```

### 4. 회원가입 구현
```typescript
// app/signup/page.tsx
const supabase = createClient();

const { data, error } = await supabase.auth.signUp({
  email: formData.email,
  password: formData.password,
  options: {
    emailRedirectTo: `${window.location.origin}/auth/callback`,
  },
});

if (error) throw error;

// 이메일 인증 안내
setSuccess(true);
```

## 📱 반응형 디자인

- **모바일**: 단일 컬럼, 작은 카드
- **태블릿**: 중앙 정렬, 중간 크기 카드
- **데스크톱**: 중앙 정렬, 최대 너비 제한 (max-w-md)

## 🎯 사용자 경험 (UX)

### 로딩 상태
```tsx
{isLoading ? (
  <>
    <span className="animate-spin mr-2">⏳</span>
    로그인 중...
  </>
) : (
  <>
    로그인
    <ArrowRight className="w-4 h-4 ml-2" />
  </>
)}
```

### 에러 처리
```tsx
{error && (
  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
    <p className="text-sm text-destructive font-medium">{error}</p>
  </div>
)}
```

### 입력 필드 아이콘
- 이메일: Mail 아이콘
- 비밀번호: Lock 아이콘
- 위치: 입력 필드 왼쪽 (pl-10)

## 🔍 유효성 검사

### 로그인
- [x] 이메일 형식 검사 (type="email")
- [x] 필수 필드 확인
- [x] 에러 메시지 표시

### 회원가입
- [x] 이메일 형식 검사
- [x] 비밀번호 최소 길이 (8자)
- [x] 비밀번호 확인 일치
- [x] 실시간 에러 초기화

## 🎨 컴포넌트 사용

### Shadcn/ui 컴포넌트
- `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`
- `Button`
- `Input`
- `Label`

### Lucide 아이콘
- `Sparkles` - 서비스 로고
- `Mail` - 이메일 입력
- `Lock` - 비밀번호 입력
- `ArrowRight` - 버튼 화살표
- `CheckCircle2` - 성공 표시

## 🚀 테스트

### 로그인 페이지 체크리스트
- [ ] 페이지가 정상적으로 렌더링되는가?
- [ ] 이메일/비밀번호 입력이 정상 작동하는가?
- [ ] 로딩 상태가 올바르게 표시되는가?
- [ ] 에러 메시지가 정상 표시되는가?
- [ ] 회원가입 링크가 작동하는가?
- [ ] 모바일/데스크톱 반응형이 정상인가?
- [ ] 다크모드가 정상 작동하는가?

### 회원가입 페이지 체크리스트
- [ ] 페이지가 정상적으로 렌더링되는가?
- [ ] 비밀번호 유효성 검사가 작동하는가?
- [ ] 비밀번호 확인이 일치하는지 검사하는가?
- [ ] 성공 화면이 정상 표시되는가?
- [ ] 로그인 링크가 작동하는가?
- [ ] 서비스 특징 요약이 표시되는가?
- [ ] 모바일/데스크톱 반응형이 정상인가?

## 📚 관련 문서

- [PRD 문서](../../doc/prd.md)
- [개발 규칙](.cursor/rules/project-rules.mdc)
- [Supabase Auth 문서](https://supabase.com/docs/guides/auth)
- [Next.js App Router](https://nextjs.org/docs/app)

## 🔗 페이지 경로

- 로그인: `http://localhost:3000/login`
- 회원가입: `http://localhost:3000/signup`
- 비밀번호 찾기: `http://localhost:3000/reset-password` (TODO)
