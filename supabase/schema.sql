-- Supabase > SQL Editor дээр нэг удаа ажиллуулна.
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  role text not null default 'user' check (role in ('user','admin'))
);
create function handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin insert into profiles(id) values (new.id); return new; end $$;
create trigger on_signup after insert on auth.users
  for each row execute function handle_new_user();
create function is_admin() returns boolean
language sql security definer set search_path = public stable as $$
  select exists(select 1 from profiles where id = auth.uid() and role = 'admin') $$;

create table jobs (
  id uuid primary key default gen_random_uuid(),
  owner uuid not null default auth.uid() references auth.users,
  company text not null, title text not null, description text,
  location text not null, category text not null, job_type text not null,
  remote boolean not null default false, salary integer,
  status text not null default 'pending'
    check (status in ('pending','approved','rejected','closed')),
  expires_at date, created_at timestamptz not null default now()
);
create table notification_prefs (
  user_id uuid primary key default auth.uid() references auth.users,
  location text, category text, min_salary integer, frequency text,
  consent boolean not null default false, consent_at timestamptz
);

alter table profiles enable row level security;
alter table jobs enable row level security;
alter table notification_prefs enable row level security;

create policy "own profile" on profiles for select using (id = auth.uid() or is_admin());

create policy "public sees approved" on jobs for select
  using (status = 'approved' and (expires_at is null or expires_at >= current_date));
create policy "owner sees own" on jobs for select using (owner = auth.uid());
create policy "admin sees all" on jobs for select using (is_admin());
create policy "owner posts pending" on jobs for insert
  with check (owner = auth.uid() and status = 'pending');
create policy "owner edits own, never self-approves" on jobs for update
  using (owner = auth.uid()) with check (owner = auth.uid() and status in ('pending','closed'));
create policy "admin moderates" on jobs for update using (is_admin()) with check (is_admin());

create policy "own prefs" on notification_prefs for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
