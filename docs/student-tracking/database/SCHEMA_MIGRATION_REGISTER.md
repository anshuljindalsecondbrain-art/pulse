# System A — Schema and Migration Register

**Document ID:** STS-DB-MIGRATIONS-001  
**Version:** 1.0.0  
**Status:** Active register  
**Date:** 2026-11-07

## 1. Live Supabase migration state

Project reference: `nnvssbfezkliavwxhgbh`

Verified on 2026-11-07:
- Project ACTIVE_HEALTHY, PostgreSQL 17.11, Mumbai region.
- No application tables in public.
- No applied migration records.

## 2. Existing proposed migration

| Filename | State | Action |
|---|---|---|
| `supabase/migrations/20261106000100_system_a_initial_schema.sql` | Proposed/unapplied | Do not apply unchanged |

Reasons:
- Introduces duplicate institute, student, batch and membership entities.
- Auth UID is used as business actor identity in multiple tables.
- Membership and role scope are combined.
- Several authorization and physical integrity issues remain.
- RLS is deliberately enabled/forced with no policies/grants, so the frontend adapter cannot use it as an operational database.
- No complete reviewed RLS command layer exists.

Do not edit or delete this historical proposal silently. Supersede it through a documented decision and a new migration plan.

## 3. Shared identity baseline under review

The V10 `feat/pulse-domain-core` branch includes `supabase/migrations/0001_identity_and_academic_context.sql` with preliminary entities:
- `tenants`
- `people`
- `tenant_people`
- `students`
- `academic_context_epochs`

This migration is not proof that the shared identity design is production approved. Its comments state that production RLS policies and application-specific constraints must be added. Review exact branch ownership, migration history and authorization design before integration.

## 4. Planned System A migration sequence

Names below are logical purposes. Executable timestamped filenames must be created using the Supabase CLI migration workflow after dependencies are approved.

| Sequence | Logical migration purpose | Dependencies | State |
|---|---|---|---|
| M00 | Reconciled shared identity/core foundation | OPEN-001, OPEN-010, OPEN-011 | Blocked |
| M01 | System A exercise, versions and slots | M00; data ownership approval | Pending design |
| M02 | Assignment, version, items and target snapshots | M01; OPEN-003, OPEN-004 | Pending design |
| M03 | Student obligations and publication transaction | M02; eligibility policy OPEN-008 | Pending design |
| M04 | Report, observation and attempt event ledger | M03; OPEN-005, OPEN-006 | Pending design |
| M05 | Answer evaluation and verification | M04; OPEN-012 | Pending design |
| M06 | Correction lifecycle and immutable events | M05 | Pending design |
| M07 | Doubt cases, events and scope rules | M04 | Pending design |
| M08 | Disputes, appeals and recognition | M05; policy approval | Later |
| M09 | Read models, progress and Doubt Radar | M03–M08; metric-policy approval | Later |
| M10 | Parent/mentor authorization read models | M00; OPEN-009; role scope | Later |
| M11 | Optional QBMS exact question/version mapping | QBMS contract | Later |
| M12 | Optional DTE enrichment association | DTE contract | Later |

## 5. Mandatory migration record

Every executable migration must record:
- change ID;
- source commit / pull request;
- SQL filename and checksum;
- prerequisite migration head;
- expected table/view/index/function/policy changes;
- whether backfill is required;
- RLS and grant changes;
- non-destructive recovery/rollback plan;
- migration replay result;
- RLS and integration test results;
- Supabase advisor results;
- reviewer/approver;
- environment, execution timestamp and actual resulting version.

## 6. Environment execution state

| Environment | Project reference | State |
|---|---|---|
| Development | Not yet designated | Pending |
| Staging | Not yet designated | Pending |
| Production | PULSE project is connected; designation/authorization not established | Blocked from migration |

No application migration has been applied during this workstream.
