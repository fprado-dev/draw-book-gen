create table if not exists pages (
  id uuid default uuid_generate_v4() primary key,
  book_id uuid references books(id) on delete cascade not null,
  sequence_number integer not null,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists pages_book_id_idx on pages(book_id);
create index if not exists pages_sequence_number_idx on pages(sequence_number);

alter table pages enable row level security;

create policy "Users can view their own pages."
  on pages for select
  using (
    book_id in (
      select id from books
      where user_id = auth.uid()
    )
  );

create policy "Users can create pages for their own books."
  on pages for insert
  with check (
    book_id in (
      select id from books
      where user_id = auth.uid()
    )
  );

create policy "Users can update their own pages."
  on pages for update
  using (
    book_id in (
      select id from books
      where user_id = auth.uid()
    )
  );

create policy "Users can delete their own pages."
  on pages for delete
  using (
    book_id in (
      select id from books
      where user_id = auth.uid()
    )
  );