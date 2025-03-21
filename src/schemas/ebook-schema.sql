-- Create books table
create table if not exists public.books (
  id uuid primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  status text check (status in ('draft', 'published', 'archived')) default 'draft',
  pages jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,

  title text not null,
  size text not null,
  thumbnail_url text,
  last_viewed timestamp with time zone default now() not null,
  constraint size_check check (size in ('5x8', '5.25x8', '5.5x8.5', '6x9', '7x10', '8x10', '8.5x11'))
);

-- Enable RLS (Row Level Security)
alter table public.books enable row level security;

-- Create policy to allow users to view their own books
create policy "Users can view their own books"
  on public.books
  for select
  using (auth.uid() = user_id);

-- Create policy to allow users to insert their own books
create policy "Users can insert their own books"
  on public.books
  for insert
  with check (auth.uid() = user_id);

-- Create policy to allow users to update their own books
create policy "Users can update their own books"
  on public.books
  for update
  using (auth.uid() = user_id);

-- Create policy to allow users to delete their own books
create policy "Users can delete their own books"
  on public.books
  for delete
  using (auth.uid() = user_id);

-- Create indexes for faster queries
create index if not exists books_user_id_idx on public.books(user_id);
create index if not exists books_project_id_idx on public.books(project_id);
create index if not exists books_created_at_idx on public.books(created_at);

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
  on public.books
  for each row
  execute function public.handle_ebook_updated_at();
-- Add cascade delete trigger when project is deleted
create or replace function public.handle_project_deletion()
returns trigger
language plpgsql
as $$
begin
  delete from public.books where project_id = old.id;
  return old;
end;
$$;

create trigger handle_project_deletion
  before delete
  on public.projects
  for each row
  execute function public.handle_project_deletion();

-- Function to update project's ebooks_count
create or replace function public.update_project_ebooks_count()
returns trigger
language plpgsql
as $$
begin
  if (TG_OP = 'DELETE') then
    update public.projects
    set ebooks_count = (select count(*) from public.books where project_id = old.project_id)
    where id = old.project_id;
    return old;
  elsif (TG_OP = 'INSERT') then
    update public.projects
    set ebooks_count = (select count(*) from public.books where project_id = new.project_id)
    where id = new.project_id;
    return new;
  elsif (TG_OP = 'UPDATE') and (old.project_id != new.project_id) then
    update public.projects
    set ebooks_count = (select count(*) from public.books where project_id = old.project_id)
    where id = old.project_id;
    update public.projects
    set ebooks_count = (select count(*) from public.books where project_id = new.project_id)
    where id = new.project_id;
    return new;
  end if;
  return null;
end;
$$;

-- Trigger to update project's ebooks_count on book changes
create trigger update_project_ebooks_count
  after insert or update or delete
  on public.books
  for each row
  execute function public.update_project_ebooks_count();
