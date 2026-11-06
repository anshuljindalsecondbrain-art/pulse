# PULSE — Development Roadmap

**Status:** Proposed sequence; phase scope will be adjusted after the live-system audit.

## Phase 0 — Existing-system audit
- Inspect repository tree, branches, manifests, framework, routes, components, tests and CI.
- Inspect Supabase project, schemas, tables, constraints, indexes, functions, triggers, extensions and migration history.
- Audit RLS and storage policies, edge functions, secrets handling and tenant boundaries.
- Map existing UI workflows to the product domains.
- Classify findings as verified working, partial, broken, obsolete proposal or missing.
- Deliver reuse-versus-change gap analysis and risk register.

**Exit gate:** reviewed as-built architecture and prioritized implementation plan. No production schema changes in this phase.

## Phase 1 — Platform foundations
- Establish repository conventions, CI checks, environment handling and branch/PR workflow.
- Confirm tenant model, identity/authorization model and audit conventions.
- Establish migration discipline and automated database security tests.
- Confirm question identity/version/placement contracts.

## Phase 2 — Operational Student Tracking
- Verify and stabilize minimum viable exercise creation and student work matrix.
- Preserve independent operation without deep classification.
- Formalize event/status semantics, attempt cycles, reassignment and historical evidence.
- Validate teacher workflow on desktop and mobile.

## Phase 3 — QBMS and content contracts
- Confirm question identity, versioning, sources, media, ownership and licensing.
- Confirm content collections, editions, units, exercises and question slots.
- Define stable APIs/events for downstream DTE, tests and tracking.

## Phase 4 — Generic DTE foundation
- Build configurable classification schemas and schema versions.
- Support hierarchical and flat structures, configurable fields and relationship types.
- Build question inventory and tagging workspace against stable question references.
- Support many-to-many mapping, drafts, validation and audit.

## Phase 5 — DTE academic enrichment and governance
- Add archetype management, question types, pedagogical metadata and PYQ provenance.
- Add assignments, review/return/approval/publication workflows.
- Add mapping revisions, configuration versioning, bulk operations and quality/coverage dashboards.

## Phase 6 — DTE integrations
- Add version-aware integration contracts and durable asynchronous jobs.
- Implement idempotent historical enrichment without mutation of source student evidence.
- Add external DRE pointer integration only; do not implement DRE calculations in DTE.

## Phase 7 — Test Management and analytics
- Implement or refine test blueprinting, assembly, delivery, results and analysis based on audited requirements.
- Connect governed question data and student evidence through stable contracts.

## Phase 8 — AI assistance and AI Mentor
- Add AI-assisted extraction, classification suggestions, similarity/duplicate detection and quality checks.
- Track model/prompt versions and evidence.
- Require human review for authoritative changes.
- Add learner diagnostics and intervention workflows only after evidence quality is sufficient.

## Delivery gates for every phase
- Requirements and acceptance criteria reviewed.
- Data/security impact assessed.
- Tests and migration plan ready.
- Changes delivered in a reviewable branch/PR.
- CI and relevant security tests pass.
- Documentation and operational notes updated.
- Production deployment explicitly approved.
