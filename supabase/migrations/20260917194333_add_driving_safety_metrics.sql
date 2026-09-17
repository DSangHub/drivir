create extension if not exists pgcrypto;

create table public.driver_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  total_points bigint not null default 0 check (total_points >= 0),
  safe_streak integer not null default 0 check (safe_streak >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.driving_trips (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  destination_label text not null,
  planned_minutes integer not null check (planned_minutes between 5 and 1440),
  started_at timestamptz,
  completed_at timestamptz,
  safe_score numeric(5,2) check (safe_score between 0 and 100),
  points_earned integer not null default 0 check (points_earned >= 0),
  status text not null default 'planned' check (status in ('planned','active','completed','cancelled')),
  created_at timestamptz not null default now()
);

create table public.braking_events (
  id bigint generated always as identity primary key,
  trip_id uuid not null references public.driving_trips(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  occurred_at timestamptz not null,
  deceleration_mps2 numeric(7,3) not null,
  classification text not null check (classification in ('smooth','firm','hard')),
  points_delta integer not null default 0,
  source text not null default 'obd' check (source in ('obd','phone_sensor','verified_partner'))
);

create table public.stop_events (
  id bigint generated always as identity primary key,
  trip_id uuid not null references public.driving_trips(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  occurred_at timestamptz not null,
  stopped_seconds numeric(8,2) not null check (stopped_seconds >= 0),
  full_stop boolean not null,
  points_delta integer not null default 0
);

create table public.steady_pace_metrics (
  id bigint generated always as identity primary key,
  trip_id uuid not null references public.driving_trips(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  window_started_at timestamptz not null,
  window_seconds integer not null check (window_seconds > 0),
  average_speed_mph numeric(7,2) not null check (average_speed_mph >= 0),
  speed_variance numeric(9,3) not null check (speed_variance >= 0),
  posted_limit_mph numeric(6,2) check (posted_limit_mph > 0),
  within_safe_range boolean not null,
  points_delta integer not null default 0
);

create table public.safe_distance_metrics (
  id bigint generated always as identity primary key,
  trip_id uuid not null references public.driving_trips(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  occurred_at timestamptz not null,
  following_seconds numeric(6,2) not null check (following_seconds >= 0),
  speed_mph numeric(7,2) not null check (speed_mph >= 0),
  safe_distance_met boolean not null,
  points_delta integer not null default 0,
  sensor_confidence numeric(5,2) check (sensor_confidence between 0 and 100)
);

create table public.time_of_day_metrics (
  id bigint generated always as identity primary key,
  trip_id uuid not null unique references public.driving_trips(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  local_started_at timestamp not null,
  timezone_name text not null,
  period text not null check (period in ('morning','afternoon','evening','overnight')),
  daylight_minutes integer not null default 0 check (daylight_minutes >= 0),
  night_minutes integer not null default 0 check (night_minutes >= 0)
);

create table public.driving_duration_metrics (
  id bigint generated always as identity primary key,
  trip_id uuid not null unique references public.driving_trips(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  total_minutes integer not null check (total_minutes >= 0),
  moving_minutes integer not null check (moving_minutes >= 0),
  stopped_minutes integer not null check (stopped_minutes >= 0),
  break_minutes integer not null default 0 check (break_minutes >= 0),
  fatigue_risk text not null default 'low' check (fatigue_risk in ('low','moderate','high'))
);

create table public.insurance_consents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  insurer_name text not null,
  scope text[] not null,
  granted_at timestamptz not null default now(),
  expires_at timestamptz not null,
  revoked_at timestamptz,
  check (expires_at > granted_at)
);

create table public.insurance_verification_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  consent_id uuid not null references public.insurance_consents(id) on delete restrict,
  insurer_name text not null,
  status text not null default 'pending' check (status in ('pending','approved','delivered','declined','expired')),
  requested_at timestamptz not null default now(),
  delivered_at timestamptz
);

create index driving_trips_user_started_idx on public.driving_trips (user_id, started_at desc);
create index braking_events_user_trip_idx on public.braking_events (user_id, trip_id, occurred_at);
create index stop_events_user_trip_idx on public.stop_events (user_id, trip_id, occurred_at);
create index steady_pace_user_trip_idx on public.steady_pace_metrics (user_id, trip_id, window_started_at);
create index safe_distance_user_trip_idx on public.safe_distance_metrics (user_id, trip_id, occurred_at);
create index time_of_day_user_trip_idx on public.time_of_day_metrics (user_id, trip_id);
create index driving_duration_user_trip_idx on public.driving_duration_metrics (user_id, trip_id);
create index insurance_consents_user_idx on public.insurance_consents (user_id, expires_at desc);
create index insurance_requests_user_idx on public.insurance_verification_requests (user_id, requested_at desc);

alter table public.driver_profiles enable row level security;
alter table public.driving_trips enable row level security;
alter table public.braking_events enable row level security;
alter table public.stop_events enable row level security;
alter table public.steady_pace_metrics enable row level security;
alter table public.safe_distance_metrics enable row level security;
alter table public.time_of_day_metrics enable row level security;
alter table public.driving_duration_metrics enable row level security;
alter table public.insurance_consents enable row level security;
alter table public.insurance_verification_requests enable row level security;

grant select, insert, update, delete on public.driver_profiles, public.driving_trips, public.braking_events, public.stop_events, public.steady_pace_metrics, public.safe_distance_metrics, public.time_of_day_metrics, public.driving_duration_metrics, public.insurance_consents, public.insurance_verification_requests to authenticated;
grant usage, select on all sequences in schema public to authenticated;

create policy "Drivers manage own profiles" on public.driver_profiles for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Drivers manage own trips" on public.driving_trips for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Drivers manage own braking" on public.braking_events for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Drivers manage own stops" on public.stop_events for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Drivers manage own steady pace" on public.steady_pace_metrics for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Drivers manage own safe distance" on public.safe_distance_metrics for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Drivers manage own time metrics" on public.time_of_day_metrics for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Drivers manage own duration metrics" on public.driving_duration_metrics for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Drivers manage own insurance consents" on public.insurance_consents for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Drivers view own insurance requests" on public.insurance_verification_requests for select to authenticated using ((select auth.uid()) = user_id);
create policy "Drivers create own insurance requests" on public.insurance_verification_requests for insert to authenticated with check ((select auth.uid()) = user_id);
