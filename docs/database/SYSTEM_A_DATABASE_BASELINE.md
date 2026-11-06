# System A database migration baseline

**Migration:** `20261106000100_system_a_initial_schema.sql`  
**Status:** PROPOSED — NOT APPLIED  
**Scope:** Initial System A tenant, roster, exercise/version, assignment/publication, obligation, evidence, verification, correction, doubt, audit and metric-policy tables.

## Safety boundary
This is a proposed fresh-schema baseline based on the System A master completion specification. The target Supabase project is not connected, and no live schema was inspected. Do not apply this migration to a live project until schema, auth, extensions, existing naming conventions, grants, RLS, migration history and application data have been audited.

The migration intentionally enables and forces RLS while creating no access policies and revoking client table grants. This is fail-closed: client access remains unavailable until reviewed policies and narrowly scoped server-side operations are authored and tested.

## Included
- Institute, centre, membership, student, parent link, subject, chapter, batch, effective membership.
- Exercise identity/version and stable slots.
- Assignment identity/version, items, targets and publication-time student obligations.
- Attempt cycles, append-only evidence, separate verification decisions and correction cycles.
- Doubt cases/events, audit events and metric policy versions.
- Tenant-composite foreign keys and tenant-focused indexes.
- Immutable update/delete guards for evidence, verification and audit event records.

## Deliberately not included
- No permissive RLS policies.
- No public/anonymous grants.
- No client-facing RPCs.
- No assignment publication function yet.
- No parent/mentor authorization policies.
- No dispute/appeal and recognition tables in this first migration.
- No DTE/QBMS FK; those are optional integration references.
- No migration against existing legacy tables.
- No claim of successful SQL execution.

## Review items before application
1. Check Supabase auth schema availability and target PostgreSQL version.
2. Resolve global/shared subject reference semantics.
3. Validate nullable unique constraints and membership transfer policy.
4. Add chapter/subject composite tenant constraints.
5. Add slot-to-exercise-version publication immutability triggers.
6. Add immutable assignment version protections.
7. Decide which evidence actors can create which event types.
8. Implement tenant membership helper and role policies; test cross-tenant reads/writes.
9. Add idempotent transactional publish-assignment RPC and validate all joins.
10. Add dispute/appeal and recognition schemas.
11. Add migration test fixtures, rollback plan and staging dry-run.

## Application rule
Only apply after an exact target project and environment are confirmed and inspected. Start with a non-production project and capture migration output and RLS tests.
