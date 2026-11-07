-- PULSE System A: minimum authenticated self-read policies
-- Status: PROPOSED / NOT APPLIED.
-- Scope: current user may read their own active membership, own student identity,
-- and obligations belonging to that identity. No teacher/admin/parent access,
-- writes, reporting RPCs, or cross-student access are granted here.
-- Prerequisite: 20261106000100_system_a_initial_schema.sql
begin;
grant select on table public.sa_institute_memberships to authenticated;
drop policy if exists sa_memberships_select_self on public.sa_institute_memberships;
create policy sa_memberships_select_self on public.sa_institute_memberships
for select to authenticated
using (user_id = (select auth.uid()) and is_active = true);

grant select on table public.sa_students to authenticated;
drop policy if exists sa_students_select_self on public.sa_students;
create policy sa_students_select_self on public.sa_students
for select to authenticated
using (
  auth_user_id = (select auth.uid())
  and is_active = true
  and exists (
    select 1 from public.sa_institute_memberships m
    where m.institute_id = sa_students.institute_id
      and m.user_id = (select auth.uid())
      and m.role_key = 'STUDENT'
      and m.is_active = true
  )
);

grant select on table public.sa_student_obligations to authenticated;
drop policy if exists sa_obligations_select_self on public.sa_student_obligations;
create policy sa_obligations_select_self on public.sa_student_obligations
for select to authenticated
using (
  eligibility_status = 'ELIGIBLE'
  and exists (
    select 1 from public.sa_students s
    where s.id = sa_student_obligations.student_id
      and s.institute_id = sa_student_obligations.institute_id
      and s.auth_user_id = (select auth.uid())
      and s.is_active = true
  )
);
commit;
