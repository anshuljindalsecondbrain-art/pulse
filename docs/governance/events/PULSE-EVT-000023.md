# PULSE-EVT-000023 — D-005 hybrid assignment publication roster decision

- Event ID: PULSE-EVT-000023
- Date: 2026-11-06
- Category: Product decision / assignment publication semantics
- Affected domains: System A, assignments, batch membership, student obligations, audit history
- Status: PRODUCT_DECISION_RECORDED_ACADEMIC_APPROVAL_PENDING
- Implementation authorization: Not granted
- Migration authorization: Not granted

## Product decision recorded

The user selected **HYBRID** for D-005: immutable publication snapshot by default, with explicit teacher-controlled additions and removals.

## Required behaviour

- Publishing an assignment resolves and stores an immutable snapshot of the target student population.
- Students joining a batch after publication do not automatically receive the already-published assignment.
- Authorized teachers may explicitly add a student or remove/cancel a student's obligation through a controlled operation.
- Every post-publication change must append an attributable lifecycle event, including actor, timestamp, action and reason where required by policy.
- Preserve the original publication snapshot and historical obligation evidence; do not silently rewrite prior membership or publication records.
- Commands must be idempotent and transactionally consistent with obligation creation and lifecycle-event recording.
- Authorization must enforce tenant membership, action permission and applicable typed resource scope.

## Approval boundary

This records the user's product decision. Academic Owner approval remains pending. D-005 is therefore BLOCKED for schema freeze until the academic workflow and lifecycle semantics are approved.

## Evidence

- User instruction in project conversation, 2026-11-06: "C"
- Decision register: `docs/00_PROJECT_GOVERNANCE/PULSE_PRODUCT_DECISION_CLOSURE_AND_SCHEMA_FREEZE_REGISTER.md`

## Non-authorization

This event records a product decision only. It does not authorize SQL generation, schema changes, migration application, RLS/grant changes, data migration, PR merge or deployment.
