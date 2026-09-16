-- PULSE foundation migration.
-- This migration intentionally establishes only the architectural boundary.
-- Production RLS policies and application-specific constraints must be added
-- before tenant data is exposed.

create extension if not exists pgcrypto;

create table if not exists public.tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.people (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now()
);

create table if not exists public.tenant_people (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id),
  person_id uuid not null references public.people(id),
  created_at timestamptz not null default now(),
  unique (tenant_id, person_id)
);

create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  tenant_person_id uuid not null references public.tenant_people(id),
  created_at timestamptz not null default now()
);

create table if not exists public.academic_context_epochs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id),
  student_id uuid not null references public.students(id),
  batch_id uuid,
  stream text not null check (stream in ('JEE', 'NEET')),
  class_level text not null check (class_level in ('XI', 'XII')),
  valid_from timestamptz not null,
  valid_to timestamptz,
  reason text,
  created_at timestamptz not null default now(),
  check (valid_to is null or valid_to > valid_from)
);

create index if not exists idx_context_student_valid_from
  on public.academic_context_epochs(student_id, valid_from desc);

create index if not exists idx_context_tenant
  on public.academic_context_epochs(tenant_id);
