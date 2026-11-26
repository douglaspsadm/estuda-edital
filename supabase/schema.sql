-- ============================================================================
-- ESTUDA EDITAL — SCHEMA SUPABASE (MULTI-CONCURSO ISOLADO POR user_id + track_id)
-- Execute este script no SQL Editor do seu projeto Supabase (100% plano gratuito).
-- ============================================================================

-- 1. Trilhas / Editais criados pelo usuário
create table if not exists public.user_tracks (
  user_id uuid not null references auth.users(id) on delete cascade,
  track_id text not null,
  track_data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, track_id)
);

alter table public.user_tracks enable row level security;

drop policy if exists "user_tracks_owner_all" on public.user_tracks;
create policy "user_tracks_owner_all"
  on public.user_tracks
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 2. Progresso de estudo isolado por (user_id, track_id)
create table if not exists public.user_track_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  track_id text not null,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, track_id)
);

alter table public.user_track_progress enable row level security;

drop policy if exists "user_track_progress_owner_all" on public.user_track_progress;
create policy "user_track_progress_owner_all"
  on public.user_track_progress
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
