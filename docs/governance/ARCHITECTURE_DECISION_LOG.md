# PULSE Architecture Decision Log

This index links architectural decisions. Accepted decisions remain immutable; changes require a superseding ADR.

| ADR | Date | Decision | Status | Scope |
|---|---|---|---|---|
| ADR-0001 | 2026-11-06 | Event-driven governance and GitHub-based implementation history | PROPOSED | Platform-wide |
| ADR-0002 | 2026-11-06 | Student report and teacher verification are separate evidence streams | ACCEPTED_BASELINE | System A |

Status: PROPOSED, ACCEPTED_BASELINE, SUPERSEDED, REJECTED or DEFERRED.

## ADR-0001 — Event-driven governance
Context: project history needs traceability beyond Git commits.
Decision: use individual event records plus a master register, requirement traceability and evidence logs in GitHub.
Status: PROPOSED pending project-owner approval.
Consequences: documentation and PR gates become part of delivery.

## ADR-0002 — Independent student report and verification
Context: student-reported work is not equivalent to teacher verification.
Decision: preserve reports and teacher decisions as separate records. A verification decision references the exact report event. Current UI/read models are projections.
Status: ACCEPTED_BASELINE from System A architecture direction; frontend implementation is not a production persistence guarantee.
Consequences: correction/resubmission creates new evidence and/or linked workflow records; it must not overwrite historical reports.
