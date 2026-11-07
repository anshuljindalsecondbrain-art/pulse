# System A — Database Test Strategy

**Document ID:** STS-DB-TEST-001  
**Version:** 1.0.0  
**Status:** Required acceptance baseline  
**Date:** 2026-11-07

## 1. Test layers

| Layer | Objective | Evidence |
|---|---|---|
| Migration replay | Apply ordered migrations to clean database | CI output and resulting schema |
| Catalog assertions | Confirm expected objects, definitions, indexes and constraints | SQL assertions |
| Referential integrity | Reject invalid, cross-tenant and inconsistent joins | SQL integration tests |
| RLS positive | Permit correctly scoped actors | Test matrix |
| RLS negative | Deny out-of-scope actors and tenants | Test matrix |
| Transaction | All-or-none multi-record commands | rollback tests |
| Idempotency | Safe retry without duplicate obligations/events | repeat and payload-conflict tests |
| Concurrency | Concurrent publication/reporting does not duplicate or lose records | parallel tests |
| Historical integrity | Evidence/version history cannot be silently changed | immutability tests |
| Domain transitions | Invalid correction/doubt/verification transitions rejected | transition tests |
| Projection correctness | Denominators and event provenance remain accurate | fixture calculations |
| Performance | Matrix and cohort views scale with pagination/indexing | benchmark/stress results |
| Frontend contract | UI handles pending/saved/error/conflict/permission denied | integration and E2E evidence |

## 2. Minimum domain scenarios

### Identity and tenant
- Two tenants with similar student names and overlapping local admission numbers.
- One person associated with more than one tenant if approved.
- User can hold more than one role/scope.
- Revoked role grant prevents future sensitive operations.
- No untrusted client role claim can grant permission.

### Exercise and assignment
- Create exercise without a chapter and without QBMS/DTE references.
- Create multi-chapter exercise using per-slot optional scope.
- Generate Q1…QN exactly once.
- Question count and marks coexist.
- Publish a batch assignment from an approved immutable version.
- Resolve publication-time roster snapshot.
- New student after publication does not inherit work.
- Batch transfer preserves historical obligations.
- Repeated publication request is idempotent.
- Reusing idempotency key with different payload fails.
- Assignment amendment creates a new version and approved obligation deltas.

### Evidence and verification
- Student can report only own obligation.
- A teacher observation is not recorded as a student report.
- Report events are append-only.
- Completion confirmation does not imply answer correctness.
- Answer evaluation does not imply completion confirmation.
- Bulk verification records a decision for each exact evidence item.
- A teacher cannot self-approve or self-verify where prohibited.
- Retried report creates one event.

### Correction and doubt
- Correction begins only from an eligible returned decision.
- Resubmission creates a new report linked to exact correction cycle.
- Correction does not create a new practice cycle.
- Doubt is not equivalent to incorrect.
- Cohort-level resolution writes individual student transitions.
- Student confirmation and teacher resolution remain distinct.
- Reopen retains previous resolution history.

### Analytics and history
- Reported and verified progress have separate numerators.
- Accuracy denominator includes only evaluated answers under policy.
- Unattempted/skipped handling follows explicit policy.
- Missing evidence is not automatically treated as zero performance.
- Every projection records metric policy version and source watermark.
- DTE enrichment does not rewrite historical reports or decisions.

## 3. Load/performance scenarios

Run realistic synthetic tests for:
- 50, 100, 500 and 1,000 students per cohort.
- 20, 50, 100 and 250 exercise slots.
- large assignment publication batches.
- parallel autosave/batch submissions.
- teacher queue pagination.
- doubt aggregation by question slot.
- high-volume historical events for one learner.

Use server-side pagination, appropriate composite indexes and bounded query contracts. Do not load hundreds of thousands or millions of QBMS questions into the browser.

## 4. Release gate

No System A database release is complete until all applicable migration, RLS, integrity, idempotency, immutability, domain, performance and application-contract tests pass. Test evidence must cite exact commit SHA, migration head and database environment.
