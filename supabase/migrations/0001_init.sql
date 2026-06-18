-- GrowGreens — schema de dados do utilizador (cloud, opcional)
-- Aplicar com: supabase db push  (depois de `supabase link`)
-- A app funciona 100% offline sem isto; este schema serve a sincronização futura.

create extension if not exists "uuid-ossp";

create table if not exists gardens (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null default 'A minha horta',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index if not exists idx_gardens_user on gardens(user_id);

create table if not exists plantings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plant_slug text not null,
  nickname text not null,
  location text,
  sown_at date not null default current_date,
  status text not null default 'ativa',
  watering_every_days int not null default 3,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index if not exists idx_plantings_user on plantings(user_id);

create table if not exists journal_entries (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  planting_id uuid not null references plantings(id) on delete cascade,
  type text not null,
  note text,
  photo_path text,
  created_at timestamptz not null default now()
);
create index if not exists idx_journal_user on journal_entries(user_id);
create index if not exists idx_journal_planting on journal_entries(planting_id);

create table if not exists reminders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  planting_id uuid not null references plantings(id) on delete cascade,
  type text not null,
  label text not null,
  due_at date not null,
  done boolean not null default false,
  recurrence_days int,
  created_at timestamptz not null default now()
);
create index if not exists idx_reminders_user on reminders(user_id);

create table if not exists user_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  xp int not null default 0,
  streak int not null default 0,
  last_active_day date,
  completed_lessons jsonb not null default '[]'::jsonb,
  achievements jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);
