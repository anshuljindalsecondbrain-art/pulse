# PULSE-EVT-000013 — Add controlled teacher verification command contract

- Category: System A academic review command implementation
- Module(s): System A / Teacher Verification
- Created / updated: 2026-11-06
- Status: IMPLEMENTED_PENDING_CI
- Origin and source reference: System A teacher review workflow and append-only evidence/decision model.
- Requirement ID(s): PULSE-REQ-SYA-011
- Related event / issue / ADR: PULSE-EVT-000008; PULSE-EVT-000011; PULSE-EVT-000012

## Problem / opportunity
The teacher queue projection identified submitted learner reports, but no command contract constrained how a reviewer could decide on a specific report or preserve decision history.

## Decision
Add a pure command-preparation function that accepts a server-authorized obligation scope, checks exact evidence identity and tenant consistency, prevents learner self-verification, and creates an append-only completion decision. Subsequent decisions must explicitly supersede the latest decision for the same report.

## Acceptance criteria
- [x] Reviewer must be a teacher or academic reviewer.
- [x] Obligation must be present in the trusted caller's authorized scope.
- [x] Evidence must match institute, obligation and exact report ID.
- [x] Only submitted student self-reports enter completion verification.
- [x] Learner cannot verify their own report.
- [x] Completion outcomes are restricted to confirmed, not confirmed, returned or rejected.
- [x] Decision history is append-only and later decisions explicitly supersede the latest.
- [x] Exact decision retries are idempotent; conflicting decision IDs are rejected.
- [ ] Derive reviewer scope and role from authenticated server context.
- [ ] Persist decisions transactionally with database constraints and RLS.
- [ ] Add database integration tests, audit views and operational review UI.

## Security and scope
The supplied authorized obligation IDs are not proof of authorization. The server must derive them from the authenticated reviewer, institute, centre, batch and assignment scope. This helper performs no authentication, persistence or database authorization.

## Implementation evidence
- Branch: feat/system-a-abhyas-foundation
- PR: https://github.com/anshuljindalsecondbrain-art/pulse/pull/2
- Paths: apps/student-tracking/src/teacher-verification-domain.ts; apps/student-tracking/src/teacher-verification-domain.test.ts

## Validation
Unit tests are included. Exact-head GitHub Actions validation is required. No live database writes or production student records were used.
