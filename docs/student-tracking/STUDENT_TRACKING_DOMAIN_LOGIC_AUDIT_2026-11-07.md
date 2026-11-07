# Student Tracking System — Domain Logic Audit Report

**Audit date:** 2026-11-07  
**Repository:** `anshuljindalsecondbrain-art/pulse`  
**Audit branch:** `docs/student-tracking-baseline-reset-2026-11-07`  
**Code baseline inspected:** `887e61c3dde4e9ad4dcaaf827260899ecedd2925`  
**Scope:** Current 11-module Student Tracking System only; Super Admin-only initial pilot.  
**Audit type:** Static source and test inspection. No code changes and no test execution.

## 1. Executive assessment

The domain layer contains substantial workflow preparation logic and a useful set of unit tests. It is not yet ready to be treated as the authoritative business or security boundary.

The most important issue is the mismatch between the multi-actor assumptions in several domain contracts and the approved initial operating model: one authenticated Super Admin operates the system, while students do not have login accounts. A student may be the subject of an academic evidence record without being its authenticated actor. The current contracts often require the actor to be the student.

The next risk is the gap between pure in-memory preparation and transactional persistence. Idempotency checks and immutable object snapshots are useful, but they do not prevent concurrent writes, stale-state transitions, duplicate event insertion or unauthorized requests when used outside a trusted server boundary.

This report records static findings only. It does not claim that any issue has been reproduced at runtime.

## 2. Severity and disposition

| ID | Severity | File(s) | Finding | Required disposition |
|---|---|---|---|---|
| DOM-001 | Critical / product-blocking | `evidence-submission-domain.ts`, `correction-workflow-domain.ts`, `doubt-management-domain.ts`, `workflow-domain.ts` | Actor model assumes direct student/teacher/reviewer actions, conflicting with the Super Admin-only pilot | Redesign actor attribution before schema or UI integration |
| DOM-002 | High | `workflow-domain.ts` | Metrics derive latest student report and decisions from timestamps and map keys, not a fully validated evidence/decision supersession chain | Define canonical chain rules and add adversarial tests |
| DOM-003 | High | `workflow-domain.ts` | Duplicate obligation IDs and duplicate evidence IDs are not rejected by metrics derivation | Validate input identity uniqueness or deduplicate by explicit canonical policy |
| DOM-004 | High | `evidence-submission-domain.ts` | General evidence supersession verifies same learner/obligation/slot and attempt cycle, but does not require the superseded event to be the current chain head | Enforce latest-event pointer/chain-head validation |
| DOM-005 | Critical at persistence boundary | All transition preparation modules | Read-check-prepare operations are not concurrency-safe by themselves | Implement transaction, row/version lock or compare-and-swap plus unique constraints |
| DOM-006 | High | `teacher-verification-domain.ts`, `answer-evaluation-domain.ts`, `correction-workflow-domain.ts` | Supersession ordering is inferred by timestamp and ID sort; the supplied supersession link is not validated as a complete acyclic chain | Validate exact latest decision and reject invalid/cyclic history |
| DOM-007 | Medium | `workflow-domain.ts`, `assignment-domain.ts`, event factories | Timestamp validation uses permissive `Date.parse`; temporal ordering and normalized timezone policy are not consistently enforced | Define timestamp contract and validate event chronology |
| DOM-008 | High | `assignment-domain.ts` | Publication planner trusts supplied module and target roster snapshots; it cannot prove they are current or authorized | Server must load authoritative current roster/catalogue and publish atomically |
| DOM-009 | Medium | `correction-workflow-domain.ts` | Correction event ID uniqueness is not checked against prior correction events by the pure function | Add idempotency/event identity contract for correction transition events |
| DOM-010 | Medium | `doubt-management-domain.ts` | Transition idempotency replay compares payload but returns the supplied current case snapshot; stale snapshot/history consistency needs stronger concurrency semantics | Couple replay and transition to canonical persisted case version |
| DOM-011 | Medium | `academic-eligibility-domain.ts` | Academic eligibility rules are hard-coded policy, with no version/effective-date input | Confirm policy ownership and versioning before database enforcement |
| DOM-012 | High / pilot conflict | `workflow-transitions.ts`, `doubt-management-domain.ts`, `correction-workflow-domain.ts` | Teacher/reviewer/student workflow roles cannot be used as live pilot authorization roles without explicit actor mapping | Keep these as future workflow concepts; map operator attribution separately |

## 3. Detailed findings

### DOM-001 — Actor attribution conflicts with the approved pilot

**Files**
- `apps/student-tracking/src/evidence-submission-domain.ts`
- `apps/student-tracking/src/correction-workflow-domain.ts`
- `apps/student-tracking/src/doubt-management-domain.ts`
- `apps/student-tracking/src/workflow-domain.ts`

**Observed source behavior**
- Student evidence submission requires `actorId === studentId`.
- Correction start and correction submission require the acting user to be the original student.
- Doubt creation distinguishes student, teacher and academic reviewer roles.
- Canonical evidence has one `actorId` and one `actorRole`.

**Why this conflicts**
The approved pilot has one authenticated Super Admin login and no student login. A Super Admin entering a student's reported completion is not the student. The data model must preserve both:
1. the learner the evidence is about; and
2. the authenticated operator who recorded it.

**Required design**
- Introduce explicit `recordedByAuthUserId` / operator attribution resolved server-side.
- Keep `studentId` as the learner subject.
- Preserve source/provenance: student-reported (as communicated to the operator), operator observation, system import, etc.
- Never claim direct student submission when the student did not authenticate and submit it.
- Preserve original teacher attribution only when known and separately from the operator who keyed the record.
- Do not accept actor role or actor ID from browser input as authorization truth.

**Acceptance tests**
- Super Admin can record an aggregate or question-level observation for a student without pretending to be that student.
- The persisted record shows learner subject, actual operator and provenance separately.
- A missing original teacher is represented as unknown/null, not fabricated.
- Browser-supplied role/actor identity cannot override server-resolved operator identity.

### DOM-002 — Metrics do not validate a complete supersession chain

**File:** `apps/student-tracking/src/workflow-domain.ts`

**Observed source behavior**
- Latest student report is selected by sorting `recordedAt` and retaining the last event per obligation.
- Latest decisions are selected by `evidenceEventId + purpose`, sorted by decision timestamp and ID.
- Decision matching checks that the referenced evidence exists and matches obligation and institute.
- It does not validate the full `supersedesDecisionId` chain before using a decision in metrics.

**Risk**
Out-of-order, malformed or conflicting history can produce a plausible but incorrect current status. Timestamp order alone is not proof of a valid event chain.

**Required design**
- Define whether evidence currentness is determined by explicit supersession links, a persisted current-event pointer, or a formally specified ordering rule.
- Validate decision supersession references and reject branching/cyclic histories.
- Define correction acceptance versus correction closure as separate metric states.
- Decide whether a correction accepted but not closed counts as verified completion.

**Acceptance tests**
- Older event recorded late does not replace a newer logical event unless policy explicitly says it should.
- Two events superseding the same parent are rejected or resolved by a documented conflict policy.
- A decision with a missing superseded decision is rejected.
- Cyclic and cross-obligation supersession links are rejected.
- A returned decision cannot silently remain the effective decision after a valid replacement.

### DOM-003 — Metrics do not reject duplicate identity inputs

**File:** `apps/student-tracking/src/workflow-domain.ts`

**Observed source behavior**
- `assignedObligations` uses the raw array length.
- Eligible obligations are filtered into an array; counts and denominators use that array.
- `evidenceById` is a Map, so duplicate evidence IDs overwrite earlier entries in the lookup map.
- The metrics function does not validate uniqueness of obligation IDs or evidence IDs.

**Risk**
Duplicated input rows can inflate totals, progress denominators or distort which evidence a decision appears to reference.

**Required design**
- Reject duplicate obligation IDs at the metrics boundary.
- Reject duplicate evidence IDs and duplicate decision IDs.
- Enforce tenant-safe canonical uniqueness in the database as well.
- Do not silently deduplicate unless a deterministic, documented canonicalization rule exists.

**Acceptance tests**
- Duplicate obligation IDs fail closed.
- Duplicate evidence IDs fail closed.
- Duplicate decisions fail closed.
- Metrics remain stable when input ordering changes.

### DOM-004 — General evidence supersession does not require the current chain head

**File:** `apps/student-tracking/src/evidence-submission-domain.ts`

**Observed source behavior**
When `supersedesEventId` is supplied, the function checks that the referenced event exists and belongs to the same institute, student, obligation, slot and student-report source. It also checks the attempt-cycle ID. It does not establish that this event is the latest event in the chain.

**Comparison**
`correction-workflow-domain.ts` has a stronger check: the submitted correction must supersede `latestCorrectionEvidenceEventId` or the original evidence event.

**Required design**
Use one canonical supersession rule for ordinary resubmission and correction submission. The server must reject stale-parent submissions.

**Acceptance tests**
- Superseding a non-current ancestor is rejected.
- Two concurrent submissions against the same parent cannot both become current.
- A correction cannot supersede evidence from another attempt cycle.

### DOM-005 — In-memory preparation is not concurrency control

**Files:** all domain preparation modules.

**Observed source behavior**
Functions receive snapshots such as existing events, existing decisions and current case state, then return a proposed new immutable object/event.

**Risk**
Two concurrent requests can read the same previous state and both prepare valid-looking transitions. In-memory idempotency checks cannot enforce uniqueness across requests or processes.

**Required persistence controls**
- Database transaction around validation, append and current-state update.
- Unique constraints for event IDs, decision IDs and tenant-scoped idempotency keys.
- Compare-and-swap or row-version check on current state/latest-event pointer.
- Append-only event/decision records; no silent history overwrite.
- Tenant-safe composite foreign keys and server-side authorization.
- Return an explicit conflict when a stale version loses a race.

**Acceptance tests**
Run parallel requests that attempt the same transition and prove exactly one commits while the other receives an idempotent replay or conflict response.

### DOM-006 — Decision supersession is timestamp-derived rather than chain-validated

**Files**
- `teacher-verification-domain.ts`
- `answer-evaluation-domain.ts`
- `correction-workflow-domain.ts`

**Observed source behavior**
The functions sort decision history by `decidedAt` and then ID to select the latest decision. A new decision must name that latest ID in `supersedesDecisionId`.

**Risk**
This is a useful guard but does not prove that the supplied history is a valid single chain. A malformed history can contain branches, cycles, or decisions whose supersession references are inconsistent with the sorted order.

**Required design**
Validate the decision graph/chain, not only the last timestamp-sorted row. Ensure a supersession reference points to the latest valid decision for the same evidence and purpose.

### DOM-007 — Timestamp contract is not sufficiently strict

**Files:** `workflow-domain.ts`, `assignment-domain.ts`, `correction-workflow-domain.ts`, `doubt-management-domain.ts`

**Observed source behavior**
Timestamp checks rely on `Date.parse`. Some event types do not validate chronology between related timestamps.

**Required design**
- Specify RFC 3339 / ISO timestamp format with explicit timezone.
- Normalize to UTC at the persistence boundary.
- Validate `recordedAt >= occurredAt` where appropriate.
- Validate event chronology against prior event/decision timestamps, while allowing documented delayed imports.
- Keep occurred time and recorded time distinct.

### DOM-008 — Assignment publication planner trusts caller-provided snapshots

**File:** `apps/student-tracking/src/assignment-domain.ts`

**Observed source behavior**
The planner verifies selected question IDs exist in the supplied module, rejects duplicate students and generates deterministic slots/obligations. It explicitly leaves authorization, roster freshness and atomic commit to the server/database boundary.

**Required design**
- Load module/catalogue snapshot and eligible roster from trusted server-side records.
- Validate tenant, batch, enrolment and effective academic context at publication time.
- Record the exact roster and eligibility snapshot used.
- Publish version and obligations in one transaction.
- Enforce unique assignment version number and deterministic slot/obligation identities in the database.

### DOM-009 — Correction transition event IDs lack a complete replay contract

**File:** `apps/student-tracking/src/correction-workflow-domain.ts`

**Observed source behavior**
Correction start, restart, submission, review and close prepare events. Submission has an idempotency path for correction evidence; review has decision replay. The pure functions do not consistently check an event ID against an existing correction-event history.

**Required design**
- Define one idempotency contract for every correction command.
- Persist unique event IDs and request idempotency keys.
- A replay must return the original committed event and resulting cycle snapshot.
- Reuse of an ID with different content must fail.

### DOM-010 — Doubt transition replay requires canonical persisted versioning

**File:** `apps/student-tracking/src/doubt-management-domain.ts`

**Observed source behavior**
The function validates the latest-event pointer against supplied history and supports exact replay. It receives a case snapshot and event list from its caller.

**Risk**
A valid snapshot can become stale between read and write. The pure function cannot establish that it is still the database's current version at commit time.

**Required design**
Add a case version or expected latest-event ID to the transactional command. Update only if the persisted pointer still matches.

### DOM-011 — Academic eligibility policy needs ownership and versioning

**File:** `apps/student-tracking/src/academic-eligibility-domain.ts`

**Observed source behavior**
Class, stream and subject compatibility rules are hard-coded. The function has no policy version or effective date.

**Required decision**
Academic Owner must approve the rules and define how changes affect existing published assignments. The current baseline says academic context is effective-dated; eligibility should be evaluated against the context effective at publication time.

### DOM-012 — Multi-role workflow vocabulary is not the pilot authorization model

**Files**
- `workflow-transitions.ts`
- `doubt-management-domain.ts`
- `correction-workflow-domain.ts`

**Observed source behavior**
Transitions permit STUDENT, TEACHER and ACADEMIC_REVIEWER actions.

**Required disposition**
Do not enable these as separate pilot logins. Retain the academic lifecycle concepts only where they represent recorded academic facts. Pilot commands must be issued by the authenticated Super Admin, with the target learner and provenance stored separately. Later role-based access can be introduced only through an approved authorization decision.

## 4. Existing tests — strengths and gaps

### Strengths observed
- Evidence source/actor consistency checks.
- Separation of completion verification and answer evaluation.
- Exclusion of exempted/removed obligations from progress denominators.
- Exact learner/institute/obligation/slot checks in answer evaluation.
- Idempotent retry and identifier conflict checks in several commands.
- Correction attempt-cycle preservation.
- Doubt assignment, resolution, student confirmation and reopening sequence.
- Assignment duplicate student/question checks.
- Academic eligibility examples for XI, XII, dropper, JEE, NEET and COMMON.

### Missing or insufficiently demonstrated test families
1. Super Admin-only pilot attribution tests.
2. Duplicate IDs across all metrics input arrays.
3. Branched/cyclic/missing supersession history.
4. Stale-parent evidence submission.
5. Concurrent state transition and duplicate publication races.
6. Strict timestamp format and chronology.
7. Stale roster / changed enrolment between draft and publication.
8. Correction transition event ID replay/conflict.
9. Policy version and effective-dated academic context.
10. Database-level RLS, tenant isolation, transaction and unique-constraint tests.

## 5. Recommended implementation order

Do not rewrite all modules at once.

### Gate A — Product/domain contract
1. Approve the Super Admin actor attribution model.
2. Approve evidence provenance vocabulary for manual entry, student-reported information, teacher-originated information and imports.
3. Decide how correction acceptance versus closure affects verified completion.
4. Approve evidence and decision supersession semantics.
5. Confirm academic eligibility policy ownership and versioning.

### Gate B — Pure domain hardening
1. Add uniqueness validation to metrics inputs.
2. Add evidence chain-head validation.
3. Add decision-chain validation.
4. Standardize timestamp parsing and chronology.
5. Add correction event replay/idempotency.
6. Add regression tests before implementation changes.

### Gate C — Persistence design
1. Transactional append-and-transition command boundary.
2. Tenant-safe FKs and uniqueness.
3. Expected-version / latest-event compare-and-swap.
4. Server-derived actor identity and authorization.
5. Append-only evidence and audit events.
6. Integration and concurrency tests.

### Gate D — Pilot vertical slice
Implement only the approved first vertical slice: Super Admin authentication and operator attribution, Student Master, then Academic Structure and Batch/Enrolment. Do not expose student/teacher logins or excluded QBMS/DTE/AI-Mentor features.

## 6. Execution verification status

| Check | Status |
|---|---|
| Source files inspected | Completed for listed domain modules |
| Existing test files inspected | Completed for listed domain modules |
| Unit tests executed | Not run |
| Typecheck executed | Not run |
| Build executed | Not run |
| Database integration tests | Not run |
| Supabase schema/security reinspection | Not performed in this audit |
| Code changes | None |
| Database changes | None |
| Deployment / merge | None |

No test-pass claim should be made until commands are executed against the exact code commit.

## 7. Next action

The next work item is to resolve **DOM-001** with an explicit pilot event/actor contract. After that, write regression tests for DOM-002 through DOM-004 and DOM-006 before changing implementation.

This report is an audit artifact, not authorization to implement schema changes, apply migrations, merge PRs or deploy.
