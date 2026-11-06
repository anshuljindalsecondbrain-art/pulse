# PULSE-EVT-000007 — Add System A CI and Supabase migration runbook

- Category: Engineering quality / database delivery
- Module: System A
- Created: 2026-11-06
- Status: IMPLEMENTED_PENDING_CI
- Origin: System A Master Completion Specification and database governance.
- Branch: feat/system-a-abhyas-foundation
- PR: https://github.com/anshuljindalsecondbrain-art/pulse/pull/2

## Change
- Added a dedicated System A GitHub Actions workflow for application typecheck, unit tests, production build and static SQL guardrail checks.
- Added app package scripts for test watch, coverage invocation and typecheck-backed lint.
- Added a staged Supabase migration runbook.

## Validation boundary
- Workflow has been committed; execution on the current branch head is pending.
- Migration static checks do not execute SQL.
- Database project connector currently returns no projects; no target schema was inspected and no SQL was applied.
- Coverage script is only an invocation entry; provider configuration may be needed before it can run.

## Follow-up
- Verify npm lockfile exists before relying on npm ci.
- Execute workflow and repair CI configuration based on actual run evidence.
- Add SQL parser/ephemeral Postgres integration tests and RLS tests after project discovery.
