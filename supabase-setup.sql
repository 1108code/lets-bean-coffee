-- Let's Bean Coffee CMS setup for Supabase.
-- Run this once in Supabase SQL Editor.

create table if not exists public.site_content (
  id text primary key,
  content jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

drop policy if exists "Public can read published site content" on public.site_content;
create policy "Public can read published site content"
on public.site_content
for select
to anon
using (true);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'cms-uploads',
  'cms-uploads',
  true,
  3145728,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can view CMS uploads" on storage.objects;
create policy "Public can view CMS uploads"
on storage.objects
for select
to anon
using (bucket_id = 'cms-uploads');
