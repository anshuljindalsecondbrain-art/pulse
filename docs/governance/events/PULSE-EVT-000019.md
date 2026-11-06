# PULSE-EVT-000019 — Unified canonical physical ERD and data dictionary

- Event ID: PULSE-EVT-000019
- Date: 2026-11-06
- Category: Data architecture / schema design
- Affected domains: Shared platform, academic core, Student Work Tracking / System A, DTE/QBMS integration, Supabase
- Status: DESIGN_DRAFT_RECORDED
- Implementation authorization: Not granted
- Migration authorization: Not granted

## Context

PULSE-DATA-CORE-001 through 008 established the canonical identity model, migration reconciliation, repository dependencies, service/API contracts, authorization design and System A physical table mapping. The source migration still contained duplicate institute, membership, student, parent-link, centre, batch and audit entities; it also had incomplete tenant-qualified references and combined completion verification with answer evaluation.

## Design decisions recorded

1. Consolidate shared tenants, people, Auth identity mapping, memberships, role grants, centres, students, guardian links, batches, enrollments and academic context into one platform-owned model.
2. Keep System A ownership limited to exercises/versions/slots, assignments/versions/items/targets, lifecycle history, obligations, attempts, evidence, completion decisions, answer evaluations, correction/doubt workflows, resource assignments and metric policies.
3. Replace System A duplicate identity/organization tables with canonical shared tables.
4. Replace the source's one-current-batch-per-student rule with time-bounded enrollments; concurrent enrollment policy remains an academic decision.
5. Do not retain System A subject/chapter master tables. DTE is configurable classification-management software, not a hard-coded curriculum hierarchy. Optional external classification references remain optional.
6. Split completion verification and answer correctness into separate append-only records and authorization paths.
7. Add append-only assignment lifecycle and correction event history.
8. Require tenant-qualified composite foreign keys and complete cross-row validation for assignment-item/version/slot/obligation chains.
9. Treat teacher/reviewer resource assignment as explicit scope, not a role-label inference.
10. Keep idempotency and outbox infrastructure internal to trusted command execution.

## Evidence

- PULSE-DATA-CORE-001 through PULSE-DATA-CORE-008.
- Source migration: supabase/migrations/20261106000100_system_a_initial_schema.sql, blob 7a3c46b7e8b5f9b0d19506d1bf9696107e0b6e3f.
- New design document: docs/00_PROJECT_GOVERNANCE/PULSE_CANONICAL_PHYSICAL_ERD_AND_DATA_DICTIONARY.md.

## Impact and risks

This is a proposed target model only. It may require migration mappings for existing code and identifiers. Open product decisions remain for concurrent enrollment, guardian verification, permission mapping, resource-scope representation, publication roster snapshot, author/approver separation, evidence vocabulary, correction/doubt lifecycle, metric policy intervals, PII retention and external QBMS/DTE references.

No SQL, code, Supabase object, policy, grant, branch merge or production deployment was changed by this event.

## Acceptance criteria before implementation

- Product, academic, technical, privacy and security owners approve the relevant decisions.
- Every tenant-owned table and relationship has a tenant-qualified key/FK and RLS/grant contract.
- Migration replay succeeds in an isolated database.
- Cross-tenant, privilege-escalation, parent-link, resource-scope and append-only tests pass.
- Assignment publication and evidence workflows pass atomicity, concurrency and idempotency tests.
- Exact migration and production change receive explicit owner authorization.

## Follow-up

Resolve the blocking decisions in PULSE-DATA-CORE-009. Then produce the unified migration plan and isolated test harness. Do not apply the current V10 or System A migrations unchanged.