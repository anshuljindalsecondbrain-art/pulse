# Database and Data Integrity Audit

## Live state — verified

- Supabase project PULSE: ACTIVE_HEALTHY.
- Region: `ap-south-1`.
- PostgreSQL: 17.11.
- Public application tables: 0.
- Applied migrations: 0.
- Edge Functions: 0.
- Security/performance/health advisors: no lints, on an empty application schema.

## Repository state

One proposed migration exists: `supabase/migrations/20261106000100_system_a_initial_schema.sql`. It creates an institute-centric System A schema, enables and forces RLS on `sa_*` tables, revokes direct table access from anon/authenticated, creates no policies, and adds immutability triggers for evidence, verification and audit events. It is not applied.

## Critical findings

- The proposed migration's institute/user membership model conflicts with the newer canonical tenant/person/role-grant model.
- CORE-009 is explicitly draft and not executable SQL.
- A single migration cannot be considered production-ready until all parent/tenant references, composite foreign keys, uniqueness and lifecycle policies are resolved.
- Repository adapter expects table/column names from the proposed schema but there is no live schema against which to validate it.
- The adapter uses client-side Supabase queries; it is not a substitute for server-side actor resolution and authorization.
- The uploaded legacy SQL contains array-based secondary tags, cascade-delete behavior and a SECURITY DEFINER batch-save RPC with a fixed `search_path=public`; it must not be applied unchanged.
- DTE needs normalized many-to-many mappings, schema versioning and immutable mapping history; a flat array of secondary IDs is not a safe canonical relationship model.
- Assignment publication requires an atomic, idempotent transaction that freezes the selected assignment version and expands obligations against a trusted roster snapshot.
- Marks need reviewed numeric precision and negative-mark semantics; tenant ownership of global/tenant subjects and chapters must be explicit.

## Required database gates

1. Approve canonical identity and tenancy decisions.
2. Reconcile all legacy migration sources and repository dependencies.
3. Complete CORE-009 with exact constraints, keys, FK actions, indexes and RLS policy matrix.
4. Create one ordered migration lineage in Git.
5. Replay from an empty isolated database.
6. Test positive and negative authorization cases for every role/resource action.
7. Test cross-tenant FK rejection, idempotency, concurrency, publication retry and immutable history.
8. Run Supabase advisors against the actual candidate schema.
9. Only after independent review and explicit approval, schedule production migration.

**Do not apply the current proposed migration to production.**
