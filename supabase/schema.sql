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

-- 3. Cache comunitário de explicações de IA para questões oficiais (retroalimentação)
create table if not exists public.shared_question_explanations (
  question_id text primary key,
  title text not null check (char_length(title) between 2 and 160),
  explanation text not null check (char_length(explanation) between 10 and 4000),
  core_concept text not null check (char_length(core_concept) between 5 and 2500),
  access_trap text not null default '' check (char_length(access_trap) <= 1000),
  mnemonic text not null default '' check (char_length(mnemonic) <= 1000),
  model_name text not null default '' check (char_length(model_name) <= 120),
  created_by uuid references auth.users(id) on delete set null,
  upvotes integer not null default 0,
  reports integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.shared_question_explanations enable row level security;

-- Leitura pública apenas para explicações com menos de 3 reportes
drop policy if exists "shared_explanations_public_read" on public.shared_question_explanations;
create policy "shared_explanations_public_read"
  on public.shared_question_explanations
  for select
  using (reports < 3);

-- Apenas usuários autenticados podem contribuir com novas explicações (sem sobrescrever existentes)
drop policy if exists "shared_explanations_auth_insert" on public.shared_question_explanations;
create policy "shared_explanations_auth_insert"
  on public.shared_question_explanations
  for insert
  with check (auth.uid() is not null and created_by = auth.uid());

-- RPC segura para curtir (útil) ou reportar erro sem liberar UPDATE direto na tabela
create or replace function public.vote_shared_explanation(p_question_id text, p_is_report boolean)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Faça login para avaliar ou reportar uma explicação.';
  end if;

  if p_is_report then
    update public.shared_question_explanations
      set reports = reports + 1
      where question_id = p_question_id;
  else
    update public.shared_question_explanations
      set upvotes = upvotes + 1
      where question_id = p_question_id;
  end if;
end;
$$;

grant execute on function public.vote_shared_explanation(text, boolean) to authenticated;

