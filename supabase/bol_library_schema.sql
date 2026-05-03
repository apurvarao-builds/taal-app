-- ============================================================
-- Taal – Bol Library
-- Run this in your Supabase SQL Editor after the main schema
-- ============================================================

create table public.bol_recordings (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  bol_name     text not null,
  laya         text not null check (laya in ('Vilambit', 'Madhya', 'Drut')),
  performer    text not null check (performer in ('Me', 'Guru', 'Reference')),
  notes        text,
  audio_path   text,
  duration_sec integer,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index on public.bol_recordings(user_id, created_at desc);

create trigger set_bol_recordings_updated_at
  before update on public.bol_recordings
  for each row execute procedure public.handle_updated_at();

alter table public.bol_recordings enable row level security;

create policy "users can select own bol recordings"
  on public.bol_recordings for select
  using (auth.uid() = user_id);

create policy "users can insert own bol recordings"
  on public.bol_recordings for insert
  with check (auth.uid() = user_id);

create policy "users can update own bol recordings"
  on public.bol_recordings for update
  using (auth.uid() = user_id);

create policy "users can delete own bol recordings"
  on public.bol_recordings for delete
  using (auth.uid() = user_id);
