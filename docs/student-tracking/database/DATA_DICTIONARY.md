# System A — Logical Data Dictionary

**Document ID:** STS-DB-DICTIONARY-001  
**Version:** 1.0.0  
**Status:** Logical baseline; not a deployed physical dictionary  
**Date:** 2026-11-07

> Table and column names below are logical names. Physical naming, types, constraints, nullability and FK targets must be reconciled with the approved shared PULSE schema before migration authoring.

## 1. Shared platform entities (owned outside System A)

| Logical entity | Purpose | Key data / constraints |
|---|---|---|
| tenants | Institute/platform tenant | Stable tenant ID, name/status, timezone/config |
| people | Human/business identity | Stable person ID; not the same as Auth UID |
| person_auth_identities | Person ↔ Auth UID mapping | Provider/auth subject, person ID, validity and verification |
| tenant_memberships | Person association with tenant | Tenant/person pair, status, effective dates |
| tenant_role_grants | Action permissions and scope | Tenant, person, role/permission, resource scope, effective dates |
| students | Student business identity | Tenant, person link optional, admission identifier, profile/status |
| centres | Institute centre | Tenant-qualified identity and status |
| batches | Academic cohort | Tenant/centre/session/class/stream and status |
| student_enrolments | Student ↔ batch/programme | Effective dates, enrolment kind/status, transfer reason |
| subjects | Academic subject catalogue | Global or tenant ownership must be explicit |
| chapters | Subject chapter reference | Ownership/version and subject relationship must be tenant-safe |

## 2. System A-owned entities

| Logical entity | Purpose | Important fields / constraints |
|---|---|---|
| exercises | Stable exercise identity | id, tenant_id, created_by_person_id, lifecycle |
| exercise_versions | Immutable exercise definition | exercise_id, version_no, label, type, subject/scope, publication metadata |
| exercise_slots | Numbered positions Q1…QN | exercise_version_id, slot_no, display label, optional chapter/type/marking overrides |
| slot_question_links | Optional QBMS identity/version link | slot_id, question_id, question_version_id, link version/status; not required for operation |
| assignments | Stable assignment identity | tenant_id, author, lifecycle, current version pointer |
| assignment_versions | Immutable assignment publication version | assignment_id, version_no, release_at, due_at, timezone, approval/publication events |
| assignment_items | Assignment version composition | assignment_version_id, exact exercise_version_id, ordering |
| assignment_targets | Requested target groups/persons | assignment_version_id, target kind/ref and publication resolution rules |
| assignment_target_snapshots | Resolved publication roster | exact student/enrolment reference at publication time, source batch and snapshot time |
| student_obligations | A student’s responsibility for a slot | tenant_id, assignment item, slot, student, target snapshot, eligibility and due-time snapshot |
| obligation_events | Exemption/removal/amendment history | obligation_id, event type, actor, reason, effective time, source version |
| attempt_cycles | Distinct practice cycles | obligation_id, cycle number/type, start/end, initiating actor |
| student_report_events | Append-only learner report | obligation, attempt cycle, work-progress state, actor, event time, idempotency key |
| teacher_observation_events | Append-only teacher observation | obligation, observation type, actor, reason, evidence reference |
| answer_evaluations | Independent correctness assessment | exact evidence/report reference, evaluator, outcome, rationale, version |
| verification_decisions | Purpose-specific academic verification | evidence reference, purpose, outcome, reviewer, decision time |
| correction_cycles | Correction workflow identity | obligation, returned decision, cycle, status projection |
| correction_events | Append-only correction history | correction cycle, transition, actor, reason, predecessor event |
| doubt_cases | Student-specific doubt case | obligation, originating report, assignee, status projection, priority |
| doubt_events | Append-only doubt history | case, event type, actor, body, server time |
| disputes | Challenge to exact academic record | report/decision reference, claimant, reason, lifecycle |
| dispute_events | Append-only dispute history | dispute, transition, actor, reason |
| appeal_decisions | Independent appeal decision | dispute, reviewer, outcome, rationale, decided_at |
| recognition_decisions | Recognition of previous evidence | target obligation, exact source evidence, policy, approver, state |
| audit_events | Sensitive-operation history | tenant, actor person, action, target, request/correlation ID, metadata |
| transactional_outbox | Post-commit integration delivery | event type/payload, idempotency, delivery status, retry metadata |
| progress_projection_runs | Projection calculation provenance | policy version, source watermark, started/completed, status |
| student_progress_snapshots | Rebuildable student metrics | student, cohort, policy version, calculated_at, metric payload |

## 3. Common field standards

- Primary keys: choose UUID or another type to match the canonical platform; do not mix incompatible key types without an explicit integration contract.
- Tenant key: use the shared canonical tenant key and composite FK constraints where required.
- Actor identity: business actor is canonical person; retain Auth provenance separately where required.
- Time: use `timestamptz`; distinguish client occurrence time from database-recorded time.
- Audit: record actor, action, target, reason, timestamp, request/correlation ID.
- Idempotency: each retryable command has a unique key scoped to actor/tenant/command with payload-conflict detection.
- Version: use positive version numbers and stable aggregate IDs.
- Status: use separate dimensions and purpose-specific transitions, not one overloaded enum.
- Deletion: archive/deactivate/restrict; no cascade across academic evidence.
- JSON: only for genuinely variable extension payloads or metadata; do not hide core relationships in JSON arrays.

## 4. Status dimensions that must remain distinct

| Dimension | Examples |
|---|---|
| Work progress | NOT_STARTED, ATTEMPTED, REPORTED_COMPLETE, SKIPPED, PARTIALLY_COMPLETE |
| Answer outcome | NOT_EVALUATED, CORRECT, INCORRECT, PARTIALLY_CORRECT |
| Doubt lifecycle | OPEN, ASSIGNED, IN_PROGRESS, RESOLVED, STUDENT_CONFIRMED, REOPENED |
| Verification purpose | ATTEMPT, COMPLETION, ANSWER_EVALUATION, CORRECTION, INDEPENDENT_SOLVE |
| Verification outcome | CONFIRMED, NOT_CONFIRMED, RETURNED, REJECTED, ACCEPTED |
| Correction lifecycle | REQUIRED, IN_PROGRESS, RESUBMITTED, ACCEPTED, CLOSED |
| Assignment publication | DRAFT, IN_REVIEW, APPROVED, SCHEDULED, PUBLISHED, SUPERSEDED, WITHDRAWN |
| Obligation eligibility | ELIGIBLE, EXEMPTED, REMOVED, RECOGNISED, DISPUTED |

These are proposed domain vocabularies; exact final enum/type representation is subject to academic-owner approval.

## 5. Metric provenance

Every reported/verified/accuracy metric must identify:
- numerator and denominator;
- eligible obligation population;
- source event precedence;
- treatment of skipped, unattempted, exempted, removed and recognised work;
- report versus verified versus evaluated status;
- policy version;
- source watermark;
- calculation timestamp.

Do not treat absence of a report as proof of non-completion without an explicit policy.


## 6. Source-workflow correction — offline module question selection

The uploaded System A source specifies that teachers select already-existing, tagged questions from offline academic modules. They do not normally author questions or create new question content in System A. Therefore the initial physical workflow uses these logical entities:

- `sa_source_catalogs`: module/book/source catalogue reference.
- `sa_source_editions`: edition or source revision.
- `sa_source_questions`: stable local reference to a question locator in that source; not canonical question content.
- `sa_assignment_items`: selected question references within an immutable assignment version.
- `sa_target_snapshots`: publication-time eligible student roster.
- `sa_student_obligations`: one student × one selected question item.

QBMS question identity/version and DTE classification mappings are optional, version-aware integration references. System A must remain operational when they are absent. The physical column-level proposal is in [PHYSICAL_DATABASE_BLUEPRINT.md](PHYSICAL_DATABASE_BLUEPRINT.md).

Exercise/worksheet grouping may remain as a UI or assignment packaging abstraction if the existing app requires it, but it must not force System A to own question content or create a second question bank.
