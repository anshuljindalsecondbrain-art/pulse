# PULSE-EVT-000006 — Add proposed System A database baseline

- Category: Database architecture / migration
- Module: System A
- Created: 2026-11-06
- Status: PROPOSED_NOT_APPLIED
- Origin: System A Master Completion Specification and Database Governance rules.
- Branch: feat/system-a-abhyas-foundation
- PR: https://github.com/anshuljindalsecondbrain-art/pulse/pull/2

## Change
- Added `supabase/migrations/20261106000100_system_a_initial_schema.sql`.
- Added `docs/database/SYSTEM_A_DATABASE_BASELINE.md`.
- Proposed schema covers institute/centre tenancy, membership, student/parent links, subjects/chapters, batches, exercise versions and slots, assignments/targets, obligations, attempt cycles, evidence events, verification decisions, correction cycles, doubt cases, audit events and metric policy versions.
- Tenant composite foreign keys and tenant-oriented indexes are included.
- RLS is enabled and forced; no policies or client grants are included, so access remains fail-closed until reviewed authorization is implemented.
- Append-only update/delete guards are added for evidence, verification and audit records.

## Validation and safety
- This is source-controlled SQL only; it has NOT been executed.
- Supabase connector returned no connected projects; no live schema inspection or migration application was possible.
- The migration must be reviewed against actual project state before any execution.
- Follow-up review is required for subject/chapter tenancy constraints, immutable published versions, membership semantics, role policies and secure transactional publication RPC.

## Follow-up
Connect the intended non-production Supabase project, inspect the as-built schema and migration history, resolve review items, then validate this migration in staging with RLS, idempotency and rollback tests.
