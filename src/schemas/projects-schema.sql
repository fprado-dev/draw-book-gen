-- Create projects table
create table if not exists public.projects (
  id uuid primary key,
  title text not null,
  color text not null default '#6366f1',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users(id) on delete cascade not null,
);

-- Enable RLS (Row Level Security)
alter table public.projects enable row level security;

-- Create policy to allow users to view their own projects
create policy "Users can view their own projects"
  on public.projects
  for select
  using (auth.uid() = user_id);

-- Create policy to allow users to insert their own projects
create policy "Users can insert their own projects"
  on public.projects
  for insert
  with check (auth.uid() = user_id);

-- Create policy to allow users to update their own projects
create policy "Users can update their own projects"
  on public.projects
  for update
  using (auth.uid() = user_id);

-- Create policy to allow users to delete their own projects
create policy "Users can delete their own projects"
  on public.projects
  for delete
  using (auth.uid() = user_id);

-- Create index for faster queries
create index if not exists projects_user_id_idx on public.projects(user_id);
create index if not exists projects_created_at_idx on public.projects(created_at);

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
  on public.projects
  for each row
  execute function public.handle_updated_at();