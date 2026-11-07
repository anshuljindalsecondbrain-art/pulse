# PULSE — Internal Pilot Operating Model and Implementation Plan

**Document ID:** PULSE-PILOT-001  
**Status:** Owner-selected pilot operating model; implementation proposal  
**Decision date:** 2026-11-07  
**Scope:** Complete PULSE ecosystem operated internally by one Super Admin; real student records and pilot academic activity; no student login in the initial pilot.

## 1. Executive operating decision

PULSE will first be used as an internally operated academic system to identify workflow, data, usability, tagging, reporting and integration defects before any commercial rollout.

- One Super Admin login is used by the owner/operator.
- The Super Admin creates and maintains student records.
- Students do not receive login credentials in the initial pilot.
- The Super Admin operates all enabled PULSE modules, including QBMS, tagging/DTE, difficulty, System A tracking, tests, reports, analytics and AI-Mentor capabilities.
- Student activity is recorded by the Super Admin from offline/classroom evidence and other trusted source records.
- Student self-service, teacher logins, parent logins, multi-institute onboarding and commercial subscription workflows are deferred.
- The pilot is not a reason to remove tenant boundaries, canonical identity, provenance, auditability or authorization from the underlying architecture.

This is an operating-mode decision, not permission to expose the Supabase database or bypass security controls.

## 2. Pilot topology

`Super Admin (single authenticated operator)`
→ `PULSE workspace`
→ shared platform identity and academic context
→ module workspaces:
- Student Master
- Academic Structure / Module Catalogue
- QBMS Question Bank
- Tagging Engine / DTE
- Difficulty Engine
- Test and Assignment Management
- System A / Abhyas Matrix
- Student Activity and Evidence
- Verification, Correction and Doubt workflows
- Reports, Analytics and AI-Mentor
- Media and content management

Students exist as managed academic records. A student record does not require a linked Auth identity or student login. The operator records work on behalf of the student, while preserving the distinction between the student who performed the academic work and the operator who entered the record.

## 3. Pilot user and access model

### 3.1 Initial access

| Actor | Initial pilot access | Identity treatment |
|---|---|---|
| Super Admin / operator | Full authorised application access | One Supabase Auth login mapped to one canonical person |
| Student | No application login | Tenant-owned student record; optional person link; no Auth identity required |
| Teacher / reviewer / mentor | No separate login initially | Their observations are entered by the operator with explicit source/provenance; do not fabricate a teacher actor |
| Parent | No login or direct access | Deferred |

The application should expose a single-operator workspace, not a multi-role administration console. Internally, commands must still record the authenticated operator as the actor. Where the academic subject is a student, store the student reference separately from the operator actor.

### 3.2 Security boundary

- Do not use a service-role key in browser code.
- Do not grant broad database access merely because only one person operates the UI.
- Keep M0001's approved internal-only boundary intact.
- Before application connectivity, implement and review a narrow authenticated Super Admin access path, actor resolution, grants, RLS and command authorization.
- Do not create student Auth identities as a side effect of creating student records.
- Preserve tenant-qualified references and immutable academic evidence.
- Pilot data is real student data: apply data minimisation, access restriction, backups and retention controls. Do not use production student PII in disposable development fixtures.

## 4. Student Master workflow

The Super Admin can create, edit permitted profile fields, search, filter, archive/deactivate and inspect a student record.

Minimum pilot fields:
- generated student code / ID;
- student name;
- class / academic level;
- target exam and target year;
- subject/stream;
- centre and batch;
- admission/start date;
- active/inactive status;
- optional contact and guardian details only where operationally necessary and lawfully collected.

Canonical data ownership:
- `students` is tenant-owned and has mandatory `tenant_id`.
- `person_id` is optional and is identity association only; it does not grant access.
- `enrollments` connects a student to a batch with effective dates.
- `academic_context_epochs` preserves changes to academic context.
- Student creation must not require `tenant_memberships` or an Auth account.

## 5. Academic content structure

The pilot requires a navigable hierarchy:

`Subject → Module → Chapter → Exercise → Optional Exercise Subsection → Question inventory / question slots`

The user-facing labels may be configurable, but the underlying entities must not conflate content identity, grouping and student evidence.

### 5.1 Module and chapter

- A module is a named academic content unit within a subject/course context.
- A module may contain multiple chapters.
- A chapter may be referenced by multiple exercises.
- Preserve ordering, display names, source/module edition and active/archive state.
- Do not assume module and chapter are identical to QBMS taxonomy nodes.

### 5.2 Exercise and subsection

An exercise records:
- exercise name/code;
- subject and module/chapter scope;
- optional source/module edition;
- exercise type (DPP, homework, classwork, practice, revision, test or configured type);
- optional subsection;
- question count;
- default question type only as a convenience, not as a restriction;
- maximum marks and marking scheme where known;
- creation and version metadata.

An exercise may contain multiple question types. An optional subsection is a grouping layer, not a mandatory entity for every exercise.

### 5.3 Question inventory versus question-level records

Support two ingestion levels:

1. **Inventory-first:** store total question count and counts by question type/marks when individual question identities are not yet entered.
2. **Question-level:** create numbered slots and optionally link each slot to a QBMS question identity/version.

A count-only inventory cannot support reliable per-question tagging, exact student attempt history or question-level analytics. The UI must show whether an exercise is inventory-only, partially itemised or fully itemised.

For itemised questions, store at least:
- exercise slot/number;
- question type;
- marks and negative marks where applicable;
- optional QBMS question and version reference;
- optional chapter/topic/concept links through the tagging layer;
- source/provenance and validation state.

Question type, marks and difficulty are separate attributes. Do not encode all three in a single category.

## 6. Tagging and difficulty

The tagging engine is a first-class pilot module and can be operated by the Super Admin without student accounts.

- Taxonomy structure is managed independently from exercise grouping.
- A question may map to multiple concepts/topics and retain primary/secondary mappings where the taxonomy supports them.
- Store taxonomy schema/version and tagging run/review provenance.
- Keep manual, AI-suggested and reviewer-confirmed tags distinguishable.
- Do not overwrite source question content when tags change.
- Static difficulty and dynamic student-performance difficulty remain separate.
- Dynamic difficulty must be computed only when sufficient question-level evidence exists; inventory totals are not sufficient.
- QBMS remains canonical for question identity/content; DTE remains canonical for taxonomy mappings; System A references these identifiers without duplicating ownership.

## 7. Student activity tracking — both modes selected

**Owner selection:** Both exercise-level and question-level tracking are required.

### 7.1 Exercise-level quick entry

For a student × assigned exercise, the operator can record:
- assigned question count;
- attempted count;
- correct count;
- incorrect count;
- skipped/unattempted count;
- reported completion;
- completion date/time;
- source of information;
- operator remarks.

Validation:
- attempted cannot exceed the applicable assigned/itemised count;
- correct + incorrect cannot exceed evaluated/attempted count under the chosen evaluation policy;
- skipped/unattempted must not be silently treated as incorrect;
- totals and denominators must be explicit;
- if question-level events exist, exercise aggregates should be derived or reconciled against them rather than becoming a conflicting second truth.

### 7.2 Question-level detailed evidence

For each student × obligation × question slot, support:
- attempt/revision cycle;
- attempt timestamp or source date;
- student-reported outcome/state;
- answer evaluation (correct / incorrect / unevaluated);
- completion verification (separate from correctness);
- doubt event;
- teacher explanation/observation;
- correction/resubmission;
- source and entry provenance;
- operator actor and entry timestamp.

Do not infer a question attempt from an exercise-level count. Do not invent question-level detail to fill aggregate totals.

### 7.3 Reconciliation rules

- Exercise-level quick entry is the fast workflow.
- Question-level tracking is the detailed evidence workflow.
- When both are present, calculate aggregates from question-level records and compare them with entered totals.
- Show discrepancies for operator resolution; do not silently overwrite either record.
- A count-only record remains valid as aggregate evidence but is explicitly marked as not question-resolved.
- Reports must distinguish aggregate-only coverage from question-level evidence coverage.

### 7.4 Actor and subject semantics

The student is the academic subject of the record; the Super Admin is the authenticated data-entry actor. A teacher's action must be attributed to a teacher only when there is actual teacher-source evidence and a valid attribution rule. Operator-entered teacher observations must retain both the claimed source/teacher and the operator who entered them.

## 8. Reports and pilot defect discovery

The pilot must expose:
- student profile and academic context;
- module/chapter/exercise completion;
- assigned versus attempted versus evaluated counts;
- correct/incorrect/unevaluated and skipped counts;
- verified versus student-reported completion;
- question-level evidence coverage;
- tagging coverage and unresolved tags;
- difficulty distribution and evidence sufficiency;
- pending correction, doubts and revision;
- batch/centre rollups;
- data-quality exceptions and aggregate/question-level reconciliation discrepancies.

Every report should disclose its denominator, time window, source watermark and metric-policy version where applicable. A report must not present missing evidence as zero performance.

## 9. Pilot defect and feedback register

Create a structured internal defect register with:
- defect ID;
- module/workflow;
- severity and priority;
- reproducible steps;
- expected versus actual result;
- affected student/data scope (use non-identifying references in defect tickets);
- evidence attachment/reference;
- suspected root cause;
- status, owner and fix version;
- regression test reference.

Classify findings as data integrity, workflow, UX, performance, security/privacy, integration, AI quality or reporting defects. Maintain an audit trail of corrections to pilot data.

## 10. Delivery plan

### Pilot Phase P0 — Operating foundation
- Confirm one tenant and one Super Admin.
- Create the first Super Admin Auth-to-person mapping.
- Implement Student Master without requiring student Auth.
- Confirm centre, batch and enrollment setup.
- Establish safe real-student-data handling and backup/restore procedure.

**Exit:** operator can securely add, find and maintain student records; student login is not required.

### Pilot Phase P1 — Academic catalogue and inventory
- Implement subject/course, module and chapter catalogue.
- Implement exercise and optional subsection.
- Add inventory-first question counts and question-type/marks breakdown.
- Add itemised question slots and optional QBMS links.
- Add import/validation and duplicate warnings.

**Exit:** operator can enter a module/chapter/exercise and see question totals, type and marks without manually creating every question.

### Pilot Phase P2 — QBMS and tagging
- Connect or reuse canonical QBMS question records.
- Implement taxonomy/tagging workflows and provenance.
- Implement difficulty tagging with static/dynamic evidence separation.
- Add validation, review and unresolved-tag queues.

**Exit:** selected questions can be tagged, audited and reused without duplicate question identity.

### Pilot Phase P3 — Assignment and tracking
- Create assignments from exercises/question slots.
- Publish to a selected batch/student roster with immutable snapshot and idempotent obligations.
- Implement exercise-level quick entry.
- Implement question-level event capture.
- Implement discrepancy reconciliation and history.

**Exit:** the operator can record both aggregate completion and individual question outcomes without conflating them.

### Pilot Phase P4 — Verification, correction and doubt
- Add separate completion verification and answer evaluation.
- Add correction/resubmission and doubt workflows.
- Preserve append-only history and operator provenance.

**Exit:** all status changes are explainable and historical evidence remains intact.

### Pilot Phase P5 — Reports, analytics and AI-Mentor
- Build student, batch, chapter and exercise reports.
- Add evidence coverage and data-quality indicators.
- Activate AI recommendations only on sufficiently complete and traceable data.
- Record AI model/prompt/policy provenance and provide human review for consequential interventions.

**Exit:** reports are reproducible and AI outputs explain their evidence and uncertainty.

### Pilot Phase P6 — Full ecosystem validation
- Exercise integrated workflows across QBMS, tagging, tests, System A, analytics and AI-Mentor.
- Run end-to-end scenarios using pilot records.
- Record defects, fix, regression-test and retest.
- Decide readiness for student logins or expanded internal staff only after pilot evidence.

**Exit:** signed pilot review with unresolved risks, data-quality status, test evidence and next-stage decision.

## 11. Acceptance scenarios

1. Create a student with no person link and no Auth user.
2. Enroll that student in a batch without creating a tenant membership.
3. Create a module, chapter, exercise and optional subsection.
4. Enter an inventory of 40 questions split by type and marks without creating 40 QBMS records.
5. Convert selected inventory positions into numbered question slots and link existing QBMS versions.
6. Tag a question with multiple concepts and preserve taxonomy version/provenance.
7. Assign an exercise to a student/batch and snapshot the eligible roster.
8. Record exercise-level counts only and mark the evidence as aggregate-only.
9. Record individual question attempts for another exercise and derive aggregates.
10. Enter both aggregate and question-level evidence with a mismatch; system flags it for reconciliation.
11. Record correct/incorrect separately from completion verification.
12. Record a doubt, teacher observation, correction and resubmission without overwriting prior events.
13. Generate a report showing aggregate-only and question-level coverage separately.
14. Confirm that the student cannot log in because no student Auth identity/access has been provisioned.
15. Confirm the Super Admin is the authenticated actor for operator-entered events and no false teacher/student actor is fabricated.

## 12. Deferred capabilities

Deferred from the initial pilot UI, not necessarily removed from the long-term architecture:
- student login and self-report;
- teacher/reviewer/mentor logins;
- parent login and parent-facing reports;
- multi-tenant onboarding and billing;
- commercial subscription and support operations;
- self-service invitation and account recovery workflows.

## 13. Non-negotiable architecture rules

1. One operator does not mean one student record or one shared activity record.
2. Student identity, Auth identity, tenant membership and role grant remain separate.
3. Student activity must retain both academic subject and authenticated entry actor.
4. Aggregate counts must never be presented as question-level evidence.
5. Question-level evidence, where present, is append-only and traceable.
6. Exercise-level and question-level records must reconcile explicitly.
7. QBMS and DTE remain canonical owners of question content and taxonomy respectively.
8. Do not duplicate canonical question or taxonomy ownership in System A.
9. Preserve tenant-safe keys, history, audit and authorization.
10. No migration, production DDL, grant, RLS policy or Data API exposure is authorized solely by this pilot plan.
