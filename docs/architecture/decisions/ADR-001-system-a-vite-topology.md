# ADR-001 — System A Vite Application Topology

- Status: Accepted by product owner
- Decision date: 2026-11-07
- Scope: First System A implementation increment
- Repository: `anshuljindalsecondbrain-art/pulse`
- Integration branch: `feat/system-a-foundation-slice`

## Context

The repository contains two divergent application tracks: a React 18/Vite System A prototype under `apps/student-tracking` and a separate Next.js 15/React 19 V10 platform application. Their histories and data models are not safely mergeable as complete branches. The current `main` branch is the governance and specification baseline.

The System A prototype contains useful UI and pure TypeScript domain logic, but its primary UI uses browser-local demo data. Its Supabase adapter is not a production authorization or transaction boundary. The V10 and System A proposed migrations also contain competing tenant/person/student identity models.

## Decision

1. Use a **single Vite application** for the first System A release.
2. Retain `apps/student-tracking` as the intended application location and port its UI/domain assets selectively from the historical feature branch.
3. Keep the shared PULSE platform contracts as framework-independent packages.
4. Keep System A domain behavior in a separate framework-independent package where it can be tested without React or Supabase.
5. Do not merge the Next.js application shell or introduce a second competing root application.
6. Do not wire browser-side persistence to sensitive tables. The future integration must use trusted server/database command and query boundaries, server-derived identity, tenant authorization and tested RLS.
7. Keep System A independent of QBMS and DTE completeness. External question references remain optional.
8. Reconcile V10 and System A identity, tenant, role, enrollment and event schemas before any database migration is generated.

## First implementation slice

The first slice is the persistence-independent System A evidence contract package at `packages/system-a-domain`. It contains immutable work-evidence and verification-decision types, deterministic input validation and unit tests. It does not implement authentication, authorization, database writes, migrations, UI or production workflows.

## Branch strategy

Create task-specific branches from the current `main` governance baseline. Do not merge, rebase, delete or retarget historical implementation branches as part of this increment. Preserve them as source references until their unique commits and dependencies are dispositioned.

## Consequences

- No Next.js/Vite dual-shell ambiguity for the first System A release.
- Existing System A UI can be ported incrementally without importing the entire divergent branch history.
- Shared platform identity and database decisions remain a prerequisite for production persistence.
- A separate domain package adds a small package boundary and must be integrated into the Vite app through an explicit workspace/package strategy in a later increment.

## Not authorized by this decision

- Production or preview deployment changes.
- Supabase schema changes, migration execution, grants, RLS or function changes.
- Branch merge, rebase, deletion or historical PR closure.
- Real student data or production data backfills.
