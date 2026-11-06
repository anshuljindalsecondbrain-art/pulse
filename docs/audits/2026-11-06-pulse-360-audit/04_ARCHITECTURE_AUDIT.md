# Architecture Audit

## Positive architecture invariants

The repository establishes several valuable boundaries:
- System A must operate without QBMS question IDs or DTE tags.
- DTE progressively enriches classification and must not block daily tracking.
- Question identity, question version and placement/slot are distinct.
- DTE schema definitions are separate from question mappings.
- Archetype identity is reusable and not trapped beneath one taxonomy parent.
- Question Type is distinct from difficulty; DRE owns difficulty calculation.
- Student evidence is immutable; enrichment creates derived associations rather than rewriting source evidence.
- Modules own their business records; shared platform owns identity, tenancy, authorization and shared infrastructure.

## Critical architecture gaps

1. **No approved authoritative physical schema.** CORE-001–009 are draft proposals, and the live database is empty.
2. **Identity model conflict.** Older System A migration creates `sa_institutes`, `sa_institute_memberships`, `sa_students.auth_user_id`; canonical documents propose `tenants`, `people`, `person_auth_identities`, `tenant_memberships`, `tenant_role_grants`. These are not yet reconciled.
3. **Module boundaries are not fully resolved.** DTE's own audit identifies overlap across M10/M15, M11/M15, M16/M18, M01/M14 and mapping/archetype/provenance ownership.
4. **Domain events vs audit events vs academic evidence** need distinct persistence and retention contracts.
5. **Cross-system enrichment** needs versioned contracts, idempotent consumers, replay, dead-letter handling and source provenance.

## Architecture decision closure required

- One Auth UID to one person or a formally supported many-to-one identity link.
- Student profile cardinality per tenant.
- Concurrent enrollment policy and effective-dated academic context.
- Centre-scoped roles and role/action permission catalogue.
- Verified, expiring and revocable parent links.
- Shared global catalogue vs tenant overlay ownership.
- Separation of duties for author/reviewer/publisher.
- Privileged support/break-glass controls.
- Domain-specific event source of truth and generic outbox role.
- Partially-correct semantics and marking policy.
- Exercise vs assignment vs assessment lifecycle and immutable publication snapshot.

## Recommendation

Freeze new cross-domain feature work until CORE-001–009 and the open decision register are approved. Then generate one unified schema and API contract from the decisions, not by concatenating legacy migrations. Maintain modular monolith boundaries initially; do not create microservices solely because the product has multiple named modules.
