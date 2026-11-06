# PULSE Test Evidence Register

Status: Initial baseline; evidence is commit-specific.

| Date | Module | Commit | Workflow / test | Result | Scope and limitation |
|---|---|---|---|---|---|
| 2026-11-06 | System A | cbab17c07969018c0fe9f54a33310e6d6590b38a | GitHub Actions typecheck, Vitest, production build | PASS | Prototype build and unit suite at that commit only |
| 2026-11-06 | System A | 87f1e45f90bc9d1fcbe709b9c7424b6a3d2915bd | Evidence projection head | PENDING_RECHECK | No run was confirmed for this SHA |
| 2026-11-06 | System A | 5351470876b61d7968f71c1cfb08656adbb9a3cf | Governance check + typecheck + Vitest + build | PARTIAL: governance failed; build passed | Governance job used stale PR event-body snapshot and did not see the subsequently updated PR body. Typecheck, tests and build passed on this exact commit. Workflow was changed to query the current PR body via GitHub API; rerun pending on newer head |

Rules: record exact SHA and workflow run ID/URL when available. Record suite names/counts if exposed. Keep failed/cancelled runs in history. State test scope. Unit tests do not establish RLS, cross-tenant security, browser behavior or production persistence. Never report pass until relevant run completed on stated commit.
