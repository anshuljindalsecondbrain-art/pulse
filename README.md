# PULSE

PULSE is a multi-institute academic technology platform. Its long-term direction is to connect academic content, question-bank operations, student work tracking, assessment, and AI-supported learning workflows through a governed, versioned platform.

> **Repository status (2026-11-07):** `main` contains the project governance, architecture and specification baseline. The Vite-based System A implementation is being reconciled incrementally on task-specific branches. Historical implementation branches are preserved as source references; they are not assumed to be merge-ready. This repository is the source of truth for project code, specifications, architecture decisions, migrations, tests, and delivery history.

## Principles

- Build on inspected, verified assets; do not assume an implementation exists because it appears in an old specification.
- Keep operational student tracking independent from progressive deep question classification.
- Treat question identity, question version, and placement/slot as distinct entities.
- Make classification configurable; do not hardcode a universal six-level academic taxonomy.
- Keep the Difficulty Rule Engine (DRE) independent from the Deep Tagging Engine (DTE).
- Enforce tenant isolation, least privilege, auditability, and data-preserving change practices.
- Prefer small, reviewable changes with tests and documented migrations.

## Documentation map

- [Project master plan](docs/PROJECT_MASTER_PLAN.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Development roadmap](docs/DEVELOPMENT_ROADMAP.md)
- [Decision log](docs/decisions/DECISION_LOG.md)
- [DTE specification](docs/modules/DTE_SPECIFICATION.md)
- [Student Tracking specification](docs/modules/STUDENT_TRACKING_SPECIFICATION.md)
- [Database governance](docs/DATABASE_GOVERNANCE.md)
- [AI coding-agent instructions](AGENTS.md)
- [System A Vite topology decision](docs/architecture/decisions/ADR-001-system-a-vite-topology.md)

## Development status

The first System A increment is a persistence-independent evidence domain package under `packages/system-a-domain`. It does not establish production persistence or authorization. The application UI, trusted backend boundary, canonical shared schema, migration lineage and operational integration remain staged work.

Do not apply production schema changes or deploy without separate review and explicit approval.

## Working with this repository

1. Read `AGENTS.md` and the relevant module specification before changing code.
2. Confirm the current branch and inspect the existing implementation.
3. Prefer a feature branch and focused pull request for substantive work.
4. Add or update tests and documentation with each behavior change.
5. Use reviewed Supabase migrations for database DDL.
6. Never commit secrets, service-role keys, credentials, student PII, or production exports.
