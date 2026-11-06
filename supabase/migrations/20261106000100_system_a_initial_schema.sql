-- PULSE System A initial schema baseline
-- Status: PROPOSED / NOT APPLIED.
-- Prerequisite: inspect target Supabase schema, auth model, extensions and migration history.
-- This migration is additive and tenant-scoped. Review against the live project before execution.

begin;

create extension if not exists pgcrypto;

create schema if not exists app_private;
revoke all on schema app_private from public, anon, authenticated;

create type public.sa_membership_status as enum ('ACTIVE','INACTIVE');
create type public.sa_exercise_status as enum ('DRAFT','PUBLISHED','ARCHIVED');
create type public.sa_assignment_status as enum ('DRAFT','IN_REVIEW','APPROVED','SCHEDULED','PUBLISHED','CANCELLED','ARCHIVED');
create type public.sa_work_status as enum ('NOT_STARTED','ATTEMPTED','SUBMITTED','COMPLETED','SKIPPED');
create type public.sa_answer_outcome as enum ('NOT_EVALUATED','CORRECT','INCORRECT','PARTIALLY_CORRECT','NOT_APPLICABLE');
create type public.sa_doubt_status as enum ('OPEN','ASSIGNED','IN_PROGRESS','RESOLVED','STUDENT_CONFIRMED','REOPENED','CLOSED');
create type public.sa_verification_outcome as enum ('CONFIRMED','RETURNED','REJECTED');
create type public.sa_correction_status as enum ('REQUIRED','IN_PROGRESS','RESUBMITTED','ACCEPTED','CLOSED','REJECTED');

create table public.sa_institutes (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) between 1 and 200),
  timezone text not null default 'Asia/Kolkata',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.sa_centres (
  id uuid primary key default gen_random_uuid(),
  institute_id uuid not null references public.sa_institutes(id) on delete restrict,
  name text not null check (length(trim(name)) between 1 and 200),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (institute_id,id),
  unique (institute_id,name)
);

create table public.sa_institute_memberships (
  id uuid primary key default gen_random_uuid(),
  institute_id uuid not null references public.sa_institutes(id) on delete restrict,
  user_id uuid not null references auth.users(id) on delete restrict,
  role_key text not null check (role_key in ('STUDENT','PARENT','TEACHER','ACADEMIC_REVIEWER','MENTOR','CONTENT_ADMIN','INSTITUTE_ADMIN')),
  centre_id uuid,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (institute_id,user_id,role_key,centre_id),
  foreign key (institute_id,centre_id) references public.sa_centres(institute_id,id) on delete restrict
);

create table public.sa_students (
  id uuid primary key default gen_random_uuid(),
  institute_id uuid not null references public.sa_institutes(id) on delete restrict,
  auth_user_id uuid references auth.users(id) on delete restrict,
  institute_student_code text not null,
  full_name text not null check (length(trim(full_name)) between 1 and 200),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (institute_id,id),
  unique (institute_id,institute_student_code),
  unique (institute_id,auth_user_id)
);

create table public.sa_parent_student_links (
  id uuid primary key default gen_random_uuid(),
  institute_id uuid not null references public.sa_institutes(id) on delete restrict,
  parent_user_id uuid not null references auth.users(id) on delete restrict,
  student_id uuid not null,
  relationship_label text,
  valid_from timestamptz not null default now(),
  valid_until timestamptz,
  created_at timestamptz not null default now(),
  check (valid_until is null or valid_until > valid_from),
  foreign key (institute_id,student_id) references public.sa_students(institute_id,id) on delete restrict
);

create table public.sa_subjects (
  id uuid primary key default gen_random_uuid(),
  institute_id uuid references public.sa_institutes(id) on delete restrict,
  code text not null,
  name text not null,
  is_active boolean not null default true,
  unique (institute_id,code)
);

create table public.sa_chapters (
  id uuid primary key default gen_random_uuid(),
  institute_id uuid not null references public.sa_institutes(id) on delete restrict,
  subject_id uuid not null references public.sa_subjects(id) on delete restrict,
  code text,
  name text not null,
  is_active boolean not null default true,
  unique (institute_id,id)
);

create table public.sa_batches (
  id uuid primary key default gen_random_uuid(),
  institute_id uuid not null references public.sa_institutes(id) on delete restrict,
  centre_id uuid,
  name text not null,
  academic_year text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (institute_id,id),
  foreign key (institute_id,centre_id) references public.sa_centres(institute_id,id) on delete restrict
);

create table public.sa_batch_memberships (
  id uuid primary key default gen_random_uuid(),
  institute_id uuid not null,
  batch_id uuid not null,
  student_id uuid not null,
  valid_from timestamptz not null default now(),
  valid_until timestamptz,
  status public.sa_membership_status not null default 'ACTIVE',
  created_at timestamptz not null default now(),
  check (valid_until is null or valid_until > valid_from),
  foreign key (institute_id,batch_id) references public.sa_batches(institute_id,id) on delete restrict,
  foreign key (institute_id,student_id) references public.sa_students(institute_id,id) on delete restrict
);
create unique index sa_batch_memberships_one_current on public.sa_batch_memberships(institute_id,student_id) where valid_until is null and status='ACTIVE';

create table public.sa_exercises (
  id uuid primary key default gen_random_uuid(),
  institute_id uuid not null references public.sa_institutes(id) on delete restrict,
  created_by uuid not null references auth.users(id) on delete restrict,
  status public.sa_exercise_status not null default 'DRAFT',
  current_version integer not null default 1 check (current_version > 0),
  created_at timestamptz not null default now(),
  unique (institute_id,id)
);

create table public.sa_exercise_versions (
  id uuid primary key default gen_random_uuid(),
  institute_id uuid not null,
  exercise_id uuid not null,
  version_no integer not null check (version_no > 0),
  title text not null check (length(trim(title)) between 1 and 240),
  subject_id uuid not null references public.sa_subjects(id) on delete restrict,
  instructions text,
  question_count integer not null check (question_count between 1 and 5000),
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  published_at timestamptz,
  unique (institute_id,id),
  unique (institute_id,exercise_id,version_no),
  foreign key (institute_id,exercise_id) references public.sa_exercises(institute_id,id) on delete restrict
);

create table public.sa_exercise_slots (
  id uuid primary key default gen_random_uuid(),
  institute_id uuid not null,
  exercise_version_id uuid not null,
  slot_no integer not null check (slot_no > 0),
  chapter_id uuid references public.sa_chapters(id) on delete restrict,
  question_type text,
  max_marks numeric(10,3) check (max_marks is null or max_marks >= 0),
  positive_marks numeric(10,3),
  negative_marks numeric(10,3),
  qbms_question_id uuid,
  qbms_question_version_id uuid,
  created_at timestamptz not null default now(),
  unique (institute_id,id),
  unique (exercise_version_id,slot_no),
  foreign key (institute_id,exercise_version_id) references public.sa_exercise_versions(institute_id,id) on delete restrict
);

create table public.sa_assignments (
  id uuid primary key default gen_random_uuid(),
  institute_id uuid not null references public.sa_institutes(id) on delete restrict,
  created_by uuid not null references auth.users(id) on delete restrict,
  current_version integer not null default 1 check (current_version > 0),
  status public.sa_assignment_status not null default 'DRAFT',
  created_at timestamptz not null default now(),
  unique (institute_id,id)
);

create table public.sa_assignment_versions (
  id uuid primary key default gen_random_uuid(),
  institute_id uuid not null,
  assignment_id uuid not null,
  version_no integer not null check (version_no > 0),
  title text not null,
  instructions text,
  release_at timestamptz,
  due_at timestamptz,
  timezone text not null,
  created_by uuid not null references auth.users(id) on delete restrict,
  approved_by uuid references auth.users(id) on delete restrict,
  approved_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  unique (institute_id,id),
  unique (institute_id,assignment_id,version_no),
  foreign key (institute_id,assignment_id) references public.sa_assignments(institute_id,id) on delete restrict,
  check (due_at is null or release_at is null or due_at >= release_at),
  check (approved_by is null or approved_by <> created_by)
);

create table public.sa_assignment_items (
  id uuid primary key default gen_random_uuid(),
  institute_id uuid not null,
  assignment_version_id uuid not null,
  exercise_version_id uuid not null,
  item_order integer not null check (item_order > 0),
  created_at timestamptz not null default now(),
  unique (assignment_version_id,item_order),
  foreign key (institute_id,assignment_version_id) references public.sa_assignment_versions(institute_id,id) on delete restrict,
  foreign key (institute_id,exercise_version_id) references public.sa_exercise_versions(institute_id,id) on delete restrict
);

create table public.sa_assignment_targets (
  id uuid primary key default gen_random_uuid(),
  institute_id uuid not null,
  assignment_version_id uuid not null,
  batch_id uuid,
  student_id uuid,
  target_kind text not null check (target_kind in ('BATCH','STUDENT')),
  created_at timestamptz not null default now(),
  check ((target_kind='BATCH' and batch_id is not null and student_id is null) or
         (target_kind='STUDENT' and student_id is not null and batch_id is null)),
  foreign key (institute_id,assignment_version_id) references public.sa_assignment_versions(institute_id,id) on delete restrict,
  foreign key (institute_id,batch_id) references public.sa_batches(institute_id,id) on delete restrict,
  foreign key (institute_id,student_id) references public.sa_students(institute_id,id) on delete restrict
);

create table public.sa_student_obligations (
  id uuid primary key default gen_random_uuid(),
  institute_id uuid not null,
  assignment_version_id uuid not null,
  assignment_item_id uuid not null references public.sa_assignment_items(id) on delete restrict,
  exercise_slot_id uuid not null,
  student_id uuid not null,
  source_batch_id uuid,
  eligibility_status text not null default 'ELIGIBLE' check (eligibility_status in ('ELIGIBLE','EXEMPTED','REMOVED')),
  created_at timestamptz not null default now(),
  unique (assignment_item_id,exercise_slot_id,student_id),
  unique (institute_id,id),
  foreign key (institute_id,assignment_version_id) references public.sa_assignment_versions(institute_id,id) on delete restrict,
  foreign key (institute_id,exercise_slot_id) references public.sa_exercise_slots(institute_id,id) on delete restrict,
  foreign key (institute_id,student_id) references public.sa_students(institute_id,id) on delete restrict,
  foreign key (institute_id,source_batch_id) references public.sa_batches(institute_id,id) on delete restrict
);

create table public.sa_attempt_cycles (
  id uuid primary key default gen_random_uuid(),
  institute_id uuid not null,
  obligation_id uuid not null,
  cycle_no integer not null check (cycle_no > 0),
  cycle_kind text not null check (cycle_kind in ('INITIAL','PRACTICE','REVISION')),
  started_at timestamptz not null default now(),
  created_by uuid not null references auth.users(id) on delete restrict,
  unique (obligation_id,cycle_no),
  unique (institute_id,id),
  foreign key (institute_id,obligation_id) references public.sa_student_obligations(institute_id,id) on delete restrict
);

create table public.sa_evidence_events (
  id uuid primary key default gen_random_uuid(),
  institute_id uuid not null,
  obligation_id uuid not null,
  attempt_cycle_id uuid,
  event_type text not null check (event_type in ('STUDENT_REPORT','TEACHER_OBSERVATION','SYSTEM_IMPORT')),
  work_status public.sa_work_status,
  answer_outcome public.sa_answer_outcome,
  source_actor_id uuid not null references auth.users(id) on delete restrict,
  source_actor_role text not null,
  occurred_at_client timestamptz,
  recorded_at_server timestamptz not null default now(),
  server_sequence bigint generated always as identity,
  idempotency_key uuid not null,
  payload jsonb not null default '{}'::jsonb,
  causation_event_id uuid references public.sa_evidence_events(id) on delete restrict,
  created_at timestamptz not null default now(),
  unique (institute_id,id),
  unique (institute_id,source_actor_id,idempotency_key),
  foreign key (institute_id,obligation_id) references public.sa_student_obligations(institute_id,id) on delete restrict,
  foreign key (institute_id,attempt_cycle_id) references public.sa_attempt_cycles(institute_id,id) on delete restrict
);

create table public.sa_verification_decisions (
  id uuid primary key default gen_random_uuid(),
  institute_id uuid not null,
  evidence_event_id uuid not null,
  purpose text not null check (purpose in ('ATTEMPT','COMPLETION','ANSWER_EVALUATION','CORRECTION','INDEPENDENT_SOLVE')),
  outcome public.sa_verification_outcome not null,
  reason text,
  decided_by uuid not null references auth.users(id) on delete restrict,
  decided_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (institute_id,id),
  foreign key (institute_id,evidence_event_id) references public.sa_evidence_events(institute_id,id) on delete restrict
);

create table public.sa_correction_cycles (
  id uuid primary key default gen_random_uuid(),
  institute_id uuid not null,
  obligation_id uuid not null,
  source_decision_id uuid not null,
  status public.sa_correction_status not null default 'REQUIRED',
  opened_by uuid not null references auth.users(id) on delete restrict,
  opened_at timestamptz not null default now(),
  closed_at timestamptz,
  unique (institute_id,id),
  foreign key (institute_id,obligation_id) references public.sa_student_obligations(institute_id,id) on delete restrict,
  foreign key (institute_id,source_decision_id) references public.sa_verification_decisions(institute_id,id) on delete restrict
);

create table public.sa_doubt_cases (
  id uuid primary key default gen_random_uuid(),
  institute_id uuid not null,
  obligation_id uuid not null,
  opened_by uuid not null references auth.users(id) on delete restrict,
  assigned_to uuid references auth.users(id) on delete restrict,
  status public.sa_doubt_status not null default 'OPEN',
  priority smallint not null default 3 check (priority between 1 and 5),
  created_at timestamptz not null default now(),
  resolved_at timestamptz,
  unique (institute_id,id),
  foreign key (institute_id,obligation_id) references public.sa_student_obligations(institute_id,id) on delete restrict
);

create table public.sa_doubt_events (
  id uuid primary key default gen_random_uuid(),
  institute_id uuid not null,
  doubt_case_id uuid not null,
  event_type text not null,
  actor_id uuid not null references auth.users(id) on delete restrict,
  body text,
  created_at timestamptz not null default now(),
  foreign key (institute_id,doubt_case_id) references public.sa_doubt_cases(institute_id,id) on delete restrict
);

create table public.sa_audit_events (
  id uuid primary key default gen_random_uuid(),
  institute_id uuid references public.sa_institutes(id) on delete restrict,
  actor_id uuid references auth.users(id) on delete restrict,
  action text not null,
  target_type text not null,
  target_id uuid,
  reason text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.sa_metric_policy_versions (
  id uuid primary key default gen_random_uuid(),
  institute_id uuid not null references public.sa_institutes(id) on delete restrict,
  version_no integer not null check (version_no > 0),
  policy jsonb not null,
  effective_from timestamptz not null,
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  unique (institute_id,version_no)
);

create index sa_centres_institute_idx on public.sa_centres(institute_id);
create index sa_students_institute_active_idx on public.sa_students(institute_id,is_active);
create index sa_batches_institute_active_idx on public.sa_batches(institute_id,is_active);
create index sa_batch_memberships_student_idx on public.sa_batch_memberships(institute_id,student_id,valid_from);
create index sa_exercise_versions_exercise_idx on public.sa_exercise_versions(institute_id,exercise_id,version_no desc);
create index sa_exercise_slots_version_idx on public.sa_exercise_slots(institute_id,exercise_version_id,slot_no);
create index sa_assignment_versions_status_idx on public.sa_assignment_versions(institute_id,published_at);
create index sa_obligations_student_idx on public.sa_student_obligations(institute_id,student_id,assignment_version_id);
create index sa_evidence_obligation_sequence_idx on public.sa_evidence_events(institute_id,obligation_id,server_sequence);
create index sa_verification_event_idx on public.sa_verification_decisions(institute_id,evidence_event_id,decided_at desc);
create index sa_doubt_queue_idx on public.sa_doubt_cases(institute_id,status,priority,created_at);

-- Enable RLS on tenant-bearing tables. No policies are created in this baseline:
-- access remains denied until reviewed tenant/role policies and secure RPCs are added.
do $$
declare r record;
begin
  for r in
    select c.relname
    from pg_class c join pg_namespace n on n.oid=c.relnamespace
    where n.nspname='public' and c.relname like 'sa_%' and c.relkind='r'
  loop
    execute format('alter table public.%I enable row level security',r.relname);
    execute format('alter table public.%I force row level security',r.relname);
    execute format('revoke all on table public.%I from anon, authenticated',r.relname);
  end loop;
end $$;

-- Immutable event source tables: ordinary update/delete is denied by trigger.
create or replace function app_private.reject_sa_event_mutation()
returns trigger language plpgsql as $$
begin
  raise exception 'System A event records are append-only';
end;
$$;

create trigger sa_evidence_events_immutable
before update or delete on public.sa_evidence_events
for each row execute function app_private.reject_sa_event_mutation();

create trigger sa_verification_decisions_immutable
before update or delete on public.sa_verification_decisions
for each row execute function app_private.reject_sa_event_mutation();

create trigger sa_audit_events_immutable
before update or delete on public.sa_audit_events
for each row execute function app_private.reject_sa_event_mutation();

commit;
