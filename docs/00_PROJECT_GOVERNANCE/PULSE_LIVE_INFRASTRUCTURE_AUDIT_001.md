# PULSE — Live Infrastructure and Application Integration Audit

- **Document ID:** PULSE-AUD-INFRA-001
- **Version:** 0.1.0
- **Status:** Draft — verified read-only audit; pending owner review
- **Audit date:** 2026-11-06
- **Repository:** `anshuljindalsecondbrain-art/pulse`
- **Branches inspected:** `main`, `feat/system-a-abhyas-foundation`
- **Supabase project:** `nnvssbfezkliavwxhgbh` (`PULSE`, `ap-south-1`)
- **Vercel project:** `pulse` (`prj_Itm7qTi4b2pmumtvek0dOThKaIHw`)
- **Implementation authorization:** Not granted by this audit

## 1. Executive summary

The GitHub, Supabase and Vercel connections are authenticated and can access the expected PULSE resources. A Vercel production deployment and a feature-branch preview deployment both report `READY`.

However, the live application/database integration is not yet established:

1. The inspected `main` tree is documentation-only; it does not contain the Student Tracking application, package manifest, Supabase migration or CI workflow.
2. The `feat/system-a-abhyas-foundation` branch contains a React/Vite Student Tracking application, a proposed System A SQL migration, tests and CI workflows.
3. The inspected Student Tracking `App.tsx` does not import or call the Supabase client. It persists its current student, exercise and matrix state in browser `localStorage`.
4. The live Supabase project has no application tables in `public`, no project migration records, and no custom RLS policies returned by the catalog audit.
5. Vercel environment metadata shows the two browser-safe Supabase configuration variables scoped to the feature-branch Preview environment only. No Production variables were returned in the project environment listing.

**Conclusion:** the feature branch is a frontend prototype with a proposed database baseline, not a verified database-backed Student Tracking release. The production deployment is associated with the documentation-only `main` commit; its exact build artifact and configured root directory were not verified in this audit.

## 2. Audit method and boundaries

Read-only checks were performed against:
- GitHub recursive trees for `main` and the feature-branch deployment commit.
- Selected source, configuration, migration and governance files.
- Supabase project metadata, migration history, table catalogue, policies, extensions, functions, storage buckets and security/performance advisor output.
- Vercel project metadata, recent deployment records, deployment Git metadata and environment-variable metadata with decryption disabled.
- GitHub combined commit status for the feature-branch deployment commit.

No code, database schema, environment variable, domain, project setting or deployment was changed. No environment variable values were decrypted. No student records or authentication secrets were read.

This is a point-in-time audit, not a penetration test, complete source-code review, production runtime test or formal security certification.

## 3. GitHub repository findings

### 3.1 `main` branch

The recursive Git tree for `main` returned `truncated: false`, with 61 tree entries and 50 tracked files. The tracked files consist of repository instructions, README and documentation. No application source directory, package manifest, test directory, migration directory or CI workflow appears in this tree.

The current `main` commit inspected was:

- Commit: `96985809130d4d975e0b0ef98682769406c9733a`
- Message: `docs: add PULSE master documentation index`

### 3.2 Student Tracking feature branch

The Vercel preview deployment points to:

- Branch: `feat/system-a-abhyas-foundation`
- Commit: `48a286cbc2c3139583278aa462215b5022cb958a`
- Message: `test(student-tracking): assert CSV escaping with formula guard`

The recursive tree for that commit returned `truncated: false` and includes:
- React 18 / TypeScript / Vite application under `apps/student-tracking/`.
- Vitest domain tests.
- Supabase browser-client setup.
- Proposed migration at `supabase/migrations/20261106000100_system_a_initial_schema.sql`.
- Student Tracking, database and governance documentation.
- GitHub Actions workflows under `.github/workflows/`.

The branch is ahead of the documentation-only `main` in implementation artifacts, but this audit did not compare every branch or determine merge readiness. Multiple other feature branches are visible and require inventory before branch consolidation.

### 3.3 Repository governance issue

The current `main` README says the initial repository audit found only the README on `main`. That statement is stale: the current `main` contains the governance and specification files listed in the recursive tree. A separate, reviewed README correction is required.

## 4. Student Tracking application findings

The inspected feature-branch package manifest identifies:
- React 18.3
- Vite 6
- TypeScript 5.7
- Supabase JS 2.80
- Vitest 2.1

The inspected `apps/student-tracking/src/lib/supabase.ts` creates a browser-safe Supabase client from:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

It explicitly expects these values to be supplied in `apps/student-tracking/.env.local` and documents that a service-role key must never be used in browser code.

The inspected `apps/student-tracking/src/App.tsx`:
- Does not import the Supabase client.
- Does not call Supabase `from()`, `rpc()` or `auth` methods.
- Uses browser `localStorage` for students, exercises and matrix marks.
- Contains seeded demonstration students, exercises and status data.

Therefore, the presence of a Supabase client module and environment variables does not establish that application data is persisted in Supabase. In the inspected app entry point, the visible state workflow remains browser-local.

The domain module and tests cover status cycling, evidence projection and CSV formula-prefix neutralization. These are useful domain-level checks, but do not demonstrate authentication, database persistence, tenant isolation or server-side authorization.

## 5. Supabase live project findings

### 5.1 Project health

- Project name: `PULSE`
- Project ref: `nnvssbfezkliavwxhgbh`
- Region: `ap-south-1`
- Project status: `ACTIVE_HEALTHY`
- PostgreSQL: `17.11.0.018`

A read-only SQL query successfully connected to the database as the administrative database role and confirmed PostgreSQL 17.11.

### 5.2 Application schema and migrations

- The `public` schema contains zero application tables.
- Supabase project migration history returned zero project migrations.
- The `public` schema has no application RLS policies in the inspected policy catalogue.
- The project has standard Supabase-managed schemas and system tables; those are not PULSE application tables.
- The inspected storage bucket catalogue returned no buckets.
- The installed extension list includes platform defaults such as `pgcrypto`, `uuid-ossp` and `pg_stat_statements`; `pgvector` was not present in the returned extension list.

The Supabase security and performance advisor calls returned no lint records. This must not be interpreted as proof that an application schema is secure: there are no PULSE application tables or policies to assess yet.

### 5.3 Proposed System A migration

The feature branch contains `20261106000100_system_a_initial_schema.sql` (407 lines). It is explicitly marked **PROPOSED / NOT APPLIED** in the migration and its companion baseline.

Static inspection confirms:
- It creates tenant, roster, exercise/version, assignment, evidence, verification, correction, doubt and audit-related structures.
- It enables and forces RLS on the proposed application tables.
- It creates no RLS policies.
- It revokes client grants and is intentionally fail-closed.
- It adds immutable-event triggers for selected evidence, verification and audit records.

The companion database baseline lists unresolved design and implementation review items, including tenant-aware helper functions and policies, global/shared subject semantics, additional composite constraints, publication workflow, actor permissions and cross-tenant tests.

The migration has not been applied to the connected Supabase project. It must not be applied merely because the project currently has no application tables.

## 6. Vercel findings

### 6.1 Project and Git link

- Project: `pulse`
- Framework: Vite
- Node.js: 22.x
- Linked Git source: `anshuljindalsecondbrain-art/pulse`

The Vercel Git deployment context confirms the project is linked to the expected GitHub repository.

### 6.2 Deployment records

Two recent deployments were inspected:

**Production**
- State: `READY`
- Target: `production`
- Branch: `main`
- Commit: `96985809130d4d975e0b0ef98682769406c9733a`
- Commit message: `docs: add PULSE master documentation index`

**Preview**
- State: `READY`
- Branch: `feat/system-a-abhyas-foundation`
- Commit: `48a286cbc2c3139583278aa462215b5022cb958a`

The feature-branch commit has a successful Vercel combined status. This audit did not receive evidence of a successful GitHub Actions run for all configured workflow jobs.

The production deployment is associated with the documentation-only `main` commit. The configured Vercel root directory, build artifact contents and production runtime behavior were not verified; do not infer that the Student Tracking application is running in production from the `READY` state alone.

### 6.3 Environment-variable scope

The Vercel project environment listing returned two encrypted, browser-facing configuration variables:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

Both are scoped to Preview and the branch `feat/system-a-abhyas-foundation`. The listing returned no Production variables. Values were not decrypted or copied.

This aligns with the feature-branch preview setup, but the application currently does not use the Supabase client from its main `App.tsx` workflow.

### 6.4 Deployment protection

Vercel reports SSO protection enabled for generated deployment domains, excluding custom domains. A deployment marked `READY` may therefore still require an authorized Vercel session to view.

## 7. Consolidated status

| Area | Verified status | Assessment |
|---|---|---|
| GitHub connection | Repository access confirmed | Operational |
| GitHub `main` | Governance/specification files only | No app source on inspected main |
| Feature branch | Student Tracking source and proposed migration present | Prototype branch |
| Supabase project | `ACTIVE_HEALTHY` | Infrastructure operational |
| Supabase application schema | No public application tables | Not initialized |
| Supabase migrations | No project migration records | Proposed migration not applied |
| Application RLS | No public application policies | Not implemented |
| Student Tracking persistence | Browser `localStorage` in inspected app | Not database-backed |
| Vercel Git link | Expected repository linked | Operational |
| Vercel production | `READY`, main docs commit | Runtime artifact not verified |
| Vercel preview | `READY`, feature branch commit | Preview deployment available |
| Preview Supabase config | Two encrypted Preview-only variables | Configured, not proof of use |
| Production Supabase config | No Production variables returned | Not configured in inspected listing |
| Security advisors | No lints returned | No application schema to assess |

## 8. Risks and required decisions

### Critical — do not describe the prototype as database-backed
The inspected UI stores data in browser local storage and does not call Supabase. A browser-local demonstration can lose data across devices and does not provide shared teacher/student state.

### Critical — no tenant authorization baseline is live
No PULSE application tables or policies are present in the connected database. Multi-institute access control is therefore not implemented in the inspected live schema.

### High — branch and release divergence
The feature branch contains implementation artifacts absent from `main`. Production points to `main`, while preview points to the feature branch. Release governance must explicitly decide when and how the feature branch is reviewed and merged.

### High — migration is not ready for execution
The proposed migration deliberately has no client policies and the companion baseline lists unresolved items. It needs design review, local migration validation, policy implementation, negative cross-tenant tests and staging verification before any production consideration.

### High — production configuration is unverified
The inspected environment-variable list shows only Preview-scoped Supabase browser configuration. Confirm the intended production deployment architecture and environment configuration before release.

### Medium — test/CI evidence is incomplete
The feature branch includes CI workflow definitions and domain tests. The available combined commit status showed a successful Vercel check; this audit did not verify complete GitHub Actions workflow execution or retain test logs.

## 9. Recommended next sequence

1. **Branch/release reconciliation:** inventory all active branches, identify the intended canonical feature branch, compare it with `main`, and define a reviewed PR/merge plan. Do not merge automatically.
2. **Application persistence design:** specify the Supabase-backed data access and authentication workflow, replacing browser-only persistence only after its contracts and acceptance tests are reviewed.
3. **Database baseline review:** reconcile the proposed System A migration with the live project and resolve every item in `SYSTEM_A_DATABASE_BASELINE.md`.
4. **Tenant/RLS design:** define role and membership helpers, explicit policies, grants and cross-institute negative tests before exposing application tables to clients.
5. **Non-production validation:** run the reviewed migration against a disposable/local database, then a designated staging project; capture migration and test evidence.
6. **Vercel release alignment:** verify root directory, build commands, branch-to-environment mapping, Production variables and SSO/custom-domain behavior.
7. **Acceptance gate:** only after evidence is reviewed should the implementation plan authorize a controlled merge and deployment.

## 10. Explicit non-actions

This audit did not:
- apply the proposed Supabase migration;
- create or modify database tables, policies, functions, extensions or buckets;
- decrypt, add, update or delete Vercel environment variables;
- change Vercel project settings, domains or deployment protection;
- merge, rebase, delete or create Git branches;
- change application code or trigger a deployment.

## 11. Audit limitations

- No full runtime browser test was performed.
- No full review of every source file or every active branch was performed.
- No production build artifact or Vercel root-directory configuration was inspected.
- No application user sign-in, tenant-isolation or CRUD flow could be validated against Supabase.
- The absence of advisor lints is not a security certification.
- Database catalog inspection was read-only and does not replace a formal security review.

---
**Disposition:** Keep this audit as a draft evidence record. Owner review is required before any implementation or migration authorization.
