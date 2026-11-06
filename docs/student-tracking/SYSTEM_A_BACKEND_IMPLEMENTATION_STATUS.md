# System A — Backend implementation status

**As of:** 2026-11-06  
**Branch:** `feat/system-a-abhyas-foundation`  
**Supabase project:** PULSE (`nnvssbfezkliavwxhgbh`)  
**Release status:** NOT PRODUCTION READY

## Verified live database state

The connected Supabase project was inspected before implementation:

- `public` contains no application tables.
- Supabase migration history is empty.
- Security advisor returned no current lints because no application schema has been deployed.
- The repository contains a proposed System A initial schema migration, but it has not been applied.
- The proposed migration enables and forces RLS, then revokes direct table access from `anon` and `authenticated`. It intentionally creates no access policies. This is fail-closed, but it also means application reads/writes are not yet enabled.

## Code committed in this increment

- `apps/student-tracking/src/lib/system-a-repository.ts`
  - Resolves the authenticated Supabase user.
  - Lists the user's active institute memberships.
  - Resolves a learner identity from the authenticated user and institute.
  - Lists only that learner's eligible obligations.
  - Appends a learner self-report as a new evidence event; it never updates a previous event.
  - Uses explicit institute/student/obligation filters as defense in depth.

## Mandatory blockers before enabling live writes

1. Complete the authorization design for institute, centre, batch and academic assignment scope.
2. Add database-side actor-role validation. The current baseline has a client-supplied `source_actor_role`; it must not be trusted for authorization or audit truth.
3. Add tested RLS policies and minimum required grants for each table and operation. Do not use broad `USING (true)` policies.
4. Add an idempotent server-side publication transaction that resolves assignment targets into immutable student obligations.
5. Complete missing workflow tables and constraints for disputes, appeals, recognition, parent/mentor links and notification delivery before claiming full System A scope.
6. Resolve policy for shared global subjects versus institute-owned subjects, and enforce same-tenant subject/chapter/slot relationships with composite foreign keys.
7. Add database integration tests for cross-tenant denial, role scope, append-only evidence, idempotency, publication retry and parent-link revocation.
8. Run typecheck, unit tests, production build, browser tests and Supabase security/performance advisors against the actual candidate schema.

## Academic state vocabulary

The current application and master specification use six classroom input states:

- U — Unattempted
- C — Correct
- I — Incorrect
- D — Doubt
- S — Skipped
- P — Partially Correct

These are an interaction vocabulary, not the canonical academic state model. The database keeps work progress, answer outcome, doubt, verification, correction and eligibility as separate dimensions. Do not replace the six current UI states with an older five-state vocabulary without an explicit academic-owner decision.

Teacher observation is a separate evidence event and actor source; it must not be represented as a student self-report status.

## Deployment and data safety

- Do not enter real student data into the local demo.
- Do not apply the proposed migration to production until the authorization design, academic decisions and database tests are approved.
- Do not expose a Supabase secret/service-role key in browser code.
- Do not mark System A production-ready merely because a frontend preview builds.
