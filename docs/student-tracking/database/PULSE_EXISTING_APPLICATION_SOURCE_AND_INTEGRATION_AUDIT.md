# PULSE Existing Application Source and Integration Audit

**Audit date:** 7 November 2026  
**Status:** Read-only discovery audit; no application, database, security, or deployment changes made.

## 1. Executive finding

The existing PULSE work is distributed across three separate technical locations:

1. **Student Tracking System Lovable project** — the most complete operational System A application found in this audit.
2. **QBMS Lovable project** — a separate application and separate managed database.
3. **GitHub repository `anshuljindalsecondbrain-art/pulse`** — contains governance/specification documents and a separate System A prototype branch, but the inspected prototype is not the same source tree as the current Lovable Student Tracking application.

The standalone Supabase project named **PULSE** (ref `nnvssbfezkliavwxhgbh`) is active and healthy, but currently has **zero public tables and zero applied migrations**. It is not the database currently used by the two inspected Lovable projects, based on the separate Lovable project database probes and the empty standalone PULSE project.

**Conclusion:** Do not begin P0/P1 implementation against the standalone PULSE database until the canonical application source and database consolidation strategy are explicitly established. The existing Student Tracking Lovable project should be treated as the primary System A source candidate for reconciliation, not assumed to be the canonical production source yet.

## 2. Discovered application projects

### 2.1 Student Tracking System

- Lovable project: `3c9c95ba-5fef-4ed2-a758-b5b60bb213f0`
- URL: https://lovable.dev/projects/3c9c95ba-5fef-4ed2-a758-b5b60bb213f0
- Workspace: `My Lovable`
- Last edited: 2026-11-06
- Project status: ready; unpublished
- Stack: TanStack Start, React 19, TypeScript, Supabase JS, Drizzle ORM
- Source paths observed: `src/routes/_authenticated.admin.tsx`, `src/routes/_authenticated.dashboard.tsx`, `src/routes/_authenticated.tracker.tsx`, `drizzle/migrations/`, `src/integrations/supabase/`.

Existing features evidenced by project files and recent edit history:
- Authentication and authenticated route layout.
- Admin and teacher dashboard workflows.
- Student, batch and teacher-batch data access.
- Curriculum hierarchy: subjects, chapters, topics, concepts and modules.
- Exercise / DPP creation and batch assignment.
- Question-level status tracking with Correct, Incorrect, Doubt, Unattempted and Solved by Teacher states.
- Completion progress RPC and dashboard reporting.
- Question journey history trigger.
- Recent edit history includes curriculum editor/hierarchy, Quick DPP creator, Tracker page and password reset.

The project has a Lovable-managed Supabase database enabled. Read-only probe returned 22 public base tables.

### 2.2 QBMS

- Lovable project: `ad580e88-d5ed-4854-91e4-6eb05944b1c8`
- URL: https://lovable.dev/projects/ad580e88-d5ed-4854-91e4-6eb05944b1c8
- Workspace: `Anshul's Lovable`
- Last edited: 2026-11-03
- Stack: TanStack Start, React, TypeScript, Supabase, Drizzle
- Source paths observed: `src/lib/evaluation/`, `src/lib/qbms/`, `src/test/`, `drizzle/migrations/`.

Existing database objects evidenced by read-only inspection:
- `canonical_questions`
- `import_jobs`
- `staged_question_candidates`
- `user_profiles`
- `user_roles`
- `question_versions`
- `audit_events`

The project has a separate Lovable-managed Supabase database. Read-only probe returned seven public base tables. Its current RLS policies and migration history require a separate full QBMS audit before integration.

### 2.3 GitHub repository

- Repository: `anshuljindalsecondbrain-art/pulse` (private)
- Default branch: `main`
- Inspected branches include `docs/system-a-database-governance` and `feat/system-a-abhyas-foundation`.
- `main` contains documentation/governance but no application source tree in the inspected recursive tree.
- `feat/system-a-abhyas-foundation` contains `apps/student-tracking`, a React/Vite prototype, domain modules/tests and a candidate SQL migration.

The GitHub prototype uses browser `localStorage` for students, exercises and question marks and visibly labels itself as fictional demo data/local preview. It is not equivalent to the operational Lovable Student Tracking project, which has authenticated routes and a Supabase-backed workflow.

The feature branch also contains `supabase/migrations/20261106000100_system_a_initial_schema.sql`. It is a candidate migration file, not proof that the schema has been applied to the standalone PULSE database.

## 3. Database environment separation

### 3.1 Standalone PULSE Supabase project

- Project ref: `nnvssbfezkliavwxhgbh`
- Region: `ap-south-1` (Mumbai)
- PostgreSQL: 17.11
- Status: `ACTIVE_HEALTHY`
- Public tables: 0
- Applied migrations: 0

This project is currently an empty target environment. No DDL, grants, RLS changes, migrations or data writes were performed during this audit.

### 3.2 Student Tracking Lovable-managed database

- Database enabled: yes
- Read-only public base table count: 22
- Table names observed: `audit_log`, `batches`, `chapters`, `concepts`, `exam_patterns`, `items`, `legacy_abhyas_summary`, `modules`, `profiles`, `progress`, `question_journey_log`, `question_status`, `question_types`, `questions`, `student_batches`, `student_items`, `students`, `subjects`, `teacher_batches`, `test_results`, `topics`, `users`.
- Read-only inspection confirmed RLS policies exist on the inspected tables. Policies use authenticated access and application functions such as `is_admin()`, `is_staff()`, `teacher_has_batch_access()` and `teacher_has_student_access()`.

### 3.3 QBMS Lovable-managed database

- Database enabled: yes
- Read-only public base table count: 7
- Its existence and table set are independent of the standalone PULSE Supabase project.

**Important:** Do not assume that a Lovable-managed database is the standalone PULSE project merely because both are Supabase/PostgreSQL. Establish the actual project linkage and migration/data ownership before moving or sharing data.

## 4. Material architecture gaps against approved PULSE decisions

### 4.1 Shared identity and tenant model

Approved PULSE decisions require:
- Shared `tenant_memberships` as the canonical person-to-tenant association.
- Separate effective-dated `tenant_role_grants`.
- Tenant-owned `students` with mandatory `tenant_id`, optional `person_id`, and no mandatory student membership.
- Explicit effective-dated `enrollments` linking students to batches.
- Tenant-safe composite foreign keys.
- No duplicate System A-local authority for shared identity, tenant, centre or batch.

The inspected Student Tracking schema uses `users`, `profiles`, `students`, `batches`, `student_batches` and `teacher_batches`. The inspected source does not establish conformance to the approved shared identity and tenant architecture. This is a schema reconciliation blocker, not a reason to retrofit assumptions directly into the live Lovable database.

### 4.2 Pilot operating mode

Approved pilot mode is one Super Admin operator, with students manually maintained and no student login in the initial pilot. Separate teacher/reviewer/mentor/parent logins are deferred.

The existing Student Tracking application has authentication, admin/teacher role concepts, staff access functions and teacher-batch relationships. That differs from the selected pilot operating model. The application should be adapted through an explicit pilot-mode design, not by silently discarding its existing authorization model.

### 4.3 Both tracking modes and reconciliation

Approved tracking requires both:
- Exercise-level aggregate entry.
- Question-level detailed evidence.
- Reconciliation of aggregate counts against question-level records when both exist.
- Explicit marking of aggregate-only coverage.
- No fabricated question attempts from aggregate counts.
- No silent overwrite when discrepancies occur.

The inspected Student Tracking migrations include `tracking_mode` concepts such as `COMPLETION` and `QUESTION_LEVEL`, and the status view derives completion differently for those modes. The inspected implementation does not yet demonstrate the approved same-obligation dual-entry and reconciliation contract. This needs an explicit domain and schema gap analysis before P0/P1 changes.

### 4.4 QBMS and DTE ownership

System A should reference canonical QBMS question identity/version and DTE taxonomy mappings; it must not become a second question-bank or taxonomy authority. The two Lovable projects currently have separate databases. A stable cross-system identity/version contract and migration/connection plan are required before question references are treated as canonical.

## 5. Key implementation risks

1. **Split source of truth:** Lovable Student Tracking, Lovable QBMS, GitHub prototype and standalone PULSE database are not yet proven to be one synchronized system.
2. **Data fragmentation:** student and question records may be stored in separate managed databases.
3. **Identity mismatch:** current System A schema does not demonstrate DEC-011/012 shared-core compliance.
4. **Pilot-role mismatch:** teacher-oriented auth/role workflows differ from one-operator pilot mode.
5. **Tracking semantics mismatch:** mutually selected tracking modes do not prove dual-entry reconciliation.
6. **Migration drift:** the Lovable Student Tracking project has Drizzle migrations, but `drizzle/schema.ts` is intentionally blank. Do not treat that file as an authoritative schema snapshot.
7. **Candidate migration risk:** the GitHub System A SQL candidate is not applied to the standalone PULSE project and must be reconciled with DEC-011/012/013 and all still-open database decisions before any execution.
8. **No release proof:** the inspected Lovable projects are unpublished. Project readiness does not establish production readiness.

## 6. Recommended sequence

### P0 — Source and integration control
1. Establish the Lovable Student Tracking project as the System A source candidate and QBMS as the separate QBMS source candidate.
2. Connect/export both source trees into the private GitHub repository under clearly separated application paths, preserving history where feasible.
3. Confirm two-way sync behavior and record the exact repository, branch, project IDs and commit SHAs.
4. Preserve the current Lovable versions as recovery points before any source migration.

### P1 — Architecture reconciliation (read-only first)
1. Map current Student Tracking tables, columns, constraints, indexes, RLS policies and RPCs to the approved shared PULSE model.
2. Map QBMS question identity/version, import staging, taxonomy and role objects to canonical QBMS/DTE ownership.
3. Design the tenant-safe shared identity/enrollment model and dual-mode evidence/reconciliation model.
4. Record unresolved decisions rather than inventing defaults.
5. Produce a reviewed migration plan with data migration and rollback strategy.

### P2 — Controlled implementation
1. Only after source control and architecture decisions are approved, implement in the canonical application source.
2. Build the Student Master and Academic Structure Builder on the approved shared model.
3. Add integration tests for identity, tenant isolation, enrollment, aggregate/question-level reconciliation and provenance.
4. Apply database changes only after explicit approval; verify RLS, grants, migrations and tests.
5. No merge or production deployment without explicit approval.

## 7. Actions performed and not performed

Performed:
- Read-only discovery of GitHub repositories and branches.
- Read-only inspection of Lovable workspaces, project metadata, file inventories, source files and edit history.
- Read-only SQL probes for database identity, public table counts, table names and public RLS policy definitions.
- Read-only inspection of standalone PULSE project status, public tables and applied migrations.

Not performed:
- No Lovable code edits.
- No GitHub source code changes.
- No GitHub branch merge or pull request.
- No Supabase DDL, migration application, grant, RLS or data changes.
- No project publication or deployment.
- No data export or copy between databases.
- No secrets or environment file contents inspected.

## 8. Gate before implementation

The source-recovery audit has identified the application candidates, but a critical integration decision remains:

**The Lovable Student Tracking project currently has its own managed database, while the standalone PULSE Supabase project is empty.** The actual application source also has not yet been synchronized into the private GitHub repository as a verifiable application tree.

Therefore, the next implementation gate is to establish the canonical GitHub source and choose/approve the database consolidation target. Until then, continue with documentation and read-only reconciliation only.
