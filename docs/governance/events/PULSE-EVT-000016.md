# PULSE-EVT-000016 — Add independent answer evaluation command

- Category: System A answer evaluation command implementation
- Module(s): System A / Academic Evaluation
- Created / updated: 2026-11-06
- Status: IMPLEMENTED_PENDING_CI
- Origin and source reference: System A canonical workflow model; AnswerEvaluation and ANSWER_EVALUATION verification purpose in workflow-domain.ts.
- Requirement ID(s): PULSE-REQ-SYA-014
- Related event / issue / ADR: PULSE-EVT-000008; PULSE-EVT-000011; PULSE-EVT-000013; PULSE-EVT-000014; PULSE-EVT-000015

## Problem / opportunity
Completion verification and answer correctness are distinct academic outcomes. The existing decision vocabulary supported answer evaluation, but no dedicated command contract enforced exact learner/question evidence linkage, independent evaluation history and retry behavior.

## Decision
Add a pure answer-evaluation command that creates an ANSWER_EVALUATION decision against one exact submitted student self-report. Supported outcomes are CORRECT, INCORRECT and PARTIALLY_CORRECT. A rationale is mandatory. Evaluations do not require or imply completion verification. Re-evaluation must explicitly supersede the latest evaluation for the same evidence event.

## Acceptance criteria
- [x] Support CORRECT, INCORRECT and PARTIALLY_CORRECT.
- [x] Require a non-empty rationale and valid decision timestamp.
- [x] Link to exact institute, learner, obligation, question slot and submitted evidence event.
- [x] Reject ineligible obligations, non-submitted evidence, teacher observations and learner self-evaluation.
- [x] Require an authorized academic role and obligation scope at the domain boundary.
- [x] Preserve prior evaluation decisions and require explicit latest-decision supersession.
- [x] Support exact idempotent retries and reject conflicting decision-ID reuse.
- [x] Keep completion decisions independent and unchanged.
- [ ] Derive evaluator identity, role and assignment scope from authenticated server context.
- [ ] Persist decisions transactionally with database constraints and RLS.
- [ ] Add database integration tests and operational review UI.

## Security and scope
Caller-supplied role and authorized-obligation lists are validation inputs, not proof of authorization. Server-side identity, role and scope derivation remain mandatory. This increment does not authenticate users, persist decisions, guarantee concurrent idempotency or replace RLS. No live database writes were performed.

## Implementation evidence
- Branch: feat/system-a-abhyas-foundation
- PR: https://github.com/anshuljindalsecondbrain-art/pulse/pull/2
- Paths: apps/student-tracking/src/answer-evaluation-domain.ts; apps/student-tracking/src/answer-evaluation-domain.test.ts

## Validation
Exact-head GitHub Actions validation is required. No database schema or production student data was changed.
