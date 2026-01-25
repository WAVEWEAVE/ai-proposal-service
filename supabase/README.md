# Supabase Database Schema

## 📋 개요

이 디렉토리는 Proposal Service의 Supabase 데이터베이스 스키마를 포함합니다.

## 🗂️ 테이블 구조

### 1. `public.users`
사용자 프로필 테이블 (auth.users와 1:1 관계)

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid | PK, auth.users.id 참조 |
| email | text | 이메일 (unique) |
| full_name | text | 이름 (nullable) |
| avatar_url | text | 프로필 이미지 URL (nullable) |
| created_at | timestamptz | 생성 시각 |
| updated_at | timestamptz | 수정 시각 |

### 2. `public.proposals`
사용자별 제안서 관리 테이블

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid | PK |
| user_id | uuid | FK → users.id |
| title | text | 제안서 제목 |
| expertise | text | 전문분야 |
| industry | text | 고객 업종 |
| answers | jsonb | 17개 질문 답변 (JSON) |
| content | text | AI 생성 제안서 내용 |
| status | enum | 상태: draft/completed |
| created_at | timestamptz | 생성 시각 |
| updated_at | timestamptz | 수정 시각 |

## 🔒 보안 (RLS)

### Users 테이블
- ✅ `auth.uid() = id`: 본인만 조회/수정 가능

### Proposals 테이블
- ✅ `auth.uid() = user_id`: 본인 제안서만 CRUD 가능

## 🚀 설치 방법

### 1. Supabase Dashboard에서 실행

1. Supabase 프로젝트 대시보드 접속
2. **SQL Editor** 메뉴 선택
3. `schema.sql` 파일 내용 복사
4. SQL Editor에 붙여넣기
5. **Run** 버튼 클릭

### 2. Supabase CLI로 실행 (옵션)

```bash
# Supabase 로그인
supabase login

# 로컬 Supabase 시작
supabase start

# 마이그레이션 실행
supabase db push
```

## ✨ 자동화 기능

### 1. 자동 프로필 생성
- 새로운 사용자가 회원가입하면 자동으로 `users` 테이블에 프로필 생성
- 트리거: `on_auth_user_created`

### 2. 자동 타임스탬프 업데이트
- 레코드 수정 시 `updated_at` 자동 업데이트
- 트리거: `set_users_updated_at`, `set_proposals_updated_at`

### 3. 계정 삭제 시 연쇄 삭제
- 사용자 삭제 시 관련 제안서도 자동 삭제
- `ON DELETE CASCADE`

## 📊 인덱스

성능 최적화를 위한 인덱스:
- `proposals_user_id_idx`: user_id로 빠른 조회
- `proposals_created_at_idx`: 최신순 정렬
- `proposals_status_idx`: 상태별 필터링

## 🧪 테스트 쿼리

### 사용자 프로필 조회
```sql
select * from public.users where id = auth.uid();
```

### 내 제안서 목록 조회
```sql
select * from public.proposals 
where user_id = auth.uid() 
order by created_at desc;
```

### 제안서 생성
```sql
insert into public.proposals (
  user_id, title, expertise, industry, answers, status
) values (
  auth.uid(),
  '테스트 제안서',
  '웹 개발',
  '스타트업',
  '{"q1": "답변1", "q2": "답변2"}'::jsonb,
  'draft'
);
```

## 📝 TypeScript 사용

타입 정의는 `lib/supabase/types.ts`에서 확인할 수 있습니다.

```typescript
import { Database } from '@/lib/supabase/types';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient<Database>();

// 타입 안전한 쿼리
const { data } = await supabase
  .from('proposals')
  .select('*')
  .eq('status', 'draft');
```

## 🔄 스키마 업데이트

스키마를 수정해야 할 경우:
1. `schema.sql` 파일 수정
2. Supabase Dashboard SQL Editor에서 실행
3. `types.ts` 파일도 함께 업데이트

## ⚠️ 주의사항

- RLS가 활성화되어 있으므로 반드시 인증된 사용자만 데이터 접근 가능
- `answers` 필드는 JSONB 타입이므로 JSON 형식으로 저장
- `status`는 enum 타입이므로 'draft' 또는 'completed'만 가능
