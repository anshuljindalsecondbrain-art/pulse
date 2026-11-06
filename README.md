# PULSE

PULSE is a multi-institute academic technology platform. Its long-term direction is to connect academic content, question-bank operations, student work tracking, assessment, and AI-supported learning workflows through a governed, versioned platform.

> **Repository status (2026-11-06):** System A (Student Tracking / Abhyas Matrix) has a substantial frontend prototype and pure TypeScript domain workflows. The primary UI still uses browser-local demo persistence. Supabase client/repository foundations exist but are not integrated into the primary UI. The live PULSE Supabase project has no application tables or applied migration history. No production-connected Student Tracking workflow is available yet.

## Principles

- Build on inspected, verified assets; do not assume an implementation exists because it appears in an old specification.
- Keep operational student tracking independent from progressive deep question classification.
- Treat question identity, question version, and placement/slot as distinct entities.
- Make classification configurable; do not hardcode a universal hierarchy.
- Keep the Difficulty Rule Engine (DRE) independent from the Deep Tagging Engine (DTE).
- Enforce tenant isolation, least privilege, auditability, and data-preserving change practices.
- Prefer small, reviewable changes with tests and documented migrations.

## Documentation map

- [Master documentation index](docs/00_PROJECT_GOVERNANCE/PULSE_MASTER_DOCUMENTATION_INDEX.md)
- [Student Tracking app prototype](apps/student-tracking/README.md)
- [PULSE governance protocol](docs/governance/EVENT_GOVERNANCE_PROTOCOL.md)
- [Master event register](docs/governance/MASTER_EVENT_REGISTER.md)
- [Requirement traceability](docs/governance/REQUIREMENT_TRACEABILITY.md)
- [Architecture decision log](docs/governance/ARCHITECTURE_DECISION_LOG.md)
- [Project master plan](docs/PROJECT_MASTER_PLAN.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Development roadmap](docs/DEVELOPMENT_ROADMAP.md)
- [DTE specification](docs/modules/DTE_SPECIFICATION.md)
- [Student Tracking specification](docs/modules/STUDENT_TRACKING_SPECIFICATION.md)
- [System A backend status](docs/student-tracking/SYSTEM_A_BACKEND_IMPLEMENTATION_STATUS.md)
- [System A service/API contract](docs/00_PROJECT_GOVERNANCE/PULSE_SYSTEM_A_APPLICATION_SERVICE_AND_API_CONTRACT.md)
- [System A database authorization design](docs/00_PROJECT_GOVERNANCE/PULSE_SYSTEM_A_DATABASE_AUTHORIZATION_AND_TRANSACTION_DESIGN.md)
- [System A physical table authorization map](docs/00_PROJECT_GOVERNANCE/PULSE_SYSTEM_A_PHYSICAL_TABLE_AUTHORIZATION_AND_INTEGRITY_MAPPING.md)
- [Supabase migration runbook](docs/database/SUPABASE_MIGRATION_RUNBOOK.md)
- [AI coding-agent instructions](AGENTS.md)

## Product domains

- **Student Work Tracking / Abhyas Matrix:** assignment, exercise, student response, verification, correction, doubt and daily tracking workflows.
- **QBMS:** question identity/version, sources/media, review, quality and classification associations.
- **DTE:** institution-configurable classification structures, mapping and review; not authoritative chapterwise curriculum authoring.
- **DRE:** difficulty rules and evaluations.
- **Test Management:** test blueprint, assembly, delivery, results and analysis.
- **Content Management:** institution-owned collections, editions, units, exercises and placements.
- **AI Mentor:** diagnostic interpretation and explainable learner interventions.
- **Shared platform:** identity, tenants, memberships, role grants, audit, notifications and integrations.

## Verified deployment and database status

- Supabase project: PULSE, `ap-south-1`, PostgreSQL 17.11.
- Live `public` schema: no application tables as of the latest audit.
- Migration history: empty.
- Proposed System A migration: not applied; its baseline intentionally forces RLS and grants no direct application access.
- Vercel: System A Preview has reached READY for the feature branch. Preview deployments are protected by Vercel Authentication. This is not a production release.
- Demo data is fictional, browser-local and must not contain real student personal data.

## Release controls

Do not apply either existing V10 or System A initial migration unchanged. The canonical shared identity/tenant model and System A operational model must first be reconciled into one approved physical schema. RLS, grants, command transactions, cross-tenant tests, migration replay and explicit owner approval are required before enabling real student data or production deployment.

## Live systems synchronization — 2026-11-06

- **Supabase:** PULSE is active/healthy in `ap-south-1`, PostgreSQL 17.11. The live public schema has no application tables, no applied migrations and no Edge Functions. The current no-lint advisor result applies only to the empty schema.
- **GitHub:** PR #2 remains open, draft and unmerged. The branch contains the Student Tracking domain layer and the PULSE-DATA-CORE-001–008 architecture package. Database and authorization specifications remain drafts; PULSE-DATA-CORE-009 is the next planned physical ERD/data dictionary stage.
- **Website:** The main Student Tracking UI remains localStorage/demo-backed. The Supabase client and repository adapter are not integrated into the main UI. The READY Vercel Preview observed during the audit belongs to commit `81fd420af18eb9b016b187a71b68073ebf325979`; newer changes exist and must be deployed/verified at the exact current SHA. Preview is protected and not production.
- **Release safety:** No existing V10/System A migration is approved to apply unchanged. No real student data belongs in the demo. Do not merge PR #2 or enable production access until the unified schema, approvals, RLS/grants, trusted command layer, migration replay, cross-tenant tests and browser QA are complete.

## Development

```bash
cd apps/student-tracking
npm install
npm run typecheck
npm test
npm run build
```

See the master documentation index for the staged design record and implementation gates.
