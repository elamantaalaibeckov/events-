create extension if not exists "pgcrypto";

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  group_name text,
  role text not null default 'student' check (role in ('admin', 'moderator', 'teacher', 'student')),
  avatar_url text,
  created_at timestamp with time zone not null default now()
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  event_type text not null check (event_type in ('олимпиада', 'хакатон', 'спорт', 'конкурс', 'другое')),
  event_date date not null,
  event_time time,
  location text,
  image_url text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamp with time zone not null default now()
);

create table public.achievements (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  event_id uuid references public.events(id) on delete set null,
  title text not null,
  description text not null,
  file_url text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  rejection_reason text,
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamp with time zone,
  created_at timestamp with time zone not null default now()
);

create table public.news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  image_url text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamp with time zone not null default now()
);

create table public.gallery (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  image_url text not null,
  event_id uuid references public.events(id) on delete set null,
  created_at timestamp with time zone not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  message text not null,
  is_read boolean not null default false,
  created_at timestamp with time zone not null default now()
);

create index achievements_student_id_idx on public.achievements(student_id);
create index achievements_status_idx on public.achievements(status);
create index events_event_date_idx on public.events(event_date);
create index notifications_user_id_idx on public.notifications(user_id);

create or replace function public.current_user_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.is_admin_or_moderator()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_user_role() in ('admin', 'moderator', 'teacher'), false)
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, group_name, role)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'group_name',
    'student'
  );
  return new;
end;
$$;

create or replace function public.prevent_non_admin_role_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role and public.current_user_role() <> 'admin' then
    raise exception 'Only admin can change user role';
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

drop trigger if exists prevent_non_admin_role_change on public.profiles;
create trigger prevent_non_admin_role_change
before update on public.profiles
for each row execute function public.prevent_non_admin_role_change();

alter table public.profiles enable row level security;
alter table public.events enable row level security;
alter table public.achievements enable row level security;
alter table public.news enable row level security;
alter table public.gallery enable row level security;
alter table public.notifications enable row level security;

create policy "profiles are readable for public pages"
on public.profiles for select
using (true);

create policy "users can update own profile"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "admins can manage profiles"
on public.profiles for all
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

create policy "guests can read events"
on public.events for select
using (true);

create policy "only admins create events"
on public.events for insert
with check (public.current_user_role() = 'admin' and created_by = auth.uid());

create policy "only admins update events"
on public.events for update
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

create policy "only admins delete events"
on public.events for delete
using (public.current_user_role() = 'admin');

create policy "guests read approved achievements"
on public.achievements for select
using (status = 'approved');

create policy "students read own achievements"
on public.achievements for select
using (auth.uid() = student_id);

create policy "admin moderators read all achievements"
on public.achievements for select
using (public.is_admin_or_moderator());

create policy "students create only own pending achievements"
on public.achievements for insert
with check (
  auth.uid() = student_id
  and status = 'pending'
  and reviewed_by is null
  and reviewed_at is null
);

create policy "admin moderators change achievement status"
on public.achievements for update
using (public.is_admin_or_moderator())
with check (public.is_admin_or_moderator());

create policy "guests can read news"
on public.news for select
using (true);

create policy "only admins create news"
on public.news for insert
with check (public.current_user_role() = 'admin' and created_by = auth.uid());

create policy "only admins update news"
on public.news for update
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

create policy "only admins delete news"
on public.news for delete
using (public.current_user_role() = 'admin');

create policy "guests can read gallery"
on public.gallery for select
using (true);

create policy "only admins create gallery"
on public.gallery for insert
with check (public.current_user_role() = 'admin');

create policy "only admins update gallery"
on public.gallery for update
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

create policy "only admins delete gallery"
on public.gallery for delete
using (public.current_user_role() = 'admin');

create policy "users read own notifications"
on public.notifications for select
using (auth.uid() = user_id);

create policy "users update own notifications"
on public.notifications for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "admins moderators create notifications"
on public.notifications for insert
with check (public.is_admin_or_moderator());

insert into storage.buckets (id, name, public)
values ('achievement-files', 'achievement-files', true)
on conflict (id) do update set public = true;

create policy "public can view achievement files"
on storage.objects for select
using (bucket_id = 'achievement-files');

create policy "students upload files to own folder"
on storage.objects for insert
with check (
  bucket_id = 'achievement-files'
  and auth.role() = 'authenticated'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "admins can manage achievement files"
on storage.objects for all
using (bucket_id = 'achievement-files' and public.is_admin_or_moderator())
with check (bucket_id = 'achievement-files' and public.is_admin_or_moderator());
