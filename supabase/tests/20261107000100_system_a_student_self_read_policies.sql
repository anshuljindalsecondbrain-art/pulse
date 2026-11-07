-- Static post-migration checks. Run only after reviewed migrations on a test DB.
do $$
declare
  required_tables text[] := array['sa_institute_memberships','sa_students','sa_student_obligations'];
  t text;
  expected_policy text;
begin
  foreach t in array required_tables loop
    if not exists (
      select 1 from pg_class c join pg_namespace n on n.oid=c.relnamespace
      where n.nspname='public' and c.relname=t and c.relrowsecurity and c.relforcerowsecurity
    ) then raise exception 'RLS or FORCE RLS missing on public.%', t; end if;
    expected_policy := case t
      when 'sa_institute_memberships' then 'sa_memberships_select_self'
      when 'sa_students' then 'sa_students_select_self'
      else 'sa_obligations_select_self' end;
    if not exists (
      select 1 from pg_policies p
      where p.schemaname='public' and p.tablename=t and p.policyname=expected_policy
    ) then raise exception 'Expected self-read policy missing on public.%', t; end if;
  end loop;
end $$;
