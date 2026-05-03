-- ============================================================
-- Taal – Kathak Practice PWA
-- Supabase Schema
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- EXTENSIONS
create extension if not exists "uuid-ossp";

-- ============================================================
-- TABLES
-- ============================================================

create table public.projects (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  name         text not null,
  description  text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table public.journal_entries (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  project_id   uuid references public.projects(id) on delete set null,
  title        text not null,
  entry_date   date not null default current_date,
  notes        text,
  category     text not null check (category in ('Bols','Chakkar','Tatkaar','Composition','Freestyle')),
  entry_type   text not null check (entry_type in ('Exercise','Piece')),
  audio_path   text,
  duration_sec integer,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index on public.journal_entries(user_id, entry_date desc);
create index on public.journal_entries(project_id);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================

create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_projects_updated_at
  before update on public.projects
  for each row execute procedure public.handle_updated_at();

create trigger set_entries_updated_at
  before update on public.journal_entries
  for each row execute procedure public.handle_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.projects        enable row level security;
alter table public.journal_entries enable row level security;

-- Projects
create policy "users can select own projects"
  on public.projects for select
  using (auth.uid() = user_id);

create policy "users can insert own projects"
  on public.projects for insert
  with check (auth.uid() = user_id);

create policy "users can update own projects"
  on public.projects for update
  using (auth.uid() = user_id);

create policy "users can delete own projects"
  on public.projects for delete
  using (auth.uid() = user_id);

-- Journal entries
create policy "users can select own entries"
  on public.journal_entries for select
  using (auth.uid() = user_id);

create policy "users can insert own entries"
  on public.journal_entries for insert
  with check (auth.uid() = user_id);

create policy "users can update own entries"
  on public.journal_entries for update
  using (auth.uid() = user_id);

create policy "users can delete own entries"
  on public.journal_entries for delete
  using (auth.uid() = user_id);

-- ============================================================
-- STORAGE BUCKET
-- Run this after creating the bucket via the Dashboard or CLI
-- Dashboard → Storage → New bucket → "audio-recordings" (private)
-- Then run the policies below:
-- ============================================================

insert into storage.buckets (id, name, public)
values ('audio-recordings', 'audio-recordings', false)
on conflict (id) do nothing;

create policy "owner read audio"
  on storage.objects for select
  using (
    bucket_id = 'audio-recordings'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "owner insert audio"
  on storage.objects for insert
  with check (
    bucket_id = 'audio-recordings'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "owner delete audio"
  on storage.objects for delete
  using (
    bucket_id = 'audio-recordings'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
