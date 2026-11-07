# System A — Transaction, Concurrency and Idempotency Design

**Document ID:** STS-DB-TXN-002  
**Version:** 1.0.0  
**Status:** Detailed proposal — technical/security approval pending  
**Date:** 2026-11-07  
**Parent:** PULSE-DATA-CORE-007; PDB v1.0; COMMAND_RPC_CATALOG.md

## 1. Transaction invariants

- A business command either commits all required facts or commits none.
- Actor, tenant, membership, grant and resource scope are resolved inside the trusted command boundary.
- All tenant-owned FKs are tenant-qualified.
- Immutable facts are appended; projections may be updated.
- Retried commands cannot create duplicate logical outcomes.
- Conflicting reuse of an idempotency key is rejected.
- Notifications and external calls occur after commit via outbox.
- Every command has a bounded lock set and documented isolation/concurrency behavior.

## 2. Command transaction matrix

| Command | Atomic records | Lock/concurrency control | Retry |
|---|---|---|---|
| CMD-001 draft | Assignment + version + selected source refs | New aggregate insert; unique code/version | Idempotency |
| CMD-002 new version | New version + items/targets + current pointer | Assignment row lock + expected version | Idempotency + version check |
| CMD-003 approve | Approval decision + audit | Version row lock; unique active decision policy | Idempotency |
| CMD-004 publish | Publication state + target snapshots + obligations + audit + outbox | Assignment/version lock; deterministic uniqueness; roster snapshot isolation | Idempotency |
| CMD-005 report | Evidence event + projection pointer + audit | Obligation/attempt lock or conditional state check | Idempotency |
| CMD-006 observation | Observation + audit | Obligation lock/conditional validation | Idempotency |
| CMD-007 verify | Decision + audit | Obligation lock; exact evidence reference | Idempotency |
| CMD-008 evaluate | Evaluation + audit | Obligation lock; exact evidence reference | Idempotency |
| CMD-009–012 correction | Cycle/event/evidence/decision/projection + audit | Obligation/cycle lock; transition guard | Idempotency |
| CMD-013–014 doubt | Case/event/state pointer + audit | Case/obligation lock; event sequence | Idempotency |
| CMD-015 export | Export request + audit | Scoped snapshot/watermark; worker claim lock | Idempotency |
| CMD-016 membership/grant | Effective-dated association/grant + audit | Membership/grant row lock; no self-escalation | Idempotency |

## 3. Isolation and locking policy

- Use PostgreSQL default READ COMMITTED where uniqueness, row locks and conditional writes are sufficient.
- Use SELECT ... FOR UPDATE on the aggregate row for assignment publication, version transitions, correction lifecycle and doubt state transitions.
- Use SELECT ... FOR KEY SHARE or equivalent validation where parent identity must remain stable while child rows are created.
- Use SERIALIZABLE only where a true predicate/phantom anomaly cannot be prevented with a constraint, lock or materialized guard row; implement bounded retry for serialization failures.
- Use unique constraints as the final arbiter for duplicate publication, obligations, attempt cycles and idempotency.
- Avoid locking entire tenant or batch tables for ordinary operations.
- Lock ordering must be consistent: tenant-scoped aggregate → version/case/obligation → child event rows. Document deviations to avoid deadlocks.

## 4. Idempotency contract

Recommended uniqueness:
`UNIQUE(tenant_id, actor_person_id, command_name, idempotency_key)`.

Persist:
- tenant_id;
- actor_person_id resolved server-side;
- command_name and command_version;
- idempotency_key;
- normalized_payload_hash;
- status (IN_PROGRESS/COMPLETED/FAILED_RETRYABLE where required);
- result references;
- created_at/completed_at;
- request/correlation ID.

Rules:
1. First request claims key in the same transaction as the business mutation where feasible.
2. Same key + same canonical payload returns original result (IDEMPOTENT_REPLAY).
3. Same key + different payload returns IDEMPOTENCY_CONFLICT.
4. Concurrent same-key requests serialize on unique key; only one creates the logical result.
5. A retryable transaction rollback leaves no partial business data. Retry with the same key.
6. Do not cache a transient failure as a completed successful command.
7. Payload canonicalization must normalize key order, timestamps, IDs and default values before hashing.
8. Idempotency key must be high-entropy and scoped to one actor/command/tenant.
9. Retention duration is a separate operational policy; do not expire keys while clients may legitimately retry.

## 5. Transaction A — assignment publication

Preconditions:
- authenticated publisher and current assignment.publish grant;
- exact assignment version approved and publishable;
- approval decision references the exact version;
- author/approver separation passes;
- source-question references are valid and selectable;
- all target selectors are within publisher scope;
- due/release and timezone valid;
- idempotency key accepted.

Sequence:
1. Begin.
2. Resolve actor/person, membership, grant and scope from database.
3. Claim idempotency key and compare normalized payload hash.
4. Lock assignment aggregate and exact version.
5. Verify expected version and lifecycle state.
6. Resolve target roster using approved snapshot semantics.
7. Validate tenant, batch, student and effective academic context for each target.
8. Insert publication-time target snapshots.
9. Insert deterministic student × assignment-item obligations.
10. Set publication state and published metadata.
11. Append domain event and audit event.
12. Insert outbox event.
13. Store completed idempotency result.
14. Commit.

A failure at any step rolls back all steps. Outbox delivery occurs only after commit.

## 6. Transaction B — student report submission

1. Begin and resolve current actor/student from auth context.
2. Claim idempotency key.
3. Lock/validate obligation and optional attempt cycle.
4. Verify own student, tenant, eligibility, version and reportable state.
5. Append immutable report event with server recorded_at.
6. Update current worklist projection pointer/state only if transition is valid.
7. Append audit/domain event.
8. Store result and commit.

Client occurred_at is provenance only; it cannot replace server recorded_at or reorder authoritative event sequence.

## 7. Transaction C — verification and evaluation

Completion verification and answer evaluation are distinct transactions and decision tables. Each must:
- resolve reviewer/evaluator and exact permission;
- validate assigned resource scope;
- reference exact report event and obligation;
- check self-review restriction;
- lock the obligation or decision stream for ordering;
- append immutable decision and audit;
- supersede prior decision by explicit link rather than update/delete;
- update projections atomically.

## 8. Transaction D — correction and doubt

Correction:
- lock obligation and correction cycle;
- require exact eligible RETURNED decision;
- append cycle/event;
- new student submission is a new report event linked to cycle;
- reviewer appends decision;
- close only after latest correction accepted.

Doubt:
- lock case or obligation while creating the case;
- append events with monotonic per-case sequence;
- state projection update occurs in same transaction;
- resolve and student-confirm are separate facts;
- reopen appends event and never erases earlier resolution.

## 9. Concurrency edge cases

| Race | Required outcome |
|---|---|
| Two publishers publish same version | One logical publication; second replays or conflicts |
| Same idempotency key, different payload | One accepted; other receives conflict |
| Student submits same event twice | One evidence event |
| Student reports while obligation is exempted | One command wins under lock; invalid later command denied |
| Teacher verifies while student submits newer report | Decision remains attached to exact report; newer report is separately reviewed |
| Two reviewers decide same evidence simultaneously | Deterministic serialization; policy chooses first valid decision or explicit supersession |
| Assignment version edited while publication begins | Row lock/expected version prevents stale publish |
| Student transfers batch after publication | Historical obligation remains; future eligibility follows explicit transfer policy |
| Role revoked during command | Authorization is checked in transaction; lock/consistency strategy defines revocation race |
| Outbox worker retries delivery | Outbox event ID and consumer idempotency prevent duplicate side effects |

## 10. Outbox delivery

Write outbox event in the same transaction as the academic change. Worker:
- claims rows with bounded batch and SKIP LOCKED;
- records attempt count, next_attempt_at and delivery state;
- retries transient failure with bounded backoff;
- records terminal failure/dead-letter state;
- uses provider idempotency keys where supported;
- never modifies source academic evidence;
- does not cause core transaction rollback after commit.

## 11. Error handling

- VERSION_CONFLICT: reload and intentionally reapply.
- IDEMPOTENCY_CONFLICT: do not reuse the key for a new payload.
- Serialization/deadlock retry: bounded retry with same idempotency key.
- Temporary network response loss after commit: retry same key and return original result.
- Permanent validation/authorization failure: do not retry without changed state/permission.
- Never expose database constraint names or SQL text to end users.

## 12. Required transaction tests

- rollback injected after each publication write stage;
- concurrent duplicate publication;
- same key/same payload replay;
- same key/different payload conflict;
- concurrent student report retries;
- stale expected version;
- report and verification race;
- correction cycle transition race;
- doubt case sequence ordering;
- role revocation concurrent with sensitive command;
- outbox worker duplicate delivery;
- transaction retry after network timeout;
- tenant-crossing FK attempts.

## 13. Approval gates

Isolation/locking policy, idempotency retention, target snapshot semantics, publication amendment behavior, revocation race semantics, outbox retry policy and command placement must be approved before SQL/RPC implementation.
