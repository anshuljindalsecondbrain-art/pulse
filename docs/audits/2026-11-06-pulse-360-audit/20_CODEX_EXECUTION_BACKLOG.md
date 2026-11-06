# Codex Execution Backlog

Backlog is ordered by dependency and risk. Each item requires a separate PR-sized increment.

| ID | Priority | Work package | Files/artifacts | Acceptance evidence |
|---|---|---|---|---|
| CX-001 | P0 | Reconcile legacy migrations with CORE-001–009 | Migration inventory, disposition matrix | No duplicate identity tables; owner sign-off |
| CX-002 | P0 | Close canonical identity and tenancy decisions | ADRs, CORE-001/002 | Approved identity cardinality, tenant roles and scope |
| CX-003 | P0 | Close academic core decisions | CORE data dictionary | Enrollment/context/parent/catalogue decisions approved |
| CX-004 | P0 | Finalize System A physical model | CORE-009 + table/constraint map | Composite FK, keys, indexes and lifecycle reviewed |
| CX-005 | P0 | Build isolated migration replay | Supabase migration files, test harness | Clean replay from empty DB |
| CX-006 | P0 | Implement RLS/grants/identity resolution | SQL + policy tests | Cross-tenant and role-negative tests pass |
| CX-007 | P0 | Implement atomic publication command | Server function/RPC + tests | Idempotent, transactional, concurrent-safe |
| CX-008 | P1 | Complete evidence/verification/evaluation commands | API/DB functions | Append-only and scope tests pass |
| CX-009 | P1 | Integrate System A authenticated app shell | App/auth/services | No real data in demo path; server-derived scope |
| CX-010 | P1 | Complete Exercise Builder lifecycle | UI/domain/services | Draft edit, publish, immutable revision |
| CX-011 | P1 | Add Playwright and accessibility gates | E2E suite/CI | Critical role workflows pass |
| CX-012 | P1 | Complete requirements traceability | Traceability matrix | Every source requirement maps to tests |
| CX-013 | P1 | Resolve DTE ownership and canonical data model | DTE ERD/contracts | One owner per entity/state transition |
| CX-014 | P2 | Implement QBMS identity/ingestion | QBMS service | Version pinning, provenance, dedup/review |
| CX-015 | P2 | Implement DTE M01–M18 in dependency order | DTE apps/services | Contract and module acceptance suite |
| CX-016 | P2 | Implement DRE separately | DRE service | Versioned difficulty policy/evaluation |
| CX-017 | P2 | Build AI Mentor governance/evaluation | AI service, prompt/model registry | Tenant isolation, human gate, eval thresholds |
| CX-018 | P2 | Implement five A/B experiments | Experiment service, telemetry | Deterministic allocation, guardrails, analytics |
| CX-019 | P2 | Operational readiness | Monitoring, backups, runbooks | Restore drill, alerts, RPO/RTO approved |

## Codex operating rules

- One work package per PR increment.
- Refresh branch and PR head before editing.
- Read relevant specs and current code before changes.
- No production migration or release without explicit approval.
- Include tests and update traceability, event register and status docs.
- Verify exact commit SHA in CI and Preview.
- Stop if architecture decisions are unresolved; create a decision record rather than inventing policy.
