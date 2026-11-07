# PULSE-EVT-000024 — Reject duplicate identities in System A metrics inputs

- Event ID: PULSE-EVT-000024
- Category: Domain integrity / regression hardening
- Date: 2026-11-07
- Status: IMPLEMENTED_PENDING_CI
- Module: Student Tracking / workflow metrics
- Requirement: PULSE-REQ-SYA-006

## Source and context

The static domain audit identified that `deriveSystemAMetrics` counted raw obligation arrays and built evidence lookup maps without first validating uniqueness of canonical obligation, evidence and decision IDs. Duplicate records could inflate denominators or silently overwrite earlier map entries.

## Change

1. Add regression tests for duplicate obligation IDs, duplicate evidence IDs and duplicate verification-decision IDs.
2. Add a shared uniqueness guard in `workflow-domain.ts`.
3. Reject duplicate IDs before any metric projection or lookup-map construction.

## Impact and risk

- Prevents ambiguous metric derivation from duplicate canonical identities.
- Fails closed instead of silently counting or overwriting duplicate records.
- Does not change metric definitions, actor attribution, academic workflow roles, database schema, authorization, RLS or persistence behavior.
- This is an in-memory domain validation guard; it does not replace database uniqueness constraints or transaction-level concurrency controls.

## Validation

- Regression tests added to `workflow-domain.test.ts`.
- CI triggered through draft PR #6; exact-head results pending at event creation.
- No local test execution is claimed.
- No database or production mutation.

## Documentation

- [Domain logic audit](../STUDENT_TRACKING_DOMAIN_LOGIC_AUDIT_2026-11-07.md)
- [Domain regression test specification](../STUDENT_TRACKING_DOMAIN_REGRESSION_TEST_SPEC_2026-11-07.md)
- [Requirement traceability](../../governance/REQUIREMENT_TRACEABILITY.md)

## Follow-up

Confirm exact PR-head typecheck, unit tests and build. Add database-level unique constraints and concurrency tests only after the shared physical schema and trusted command boundary are approved.
