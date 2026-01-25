# Proposal Flow

AI 기반 제안서 작성 서비스 - 17개의 간단한 질문으로 전문적인 제안서를 자동 생성합니다.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **Backend**: Supabase (Auth, Database)
- **AI**: Anthropic Claude Sonnet 4.5 (via AI SDK)

## Getting Started

### 1. 환경 변수 설정

`.env.local` 파일을 생성하고 필요한 환경 변수를 설정하세요:

```bash
# .env.example 파일을 복사
cp .env.example .env.local
```

필수 환경 변수:
- `ANTHROPIC_API_KEY`: Anthropic API 키
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase 프로젝트 URL
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: Supabase Anon 키
- `NEXT_PUBLIC_SITE_URL`: 배포 URL (개발: http://localhost:3000)

### 2. 의존성 설치

```bash
npm install
```

### 3. 데이터베이스 설정

Supabase에서 스키마를 설정합니다:

```bash
# supabase/schema.sql 파일의 SQL을 Supabase SQL Editor에서 실행
```

자세한 내용은 `supabase/README.md`를 참고하세요.

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## SEO 설정

프로젝트에 SEO 최적화가 적용되어 있습니다:

### 메타데이터
- ✅ 루트 레이아웃에 기본 메타데이터 설정
- ✅ 페이지별 메타데이터 (title, description)
- ✅ Open Graph 태그 (소셜 미디어 공유)
- ✅ Twitter Card 태그
- ✅ 검색 엔진 최적화 (robots, keywords)

### 자동 생성 파일
- `/sitemap.xml` - 검색 엔진을 위한 사이트맵
- `/robots.txt` - 크롤러 접근 제어

### OG 이미지 준비 필요
배포 전에 다음 이미지들을 `public/` 폴더에 추가해주세요:
- `og-image.png` (1200 x 630px) - 소셜 미디어 공유용
- `favicon.ico` (32 x 32px) - 브라우저 파비콘
- `apple-touch-icon.png` (180 x 180px) - iOS 홈 화면 아이콘

자세한 내용은 `public/SEO-README.md`를 참고하세요.

## 빌드 & 배포

### 프로덕션 빌드

```bash
npm run build
npm run start
```

### 환경 변수 체크리스트

배포 시 다음 환경 변수들을 설정하세요:
- [ ] `ANTHROPIC_API_KEY`
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- [ ] `NEXT_PUBLIC_SITE_URL` (실제 도메인으로 변경)

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Anthropic API Documentation](https://docs.anthropic.com)
- [AI SDK Documentation](https://sdk.vercel.ai/docs)

## Deploy on Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/proposal-service)

배포 후 환경 변수를 설정하고 `NEXT_PUBLIC_SITE_URL`을 실제 도메인으로 업데이트하세요.
