# PULSE-EVT-000010 — Add immutable assignment publication planning

- Category: System A academic workflow implementation
- Module(s): System A / Assignment Management / Student Obligations
- Created / updated: 2026-11-06
- Status: IMPLEMENTED_PENDING_CI
- Origin and source reference: System A assignment workflow and implementation roadmap; teacher selects existing offline-module questions and assigns them to a target batch.
- Requirement ID(s): PULSE-REQ-SYA-008
- Related event / issue / ADR: PULSE-EVT-000006; PULSE-EVT-000008; PULSE-EVT-000009

## Problem / opportunity
The prototype supports local assignment selection, but the domain had no canonical contract for freezing the selected question set or expanding a target roster into per-student obligations. Without this contract, retries, edits after publication and learner eligibility can produce inconsistent worklists.

## Impact and risk
- Academic: assignment publication snapshots existing source-module question references; System A does not author or duplicate question content.
- Data: a version contains ordered immutable slots; each target learner receives one obligation per slot.
- Eligibility: eligible and exempted obligations are represented separately so exempted work does not enter eligible denominators.
- Reliability: identifiers are deterministic within a version, supporting idempotent planning; this is not a substitute for database uniqueness or transactional publication.
- Security: institute IDs are carried through the plan but are not authorization evidence. Server-side membership, roster scope and tenant constraints remain mandatory.

## Options and recommendation
Implement a pure deterministic planner with tests before database publication. Keep roster resolution, authorization, persistence, transaction handling and notification delivery at the server boundary.

## Decision and approval
Reversible domain-layer implementation. Academic approval of exemption policy, roster snapshot timing and publication/edit rules remains pending.

## Acceptance criteria
- [x] Only question references belonging to the selected source module can be published.
- [x] Empty or duplicate question selections are rejected.
- [x] Published version snapshots module metadata and ordered question-slot metadata.
- [x] One obligation is planned for each target learner and selected slot.
- [x] Duplicate target learner IDs are rejected.
- [x] Eligible and exempted obligations are distinguished.
- [x] Repeating the same planning input produces the same identifiers and output.
- [x] Version, slots, obligations and summary are frozen.
- [x] Due date cannot precede publication time.
- [ ] Resolve target roster and eligibility from authorized server-side records.
- [ ] Persist version and obligations atomically with retry-safe database constraints.
- [ ] Add cross-tenant, role-scope and publication integration tests.
- [ ] Add teacher publication UI and student worklist integration.

## Implementation evidence
- Branch: `feat/system-a-abhyas-foundation`
- PR: https://github.com/anshuljindalsecondbrain-art/pulse/pull/2
- Paths:
  - `apps/student-tracking/src/assignment-domain.ts`
  - `apps/student-tracking/src/assignment-domain.test.ts`

## Validation evidence
- Unit tests are included and must pass in System A CI on the exact PR head.
- No database, browser, end-to-end or production publication is claimed.

## Open risks / next actions
- Decide whether roster eligibility is snapshotted at publication or dynamically evaluated before due date.
- Define treatment of learners joining/leaving a batch after publication.
- Enforce immutability and unique obligation keys in PostgreSQL.
- Implement an idempotent server-side publication transaction only after RLS and role policies are approved.

## Amendments / supersession
None.
