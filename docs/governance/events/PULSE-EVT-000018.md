# PULSE-EVT-000018 — Canonical platform and System A architecture reconciliation

- Event ID: PULSE-EVT-000018
- Category: Architecture decision / audit finding
- Date: 2026-11-06
- Status: Recorded; implementation and production authorization not granted
- Affected domains: Shared platform, Student Work Tracking / System A, Supabase, Vercel, repository governance

## Source and context

Follow-up to the finalized PULSE System A design sequence PULSE-DATA-CORE-001 through PULSE-DATA-CORE-008 and the live Supabase/Vercel/GitHub audit performed on 2026-11-06.

## Decision baseline

1. One canonical shared identity/tenant/academic core is required. System A's proposed institute, membership, student and batch duplication must be reconciled with the V10 platform proposal; do not keep both as parallel canonical systems.
2. Shared platform owns tenant, person, Auth identity mapping, membership, role grants, centre, student, batch, enrollment and academic context.
3. System A owns operational exercise, assignment, obligation, attempt, evidence, verification/evaluation, correction and doubt workflows.
4. Student Tracking remains usable without QBMS question identity/version or DTE classification references.
5. Question identity, question version and placement/slot remain separate concepts.
6. Student report, teacher observation, completion verification and answer correctness remain distinct facts.
7. Evidence and decision history are append-only. Corrections create linked new events.
8. Authorization is deny-by-default and checks trusted identity, active tenant membership, explicit action grants and centre/batch/student/resource scope.
9. Assignment publication and evidence submissions require atomic transactional boundaries and database-enforced idempotency.
10. Neither existing V10 nor System A initial migration may be applied unchanged or simply concatenated.
11. DTE remains configurable classification-management software; it does not own curriculum/chapter design.
12. The website remains a demo prototype until the approved database and service layer are integrated and tested.

## Evidence

- PULSE-DATA-CORE-001 through 008 in the System A feature branch.
- Supabase PULSE live inspection: active project in ap-south-1, PostgreSQL 17.11; no application tables, no migration history, no Edge Functions at audit time.
- Proposed System A migration remains unapplied and fail-closed (forced RLS, no policies, no anon/authenticated grants).
- System A App.tsx uses browser localStorage; the Supabase repository adapter is not integrated into the main UI.
- Vercel feature-branch Preview was READY; protected by Vercel Authentication and not evidence of production database connectivity.
- GitHub PR #2 remains open and draft.

## Impact and risk

- Blocks enabling real student data until canonical schema, RLS, trusted commands and cross-tenant tests are complete.
- Avoids duplicate identities, cross-tenant relationships and unauthorized learner-data disclosure.
- Preserves the existing local demo and domain modules while a trusted persistence boundary is implemented.
- No database or production deployment mutation is authorized by this event.

## Acceptance criteria

- A unified physical ERD and data dictionary is approved.
- Every table has explicit tenant key, FK integrity, RLS/grant contract and command boundary.
- Cross-tenant and privilege-escalation tests pass in an isolated database.
- Publication/evidence transaction and concurrency/idempotency tests pass.
- UI is integrated through the approved service boundary without silently uploading demo data.
- Exact PR head CI and Vercel Preview are validated; browser/accessibility checks pass.
- Explicit owner approval exists before live migration or production deployment.

## Follow-up

PULSE-DATA-CORE-009: canonical physical ERD and table/column data dictionary. Then isolated migration replay and authorization test implementation after approval.
