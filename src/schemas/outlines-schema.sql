-- Create outlines table
CREATE TABLE IF NOT EXISTS outlines (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  info jsonb not null,
  outlines jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint info_structure check (
    jsonb_typeof(info) = 'object'
    and jsonb_typeof(info->'prompt') = 'string'
    and jsonb_typeof(info->'keywords') = 'array'
  ),
  constraint outlines_structure check (
    jsonb_typeof(outlines) = 'array'
    and jsonb_array_length(outlines) > 0
  )
);

-- Create trigger function to validate outlines structure
CREATE OR REPLACE FUNCTION validate_outlines_structure()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT (SELECT bool_and(
    jsonb_typeof(item->'description') = 'string'
    AND jsonb_typeof(item->'keywords') = 'array'
  ) FROM jsonb_array_elements(NEW.outlines) AS item) THEN
    RAISE EXCEPTION 'Invalid outlines structure';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER validate_outlines_structure_trigger
  BEFORE INSERT OR UPDATE ON outlines
  FOR EACH ROW
  EXECUTE FUNCTION validate_outlines_structure();

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

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_outlines_user_id ON outlines(user_id);