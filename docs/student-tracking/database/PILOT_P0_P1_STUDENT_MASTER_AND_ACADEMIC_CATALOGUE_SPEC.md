# PULSE Pilot — P0 Student Master and P1 Academic Catalogue Specification

**Document ID:** PULSE-PILOT-P0P1-001  
**Status:** Implementation specification; no DDL or UI implementation authorized  
**Date:** 2026-11-07  
**Parent:** [PULSE Pilot Operating Model](PULSE_PILOT_OPERATING_MODEL_AND_IMPLEMENTATION_PLAN.md)

## 1. Objective and scope

Deliver the first usable pilot workflows:
- Create and maintain student records using one Super Admin login.
- Organise academic content as Subject → Module → Chapter → Exercise → optional Exercise Subsection.
- Record exercise question inventory by question type, count and marks.
- Allow individual question slots to be added later without requiring them at initial exercise creation.
- Preserve canonical QBMS question identity and DTE taxonomy ownership; do not create duplicate question banks or taxonomies.

Out of scope for P0/P1: student/teacher/parent login, assignment publication and activity capture (P3), tagging workflow implementation (P2), dynamic difficulty, AI-Mentor, billing and multi-institute onboarding.

## 2. P0 — Student Master

### 2.1 Screens
1. Student list: search by student code/name; filter by class, target, batch, centre and active state; sort and paginate.
2. Add student: compact form with required identity/academic fields and optional contact fields.
3. Student profile: overview, current academic context, enrolment history and later activity/report tabs.
4. Edit student: update permitted profile fields without rewriting historical enrolments or activity.
5. Archive/deactivate: preserve the record and all linked history; never hard-delete a student with academic evidence.

### 2.2 Field contract

| Field | Requirement | Notes |
|---|---|---|
| Student ID | System-generated, required | Stable internal UUID; display code may be generated |
| Student code | Required for pilot display | Unique within tenant; immutable after issue unless controlled correction |
| Full name | Required | Preserve entered spelling; avoid forced uppercase |
| Class/academic level | Required | Controlled selection, not free text |
| Target exam | Required where applicable | Configurable values; examples JEE / NEET / other |
| Target year | Required where applicable | Four-digit target year |
| Subject/stream | Required where applicable | Controlled selection |
| Centre | Optional | Select canonical same-tenant centre |
| Batch | Optional at creation | Attach through explicit enrollment, not a free-text field |
| Admission/start date | Required | Date-only business value; timezone conversion must not shift the date |
| Status | Required | Active / inactive; preserve history |
| Phone/email | Optional | Collect only when operationally necessary |
| Guardian details | Optional/deferred | Do not make guardian identity/access part of P0 |

### 2.3 Identity and relationship invariants
- Student record creation does not create a people row, tenant membership or Auth user by default.
- students.tenant_id is authoritative; person_id remains optional and is never an authorization grant.
- Batch placement is represented by an enrollments record with effective dates.
- Do not encode batch as an unverified free-text student attribute.
- Do not enforce a one-active-enrollment rule while OPEN-010 / RECON-004 remains unresolved.
- A student may be inactive while historical enrolments, assignments and evidence remain readable under authorized access.
- Duplicate detection warns on likely matches; never auto-merge student identities.

### 2.4 Student creation validation
- Required values must be present and valid.
- Target year must use an explicitly configured allowed range; do not hard-code a permanent exam horizon.
- Student code uniqueness is tenant-scoped.
- A likely duplicate shows candidate records and requires operator choice.
- If batch is selected, create student and enrollment atomically or show a clear failure with no partial student.
- Capture authenticated operator and creation timestamp in audit/provenance.
- Do not store unnecessary sensitive information.

## 3. P1 — Academic Catalogue Builder

### 3.1 Navigation hierarchy
Subject → Module → Chapter → Exercise → Exercise Subsection (optional) → Question Inventory / Question Slots

This is a navigation/source-organisation structure, not the QBMS taxonomy hierarchy.

### 3.2 Catalogue objects

**Subject** — name/code, display order, active/archive state. Pilot examples: Physics, Chemistry, Mathematics, Biology. Catalogue ownership (global versus tenant-owned) remains OPEN-011. Isolate pilot records to the configured pilot tenant until ownership is decided; do not freeze permanent physical ownership based on this convenience.

**Module** — name/code, subject reference, optional course/class/target scope, display order, source edition/reference and status. A module groups chapters and remains distinct from a chapter and QBMS question identity.

**Chapter** — name/code, subject reference, optional module relationship according to catalogue rules, display order, syllabus/source reference and status. A chapter may be referenced by multiple exercises; preserve stable identity when its display name changes.

**Exercise** — name/code, subject/module/chapter scope, exercise category, source module/edition, display order, status and version. Configurable types may include DPP, homework, classwork, practice, revision, part test, review test and full test. An exercise may span multiple chapters; do not force one chapter field for genuinely multi-chapter work. Used/published versions must not be silently rewritten.

**Exercise subsection (optional)** — belongs to one exercise version; has name/label and order. Examples: Section A, Objective, Integer Type, Assertion-Reason. Exercises without subsections remain first-class.

### 3.3 Exercise question inventory

**Mode A — Inventory-first**
- Enter total question count.
- Add one or more inventory rows containing question type, count, marks per question and optional negative marks.
- Sum of row counts must equal total question count.
- If marks differ within a type, create separate inventory rows.
- Inventory rows do not create canonical QBMS questions or individual student-question obligations.
- Calculate maximum marks from the versioned inventory and marking scheme; allow reviewed section-level rules where simple multiplication is insufficient.

**Mode B — Itemised question slots**
- Generate numbered slots Q1…Qn.
- Each slot can have question type, positive marks, negative marks, optional chapter/subsection and optional QBMS question/version reference.
- Slots are local exercise positions, not canonical question identities.
- A slot can exist before a QBMS link is available.
- A linked QBMS question preserves the exact question version used by the exercise.
- Question tagging is attached through DTE mapping references, not copied taxonomy fields.

### 3.4 Question type catalogue

Question type is configurable/versionable and independent of marks and difficulty. Initial pilot suggestions:
- Single Correct MCQ
- Multiple Correct MCQ
- Numerical / Integer
- Assertion–Reason
- Match the Following
- Comprehension / Paragraph
- Subjective / Descriptive
- Diagram / Graph based
- Other (requires a label)

These are pilot suggestions, not an immutable exam taxonomy. Preserve source-specific labels. Do not assume every question type uses the same answer evaluation method.

### 3.5 Marks contract
- Marks per question are numeric and non-negative.
- Negative marking is stored separately as a non-negative penalty magnitude or explicit scoring rule; UI may display it as -1.
- Do not assume every exercise uses +4/-1.
- Support fractional marks where required.
- Store the marking scheme at the appropriate exercise/version or inventory-row level.
- Total marks are derived from versioned inventory/slots and scheme; do not maintain an independently editable total that can drift.
- If marks are unknown, preserve an explicit not-configured state rather than silently defaulting to zero.

## 4. Relationship and ownership boundaries

| Concept | Owner / responsibility |
|---|---|
| Student, centre, batch, enrollment | Shared PULSE identity/academic core |
| Subject/module/chapter catalogue | Ownership decision OPEN-011; pilot-scoped configuration pending governance |
| Exercise and exercise version | Academic content/assignment domain; System A if used for tracked work |
| Exercise slot | System A / exercise version |
| Canonical question and question version | QBMS |
| Taxonomy schema/nodes/mappings | DTE / tagging engine |
| Difficulty rules and history | Difficulty engine |
| Student attempts/reports/verification/correction | System A |

No P0/P1 workflow should create a second source of truth for QBMS question content or DTE taxonomy.

## 5. Suggested UI layout

**Student workspace**
- Primary action: Add Student.
- Search bar and filters.
- Table columns: Student Code, Name, Class, Target, Batch, Centre, Status, Last Updated.
- Profile tabs: Overview, Academic Enrolments, Assignments (later), Activity (later), Reports (later), Audit History (restricted).

**Academic workspace**
- Left navigation/tree: Subject → Module → Chapter.
- Main panel: selected chapter and its exercises.
- Exercise editor: details, subsection list, inventory rows, question slots.
- Clear status indicator: Inventory only / Partially itemised / Fully itemised.
- Validation panel: count mismatch, missing marks, duplicate slot numbers, missing chapter scope, unresolved QBMS links.

Responsive behavior: desktop split navigation/editor; tablet collapsible tree; mobile single-column navigation/forms and no dense editable inventory grid.

## 6. Audit and provenance

For create/update/archive actions retain authenticated operator identity, action timestamp, entity and ID, before/after values or structured change record, and source/import reference where applicable. Editing a profile or catalogue label must not overwrite student activity evidence.

## 7. Acceptance criteria

1. Super Admin creates a student without student Auth identity.
2. Student saves without a person link.
3. Student can be created before batch assignment.
4. Batch assignment creates tenant-safe enrollment.
5. Duplicate warning permits operator choice; no auto-merge.
6. Deactivation preserves history.
7. Search/filter/pagination return stable results.
8. Operator provenance is captured.
9. Super Admin creates subject, module and chapter in pilot catalogue.
10. A chapter can be referenced by multiple exercises.
11. Multi-chapter exercise is representable without duplicating chapter records.
12. Exercise can exist without subsection.
13. Exercise can have multiple optional subsections.
14. Inventory-only exercise saves without question records.
15. Inventory counts reconcile exactly to total question count.
16. Multiple question types and marks coexist in one exercise.
17. Negative and fractional marks are represented without hard-coded exam assumptions.
18. Itemised slots can be added later and linked to exact QBMS versions.
19. Inventory-only, partially itemised and fully itemised states are visible.
20. Changes preserve referenced/published history.

## 8. Implementation dependencies and release gate

- Confirm actual application source repository and deployment target before UI implementation.
- Confirm Supabase environment designation and current schema/migration baseline before database implementation.
- Resolve or explicitly defer OPEN-011 catalogue ownership with a safe pilot boundary.
- Review field/relationship contract against canonical shared-core and existing System A workflow.
- Implement server-side validation, actor provenance, tenant-safe references and authorization before persistent UI connectivity.
- No SQL migration, remote DDL, grants, RLS changes, Data API exposure, production deployment or branch merge is authorized by this specification.

## 9. Decisions intentionally not made

- Global versus tenant-owned subject/chapter catalogue (OPEN-011).
- Final academic level, stream and target-exam vocabulary.
- Whether module/chapter source references need a formal edition registry.
- Exercise publication/approval rules (OPEN-003, OPEN-021, OPEN-023).
- Final question-type dictionary for all supported exams.
- Final exact physical table names and columns.

These require evidence from existing project specifications and the canonical application/database baseline; do not silently hard-code assumptions.