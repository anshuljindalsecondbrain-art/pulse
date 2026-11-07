# Student Tracking System — Rewritten Execution Plan

**Plan date:** 2026-11-07  
**Governing baseline:** [Current Product Baseline](STUDENT_TRACKING_CURRENT_BASELINE.md)  
**Status:** Execution plan; no production implementation approval implied  
**Repository:** `anshuljindalsecondbrain-art/pulse`

## 1. Execution strategy

Build the approved 11-module Student Tracking System in dependency order. Prioritize a reliable single-Super-Admin pilot and persisted academic evidence over breadth, extra roles or speculative intelligence.

Do not expand into QBMS, System B/DTE, DRE, AI-Mentor, parent portal, student portal, test delivery, billing or A/B experiments.

## 2. Current starting point

### Verified application state
- Repository: `anshuljindalsecondbrain-art/pulse`.
- Active application branch at audit time: `feat/system-a-abhyas-foundation`.
- Audited branch head: `887e61c3dde4e9ad4dcaaf827260899ecedd2925`.
- PR #2 is open and must remain draft pending review.
- App: `apps/student-tracking`, React 19 + TypeScript + Vite.
- Main UI: `src/App.tsx`; exercise UI: `src/ExerciseBuilder.tsx`.
- The primary UI loads demo roster, exercises and marks from `localStorage` keys `pulse.demo.v2.*`.
- Demo roster and offline catalogue are fictional.
- Supabase client and `system-a-repository.ts` exist, but the primary UI does not call the repository adapter.
- The repository adapter is not production-ready authorization.
- The latest recorded Supabase inspection found no System A application tables or applied migration history in the connected PULSE project; the proposed migration remains unapplied.
- Domain-only TypeScript contracts and unit-test files exist for workflow, assignment planning, evidence submission, verification, correction, doubt, answer evaluation, worklists, timeline and academic eligibility.
- A domain test file existing is not proof that the suite currently passes. Re-run on the exact candidate commit.

### Verified limitations
- No persistent student-master workflow.
- No authoritative academic structure/enrolment workflow connected to the UI.
- Exercise creation and assignment are local prototype interactions.
- Assignment planning does not persist or transactionally publish obligations.
- Matrix changes do not append persistent evidence events.
- Verification and doubt contracts are not connected to production queues or persistence.
- Dashboard metrics are derived from local demo state.
- Several navigation entries do not prove completed modules.
- The one-Super-Admin pilot model is not implemented in the visible Demo Faculty / Teacher UI.

## 3. Phase plan and exit gates

### Phase 0 — Baseline and source-of-truth recovery
**Goal:** Establish one accurate and governed starting point.

Tasks:
- [ ] Confirm the authoritative application branch and PR head before each work batch.
- [ ] Preserve the existing draft PR; do not merge.
- [ ] Reconcile the current product baseline, old specifications, decision register, open issues and event register.
- [ ] Inspect the actual Supabase project, environment, schema, migration history, RLS, grants, functions, triggers and views using read-only access.
- [ ] Separate the older Lovable app from the newer System A Supabase project; never conflate their schemas.
- [ ] Create the module traceability matrix and current audit register.
- [ ] Record source evidence and audit limitations.

**Exit gate:** Product Owner accepts scope and operating model; live environment identity is verified. No DDL.

### Phase 1 — Pilot identity, Super Admin and security foundation
**Goal:** Make the one-operator pilot secure and attributable.

Tasks:
- [ ] Implement Super Admin sign-in and server-derived actor context.
- [ ] Align student records with shared identity decisions without requiring student Auth accounts.
- [ ] Implement tenant context and tenant-safe access boundaries.
- [ ] Define operation-by-operation authorization matrix.
- [ ] Define audit actor, source, timestamp, reason and correlation requirements.
- [ ] Add server-side command boundary; browser code must not supply trusted role claims.
- [ ] Prepare cross-tenant and unauthorized-operation tests.

**Exit gate:** Security design reviewed; Super Admin can be resolved from trusted authenticated context; no student login required.

### Phase 2 — Student Master and Academic Structure
**Goal:** Establish authoritative learner and academic references.

Tasks:
- [ ] Create/search/update/deactivate student records with duplicate checks.
- [ ] Define stable student identifiers and institute-scoped admission/roll number policy.
- [ ] Create academic session, class, stream, subject and chapter references.
- [ ] Define shared versus institute-owned catalogue policy (OPEN-011).
- [ ] Preserve source and operator for manual entry/import.
- [ ] Add validation, import preview and duplicate resolution.

**Exit gate:** Student and academic records persist; audit history exists; no localStorage is authoritative.

### Phase 3 — Batch and Enrolment Management
**Goal:** Make cohort membership historical and effective-dated.

Tasks:
- [ ] Create and manage batches.
- [ ] Enrol students with effective dates and recorded_by actor.
- [ ] Support transfer by closing prior membership and creating a new one.
- [ ] Preserve historical membership and prior assignment snapshots.
- [ ] Resolve OPEN-010 before adding active-enrolment uniqueness or overlap constraints.
- [ ] Resolve teaching assignment model (OPEN-018) only to the extent required for the pilot.

**Exit gate:** Transfers do not rewrite prior obligations; enrolment history is queryable.

### Phase 4 — Exercise / DPP Management
**Goal:** Create stable exercises and numbered slots without question-bank dependency.

Tasks:
- [ ] Create exercise drafts with subject, scope, chapter mapping, instructions and type.
- [ ] Support single-chapter, multi-chapter, cumulative and full-course scope.
- [ ] Generate stable slots Q1…QN.
- [ ] Keep question count separate from maximum marks.
- [ ] Support optional marking scheme and per-slot overrides.
- [ ] Version exercise content; published versions immutable.
- [ ] Allow optional external question reference without requiring QBMS.

**Exit gate:** A 20-slot DPP can be created, saved and reopened with stable slot identity and no question-bank dependency.

### Phase 5 — Assignment publication and student obligations
**Goal:** Turn an exercise into an auditable obligation for a defined population.

Tasks:
- [ ] Draft assignment with exercise-version references, targets, release time, due time and timezone snapshot.
- [ ] Resolve batch/student eligibility at publication time.
- [ ] Snapshot eligible and excluded students with reasons.
- [ ] Generate one obligation per applicable student × slot.
- [ ] Use a server-side transaction and idempotency key.
- [ ] Prohibit in-place edits to published versions; amendments create a new version and explicit obligation delta.
- [ ] Keep creator, publisher and approver attribution distinct where approval is enabled.

**Exit gate:** Retried publication creates no duplicates; later batch entrants do not inherit old assignments; failed publication leaves no partial obligations.

### Phase 6 — Abhyas Matrix and Activity Tracking
**Goal:** Replace local marks with reliable source evidence.

Tasks:
- [ ] Connect the matrix to persisted obligations and server projections.
- [ ] Support aggregate quick-entry mode and question-level mode.
- [ ] Preserve U/C/I/D/S/P as interaction vocabulary while storing independent canonical dimensions.
- [ ] Record operator, source, event time, server time, reason and idempotency key.
- [ ] Preserve prior events and display evidence history.
- [ ] Reconcile aggregate counts with detailed events; surface discrepancies.
- [ ] Add optimistic pending/saved/failed UI and safe retry.
- [ ] Keep CSV export permission-scoped and formula-injection-safe.

**Exit gate:** Every saved change is acknowledged by the server and traceable; failed writes remain visible and recoverable.

### Phase 7 — Verification and Correction
**Goal:** Separate completion confirmation from answer evaluation and correction.

Tasks:
- [ ] Implement review queue from persisted submitted evidence.
- [ ] Require exact report/evidence reference in each decision.
- [ ] Separate verification purpose from outcome.
- [ ] Record completion confirmation without implying correctness.
- [ ] Bind answer evaluation to exact evidence and slot.
- [ ] Start correction only from a valid returned decision.
- [ ] Preserve original report, decisions and attempt-cycle identity.
- [ ] Enforce reviewer authorization server-side.

**Exit gate:** Full report → verification → return → correction → resubmission → acceptance history is persisted and reproducible.

### Phase 8 — Doubt Tracking
**Goal:** Operate a complete doubt lifecycle.

Tasks:
- [ ] Raise doubt against exact eligible obligation/slot.
- [ ] Assign and reassign within authorized scope.
- [ ] Record investigation and explanation.
- [ ] Record resolution separately from student confirmation.
- [ ] Support reopening while preserving history.
- [ ] Build cohort summaries from persisted doubt events, not UI counters.

**Exit gate:** Incorrect answers are not automatically doubts; resolved and student-confirmed are distinct states.

### Phase 9 — Reports and Analytics
**Goal:** Publish governed, reproducible academic reporting.

Tasks:
- [ ] Approve metric definitions and policy version.
- [ ] Separate assigned, attempted, reported complete, verified complete, evaluated correct/incorrect, doubt pending, correction pending, skipped, exempted and removed.
- [ ] Use explicit denominators and date cut-offs.
- [ ] Provide student, batch, exercise and chapter reports.
- [ ] Reconcile aggregate and question-level sources.
- [ ] Make every metric drill down to source records.
- [ ] Do not implement AI risk scores or mentor interventions in this scope.

**Exit gate:** Reports can be independently recomputed from persisted records and explain their denominator/source.

### Phase 10 — Administration, audit and operational hardening
**Goal:** Complete the pilot controls and release evidence.

Tasks:
- [ ] Super Admin workspace and configuration.
- [ ] Immutable administrative audit log.
- [ ] Permission-denied, validation, empty, loading and failure states.
- [ ] Backup/restore and retention policy.
- [ ] Data export and controlled correction procedures.
- [ ] Performance checks for expected pilot volumes.
- [ ] Accessibility and responsive browser/device QA.
- [ ] Dependency and security review.

**Exit gate:** Operational runbook, test evidence, security sign-off and Product Owner release approval.

## 4. Mandatory end-to-end acceptance workflow

The first complete vertical slice must pass this exact workflow:

1. Super Admin signs in.
2. Super Admin creates a student.
3. Super Admin places the student in an active batch.
4. Super Admin creates an exercise with numbered slots.
5. Super Admin assigns the exercise to the batch.
6. System resolves the roster and creates obligations atomically.
7. Operator records aggregate activity or question-level evidence.
8. System preserves each event and actor provenance.
9. Authorized operator records completion verification and/or answer evaluation separately.
10. A returned item enters correction; resubmission creates new evidence.
11. A doubt can be assigned, resolved and separately confirmed.
12. Reports show the resulting progress and accuracy with traceable denominators.
13. Audit history shows who performed every operation and when.

No module is considered operational merely because a screen, menu item, type definition or pure function exists.

## 5. Test strategy

| Layer | Required tests |
|---|---|
| Unit | State transitions, count validation, eligibility, idempotency contracts, metric calculations |
| Database integration | Constraints, atomic publication, append-only evidence, concurrent retries |
| Authorization | Super Admin scope, tenant isolation, denied access, trusted actor resolution |
| Workflow | Exercise-to-report-to-verification-to-correction-to-report |
| Reconciliation | Aggregate-only, question-level and mixed-mode consistency |
| Browser E2E | Create student, enrol, create exercise, assign, track, verify, doubt, report |
| Accessibility | Keyboard navigation, labels, focus, contrast, touch and responsive layouts |
| Operational | Backup/restore, export, error recovery, audit completeness |

All validation must be run against the exact candidate commit and recorded with commit SHA, command, result and timestamp. Historical CI claims are not current test evidence.

## 6. Delivery rules

- Work in small, reviewable increments on a feature branch.
- Update requirements, event register, decision register, open issues and execution plan with each meaningful change.
- Do not overwrite historical decisions; mark them superseded with a reason and replacement reference.
- Do not create production migrations before live schema inspection and approval.
- Do not merge PR #2 or deploy to production without explicit approval.
- Never use real student records in demo/localStorage or protected preview.
- Report files changed, behavior changed, tests run, migration impact, security implications and unresolved risks for every increment.

## 7. Immediate next actions

1. Finish the domain logic and test audit on the current feature-branch head.
2. Reconcile the approved shared identity decisions with the Student Tracking pilot schema.
3. Finalize OPEN-010, OPEN-011 and OPEN-018 with their decision owners.
4. Produce the physical schema and authorization matrix for review only.
5. Build the Super Admin + Student Master vertical slice before expanding the UI.
