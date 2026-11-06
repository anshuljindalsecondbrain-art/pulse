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


## 2026-11-06 — live reconciliation refresh

The following are the verified live states at the time of this refresh. These are not approvals to change production.

| Issue ID | Module | Description | Severity | Status | Dependency / next action |
|---|---|---|---|---|---|
| PULSE-ISSUE-0016 | GitHub / CI | Current PR head changes during concurrent work; exact-head checks must be confirmed before release claims | High | OPEN | Re-read PR #2 head and require both System A CI and Student Tracking prototype workflows on the exact final SHA |
| PULSE-ISSUE-0017 | Website / Vercel | Most recent READY preview currently observed is tied to commit `81fd420af18eb9b016b187a71b68073ebf325979`; newer source changes exist and Vercel reported preview build-rate limiting | High | OPEN | Deploy only after build-rate window allows; verify exact commit in deployment metadata, auth protection and browser QA |
| PULSE-ISSUE-0018 | Platform / Supabase | Live project remains empty: no application tables, no migrations and no Edge Functions | Blocking | OPEN | Preserve fail-closed state until canonical physical ERD, approvals, unified migration, RLS/grants and integration tests are complete |
| PULSE-ISSUE-0019 | System A / UI integration | Main App.tsx continues to use localStorage demo data; repository adapter is not invoked by the UI | Blocking | OPEN | Implement approved auth/query/command integration without migrating demo records or bypassing service boundaries |
| PULSE-ISSUE-0020 | Platform / Vercel configuration | Two preview-only environment variables exist on the System A feature branch; no Production variables were listed | High | OPEN | Keep preview config branch-scoped; configure production only after production backend, auth and release approvals |

### Verified platform snapshot

- Supabase project `nnvssbfezkliavwxhgbh`: ACTIVE_HEALTHY, region `ap-south-1`, PostgreSQL 17.11.
- `public` tables: none; migration history: none; Edge Functions: none.
- Security, performance and health advisor lints: none on the current empty application schema; not a validation of proposed schema/RLS.
- Vercel project `pulse` has a READY feature-branch Preview for commit `81fd420af18eb9b016b187a71b68073ebf325979`. The latest source SHA is not proven to be deployed.
- Vercel deployment comments report the Hobby team build/deployment rate limit (`api-deployments-young-hobby-team-24h`) for subsequent preview deployments.
- GitHub PR #2 is open, draft and unmerged. Exact PR head and CI must be refreshed at each release checkpoint.

| PULSE-ISSUE-0016 | Platform / Database | Unified physical schema is now documented as PULSE-DATA-CORE-009 but remains Draft; concurrent enrollment, guardian verification, role/action mapping, resource assignment, publication snapshot and evidence lifecycle decisions remain unresolved | Blocking | OPEN | Obtain product, academic, privacy, technical and security approvals; do not generate/apply production migration before closure |
| PULSE-ISSUE-0017 | System A / Data Model | Source System A subject/chapter master tables conflict with configurable DTE classification ownership and must not be retained as System A canonical tables | High | DESIGN_DECISION_RECORDED | Keep optional external classification references only; confirm DTE/QBMS integration contract |
| PULSE-ISSUE-0018 | System A / Evidence | Source combined verification_decisions for completion and answer evaluation; target schema separates completion decisions and answer evaluations | High | DESIGN_DECISION_RECORDED | Academic owner to approve separate semantics, reviewer permissions, supersession and scoring policy |


## 2026-11-06 — D-001 product decision recorded

| Issue ID | Module | Description | Severity | Status | Dependency / next action |
|---|---|---|---|---|---|
| PULSE-ISSUE-0021 | Shared Platform / Academic Core | D-001 product decision permits multiple concurrent active enrollments within and across institutes; Academic Owner confirmation remains outstanding | High | OPEN | Academic Owner to confirm enrollment semantics, overlap rules and uniqueness business keys before schema freeze; preserve tenant isolation and explicit active-context resolution |

Evidence: PULSE-EVT-000020 and PULSE-DATA-CORE-010. Product decision recorded; this does not authorize SQL or migration changes.
