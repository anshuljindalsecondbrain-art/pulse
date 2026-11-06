# PULSE Master Event Register

Register version: 1.1 | Last updated: 2026-11-06
Coverage: Initial baseline; historical backfill incomplete.

| Event ID | Date | Category | Module | Title | Status | Evidence |
|---|---|---|---|---|---|---|
| PULSE-EVT-000001 | 2026-11-06 | Governance | Platform-wide | Establish event-driven change governance | PROPOSED | [Event](events/PULSE-EVT-000001.md) |
| PULSE-EVT-000002 | 2026-11-06 | Implementation/backfill | System A | System A prototype and stabilization history | IN_REVIEW | [Event](events/PULSE-EVT-000002.md) |
| PULSE-EVT-000003 | 2026-11-06 | Domain model | System A | Separate student report, verification and evidence projection | VALIDATION_PENDING | [Event](events/PULSE-EVT-000003.md) |
| PULSE-EVT-000004 | 2026-11-06 | Prototype stabilization | System A | Fix batch view mutation and subject persistence | IMPLEMENTED_PENDING_CI | [Event](events/PULSE-EVT-000004.md) |
| PULSE-EVT-000005 | 2026-11-06 | Prototype stabilization / data safety | System A | Harden CSV export and keyboard reset | IMPLEMENTED_PENDING_CI | [Event](events/PULSE-EVT-000005.md) |
| PULSE-EVT-000006 | 2026-11-06 | Database architecture / migration | System A | Add proposed System A database baseline (not applied) | PROPOSED_NOT_APPLIED | [Event](events/PULSE-EVT-000006.md) |
| PULSE-EVT-000007 | 2026-11-06 | Engineering quality / database delivery | System A | Add System A CI and Supabase migration runbook | IMPLEMENTED_PENDING_CI | [Event](events/PULSE-EVT-000007.md) |
| PULSE-EVT-000008 | 2026-11-06 | System A domain implementation | System A | Separate canonical work evidence, verification and progress metrics | IMPLEMENTED_PENDING_CI | [Event](events/PULSE-EVT-000008.md) |
| PULSE-EVT-000009 | 2026-11-06 | System A workflow implementation | System A | Add explicit doubt and correction lifecycle transitions | IMPLEMENTED_PENDING_CI | [Event](events/PULSE-EVT-000009.md) |
| PULSE-EVT-000010 | 2026-11-06 | System A academic workflow implementation | System A | Add immutable assignment publication planning | IMPLEMENTED_PENDING_CI | [Event](events/PULSE-EVT-000010.md) |
| PULSE-EVT-000011 | 2026-11-06 | System A academic workflow implementation | System A | Add student worklist and teacher verification queue projections | IMPLEMENTED_PENDING_CI | [Event](events/PULSE-EVT-000011.md) |
| PULSE-EVT-000012 | 2026-11-06 | System A evidence command implementation | System A | Add validated, idempotent student evidence submission contract | IMPLEMENTED_PENDING_CI | [Event](events/PULSE-EVT-000012.md) |
| PULSE-EVT-000013 | 2026-11-06 | System A academic review command implementation | System A | Add controlled teacher verification command contract | IMPLEMENTED_PENDING_CI | [Event](events/PULSE-EVT-000013.md) |
| PULSE-EVT-000014 | 2026-11-06 | System A correction workflow command implementation | System A | Add correction cycle, submission, review and closure contracts | VALIDATED_DOMAIN_ONLY | [Event](events/PULSE-EVT-000014.md) |
| PULSE-EVT-000016 | 2026-11-06 | System A answer evaluation command implementation | System A | Add independent, evidence-linked answer evaluation and superseding decision history | IMPLEMENTED_PENDING_CI | [Event](events/PULSE-EVT-000016.md) |

| PULSE-EVT-000017 | 2026-11-06 | System A evidence projection | System A | Add read-only learner evidence timeline across reports, decisions, corrections and doubts | VALIDATED_DOMAIN_ONLY | [Event](events/PULSE-EVT-000017.md) |

Rules: Allocate the next unused global ID; never recycle IDs. Create an individual event record before or alongside substantive implementation. Keep rejected, deferred, blocked and superseded events. Update this index whenever status or evidence changes. Historical coverage is incomplete; add verified events in backfill batches and do not infer missing approvals or tests.
| PULSE-EVT-000015 | 2026-11-06 | System A doubt management command implementation | System A | Add doubt case creation, assignment, investigation, resolution, confirmation and reopening contracts | IMPLEMENTED_PENDING_CI | [Event](events/PULSE-EVT-000015.md) |

| PULSE-EVT-000018 | 2026-11-06 | Architecture decision / audit finding | Platform + System A | Reconcile canonical platform identity, System A operations, authorization and deployment boundary | RECORDED_DESIGN_ONLY | [Event](events/PULSE-EVT-000018.md) |

| PULSE-EVT-000021 | 2026-11-06 | Product decision / authorization architecture | Shared Platform / System A | Record D-003 hybrid RBAC, resource-scope and action-permission model | PRODUCT_DECISION_RECORDED_SECURITY_APPROVAL_PENDING | [Event](events/PULSE-EVT-000021.md) |
| PULSE-EVT-000020 | 2026-11-06 | Product decision / academic data model | Shared Platform / System A | Record D-001 concurrent enrollment policy: allow within and across institutes | PRODUCT_DECISION_RECORDED_ACADEMIC_APPROVAL_PENDING | [Event](events/PULSE-EVT-000020.md) |
| PULSE-EVT-000019 | 2026-11-06 | Data architecture / schema design | Platform + System A | Consolidate canonical physical ERD and data dictionary; record schema decisions and blockers | DESIGN_DRAFT_RECORDED | [Event](events/PULSE-EVT-000019.md) |
