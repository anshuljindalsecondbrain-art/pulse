# PULSE — System A Physical Table Authorization and Integrity Mapping

- Document ID: PULSE-DATA-CORE-008
- Version: 0.1.0
- Status: Draft — source-mapped review baseline; product, technical and security approval pending
- Date: 2026-11-06
- Parent: PULSE-DATA-CORE-001 through PULSE-DATA-CORE-007
- Source: System A proposed migration on feat/system-a-abhyas-foundation, blob 7a3c46b7e8b5f9b0d19506d1bf9696107e0b6e3f
- Implementation/SQL/live database authorization: Not granted

## 1. Purpose and scope

Map every table in the inspected System A proposed migration to its intended owner, tenant boundary, read scope, write boundary, immutability requirement and known source-schema risks. This is a source-based design audit, not a claim that the migration has been applied or that the proposed model is approved.

The source migration creates 26 System A tables, enables and forces RLS on the sa_ tables, revokes anon/authenticated table privileges and creates no RLS policies. It therefore deliberately leaves direct application access denied until a reviewed authorization design is implemented.

The canonical target model uses shared platform identity/tenant/membership/role/centre/student/batch/enrollment entities. The current sa_institutes, sa_institute_memberships and related identity records are not to be retained as a second canonical platform identity system.

## 2. Physical table authorization matrix

Legend:
- RLS predicate: logical authorization condition, not executable SQL.
- Writes: narrow application command/RPC boundary; never trust browser actor or role fields.
- Immutable: no application UPDATE/DELETE; append a new linked fact instead.

| Physical source table | Canonical owner / target | SELECT scope | INSERT / UPDATE boundary | DELETE | Key review requirement |
|---|---|---|---|---|---|
| sa_institutes | Platform tenants | Active tenant members, limited fields | Platform onboarding only; tenant admin updates approved profile fields | Prohibited; lifecycle status | Replace duplicate institute boundary with canonical tenants |
| sa_centres | Platform centres | Tenant members with centre permission | Centre administration command | Prohibited; deactivate | Preserve tenant-qualified centre references |
| sa_institute_memberships | Platform tenant_memberships + tenant_role_grants | Self membership/grants; authorized membership admins | Membership and role-grant commands separately | Prohibited; revoke/effective-date | Current row combines membership and role; split it |
| sa_students | Academic core students | Student self, verified guardian projection, assigned staff | Roster/enrollment command; narrow profile update | Prohibited; archive/withdraw | Replace direct Auth UID identity with optional person link |
| sa_parent_student_links | Academic core parent_student_links | Parent/student limited relationship view; authorized verifier | Verified-link workflow | Prohibited; append revocation | Add parent person, verification status/provenance and tenant-qualified parent reference |
| sa_subjects | Shared/global or tenant catalogue | Authorized catalogue readers | Catalogue administration/versioning | Prohibited; retire | Nullable institute_id needs explicit global-vs-tenant semantics |
| sa_chapters | Tenant-configured catalogue/DTE integration | Tenant catalogue readers | Tenant catalogue workflow | Prohibited; retire/version | subject_id must be tenant-qualified or explicitly global |
| sa_batches | Academic core batches | Assigned staff; learner/guardian permitted scope | Batch administration command | Prohibited; archive | Preserve centre ownership and tenant key |
| sa_batch_memberships | Academic core enrollments | Student own; assigned staff; authorized roster admin | Enrollment/transfer command | Prohibited; close/withdraw | Existing one-current-batch index encodes a product rule requiring approval |
| sa_exercises | System A exercise aggregate | Authors and assigned staff; learner only through published assignment relation | Draft creation command; status transition command | Prohibited; archive | created_by must resolve to canonical person; role/tenant scope |
| sa_exercise_versions | System A immutable content version | Authors/reviewers; learner only when published and assigned | Version creation command; no edit after publication | Prohibited | subject_id must be tenant/global safe; creator actor mapping |
| sa_exercise_slots | System A immutable slot snapshot | Same scope as parent exercise version; learners only through obligation | Version-building command only | Prohibited | chapter_id tenant consistency; QBMS refs optional and version-exact |
| sa_assignments | System A assignment aggregate | Author, approver, publisher and target learner by lifecycle | Draft command and controlled lifecycle transition | Prohibited; cancel/archive | creator identity and tenant scope |
| sa_assignment_versions | System A immutable assignment version | Author/reviewer/publisher; learner only after target publication | Draft version creation; approval/publish through commands | Prohibited | approver must be person identity; immutable approved snapshot |
| sa_assignment_items | System A immutable version composition | Same scope as assignment version | Assignment version creation transaction | Prohibited | Exercise version must be same tenant; enforce stable composite relationship |
| sa_assignment_targets | System A immutable target snapshot | Authorized staff; learner only if own target | Publication transaction only | Prohibited; amendment workflow | Target batch/student and assignment version must all share tenant |
| sa_student_obligations | System A learner work obligation | Own student; verified guardian projection; assigned staff | Publication transaction; controlled eligibility amendment | Prohibited; retain history | assignment_item_id needs tenant-qualified FK; slot/item/version consistency |
| sa_attempt_cycles | System A attempt history | Own learner; assigned academic reviewer | Learner or trusted workflow command | Prohibited; append new cycle | actor must be derived from Auth→Person; obligation/tenant consistency |
| sa_evidence_events | System A immutable evidence | Own learner, assigned teacher/reviewer; guardian-limited projection | Separate learner-report, teacher-observation or import command | Immutable | Actor role is not trusted input; source_actor_id should be person, not raw Auth UID |
| sa_verification_decisions | System A immutable decisions | Affected learner/guardian projection; assigned reviewer | Completion verification or answer evaluation command | Immutable | Separate purposes and permission; decided_by person; exact evidence linkage |
| sa_correction_cycles | System A correction workflow | Affected learner and assigned staff | Correction transition command | Prohibited; close via event/state | source decision must be eligible RETURNED decision for same obligation |
| sa_doubt_cases | System A doubt aggregate | Case owner and assigned academic staff | Raise/assign/transition command | Prohibited; close via lifecycle | opened_by/assigned_to must resolve to person and scope |
| sa_doubt_events | System A immutable doubt history | Case participants and assigned staff | Append-only doubt transition command | Immutable | No immutable trigger in source migration; actor/tenant and event type constraints needed |
| sa_audit_events | Platform/security audit | Restricted audit readers; no general student access | Trusted transaction/service only | Immutable | Nullable institute_id may be valid for platform events; actor person mapping needed |
| sa_metric_policy_versions | System A policy/configuration | Tenant academic/metric admins; applied version may be read by authorized users | Versioned policy administration | Prohibited; retire/version | created_by person mapping; immutable policy version and effective interval |

## 3. Table-specific integrity findings

### 3.1 Identity and organizational tables

1. sa_institutes duplicates the canonical tenants entity. Do not create both as parallel tenant boundaries.
2. sa_institute_memberships embeds role_key and centre_id in the membership row. The canonical model separates tenant membership from one or more scoped role grants.
3. sa_students stores auth_user_id directly. The canonical model uses optional person_id and a separate person_auth_identities mapping; a student can exist before login.
4. sa_parent_student_links stores parent_user_id as Auth UID and has no verification status/verified_by fields. A temporal relationship is not sufficient proof of guardian access.
5. sa_subjects permits institute_id NULL, which can represent global catalogue data, but the source does not define the global ownership/override/versioning model.
6. sa_chapters has a tenant key but subject_id references sa_subjects(id) independently. This permits a tenant chapter to reference a subject belonging to another tenant unless an explicit constraint/policy closes the gap.
7. sa_batch_memberships enforces one current batch per student across the entire institute. Confirm whether concurrent programme/batch enrollment is a valid use case before retaining this index.

### 3.2 Content and assignment tables

1. sa_exercises, sa_exercise_versions and sa_exercise_slots need actor references mapped to canonical people and immutable version rules.
2. sa_exercise_versions.subject_id and sa_exercise_slots.chapter_id are independent references; tenant/catalogue ownership must be enforced.
3. sa_exercise_slots has optional QBMS question and question-version UUIDs. They must remain optional, exact-version-aware references; no foreign key can be assumed until QBMS canonical IDs are approved.
4. sa_assignment_items has a direct FK to sa_assignment_items.id from obligations in the source migration, without a tenant-qualified composite FK. Add tenant-qualified uniqueness/reference design.
5. sa_assignment_targets must preserve exact assignment version and same-tenant batch/student scope. Publication snapshot semantics require product approval.
6. sa_student_obligations must validate that assignment_item, assignment_version and exercise_slot belong to a coherent published assignment chain, not merely that each ID exists independently.

### 3.3 Evidence and workflow tables

1. sa_attempt_cycles.created_by, sa_evidence_events.source_actor_id, sa_verification_decisions.decided_by, sa_correction_cycles.opened_by, sa_doubt_cases.opened_by/assigned_to and sa_doubt_events.actor_id reference auth.users directly. Replace business actor attribution with canonical person identity plus explicit authentication provenance where required.
2. sa_evidence_events.source_actor_role is client-spoofable unless assigned by the trusted command. Do not authorize or audit from that field as currently modeled.
3. sa_evidence_events has an append-only trigger. Keep it and add no ordinary update/delete privileges or RLS mutation policies.
4. sa_verification_decisions has an append-only trigger. It must not conflate completion verification with answer evaluation; purpose and decision semantics require separate policy.
5. sa_doubt_events has no append-only trigger in the inspected migration. Add immutable protections in the future approved schema design.
6. sa_correction_cycles and sa_doubt_cases contain mutable status projections. Their state transitions must be performed only through narrow transactional commands, while each transition is preserved in append-only event history.
7. sa_audit_events has an append-only trigger, but nullable tenant and actor require a documented platform-event versus tenant-event policy.

## 4. Source-level tenant-FK coverage review

The following relationships are already tenant-qualified in the proposed source migration:
- centre → institute;
- student → institute;
- parent-student link → student;
- batch → centre;
- batch membership → batch and student;
- exercise version → exercise;
- exercise slot → exercise version;
- assignment version → assignment;
- assignment item → assignment version and exercise version;
- assignment target → assignment version, batch and student;
- obligation → assignment version, exercise slot, student and source batch;
- attempt cycle → obligation;
- evidence → obligation and attempt cycle;
- verification decision → evidence;
- correction cycle → obligation and verification decision;
- doubt case → obligation;
- doubt event → doubt case.

The list does not prove the full relationship graph is safe. Important gaps remain:
- obligation.assignment_item_id uses a single-column FK;
- chapter.subject relationship is not tenant-qualified;
- exercise version subject and exercise slot chapter relationships need catalogue ownership checks;
- assignment item must prove exercise version and assignment version belong to a coherent approved composition;
- verification purpose/decision must match the intended workflow and source evidence type;
- correction source decision must belong to the same obligation and be an eligible returned decision;
- actor Auth UID references do not establish that the actor is a valid tenant member or has permission;
- role grant and assignment scope are not represented in the proposed System A schema.

## 5. Required policy design per table

Before SQL implementation, every table must have a completed policy record containing:
- canonical table owner and tenant key;
- parent/child tenant-qualified foreign keys;
- SELECT predicate by actor family and resource scope;
- INSERT command/RPC and trusted actor derivation;
- UPDATE allowance, if any, with lifecycle/version predicate;
- DELETE policy (default none);
- column-level exposure and PII minimization;
- append-only requirement and trigger;
- minimum grants and exposed-schema status;
- indexes supporting the policy predicates;
- positive and negative RLS tests;
- cross-tenant and privilege-escalation tests.

No generic policy should be copied across all tables merely because they share institute_id.

## 6. Proposed command-to-table write map

| Command | Tables written | Atomicity |
|---|---|---|
| Tenant onboarding | tenants, person/Auth identity, memberships, role grants | One trusted onboarding transaction |
| Student enrollment | students, parent links where verified, batches/enrollments/context | One authorized roster transaction |
| Create exercise draft/version | exercises, exercise_versions, exercise_slots | One version creation transaction |
| Create assignment draft/version | assignments, assignment_versions, assignment_items, assignment_targets | One draft/version transaction |
| Approve assignment | approval decision/event and assignment version lifecycle | One decision transaction |
| Publish assignment | assignment version state, target snapshot, student obligations, audit/domain/outbox | One atomic publication transaction |
| Learner report | attempt_cycles as needed, evidence_events, audit/domain/idempotency | One atomic submission transaction |
| Teacher observation | evidence_events, audit/domain/idempotency | One atomic append transaction |
| Verify completion | verification_decisions, audit/domain/idempotency | One atomic decision transaction |
| Evaluate answer | verification_decisions or a dedicated evaluation table, audit/domain/idempotency | Separate atomic evaluation transaction |
| Start/submit/review correction | correction_cycles, evidence_events, decisions/events, audit | One transaction per transition |
| Raise/manage doubt | doubt_cases, doubt_events, audit/domain/idempotency | One transaction per transition |
| Export matrix | export job/audit/outbox; read only authorized projection | Audited request; bounded read/job |
| Update metric policy | metric_policy_versions, audit | One version-creation transaction |

A dedicated answer_evaluations table may be preferable to overloading sa_verification_decisions. This is an unresolved schema decision, not an instruction to add a table now.

## 7. Immediate blockers before SQL

1. Approve canonical shared identity/tenant/membership/role/centre/student/batch/enrollment model.
2. Resolve whether role grants are tenant-wide, centre-scoped and/or batch/student-scoped.
3. Define verified parent relationship and permitted fields.
4. Approve assignment author/approver/publisher separation.
5. Define immutable publication roster and amendment semantics.
6. Resolve one-current-batch constraint and concurrent enrollments.
7. Define global versus tenant-specific subject/chapter catalogue.
8. Replace Auth UID business actor references with canonical person attribution.
9. Resolve answer evaluation storage and workflow semantics.
10. Add doubt-event immutability and correction-chain consistency.
11. Complete physical table-to-policy records and executable test cases.

## 8. Disposition

This source-based mapping identifies the current System A table authorization intent and structural gaps. It does not authorize SQL edits or application changes. No live Supabase operation was performed. The existing proposed migration remains unapplied and must not be applied as-is.

Next design deliverable after owner review: a canonical physical ERD and table/column data dictionary that incorporates the shared V10 platform core and System A-owned operations, followed by a unified migration plan in a disposable environment.
