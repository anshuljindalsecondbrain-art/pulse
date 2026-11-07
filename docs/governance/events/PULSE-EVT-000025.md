# PULSE-EVT-000025 — Enforce linear student evidence supersession lineage

- Event ID: PULSE-EVT-000025
- Category: Domain integrity / evidence lineage
- Date: 2026-11-08
- Status: IMPLEMENTED_PENDING_CI
- Module: Student Tracking / student evidence submission
- Requirement: PULSE-REQ-SYA-016

## Source and context

The domain audit found that student resubmission validation accepted any prior same-obligation event as a supersession parent. It did not establish that the referenced event was the current lineage head, nor reject pre-existing branches or disconnected/missing parent references in the supplied attempt-cycle history.

## Change

1. Validate the supplied student-report history for the same institute, learner, obligation, question slot and attempt cycle.
2. Require a single root and a single linear supersession chain for that attempt cycle.
3. Reject missing/cross-cycle parents, duplicate event IDs, branches, cycles/disconnected records and multiple roots.
4. Require a correction resubmission to supersede the current lineage head; prevent a second root report in the same attempt cycle.
5. Add regression coverage for stale ancestors, branching, multiple roots and missing parents.

## Impact and risk

- Prevents a command from appending to a stale ancestor and creating a branched evidence history.
- Keeps correction submissions within the same attempt cycle.
- This is pure in-memory validation only. It does not provide transaction isolation, protect against concurrent writers, authenticate actors, persist evidence, or enforce database constraints.
- Metric projection still selects latest reports by timestamp/ID; deciding how multiple fresh practice cycles contribute to one obligation metric remains unresolved and is not changed here.
- Existing historical data must be audited before this stricter validation is enabled in a live persistence path.

## Validation

- Regression tests added/updated in `evidence-submission-domain.test.ts`.
- Exact-head CI pending.
- No local test execution is claimed.
- No database migration, RLS change, deployment or production mutation.

## Documentation

- [Current product baseline](../../student-tracking/STUDENT_TRACKING_CURRENT_BASELINE.md)
- [Domain logic audit](../../student-tracking/STUDENT_TRACKING_DOMAIN_LOGIC_AUDIT_2026-11-07.md)
- [Domain regression test specification](../../student-tracking/STUDENT_TRACKING_DOMAIN_REGRESSION_TEST_SPEC_2026-11-07.md)

## Follow-up

- Resolve canonical metric selection across fresh practice cycles separately.
- Add transaction/unique-constraint tests at the trusted persistence boundary after schema and actor-attribution decisions are approved.
