> **Superseded execution plan (2026-11-07):** This file is retained as historical planning evidence. The current staged execution order and acceptance gates are maintained in [Student Tracking Execution Plan](STUDENT_TRACKING_EXECUTION_PLAN.md), governed by [Current Product Baseline](STUDENT_TRACKING_CURRENT_BASELINE.md). Do not execute the older role model, scope, phase order or database assumptions without reconciliation against those current documents.

# System A — Implementation Plan and Delivery Backlog

**Status:** Approved working plan; implementation readiness is conditional on locating the live application and Supabase environment.  
**Date:** 2026-11-06  
**Branch:** `feat/system-a-abhyas-foundation`

## 1. Audit findings (verified)

- Repository: `anshuljindalsecondbrain-art/pulse`, private, default branch `main`.
- `main` contains documentation only (38 paths); no application source tree, package manifest, Supabase migrations or test project were present in the inspected tree.
- The repository's AI-agent instructions require live repository and Supabase inspection before DDL, small reversible changes, tests, feature branches and reviewed PRs.
- The current GitHub branches inspected (`feat/pulse-domain-core`, `feat/pulse-foundation`, and selected `feat/pulse-v10-*` branches) resolve to the same commit/tree as one another; they do not expose an alternate app source tree.
- The earlier `/tracker` implementation is described in project notes but is not present in the inspected GitHub `main` tree.
- The connected Supabase tool currently returns no projects. No live database schema or migration history is available through this connection.
- The existing Student Tracking specification confirms day-one operation without DTE tags, optional question identity/version links, lightweight numbered slots and immutable source evidence.

**Consequence:** We can safely establish architecture, requirements, backlog and test design now. We cannot responsibly edit the live tracker, generate a migration against the actual schema, or claim an application build/test until the correct source branch/repository and Supabase project are connected.

## 2. Product boundary

System A owns:
- academic work assignment and publication;
- student-level obligations;
- student report events;
- teacher verification decisions;
- practice attempt cycles;
- correction and resubmission;
- doubt resolution;
- disputes and appeals;
- recognition of previous evidence;
- progress projections and intervention signals.

System A does not own:
- canonical question content/version lifecycle (QBMS);
- deep classification taxonomy or question-to-concept mappings (DTE);
- difficulty algorithms and difficulty history (DRE);
- test delivery/result engine beyond references and marking inputs needed by tracking.

A local numbered exercise slot is always available. A canonical question reference is optional.

## 3. Delivery phases

### Phase 0 — Source and environment recovery (blocking)
Tasks:
- [ ] Identify the authoritative deployed application repository/branch.
- [ ] Confirm whether the earlier `/tracker` page exists in Lovable, another GitHub repository, or an unpushed branch.
- [ ] Connect the correct Supabase organisation/project and identify dev/staging vs production.
- [ ] Inspect live tables, columns, enums, constraints, indexes, views, RPCs, triggers, extensions, grants, RLS, storage policies, edge functions and migration history.
- [ ] Inspect application routes, auth, tenant context, data-access patterns, UI components, tests, build scripts and CI.
- [ ] Produce legacy-to-System-A mapping and risk register.

Exit gate: verified as-built diagram and reuse/change plan. No production DDL.

### Phase 1 — Contract and foundation
- [ ] Finalize domain vocabulary and state-transition matrix.
- [ ] Confirm tenant, institute, centre, student, batch, subject, chapter and staff relationship model.
- [ ] Define immutable exercise/assignment version contract.
- [ ] Define publication approval, self-approval prohibition, idempotency and timezone rules.
- [ ] Define server-side authorization matrix for every operation.
- [ ] Create migration test harness and RLS test fixtures.
- [ ] Agree progress metric policy version 1.

Exit gate: schema review, permission review, migration plan and acceptance tests approved.

### Phase 2 — Quick Exercise Creator and slot scaffolder
- [ ] Create exercise draft with label, subject, optional chapter, type, question count and default question type.
- [ ] Generate Q1…QN slots transactionally.
- [ ] Support both question count and maximum marks.
- [ ] Support multi-chapter exercises by assigning optional chapter scope per slot.
- [ ] Save immutable exercise versions on publication.
- [ ] Validate no DTE or QBMS tag dependency.
- [ ] Open the Abhyas Matrix directly after successful assignment.

Acceptance:
- Teacher can create a 20-question Kinematics DPP without question records or tags.
- Slots are sequential and unique per exercise version.
- Failed creation leaves no partially created slots.
- Repeated request with same idempotency key does not duplicate exercise/slots.

### Phase 3 — Assignment publication and obligation engine
- [ ] Draft → review → approval → scheduled/published workflow.
- [ ] Creator cannot approve own assignment version.
- [ ] Resolve batch/selected-student targets at publication time.
- [ ] Generate one obligation per student × assigned slot.
- [ ] Snapshot batch membership and responsibility at assignment time.
- [ ] Keep release time separate from due time.
- [ ] Enforce configured timezone and late policy.
- [ ] Make publication idempotent.
- [ ] Add immutable version amendment and obligation-delta handling.

Acceptance:
- Batch assignment creates exactly N obligations per eligible student.
- New batch members do not inherit old assignments.
- Batch transfer does not rewrite old obligations.
- Retried publication creates no duplicates.
- Published versions cannot be edited in place.

### Phase 4 — Abhyas Matrix and student reporting
- [ ] Matrix rows = students; columns = exercise slots.
- [ ] Distinguish student-reported state from teacher verification in the UI.
- [ ] Cell detail opens complete event history.
- [ ] Keyboard navigation and configurable shortcuts.
- [ ] Bulk save with atomic transaction or explicit per-row outcome.
- [ ] Optimistic UI must show pending, saved and failed states; never claim saved before server acknowledgement.
- [ ] Retry failed saves safely with idempotency keys.
- [ ] Filter/search students and question slots; freeze name column; horizontal scrolling.
- [ ] Server-side pagination and question/batch aggregates.
- [ ] Mobile-first touch workflow.

Acceptance:
- Arrow navigation and shortcuts work without hijacking text inputs.
- Every report is an append-only event.
- Duplicate network retries do not create duplicate report events.
- Failed save is visible and recoverable.
- No frontend-only authorization.

### Phase 5 — Verification, correction and practice cycles
- [ ] Independent verification workspace.
- [ ] Distinct purposes: attempt, completion, answer evaluation, correction and independent solve.
- [ ] Distinct decision outcomes; answer correctness never inferred from completion.
- [ ] Bulk verification writes one decision per obligation/report.
- [ ] Correction cycle references exact returned decision and report.
- [ ] Resubmission appends a new report linked to correction cycle.
- [ ] Correction does not create a new practice attempt.
- [ ] New revision assignment creates a fresh obligation and attempt context.
- [ ] Verification authority independent of exercise creator.

Acceptance:
- Teacher can confirm attempt without evaluating correctness.
- Teacher can confirm completion while leaving answer correctness unevaluated.
- Returned work remains unverified until accepted correction.
- Original report and verification decision remain visible.

### Phase 6 — Doubt management and Doubt Radar
- [ ] Create a doubt case from an explicit student DOUBT report.
- [ ] Assign/escalate to authorised subject teacher.
- [ ] Record teacher resolution and student confirmation independently.
- [ ] Cohort-level resolution creates individual student events.
- [ ] Radar ranks question slots by open doubt count, incorrect evaluation rate and repeated returns.
- [ ] Threshold configurable per institute/batch.
- [ ] Add concept grouping only after DTE enrichment exists.

Acceptance:
- Incorrect is not silently treated as doubt.
- Solved by teacher is not equivalent to independently solved.
- Radar works with slot IDs only.

### Phase 7 — Progress, mentor and parent views
- [ ] Versioned progress metric policy.
- [ ] Separate assigned, attempted, reported complete, verified complete, correct, incorrect, doubt pending, returned, correction pending, skipped, recognised, fresh practice required, exempted and disputed.
- [ ] Rebuildable projections and as-of reporting.
- [ ] Mentor risk indicators with explainable inputs.
- [ ] Intervention record with follow-up and outcome.
- [ ] Parent read-only view with explicit child link and authorised fields.

Acceptance:
- Reported and verified progress never share a numerator.
- Accuracy denominator is evaluated questions only.
- Removed/exempted/recognised/disputed obligations remain explainable.
- Parent cannot mutate or see unrelated student data.

### Phase 8 — Recognition, disputes and DTE enrichment
- [ ] Explicit reviewed one-to-one question equivalence.
- [ ] Recognition decision links target obligation to exact source evidence.
- [ ] One-to-many/many-to-one requires academic approval.
- [ ] Revocation is a new decision and triggers affected projections.
- [ ] Dispute references exact report/verification decision.
- [ ] Appeal reviewer independent of original verifier.
- [ ] DTE enrichment job stores mapping/schema revision and is idempotent.
- [ ] Historical evidence remains unchanged.

Acceptance:
- AI similarity alone never recognises work.
- New attempt cannot resolve an old-attempt dispute.
- DTE tagging later changes derived grouping, not original evidence.

## 4. Proposed route/workspace map

Keep route count small; use role-aware shared workspaces:
- `/tracking` — teacher tracking dashboard and assigned exercises.
- `/tracking/exercises/new` — quick creator.
- `/tracking/exercises/:exerciseVersionId` — exercise detail/version history.
- `/tracking/assignments/new` — assignment builder and target selection.
- `/tracking/assignments/:assignmentVersionId` — publication and obligation detail.
- `/tracking/matrix/:assignmentVersionId/:exerciseVersionId` — Abhyas Matrix.
- `/student/work` — student obligations and reporting.
- `/teacher/verification` — verification queue.
- `/tracking/doubts` — Doubt Management and Radar.
- `/mentor/students` — early warning and interventions.
- `/parent/child/:studentId` — read-only parent view.
- `/academic/reviews` — approvals, recognition and disputes.

Final route naming must follow the existing application's routing convention after source recovery.

## 5. API/RPC contract candidates

These are logical operations, not final function names or signatures:
- create_exercise_draft
- generate_exercise_slots
- create_assignment_draft
- submit_assignment_for_review
- approve_assignment_version
- publish_assignment_version (idempotent)
- append_student_report
- append_verification_decision
- open_correction_cycle
- append_correction_resubmission
- open_or_update_doubt_case
- resolve_doubt_for_student
- create_recognition_decision
- raise_dispute
- record_appeal_decision
- get_abhyas_matrix_page
- get_progress_snapshot

Each operation must validate actor, tenant, relationship scope, lifecycle state and idempotency on the server/database. Avoid exposing broad SECURITY DEFINER RPCs as generic write APIs.

## 6. Quality and security gates

Every phase requires:
- typecheck/build and lint where supported;
- unit tests for state transitions and metric calculations;
- integration tests for transaction boundaries and idempotency;
- RLS tests for allowed and denied access;
- cross-tenant access tests;
- historical immutability tests;
- regression tests for legacy tracker behavior;
- migration dry-run and rollback/recovery review;
- performance checks on realistic roster/slot volumes;
- audit of view security and RPC execution grants.

No production migration, production data backfill or merge to `main` without explicit review and approval.

## 7. Immediate next actions

1. Connect the actual application source. If the tracker currently lives in Lovable, identify the PULSE project and sync/confirm its GitHub repository and branch. If it lives elsewhere, connect that repository.
2. Connect the Supabase project used by that application. The current Supabase connector returned an empty project list.
3. Run Phase 0 against those exact assets.
4. Convert the approved logical architecture into ordered migrations and implementation PRs.
5. Build the MVP in this order: quick exercise → publication/obligations → matrix/reporting → verification/correction.

## 8. Explicit non-goals for the first MVP

Do not block the MVP on:
- concept/sub-concept/archetype tagging;
- AI doubt clustering;
- predictive risk scoring;
- parent WhatsApp token cards;
- question similarity/equivalence automation;
- microservices or a new event streaming platform.

First prove that an institute can reliably create, assign, report and independently verify question-level academic work with complete history.
