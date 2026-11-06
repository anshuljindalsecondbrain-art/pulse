# Requirement Traceability Audit

## Finding

The repository's `docs/governance/REQUIREMENT_TRACEABILITY.md` labels itself an initial baseline and says coverage is incomplete pending source/specification backfill. The existing matrix contains System A requirements SYA-001 through SYA-015 and one governance requirement, but it is not a complete PULSE-wide traceability register.

## Traceability status

| Requirement area | Current evidence | Audit status |
|---|---|---|
| System A independent of QBMS/DTE | Architecture docs + domain design | Design established; prototype partial |
| Six operational states | `domain.ts`, `App.tsx`, tests | Prototype implementation |
| Report vs verification separation | Workflow domain + tests | Domain-only |
| Assignment versioning and obligation planning | Assignment domain + tests | Domain-only |
| Worklist and teacher review queue | Worklist domain + tests | Domain-only |
| Evidence idempotency | Evidence submission domain + tests | Domain-only |
| Correction and doubt workflows | Domain modules + tests | Domain-only |
| Answer evaluation | Answer evaluation domain + tests | Domain-only |
| Timeline | Timeline domain + tests | Domain-only |
| Academic eligibility | Eligibility domain + tests | Prototype/domain-only; backend trust absent |
| Marks and mixed assessment modes | Marking scheme and exercise builder domains | Domain/prototype; backend not integrated |
| DTE institution-defined structure | DTE scope audit + 18 specs | Documentation compliance checked; implementation absent |
| Five A/B experiments | Uploaded requirements source | Requirements documented; telemetry not verified |
| Million-question scale | DTE requirements and architecture | Target requirement; no benchmark evidence |
| Parent secure card | Uploaded source proposes tokenized card | Security design and consent/expiry/revocation not verified |
| AI-assisted tagging | DTE-M17 specification | Specification only; no model/eval pipeline evidence |

## Required traceability remediation

1. Create a source register for all uploaded requirements, project decisions, approved ADRs and external obligations.
2. Assign stable requirement IDs to all PULSE domains, not only System A.
3. Map each requirement to owner module, API/data contract, UI workflow, automated test, operational evidence and release gate.
4. Separate statuses: specified, designed, coded, unit-tested, integration-tested, browser-tested, deployed and production-accepted.
5. Record explicit exclusions and rejected requirements with decision references.
6. Add negative tests for tenant isolation, DTE scope boundaries, XI/XII eligibility, parent-link expiry, append-only evidence and no hidden curriculum authoring.
7. Do not mark a requirement VALIDATED based solely on a pure-domain unit test.

## Source limitations

The uploaded source document includes A/B experiment proposals, older SQL examples and product requirements. The older SQL is not safe migration authority. Requirements are preserved as source intent; implementation readiness requires reconciliation with current architecture decisions.
