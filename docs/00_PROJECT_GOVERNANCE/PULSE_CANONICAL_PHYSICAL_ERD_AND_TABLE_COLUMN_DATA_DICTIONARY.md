# PULSE — Canonical Physical ERD and Table/Column Data Dictionary

- Document ID: PULSE-DATA-CORE-009
- Version: 0.1.0
- Status: Draft — proposed physical contract; product, academic, technical and security approval pending
- Date: 2026-11-06
- Parent: PULSE-DATA-CORE-001 through PULSE-DATA-CORE-008
- Target: Supabase PostgreSQL 17
- Implementation authorization: Not granted
- Migration execution authorization: Not granted

## 1. Purpose and decision boundary

This document closes the design gap between the logical model, authorization matrix, migration specification, repository dependency audit, API contract, transaction design and physical authorization mapping. It defines a candidate physical inventory, key strategy, tenant-qualified relationships, uniqueness/idempotency rules, append-only behavior and implementation sequence.

It is not executable SQL and does not claim these objects exist. The live PULSE Supabase project was inspected on 2026-11-06 and has zero application tables, zero applied migrations and zero Edge Functions. No live database change is authorized by this document.

The uploaded Student Tracking source document is treated as a requirements source for:
- Day-1 operation with subject/chapter, exercise label and numbered question slots.
- No dependency on Topic, Concept, Sub-concept or Model Archetype being populated.
- Independent System A operational tracking and System B progressive deep enrichment.
- Retroactive diagnostics when a stable question reference later receives a concept/sub-concept mapping.
- Fast exercise scaffolding and a low-friction matrix.
- Six classroom states in the source: Correct, Incorrect, Doubt, Solved by Teacher, Unattempted and Skipped. The repository additionally models Partially Correct; the academic owner must confirm whether this is a seventh distinct state or an evaluation outcome.
- XII and Droppers may receive XI revision items; XI must not receive XII-only items.
- COMMON stream for shared Physics/Chemistry content.
- Multi-chapter/full-syllabus assessment support.
- Decimal marks including negative scores.
- Simultaneous question-level tracking and marks-based assessment.
- Re-test cycles and syllabus lifecycle.
- Five proposed experiments with measurable metrics and guardrails.

The source also includes older SQL examples with legacy table names, array-based secondary tags and a SECURITY DEFINER matrix RPC. Those snippets are not authoritative schema instructions and must not be applied unchanged.

## 2. Canonical ownership and schema boundary

| Domain | Proposed owner/schema | Responsibility |
|---|---|---|
| Tenant and person identity | Shared platform | Tenant, people, Auth identity mapping, memberships and role grants |
| Academic organization | Shared academic core | Centres, students, guardian links, batches, enrollments and effective-dated academic context |
| System A | `public.sa_*`, internal helpers in `app_private` | Exercises, versions, slots, assignments, obligations, attempts, evidence, evaluation, verification, correction and doubts |
| QBMS | QBMS-owned schema/API | Stable question identity, immutable question versions, sources and media |
| DTE | DTE-owned schema/API | Configurable classification schemes, taxonomy nodes/edges, mappings, reviews and history |
| Analytics | Derived projections/materialized views | Cohort, learner, concept and operational metrics |
| Experimentation | Platform governance/analytics | Variant assignment and append-only telemetry |

System A must not require a QBMS question ID or DTE mapping to create an exercise, publish an assignment, open a matrix or record evidence. A question slot can initially reference a local stable slot identity. Later enrichment can associate that slot with a QBMS question/version and DTE mappings without rewriting original evidence.

## 3. Physical key and tenancy rules

1. Use UUID primary keys for shared and module-owned entities.
2. Every tenant-owned row carries `tenant_id`, or is reachable only through a tenant-qualified parent with a composite FK proving the same tenant.
3. Add `UNIQUE (tenant_id, id)` to parent tables referenced by tenant-qualified composite FKs.
4. Child references use `FOREIGN KEY (tenant_id, parent_id) REFERENCES parent(tenant_id, id)`; globally unique UUIDs alone are not the tenant-integrity proof.
5. Global catalogue ownership must be explicit. Do not represent global-vs-tenant ownership with an ambiguous nullable tenant key unless uniqueness and access rules are separately specified.
6. Store timestamps as `timestamptz` in UTC; calendar dates as `date`; render in tenant timezone.
7. Store marks as `numeric(8,2)` (or higher reviewed precision) and permit negative marks where the assessment scheme permits them.
8. Use constrained text/reference tables for institution-configurable values. Use enums only for stable lifecycle values with a migration policy.
9. Never accept actor identity, actor role, tenant membership or permission scope from browser payload as authorization truth.
10. Avoid arrays for relational many-to-many tags. Use mapping tables with tenant-qualified FKs, effective versions and provenance.

## 4. Candidate physical inventory

### 4.1 Shared platform and academic core

| Table | Essential columns | Candidate keys and constraints |
|---|---|---|
| tenants | id, name, timezone, status, created_at, updated_at | PK id; validated timezone/status |
| people | id, display_name, created_at, updated_at | PK id |
| person_auth_identities | id, person_id, auth_user_id, identity_kind, linked_at, revoked_at | UNIQUE(auth_user_id) for one-person-per-Auth identity unless owner approves another model |
| tenant_memberships | id, tenant_id, person_id, status, valid_from, valid_to | UNIQUE(tenant_id,id); effective-date check; reviewed partial unique index for active membership |
| tenant_role_grants | id, tenant_id, membership_id, role_key, scope_type, centre_id, valid_from, valid_to, granted_by | Tenant-qualified FKs; effective-date check; explicit role/action catalogue |
| centres | id, tenant_id, name, status | UNIQUE(tenant_id,id), UNIQUE(tenant_id,name) subject to archive/rename policy |
| students | id, tenant_id, person_id nullable, student_code, full_name, status | UNIQUE(tenant_id,id), UNIQUE(tenant_id,student_code); optional person link |
| parent_student_links | id, tenant_id, parent_person_id, student_id, relationship_type, verification_status, verified_by, verified_at, valid_from, valid_to, revoked_at | Tenant-qualified student FK; verified tenant relationship required before parent access |
| batches | id, tenant_id, centre_id, name, class_level, stream, programme, status | UNIQUE(tenant_id,id); centre FK tenant-qualified |
| enrollments | id, tenant_id, student_id, batch_id, valid_from, valid_to, status, created_by | Tenant-qualified FKs; no overlapping active enrollments by default, subject to explicit exception policy |
| academic_context_epochs | id, tenant_id, student_id, enrollment_id nullable, class_level, stream, programme, syllabus_version, effective_from, effective_to | Tenant-qualified FKs; non-overlapping effective periods per context dimension |
| audit_events | id, tenant_id nullable, actor_person_id nullable, action, resource_type, resource_id, reason, correlation_id, occurred_at, recorded_at, metadata | Append-only; restricted access |
| domain_events | id, tenant_id, aggregate_type, aggregate_id, event_type, event_version, payload, correlation_id, causation_id, recorded_at | Append-only integration/outbox envelope; not a substitute for domain tables |

### 4.2 System A exercise and assignment model

| Table | Essential columns | Candidate keys and constraints |
|---|---|---|
| sa_exercises | id, tenant_id, owner_centre_id nullable, subject_ref, chapter_ref nullable, title, lifecycle_status, created_by, created_at | UNIQUE(tenant_id,id); chapter nullable for multi-chapter/full-syllabus |
| sa_exercise_versions | id, tenant_id, exercise_id, version_no, status, marking_scheme_id, created_by, created_at, published_at | UNIQUE(tenant_id,id), UNIQUE(tenant_id,exercise_id,version_no); immutable after publication |
| sa_exercise_slots | id, tenant_id, exercise_version_id, slot_no, local_question_ref, qbms_question_id nullable, qbms_question_version_id nullable, question_type_ref, max_marks, sequence_order | UNIQUE(tenant_id,id), UNIQUE(tenant_id,exercise_version_id,slot_no); QBMS refs optional and version-pinned when present |
| sa_marking_schemes | id, tenant_id, name, scoring_mode, correct_marks, incorrect_marks, partial_marks, unattempted_marks, version | Versioned; negative incorrect marks permitted; decimal precision |
| sa_assignments | id, tenant_id, exercise_id, lifecycle_status, created_by, created_at | UNIQUE(tenant_id,id) |
| sa_assignment_versions | id, tenant_id, assignment_id, version_no, exercise_version_id, target_snapshot_id, due_at, status, published_at | UNIQUE(tenant_id,id), UNIQUE(tenant_id,assignment_id,version_no); published version immutable |
| sa_assignment_targets | id, tenant_id, assignment_version_id, target_type, target_id | Tenant-qualified target semantics and validation |
| sa_assignment_items | id, tenant_id, assignment_version_id, exercise_slot_id, item_order, marks_override nullable | UNIQUE(tenant_id,id), UNIQUE(tenant_id,assignment_version_id,item_order); slot must belong to pinned version |
| sa_student_obligations | id, tenant_id, assignment_version_id, assignment_item_id, student_id, source_batch_id nullable, eligibility_status, created_at | UNIQUE(tenant_id,id), UNIQUE(tenant_id,assignment_version_id,assignment_item_id,student_id); immutable publication snapshot |
| sa_attempt_cycles | id, tenant_id, obligation_id, cycle_no, opened_at, closed_at, reason | UNIQUE(tenant_id,id), UNIQUE(tenant_id,obligation_id,cycle_no) |
| sa_evidence_events | id, tenant_id, obligation_id, attempt_cycle_id nullable, event_type, work_status nullable, source_actor_person_id, source_actor_role_snapshot, client_occurred_at nullable, recorded_at, idempotency_key, payload, supersedes_event_id nullable | UNIQUE(tenant_id,id); append-only; actor role is audit snapshot, not authorization truth |
| sa_answer_evaluations | id, tenant_id, obligation_id, attempt_cycle_id, evidence_event_id, outcome, marks_awarded nullable, rationale, evaluator_person_id, policy_version, supersedes_evaluation_id nullable, recorded_at | Exact evidence FK; append-only; idempotency key |
| sa_verification_decisions | id, tenant_id, obligation_id, evidence_event_id, purpose, outcome, reviewer_person_id, reason, supersedes_decision_id nullable, recorded_at | Exact evidence FK; append-only; purpose-specific uniqueness/idempotency |
| sa_correction_cycles | id, tenant_id, obligation_id, returned_decision_id, cycle_no, status, opened_at, closed_at | Exact returned decision FK; UNIQUE(tenant_id,obligation_id,cycle_no) |
| sa_doubt_cases | id, tenant_id, obligation_id, opened_by_person_id, status, assigned_to_person_id nullable, opened_at, closed_at | Tenant-qualified obligation FK; independent lifecycle |
| sa_doubt_events | id, tenant_id, doubt_case_id, event_type, actor_person_id, reason, idempotency_key, recorded_at, payload | Append-only; UNIQUE(tenant_id,doubt_case_id,idempotency_key) |
| sa_student_interventions | id, tenant_id, student_id, batch_id nullable, intervention_type, trigger_source, owner_person_id, action_at, outcome, follow_up_at | Append-only outcome history; scope-bound |
| sa_experiment_assignments | id, tenant_id, experiment_key, experiment_version, subject_kind, subject_id, variant, assigned_at | Deterministic assignment; UNIQUE(tenant_id,experiment_key,experiment_version,subject_kind,subject_id) |
| sa_experiment_events | id, tenant_id, experiment_assignment_id, event_name, occurred_at, recorded_at, idempotency_key, properties | Append-only; tenant-scoped idempotency |

### 4.3 QBMS and DTE integration contracts

| Domain | Required model | Integration rule |
|---|---|---|
| QBMS | questions, question_versions, question_sources, question_media, question_relationships | A published exercise slot pins question identity and version; QBMS owns content |
| DTE | taxonomy_schemas, taxonomy_schema_versions, taxonomy_nodes, taxonomy_edges, question_taxonomy_mappings, question_concept_links, question_tagging_runs, question_review_events | Mapping is versioned, many-to-many and human-governed; mappings do not rewrite evidence |
| Cross-module bridge | Slot-to-question enrichment link | Link a local slot to stable QBMS question/version; resolve DTE mappings through that version and schema version |

## 5. Integrity and concurrency constraints

### 5.1 Assignment publication

One transaction must validate trusted actor identity, active membership, role grant and centre/batch scope; validate the draft and pinned exercise version; resolve target students using effective-dated enrollment/context; snapshot target membership and assignment items; insert obligations with deterministic uniqueness; publish the assignment version; append audit/domain events; and return a stable result.

Retrying the same command must return the original publication outcome or deterministic idempotent result without duplicate obligations.

### 5.2 Evidence submission

- Accept obligation ID, attempt cycle, learner-reported work status, optional client event time and idempotency key.
- Resolve Auth UID to person and learner identity server-side.
- Require an eligible obligation belonging to the resolved student and tenant.
- Server recorded time is authoritative; client time is provenance only.
- Same idempotency key returns the prior event; a correction creates a new event.
- Evidence is append-only.

### 5.3 Batch matrix writes

Production batch save must validate one tenant, batch, assignment version and authorized actor; validate every obligation and slot; enforce payload size and schema; apply idempotency per cell/event; append immutable evidence; and return per-cell outcomes without partial silent writes.

Do not implement the uploaded SECURITY DEFINER RPC in the exposed public schema. Any privileged function requires independent review, explicit EXECUTE grants, trusted actor derivation, fixed search_path, strict scope checks and negative authorization tests. Prefer invoker-security operations where possible.

## 6. Product decisions — recommended defaults, not silent approvals

| Decision | Recommended default | Rationale |
|---|---|---|
| Auth identity mapping | One active Auth UID maps to one person; account linking requires verification | Prevent identity collision |
| Student profile multiplicity | One student profile per tenant per learner identity; duplicates use explicit merge | Preserve institute codes/history |
| Concurrent active batch enrollment | Disallow overlapping active enrollment by default; allow explicit dual-enrollment exception | Avoid ambiguous assignment targeting |
| Role scope | Tenant-wide or centre-scoped grants; batch scope derived from resource/assignment | Least privilege |
| Parent access | Verified, time-bounded, revocable parent-student link; read-only by default | Token-only access is insufficient |
| Subject/chapter ownership | Shared canonical catalogue plus tenant-owned overlays/versioned labels | Global-vs-tenant semantics must be explicit |
| Academic context | Effective-dated class, stream, programme, syllabus and batch context | Support XI/XII/Dropper/COMMON/revision |
| Separation of duties | Configurable; distinct reviewer for high-stakes decisions | Operational flexibility |
| Break-glass support | Disabled by default; time-bound, reason-coded and audited | Least privilege |
| Event persistence | Domain-specific append-only tables authoritative; generic event envelope is outbox/integration only | Avoid duplicate sources of truth |
| Question status semantics | Work status, answer outcome, verification and doubt remain independent; confirm Partially Correct placement | Prevent semantic conflation |
| Re-test semantics | New attempt cycle under same obligation unless a new assignment is explicitly created | Preserve attempt history |

## 7. Source-driven UI and analytics requirements

### 7.1 Day-1 exercise scaffolder
Fields: subject, chapter (optional for multi-chapter/full-syllabus), exercise label, question count, question type/marking scheme, target batch and due date. It creates numbered local slots without waiting for QBMS/DTE tags.

### 7.2 Abhyas matrix
- Student rows × question slots.
- Keyboard and touch operation.
- Six source classroom states; Partially Correct remains separately governed pending decision.
- Fast batch save with visible state, recoverable errors and per-cell results.
- Per-question cohort counts for wrong, doubt, unattempted and completed.
- Configurable thresholds with explicit denominators.

### 7.3 Progressive enrichment
When a stable slot/question is linked to QBMS and later receives DTE mappings, analytics may recompute concept aggregates across historical evidence. Original evidence, assignment snapshot, question version and event time remain unchanged. Projections record taxonomy/schema version.

### 7.4 Academic compatibility
- XII and Droppers can receive eligible XI revision content; XI cannot receive XII-only content.
- COMMON supports shared subject modules.
- Multi-chapter/full-syllabus assessments are valid.
- Question-level and marks-based tracking coexist.
- Decimal and negative marks follow the selected marking scheme.
- Re-tests use attempt cycles.
- Syllabus lifecycle distinguishes ACTIVE, DEPRECATED and ADVANCED_ONLY; exact semantics require academic approval.

## 8. A/B experimentation contract

The uploaded source proposes five experiments: faculty roll-call speed, doubt triage, mentor early-warning triage, student backlog momentum and parent assurance. These remain hypotheses, not validated outcomes.

Every experiment must have a versioned hypothesis, randomization unit, deterministic assignment, primary metric, secondary metric, guardrail metrics, minimum sample/duration, stopping rule, privacy review and decision log. Variant assignment should be stable for a subject within an experiment version; do not re-randomize on every page load.

- Faculty fast-log: median completion time, compliance within 2 hours; guardrail accidental correction rate.
- Doubt radar: high-difficulty roadblock resolution and weekly unresolved backlog; guardrail false cohort closure and unaddressed individual doubts.
- Mentor heat strip: time from decline to intervention; guardrail missed/false at-risk alerts and inappropriate parent contact.
- Student daily target: DPP completion and active days; guardrail hidden backlog, learner stress and missed overdue work.
- Parent assurance: report open rate and support-call rate; guardrail unauthorized disclosure, link forwarding, token replay and expiry.

Parent tokenized cards must not be built as bearer links without cryptographic entropy, expiry, revocation, rate limiting, minimal data exposure, access audit and a security review. A no-login convenience flow does not remove the need for authorization.

## 9. Authorization matrix baseline

| Resource | Student | Parent | Teacher | Reviewer | Mentor | Content admin | Institute admin |
|---|---|---|---|---|---|---|---|
| Own student profile | Read limited | Read linked only | Assigned scope | Assigned review scope | Assigned scope | No | Manage tenant |
| Batch roster | No | No | Assigned batches | Review scope | Assigned scope | No | Tenant scope |
| Exercise draft | No | No | Create by grant | Review | No | Maintain catalogue refs | Manage policy |
| Published assignment | Own only | Linked student only | Assigned batches | Review scope | Authorized scope | No | Tenant scope |
| Own evidence | Create/read own | Linked summary only | Observe assigned scope | Review exact evidence | Authorized projection | No | Audited access |
| Evaluation/verification | Read permitted feedback | Approved summary | Only by grant | Create append-only decisions | Read permitted summary | No | No routine authoring |
| Doubt case | Raise/read own | Linked summary only | Assigned scope | Assigned scope | If assigned | No | Audited support |
| DTE mapping | No | No | Read published if permitted | Read | Derived view | Create/review by grant | Configure tenant |
| Experiment telemetry | No raw cohort data | No | Aggregated only | Aggregated only | Aggregated only | No | Authorized analytics |

Every table and RPC requires an explicit row predicate, column exposure decision, GRANT matrix and negative test. Role labels alone do not authorize access.

## 10. Migration sequence and release gates

1. Reconcile source migrations and every code/query/type dependency; preserve old SQL as source evidence only.
2. Approve shared identity, tenant, membership, role and academic-context decisions.
3. Build a new unified migration lineage in an isolated local/test database.
4. Create private authorization helpers and tenant-qualified constraints before exposed policies.
5. Add RLS and grants per table; default deny.
6. Add invoker-security read projections and narrow transactional commands; privileged functions require independent review.
7. Seed multiple tenants, centres, roles, parent links, XI/XII/Dropper/COMMON and cross-tenant adversarial cases.
8. Replay from an empty database and upgrade from any approved baseline; no destructive rewrite.
9. Run schema diff, constraint, RLS negative, concurrency/idempotency tests and Supabase advisors.
10. Connect UI behind an explicit environment feature flag; demo mode remains isolated.
11. Deploy protected Preview; validate exact commit, browser workflows, keyboard/touch, accessibility, mobile, network failure and recovery.
12. Production activation requires owner approval, backup/restore rehearsal, environment configuration, data protection review and release sign-off.

## 11. Acceptance criteria

- System A creates and publishes an exercise with local numbered slots and no QBMS/DTE dependency.
- Every tenant-owned relationship has a tenant-qualified FK or reviewed global catalogue contract.
- XI/XII/Dropper/COMMON eligibility derives from effective academic context and versioned policy.
- Multi-chapter/full-syllabus assessments are representable.
- Decimal and negative marks work through the complete scoring path.
- Question-level and marks-based assessment coexist.
- Re-test attempts preserve prior cycles and evidence.
- Batch save is atomic, bounded, idempotent and scope-validated.
- Students cannot read/write other students' obligations/evidence.
- Teachers cannot access unassigned tenant/centre/batch data.
- Unverified parents cannot access student records; verified parents are limited to the linked student and approved fields.
- Cross-tenant FK, query and RPC attempts fail.
- Later DTE enrichment updates historical aggregates without mutating evidence.
- Experiments have stable assignment, privacy controls and guardrails.
- CI, database integration tests and Preview browser QA pass on the exact release SHA.

## 12. Explicit non-claims

This document does not mean SQL has been implemented/applied, Supabase contains these tables, UI is connected to real authentication/persistence, experiments are active, parent links are secure/implemented, experiment hypotheses are proven, or the website is production-ready. Those claims require code, test and deployment evidence.
