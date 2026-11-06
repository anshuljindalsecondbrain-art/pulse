# PULSE Student Tracking — Abhyas Matrix

A frontend prototype for System A. It demonstrates the student-by-question matrix, cohort signals, demo roster workflow, CSV export and assignment from a fictional offline module catalogue.

## Current implementation boundary

- This application is a **frontend prototype**, not a production-connected Student Tracking system.
- The primary UI persists its demo roster, exercises and marks in browser `localStorage` under `pulse.demo.v2.*` keys.
- The Supabase client and repository adapter exist, but the primary UI does not currently use them.
- The live Supabase project has no PULSE application tables or applied migration history.
- The proposed System A migration remains unapplied. It enables and forces RLS, revokes direct `anon`/`authenticated` table access and creates no policies.
- Do not enter real student personal data into the demo or Preview deployment.

## Supabase client foundation

- Browser-safe client: `src/lib/supabase.ts`.
- Repository adapter: `src/lib/system-a-repository.ts`.
- Environment names: `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`.
- Configure them only with a browser-safe publishable key and never expose a secret/service-role key.
- The adapter is an integration foundation, not a production-ready backend. It depends on the future approved tenant/person/role schema, server-derived actor context, RLS policies/grants and atomic command layer.

## Product behaviors represented

- Select an existing offline academic module, choose its question references, select a batch and due date, then create a local assignment.
- The assignment retains source module and question references; System A does not author or duplicate QBMS question content.
- Classroom input states: Unattempted, Correct, Incorrect, Doubt, Skipped and Partially Correct.
- Domain modules model append-only evidence, separate completion verification and answer evaluation, correction workflows, doubt workflows and worklist projections.
- The prototype supports matrix filtering, cohort signals and local CSV export.
- Fictional demo data spans Physics, Chemistry, Mathematics and Biology. It is not actual offline module content or QBMS data.

## Finalized target architecture (design only)

1. Shared platform owns canonical tenants, people, Auth identity links, memberships, role grants, centres, students, batches and enrollments.
2. System A owns exercises, exercise versions/slots, assignments/versions/items/targets, student obligations, attempt cycles, evidence, verification/evaluation, correction and doubt workflows.
3. Student Tracking must work without QBMS question IDs or DTE taxonomy references.
4. Actor identity is resolved from Auth UID to canonical person. Client-supplied actor IDs, roles and scopes are never authorization evidence.
5. Authorization is deny-by-default and checks tenant membership, action permission and centre/batch/student/resource scope at the database boundary.
6. Evidence and decisions are append-only; corrections create linked new events.
7. Assignment publication and obligation expansion are one atomic, idempotent transaction.
8. V10 and System A migrations must not be concatenated or applied unchanged. A unified approved schema is required.

## Design records

- Canonical core: `docs/00_PROJECT_GOVERNANCE/PULSE_CANONICAL_IDENTITY_TENANCY_AND_ACADEMIC_CORE_DATA_MODEL.md`
- ERD/data dictionary: `docs/00_PROJECT_GOVERNANCE/PULSE_CANONICAL_CORE_ERD_DATA_DICTIONARY_AND_AUTHORIZATION_MATRIX.md`
- Schema/migration specification: `docs/00_PROJECT_GOVERNANCE/PULSE_CANONICAL_DATABASE_SCHEMA_AND_MIGRATION_SPECIFICATION.md`
- Migration reconciliation: `docs/00_PROJECT_GOVERNANCE/PULSE_EXISTING_MIGRATION_RECONCILIATION_AND_DISPOSITION_MATRIX.md`
- Repository dependency audit: `docs/00_PROJECT_GOVERNANCE/PULSE_SYSTEM_A_REPOSITORY_DEPENDENCY_AUDIT_AND_SCHEMA_IMPACT_MATRIX.md`
- Application service/API contract: `docs/00_PROJECT_GOVERNANCE/PULSE_SYSTEM_A_APPLICATION_SERVICE_AND_API_CONTRACT.md`
- Authorization/transaction design: `docs/00_PROJECT_GOVERNANCE/PULSE_SYSTEM_A_DATABASE_AUTHORIZATION_AND_TRANSACTION_DESIGN.md`
- Physical table authorization map: `docs/00_PROJECT_GOVERNANCE/PULSE_SYSTEM_A_PHYSICAL_TABLE_AUTHORIZATION_AND_INTEGRITY_MAPPING.md`

## Next engineering gates

1. Consolidate the shared platform and System A operational entities into one approved physical schema/data dictionary.
2. Resolve parent verification, role scope, enrollment overlap, publication snapshot and answer-evaluation storage decisions.
3. Build and replay a unified migration in a disposable database.
4. Implement identity resolution, minimum grants, RLS policies and narrow transactional commands.
5. Test cross-tenant denial, privilege escalation, idempotency, concurrency and append-only records.
6. Integrate the UI through approved query/command services while retaining isolated demo mode.
7. Run browser/accessibility QA and fresh CI on the exact PR head before production approval.

## Local development

```bash
npm install
npm run typecheck
npm test
npm run build
```

Production migration and deployment require separate explicit owner authorization.