# PULSE-EVT-000011 — Add student worklist and teacher verification queue projections

- Category: System A academic workflow implementation
- Module(s): System A / Student Worklist / Teacher Verification
- Created / updated: 2026-11-06
- Status: IMPLEMENTED_PENDING_CI
- Origin and source reference: System A student tracking workflow; published assignment obligations feed learner worklists and submitted learner evidence feeds academic review.
- Requirement ID(s): PULSE-REQ-SYA-009
- Related event / issue / ADR: PULSE-EVT-000008; PULSE-EVT-000010

## Problem / opportunity
Assignment planning and evidence capture existed as separate domain increments, but there was no deterministic read model joining immutable assignment slots, per-learner obligations, student reports and exact-evidence completion decisions.

## Impact and risk
- Student experience: eligible obligations project into a learner-specific worklist; exempted and other learners' obligations are excluded.
- Teacher experience: the review queue contains the latest submitted student report for each eligible obligation.
- Academic integrity: teacher observation is not substituted for student self-report; submission and verified completion remain distinct.
- Data: projections are rebuildable and do not mutate source assignment or evidence records.
- Security: these pure projections do not authenticate users or enforce teacher batch scope; inputs must be authorized and tenant-scoped by the server.

## Options and recommendation
Add pure read-model projections with unit tests. Keep database queries, RLS, role authorization, notifications and UI integration outside this increment.

## Decision and approval
Reversible domain-layer implementation. Academic approval of queue SLA, reassignment and verifier independence remains pending.

## Acceptance criteria
- [x] Student worklist contains only the requested learner's eligible obligations.
- [x] Exempted obligations are excluded from learner worklists.
- [x] Assignment title, subject, chapter, due date and ordered question slot are projected.
- [x] Submission is distinct from verified completion.
- [x] Completion decisions are matched to the exact current student evidence event.
- [x] Teacher queue includes submitted student reports only.
- [x] Teacher observations and cross-institute reports are not treated as student submissions.
- [x] Latest completion decision is reflected deterministically.
- [ ] Resolve data under authenticated learner/teacher scope with RLS.
- [ ] Add persistent queue actions and append-only verification decision writes.
- [ ] Add tenant/role integration tests and operational UI.

## Implementation evidence
- Branch: `feat/system-a-abhyas-foundation`
- PR: https://github.com/anshuljindalsecondbrain-art/pulse/pull/2
- Paths:
  - `apps/student-tracking/src/worklist-domain.ts`
  - `apps/student-tracking/src/worklist-domain.test.ts`

## Validation evidence
- Unit tests are included and must pass in System A CI on the exact PR head.
- No database, browser, end-to-end or production authorization validation is claimed.

## Open risks / next actions
- Server must derive authenticated learner identity; never trust a client-provided student ID.
- Server must scope teacher queue to assigned institute, centre, batch and academic responsibility.
- Add an explicit independent-review policy where the original teacher is not permitted to approve their own evidence, if required by academic governance.
- Add queue pagination and stable ordering for large cohorts.

## Amendments / supersession
None.
