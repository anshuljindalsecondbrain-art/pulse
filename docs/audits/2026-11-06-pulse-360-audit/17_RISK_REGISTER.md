# Risk Register

Severity: Critical / High / Medium / Low. Status remains OPEN until evidence proves mitigation.

| ID | Severity | Risk | Impact | Required mitigation | Owner |
|---|---|---|---|---|---|
| R-001 | Critical | No live app schema or migrations | No production persistence | Approve unified schema; replay isolated migration | Platform/DB |
| R-002 | Critical | Identity/tenant model conflict | Broken authorization and migration rework | Resolve CORE vs legacy migration | Product/Architecture |
| R-003 | Critical | No deployed RLS/grants/role enforcement | Cross-tenant exposure / privilege escalation | Implement deny-by-default policies and negative tests | Security/DB |
| R-004 | Critical | Main UI localStorage demo | Data loss and false production confidence | Separate demo and production mode; integrate services | System A |
| R-005 | Critical | No trusted command layer | Unauthorized or partial academic state changes | Server-derived actor and atomic commands | Backend |
| R-006 | High | Current PR head lacks exact-head CI evidence | Unknown regression status | Run all required workflows on exact SHA | Engineering |
| R-007 | High | Preview deployment lags PR head | Testing stale build | Verify exact SHA preview before release | DevOps |
| R-008 | High | DTE canonical model absent | Data integrity and rework | Canonical DTE ERD and lifecycle contract | DTE |
| R-009 | High | DTE module ownership overlaps | Duplicate sources of truth | Approve responsibility matrix | Product/Architecture |
| R-010 | High | Requirement traceability incomplete | Missed requirements | Complete source-to-test traceability | Product/QA |
| R-011 | High | Academic eligibility inferred from labels in demo | Wrong learner assignment | Trusted effective-dated academic context | Academic/System A |
| R-012 | High | Parent token card lacks verified controls | PII disclosure | Token expiry/revocation/scope/rate-limit design | Security/Product |
| R-013 | High | A/B telemetry not implemented/verified | Invalid experiment conclusions | Deterministic allocation and audited telemetry | Analytics |
| R-014 | High | No browser/accessibility QA | Usability/accessibility failures | Playwright + manual accessibility gates | QA/UX |
| R-015 | High | Million-question performance unproven | Slow inventory and tagging | Indexed pagination, async jobs, benchmark | QBMS/DTE |
| R-016 | Medium | Syllabus lifecycle semantics unresolved | Incorrect eligibility and content lifecycle | Define ACTIVE/DEPRECATED/ADVANCED_ONLY transitions | Academic |
| R-017 | Medium | Partially Correct state ambiguity | Inconsistent metrics | Approve status vs outcome model | Academic |
| R-018 | Medium | Event governance CI not proven | Weak traceability enforcement | Validate governance checks in CI | Governance |
| R-019 | Medium | Dependency vulnerability count reported in historical build evidence | Supply-chain exposure | Refresh lockfile audit and remediate current advisories | Engineering |
| R-020 | Medium | No backup/restore rehearsal evidence | Recovery uncertainty | Define RPO/RTO and rehearse restore | DevOps/DB |

## Top release blockers

R-001 through R-005 are release-blocking. R-006 and R-007 block confidence in the current code/deployment state. No production release should proceed while any critical item is open.
