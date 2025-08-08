
-- Base table
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  type text not null check (type in ('ebook','business_plan','coloring_book')),
  content text,
  created_at timestamp with time zone default now()
);
create index if not exists projects_user_id_idx on projects(user_id);
