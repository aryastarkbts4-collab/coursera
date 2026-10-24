-- Already applied to your Supabase project by Claude. Kept here for reference.
create table public.studypilot_data (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.studypilot_data enable row level security;
create policy "own row select" on public.studypilot_data for select to authenticated using ((select auth.uid()) = user_id);
create policy "own row insert" on public.studypilot_data for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "own row update" on public.studypilot_data for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "own row delete" on public.studypilot_data for delete to authenticated using ((select auth.uid()) = user_id);
