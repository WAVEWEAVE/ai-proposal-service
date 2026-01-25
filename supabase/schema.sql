-- ============================================
-- Proposal Service Database Schema
-- Supabase용 초기 스키마 설정
-- ============================================

-- ============================================
-- 1. Extensions
-- ============================================
create extension if not exists "uuid-ossp";

-- ============================================
-- 2. Custom Types
-- ============================================
create type proposal_status as enum ('draft', 'completed');

-- ============================================
-- 3. Users 프로필 테이블
-- ============================================
create table public.users (
  id uuid references auth.users(id) on delete cascade primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Users 테이블 RLS 활성화
alter table public.users enable row level security;

-- Users RLS 정책: 본인만 조회 가능
create policy "Users can view own profile"
  on public.users
  for select
  using (auth.uid() = id);

-- Users RLS 정책: 본인만 수정 가능
create policy "Users can update own profile"
  on public.users
  for update
  using (auth.uid() = id);

-- ============================================
-- 4. Proposals 제안서 테이블
-- ============================================
create table public.proposals (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  title text not null,
  expertise text not null,
  industry text not null,
  answers jsonb not null default '{}'::jsonb,
  content text,
  status proposal_status default 'draft' not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Proposals 테이블 인덱스
create index proposals_user_id_idx on public.proposals(user_id);
create index proposals_created_at_idx on public.proposals(created_at desc);
create index proposals_status_idx on public.proposals(status);

-- Proposals 테이블 RLS 활성화
alter table public.proposals enable row level security;

-- Proposals RLS 정책: 본인 제안서만 조회
create policy "Users can view own proposals"
  on public.proposals
  for select
  using (auth.uid() = user_id);

-- Proposals RLS 정책: 본인 제안서만 생성
create policy "Users can create own proposals"
  on public.proposals
  for insert
  with check (auth.uid() = user_id);

-- Proposals RLS 정책: 본인 제안서만 수정
create policy "Users can update own proposals"
  on public.proposals
  for update
  using (auth.uid() = user_id);

-- Proposals RLS 정책: 본인 제안서만 삭제
create policy "Users can delete own proposals"
  on public.proposals
  for delete
  using (auth.uid() = user_id);

-- ============================================
-- 5. Functions & Triggers
-- ============================================

-- updated_at 자동 업데이트 함수
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- users updated_at 트리거
create trigger set_users_updated_at
  before update on public.users
  for each row
  execute function public.handle_updated_at();

-- proposals updated_at 트리거
create trigger set_proposals_updated_at
  before update on public.proposals
  for each row
  execute function public.handle_updated_at();

-- 새 auth 사용자 생성 시 자동으로 프로필 생성
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- auth.users 트리거
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- ============================================
-- 6. Comments (문서화)
-- ============================================
comment on table public.users is '사용자 프로필 테이블 (auth.users와 1:1)';
comment on table public.proposals is '사용자별 제안서 관리 테이블';
comment on column public.proposals.answers is '17개 질문에 대한 답변 (JSON 형식)';
comment on column public.proposals.content is 'AI가 생성한 최종 제안서 내용';
comment on column public.proposals.status is '제안서 상태: draft (작성중) 또는 completed (완료)';
