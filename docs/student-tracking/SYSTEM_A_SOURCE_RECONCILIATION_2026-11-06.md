# System A — Source Reconciliation and A2 Decisions

**Date:** 2026-11-06  
**Status:** Architecture review proposal; not a production schema or migration approval  
**Scope:** Reconcile the supplied `STUDENT TRACKING SYSTEM.docx`, the existing System A specifications, and the current frontend/domain contracts.

## 1. Executive decision

System A remains the independent Student Work Tracking / Abhyas Matrix system. It must be operational on day one using a subject, optional chapter/scope, exercise label, numbered exercise slots, a target roster, and assignment timing. A QBMS question identity, DTE taxonomy, concept, sub-concept, model archetype, or difficulty enrichment must not be a prerequisite.

The existing `SYSTEM_A_DATABASE_ARCHITECTURE.md` and `SYSTEM_A_MASTER_COMPLETION_SPECIFICATION.md` are the current logical design baselines. This document records reconciliation decisions and identifies items that must not be copied directly into a production migration.

## 2. Reconciled requirements

| Source requirement | Canonical System A interpretation |
|---|---|
| Create a DPP using chapter, label and question count | Create an exercise draft and numbered slots; chapter is optional for cumulative/multi-chapter work |
| Assign to a batch | Resolve the eligible roster at publication time and persist explicit student obligations |
| Track a student's response per question | Track one student-obligation × exercise-slot relationship |
| Allow XII students to receive XI revision | Eligibility policy evaluates source class/syllabus against learner cohort; preserve the source exercise scope |
| Support COMMON Physics/Chemistry content | Treat subject/stream compatibility as an eligibility rule, not a hard-coded UI restriction |
| Support mock/full-course assessments | Permit nullable exercise-level chapter and optional chapter mapping per slot |
| Support both question count and marks | Keep slot count and marks/marking scheme independent; both may coexist |
| Permit revision retests | Create a new assignment/obligation or an explicitly modelled practice cycle; never overwrite prior evidence |
| Preserve evidence after batch transfer | Effective-dated batch membership plus publication-time target snapshot |
| Enrich question analytics later | Add optional, versioned QBMS/DTE enrichment links; never rewrite source evidence |
| Track doubts separately | Individual doubt cases/events, with cohort aggregation as a derived projection |
| Show parents progress | Read-only access through a verified, revocable parent-student relationship or carefully scoped report link |

## 3. Canonical model boundaries

### 3.1 Shared platform identity — reuse, do not duplicate

System A must reference the canonical PULSE institute/tenant, authenticated person, student, batch, membership/enrollment, and role-grant entities once their shared schema is approved.

Do not introduce a second independent set of `sa_institutes`, `sa_students`, `sa_batches`, or `sa_institute_memberships` if the platform already owns those identities. System A may own module-specific assignment and evidence records, but their foreign keys must point to the canonical platform identities and enforce tenant consistency.

**Blocker:** The exact canonical identity table names and key relationships must be confirmed against the current shared-platform branch before any SQL is authored.

### 3.2 System A-owned entities

The System A domain should own the following records (names are logical names, not final SQL names):

- `exercises` and immutable `exercise_versions`
- `exercise_slots` (stable Q1…QN positions)
- `assignments` and immutable `assignment_versions`
- `assignment_targets` and publication-time target snapshots
- `student_obligations`
- `obligation_events`
- `attempt_cycles`
- append-only `student_report_events`
- separate `teacher_observation_events` and `evaluation_events`
- purpose-specific `verification_decisions`
- `correction_cycles`
- `doubt_cases` and `doubt_events`
- `disputes`, `appeals`, and `recognition_decisions`
- rebuildable progress/risk projections with source watermarks and policy versions

Do not collapse these objects into one large status table. Their identities, history, and authorization requirements differ.

### 3.3 Question identity and taxonomy are optional external enrichment

A System A slot exists independently. It may later receive a versioned link to an exact QBMS question identity and question version. DTE taxonomy mappings are separately versioned enrichment.

The later link must not change:
- which student was assigned the slot;
- which assignment/exercise version was published;
- what the student reported;
- what a teacher observed;
- which evidence was evaluated or verified.

The uploaded document's taxonomy extension SQL (sub-concepts, model questions/archetypes, secondary concept arrays) belongs to QBMS/DTE governance, not the System A operational schema.

## 4. Status vocabulary reconciliation

The sources contain three different vocabularies:

1. Supplied document's day-one workflow: Correct, Incorrect, Doubt, Solved by Teacher, Unattempted.
2. Current frontend interaction: U, C, I, D, S, P (Unattempted, Correct, Incorrect, Doubt, Skipped, Partially Correct).
3. Canonical domain model: separate work progress, answer evaluation, doubt, verification, correction and eligibility dimensions.

**Decision:** Preserve the current six-state frontend as an interaction vocabulary for now. Do not treat it as the complete persisted domain state, and do not silently replace it with the older five-state list.

The canonical model must keep these dimensions separate:
- work progress;
- answer evaluation;
- doubt lifecycle;
- teacher verification;
- correction lifecycle;
- eligibility/exemption/removal.

" Solved by Teacher " is not a student answer status. It must be represented as a teacher-attributed observation or verification/evaluation event with actor, purpose, time and evidence reference.

The final user-facing labels and transition policy require academic-owner review before migration.

## 5. Uploaded migration/code: items to reject or defer

The supplied document includes SQL and code snippets. They are design material, not approved migrations.

| Proposed snippet/approach | Disposition | Reason |
|---|---|---|
| Add sub-concept/model-question tables to the tracking migration | Reject from System A | These are QBMS/DTE enrichment entities and violate the tracking/tagging boundary |
| Add `secondary_concept_ids` array to questions | Defer to QBMS/DTE | Taxonomy relationship design belongs in the question knowledge model, not System A |
| Add `UNATTEMPTED`, `SKIPPED`, `PARTIALLY_CORRECT` to a shared `q_status` enum | Do not apply | Shared enum ownership and semantics are unverified; the six UI inputs are not a canonical single enum |
| Security-definer matrix RPC with `SET search_path = public` and `is_staff()` | Reject as written | Requires hardened search_path, trusted actor derivation, explicit grants, tenant/assignment scope checks, and reviewed security tests |
| Client-supplied actor role or broad staff check | Reject for authorization | Roles and permissions must be resolved from trusted server-side membership/grant records |
| Parent link `/p/:secure_token` with zero-login access | Defer pending threat model | Requires short-lived/revocable tokens, narrow student/report scope, rate limiting, leak protection, audit, and explicit parent relationship policy |
| Write every matrix cell immediately without a batch transaction | Defer | Must support idempotency, atomicity or explicit partial-save semantics, conflict handling and event history |
| A/B experiments and telemetry in first schema | Defer | Experiment allocation and event telemetry should not block the operational tracking MVP |

No SQL from the supplied document is authorized for application to the connected Supabase project.

## 6. A/B experiments: retain as a separate product workstream

The supplied document proposes five experiments:

1. Faculty roll-call logging speed: classic table/modal vs tactile stepper.
2. Classroom doubt triage: open doubt list vs aggregated Doubt Radar.
3. Mentor early-warning: sortable table vs cohort heat strip.
4. Student evening backlog: full curriculum tree vs daily target.
5. Parent engagement: authenticated portal vs tokenized report card.

These are valid product hypotheses, not confirmed product decisions. Preserve them in an experimentation backlog. Before implementation:
- define baseline and variant interaction contracts;
- define cohort-level randomization and contamination rules;
- pre-register primary, secondary and guardrail metrics;
- define event schemas and retention;
- ensure experiment assignment does not affect academic outcomes or access rights;
- use privacy-minimizing telemetry;
- review tokenized parent access separately.

The stated numerical hypotheses (for example, >70% faster logging or >80% parent link engagement) are targets to test, not measured results.

## 7. Product requirements to carry into A2

### Exercise and assignment
- Quick exercise creation should remain a short path: subject, optional chapter/scope, exercise label, number of slots, question type/marking defaults, target batch/students, due date.
- Question count and marks must be independent fields.
- Support batch and individual targeting.
- Support revision across class levels through explicit eligibility rules.
- Support COMMON subject/stream content through an explicit compatibility policy.
- Support full-course and multi-chapter work without forcing a single chapter foreign key.
- Assignment publication must create obligations idempotently and transactionally.

### Matrix
- Matrix input must be low-latency, keyboard accessible and touch usable.
- Save behavior must have explicit pending/saved/error/conflict states.
- Batch save should be idempotent and preserve an auditable event trail.
- Wrong/doubt counts must be calculated from the relevant current evidence and denominators; skipped/unattempted must not be counted as incorrect.
- Cohort aggregates must not erase individual doubt cases.

### Parent and mentor views
- Parent views are read-only and relationship-scoped.
- Mentor access is explicitly granted and time-bounded.
- WhatsApp sharing is a delivery channel, not an authorization system.
- Any token-based view requires a dedicated security design before implementation.

## 8. A2 decisions still requiring explicit approval

The following are not safe to infer from the supplied material:

1. **Canonical shared identity:** exact platform table names, tenant key, person/auth mapping, student mapping and batch membership model.
2. **Publication amendment policy:** when a published assignment is amended, whether existing obligations are retained, replaced, withdrawn or supplemented.
3. **Matrix semantics:** whether U/C/I/D/S/P are teacher-entered observations, student self-reports, or a configurable view over both. The current frontend's interaction actor must be explicit.
4. **Teacher "solved" meaning:** whether this means teacher explained the question, student independently solved after intervention, or teacher verified a correct solution. These are different events.
5. **COMMON stream policy:** which subjects and content are shareable across JEE/NEET and which require explicit mapping.
6. **Parent access:** authenticated portal vs secure report link; do not implement zero-login access until approved.
7. **Experiment priority:** select one experiment only after the baseline workflow and telemetry definitions are stable.

## 9. A2 exit criteria

A2 is complete only when all of the following are reviewed and recorded:

- canonical shared identity map is confirmed;
- System A-owned entity list and foreign-key ownership are approved;
- assignment publication and amendment semantics are approved;
- evidence actor/source semantics are approved;
- status dimensions and transition rules are approved;
- tenant boundary and authorization matrix are approved;
- QBMS/DTE enrichment contract is explicitly optional and versioned;
- migration plan is reviewed against the live empty Supabase project;
- no duplicate identity tables or taxonomy dependencies remain in the System A migration proposal.

**No database migration is included in this commit. No Supabase schema or production data is changed.**
