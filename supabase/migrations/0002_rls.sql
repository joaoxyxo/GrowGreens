-- Row Level Security: cada utilizador só acede aos seus dados.
-- Boa prática: (select auth.uid()) é cacheado pelo planeador (initPlan).

alter table gardens enable row level security;
alter table plantings enable row level security;
alter table journal_entries enable row level security;
alter table reminders enable row level security;
alter table user_progress enable row level security;

-- Macro de políticas CRUD por user_id
do $$
declare t text;
begin
  foreach t in array array['gardens','plantings','journal_entries','reminders'] loop
    execute format($f$
      create policy "select_own_%1$s" on %1$s for select to authenticated
        using ((select auth.uid()) = user_id);
      create policy "insert_own_%1$s" on %1$s for insert to authenticated
        with check ((select auth.uid()) = user_id);
      create policy "update_own_%1$s" on %1$s for update to authenticated
        using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
      create policy "delete_own_%1$s" on %1$s for delete to authenticated
        using ((select auth.uid()) = user_id);
    $f$, t);
  end loop;
end $$;

create policy "select_own_progress" on user_progress for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "upsert_own_progress" on user_progress for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "update_own_progress" on user_progress for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

-- Storage para fotos do diário (bucket privado, por utilizador)
insert into storage.buckets (id, name, public) values ('journal-photos', 'journal-photos', false)
  on conflict (id) do nothing;

create policy "user_manages_own_photos" on storage.objects for all to authenticated
  using (bucket_id = 'journal-photos' and (storage.foldername(name))[1] = (select auth.uid())::text)
  with check (bucket_id = 'journal-photos' and (storage.foldername(name))[1] = (select auth.uid())::text);
