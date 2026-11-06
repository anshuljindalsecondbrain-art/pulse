# Infrastructure and Deployment Audit

## Supabase

- Project: PULSE, ref `nnvssbfezkliavwxhgbh`.
- Region: `ap-south-1`; PostgreSQL 17.11.
- Status: ACTIVE_HEALTHY.
- Public application tables: none.
- Applied migrations: none.
- Edge Functions: none.
- Security, performance and health advisor lints: none on empty schema.

No production database implementation exists. Do not apply the proposed System A migration unchanged.

## Vercel

- Project: `pulse`, framework Vite.
- Latest deployment inspected: READY, commit `b298379d048247a306601e29f4e64739e50e0103`.
- Current PR head at audit time: `dee7f701b24ae341ca165e116be9cc40442f0509`.
- The deployment is not an exact-head deployment.
- SSO protection is enabled for deployments other than custom domains.
- Project metadata indicates `live: false`; the audit does not classify this as production live.
- No deployment was triggered during this audit.

## CI / branch synchronization

PR #2 is open/draft/unmerged. Branch activity is concurrent; PR metadata and the latest GitHub Actions run can refer to different commits. Require exact SHA matching across PR, CI and preview before release.

## Infrastructure gaps

- No production environment/backend integration verified.
- No database backup/restore rehearsal evidence.
- No observability/alerting evidence for application workflows.
- No queue/worker or scheduled job infrastructure verified.
- No tested deployment/migration coordination or rollback plan execution.
- No demonstrated environment separation and least-privilege credential inventory.

## Next gates

Keep preview only. Refresh current branch/PR head; verify exact-head CI; inspect Vercel environment variables without exposing values; resolve preview build rate limits if present; deploy preview only after approval and capacity; test protected preview with browser QA; design production environment only after database and security acceptance.
