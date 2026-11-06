# Backend and API Audit

## Current state

The live Supabase project has zero application tables, zero applied migrations and zero Edge Functions. The repository contains a browser Supabase client and a System A repository adapter, but the primary App.tsx does not import or call that adapter. No live API/service endpoint was verified.

## Repository adapter review

The adapter:
- Calls `supabase.auth.getUser()` before learner operations.
- Lists active institute memberships for the signed-in user.
- Resolves a student by institute and Auth UID.
- Lists eligible obligations for that learner.
- Appends a learner report event and includes an idempotency key.

These are useful integration primitives, but the adapter performs direct browser-to-Data-API queries and depends on RLS and server-side actor checks that do not exist in the live schema. Its type contracts also reflect the proposed institute-centric schema rather than the newer canonical shared tenant/person model.

## API/command gaps

- No atomic assignment publication command.
- No trusted roster snapshot and obligation expansion transaction.
- No role-checked teacher verification command.
- No server-side correction/doubt/appeal commands.
- No parent access command or token lifecycle.
- No pagination/filters/large inventory APIs for QBMS/DTE.
- No API contract tests or database integration tests.
- No outbox/event delivery or retry/dead-letter infrastructure.

## Required design

Use explicit query and command services. Queries must scope by tenant and actor and paginate server-side. Commands must derive actor from Auth, validate active membership/role/resource scope, enforce idempotency and execute critical multi-row changes transactionally. Keep external question and DTE references optional for System A. Validate payloads at the trust boundary and return stable error codes with correlation IDs.

## Acceptance tests

Cross-tenant read/write denied; role escalation denied; wrong student obligation denied; duplicate idempotency key returns the original outcome; publication retry does not duplicate obligations; concurrent publication is serialized; append-only evidence cannot be updated/deleted; expired/revoked parent access denied.
