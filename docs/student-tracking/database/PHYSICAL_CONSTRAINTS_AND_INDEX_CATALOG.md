# System A — Physical Constraint, Foreign-Key and Index Catalogue

**Document ID:** STS-DB-CONSTRAINTS-001  
**Version:** 1.0.0  
**Status:** Engineering proposal — review required before DDL  
**Date:** 2026-11-07  
**Parent:** PHYSICAL_DATABASE_BLUEPRINT.md

## 1. Purpose

Translate the Physical Database Blueprint into a constraint-level implementation checklist: primary/unique keys, composite tenant-safe foreign keys, CHECK constraints, deletion behavior, indexes and dependency order.

This catalogue is not executable SQL. Every FK target and uniqueness assumption must be checked against the approved shared-core physical schema before migration creation.

## 2. Shared PULSE core constraints

### 2.1 Existing and required keys

| Table | Key / constraint | Status | Purpose |
|---|---|---|---|
| tenants | PK(id) | Existing | Canonical tenant |
| people | PK(id) | Existing | Canonical person |
| tenant_people | PK(id) | Existing | Tenant association identity |
| tenant_people | UNIQUE(tenant_id, person_id) | Existing | One tenant-person association |
| tenant_people | FK tenant_id → tenants(id) | Existing | Tenant integrity |
| tenant_people | FK person_id → people(id) | Existing | Person integrity |
| students | PK(id) | Existing | Student identity |
| students | FK tenant_person_id → tenant_people(id) | Existing | Student belongs to tenant-person |
| students | UNIQUE(tenant_id,id) | Required after tenant_id decision | Tenant-qualified student FK |
| person_auth_identities | UNIQUE(auth_user_id) | Proposed | One local Auth principal mapping |
| person_auth_identities | UNIQUE(provider,provider_subject) | Proposed | Provider identity uniqueness |
| tenant_role_grants | FK(tenant_id,person_id) → tenant_people(tenant_id,person_id) | Proposed | Grant only to tenant member |
| centres | UNIQUE(tenant_id,id) | Proposed | Composite tenant parent key |
| centres | UNIQUE(tenant_id,normalized_code) | Proposed | No duplicate centre code per tenant |
| batches | UNIQUE(tenant_id,id) | Proposed | Composite tenant parent key |
| batches | FK(tenant_id,centre_id) → centres(tenant_id,id) | Proposed | Centre tenant consistency |
| batches | UNIQUE(tenant_id,academic_year,normalized_code) | Proposed | Batch code uniqueness |
| academic_context_epochs | FK(tenant_id,student_id) → students(tenant_id,id) | Required | Student/tenant consistency |
| academic_context_epochs | FK(tenant_id,batch_id) → batches(tenant_id,id) | Required | Batch/tenant consistency |
| teaching_assignments | FK(tenant_id,person_id) → tenant_people(tenant_id,person_id) | Proposed | Staff is tenant member |
| teaching_assignments | FK(tenant_id,batch_id) → batches(tenant_id,id) | Proposed | Scoped batch is same tenant |

**Student tenant-key decision:** current `students` has no direct `tenant_id`. The preferred implementation is to add `tenant_id NOT NULL` and enforce `FOREIGN KEY (tenant_id, tenant_person_id) REFERENCES tenant_people(tenant_id,id)`, after adding `UNIQUE(tenant_id,id)` to `tenant_people`. This makes tenant-safe student FKs direct and efficient. The alternate is to derive tenant through tenant_people everywhere; do not mix the two approaches.

## 3. System A tenant-qualified FK rule

For each System A table with `tenant_id` and `id`, define:
- PK(`id`) for stable identity.
- UNIQUE(`tenant_id`, `id`) for tenant-qualified references.
- Every child FK includes `tenant_id`: FK(`tenant_id`, `parent_id`) → parent(`tenant_id`, `id`).

A single-column FK to a UUID parent does not prevent cross-tenant references. Composite FK is mandatory for tenant-owned relations.

## 4. Foreign-key matrix

| Child table | Child columns | Parent | Parent columns | Delete action |
|---|---|---|---|---|
| sa_source_editions | tenant_id, source_catalog_id | sa_source_catalogs | tenant_id, id | RESTRICT |
| sa_source_questions | tenant_id, source_edition_id | sa_source_editions | tenant_id, id | RESTRICT |
| sa_assignments | tenant_id, created_by_person_id | tenant_people | tenant_id, person_id | RESTRICT |
| sa_assignment_versions | tenant_id, assignment_id | sa_assignments | tenant_id, id | RESTRICT |
| sa_assignment_versions | tenant_id, authored_by_person_id | tenant_people | tenant_id, person_id | RESTRICT |
| sa_assignment_versions | tenant_id, approved_by_person_id | tenant_people | tenant_id, person_id | RESTRICT |
| sa_assignment_versions | tenant_id, published_by_person_id | tenant_people | tenant_id, person_id | RESTRICT |
| sa_assignment_items | tenant_id, assignment_version_id | sa_assignment_versions | tenant_id, id | RESTRICT |
| sa_assignment_items | tenant_id, source_question_id | sa_source_questions | tenant_id, id | RESTRICT |
| sa_assignment_targets | tenant_id, assignment_version_id | sa_assignment_versions | tenant_id, id | RESTRICT |
| sa_assignment_targets | tenant_id, batch_id | batches | tenant_id, id | RESTRICT |
| sa_assignment_targets | tenant_id, student_id | students | tenant_id, id | RESTRICT |
| sa_target_snapshots | tenant_id, assignment_version_id | sa_assignment_versions | tenant_id, id | RESTRICT |
| sa_target_snapshots | tenant_id, student_id | students | tenant_id, id | RESTRICT |
| sa_target_snapshots | tenant_id, academic_context_epoch_id | academic_context_epochs | tenant_id, id | RESTRICT |
| sa_target_snapshots | tenant_id, source_batch_id | batches | tenant_id, id | RESTRICT |
| sa_student_obligations | tenant_id, assignment_item_id | sa_assignment_items | tenant_id, id | RESTRICT |
| sa_student_obligations | tenant_id, target_snapshot_id | sa_target_snapshots | tenant_id, id | RESTRICT |
| sa_student_obligations | tenant_id, student_id | students | tenant_id, id | RESTRICT |
| sa_student_obligations | tenant_id, source_batch_id | batches | tenant_id, id | RESTRICT |
| sa_attempt_cycles | tenant_id, obligation_id | sa_student_obligations | tenant_id, id | RESTRICT |
| sa_student_report_events | tenant_id, obligation_id | sa_student_obligations | tenant_id, id | RESTRICT |
| sa_student_report_events | tenant_id, attempt_cycle_id | sa_attempt_cycles | tenant_id, id | RESTRICT |
| sa_student_report_events | tenant_id, actor_person_id | tenant_people | tenant_id, person_id | RESTRICT |
| sa_teacher_observation_events | tenant_id, obligation_id | sa_student_obligations | tenant_id, id | RESTRICT |
| sa_teacher_observation_events | tenant_id, teacher_person_id | tenant_people | tenant_id, person_id | RESTRICT |
| sa_teacher_observation_events | tenant_id, teaching_assignment_id | teaching_assignments | tenant_id, id | RESTRICT |
| sa_answer_evaluations | tenant_id, obligation_id | sa_student_obligations | tenant_id, id | RESTRICT |
| sa_answer_evaluations | tenant_id, report_event_id | sa_student_report_events | tenant_id, id | RESTRICT |
| sa_answer_evaluations | tenant_id, evaluator_person_id | tenant_people | tenant_id, person_id | RESTRICT |
| sa_verification_decisions | tenant_id, obligation_id | sa_student_obligations | tenant_id, id | RESTRICT |
| sa_verification_decisions | tenant_id, report_event_id | sa_student_report_events | tenant_id, id | RESTRICT |
| sa_verification_decisions | tenant_id, reviewer_person_id | tenant_people | tenant_id, person_id | RESTRICT |
| sa_correction_cycles | tenant_id, obligation_id | sa_student_obligations | tenant_id, id | RESTRICT |
| sa_correction_cycles | tenant_id, returned_decision_id | sa_verification_decisions | tenant_id, id | RESTRICT |
| sa_doubt_cases | tenant_id, obligation_id | sa_student_obligations | tenant_id, id | RESTRICT |
| sa_doubt_cases | tenant_id, originating_report_event_id | sa_student_report_events | tenant_id, id | RESTRICT |
| sa_doubt_cases | tenant_id, opened_by_person_id | tenant_people | tenant_id, person_id | RESTRICT |
| sa_doubt_events | tenant_id, doubt_case_id | sa_doubt_cases | tenant_id, id | RESTRICT |
| sa_disputes | tenant_id, obligation_id | sa_student_obligations | tenant_id, id | RESTRICT |
| sa_appeal_decisions | tenant_id, dispute_id | sa_disputes | tenant_id, id | RESTRICT |
| sa_recognition_decisions | tenant_id, obligation_id | sa_student_obligations | tenant_id, id | RESTRICT |
| sa_audit_events | tenant_id, actor_person_id | tenant_people | tenant_id, person_id | RESTRICT where tenant_id is non-null |

Self-references such as supersedes_event_id and supersedes_decision_id must use a tenant-qualified FK and must prohibit self-reference. Optional FKs use MATCH SIMPLE only where a partially null composite key is intentionally allowed; otherwise use paired-null CHECK constraints.

## 5. CHECK constraints catalogue

| Table | Constraint | Rule |
|---|---|---|
| person_auth_identities | valid_window | valid_to IS NULL OR valid_to > valid_from |
| tenant_role_grants | valid_window | valid_to IS NULL OR valid_to > valid_from |
| centres | name_nonempty | length(trim(name)) > 0 |
| batches | code_nonempty | length(trim(code)) > 0 |
| academic_context_epochs | valid_window | existing rule retained |
| sa_source_catalogs | source_kind_allowed | OFFLINE_MODULE/QBMS/OTHER |
| sa_source_catalogs | source_code_nonempty | length(trim(source_code)) > 0 |
| sa_source_editions | year_range | published_year IS NULL OR bounded academic year |
| sa_source_questions | locator_nonempty | length(trim(source_locator)) > 0 |
| sa_source_questions | marks_nonnegative | max_marks IS NULL OR max_marks >= 0 |
| sa_assignments | title_nonempty | length(trim(title)) > 0 |
| sa_assignment_versions | version_positive | version_no > 0 |
| sa_assignment_versions | deadline_order | due_at IS NULL OR release_at IS NULL OR due_at >= release_at |
| sa_assignment_versions | approval_consistency | approved_at and approved_by set together; same for publication |
| sa_assignment_items | sequence_positive | sequence_no > 0 |
| sa_assignment_items | marks_nonnegative | max_marks_snapshot IS NULL OR >= 0 |
| sa_assignment_targets | target_exactly_one | exactly one target FK is populated and agrees with target_kind |
| sa_target_snapshots | resolved_time | resolved_at NOT NULL |
| sa_student_obligations | eligibility_allowed | ELIGIBLE/EXEMPTED/REMOVED/RECOGNISED |
| sa_attempt_cycles | cycle_positive | cycle_no > 0 |
| sa_attempt_cycles | cycle_type_allowed | INITIAL/PRACTICE/REVISION |
| sa_attempt_cycles | time_order | ended_at IS NULL OR ended_at >= started_at |
| sa_student_report_events | state_allowed | approved report-state vocabulary only |
| sa_answer_evaluations | outcome_allowed | CORRECT/INCORRECT/PARTIALLY_CORRECT/NOT_EVALUATED |
| sa_answer_evaluations | marks_nonnegative | awarded/max marks >= 0 when supplied |
| sa_answer_evaluations | marks_not_over_max | awarded <= max when both supplied |
| sa_verification_decisions | purpose_allowed | approved verification purposes only |
| sa_verification_decisions | outcome_allowed | outcome compatible with purpose |
| sa_correction_cycles | cycle_positive | cycle_no > 0 |
| sa_doubt_cases | priority_allowed | LOW/NORMAL/HIGH/URGENT |
| sa_doubt_cases | state_allowed | OPEN/ASSIGNED/IN_PROGRESS/RESOLVED/REOPENED/ESCALATED |
| sa_disputes | challenged_target_present | at least one exact report/decision target supplied |
| sa_recognition_decisions | source_evidence_present | accepted recognition requires exact source evidence |
| sa_metric_policy_versions | version_positive | version_no > 0 |

## 6. Uniqueness catalogue

- `person_auth_identities(auth_user_id)`.
- `person_auth_identities(provider,provider_subject)`.
- `tenant_role_grants(tenant_id,person_id,role_code,scope_type,scope_id,valid_from)` subject to re-grant/revocation policy.
- `centres(tenant_id,normalized_code)`.
- `batches(tenant_id,academic_year,normalized_code)`.
- `sa_source_catalogs(tenant_id,source_kind,source_code)`.
- `sa_source_editions(tenant_id,source_catalog_id,edition_code)`.
- `sa_source_questions(tenant_id,source_edition_id,source_locator)`.
- `sa_assignments(tenant_id,assignment_code)` where code is not null.
- `sa_assignment_versions(tenant_id,assignment_id,version_no)`.
- `sa_assignment_items(tenant_id,assignment_version_id,sequence_no)`.
- `sa_target_snapshots(tenant_id,assignment_version_id,student_id)`.
- `sa_student_obligations(tenant_id,assignment_item_id,student_id)`.
- `sa_attempt_cycles(tenant_id,obligation_id,cycle_no)`.
- `sa_student_report_events(tenant_id,actor_person_id,client_event_id)` where client_event_id is not null.
- `sa_correction_cycles(tenant_id,obligation_id,cycle_no)`.
- `sa_metric_policy_versions(tenant_id,policy_code,version_no)`.
- `sa_command_idempotency(tenant_id,actor_person_id,command_name,idempotency_key)`.

## 7. Deletion and retention rules

| Entity family | FK delete action | Application behavior |
|---|---|---|
| Tenant/person/tenant association | RESTRICT | Deactivate/revoke; retention process separately governed |
| Student/batch/centre | RESTRICT | Archive/deactivate; preserve academic references |
| Source catalogue/edition/question ref | RESTRICT | Retire; do not delete if assignments reference it |
| Assignment/version/item/target | RESTRICT | Withdraw/supersede through events |
| Obligation | RESTRICT | Never hard-delete; exemption/removal decision |
| Reports/observations/evaluations/verification | RESTRICT | Append superseding event/decision |
| Correction/doubt/dispute/appeal | RESTRICT | Close through lifecycle event |
| Audit/idempotency | RESTRICT | Retention/expiry policy; audit immutable |

Retention durations, legal holds and privacy deletion/anonymization rules require a separate approved retention policy. Do not silently infer statutory retention.

## 8. Index design rules

- Every FK used in join/filter paths must be reviewed for a supporting index; PostgreSQL does not automatically index the referencing side of an FK.
- Index leading columns must match tenant filters and workload predicates.
- Add partial indexes for open workflow queues only after state vocabulary and query patterns are stable.
- Use keyset pagination for large student matrices and evidence timelines.
- Do not create a GIN index on arbitrary JSONB metadata unless a real query path requires it.
- Validate indexes using EXPLAIN ANALYZE with representative data, and measure write overhead.

## 9. Physical dependency order

1. Existing shared tables: tenants, people, tenant_people.
2. Shared identity extensions: person_auth_identities, tenant role grants.
3. Shared academic extensions: centres, batches, student tenant key, academic-context FKs, teaching assignments, guardian relationships.
4. System A source references: source catalogs, editions, source questions.
5. Assignment aggregate and immutable versions.
6. Assignment items and targets.
7. Target snapshots and student obligations.
8. Attempts, student reports and teacher observations.
9. Answer evaluations and verification decisions.
10. Correction cycles/events and doubt cases/events.
11. Disputes, appeals and recognition.
12. Audit, idempotency, metric policies and projections.
13. RLS policies, grants and trusted transactional commands are developed and tested alongside each relevant table group, not deferred to a final blanket step.

## 10. Open review gates

- Confirm student tenant-key pattern before composite student FKs.
- Confirm role-grant scope resource representation.
- Confirm centre/batch codes and academic-year vocabulary.
- Confirm concurrent enrolment and temporal overlap policy.
- Confirm parent relationship proof, consent and revocation.
- Confirm assignment approval and amendment behavior.
- Confirm student report vs teacher observation workflow.
- Confirm status and answer evaluation semantics.
- Confirm retention and privacy deletion/anonymization.
- Confirm migration ownership and unified history between shared core and System A.

## 11. Acceptance checklist

- [ ] Every tenant-owned FK is composite and tenant-qualified.
- [ ] Every actor FK resolves to canonical person and active tenant membership.
- [ ] No direct Auth UID business actor references.
- [ ] No cross-tenant reference passes database constraints.
- [ ] No historical evidence has ON DELETE CASCADE.
- [ ] Published assignment version cannot be mutated.
- [ ] Student report and teacher observation are separate.
- [ ] Correctness and completion verification are separate.
- [ ] Publication is atomic and idempotent.
- [ ] All constraints have positive and negative tests.
- [ ] Indexes are justified by query plans.
- [ ] RLS and grants are tested for every exposed table.


---

## 12. DEC-012 — approved membership/student/enrollment constraints (2026-11-07)

**This section is authoritative and supersedes any earlier catalog row that references `tenant_people`, `tenant_person_id`, student-to-membership FK, or direct context-to-batch FK.**

| Object | Required key / constraint | Purpose |
|---|---|---|
| tenant_memberships | PK `id`; UNIQUE `(tenant_id,person_id)`; UNIQUE `(tenant_id,id)` | Tenant association; supports tenant-qualified references |
| students | PK `id`; NOT NULL `tenant_id`; nullable FK `person_id → people(id)`; UNIQUE `(tenant_id,id)` | Tenant-owned student identity independent of membership |
| enrollments | PK `id`; UNIQUE `(tenant_id,id)`; FK `(tenant_id,student_id)` → students; FK `(tenant_id,batch_id)` → batches; CHECK `valid_to IS NULL OR valid_to > valid_from` | Explicit tenant-safe student-to-batch relation |
| academic_context_epochs | FK `(tenant_id,enrollment_id)` → enrollments; CHECK positive valid interval | Context attaches to enrollment, not directly to batch |

### Index requirements

- Unique index on `tenant_memberships(tenant_id,person_id)`.
- Unique composite key/index on `tenant_memberships(tenant_id,id)`.
- Unique composite key/index on `students(tenant_id,id)`.
- B-tree index on `enrollments(tenant_id,student_id,valid_from DESC)` for student enrollment history.
- B-tree index on `enrollments(tenant_id,batch_id,valid_from DESC)` for batch roster/history.
- B-tree index on `academic_context_epochs(tenant_id,enrollment_id,valid_from DESC)` for context history.
- Indexes above are design candidates; validate actual query plans and avoid redundant indexes where a unique constraint already provides the required leading key.

### Explicitly prohibited until OPEN-010 / RECON-004 closes

- Unique partial index enforcing one active enrollment per student.
- Exclusion constraint preventing overlapping enrollment periods.
- Any assumption that only one active batch/programme can exist for a student.
- Any direct `academic_context_epochs.batch_id` column/FK as an independent source of batch truth.

### Tenant-safety tests

- Reject enrollment whose student belongs to another tenant.
- Reject enrollment whose batch belongs to another tenant.
- Reject context epoch whose enrollment belongs to another tenant.
- Permit student with no person link.
- Permit student with person link but no tenant_memberships row.
- Permit multiple historical enrollments for one student.
- Do not assert whether concurrent active enrollments succeed/fail until Academic Owner closes OPEN-010.
