# Dependency-Aware Implementation Roadmap

## Phase 0 — Freeze and decision closure
**Goal:** Prevent further divergence before production backend work.

1. Freeze production claims; retain demo mode.
2. Reconcile CORE-001–009 with the older V10/System A schema sources.
3. Approve the canonical tenant/person/Auth identity model.
4. Decide enrollment overlap, parent verification, centre scope, role/action grants and separation of duties.
5. Decide shared vs tenant-owned subject/chapter/catalogue records.
6. Approve status/evaluation semantics, marking precision, attempt-cycle and syllabus lifecycle.
7. Close DTE ownership and mapping attachment decisions.
**Exit:** Signed decision register and one approved logical/physical model.

## Phase 1 — Canonical data and backend foundation
1. Produce a single schema dependency graph and migration plan.
2. Create migration from the approved schema (do not concatenate legacy SQL).
3. Replay on disposable Supabase/Postgres from empty state.
4. Implement tenant-qualified FKs, grants, RLS, trusted identity resolver and audit.
5. Implement atomic idempotent assignment publication and obligation expansion.
6. Implement evidence, verification, answer evaluation, correction and doubt commands.
7. Run cross-tenant and privilege-negative integration tests.
**Exit:** Reproducible schema, security tests and transactional command acceptance.

## Phase 2 — System A production integration
1. Introduce authenticated app shell and role-scoped routes.
2. Keep demo mode isolated and unmistakably labelled.
3. Integrate real roster, batch, exercise and assignment queries.
4. Complete Exercise Builder draft/edit/publish/revision workflow.
5. Implement teacher matrix and student worklist against command/query APIs.
6. Add parent/mentor flows only after privacy and permission approvals.
7. Verify academic eligibility against effective-dated context.
**Exit:** End-to-end faculty and learner workflows with audit evidence.

## Phase 3 — QA and controlled pilot
1. Exact-SHA CI: typecheck, unit tests, build.
2. Playwright E2E for faculty, student, reviewer, mentor and admin.
3. Accessibility and responsive QA.
4. Migration replay, RLS, idempotency, concurrency and recovery tests.
5. Pilot with synthetic data first; then limited real-data pilot only after explicit privacy/security approval.
**Exit:** Signed pilot acceptance and operational monitoring.

## Phase 4 — QBMS / Q-GENOME foundation
1. Approve question identity/version/source/media model.
2. Build secure upload/ingestion and validation pipeline.
3. Build duplicate relationship detection and review workflow.
4. Add question lifecycle, source provenance and quality gates.
5. Benchmark indexed inventory and relationship graph at target scale.
**Exit:** Governed question source service.

## Phase 5 — DTE implementation
1. Resolve canonical DTE schema and mapping attachment/inheritance.
2. Finalize M01–M18 ownership and state machines.
3. Build configurable schema manager without mandatory academic hierarchy.
4. Build mapping studio, review, versioning and validation.
5. Add bulk jobs, AI suggestion evidence and human approval.
6. Build historical enrichment consumer with idempotent replay.
**Exit:** Auditable DTE enrichment that cannot mutate System A source evidence.

## Phase 6 — DRE, assessment and AI intelligence
1. Define DRE as separate difficulty service.
2. Implement test blueprint/assessment systems.
3. Build concept diagnostics only when verified mappings exist.
4. Implement AI Mentor with tenant-scoped retrieval, model/prompt traceability and human gates.
5. Validate all five A/B experiments with deterministic cohorts, guardrails and privacy controls.
**Exit:** Explainable intelligence and experimentally validated workflows.

## Critical path

Decision closure → unified schema → RLS/commands → System A integration → E2E/security acceptance → pilot. QBMS/DTE/AI work can proceed in parallel only where contracts are stable and do not block System A's minimum operational workflow.
