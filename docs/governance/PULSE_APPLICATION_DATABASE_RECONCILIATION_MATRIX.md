# PULSE Application and Database Reconciliation Matrix

**Document ID:** PULSE-ENG-RECON-001  
**Version:** 1.0.0  
**Status:** Evidence-based preliminary audit — owner/technical review required  
**Audit date:** 2026-11-07  
**Scope:** Student Tracking Lovable, QBMS Lovable, GitHub System A prototype, standalone PULSE Supabase design baseline  
**Method:** Read-only source inspection, read-only live PostgreSQL catalog queries, migration/code inspection, and prior repository source audit

---

## 1. Executive assessment

The current PULSE implementation landscape is fragmented across two independent Lovable applications and databases, a GitHub System A prototype, and a separate proposed standalone PULSE Supabase database.

The live read-only inspection confirms:

- Student Tracking Lovable database: **22 public base tables**.
- QBMS Lovable database: **7 public base tables**.
- RLS is enabled on every inspected public base table in both databases.
- RLS is not forced on any of those inspected tables.
- The two databases use different primary-key conventions and different identity/authorization models.
- Student Tracking has an operational academic workflow model; QBMS has a question authoring/import/version model.
- The approved PULSE shared identity decisions (DEC-011/012/013) are not the physical identity model used by either existing Lovable database.
- The standalone PULSE Supabase project remains a proposed target; this audit does not designate it canonical.

**Conclusion:** do not merge schemas directly or point one application at the other's database. First define the canonical domain contracts, map legacy records and identifiers, and prove the workflows against the approved pilot semantics.

## 2. Evidence and inspection boundary

### 2.1 Live project inspection

| Attribute | Student Tracking Lovable | QBMS Lovable |
|---|---|---|
| Project ID | `3c9c95ba-5fef-4ed2-a758-b5b60bb213f0` | `ad580e88-d5ed-4854-91e4-6eb05944b1c8` |
| Workspace | My Lovable | Anshul's Lovable |
| Latest inspected commit | `ffbdff919a469051d995e65a8afd3682f3cf9a6f` | `e9fa59366e622d3b89a14523ccd91088d92a28ab` |
| Last edited (project metadata) | 2026-11-06 | 2026-11-03 |
| Published | No | No |
| Database enabled | Yes (Supabase) | Yes (Supabase) |
| Public base tables | 22 | 7 |
| RLS enabled | 22/22 | 7/7 |
| FORCE RLS | 0/22 | 0/7 |
| Migration files observed | 5 SQL migrations | 2 SQL migrations |

The project commit hashes above are the refs used for source file listing/inspection. Database catalogs were queried live using SELECT statements. No database writes were issued.

### 2.2 Evidence classes

- **Live DB verified:** queried from PostgreSQL information_schema / pg_catalog.
- **Source verified:** read directly from the project files at the inspected commit.
- **Prior audit evidence:** captured in the earlier read-only application source audit.
- **Design decision:** recorded in approved PULSE decision documents.
- **Inference:** analytical conclusion from the evidence; requires technical owner validation before implementation.

### 2.3 Limitations

- This is not a complete line-by-line source-code audit of every route, component, function and migration.
- The Student Tracking `drizzle/schema.ts` is explicitly blank by design; migrations and live catalog are more authoritative than this file.
- QBMS source includes generated Supabase types, but these are not a substitute for the live catalog.
- RLS policy count and enabled flags do not prove policy correctness. Policy expressions, helper-function security, grants, role membership and adversarial tenant-isolation tests still require a dedicated security audit.
- No application data rows were read or exported for this audit.
- No migration replay, E2E, penetration, concurrency or load tests were run.
- The standalone PULSE database was not reconfigured or modified.

## 3. Live database inventory

### 3.1 Student Tracking Lovable — 22 tables

| Domain group | Tables | Observed role |
|---|---|---|
| Identity / staff | `users`, `profiles` | Auth-linked staff/user and profile data |
| Student / batch | `students`, `batches`, `student_batches`, `teacher_batches` | Student and batch assignment/access |
| Academic catalogue | `subjects`, `chapters`, `modules`, `topics`, `concepts`, `exam_patterns` | Curriculum and exam taxonomy |
| Exercise / question | `items`, `questions`, `question_types` | Exercise inventory and question definitions |
| Student activity | `student_items`, `progress`, `question_status`, `question_journey_log` | Assignment, aggregate progress and per-question status history |
| Assessment | `test_results` | Result/attempt records associated with student items |
| Audit / legacy | `audit_log`, `legacy_abhyas_summary` | Audit evidence and aggregate legacy tracking |

Key observed relationships:
- Chapters reference subjects.
- Modules reference chapters; items may reference modules and chapters.
- Topics reference chapters; concepts reference topics.
- Questions reference items, question types and optionally chapter/topic/concept/exam pattern.
- Student items reference students, items and assigned batches.
- Progress, question status, journey log and test results reference student items.
- Student-batch and teacher-batch bridge tables associate students/users with batches.

### 3.2 QBMS Lovable — 7 tables

| Domain group | Tables | Observed role |
|---|---|---|
| Canonical question | `canonical_questions` | Question content and current canonical record |
| Versioning | `question_versions` | Version snapshots and change reason |
| Import workflow | `import_jobs`, `staged_question_candidates` | File/import batch and staging/review decisions |
| Identity / authorization | `user_profiles`, `user_roles` | Profile and role records |
| Audit | `audit_events` | Actor/entity/action/detail audit events |

Key observed relationships:
- Question versions reference canonical questions.
- Canonical questions can self-reference through `variant_of`.
- Staged candidates reference import jobs and may reference a canonical question or duplicate match.
- Live foreign-key inspection did not show a direct FK from audit actor IDs to a canonical people table.
- Live foreign-key inspection did not show a tenant boundary in the listed application tables.

## 4. Application and database comparison

| Dimension | Student Tracking Lovable | QBMS Lovable | Reconciliation implication |
|---|---|---|---|
| Primary purpose | Student tracking, curriculum, exercise assignment and progress | Question authoring, import staging, review and versioning | Complementary bounded contexts; not competing copies of one schema |
| Framework | TanStack Start / React 19 / TypeScript | TanStack Start / React / TypeScript | Shared frontend conventions may be reusable after dependency review |
| ORM/migrations | Drizzle; 5 SQL migrations observed | Drizzle; 2 SQL migrations observed | Separate migration histories; do not combine without a new canonical baseline |
| Student identity | UUID `students.id`; student code; no shared tenant/person model visible in inspected columns | No student entity | Student domain remains outside QBMS |
| User identity | `users.id` UUID; profiles and staff roles | UUID user profiles and role table; auth-oriented policies | Both require adapter/reconciliation to shared PULSE identity |
| Roles | Enum role on `users`; trigger assigns first user ADMIN and later users TEACHER | `app_role`: super_admin, coordinator, reviewer, author, viewer | Material role semantics mismatch; approved pilot has one Super Admin login |
| Tenant model | No tenant_id on inspected core tables | No tenant_id on inspected core tables | Neither live schema demonstrates approved multi-tenant PULSE core boundaries |
| Curriculum | Subject → Chapter → Module / Topic → Concept | Subject/chapter/topic are text fields on question record | QBMS labels are not normalized FK references to System A curriculum |
| Question identity | Bigint question ID; question belongs to item; question number within item | UUID canonical question ID; content, hashes, provenance, status and version | IDs cannot be joined directly; explicit crosswalk/canonical question identity required |
| Question versioning | No dedicated question version entity observed | `question_versions` snapshots with version_number | QBMS version model is richer; System A question references need immutable version binding if used for test evidence |
| Question source/provenance | Source, source question number/year fields on questions | Provenance JSON, source file hash, source coordinate and staged candidates | Normalize provenance model; preserve QBMS source evidence |
| Duplicate handling | No comparable staging/duplicate workflow identified in inspected ST table inventory | Staged candidate duplicate match and decision fields; hashes in source code | QBMS import/duplicate workflow should be preserved and audited |
| Marks | Item max_marks; test results obtained_marks; question table has no per-question marks field in inspected inventory | Canonical question marks and negative_marks numeric fields | QBMS scoring granularity should remain canonical; avoid lossy integer-only mapping |
| Difficulty | Integer difficulty on questions; no dynamic difficulty history in inspected table inventory | Text difficulty field | Requires a separate versioned Difficulty Engine contract; do not conflate values |
| Tracking modes | Item enum tracking_mode; completion and question-level status paths; MARKS path also appears in view logic | No student attempt tracking | System A owns student evidence; QBMS should not own learner attempt state |
| Aggregate tracking | `progress`, `legacy_abhyas_summary` | Not applicable | Aggregate-only evidence must remain distinguishable from question-level events |
| Question status | Enum status with journey log; status RPC | Question publication/status field | Same word “status” means different domain concepts; use explicit names |
| Assignment | Student-item rows and batch assignment RPCs | Import jobs/candidate staging | Different obligation types; do not map import staging to student assignment |
| Audit | `audit_log` plus question journey log | `audit_events` | Different audit schemas and semantics; define shared audit envelope plus domain event detail |
| RLS | Enabled on all 22 base tables; 0 forced | Enabled on all 7 base tables; 0 forced | Policy audit and FORCE RLS decision required; enabled alone is insufficient |
| Publication | Item lifecycle and publish/archive RPCs | Question status and review/import flow | Separate publication state machines; map only after workflow definition |
| Student login | Existing auth/staff architecture | User role/auth architecture | Conflicts with approved no-student-login pilot if student identity is conflated with auth |
| Operational status | Unpublished project; database enabled | Unpublished project; database enabled | Do not infer production deployment or operational adoption |

## 5. Critical schema and authorization findings

### CR-RECON-001 — Identity model divergence

**Evidence**
- Student Tracking has separate `users`, `profiles` and `students` tables.
- The initial auth migration creates staff rows from `auth.users`, assigns ADMIN to the first user and TEACHER to subsequent users, and includes a hard-coded email-based ADMIN backfill.
- QBMS has `user_profiles` and `user_roles`, with role values `super_admin`, `coordinator`, `reviewer`, `author`, `viewer`.
- Neither live schema shows the approved shared `people`, `person_auth_identities`, `tenant_memberships` and `tenant_role_grants` model.

**Conflict**
- DEC-011/012/013 define a shared PULSE identity authority.
- The approved internal pilot has one Super Admin operator and does not require student login.
- Existing app-specific roles and user rows must not be promoted as the PULSE identity authority.

**Required action**
- Create an explicit mapping from legacy user IDs to PULSE people/auth identities only after trusted identity verification.
- Preserve original actor IDs and provenance as source references.
- Do not infer person identity from email, editable profile metadata or student name/code.
- Defer any account linking to a trusted audited workflow.

### CR-RECON-002 — Tenant isolation absent from current domain table shapes

**Evidence**
- Inspected core Student Tracking and QBMS table columns did not expose tenant_id columns.
- RLS is enabled, but all inspected base tables have FORCE RLS false.
- Current policies appear role/staff-oriented rather than a demonstrated tenant-membership-and-scoped-role-grant model.

**Conflict**
- PULSE shared core requires tenant-safe relationships and authorization.
- One-institute pilot does not remove the need to preserve tenant boundaries in the target architecture.

**Required action**
- Build target tenant keys and composite tenant-safe FKs according to approved shared-core decisions.
- Review all security-definer functions, grants, views and policies.
- Add negative cross-tenant tests before any Data API/client exposure.
- Do not retrofit tenant columns into live databases without a reviewed migration plan.

### CR-RECON-003 — Curriculum normalization mismatch

**Evidence**
- Student Tracking models subject/chapter/module/topic/concept with bigint relational IDs.
- QBMS stores subject/chapter/topic as text fields on `canonical_questions`.
- QBMS question data therefore does not have referential integrity to System A curriculum.

**Required action**
- Define versioned curriculum/taxonomy IDs in the shared academic catalogue/DTE contracts.
- Preserve original QBMS text labels as source metadata during mapping.
- Support unresolved/ambiguous mappings and human review.
- Do not silently auto-map labels based only on string equality.

### CR-RECON-004 — Question identity and version semantics mismatch

**Evidence**
- Student Tracking questions use bigint IDs, belong to an exercise/item and carry a question number.
- QBMS canonical questions use UUID IDs, have content blocks, answer/options, hashes, provenance, status, version and variant linkage.
- QBMS `question_versions` stores JSON snapshots keyed by canonical question and version number.
- Student Tracking question status/history references its own bigint question ID.

**Required action**
- Adopt Q-GENOME's distinct concepts: question identity, immutable question version, question instance/slot, and taxonomy/concept mapping.
- Use an explicit legacy-ID crosswalk; never reuse or cast IDs across stores.
- A test/assignment question slot should bind to a specific question version when published/assigned.
- Preserve source question IDs and exercise question numbers for audit traceability.

### CR-RECON-005 — Marks and difficulty representation mismatch

**Evidence**
- QBMS stores marks and negative_marks as numeric fields.
- Student Tracking question table inventory has no corresponding per-question marks fields; items use integer max_marks.
- Student Tracking question difficulty is integer; QBMS difficulty is text.

**Required action**
- Keep positive marks and negative marks separate and numeric in the canonical question contract.
- Keep test-specific scoring rules/version separate from source question defaults.
- Map difficulty through a versioned controlled vocabulary; preserve raw legacy values.
- Do not assume QBMS difficulty is the same as static or dynamic DDS output.

### CR-RECON-006 — Tracking evidence is not yet proven to meet the approved pilot contract

**Evidence**
- Student Tracking has completion progress and question-level statuses.
- The status RPC accepts CORRECT, INCORRECT, DOUBT, UNATTEMPTED and SOLVED_BY_TEACHER.
- The status view counts CORRECT, INCORRECT, DOUBT and SOLVED_BY_TEACHER as attempted, while UNATTEMPTED is not included.
- Completion percentage is calculated from completed_questions for COMPLETION mode and attempted status count for QUESTION_LEVEL mode.
- Existing `legacy_abhyas_summary` stores attempted/correct/incorrect/doubt aggregates and a legacy aggregate-only origin marker.

**Gap**
- The approved pilot requires exercise-level quick entry and question-level detailed evidence, explicit distinction between completion verification and correctness, and discrepancy reconciliation.
- The inspected structures do not yet prove that exercise aggregates and question-level events are reconciled without silent overwrite.
- `SOLVED_BY_TEACHER` is included in attempted aggregation; this needs explicit domain-rule review.
- A reported completion value is not itself evidence of teacher verification.

**Required action**
- Specify canonical event types for assigned, reported completion, verified completion, attempt outcome, doubt, teacher explanation, correction and resubmission.
- Maintain an append-only evidence history with source, event time, operator actor and original teacher attribution when known.
- Reconcile aggregate counts against question-level events and flag mismatches.
- Preserve aggregate-only records as aggregate-only; never fabricate question attempts.

### CR-RECON-007 — Publication and import workflows need distinct state machines

**Evidence**
- Student Tracking uses item lifecycle status and RPC publication/assignment functions.
- QBMS uses import job status, staged candidate status, duplicate decision and canonical question status.
- These workflows are not the same lifecycle.

**Required action**
- Keep import candidate validation/review/promotion separate from academic exercise publication and student assignment.
- Define cross-domain commands with explicit authorization and immutable source version.
- A QBMS question being published must not automatically create an exercise or student obligation.

### CR-RECON-008 — Audit models are not interoperable

**Evidence**
- Student Tracking audit log uses entity type/id, action, old/new JSON and user ID.
- QBMS audit events use entity/action/detail and actor ID.
- Question journey log captures status transitions separately.
- Audit tables have different identity and event detail conventions.

**Required action**
- Define a shared audit envelope: event ID, tenant, actor/person/auth identity references, actor source, action, entity type/ID, event time, correlation/causation IDs, source system, schema version and immutable detail payload.
- Keep domain-specific event detail in System A and QBMS.
- Preserve original legacy audit rows and IDs during migration.
- Define retention and export policy before production cutover.

### CR-RECON-009 — RLS configuration is not a security certification

**Evidence**
- All inspected public base tables have RLS enabled.
- No inspected table has FORCE ROW LEVEL SECURITY.
- Student Tracking has policy counts from 1 to 3 per table; QBMS from 1 to 5 per table.
- Policy presence does not establish safe helper functions, correct grants, safe views, definer search_path, or cross-tenant isolation.

**Required action**
- Inventory grants, policies with full USING/WITH CHECK expressions, security-definer functions, triggers, views and sequences.
- Run role-specific tests for unauthenticated, authenticated, Super Admin and tenant boundary cases.
- Validate direct table access and RPC access independently.
- Evaluate FORCE RLS only with owner-approved operational implications; do not change it as part of this audit.

### CR-RECON-010 — Migration histories are separate and incomplete as a canonical baseline

**Evidence**
- Student Tracking lists migrations 0000–0004.
- QBMS lists migrations 0000–0001.
- Their migration histories use different table models and assume existing project-specific schema.
- Student Tracking's Drizzle schema file is blank by design.

**Required action**
- Export and archive exact migration files, journal/snapshot metadata and live catalog snapshots.
- Reconcile migrations against the approved PULSE canonical baseline before authoring any new integrated migration.
- Do not replay existing project migrations into the standalone PULSE database.
- Add migration replay, rollback/forward-fix and schema drift checks to CI.

## 6. Domain ownership and integration disposition

| Domain / capability | Current source | Intended PULSE owner | Disposition |
|---|---|---|---|
| People, Auth mapping, tenant membership, role grants | Both app-specific user systems | Shared PULSE Core | Redesign against DEC-011/012/013; legacy adapters/crosswalk |
| Student master | Student Tracking | Shared Core + System A boundary | Reconcile to tenant-owned student and optional person link; no login required |
| Enrolment and batch context | Student Tracking | Shared Core | Rebuild around explicit effective-dated enrolments; resolve OPEN-010 before constraints |
| Subject/chapter/module catalogue | Student Tracking | Academic Structure / owner decision | Candidate source only; OPEN-011 unresolved |
| Topics/concepts/taxonomy | Student Tracking + QBMS free-text tags | DTE | Normalize to versioned taxonomy nodes and mappings; preserve source labels |
| Question identity/content/version | QBMS | QBMS / Q-GENOME | Preserve UUID identity and versions; introduce canonical crosswalk for legacy System A bigint IDs |
| Import staging and duplicate detection | QBMS | QBMS | Reuse domain behavior after security, provenance and scale tests |
| Exercise/item and publication | Student Tracking | System A / academic content workflow | Retain as candidate behavior; redesign tenant and version references |
| Student assignments/obligations | Student Tracking | System A | Align to approved obligation/evidence model |
| Attempt and completion evidence | Student Tracking | System A | Redesign/reconcile to dual-mode evidence contract |
| Test assembly/results | Student Tracking partial test_results | Test Management | Separate test definition, test version, delivery, response and result lifecycle |
| Difficulty | Both have rudimentary static fields | Difficulty Engine | Centralize rules, static/dynamic scores and version history |
| Audit | Both | Shared audit envelope + domain events | Preserve and map; do not collapse into untyped JSON |
| UI components | Both React/TanStack projects | Shared frontend design system | Reuse selectively after dependency/license/accessibility review |

## 7. Reuse / redesign / preserve / defer matrix

| Component | Decision | Rationale |
|---|---|---|
| Student Tracking curriculum UI patterns | Reuse selectively | Useful workflows, but backend ownership and IDs need redesign |
| Student Tracking exercise builder | Reuse selectively | Domain workflow exists; item/question version references need reconciliation |
| Student Tracking progress views | Redesign | Current aggregate semantics do not fully prove approved reconciliation |
| Student Tracking auth bootstrap | Replace in target architecture | First-user ADMIN and email-specific role behavior conflicts with approved shared identity/pilot |
| QBMS import staging | Preserve and reuse after audit | Valuable staged candidate, duplicate decision and provenance model |
| QBMS question linter/math checks | Reuse selectively | Client-side preflight is useful but must not replace server validation |
| QBMS question hashing | Reuse selectively | Useful duplicate signals; requires normalization/version and false-positive validation |
| QBMS question versions | Preserve as core design input | Immutable question-version concept aligns with Q-GENOME direction |
| QBMS free-text curriculum fields | Preserve as source metadata; map to taxonomy | Not safe as canonical academic FK |
| Existing RLS policies | Do not copy blindly | Must be redesigned/tested for shared tenant and role model |
| Existing migrations | Archive and reconcile; do not replay as-is | Independent schema histories and project-specific assumptions |
| GitHub localStorage prototype | Prototype only | Not durable operational persistence |
| Existing data | Preserve until approved migration | No data-loss or irreversible cutover without reconciliation evidence |

## 8. Canonical target contracts required before implementation

1. **Identity contract:** shared PULSE person/Auth identity, tenant membership, scoped role grants and trusted actor attribution.
2. **Academic structure contract:** stable IDs, versioned curriculum, ownership decision and explicit taxonomy mapping.
3. **Question contract:** question identity, immutable version, source/provenance, media, taxonomy/concept links and question slot/instance.
4. **Exercise/assignment contract:** exercise definition/version, publication, assignment obligation and effective-dated student context.
5. **Evidence contract:** aggregate quick entry, question-level events, verification, correction, doubts and reconciliation.
6. **Assessment contract:** test definition/version, blueprint, delivery, response, scoring policy and result.
7. **Audit contract:** immutable event envelope, source system, actor and correlation IDs.
8. **Security contract:** tenant-safe FKs, grants, RLS, command/RPC authorization and negative security tests.
9. **Migration contract:** source snapshot, crosswalk, staging, validation, reconciliation, cutover, rollback/forward-fix and retention.

## 9. Prioritised action register

| ID | Priority | Action | Exit evidence | Status |
|---|---|---|---|---|
| ACT-001 | P0 | Product/Technical Owners confirm canonical app and database decision process | Signed decision record | Pending |
| ACT-002 | P0 | Complete full RLS/grant/function/view/trigger security inventory in both apps | Security matrix and negative test plan | Pending |
| ACT-003 | P0 | Freeze target shared identity and tenant contract from DEC-011/012/013 | Approved physical schema contract | Design approved; implementation pending |
| ACT-004 | P0 | Define question identity/version/slot crosswalk | Q-GENOME mapping spec | Pending |
| ACT-005 | P0 | Define System A event/evidence contract and aggregate reconciliation | Event schema + acceptance tests | Pending |
| ACT-006 | P1 | Decide academic catalogue ownership (OPEN-011) | Academic Owner decision | Blocked |
| ACT-007 | P1 | Resolve concurrent active enrolment rule (OPEN-010) | Academic Owner decision | Blocked |
| ACT-008 | P1 | Audit all app source files, routes, RPCs, triggers and migration snapshots | Full source inventory | Partial |
| ACT-009 | P1 | Inventory QBMS media storage and references | Media inventory and integrity report | Pending |
| ACT-010 | P1 | Define test-management domain boundary and scoring version model | Domain contract | Pending |
| ACT-011 | P1 | Build synthetic cross-domain mapping fixtures | Deterministic mapping tests | Pending |
| ACT-012 | P2 | Build canonical migration plan only after gates close | Reviewed migration PR and replay evidence | Not started |
| ACT-013 | P2 | Execute migration in isolated local/staging environment | Counts, checksums, reconciliation and rollback evidence | Not authorized |
| ACT-014 | P2 | Pilot cutover and production release | Explicit approval and release evidence | Not authorized |

## 10. Decisions explicitly not made by this audit

This document does not:
- Select Student Tracking Lovable, QBMS Lovable or GitHub prototype as the canonical application.
- Select standalone PULSE Supabase as canonical operational database.
- Authorize copying or moving student/question/test/media/audit data.
- Authorize schema changes, DDL, grants, RLS changes or Data API exposure.
- Authorize source replacement, branch merge, PR merge, deployment or release.
- Close OPEN-010, OPEN-011 or any other pending owner/academic decision.
- Certify the existing security policies or application workflows as production-ready.

## 11. Recommended sequence

1. Close the identity, tenant, academic catalogue and enrolment decisions that block target contracts.
2. Finish the security inventory of both live databases.
3. Finalize Q-GENOME identity/version/slot contracts and the System A evidence contract.
4. Decide canonical application and operational database through an explicit ADR.
5. Build a migration crosswalk and synthetic fixtures; validate every domain mapping.
6. Only then propose a consolidated application/database implementation plan.

## 12. Approval record

| Approval | Status |
|---|---|
| Read-only audit performed | Recorded |
| Product Owner review | Pending |
| Technical Owner review | Pending |
| Security review | Pending |
| Canonical application decision | Not granted |
| Canonical operational database decision | Not granted |
| Data migration authorization | Not granted |
| DDL / grants / RLS authorization | Not granted |
| Merge / deployment authorization | Not granted |

**Safety statement:** this reconciliation was performed using source reads and SELECT-only database catalog queries. No application files were edited, no data rows were exported, and no database or deployment state was changed.
