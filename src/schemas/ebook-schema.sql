-- Create ebooks table
create table if not exists public.ebooks (
  id text primary key,
  project_id text references public.projects(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text,
  status text check (status in ('draft', 'published', 'archived')) default 'draft',
  pages jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS (Row Level Security)
alter table public.ebooks enable row level security;

-- Create policy to allow users to view their own ebooks
create policy "Users can view their own ebooks"
  on public.ebooks
  for select
  using (auth.uid() = user_id);

-- Create policy to allow users to insert their own ebooks
create policy "Users can insert their own ebooks"
  on public.ebooks
  for insert
  with check (auth.uid() = user_id);

-- Create policy to allow users to update their own ebooks
create policy "Users can update their own ebooks"
  on public.ebooks
  for update
  using (auth.uid() = user_id);

-- Create policy to allow users to delete their own ebooks
create policy "Users can delete their own ebooks"
  on public.ebooks
  for delete
  using (auth.uid() = user_id);

-- Create indexes for faster queries
create index if not exists ebooks_user_id_idx on public.ebooks(user_id);
create index if not exists ebooks_project_id_idx on public.ebooks(project_id);
create index if not exists ebooks_created_at_idx on public.ebooks(created_at);

-- Function to automatically update updated_at timestamp
create or replace function public.handle_ebook_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

-- Trigger to automatically update updated_at timestamp
create trigger handle_ebook_updated_at
  before update
  on public.ebooks
  for each row
  execute function public.handle_ebook_updated_at();