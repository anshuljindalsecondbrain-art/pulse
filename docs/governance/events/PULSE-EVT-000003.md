# PULSE-EVT-000003 — Separate student report, verification and projection

- Category: Domain model / implementation
- Module: System A
- Created: 2026-11-06
- Status: VALIDATION_PENDING
- Origin: System A architecture baseline and project conversation.
- Branch: feat/system-a-abhyas-foundation
- PR: https://github.com/anshuljindalsecondbrain-art/pulse/pull/2

## Requirement
A student's report is source evidence and must not be treated as teacher verification. Teacher decisions reference the exact report reviewed. Current matrix state is a rebuildable projection; prior evidence remains available.

## Implemented domain contracts
- StudentReportEvent is a readonly domain record.
- VerificationDecision is separate and references reportEventId.
- Factory functions validate identifiers, positive question number and timestamp parseability.
- projectEvidence selects latest report per student-obligation-question slot.
- Verification projection is scoped to the exact report event; verification for an older report does not verify a newer report.
- Timestamp ties use event ID as deterministic tie-break.

## Limitation
Readonly types, frozen objects and pure projection are frontend/domain safeguards only. They do not provide durable append-only storage, database immutability, authorization, trusted server timestamps, foreign-key enforcement or protection from a malicious client.

## Acceptance criteria
- Report and verification types remain independent.
- Projection does not mutate or delete source arrays.
- Latest report selection is deterministic.
- Verification attaches only to the report event it reviewed.
- Tests cover preservation, supersession, scoping and input-order independence.

## Evidence
Files: apps/student-tracking/src/domain.ts and apps/student-tracking/src/domain.test.ts
Commits include 35e925aa117da0792a2517c2dafa4f97885f5064, e16120ef8d1d7d10279e62478376623d788fb703 and 0bb99096d42e8b573e303c416f2926fe3ee29ced.
CI validation on final recorded head: pending confirmation.

## Follow-up
Validate timestamp and duplicate-ID behavior more rigorously. Add correction-cycle domain contract and tests. Implement trusted server-side append-only persistence only after Supabase environment inspection.
