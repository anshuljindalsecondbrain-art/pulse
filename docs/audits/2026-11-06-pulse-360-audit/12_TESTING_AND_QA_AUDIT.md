# Testing and QA Audit

## Repository evidence

- Vitest test scripts and numerous domain unit test files exist.
- Package scripts include `typecheck`, `test`, `build`; `lint` is currently equivalent to TypeScript checking.
- GitHub Actions workflows include System A CI and Student Tracking workflow definitions.
- Latest completed System A CI run observed: success on SHA `b51116b5afb850d6829ead012b02057e99fb7a72`.
- Current PR head at audit time: `dee7f701b24ae341ca165e116be9cc40442f0509`; the successful run is not on that exact SHA.
- An earlier CI run on `5a67022b...` failed due an invalid character in App.tsx; a fix passed on the older SHA `b51116b...`.

## Missing evidence

- Exact-head CI confirmation.
- Verified full Student Tracking workflow run on the current PR head.
- Browser E2E tests and screenshots at desktop/tablet/mobile breakpoints.
- Accessibility automation and manual screen-reader/keyboard review.
- Live Supabase integration tests against a disposable database.
- RLS negative tests and role escalation tests.
- Migration replay from empty database and rollback/forward recovery.
- Load/performance tests for roster and question inventory scale.
- AI evaluation and prompt regression suite.
- End-to-end tests for parent secure-card token expiry/revocation.

## Required quality gates

1. Typecheck + unit tests + production build on exact PR SHA.
2. Playwright critical workflows with role fixtures.
3. Accessibility test suite and manual audit.
4. Disposable Supabase migration replay.
5. RLS cross-tenant and privilege-negative tests.
6. Idempotency/concurrency tests.
7. Load tests with realistic cohort and million-question inventory profiles.
8. Dependency and secret scanning.
9. AI model/prompt evaluations.
10. Evidence recorded in test register and linked to commit SHA.

A test file existing is not proof it ran. A green CI run on a previous SHA is not proof the current PR head is green.
