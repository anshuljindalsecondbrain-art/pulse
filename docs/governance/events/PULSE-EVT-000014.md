# PULSE-EVT-000014 — Add correction workflow command contracts

- Category: System A correction workflow implementation
- Module(s): System A / Correction Management
- Created / updated: 2026-11-06
- Status: IMPLEMENTED_PENDING_CI
- Origin and source reference: System A correction lifecycle; append-only learner evidence and teacher verification contracts.
- Requirement ID(s): PULSE-REQ-SYA-012
- Related event / issue / ADR: PULSE-EVT-000008; PULSE-EVT-000009; PULSE-EVT-000010; PULSE-EVT-000012; PULSE-EVT-000013

## Problem / opportunity
The canonical workflow vocabulary and transition helper described correction states, and student evidence submission preserved attempt-cycle identity. There was no dedicated command contract tying a returned completion decision to a correction cycle, correction submission, teacher review and closure.

## Decision
Add pure correction command contracts for cycle start, student resubmission, teacher/academic-reviewer decision and accepted-cycle closure. A correction cycle is anchored to the exact returned completion decision and original evidence. Repeated returns reuse the same correction cycle; each new submission supersedes the latest evidence in that correction chain. The original attempt-cycle identifier remains unchanged.

## Acceptance criteria
- [x] Start only from the exact returned completion decision for the original submitted evidence.
- [x] Only the original learner may start and submit correction work.
- [x] Validate institute, learner, obligation, question slot and original attempt identity.
- [x] Append a new immutable evidence event for each correction submission.
- [x] Require each correction submission to supersede the latest evidence in the same chain.
- [x] Support exact idempotent submission and review retries; reject conflicting identifier reuse.
- [x] Restrict correction review to authorized teachers and academic reviewers.
- [x] Require review to reference the exact latest correction submission.
- [x] Preserve repeated return/review history within one correction cycle.
- [x] Close only after the latest correction submission is accepted.
- [x] Require a reason and timestamp for each transition.
- [ ] Derive actor identity and authorization scope from authenticated server context.
- [ ] Persist correction events and decisions transactionally with database constraints and RLS.
- [ ] Add database integration tests and operational correction UI.

## Security and scope
The authorized obligation lists are supplied by the caller and are not proof of authorization. The server must derive learner/reviewer identity and institute, centre, batch and assignment scope from authenticated context. These helpers do not authenticate actors, persist events, implement database transactions or replace RLS. No live database writes were performed.

## Implementation evidence
- Branch: feat/system-a-abhyas-foundation
- PR: https://github.com/anshuljindalsecondbrain-art/pulse/pull/2
- Paths: apps/student-tracking/src/correction-workflow-domain.ts; apps/student-tracking/src/correction-workflow-domain.test.ts

## Validation
Correction-specific unit tests are included. Exact-head GitHub Actions validation is required. No production data or database schema was changed.
