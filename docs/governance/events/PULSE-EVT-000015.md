# PULSE-EVT-000015 — Add doubt management command contracts

- Category: System A doubt management implementation
- Module(s): System A / Doubt Management
- Created / updated: 2026-11-06
- Status: IMPLEMENTED_PENDING_CI
- Origin and source reference: System A doubt lifecycle requirements; canonical DoubtState vocabulary in workflow-domain.ts and transition rules in workflow-transitions.ts.
- Requirement ID(s): PULSE-REQ-SYA-013
- Related event / issue / ADR: PULSE-EVT-000008; PULSE-EVT-000009; PULSE-EVT-000012; PULSE-EVT-000013; PULSE-EVT-000014

## Problem / opportunity
The existing workflow transition helper described the doubt state sequence but did not provide a durable command contract linking a doubt to an exact learner obligation, recording a complete immutable event history, enforcing assignment identity, or supporting idempotent retries.

## Decision
Add pure command contracts for raising a doubt against an eligible learner-question obligation and appending assignment, investigation, resolution, student confirmation and reopening events. Every event links to the prior event. Resolution requires an explanation. Student confirmation remains distinct from academic resolution. Reopening clears the active assignee while preserving prior resolution timestamps and event history.

## Acceptance criteria
- [x] Raise a doubt only against an exact eligible obligation in the same institute and learner scope.
- [x] Allow a student to raise a doubt only for their own work.
- [x] Support authorized academic assignment to an assignee in the supplied academic scope.
- [x] Require the assigned academic actor to start investigation.
- [x] Require an explicit resolution note.
- [x] Keep student confirmation separate from teacher resolution.
- [x] Allow the affected student or authorized academic actor to reopen a resolved doubt.
- [x] Preserve immutable, linked transition events and exact latest-event pointer.
- [x] Support exact idempotent creation/transition retries and reject conflicting ID reuse.
- [x] Validate institute and obligation scope at the domain boundary.
- [ ] Derive actor identity, assignee eligibility and institute/centre/batch authorization from authenticated server context.
- [ ] Persist doubt cases and events transactionally with database constraints and RLS.
- [ ] Add database integration tests and operational doubt-management UI.

## Security and scope
The authorized obligation and assignee lists are caller-supplied validation context, not proof of authorization. The server must derive actor identity, role, institute and assignment scope from authenticated context. This increment does not authenticate users, persist events, guarantee concurrent idempotency, or replace RLS. No live database writes were performed.

## Implementation evidence
- Branch: feat/system-a-abhyas-foundation
- PR: https://github.com/anshuljindalsecondbrain-art/pulse/pull/2
- Paths: apps/student-tracking/src/doubt-management-domain.ts; apps/student-tracking/src/doubt-management-domain.test.ts

## Validation
Exact-head GitHub Actions validation is required. No database schema or production student data was changed.
