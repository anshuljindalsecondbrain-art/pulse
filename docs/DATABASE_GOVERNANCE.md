# PULSE — Database Governance and Safety Rules

## 1. Audit before change

Before any database modification, inspect:
- connected project identity and environment;
- schemas, tables, columns, constraints, foreign keys and indexes;
- migration history and drift;
- views, functions, RPCs, triggers and extensions;
- RLS policies and grants;
- Storage buckets and object policies;
- Edge Functions and secrets usage;
- data volume, dependencies and current application queries.

Do not infer that a historical SQL snippet is safe to apply. The live schema is authoritative for as-built state.

## 2. Environment separation

Use development/staging and production environments where available. Validate migrations against a safe non-production environment before production. Confirm backup and recovery options before high-risk changes.

## 3. Migration rules

- Use ordered, descriptive, immutable migration files.
- Never rewrite an already-applied migration; create a forward migration.
- Prefer additive, backward-compatible changes.
- Separate schema change from data backfill where practical.
- Include validation and rollback/recovery notes for risky changes.
- Review generated SQL before execution.
- Production migration requires explicit approval.

## 4. Data preservation

- No unreviewed destructive DDL.
- Avoid cascade deletion across questions, question versions, placements, student evidence, attempts, results, classification mappings and audit history.
- Prefer RESTRICT, explicit reassignment, archive or deactivate patterns.
- Preserve historical identity and version references.
- Do not overwrite published mapping revisions silently.
- Backfills must be idempotent and observable.

## 5. Tenant security

- Apply tenant-aware RLS to all tenant-owned data.
- Validate authorization in trusted server-side functions as well as database policies.
- Test cross-tenant SELECT, INSERT, UPDATE, DELETE, RPC, joins and Storage access.
- Treat global/shared reference data as a distinct, explicitly authorized access model.
- Do not expose service-role keys to client applications.
- Do not rely on UI hiding as access control.

## 6. Auditability

Sensitive academic and administrative actions should record actor, tenant, action, target identity/version, previous/new state where applicable, reason and timestamp. Audit records should be protected from ordinary mutation/deletion.

## 7. Performance

- Index tenant-scoped lookup and relationship paths based on measured queries.
- Use server-side pagination and bounded search.
- Inspect query plans for large inventories.
- Use chunked background jobs for expensive operations.
- Avoid unbounded joins and N+1 query patterns.
- Measure before adding extensions or specialized infrastructure.

## 8. Test expectations

At minimum, include migration validation, constraint tests, RLS tests for allowed and denied cases, cross-tenant isolation tests, idempotent backfill tests, historical-version tests and regression tests for existing workflows.
