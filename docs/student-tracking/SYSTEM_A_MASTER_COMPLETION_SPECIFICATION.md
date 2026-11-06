# System A — Master Completion Specification
**Product:** PULSE Student Work Tracking / Abhyas Matrix  
**System boundary:** System A operates independently of QBMS and the Deep Tagging Engine (DTE).  
**Status:** Master implementation baseline — proposed for review; not a production schema or authorization policy.  
**Repository:** `anshuljindalsecondbrain-art/pulse`  
**Working branch:** `feat/system-a-abhyas-foundation`

---

## 1. Purpose and non-negotiable principles

System A records, manages and explains student academic work from assignment through reporting, review, correction and progress analysis.

1. System A must operate without QBMS or DTE.
2. Student evidence is append-only. Corrections and later decisions add records; they do not rewrite prior evidence.
3. Student self-report, teacher observation, answer evaluation and teacher verification are distinct facts.
4. Exercise, exercise version, exercise slot, assignment, assignment version and student obligation are distinct entities.
5. Publication resolves the intended student population into a reproducible snapshot.
6. Progress and analytics are rebuildable projections over source events and versioned policies.
7. Tenant isolation and role authorization are enforced server-side; UI visibility is not authorization.
8. DTE enrichment may improve derived analytics but must never mutate original student evidence.
9. All important decisions must be attributable to an actor, timestamp, reason and source.
10. No production migration may be applied until the connected database has been inspected and the migration reviewed.

## 2. Scope

### In scope
- Institute, centre, user, role and student access context.
- Student roster and effective-dated batch membership.
- Exercise creation, versioning, question slots and marking schemes.
- Assignment targeting, publication and student obligations.
- Student reports and teacher observations.
- Answer evaluation and independent verification.
- Attempt cycles, correction cycles and resubmissions.
- Doubt cases, assignment, resolution and student confirmation.
- Disputes, appeals and recognition of prior evidence.
- Progress projections, academic review, mentor intervention and parent read-only views.
- CSV export, auditability, notifications and controlled experimentation.
- Optional, versioned QBMS/DTE enrichment integration.

### Out of scope for the first operational release
- AI prediction or automated high-stakes decisions.
- Automatic concept clustering before reliable question identity/enrichment exists.
- Microservices or a separate event-streaming platform.
- Silent changes to historical assignments, evidence or results.

## 3. Roles and access baseline

| Role | Minimum permitted scope |
|---|---|
| Student | Read own obligations; submit own reports and doubt requests; view own permitted feedback |
| Parent/guardian | Read-only access to explicitly linked student data |
| Teacher | Operate only assigned centres/batches; create exercises; assign within authority; record observations and evaluations |
| Academic reviewer | Review and verify within assigned academic scope; record independent decisions |
| Mentor | Read authorized learner progress; record interventions and outcomes |
| Content administrator | Maintain approved academic content references and enrichment links |
| Institute administrator | Manage institute users, centres, batches, policies and access grants |
| Platform administrator | Platform-level operations under explicit privileged controls and audit |

Every read and write must be scoped by tenant/institute and applicable academic assignment. Parent access requires a valid, active relationship. Cross-tenant access must be denied by default.

## 4. Canonical domain objects

| Object | Responsibility / invariant |
|---|---|
| Institute / Centre | Tenant and operational boundary |
| User / Role grant | Authenticated actor and scoped authority |
| Student | Stable learner identity |
| Parent-student link | Explicit, revocable relationship |
| Batch / Membership | Cohort and effective-dated membership history |
| Exercise | Stable exercise identity |
| Exercise version | Immutable published content/configuration snapshot |
| Exercise slot | Stable position within an exercise version; displayed Q1…QN is presentation |
| Assignment | Stable assignment identity |
| Assignment version | Immutable target, schedule, instructions and exercise-version snapshot |
| Assignment target | Batch or individual targeting rule |
| Student obligation | One learner's obligation for a published assignment/slot |
| Report event | Append-only student report or actor-attributed work evidence |
| Observation event | Append-only teacher-entered classroom observation |
| Evaluation event | Answer assessment, score and rubric evidence |
| Verification decision | Independent decision linked to exact evidence and purpose |
| Attempt cycle | Distinguishes initial work from later practice/revision |
| Correction cycle | Tracks return, resubmission and acceptance separately |
| Doubt case / event | Doubt lifecycle, ownership, resolution and confirmation |
| Dispute / appeal | Formal challenge and independent outcome |
| Recognition decision | Approved equivalence/credit for prior evidence |
| Enrichment link | Optional link to QBMS question identity/version and DTE taxonomy version |
| Audit event | Security- and governance-relevant actor action |
| Projection / refresh job | Rebuildable read model with source watermark and policy version |

### Identity and version rules
- Use server-generated stable identifiers (UUID or equivalent); never use timestamps as identity.
- A displayed question number is not a question identity.
- A slot must refer to the exact exercise version in which it exists.
- A published assignment version must be immutable.
- A new publication revision must explicitly describe its delta and treatment of existing obligations.
- A later QBMS link must not be required to create or track a System A slot.

## 5. Evidence model

### Evidence source / actor
Every evidence record must identify:
- tenant/institute;
- student;
- obligation and slot;
- actor ID and actor role at event time;
- source type (student self-report, teacher observation, system import, authorized guardian input where permitted);
- event type and payload;
- trusted server timestamp and ordering sequence;
- client occurrence time when relevant;
- idempotency key / request identity;
- correlation and causation references;
- schema/policy version.

### Append-only rules
- Never update or delete a report/observation/evaluation/verification event as a normal workflow operation.
- A correction is a new event referencing the earlier event.
- A verification decision references the exact event reviewed.
- A new student report does not inherit verification of a previous report.
- Duplicate submissions must be idempotent.
- The server, not the client, is authoritative for event ordering.
- Rejected or invalid submissions must be recorded in operational audit logs without corrupting academic evidence.

## 6. Independent academic dimensions

The six classroom input states remain available as a simple interaction vocabulary:

- U — Unattempted
- C — Correct
- I — Incorrect
- D — Doubt
- S — Skipped
- P — Partially Correct

They are not the complete canonical academic state model. They combine concepts that can coexist. The canonical model must separate:

| Dimension | Illustrative values |
|---|---|
| Work progress | Not started, Attempted, Submitted, Completed, Skipped |
| Answer evaluation | Not evaluated, Correct, Incorrect, Partially correct, Not applicable |
| Doubt | None, Open, Assigned, In progress, Resolved, Student confirmed, Reopened |
| Verification | Pending, Confirmed, Returned, Rejected |
| Correction | Not required, Required, In progress, Resubmitted, Accepted, Closed |
| Dispute | None, Open, Under review, Upheld, Rejected, Withdrawn |
| Recognition | Not considered, Pending, Accepted, Rejected, Revoked |
| Eligibility | Eligible, Exempted, Removed by approved decision |

The final vocabulary and transition rules require academic-owner approval before database implementation.

## 7. Core workflows and acceptance criteria

### A. Roster and membership
- Create/import students with unique institute-scoped identifiers and roll numbers.
- Validate duplicates before commit.
- Maintain effective-dated batch memberships.
- Transfers do not erase historical memberships or obligations.
- Deactivation preserves historical records and access is revoked appropriately.

**Acceptance:** A student transfer does not change the target snapshot or history of an already published assignment.

### B. Exercise creation
- Create draft exercise with name, subject, instructions, question count and scope.
- Support single-chapter, multi-chapter, cumulative and full-course scope.
- Support per-slot chapter mapping.
- Configure question type, maximum marks, marking scheme and optional per-slot overrides.
- Validate required fields and slot count.
- Create stable slots; displayed numbers are Q1…QN.
- Allow preview, save draft, duplicate and create a new version.

**Acceptance:** Selecting Chemistry, Mathematics or Biology persists the selected subject. Multi-chapter exercises preserve chapter mapping at slot level.

### C. Assignment targeting and publication
- Target one or more batches and/or individual students.
- Resolve eligible students at publication time.
- Record a reproducible target snapshot and exclusion reasons.
- Publish an immutable assignment version.
- Generate one student obligation per applicable student-slot pair.
- Make publication idempotent.
- Support explicit revision, cancellation, extension and reassignment decisions.

**Acceptance:** Retrying publication cannot create duplicate obligations. A student joining later is not silently added to a prior snapshot.

### D. Student work reporting
- Student can view only authorized obligations.
- Student can submit a report against the correct obligation and slot.
- Submission captures actor, source, time, attempt cycle and optional evidence/media.
- Offline/retry submissions use idempotency keys.
- A later report creates a new event.

**Acceptance:** Re-reporting does not overwrite the earlier report and a duplicate network retry does not create duplicate evidence.

### E. Teacher observation and verification
- Teacher can record a classroom observation distinct from student self-report.
- Reviewer can verify a specific report/observation for a specified purpose.
- Verification requires role and assignment authorization.
- Decision records outcome, reason, rubric and timestamp.
- A later report remains unverified until separately reviewed.

**Acceptance:** A verification of report R1 cannot verify report R2, even when both concern the same slot.

### F. Evaluation, attempts and correction
- Evaluation is distinct from completion verification.
- Attempt cycles distinguish initial attempt and later practice/revision.
- Correction cycles begin only when a valid decision requires correction.
- Resubmission references the correction cycle and prior evidence.
- Correction acceptance does not erase the original evaluation.

**Acceptance:** A correction resubmission is not silently counted as a new independent assignment or attempt cycle.

### G. Doubt management
- Create doubt case against a student obligation/slot.
- Assign owner and priority; record events and responses.
- Resolve with explanation/evidence.
- Capture student confirmation or reopening.
- Support cohort-level triage without collapsing individual student cases.

**Acceptance:** Resolving a cohort topic does not automatically mark every student's doubt as resolved without individual evidence or an explicit approved bulk action.

### H. Dispute and recognition
- Student/authorized actor can raise a dispute within policy.
- Independent reviewer records outcome and rationale.
- Recognition of prior/equivalent work requires an explicit decision and provenance.
- Recognition never deletes the original obligation or source evidence.

**Acceptance:** An accepted recognition decision changes the relevant projection while retaining the original obligation and its history.

### I. Parent and mentor views
- Parent view is read-only and relationship-scoped.
- Mentor view is scoped to assigned learners.
- Interventions record reason, action, owner, date and outcome.
- Notifications disclose only data authorized for the recipient.

**Acceptance:** Revoking a parent link immediately removes future access; historical access attempts are auditable.

## 8. Progress and metric policy

Metrics must be named by meaning, not collapsed into a generic completion percentage.

Required base counts:
- assigned obligations;
- eligible obligations;
- reported attempts;
- submitted/completed reports;
- teacher-observed work;
- verified completion;
- evaluated answers;
- correct / incorrect / partially correct;
- skipped;
- open doubts;
- correction required / pending / accepted;
- disputed;
- recognized;
- exempted / removed.

Rules:
1. Accuracy denominator includes only answers evaluated under an approved evaluation policy.
2. Attempted, submitted, completed and verified are separate metrics.
3. Skipped is not attempted.
4. Doubt is not automatically equivalent to attempted or completed; policy must decide.
5. Recognition and exemption are reported separately from student-submitted work.
6. Every metric definition is versioned and includes an effective date.
7. As-of reporting must be reproducible from event history and policy version.
8. UI labels must disclose the denominator and relevant scope.

**Open academic decision:** Approve exact treatment of D (Doubt), P (Partially Correct), teacher observations and unverified reports in each metric before release.

## 9. Analytics and DTE boundary

System A owns original operational evidence. QBMS and DTE are optional enrichment providers.

- Store external question identity/version only as an optional association to a stable slot.
- Store enrichment source, taxonomy schema/version, mapping confidence and review state.
- Never rewrite a report, evaluation or verification because a tag changes.
- Rebuild concept/topic analytics as separate projections.
- Support historical analytics by taxonomy version and as-of timestamp.
- If enrichment is missing or unavailable, all core System A workflows continue.

## 10. Security, privacy and audit requirements

- Authentication required for all non-public operational data.
- Server-side tenant and role authorization on every operation.
- RLS policies must be deny-by-default and tested with positive and negative cases.
- Never use broad authenticated read policies for tenant data.
- Validate all IDs and relationships server-side; do not trust client-supplied tenant, role or actor identity.
- Restrict privileged functions and review SECURITY DEFINER usage.
- Minimize student/parent PII and define retention/deletion policy.
- Log privileged access, exports, role changes, publication, verification, disputes and administrative actions.
- Do not put sensitive student data in analytics telemetry or client logs.
- Define backup, restore, incident response and audit access controls.

## 11. Non-functional requirements

- Correctness and auditability take precedence over convenience.
- Publication and bulk event writes must be transactional or have explicit recoverable partial-state semantics.
- All write APIs must be idempotent where retries are possible.
- Read projections must expose freshness/watermark information.
- Large rosters and question matrices must support pagination or virtualization.
- UI must support keyboard navigation, accessible labels, focus management and mobile use.
- Time values are stored as UTC instants; institution timezone (IANA identifier) governs calendar display and due-date interpretation.
- No silent data loss on network, browser storage or server errors.
- Export must neutralize spreadsheet formula injection and enforce export authorization.

## 12. Proposed delivery phases and gates

| Phase | Deliverable | Exit gate |
|---|---|---|
| 0. Prototype stabilization | Fix batch mutation, subject selection, metrics, storage validation, export and accessibility | Regression tests pass |
| 1. Domain freeze | State model, actors, event contracts, versioning, metric policy, edge-case decisions | Academic/product owner approval |
| 2. Backend discovery | Supabase as-built inventory, auth/RLS audit, migration map | No unverified assumptions remain |
| 3. Secure foundation | Tenant model, roles, audited APIs, append-only events | Security and integration tests pass |
| 4. Assignment lifecycle | Exercise versions, slots, targets, publication and obligations | Idempotency and snapshot tests pass |
| 5. Work lifecycle | Reporting, observations, evaluation, verification, attempts, correction | End-to-end evidence trace passes |
| 6. Academic operations | Doubts, disputes, recognition, mentor and parent workflows | Role-based acceptance tests pass |
| 7. Intelligence | Metrics, projections, optional DTE enrichment, experiments | Reproducibility and data-quality checks pass |
| 8. Production acceptance | Performance, accessibility, recovery, monitoring, staff pilot | Formal release sign-off |

Do not skip gates or parallelize dependent phases in a way that locks in unresolved domain decisions.

## 13. Test matrix — minimum release coverage

| Test group | Required cases |
|---|---|
| Domain | Valid/invalid transitions; independent dimensions; version invariants |
| Evidence | Append-only history; duplicate IDs; idempotency; trusted ordering |
| Assignment | Snapshot correctness; late joiner; transfer; revision; cancellation |
| Obligations | Exactly one applicable student-slot obligation; no duplicate publication |
| Verification | Exact-event linkage; purpose; actor authorization; stale decision |
| Correction | Return, resubmit, accept, reject, reopen; no attempt conflation |
| Doubt | Individual ownership; cohort action; confirmation; reopening |
| Metrics | Denominators; as-of reconstruction; policy version; zero denominators |
| Security | Cross-tenant denial; student/parent/teacher/reviewer scope; privileged RPC |
| UI | Keyboard, mobile, modal focus, empty states, retry/error behavior |
| Export | Authorization, correct scope, CSV formula injection protection |
| Operations | Migration rollback, backup restore, projection rebuild, audit retrieval |

## 14. Traceability register

| ID | Requirement | Priority | Phase | Verification |
|---|---|---:|---:|---|
| SA-001 | System A independent of QBMS/DTE | P0 | 1 | Core workflow works without enrichment |
| SA-002 | Append-only student evidence | P0 | 3 | Event history and immutability tests |
| SA-003 | Separate actor/source types | P0 | 1–5 | Actor/source authorization tests |
| SA-004 | Stable exercise/version/slot identity | P0 | 1–4 | Version and identity tests |
| SA-005 | Assignment publication snapshot | P0 | 4 | Target snapshot tests |
| SA-006 | Student obligation per applicable slot | P0 | 4 | Cardinality/idempotency tests |
| SA-007 | Independent verification | P0 | 5 | Exact-event linkage tests |
| SA-008 | Separate attempt and correction cycles | P0 | 5 | Lifecycle tests |
| SA-009 | Multi-chapter and full-course scope | P1 | 4 | Exercise configuration tests |
| SA-010 | Question type and marking scheme | P1 | 4 | Scoring tests |
| SA-011 | Doubt lifecycle and cohort triage | P1 | 6 | Doubt workflow tests |
| SA-012 | Versioned progress metrics | P0 | 7 | As-of reconstruction tests |
| SA-013 | Tenant isolation and RLS | P0 | 2–3 | Negative authorization tests |
| SA-014 | Parent/mentor scoped views | P1 | 6 | Relationship and role tests |
| SA-015 | Disputes and appeals | P2 | 6 | Appeal workflow tests |
| SA-016 | Recognition of prior evidence | P2 | 6 | Provenance and projection tests |
| SA-017 | Optional DTE retroactive enrichment | P1 | 7 | No-source-mutation tests |
| SA-018 | A/B allocation and telemetry | P2 | 7 | Deterministic assignment and event tests |
| SA-019 | Accessibility and responsive matrix | P1 | 0, 5 | Browser/accessibility tests |
| SA-020 | Safe export and audit controls | P1 | 0, 3 | Security/export tests |

## 15. Decisions required before database schema freeze

These are genuine product/academic decisions; this document does not silently assume their answers.

1. Does D (Doubt) mean the student attempted the question, or only requested help?
2. Does P (Partially Correct) count as completed, attempted, or evaluated only?
3. Can teachers enter student work on behalf of students, and how must it be labelled?
4. Which roles can verify attempt, completion and answer correctness independently?
5. Can a published assignment be amended in place through a new version, and what happens to existing obligations?
6. What is the exact late-work, absence, exemption and reassignment policy?
7. What is the first release's marking-scheme scope: common scheme per exercise or per-slot override?
8. Which student and parent data fields are essential, and what retention policy applies?
9. Which metric definitions are official for institute reports and parent reports?
10. Which A/B experiments are required in the first pilot, and what telemetry consent/governance applies?

## 16. Current implementation status (baseline at audit)

The current repository contains a Vite/React/TypeScript demo UI, localStorage-backed roster/exercise/marks, a six-state matrix, CSV export, a basic exercise creator, basic Doubt Radar visualization, a visual-only A/B switch, a small domain module and unit tests.

It does **not** yet provide production authentication, tenant security, Supabase persistence, assignment publication, student obligation generation, append-only event storage in the application workflow, teacher verification UI, correction lifecycle, parent/mentor workflows, operational doubt management, real A/B allocation/telemetry, browser tests or production deployment.

Latest recorded CI checks passed for typecheck, unit tests, build and PR governance on the audited head. This is a code-quality baseline only, not production acceptance.

## 17. Change control

Every implementation PR must include:
- Requirement ID(s) from this specification.
- User-visible and data-model impact.
- Security/privacy impact and tenant boundary.
- Migration/backfill/rollback impact, if any.
- Tests added and test evidence.
- Documentation updated.
- Explicit statement whether original evidence or historical projections can change.

Changes to core invariants, event semantics, metric definitions, authorization or assignment snapshot rules require explicit review before implementation.
