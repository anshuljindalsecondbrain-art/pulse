# System A — Backend implementation status

**As of:** 2026-11-06  
**Branch:** `feat/system-a-abhyas-foundation`  
**Supabase project:** PULSE (`nnvssbfezkliavwxhgbh`)  
**Release status:** NOT PRODUCTION READY

## Verified live database state

The connected Supabase project was inspected before implementation:

- `public` contains no application tables.
- Supabase migration history is empty.
- Security advisor returned no current lints because no application schema has been deployed.
- The repository contains a proposed System A initial schema migration, but it has not been applied.
- The proposed migration enables and forces RLS, then revokes direct table access from `anon` and `authenticated`. It intentionally creates no access policies. This is fail-closed, but it also means application reads/writes are not yet enabled.

## Code committed in this increment

- `apps/student-tracking/src/lib/system-a-repository.ts`
  - Resolves the authenticated Supabase user.
  - Lists the user's active institute memberships.
  - Resolves a learner identity from the authenticated user and institute.
  - Lists only that learner's eligible obligations.
  - Appends a learner self-report as a new evidence event; it never updates a previous event.
  - Uses explicit institute/student/obligation filters as defense in depth.

## Mandatory blockers before enabling live writes

1. Complete the authorization design for institute, centre, batch and academic assignment scope.
2. Add database-side actor-role validation. The current baseline has a client-supplied `source_actor_role`; it must not be trusted for authorization or audit truth.
3. Add tested RLS policies and minimum required grants for each table and operation. Do not use broad `USING (true)` policies.
4. Add an idempotent server-side publication transaction that resolves assignment targets into immutable student obligations.
5. Complete missing workflow tables and constraints for disputes, appeals, recognition, parent/mentor links and notification delivery before claiming full System A scope.
6. Resolve policy for shared global subjects versus institute-owned subjects, and enforce same-tenant subject/chapter/slot relationships with composite foreign keys.
7. Add database integration tests for cross-tenant denial, role scope, append-only evidence, idempotency, publication retry and parent-link revocation.
8. Run typecheck, unit tests, production build, browser tests and Supabase security/performance advisors against the actual candidate schema.

## Academic state vocabulary

The current application and master specification use six classroom input states:

- U — Unattempted
- C — Correct
- I — Incorrect
- D — Doubt
- S — Skipped
- P — Partially Correct

These are an interaction vocabulary, not the canonical academic state model. The database keeps work progress, answer outcome, doubt, verification, correction and eligibility as separate dimensions. Do not replace the six current UI states with an older five-state vocabulary without an explicit academic-owner decision.

Teacher observation is a separate evidence event and actor source; it must not be represented as a student self-report status.

## Deployment and data safety

- Do not enter real student data into the local demo.
- Do not apply the proposed migration to production until the authorization design, academic decisions and database tests are approved.
- Do not expose a Supabase secret/service-role key in browser code.
- Do not mark System A production-ready merely because a frontend preview builds.


## Additional domain implementation (2026-11-06)

The following domain-only increment has been added after the initial repository adapter:

- `src/workflow-domain.ts`
  - Canonical work progress, answer evaluation, doubt, verification and correction dimensions.
  - Evidence source and actor-role contracts.
  - Immutable typed evidence and purpose-specific verification decision constructors.
  - Separately denominated reported progress, verified progress and answer accuracy projections.
  - Explicit handling for eligible, exempted and removed obligations.
  - Accuracy is calculated only from answer-evaluation decisions attached to the current report; completion confirmation does not imply correctness.
- `src/workflow-transitions.ts`
  - Doubt assignment, work, resolution, student confirmation and reopening transitions.
  - Correction start, resubmission, return, acceptance and closure transitions.
  - Actor-category and reason validation at the domain boundary.
- Corresponding unit tests are in `workflow-domain.test.ts` and `workflow-transitions.test.ts`.

**Boundary:** These are pure domain contracts and deterministic helpers. They do not persist events, enforce tenant membership, prove role grants, implement database transactions, or replace RLS. Academic policy approval, server-side authorization, integration tests and operational UI remain outstanding.


## Assignment publication planning increment (2026-11-06)

Added `src/assignment-domain.ts` and `src/assignment-domain.test.ts`:

- Validates selected question references against one existing offline module.
- Creates an ordered immutable assignment-version snapshot with source module/question metadata.
- Expands the target roster into one obligation per learner per question slot.
- Separates eligible and exempted obligations and exposes denominators in a deterministic summary.
- Uses deterministic version-scoped slot and obligation identifiers for retry-stable planning.
- Rejects duplicate question selections, duplicate learners, empty targets, foreign question references and due dates before publication.

**Boundary:** This is a pure planning function. It does not resolve the authoritative roster, authorize the publisher, persist assignment versions, atomically create obligations, send notifications or enforce database idempotency. Those remain server/database responsibilities and are blocked on the authorization/RLS design.


## Student worklist and teacher verification projection increment (2026-11-06)

Added `src/worklist-domain.ts` and `src/worklist-domain.test.ts`:

- Builds a learner-specific worklist from eligible obligations and immutable assignment-version slots.
- Excludes exempted obligations and reports belonging to other learners or institutes.
- Projects submission and completion verification as distinct states.
- Builds a teacher review queue from the latest submitted student report per eligible obligation.
- Matches completion decisions to the exact evidence event and resolves decision history deterministically.

**Boundary:** These are pure read-model projections. They do not authenticate the learner, authorize teacher batch scope, query Supabase, persist verification decisions, or provide operational UI. Server-side identity and tenant authorization remain mandatory.


## Student evidence submission command increment (2026-11-06)

Added `src/evidence-submission-domain.ts` and `src/evidence-submission-domain.test.ts`:

- Validates that a self-report is attributed to the learner identity supplied by the trusted caller.
- Checks institute, learner, eligible obligation, assignment version and exact question-slot consistency.
- Recognizes an exact idempotent retry and returns the original immutable evidence record.
- Rejects reuse of an idempotency key with a changed submission payload.
- Requires a resubmission to supersede evidence for the same learner and obligation; correction resubmission preserves the original attempt-cycle identifier.
- Creates a new append-only evidence event and never mutates historical records.

**Boundary:** This is a pure command-preparation contract. It does not authenticate the actor, authorize tenant membership, read or write Supabase, or enforce concurrent idempotency. Production requires server-derived identity and scope, database uniqueness constraints, and a transactional write path.


## Teacher verification command increment (2026-11-06)

Added `src/teacher-verification-domain.ts` and `src/teacher-verification-domain.test.ts`:

- Restricts completion decisions to teacher and academic-reviewer roles.
- Requires the obligation to be included in the trusted caller's authorized scope.
- Validates institute, obligation and exact evidence-event identity.
- Accepts only submitted student self-reports; teacher observations and in-progress reports cannot enter this completion queue.
- Prevents a learner from verifying their own submission.
- Restricts outcomes to CONFIRMED, NOT_CONFIRMED, RETURNED and REJECTED.
- Preserves decision history; a new decision must explicitly supersede the latest decision for that exact report.
- Supports exact decision retry and rejects conflicting decision-ID reuse.

**Boundary:** The authorized obligation list is supplied by the caller and is not itself authorization. The server must derive reviewer role and scope from authenticated context. The helper does not persist decisions or enforce RLS/transactional uniqueness.



## Correction workflow command increment (2026-11-06)

Added `src/correction-workflow-domain.ts` and `src/correction-workflow-domain.test.ts`:

- Starts a correction cycle only from the exact RETURNED completion decision attached to the original submitted student evidence.
- Binds the cycle to institute, learner, obligation, question slot, original evidence, original attempt-cycle ID and originating return decision.
- Appends a new immutable student evidence event for correction; requires the original attempt-cycle ID to be preserved and the latest event in the correction chain to be superseded.
- Supports exact idempotent start, submission and review retries; rejects conflicting identifier reuse.
- Supports teacher/academic-reviewer acceptance or return of the exact latest correction submission.
- Repeated returns restart the same correction cycle and retain the complete prior evidence and review chain.
- Closes only after the latest correction submission has an ACCEPTED correction decision.
- Every transition requires an actor, reason and valid timestamp.

**Boundary:** This is a pure domain command contract. It does not authenticate users, authorize tenant/assignment scope, persist records, guarantee concurrent idempotency, or replace RLS and server-side role validation. No database schema or production data was changed.
