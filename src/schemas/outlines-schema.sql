-- Create enum for chapter status
create type chapter_status as enum ('draft', 'in_progress', 'review', 'complete');

-- Create outlines table
create table if not exists public.outlines (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    user_id uuid references auth.users(id) not null,
    chapters jsonb not null, -- Store chapters as JSONB array of objects with title and description
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    constraint chapters_structure check (jsonb_typeof(chapters) = 'array')
);

-- Enable RLS
alter table public.outlines enable row level security;

-- Create policies
create policy "Users can create their own outlines"
    on public.outlines for insert
    with check (auth.uid() = user_id);

create policy "Users can view their own outlines"
    on public.outlines for select
    using (auth.uid() = user_id);

create policy "Users can update their own outlines"
    on public.outlines for update
    using (auth.uid() = user_id);

create policy "Users can delete their own outlines"
    on public.outlines for delete
    using (auth.uid() = user_id);

-- Create updated_at trigger
create trigger handle_updated_at before update
    on public.outlines
    for each row
    execute procedure moddatetime();