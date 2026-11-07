# Student Tracking — Domain Regression Test Specification

**Date:** 2026-11-07  
**Status:** TEST DESIGN ONLY — not an implementation or policy approval  
**Scope:** Current 11-module Student Tracking System; domain findings DOM-002 through DOM-011  
**Baseline:** `docs/student-tracking/STUDENT_TRACKING_DOMAIN_LOGIC_AUDIT_2026-11-07.md`  
**Restriction:** Do not use this document to infer approval of the proposed Super Admin actor/provenance contract, physical schema, RLS policies, migrations, or production changes.

## 1. Purpose

Define adversarial regression cases that should be added before hardening the pure domain functions or connecting them to persistence. The cases target identity integrity, supersession history, concurrency boundaries, timestamps, assignment snapshot freshness, replay semantics and policy versioning.

Tests must be written against the actual exported API and established test conventions after the source files are available for exact inspection. Names below are logical test descriptions, not assertions about current function signatures.

## 2. Test groups and acceptance criteria

### RG-01 — Metrics input identity uniqueness (DOM-003)

| Case | Input condition | Expected result |
|---|---|---|
| RG-01.1 | Two assigned obligations have the same canonical obligation ID | Reject the input; do not count both |
| RG-01.2 | Two evidence events have the same canonical evidence ID but different payloads | Reject; do not let Map overwrite determine the winner |
| RG-01.3 | Two verification decisions have the same decision ID | Reject |
| RG-01.4 | Same valid unique records supplied in different array orders | Identical metrics |
| RG-01.5 | Duplicate IDs occur across different tenants/institutes | Apply the documented identity scope; tenant-safe IDs must not cross-link |

**Gate:** No silent deduplication unless a separately approved canonicalization rule defines which record survives.

### RG-02 — Evidence supersession chain integrity (DOM-002, DOM-004)

| Case | Input condition | Expected result |
|---|---|---|
| RG-02.1 | New event supersedes the current chain head | Accept if all scope and cycle invariants pass |
| RG-02.2 | New event supersedes an ancestor while a later descendant exists | Reject as stale-parent |
| RG-02.3 | Two candidate events supersede the same parent | Reject one as conflict or apply a documented single-winner transaction policy |
| RG-02.4 | Supersession references a missing event | Reject |
| RG-02.5 | Supersession references another student, obligation, slot, institute or attempt cycle | Reject |
| RG-02.6 | Supersession graph contains a cycle | Reject |
| RG-02.7 | Older event has a later recording timestamp than the logical current event | Do not infer currentness from timestamp alone |
| RG-02.8 | Delayed import legitimately records an older occurrence | Preserve occurrence and recording time separately; apply an explicit import policy |

**Gate:** Currentness must follow one documented chain/pointer rule, not incidental array order or timestamp sorting.

### RG-03 — Verification/decision chain integrity (DOM-006)

| Case | Input condition | Expected result |
|---|---|---|
| RG-03.1 | Decision supersedes the current valid decision for same evidence and purpose | Accept |
| RG-03.2 | Decision supersedes an older ancestor | Reject stale-parent |
| RG-03.3 | Decision references a missing superseded decision | Reject |
| RG-03.4 | Decision references another evidence event or purpose | Reject |
| RG-03.5 | Decision graph contains a branch or cycle | Reject |
| RG-03.6 | Two decisions race to supersede one parent | Exactly one current successor; loser receives conflict or exact replay |
| RG-03.7 | Same decision ID and identical payload replayed | Return original committed decision |
| RG-03.8 | Same decision ID reused with different payload | Reject identifier conflict |

**Gate:** The chain must be validated independently of timestamp/ID ordering.

### RG-04 — Strict timestamp and chronology contract (DOM-007)

| Case | Input condition | Expected result |
|---|---|---|
| RG-04.1 | Valid RFC 3339 timestamp with UTC offset | Accept and normalize at persistence boundary |
| RG-04.2 | Timestamp without timezone where timezone is required | Reject |
| RG-04.3 | Invalid calendar date or malformed offset | Reject |
| RG-04.4 | Recording time precedes occurrence time | Reject unless an explicit clock-skew/import exception is defined |
| RG-04.5 | Correction/resubmission predates the evidence it claims to correct | Reject |
| RG-04.6 | Delayed import has occurrence time before recording time | Accept only under explicit provenance/import policy |
| RG-04.7 | Two events have identical timestamps | Use sequence/causal linkage, not unstable sort assumptions |

**Gate:** Define accepted timestamp grammar, UTC normalization, clock-skew handling and delayed-import exceptions before implementation.

### RG-05 — Assignment publication snapshot freshness (DOM-008)

| Case | Input condition | Expected result |
|---|---|---|
| RG-05.1 | Draft roster and current roster are identical | Publication can proceed |
| RG-05.2 | Student enrolment changed after draft creation | Re-resolve eligibility at publication; do not trust stale client snapshot |
| RG-05.3 | Student transferred to another batch before publication | Apply approved effective-date rule |
| RG-05.4 | Batch or exercise version belongs to another tenant | Reject |
| RG-05.5 | Same publication request retried with same idempotency key | Return original publication result; no duplicate obligations |
| RG-05.6 | Two publication requests race for same assignment version | One atomic publication; no partial/duplicate obligations |
| RG-05.7 | Transaction fails while generating obligations | Roll back assignment publication and all generated obligations |
| RG-05.8 | New student joins batch after publication | Do not silently add old obligations |

**Gate:** Server loads authoritative roster/catalogue, snapshots eligibility, and publishes assignment plus obligations atomically.

### RG-06 — Correction event replay (DOM-009)

| Case | Input condition | Expected result |
|---|---|---|
| RG-06.1 | New correction transition event has a unique ID | Accept valid transition |
| RG-06.2 | Same event ID and same payload replayed | Return original event/result |
| RG-06.3 | Same event ID reused with changed payload | Reject conflict |
| RG-06.4 | Transition uses stale correction-cycle version | Reject conflict |
| RG-06.5 | Correction evidence belongs to another obligation/attempt cycle | Reject |
| RG-06.6 | Correction is accepted, then closed | Preserve both facts and their timestamps |

**Gate:** Every correction command has a consistent event-ID and request-idempotency contract.

### RG-07 — Doubt case version/replay integrity (DOM-010)

| Case | Input condition | Expected result |
|---|---|---|
| RG-07.1 | Transition references current case version/latest event | Accept |
| RG-07.2 | Transition references stale case version | Reject conflict |
| RG-07.3 | Exact prior request replayed | Return original committed event and resulting case |
| RG-07.4 | Idempotency key reused with different payload | Reject conflict |
| RG-07.5 | Resolution followed by confirmation | Preserve separate events/states |
| RG-07.6 | Reopening a resolved case | Append event; do not rewrite history |

**Gate:** Replay result must come from canonical persisted state, not an arbitrary caller-supplied snapshot.

### RG-08 — Academic eligibility policy versioning (DOM-011)

| Case | Input condition | Expected result |
|---|---|---|
| RG-08.1 | Eligibility evaluated under an identified policy version | Result records policy version |
| RG-08.2 | Policy changes after an assignment is published | Historical assignment retains original eligibility basis |
| RG-08.3 | Student academic context changes after publication | Existing obligations are not silently recalculated |
| RG-08.4 | Policy effective date is after evaluation time | Reject use of future policy |
| RG-08.5 | Policy version is missing or inactive | Fail closed or use an explicitly approved fallback |

**Gate:** Academic Owner must approve policy ownership, versioning and retroactivity before database enforcement.

## 3. Persistence-boundary tests (DOM-005)

Pure unit tests cannot establish transaction isolation. Once a trusted server command layer exists, add integration tests using two concurrent database sessions.

1. Both sessions read the same current evidence head.
2. Both attempt to append a successor with different event IDs.
3. Exactly one transaction becomes the current successor.
4. The other receives a deterministic conflict or exact idempotent replay.
5. No event is deleted or overwritten.
6. Cross-tenant references fail at database constraints/policies.
7. A failed transaction leaves no partial obligations, events or audit records that imply success.

Repeat for assignment publication, verification decisions, correction transitions and doubt transitions.

## 4. Test implementation sequence

1. Confirm exact application branch, commit SHA, source paths and test conventions.
2. Re-fetch source and existing tests; do not rely on earlier static audit notes as a substitute.
3. Add failing unit tests for RG-01 through RG-04 and RG-06 through RG-08.
4. Implement only after the relevant product/domain policy is approved.
5. Add RG-05 and persistence-boundary concurrency tests with a reviewed transactional command design.
6. Run unit tests, typecheck and build on the exact candidate SHA.
7. Record command, result, timestamp and commit SHA.
8. Run database integration and cross-tenant tests only against an explicitly authorized test environment.

## 5. Explicitly unresolved owner decisions

This specification does not resolve:

- Super Admin operator versus learner/source actor attribution (DOM-001/012).
- Whether reported teacher information may be represented as formal teacher verification.
- Correction acceptance versus correction closure in verified-completion metrics.
- Evidence and decision supersession policy details.
- Academic eligibility policy ownership and retroactivity.
- Concurrent active enrolment policy (OPEN-010).
- Shared versus institute-owned academic catalogue policy (OPEN-011).
- Teaching assignment model (OPEN-018).

## 6. Current verification status

- Test cases specified: yes.
- Tests added to application: no.
- Tests executed: no.
- Typecheck/build executed: no.
- Schema or migration changed: no.
- Database changed: no.
- PR merged or deployment performed: no.

This document is a reviewable test-design artifact only. It is not evidence that any test currently passes and does not authorize implementation or deployment.
