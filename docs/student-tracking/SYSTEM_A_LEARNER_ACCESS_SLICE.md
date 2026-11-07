# System A learner self-read access slice

Status: PROPOSED CODE; NOT APPLIED TO ANY DATABASE.

## Scope

This migration adds the first narrow authenticated read path required by the production login gate:

1. An authenticated user can read only their own active institute membership rows.
2. A user with an active STUDENT membership can read only student identities linked to their authenticated user ID.
3. A learner can read only eligible obligations attached to that same student identity.

The policies use database identity (auth.uid()), not a browser-supplied role, institute ID, or student ID as proof of authorization.

## Explicit exclusions

- No teacher, reviewer, mentor, parent, or institute-admin access.
- No inserts, updates, deletes, report submission, verification, or RPC execution.
- No ability to enumerate other students or obligations.
- This migration does not complete System A authorization.

## Apply order

1. Review and apply 20261106000100_system_a_initial_schema.sql in a disposable Supabase test project.
2. Apply 20261107000100_system_a_student_self_read_policies.sql.
3. Run supabase/tests/20261107000100_system_a_student_self_read_policies.sql.
4. Execute adversarial tests with two users in separate institutes and verify cross-tenant reads return zero rows.
5. Only then consider enabling the learner read UI.

Do not apply this migration to production until the test project validates the schema and policies.
