-- PULSE V10 academic core.
-- Additive migration only. No existing academic data is rewritten.

create table if not exists public.batches (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id),
  name text not null,
  stream text not null check (stream in ('JEE', 'NEET')),
  class_level text not null check (class_level in ('XI', 'XII')),
  starts_on date,
  ends_on date,
  created_at timestamptz not null default now(),
  unique (tenant_id, name)
);

create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id),
  student_id uuid not null references public.students(id),
  batch_id uuid not null references public.batches(id),
  valid_from timestamptz not null,
  valid_to timestamptz,
  status text not null default 'ACTIVE' check (status in ('ACTIVE','TRANSFERRED','WITHDRAWN','COMPLETED')),
  created_at timestamptz not null default now(),
  check (valid_to is null or valid_to > valid_from)
);

create index if not exists idx_enrollments_student_time
  on public.enrollments(student_id, valid_from desc);
create index if not exists idx_enrollments_tenant_batch
  on public.enrollments(tenant_id, batch_id);

create table if not exists public.person_auth_identities (
  person_id uuid primary key references public.people(id),
  auth_user_id uuid not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.tenant_roles (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id),
  person_id uuid not null references public.people(id),
  role text not null check (role in ('ADMIN','ACADEMIC_HEAD','TEACHER','MENTOR','STUDENT','PARENT','PEER','REVIEWER')),
  valid_from timestamptz not null default now(),
  valid_to timestamptz,
  created_at timestamptz not null default now(),
  check (valid_to is null or valid_to > valid_from),
  unique (tenant_id, person_id, role, valid_from)
);

create index if not exists idx_tenant_roles_auth_scope
  on public.tenant_roles(tenant_id, person_id, role);

create table if not exists public.domain_events (
  event_id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id),
  aggregate_id uuid not null,
  aggregate_type text not null,
  event_type text not null,
  event_version integer not null check (event_version > 0),
  schema_version integer not null check (schema_version > 0),
  occurred_at timestamptz not null,
  recorded_at timestamptz not null default now(),
  effective_academic_time timestamptz,
  actor_id uuid,
  actor_role text,
  correlation_id uuid not null,
  causation_id uuid,
  idempotency_key text not null,
  payload jsonb not null default '{}'::jsonb,
  unique (tenant_id, idempotency_key)
);

create index if not exists idx_domain_events_aggregate
  on public.domain_events(tenant_id, aggregate_id, occurred_at);
create index if not exists idx_domain_events_type_time
  on public.domain_events(tenant_id, event_type, occurred_at);

alter table public.tenants enable row level security;
alter table public.tenant_people enable row level security;
alter table public.students enable row level security;
alter table public.batches enable row level security;
alter table public.enrollments enable row level security;
alter table public.academic_context_epochs enable row level security;
alter table public.tenant_roles enable row level security;
alter table public.domain_events enable row level security;

create or replace function public.current_person_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select person_id from public.person_auth_identities where auth_user_id = auth.uid()
$$;

create or replace function public.is_tenant_member(target_tenant uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.tenant_people tp
    where tp.tenant_id = target_tenant
      and tp.person_id = public.current_person_id()
  )
$$;

create policy tenant_member_read on public.tenants
  for select using (public.is_tenant_member(id));
create policy tenant_member_read on public.tenant_people
  for select using (public.is_tenant_member(tenant_id));
create policy tenant_member_read on public.students
  for select using (
    exists (
      select 1 from public.tenant_people tp
      where tp.id = tenant_person_id
        and public.is_tenant_member(tp.tenant_id)
    )
  );
create policy tenant_member_read on public.batches
  for select using (public.is_tenant_member(tenant_id));
create policy tenant_member_read on public.enrollments
  for select using (public.is_tenant_member(tenant_id));
create policy tenant_member_read on public.academic_context_epochs
  for select using (public.is_tenant_member(tenant_id));
create policy tenant_member_read on public.tenant_roles
  for select using (public.is_tenant_member(tenant_id));
create policy tenant_member_read on public.domain_events
  for select using (public.is_tenant_member(tenant_id));

-- Writes are intentionally absent here. Commands/RPCs will own academic mutations.
