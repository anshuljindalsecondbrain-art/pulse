# PULSE Master Event Register

Register version: 1.0 | Last updated: 2026-11-06
Coverage: Initial baseline; historical backfill incomplete.

| Event ID | Date | Category | Module | Title | Status | Evidence |
|---|---|---|---|---|---|---|
| PULSE-EVT-000001 | 2026-11-06 | Governance | Platform-wide | Establish event-driven change governance | PROPOSED | [Event](events/PULSE-EVT-000001.md) |
| PULSE-EVT-000002 | 2026-11-06 | Implementation/backfill | System A | System A prototype and stabilization history | IN_REVIEW | [Event](events/PULSE-EVT-000002.md) |
| PULSE-EVT-000003 | 2026-11-06 | Domain model | System A | Separate student report, verification and evidence projection | VALIDATION_PENDING | [Event](events/PULSE-EVT-000003.md) |
| PULSE-EVT-000004 | 2026-11-06 | Prototype stabilization | System A | Fix batch view mutation and subject persistence | IMPLEMENTED_PENDING_CI | [Event](events/PULSE-EVT-000004.md) |
| PULSE-EVT-000005 | 2026-11-06 | Prototype stabilization / data safety | System A | Harden CSV export and keyboard reset | IMPLEMENTED_PENDING_CI | [Event](events/PULSE-EVT-000005.md) |
| PULSE-EVT-000006 | 2026-11-06 | Database architecture / migration | System A | Add proposed System A database baseline (not applied) | PROPOSED_NOT_APPLIED | [Event](events/PULSE-EVT-000006.md) |
| PULSE-EVT-000007 | 2026-11-06 | Engineering quality / database delivery | System A | Add System A CI and Supabase migration runbook | IMPLEMENTED_PENDING_CI | [Event](events/PULSE-EVT-000007.md) |\n| PULSE-EVT-000008 | 2026-11-06 | System A domain implementation | System A | Separate canonical work evidence, verification and progress metrics | IMPLEMENTED_PENDING_CI | [Event](events/PULSE-EVT-000008.md) |\n| PULSE-EVT-000009 | 2026-11-06 | System A workflow implementation | System A | Add explicit doubt and correction lifecycle transitions | IMPLEMENTED_PENDING_CI | [Event](events/PULSE-EVT-000009.md) |\n| PULSE-EVT-000010 | 2026-11-06 | System A academic workflow implementation | System A | Add immutable assignment publication planning | IMPLEMENTED_PENDING_CI | [Event](events/PULSE-EVT-000010.md) |

Rules: Allocate the next unused global ID; never recycle IDs. Create an individual event record before or alongside substantive implementation. Keep rejected, deferred, blocked and superseded events. Update this index whenever status or evidence changes. Historical coverage is incomplete; add verified events in backfill batches and do not infer missing approvals or tests.
