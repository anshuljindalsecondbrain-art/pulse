# Technical Debt Register

| ID | Debt | Evidence | Consequence | Remediation |
|---|---|---|---|---|
| TD-001 | Main UI localStorage persistence | App.tsx | No multi-user persistence or authoritative audit | Replace with service-backed repository |
| TD-002 | Repository adapter disconnected | App.tsx vs system-a-repository.ts | Authenticated workflows not used | Integrate after schema/RLS approval |
| TD-003 | Institute-centric adapter/migration | SQL + repository types | Conflict with canonical tenant/person design | Refactor to approved canonical contract |
| TD-004 | Demo academic context derived from labels | App.tsx batch label checks | Fragile and unsafe production eligibility | Resolve server-side effective context |
| TD-005 | Exercise lifecycle UI incomplete | ExerciseBuilder.tsx/domain | Draft edit/publish/revision gaps | Add complete versioned workflow |
| TD-006 | Full-syllabus chapter list is manual | Exercise Builder | No canonical syllabus validation | Integrate approved academic catalogue |
| TD-007 | No real offline catalogue integration | offline-catalog.ts | Synthetic references only | Connect authoritative module catalogue |
| TD-008 | No E2E/accessibility suite | CI/test inventory | UI regressions unobserved | Add Playwright and accessibility tests |
| TD-009 | DTE docs not normalized into implementation contracts | DTE audit | Ambiguous ownership and schema | Close DTE data model and state machines |
| TD-010 | Requirement traceability partial | traceability doc | Coverage gaps | Complete requirements register |
| TD-011 | Five A/B experiments not operationalized | uploaded source | No valid experiment telemetry | Add feature assignment, event schema and analysis |
| TD-012 | Production observability/recovery not evidenced | Infrastructure audit | Poor incident response | Logs, metrics, alerts, backups and restore tests |
| TD-013 | Current PR/CI/deploy SHA drift | PR/Actions/Vercel metadata | False release confidence | Exact-SHA release evidence protocol |
| TD-014 | Governance status snapshots stale over time | open issue register | Contradictory state claims | Dated snapshot and supersession discipline |

## Debt policy

Do not pay down debt by introducing a second source of truth. Resolve ownership and contracts first, then migrate in small reviewable changes with tests and evidence.
