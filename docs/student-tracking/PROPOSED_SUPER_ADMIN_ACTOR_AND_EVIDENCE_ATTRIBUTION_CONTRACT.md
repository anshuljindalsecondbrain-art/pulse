# Proposed Decision — Super Admin Pilot Actor and Evidence Attribution Contract

**Date:** 2026-11-07  
**Project:** STUDENT_TRACKING_SYSTEM  
**Status:** PROPOSED — requires Product Owner / Academic Owner approval  
**Scope:** Initial Super Admin-only pilot; current 11-module Student Tracking System  
**Related audit:** `STUDENT_TRACKING_DOMAIN_LOGIC_AUDIT_2026-11-07.md`, DOM-001 and DOM-012

## 1. Decision required

The current domain model frequently treats the student whose work is being recorded as the authenticated actor. That assumption is incompatible with the approved initial pilot:

- There is one authenticated Super Admin login.
- Students do not have login accounts in the pilot.
- The Super Admin manually creates and maintains student records.
- The authenticated operator must be recorded as the person who entered or changed a record.
- The student remains the learner/subject of the academic record.

This proposal defines how those identities and facts should be represented.

## 2. Proposed canonical concepts

Keep these concepts separate. Do not overload a single `actorId` field to represent all of them.

| Concept | Meaning | Pilot rule |
|---|---|---|
| Learner / subject | Student whose academic work or progress the record concerns | Required for student-specific evidence |
| Authenticated operator | Authenticated person who performed the create/update/record action | Required; resolved server-side from the authenticated session |
| Original academic source actor | Teacher or other academic person who originally assigned, checked, observed or communicated the information | Optional; record only when known and supported |
| Reported-by party | Person who communicated the information, e.g. student or parent | Optional; must not imply authenticated submission |
| Evidence provenance | How the information entered the system | Required |
| Occurrence time | When the academic event reportedly happened | Required where known; preserve uncertainty |
| Recording time | When the system recorded the information | Required; server-generated |

## 3. Proposed provenance vocabulary

The following values are proposed for review. They describe the source of information, not authorization roles.

| Proposed code | Meaning | Example |
|---|---|---|
| `OPERATOR_ENTERED` | Operator entered information without a separately asserted reporter | Super Admin records an observed classroom status |
| `STUDENT_REPORTED_TO_OPERATOR` | Student communicated the information to the operator; operator entered it | Student tells Super Admin that 8 questions were attempted |
| `TEACHER_REPORTED_TO_OPERATOR` | Teacher communicated the information; operator entered it | Teacher gives checked DPP results |
| `PARENT_REPORTED_TO_OPERATOR` | Parent communicated the information; operator entered it | Parent reports a student's absence |
| `OPERATOR_OBSERVED` | Operator directly observed the academic event | Super Admin observes a student completing work |
| `SYSTEM_IMPORT` | Information was imported by a controlled system process | Approved CSV import |

**Important:** `STUDENT_REPORTED_TO_OPERATOR` is not a student self-submission. `TEACHER_REPORTED_TO_OPERATOR` is not a teacher-authenticated verification. Provenance must never be converted into a stronger claim than the source supports.

## 4. Proposed evidence attribution fields

Logical contract only; not a physical schema or migration.

| Field | Required? | Authority / rule |
|---|---|---|
| `student_id` | Yes for learner evidence | References the learner subject |
| `recorded_by_auth_user_id` | Yes | Resolved by trusted server from authenticated session |
| `provenance_code` | Yes | Controlled vocabulary |
| `reported_by_person_id` | Conditional | Optional; only when reporter is known and can be represented safely |
| `original_teacher_person_id` | Conditional | Optional; only when the source teacher is known |
| `occurred_at` | Conditional | Academic occurrence time; may be unknown or approximate under explicit policy |
| `recorded_at` | Yes | Server-generated timestamp |
| `operator_note` | Optional | Context entered by operator |
| `source_reference` | Optional | Import batch, paper register or other traceable source reference |

Do not use a free-text name, email address or editable profile field as an identity or authorization key. Do not invent teacher attribution when it is unknown.

## 5. Proposed distinction between academic facts

The pilot must not conflate these separate facts:

1. **Reported completion:** a learner or another source says work was completed.
2. **Operator entry:** the Super Admin records the report or observation.
3. **Teacher verification:** a teacher actually checked the work; the evidence must identify the teacher/source and basis when known.
4. **Answer evaluation:** correctness or partial correctness was assessed against a marking basis.
5. **Correction:** a later work submission or correction was recorded as a new event.

An operator entering a teacher-reported result does not make the operator the teacher-verifier. A reported completion does not prove correctness. A completion check does not prove answer correctness.

## 6. Proposed authorization and validation invariants

1. The client must not choose or override `recorded_by_auth_user_id`.
2. The server derives the authenticated operator from the validated session.
3. The server verifies that the operator has the permitted Super Admin grant for the tenant and operation.
4. The client may identify the target student, but the server validates that student and all related records belong to the authorized tenant.
5. The learner subject is never inferred from the authenticated operator.
6. A student record does not require an Auth identity or tenant membership merely to exist.
7. Provenance values are validated against the controlled vocabulary.
8. Original teacher attribution is optional and cannot be fabricated from the operator identity.
9. Historical evidence is append-only; correction creates a new event and preserves the original.
10. Every write records server-side operator identity and timestamp.
11. A system import uses a distinct system process identity and records the initiating operator/import batch where applicable.
12. Authorization is enforced server-side and at the database boundary; hiding UI controls is not authorization.

## 7. Proposed pilot workflows

### A. Student-reported aggregate exercise result

- Target student: Student A
- Provenance: `STUDENT_REPORTED_TO_OPERATOR`
- Reported by: Student A, if reliably known
- Authenticated operator: Super Admin
- Recorded values: assigned, attempted, correct, incorrect, skipped
- Verification: none unless a separate check is actually performed

This must not be stored as an authenticated student self-report.

### B. Teacher supplies checked work results

- Target student: Student A
- Provenance: `TEACHER_REPORTED_TO_OPERATOR`
- Original teacher: Teacher B, if known
- Authenticated operator: Super Admin
- Verification/evaluation: only represented as a teacher decision if the teacher actually made that decision and the source/basis is preserved under the approved policy

The operator must not be attributed as the teacher.

### C. Super Admin directly observes a student

- Target student: Student A
- Provenance: `OPERATOR_OBSERVED`
- Authenticated operator: Super Admin
- Original teacher: absent unless separately known
- Evidence: observation with date/time and concise note

This is an operator observation, not a teacher verification.

### D. CSV import

- Target student: matched by a validated student identifier
- Provenance: `SYSTEM_IMPORT`
- Authenticated initiating operator: Super Admin
- Import process identity: system
- Source reference: import batch/file checksum and row reference under retention policy
- Invalid/unmatched rows: rejected or quarantined; never silently assigned to a guessed student

## 8. Impact on existing domain modules

| Module | Required adaptation |
|---|---|
| `workflow-domain.ts` | Separate learner subject, provenance, operator and original academic source |
| `evidence-submission-domain.ts` | Do not require the student to be the authenticated actor for operator-entered evidence |
| `teacher-verification-domain.ts` | Preserve actual verifier/source identity; operator entry alone cannot manufacture verification |
| `answer-evaluation-domain.ts` | Preserve actual evaluator identity and evaluation basis separately from recorder |
| `correction-workflow-domain.ts` | Pilot correction is recorded by Super Admin; learner remains the subject; do not imply student login |
| `doubt-management-domain.ts` | Record who reported the doubt and who entered/handled it; defer student-confirmation claims that require student-authenticated action |
| Assignment publication | Super Admin is publisher/operator in pilot; academic ownership remains a separate fact if needed |

## 9. Questions requiring explicit approval

These are owner decisions; this proposal does not silently decide them.

| Decision | Proposed default | Approval needed |
|---|---|---|
| Can Super Admin record student-reported completion? | Yes, with `STUDENT_REPORTED_TO_OPERATOR` provenance | Product Owner |
| Can Super Admin record teacher-reported correctness? | Yes as reported information; it becomes a formal teacher evaluation only if the actual teacher decision is attributable and evidenced | Academic Owner |
| Is teacher identity mandatory for teacher-originated evidence? | No; allow unknown/null with provenance and note | Academic Owner |
| Can Super Admin directly verify completion? | Yes, as operator verification only if explicitly defined; do not label it teacher verification | Academic Owner |
| Can students confirm doubt resolution in the pilot without login? | Not as an authenticated student action; record as reported confirmation if communicated to operator | Product Owner / Academic Owner |
| Should occurrence time be mandatory for all manually entered records? | No; allow unknown/approximate with explicit quality marker | Academic Owner |
| Is parent-reported information in initial pilot? | Allow only if required by approved operating procedure | Product Owner |

## 10. Acceptance criteria before implementation

- [ ] Product Owner approves learner/operator/source separation.
- [ ] Academic Owner approves provenance vocabulary and meaning of verification/evaluation.
- [ ] Pilot actor matrix explicitly lists permitted Super Admin operations.
- [ ] Every write obtains operator identity server-side.
- [ ] No student/teacher login is introduced by this work.
- [ ] No false student self-report or teacher verification can be created.
- [ ] Audit history preserves who entered, what source was claimed, and when it was recorded.
- [ ] Tenant isolation is enforced independently of UI role labels.
- [ ] Unit and integration tests cover all four workflows above.
- [ ] Existing multi-role domain assumptions are either adapted or explicitly deferred.

## 11. Status and implementation boundary

**Status remains PROPOSED.** This document is not an approved product decision, physical database schema, migration, security policy or deployment instruction.

No code, database, RLS, grants, migrations, production data, PR merge or deployment is authorized by this proposal.

After owner approval, update the governing baseline/decision register, then implement domain tests and the Super Admin vertical slice.
