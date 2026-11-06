# PULSE-EVT-000004 — Stabilize exercise creation and batch view semantics

- Category: Prototype stabilization
- Module: System A / Abhyas Matrix
- Created: 2026-11-06
- Status: IMPLEMENTED_PENDING_CI
- Origin: System A Master Completion Specification; audit findings PULSE-ISSUE-0003 and PULSE-ISSUE-0004.
- Branch: feat/system-a-abhyas-foundation
- PR: https://github.com/anshuljindalsecondbrain-art/pulse/pull/2

## Problem
The batch selector changed the selected exercise's batch assignment, which altered exercise semantics and could make the displayed roster misleading. Exercise creation also rendered an uncontrolled subject selector and hardcoded every new exercise to Physics.

## Change
- Introduced a separate selectedBatch view state.
- Batch selector now changes only the displayed roster filter and does not mutate exercise.batch.
- Exercise creation now stores the selected subject.
- Subject selector is controlled by React state and resets to Physics after successful creation.

## Invariants
- Changing the batch view must not mutate an exercise's assigned batch.
- Creating a Chemistry, Mathematics or Biology exercise must preserve the selected subject.
- This remains a local demo prototype; it does not create published assignment snapshots or student obligations.

## Validation
- Source-level change committed in apps/student-tracking/src/App.tsx.
- CI for commit 4810ca2a793543b119ecd0f1b4655295d3fa497f must pass before marking the change validated.
- Browser interaction tests are not yet present; these behaviors still require browser-level regression coverage.

## Risks / limitations
- Batch filtering can display learners from a different batch against the selected exercise in this prototype. This is a view filter only, not assignment eligibility. A future assignment/obligation model must enforce eligibility.
- No database or API changes were made.

## Follow-up
- Add Playwright coverage for batch non-mutation and selected-subject persistence.
- Continue Priority 0 stabilization: storage schema validation, date handling, empty states, CSV formula injection, Delete shortcut, metric semantics and accessibility.
