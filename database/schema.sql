-- Smart Campus Database Schema for Supabase

-- Users table (extends auth.users)
create table if not exists public.users (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text not null,
  specialty text,
  "group" text,
  avatar_url text,
  bio text,
  role text default 'student' check (role in ('student', 'admin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tasks table
create table if not exists public.tasks (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  subject text not null,
  deadline timestamp with time zone not null,
  status text default 'pending' check (status in ('pending', 'in_progress', 'completed', 'overdue')),
  priority text default 'medium' check (priority in ('low', 'medium', 'high')),
  user_id uuid references public.users(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Events table
create table if not exists public.events (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  location text not null,
  category text default 'Учеба',
  start_date timestamp with time zone not null,
  end_date timestamp with time zone not null,
  max_participants integer,
  current_participants integer default 0,
  image_url text,
  organizer_id uuid references public.users(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Event registrations table
create table if not exists public.event_registrations (
  id uuid default gen_random_uuid() primary key,
  event_id uuid references public.events(id) on delete cascade not null,
  user_id uuid references public.users(id) on delete cascade not null,
  registered_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(event_id, user_id)
);

-- Chat rooms table
create table if not exists public.chat_rooms (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  type text default 'group' check (type in ('direct', 'group')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Chat room participants
create table if not exists public.chat_room_participants (
  id uuid default gen_random_uuid() primary key,
  room_id uuid references public.chat_rooms(id) on delete cascade not null,
  user_id uuid references public.users(id) on delete cascade not null,
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(room_id, user_id)
);

-- Messages table
create table if not exists public.messages (
  id uuid default gen_random_uuid() primary key,
  content text not null,
  sender_id uuid references public.users(id) on delete cascade not null,
  room_id uuid references public.chat_rooms(id) on delete cascade,
  type text default 'group' check (type in ('direct', 'group')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Notifications table
create table if not exists public.notifications (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  message text not null,
  type text default 'system' check (type in ('task', 'event', 'message', 'system')),
  read boolean default false,
  user_id uuid references public.users(id) on delete cascade not null,
  link text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- News table
create table if not exists public.news (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  content text not null,
  category text default 'Объявления',
  image_url text,
  author_id uuid references public.users(id) on delete cascade not null,
  published_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.users enable row level security;
alter table public.tasks enable row level security;
alter table public.events enable row level security;
alter table public.event_registrations enable row level security;
alter table public.chat_rooms enable row level security;
alter table public.chat_room_participants enable row level security;
alter table public.messages enable row level security;
alter table public.notifications enable row level security;
alter table public.news enable row level security;

-- RLS Policies
-- Users: users can read all users, update own profile
create policy "Users can view all users" on public.users for select using (true);
create policy "Users can update own profile" on public.users for update using (auth.uid() = id);

-- Tasks: users can CRUD own tasks
create policy "Users can CRUD own tasks" on public.tasks for all using (auth.uid() = user_id);

-- Events: all can read, organizers can update/delete
create policy "All can view events" on public.events for select using (true);
create policy "Organizers can manage events" on public.events for all using (auth.uid() = organizer_id);

-- Event registrations
create policy "Users can view own registrations" on public.event_registrations for select using (auth.uid() = user_id);
create policy "Users can register" on public.event_registrations for insert with check (auth.uid() = user_id);
create policy "Users can unregister" on public.event_registrations for delete using (auth.uid() = user_id);

-- Chat rooms
create policy "Participants can view rooms" on public.chat_rooms for select using (
  exists (select 1 from public.chat_room_participants where room_id = chat_rooms.id and user_id = auth.uid())
);

-- Messages: participants can read, senders can create
create policy "Participants can view messages" on public.messages for select using (
  exists (select 1 from public.chat_room_participants where room_id = messages.room_id and user_id = auth.uid())
);
create policy "Users can send messages" on public.messages for insert with check (auth.uid() = sender_id);

-- Notifications: users can read own
create policy "Users can view own notifications" on public.notifications for select using (auth.uid() = user_id);
create policy "Users can update own notifications" on public.notifications for update using (auth.uid() = user_id);

-- News: all can read
create policy "All can view news" on public.news for select using (true);

-- Functions for event participants
create or replace function increment_participants(event_id uuid)
returns void as $$
begin
  update public.events set current_participants = current_participants + 1 where id = event_id;
end;
$$ language plpgsql security definer;

create or replace function decrement_participants(event_id uuid)
returns void as $$
begin
  update public.events set current_participants = greatest(0, current_participants - 1) where id = event_id;
end;
$$ language plpgsql security definer;

-- Realtime subscriptions
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime;
commit;

alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.notifications;

-- Storage bucket for avatars
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true) on conflict do nothing;

create policy "Avatar images are publicly accessible" on storage.objects for select using (bucket_id = 'avatars');
create policy "Users can upload own avatar" on storage.objects for insert with check (bucket_id = 'avatars');
create policy "Users can update own avatar" on storage.objects for update using (bucket_id = 'avatars');
