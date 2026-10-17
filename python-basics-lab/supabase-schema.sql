-- PYTHON LAB: Supabase Dashboard > SQL Editor에서 프로젝트 관리자만 실행
-- 필수 보안: 학생은 본인만, 멘토는 성적만 조회 (학생 코드는 본인만)
create table if not exists public.student_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 40),
  created_at timestamptz not null default now()
);
create table if not exists public.mentor_members (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
create table if not exists public.learning_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  solved integer[] not null default '{}',
  last_lesson integer not null default 1 check (last_lesson between 1 and 40),
  updated_at timestamptz not null default now(),
  constraint solved_limit check (cardinality(solved) <= 40)
);
create table if not exists public.code_drafts (
  user_id uuid primary key references auth.users(id) on delete cascade,
  drafts jsonb not null default '{}'::jsonb,
  free_code text not null default '',
  updated_at timestamptz not null default now(),
  constraint code_length check (char_length(free_code) <= 20000 and pg_column_size(drafts) <= 150000)
);
create or replace function public.is_mentor() returns boolean
  language sql stable security definer set search_path = ''
  as $$ select exists (select 1 from public.mentor_members where user_id = (select auth.uid())); $$;
revoke all on function public.is_mentor() from public;
grant execute on function public.is_mentor() to authenticated;
create or replace function public.create_student_profile() returns trigger
  language plpgsql security definer set search_path = '' as $$
  declare safe_name text;
  begin
    safe_name := left(trim(coalesce(new.raw_user_meta_data ->> 'display_name', '학생')), 40);
    if safe_name = '' then safe_name := '학생'; end if;
    insert into public.student_profiles(user_id, display_name) values(new.id, safe_name)
    on conflict (user_id) do nothing;
    return new;
  end;
  $$;
drop trigger if exists on_pylab_user_created on auth.users;
create trigger on_pylab_user_created after insert on auth.users
  for each row execute function public.create_student_profile();
alter table public.student_profiles enable row level security;
alter table public.mentor_members enable row level security;
alter table public.learning_progress enable row level security;
alter table public.code_drafts enable row level security;
drop policy if exists "profile read own or mentor" on public.student_profiles;
create policy "profile read own or mentor" on public.student_profiles
  for select to authenticated using ((select auth.uid()) = user_id or (select public.is_mentor()));
drop policy if exists "profile update own" on public.student_profiles;
create policy "profile update own" on public.student_profiles
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
drop policy if exists "draft read own" on public.code_drafts;
create policy "draft read own" on public.code_drafts
  for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "draft insert own" on public.code_drafts;
create policy "draft insert own" on public.code_drafts
  for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "draft update own" on public.code_drafts;
create policy "draft update own" on public.code_drafts
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
drop policy if exists "progress read own or mentor" on public.learning_progress;
create policy "progress read own or mentor" on public.learning_progress
  for select to authenticated using ((select auth.uid()) = user_id or (select public.is_mentor()));
drop policy if exists "progress insert own" on public.learning_progress;
create policy "progress insert own" on public.learning_progress
  for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "progress update own" on public.learning_progress;
create policy "progress update own" on public.learning_progress
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
revoke all on public.student_profiles, public.mentor_members, public.learning_progress, public.code_drafts from anon;
revoke all on public.mentor_members from authenticated;
grant select on public.student_profiles, public.learning_progress, public.code_drafts to authenticated;
grant insert, update on public.learning_progress, public.code_drafts to authenticated;
grant update(display_name) on public.student_profiles to authenticated;
insert into public.student_profiles(user_id, display_name)
  select id, left(coalesce(nullif(trim(raw_user_meta_data->>'display_name'),''),'학생'),40)
  from auth.users on conflict (user_id) do nothing;
-- 멘토는 사이트에서 회원가입한 뒤 Supabase SQL Editor에서만 권한 부여:
-- insert into public.mentor_members(user_id)
-- select id from auth.users where email = 'mentor@example.com'
-- on conflict (user_id) do nothing;