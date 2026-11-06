# PULSE-EVT-000021 — D-003 hybrid authorization product decision

- Event ID: PULSE-EVT-000021
- Date: 2026-11-06
- Category: Product decision / authorization architecture
- Affected domains: Shared identity, tenant membership, role catalogue, permission model, resource scope, System A
- Status: PRODUCT_DECISION_RECORDED_SECURITY_APPROVAL_PENDING
- Implementation authorization: Not granted
- Migration authorization: Not granted

## Context

PULSE-DATA-CORE-010 identified role catalogue and action permissions as D-003. The user explicitly selected the hybrid authorization model.

## Product decision recorded

Adopt **hybrid authorization**, combining:
1. Role-based access control (RBAC): roles group organizational responsibilities and assignable permissions.
2. Resource/assignment scope: access is constrained to the tenant, centre, batch, student or other resources explicitly assigned to the actor.
3. Explicit action permissions: each operation requires an explicit permission; a role label alone is not authorization.

Additional rules:
- A role alone must never imply unrestricted access to all resources.
- Authorization evaluates tenant membership, resource scope and permission for the requested action.
- Missing, ambiguous or out-of-scope grants deny access by default.
- Enforcement belongs at trusted service/database boundaries; UI navigation and client-side filtering are not security controls.
- Role definitions, permission catalogue, role-permission assignments and resource-scope grants are separate concepts.

## Approval boundary

This records the user's product decision. D-003 requires Product Owner and Security Owner approval. The Product decision is recorded; Security Owner approval has not been supplied and remains pending. Therefore D-003 is BLOCKED for schema freeze until the security model is reviewed and approved.

## Schema and implementation implications

- Maintain a role catalogue independent of permission definitions.
- Model role-to-permission assignments explicitly, with tenant/global scope semantics approved separately.
- Model resource grants explicitly and tenant-qualify resource relationships.
- Define trusted authorization predicates for action + tenant + resource scope.
- Test deny-by-default behavior, cross-tenant isolation, role escalation, stale grants and direct API/RPC invocation.
- Do not treat client-provided role names or resource IDs as proof of authorization.

## Evidence

- User instruction in project conversation, 2026-11-06: "D-003 decision: hybrid. Record this as my product decision and proceed."
- Decision register: `docs/00_PROJECT_GOVERNANCE/PULSE_PRODUCT_DECISION_CLOSURE_AND_SCHEMA_FREEZE_REGISTER.md`

## Non-authorization

This event records a product decision only. It does not authorize SQL generation, schema changes, migration application, RLS/grant changes, data migration, PR merge or deployment.
