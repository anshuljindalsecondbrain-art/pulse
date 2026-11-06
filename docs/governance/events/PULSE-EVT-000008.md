# PULSE-EVT-000008 — Separate canonical work evidence, verification and progress metrics

- Category: System A domain implementation
- Module(s): System A / Abhyas Matrix
- Created / updated: 2026-11-06
- Status: IMPLEMENTED_PENDING_CI
- Origin and source reference: System A Master Completion Specification, sections 5–8 and 13; System A Database Architecture, sections 4–8.
- Requirement ID(s): PULSE-REQ-SYA-004, PULSE-REQ-SYA-005, PULSE-REQ-SYA-006
- Related event / issue / ADR: PULSE-EVT-000003; PULSE-ISSUE-0010

## Original request / evidence
“Build remaining parts  of this system A”

The master specification requires student self-report, teacher observation, answer evaluation and teacher verification to remain distinct facts. It also requires independent work, answer, doubt, verification and correction dimensions, with progress metrics using explicit denominators.

## Problem / opportunity
The prototype's six classroom statuses are useful interaction shorthand but are not a sufficient canonical academic record. A submitted student status must not imply verified completion or answer correctness. The prior domain model did not yet encode source actor roles, evidence source, verification purpose-specific outcomes, or metric denominators across eligible obligations.

## Impact and dependencies
- Academic: separates work progress from answer evaluation, doubt, verification and correction.
- Data: adds immutable typed evidence and decision contracts; no database schema is changed.
- Security: validates source/actor consistency in the domain layer. Server-side role authorization and RLS remain mandatory and are not supplied by these helpers.
- API: introduces typed client/domain contracts only; no production API or RPC is exposed.
- Analytics: computes separately named reported, verified and accuracy metrics; percentages are null when denominators are zero.
- Dependencies: database authorization, obligation publication and persistent event storage remain future phases.

## Options and recommendation
Keep the six cell statuses as the compact classroom input vocabulary while introducing separate canonical workflow dimensions. Do not reinterpret C/I/D/P as independently evaluated outcomes without a purpose-specific verification decision.

## Decision and approval
Implementation choice recorded as a reversible domain-layer increment. Product/academic policy approval remains Pending; no production metric policy is declared approved by this event.

## Acceptance criteria
- [x] Student self-report and teacher observation are represented by distinct evidence sources.
- [x] Evidence requires actor, institute, student, obligation, slot, attempt cycle, idempotency key and timestamps.
- [x] Verification decisions reference one exact evidence event and have purpose-compatible outcomes.
- [x] Completion confirmation does not imply answer correctness.
- [x] Reported and verified progress use separate numerators.
- [x] Accuracy uses explicit answer-evaluation decisions only.
- [x] Exempted and removed obligations are excluded from the eligible denominator and shown separately.
- [x] Zero denominators produce null percentages rather than fabricated zero accuracy.
- [ ] Database authorization and persistence integration tests.
- [ ] Academic owner approval of metric and transition policy.

## Implementation evidence
- Branch: `feat/system-a-abhyas-foundation`
- PR: https://github.com/anshuljindalsecondbrain-art/pulse/pull/2
- Commits: `72db719cf70f1f373f8d09dc283c6bcfc0266da4`, `44a8fff1d890631edb795b683a269e147a498128`
- Changed paths:
  - `apps/student-tracking/src/workflow-domain.ts`
  - `apps/student-tracking/src/workflow-domain.test.ts`

## Validation evidence
- GitHub Actions System A CI run must be checked for this exact head commit.
- The test file covers actor/source consistency, immutable evidence, purpose-specific decisions, reported-vs-verified separation, correctness denominator, eligibility denominator and zero-denominator behavior.
- No database integration, browser or device test is claimed here.

## Documentation updates
- Requirement traceability matrix.
- Master event register.
- Pull request traceability metadata.

## Open risks / next actions
- Do not treat client-side domain validation as authorization.
- Add server-side append-only event persistence and exact role checks only after RLS and database authorization design are reviewed.
- Obtain academic approval for D/P, teacher observation and recognition metric policy.
- Add browser workflows after backend lifecycle contracts are stable.

## Amendments / supersession
None.
