# Instructions for AI Coding Agents

## Project context
PULSE is a multi-institute academic platform. This repository is the canonical source for code, specifications, architecture decisions, migrations, and tests. Read the root README and the relevant documents under `docs/` before making changes.

## Mandatory workflow
1. Inspect the repository, current branch, package manifests, application entry points, tests, and existing conventions before editing.
2. For database work, inspect the connected Supabase project, current schema, migration history, extensions, RLS policies, functions, triggers, and data dependencies before proposing DDL.
3. Produce a concise audit and implementation plan before broad or cross-cutting changes.
4. Preserve existing working behavior. Reuse sound components and patterns rather than rebuilding by default.
5. Make small, reversible, reviewable changes. Prefer feature branches and pull requests.
6. Add/update automated tests, type checks, and documentation relevant to each change.
7. Never apply destructive production migrations without explicit review and approval.

## Architecture invariants
- Student Work Tracking (Abhyas Matrix) must operate without deep question tagging.
- Deep Tagging Engine (DTE) enriches question classification progressively; it must not block daily tracking.
- DTE is generic and configuration-driven. Do not hardcode a fixed six-level taxonomy.
- Keep question identity, question version, and exercise/test placement slot distinct.
- Keep classification definitions separate from question-to-classification mappings.
- Keep archetype identity reusable and independent of a single taxonomy parent.
- Keep Question Type distinct from difficulty.
- Difficulty rules, calculations, scores, and history belong to a separate Difficulty Rule Engine (DRE). DTE may hold only a version-specific external reference/integration pointer.
- Student evidence is immutable historical evidence. Enrichment may add derived associations but must not rewrite the original event.
- Tenant-owned data must be isolated and authorization checked server-side.

## Database and security rules
- Do not assume old SQL in historical documents is safe to run.
- Do not use cascade deletion where it could remove questions, student evidence, attempts, results, or historical mappings.
- Prefer archive/deactivate/restrict semantics and explicit versioning.
- Enforce tenant boundaries in database policies and server-side authorization; test cross-tenant access.
- Never expose Supabase service-role credentials in browser code.
- Never commit `.env` files, API keys, access tokens, passwords, personal student records, or production database dumps.
- Database DDL belongs in ordered, reviewed Supabase migrations. Do not edit an already-applied migration; create a new migration.

## Engineering quality
- Follow the repository's established language, framework, formatting, and naming conventions after they are discovered.
- Validate inputs at trust boundaries and handle loading, empty, error, and permission-denied states.
- Use server-side pagination and indexed queries for large inventories; do not load a million-question bank into the browser.
- Keep audit events for sensitive academic classification and publication actions.
- AI-generated suggestions must be explainable, reviewable, and never silently published.

## Reporting
For each task, report: files changed, behavior changed, tests run and results, migration impact, security implications, and unresolved risks. Distinguish verified facts from assumptions.
