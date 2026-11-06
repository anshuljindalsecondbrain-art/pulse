# PULSE-EVT-000020 — D-001 concurrent enrollment product decision

- Event ID: PULSE-EVT-000020
- Date: 2026-11-06
- Category: Product decision / academic data model
- Affected domains: Shared identity, tenant membership, academic enrollment, centre and batch membership, System A
- Status: PRODUCT_DECISION_RECORDED_ACADEMIC_APPROVAL_PENDING
- Implementation authorization: Not granted
- Migration authorization: Not granted

## Context

PULSE-DATA-CORE-010 identified concurrent active student enrollment as D-001. The user explicitly selected:
- Policy: Allow multiple concurrent active enrollments.
- Scope: Both within and across institutes.

## Product decision recorded

1. A student may have multiple concurrent active enrollments.
2. This is permitted within the same institute, including across centres, programmes and academic sessions where each enrollment is independently valid.
3. This is also permitted across different institutes.
4. Multiple batch memberships are permitted when each membership is valid under its associated enrollment and the relevant institution's rules.
5. Do not impose a global one-active-enrollment-per-student uniqueness constraint.
6. Active academic context must be selected/resolved explicitly; it must not be inferred from one globally unique active enrollment.
7. Cross-institute access remains tenant-isolated. Enrollment in one institute does not grant access to another institute's data; a separate authorized membership is required.

## Approval boundary

This records the user's product decision. D-001 lists both Product Owner and Academic Owner as required approvers. The Product decision is recorded; Academic Owner approval has not been supplied and remains pending. Therefore D-001 is BLOCKED for schema freeze until academic semantics are confirmed.

## Schema implications to carry forward

- Enrollment cardinality must support multiple concurrent records per student.
- Uniqueness constraints must be scoped to approved business keys, not globally to student identity.
- Batch membership must be modeled independently and linked to a valid enrollment/tenant context.
- Context selection and authorization must remain explicit and tenant-scoped.
- Exact business-key uniqueness, enrollment state transitions, overlap rules and cross-institute identity policy remain subject to technical and academic review.

## Evidence

- User instruction in project conversation, 2026-11-06: "D-001 decision: allow. Scope: both."
- Decision register: `docs/00_PROJECT_GOVERNANCE/PULSE_PRODUCT_DECISION_CLOSURE_AND_SCHEMA_FREEZE_REGISTER.md`

## Non-authorization

This event records a product decision only. It does not authorize SQL generation, schema changes, migration application, RLS/grant changes, data migration, PR merge or deployment.
