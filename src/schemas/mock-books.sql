-- Insert mock books for project 1
INSERT INTO public.books (id, project_id, user_id, status, pages, title, size, thumbnail_url, last_viewed)
VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '550e8400-e29b-41d4-a716-446655440000', '417899c9-71a3-4d69-845f-671d17079513', 'published', '[]'::jsonb, 'The Art of Digital Drawing', '6x9', 'https://example.com/thumb1.jpg', now()),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', '550e8400-e29b-41d4-a716-446655440000', '417899c9-71a3-4d69-845f-671d17079513', 'draft', '[]'::jsonb, 'Sketching Fundamentals', '8.5x11', 'https://example.com/thumb2.jpg', now()),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', '550e8400-e29b-41d4-a716-446655440000', '417899c9-71a3-4d69-845f-671d17079513', 'published', '[]'::jsonb, 'Creative Illustration Guide', '7x10', 'https://example.com/thumb3.jpg', now());

-- Insert mock books for project 2
INSERT INTO public.books (id, project_id, user_id, status, pages, title, size, thumbnail_url, last_viewed)
VALUES
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', '6ba7b810-9dad-11d1-80b4-00c04fd430c8', '417899c9-71a3-4d69-845f-671d17079513', 'published', '[]'::jsonb, 'Digital Art Mastery', '8x10', 'https://example.com/thumb4.jpg', now()),
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', '6ba7b810-9dad-11d1-80b4-00c04fd430c8', '417899c9-71a3-4d69-845f-671d17079513', 'draft', '[]'::jsonb, 'Character Design Workshop', '5.5x8.5', 'https://example.com/thumb5.jpg', now()),
  ('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', '6ba7b810-9dad-11d1-80b4-00c04fd430c8', '417899c9-71a3-4d69-845f-671d17079513', 'archived', '[]'::jsonb, 'Advanced Drawing Techniques', '6x9', 'https://example.com/thumb6.jpg', now());