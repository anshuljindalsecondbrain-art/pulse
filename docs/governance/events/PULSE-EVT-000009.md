# PULSE-EVT-000009 — Add explicit doubt and correction lifecycle transitions

- Category: System A workflow implementation
- Module(s): System A / Doubt Management / Correction
- Created / updated: 2026-11-06
- Status: IMPLEMENTED_PENDING_CI
- Origin and source reference: System A Master Completion Specification, sections 7.E–7.G and 13; System A Implementation Plan, phases 5–6.
- Requirement ID(s): PULSE-REQ-SYA-007
- Related event / issue / ADR: PULSE-EVT-000008; PULSE-ISSUE-0010

## Original request / evidence
“Build remaining parts  of this system A”

## Problem / opportunity
The domain had independent doubt and correction state types but no explicit transition contract. Without transition rules, UI or repository code could allow invalid lifecycle jumps, conflate teacher resolution with student confirmation, or allow correction to be accepted by the student.

## Impact and risk
- Academic: doubt assignment, work, resolution, student confirmation and reopening are separate actions.
- Academic: correction required, in progress, resubmitted, accepted and closed are distinct.
- Security: domain transition helpers check actor role category, but do not replace server-side membership/assignment authorization.
- Data: transitions return immutable from/to/action/actor/reason records; they do not mutate or persist source events.
- Operational: cohort doubt resolution must be represented as one transition per individual case.
- Attempt semantics: correction resubmission does not create a new practice attempt cycle.

## Options and recommendation
Implement pure deterministic transition functions and tests before adding UI controls or database writes. Keep persistence and authorization outside this domain-only increment.

## Decision and approval
Reversible domain-layer implementation. Academic owner approval of policy, SLA and role assignment remains Pending.

## Acceptance criteria
- [x] Doubt lifecycle supports assign → start → resolve → student confirmation.
- [x] Student or authorised academic actor can reopen a resolved doubt.
- [x] Student cannot resolve a doubt on behalf of the teacher.
- [x] Teacher cannot confirm student understanding.
- [x] Correction lifecycle supports start → resubmit → accept/return → close.
- [x] Student cannot accept their own correction.
- [x] Every transition requires a non-empty reason.
- [x] Invalid transitions fail explicitly.
- [ ] Persist transitions as append-only events with server authorization.
- [ ] Add role/tenant integration tests and operational UI.

## Implementation evidence
- Branch: `feat/system-a-abhyas-foundation`
- PR: https://github.com/anshuljindalsecondbrain-art/pulse/pull/2
- Paths:
  - `apps/student-tracking/src/workflow-transitions.ts`
  - `apps/student-tracking/src/workflow-transitions.test.ts`

## Validation evidence
- Workflow tests are included and must pass in System A CI on the exact PR head.
- No production database, browser or end-to-end validation is claimed.

## Documentation updates
- Master event register.
- Requirement traceability matrix.
- Pull request traceability metadata.

## Open risks / next actions
- Implement doubt and correction persistence only after database authorization and event schema are reviewed.
- Require verifier independence and current academic scope at the server boundary.
- Add per-student cohort action snapshots and explicit student confirmation UX.

## Amendments / supersession
None.
