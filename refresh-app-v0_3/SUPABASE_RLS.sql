
-- Enable RLS and add policies
alter table projects enable row level security;

-- Owners can select/insert/delete their own rows
create policy "read own projects" on projects
for select using (auth.uid() = user_id);

create policy "insert own projects" on projects
for insert with check (auth.uid() = user_id);

create policy "delete own projects" on projects
for delete using (auth.uid() = user_id);
