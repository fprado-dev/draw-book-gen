-- Create users table
create table if not exists public.users (
  id uuid references auth.users(id) on delete cascade primary key,
  name text not null,
  username text not null unique,
  email text not null,
  avatar text,
  bio text,
  website text,
  twitter text,
  instagram text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS (Row Level Security)
alter table public.users enable row level security;

-- Create policy to allow users to view their own profile
create policy "Users can view own profile"
  on public.users
  for select
  using (auth.uid() = id);

-- Create policy to allow users to update their own profile
create policy "Users can update own profile"
  on public.users
  for update
  using (auth.uid() = id);

-- Create policy to allow users to insert their own profile
create policy "Users can insert own profile"
  on public.users
  for insert
  with check (auth.uid() = id);

-- Create indexes for faster queries
create index if not exists users_email_idx on public.users(email);
create index if not exists users_username_idx on public.users(username);
create index if not exists users_created_at_idx on public.users(created_at);

-- Function to automatically update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

-- Trigger to automatically update updated_at timestamp
create trigger handle_updated_at
  before update
  on public.users
  for each row
  execute function public.handle_updated_at();