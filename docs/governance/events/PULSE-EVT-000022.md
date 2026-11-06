# PULSE-EVT-000022 — D-004 typed resource assignment product decision

- Event ID: PULSE-EVT-000022
- Date: 2026-11-06
- Category: Product decision / resource authorization architecture
- Affected domains: Shared platform, tenant-qualified resource scope, staff assignment, System A authorization
- Status: PRODUCT_DECISION_RECORDED_TECHNICAL_SECURITY_APPROVAL_PENDING
- Implementation authorization: Not granted
- Migration authorization: Not granted

## Context

PULSE-DATA-CORE-010 identified the representation of teacher/reviewer resource scope as D-004. The user explicitly selected the hybrid resource-scope model: typed assignments for core academic resources, with a controlled extension mechanism for future resource types.

## Product decision recorded

Adopt the **hybrid resource-scope model** for the initial PULSE architecture.

- Use typed, tenant-qualified assignments for core academic resources: centres, batches, students, exercises, assignments and review queues, where assignable.
- Each core assignment must use an explicit typed reference and enforce tenant-qualified referential integrity.
- Provide a controlled extension mechanism for future resource types. Every new type requires explicit schema/API registration, ownership, tenant key, reference validation, authorization semantics, lifecycle/revocation behaviour and tests.
- Generic extension metadata may support discovery/configuration, but must not become an unconstrained polymorphic authorization source for core resources.
- Resource assignment establishes scope, not action permission. Access still requires valid tenant membership, applicable role context, explicit action permission and applicable resource scope under D-003 hybrid authorization.
- Missing, invalid, revoked, cross-tenant or ambiguous scope denies access by default.

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

- User instruction in project conversation, 2026-11-06: "Go ahead option c" (hybrid model).
- Decision register: `docs/00_PROJECT_GOVERNANCE/PULSE_PRODUCT_DECISION_CLOSURE_AND_SCHEMA_FREEZE_REGISTER.md`

## Non-authorization

This event records a product decision only. It does not authorize SQL generation, schema changes, migration application, RLS/grant changes, data migration, PR merge or deployment.
