# PULSE-EVT-000017 — Add read-only learner evidence timeline

- Category: System A evidence projection
- Module(s): System A / Evidence Timeline
- Created / updated: 2026-11-06
- Status: IMPLEMENTED_PENDING_CI
- Origin and source reference: System A append-only evidence, verification, correction and doubt event contracts.
- Requirement ID(s): PULSE-REQ-SYA-015
- Related event / issue / ADR: PULSE-EVT-000008; PULSE-EVT-000011; PULSE-EVT-000012; PULSE-EVT-000013; PULSE-EVT-000014; PULSE-EVT-000015; PULSE-EVT-000016

## Problem / opportunity
System A now has independent immutable records for learner reports, academic decisions, correction transitions and doubt transitions. Consumers need one chronological view without creating a second source of academic truth or collapsing independent workflow dimensions.

## Decision
Add a pure, read-only timeline projection. Each entry retains a composite timeline ID, source type and exact source reference. Evidence uses occurredAt as event time and retains recordedAt separately. Decisions use decidedAt. Correction and doubt events retain their own occurredAt. Completion verification, answer evaluation, correction review, doubt lifecycle and correction lifecycle remain distinct event kinds. Superseded evidence and decisions remain visible with explicit forward/reverse supersession references where the source contract supports them.

Decision records are joined only through their exact evidenceEventId and validated institute/obligation scope. Correction transitions are joined through the exact correction cycle; doubt events are joined through the exact doubt case. No assignment publication event is synthesized because no corresponding immutable publication event contract is currently available.

## Acceptance criteria
- [x] Project student reports and teacher observations as distinct kinds.
- [x] Project completion verification and answer evaluation separately.
- [x] Project correction submissions, reviews and lifecycle transitions.
- [x] Project doubt raise, assignment, investigation, resolution, student confirmation and reopening events.
- [x] Apply exact institute/student scope and optional obligation/question-slot filters.
- [x] Join decisions only through exact evidence identity and matching scope.
- [x] Preserve historical and superseded records; do not replace prior entries.
- [x] Sort deterministically by eventAt then composite source ID.
- [x] Preserve event time separately from recording/decision time.
- [x] Freeze returned entries and result collection; do not mutate source records.
- [x] Reject duplicate IDs within each source collection.
- [ ] Derive scope from authenticated server context and enforce database RLS.
- [ ] Add persistent query, database indexes, API endpoint and operational UI.
- [ ] Add database integration and browser/accessibility tests.

## Security and scope
This is a domain-only read projection. Its scope argument and input collections are caller-supplied; they are not proof of authorization. The production caller must obtain records through an authenticated, tenant-scoped server boundary. The projection does not persist, mutate, authenticate or authorize. No live database writes or migrations were performed.

## Implementation evidence
- Branch: feat/system-a-abhyas-foundation
- PR: https://github.com/anshuljindalsecondbrain-art/pulse/pull/2
- Paths: apps/student-tracking/src/evidence-timeline-domain.ts; apps/student-tracking/src/evidence-timeline-domain.test.ts

## Validation
Exact-head typecheck, complete unit suite, production build, governance checks and both required GitHub Actions workflows must pass before this event is marked validated.
