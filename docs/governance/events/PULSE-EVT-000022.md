# PULSE-EVT-000022 — D-004 typed resource assignment product decision

- Event ID: PULSE-EVT-000022
- Date: 2026-11-06
- Category: Product decision / resource authorization architecture
- Affected domains: Shared platform, tenant-qualified resource scope, staff assignment, System A authorization
- Status: PRODUCT_DECISION_RECORDED_TECHNICAL_SECURITY_APPROVAL_PENDING
- Implementation authorization: Not granted
- Migration authorization: Not granted

## Context

PULSE-DATA-CORE-010 identified the representation of teacher/reviewer resource scope as D-004. The user explicitly selected typed resource assignments.

## Product decision recorded

Adopt **typed, tenant-qualified resource assignments** for the initial PULSE architecture.

- Use explicit relationships for supported resource types, rather than one universal generic/polymorphic resource registry.
- Initial resource scope must cover core resource types required by the product, including centres, batches, students, exercises, assignments and review queues where assignable.
- Each relationship must retain tenant context and enforce referential integrity through typed, tenant-qualified foreign keys.
- Adding a new assignable resource type requires an explicit schema/API extension and review; do not silently place arbitrary resource identifiers into a generic string/type pair.
- Typed resource assignments supplement, and do not replace, D-003 hybrid authorization. Access still requires valid tenant membership, role context, explicit action permission and applicable resource scope.
- Missing, invalid, cross-tenant or ambiguous scope denies access by default.

## Approval boundary

This records the user's product decision. D-004 requires Technical Owner, Security Owner and Product Owner approval. The Product decision is recorded; Technical and Security approval have not been supplied and remain pending. Therefore D-004 is BLOCKED for schema freeze until the typed relationships and authorization enforcement are reviewed.

## Schema and implementation implications

- Define typed grant/assignment relationships for each approved resource class.
- Enforce tenant-qualified composite foreign keys and indexes for scope lookup.
- Define lifecycle/revocation semantics for assignments and prevent stale grants from authorizing access.
- Specify how inherited scope works, if any, without making inheritance implicit.
- Add negative tests for cross-tenant references, missing scope, revoked grants, direct RPC/API calls and role-only access.
- Do not implement a polymorphic resource registry as a shortcut for future extensibility.

## Evidence

- User instruction in project conversation, 2026-11-06: "D-004 decision: typed. Record this as my product decision and proceed."
- Decision register: `docs/00_PROJECT_GOVERNANCE/PULSE_PRODUCT_DECISION_CLOSURE_AND_SCHEMA_FREEZE_REGISTER.md`

## Non-authorization

This event records a product decision only. It does not authorize SQL generation, schema changes, migration application, RLS/grant changes, data migration, PR merge or deployment.
