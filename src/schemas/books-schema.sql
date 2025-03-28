-- Create books table
create table if not exists public.books (
  id uuid primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  size text not null,
  status text check (status in ('draft', 'published', 'archived')) default 'draft',
  book_type text check (book_type in ('paperback', 'hardcover')) default 'paperback' not null,
  measurement_unit text check (measurement_unit in ('inches', 'millimeters')) default 'inches' not null,
  paper_color text check (paper_color in ('white', 'cream')) default 'white' not null,
  last_viewed timestamp with time zone default now() not null,
  updated_at timestamp with time zone default timezone('utc', now()) not null,
  created_at timestamp with time zone default timezone('utc', now()) not null,
  constraint size_check check (size in ('5x8', '5.25x8', '5.5x8.5', '6x9', '5.06x7.81', '6.14x9.21', '6.69x9.61', '7x10', '7.44x9.69', '7.5x9.25', '8x10', '8.5x11', '8.27x11.69', '8.25x6', '8.25x8.25', '8.5x8.5'))
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
create index if not exists books_created_at_idx on public.books(created_at);
