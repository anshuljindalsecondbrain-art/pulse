# PULSE-EVT-000012 — Add validated, idempotent student evidence submission contract

- Category: System A evidence command implementation
- Module(s): System A / Student Evidence
- Created / updated: 2026-11-06
- Status: IMPLEMENTED_PENDING_CI
- Origin and source reference: System A student work reporting workflow and append-only evidence requirements.
- Requirement ID(s): PULSE-REQ-SYA-010
- Related event / issue / ADR: PULSE-EVT-000008; PULSE-EVT-000010; PULSE-EVT-000011

## Problem / opportunity
The evidence model and learner worklist existed, but there was no single command contract validating a student submission against the published obligation or defining safe idempotent retry behaviour.

## Decision
Add a pure command-preparation function. It accepts already-authorized tenant-scoped records, validates learner/obligation/version/slot consistency, creates immutable self-report evidence, and recognizes exact retries. It performs no authentication, persistence or database transaction.

## Acceptance criteria
- [x] Submission actor matches the learner identity supplied by the trusted caller.
- [x] Obligation belongs to the same learner and institute.
- [x] Obligation is eligible and references a slot in its assignment version.
- [x] Slot identifier matches the obligation.
- [x] Same idempotency key and identical payload returns the original evidence.
- [x] Same idempotency key with a changed payload is rejected.
- [x] Resubmission references prior evidence for the same learner, institute and obligation.
- [x] Correction resubmission preserves attemptCycleId.
- [x] Historical evidence is not mutated.
- [ ] Enforce idempotency uniqueness transactionally in the database.
- [ ] Derive actor and tenant scope from authenticated server context.
- [ ] Add database integration tests and production RLS policies.

## Security and scope
This function is not an authorization boundary. The server must derive actor identity, tenant membership and permitted obligation from authenticated context; client-supplied IDs are not trusted. Database uniqueness constraints and a transaction are required to prevent concurrent duplicate writes.

## Implementation evidence
- Branch: feat/system-a-abhyas-foundation
- PR: https://github.com/anshuljindalsecondbrain-art/pulse/pull/2
- Paths: apps/student-tracking/src/evidence-submission-domain.ts; apps/student-tracking/src/evidence-submission-domain.test.ts

## Validation
Unit tests are included; exact-head CI must pass. No database writes or live student data were used.
