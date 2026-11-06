# System A database workflow

## Local validation
```bash
cd apps/student-tracking
npm ci
npm run typecheck
npm test
npm run build
```

## Supabase workflow
1. Connect the exact development/staging Supabase project used by PULSE.
2. Record project reference, environment and current migration head in the deployment record. Never put credentials in Git.
3. Inspect schemas, auth users/claims, tables, constraints, indexes, views, triggers, functions, extensions, grants, RLS, Storage policies and migration history.
4. Compare the live project with this repository's proposed migrations. Do not assume it is an empty database.
5. Resolve the review checklist in `SYSTEM_A_DATABASE_BASELINE.md`.
6. Run the migration against a disposable local Supabase/Postgres database first.
7. Add positive and negative RLS tests, especially cross-institute SELECT/INSERT/UPDATE/DELETE and RPC cases.
8. Run the migration in staging, inspect actual objects and exercise application operations.
9. Capture logs, test outputs and rollback/recovery evidence.
10. Production migration requires a separately reviewed change and explicit approval.

## Do not
- Put service-role keys in browser variables or Git.
- execute a migration against production merely because it exists in this repository.
- add permissive authenticated policies to make the UI work.
- call the schema production-ready before RLS policies and transaction-safe operations have tests.
