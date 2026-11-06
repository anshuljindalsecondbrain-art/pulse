# PULSE Open Issues and Follow-up Register

| Issue ID | Module | Description | Severity | Status | Dependency / next action |
|---|---|---|---|---|---|
| PULSE-ISSUE-0001 | Governance | Historical event and requirement backfill incomplete | High | OPEN | Audit source documents, conversation decisions and PR commit history |
| PULSE-ISSUE-0002 | System A | Latest evidence projection commit needs fresh CI confirmation | High | CLOSED | CI passed on audited head 59523c4a7119cb526b6dd7d47a657c8310f4abaf; later documentation commit does not alter domain code |
| PULSE-ISSUE-0003 | System A | Exercise subject selection browser regression pending | Medium | IMPLEMENTED_PENDING_CI | Controlled subject state and selected value persisted in exercise; browser regression test pending |
| PULSE-ISSUE-0004 | System A | Batch selector browser regression pending | High | IMPLEMENTED_PENDING_CI | Separate selectedBatch view state; browser regression test pending |
| PULSE-ISSUE-0005 | Platform | Supabase connected; live database has no System A application tables or migration history | Blocking | OPEN | Project inspected; implement and review schema, authorization and RLS before applying any migration |
| PULSE-ISSUE-0006 | System A | No browser interaction/accessibility test suite | Medium | OPEN | Add Playwright tests after workflow stabilizes |
| PULSE-ISSUE-0007 | System A | Authenticated learner repository adapter added, but live access is intentionally blocked by missing RLS policies and grants | Blocking | OPEN | Design and test tenant/role policies; derive actor role server-side; do not enable live writes before this is complete |
| PULSE-ISSUE-0008 | System A | Assignment publication, immutable obligation expansion and complete workflow schema are not implemented in the live database | Blocking | OPEN | Implement transactional publication RPC and remaining schema with cross-tenant integration tests |
| PULSE-ISSUE-0009 | System A | Shared/global versus institute-owned subject and chapter tenancy rules are unresolved | High | OPEN | Decide reference-data ownership and add composite tenant-consistency constraints |
| PULSE-ISSUE-0010 | System A | Current six-state UI vocabulary and older five-state notes conflict | High | OPEN | Preserve U/C/I/D/S/P in current UI; obtain academic-owner approval for metric and transition semantics |

Close issues only with evidence; preserve closed issue history. Link each issue to its event and PR.


## 2026-11-06 — PULSE architecture and infrastructure reconciliation update

| Issue ID | Module | Description | Severity | Status | Dependency / next action |
|---|---|---|---|---|---|
| PULSE-ISSUE-0011 | Platform / Database | Canonical V10 + System A physical schema not yet unified; both initial migration proposals must not be applied as-is | Blocking | OPEN | Complete PULSE-DATA-CORE-009 physical ERD/data dictionary; approve constraints, parent verification, enrollment and catalogue ownership decisions |
| PULSE-ISSUE-0012 | System A / Authorization | Physical RLS, grants, identity resolver and transactional command layer do not exist in live Supabase | Blocking | OPEN | Implement only after approval; isolated RLS/RPC/cross-tenant tests are mandatory |
| PULSE-ISSUE-0013 | Website / Vercel | Feature-branch Preview READY but not production-connected; preview variables branch-scoped; current latest deployment may lag documentation commits | High | OPEN | Re-deploy Preview after documentation change; verify exact branch SHA and run browser QA; Production environment remains unconfigured |
| PULSE-ISSUE-0014 | Governance | PULSE master documentation index was missing from current System A branch tree | Medium | CLOSED | Consolidated index created on feature branch; verify against PR head |
| PULSE-ISSUE-0015 | Website / UX | Main UI still uses localStorage and fictional data; Supabase repository adapter is not integrated | Blocking | OPEN | Implement approved authentication and service boundary; preserve isolated demo mode until connected path acceptance |
