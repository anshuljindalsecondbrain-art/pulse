# System A — Database Change Control Protocol

**Document ID:** STS-DB-CHANGE-001  
**Version:** 1.0.0  
**Status:** Active governance protocol  
**Date:** 2026-11-07

## 1. Change request

Each database request receives a unique ID: `STS-DB-###`.

Record:
- requester and date;
- product requirement and expected behavior;
- System A domain;
- affected UI, API, entity, table, report and integration;
- urgency and release target;
- whether academic truth, security or existing data may be affected.

## 2. Impact assessment

Before SQL is written:
- inspect the live schema and migration head;
- inspect the canonical shared PULSE entity owner and branch;
- identify all dependent queries, views, functions, triggers, Edge Functions and frontend types;
- evaluate tenant consistency and referential integrity;
- evaluate migration replay and recovery;
- identify PII exposure and role implications;
- identify impact on historical reports, verification and metrics.

## 3. Review requirements

A schema change requires:
- product decision where academic behavior changes;
- architecture review for ownership or relationship changes;
- security review for RLS/grants/functions/views;
- data review for backfill/history/retention;
- application review for client/service contracts;
- test evidence;
- documented approval before shared-environment execution.

## 4. Git workflow

- Work on a dedicated feature/documentation branch.
- Do not modify `main` directly for schema changes.
- Keep migrations ordered and immutable after application.
- Use small, focused commits and pull requests.
- PR body must describe requirement IDs, schema diff, authorization impact, test plan, execution order, rollback/recovery and unresolved risks.
- Do not merge unresolved or failed security/database tests.

## 5. Supabase workflow

1. Inspect project, tables, migrations, extensions, functions, triggers, views, grants and RLS.
2. Verify current Supabase documentation for the change.
3. Create a timestamped migration using the Supabase CLI migration workflow.
4. Validate against a disposable database.
5. Run migration replay and SQL tests.
6. Run security/performance/health advisors.
7. Apply to designated staging only after approval.
8. Reinspect database catalog and verify behavior.
9. Production requires separate explicit authorization and a verified recovery plan.

## 6. Prohibited actions

- Applying the existing proposed System A initial migration unchanged.
- Assuming a shared identity migration is production approved without review.
- Duplicate identity or academic tenant tables.
- Broad authenticated policies.
- Client-side service-role access.
- Direct browser writes that bypass command authorization/transactionality.
- Destructive cascading removal of student evidence.
- Mutating published versions or append-only evidence.
- Unreviewed DDL or production backfills.
- Claiming completion from a committed file alone without execution evidence.

## 7. Completion report

Every change report must include:
1. Requirement and decision IDs.
2. Files changed and commit/PR.
3. Schema objects changed.
4. Migration status per environment.
5. Security/RLS impact and tests.
6. Application impact.
7. Test evidence and exact SHA.
8. Recovery/rollback notes.
9. Remaining blockers.
