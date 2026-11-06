# PULSE

PULSE is a multi-institute academic technology platform. Its long-term direction is to connect academic content, question-bank operations, student work tracking, assessment, and AI-supported learning workflows through a governed, versioned platform.

> **Repository status (2026-11-06):** the repository now contains a fresh System A frontend prototype under `apps/student-tracking/`. It is an isolated Vite/React application with local demo persistence; production auth, database integration, RLS and deployment are not yet implemented. This repository is the source of truth for project code, specifications, architecture decisions, migrations, tests, and delivery history.

## Principles

- Build on inspected, verified assets; do not assume an implementation exists because it appears in an old specification.
- Keep operational student tracking independent from progressive deep question classification.
- Treat question identity, question version, and placement/slot as distinct entities.
- Make classification configurable; do not hardcode a universal six-level academic taxonomy.
- Keep the Difficulty Rule Engine (DRE) independent from the Deep Tagging Engine (DTE).
- Enforce tenant isolation, least privilege, auditability, and data-preserving change practices.
- Prefer small, reviewable changes with tests and documented migrations.

## Documentation map

- [Student Tracking app prototype](apps/student-tracking/README.md)\n- [Project master plan](docs/PROJECT_MASTER_PLAN.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Development roadmap](docs/DEVELOPMENT_ROADMAP.md)
- [Decision log](docs/decisions/DECISION_LOG.md)
- [DTE specification](docs/modules/DTE_SPECIFICATION.md)
- [Student Tracking specification](docs/modules/STUDENT_TRACKING_SPECIFICATION.md)
- [System A database architecture](docs/student-tracking/SYSTEM_A_DATABASE_ARCHITECTURE.md)
- [System A implementation plan](docs/student-tracking/SYSTEM_A_IMPLEMENTATION_PLAN.md)
- [Database governance](docs/DATABASE_GOVERNANCE.md)
- [AI coding-agent instructions](AGENTS.md)

## Development status

System A (Abhyas Matrix) is the first operational delivery priority. A frontend prototype and implementation baselines are in this repository. The production data layer remains blocked on connecting and auditing the intended Supabase project. Do not apply production schema changes until the as-built audit and proposed change plan have been reviewed.

## Working with this repository

1. Read `AGENTS.md` and the relevant module specification before changing code.
2. Confirm the current branch and inspect the existing implementation.
3. Prefer a feature branch and focused pull request for substantive work.
4. Add or update tests and documentation with each behavior change.
5. Use reviewed Supabase migrations for database DDL.
6. Never commit secrets, service-role keys, credentials, student PII, or production exports.
