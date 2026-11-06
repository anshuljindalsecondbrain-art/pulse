# PULSE Student Tracking — Abhyas Matrix

A fresh, isolated frontend application for System A. It implements the first interaction prototype for quick exercise scaffolding, a student-by-question matrix, cohort signals, a basic roster workflow and CSV export.

## Run locally

```bash
cd apps/student-tracking
npm install
cp .env.example .env.local
# Fill in the Supabase project URL and publishable key in .env.local
npm run dev
```

Build and type-check:

```bash
npm run typecheck
npm test
npm run build
```

## Supabase client foundation

- The browser-safe client is initialized in `src/lib/supabase.ts`.
- Configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `.env.local`.
- `.env.local` is ignored by Git. The committed `.env.example` contains placeholders only.
- Only a Supabase publishable key belongs in browser code. Never expose a secret or service-role key.
- The client foundation does not yet replace the demo adapter or write student data to Supabase.
- No tables or migrations have been applied. Authentication, tenant authorization, RLS policies and database persistence remain unimplemented.

## Current implementation boundary

- This is a **frontend prototype**, not a production-connected application.
- Data is seeded for demonstration and persisted in browser localStorage.
- No authentication, tenant isolation, server API, database persistence, or real-time synchronization is implemented.
- The A/B switch is a UI concept only. Deterministic allocation and telemetry collection are not implemented.
- Parent token links, mentor WhatsApp dispatch, and AI clustering are not implemented.
- Do not enter real student personal data into this preview.

## Product behaviors represented

- Create an exercise using chapter, label, question count, batch and due date.
- Generate local numbered slots without QBMS or DTE dependency.
- Cycle cells through Unattempted → Correct → Incorrect → Doubt → Skipped → Partially Correct.
- Domain contracts distinguish immutable student report events from separate teacher verification decisions; a report alone does not imply verification.
- A pure projection function rebuilds the current slot view from report and verification histories, retaining the underlying event arrays and scoping decisions to the exact report event reviewed.
- Use keyboard shortcuts on a focused matrix cell: 1 Correct, 2 Incorrect, 3 Doubt, 4 Skipped, 5 Partially Correct, 0/Backspace Unattempted; arrow keys move between cells.
- Filter students, inspect per-question cohort signals and export the matrix as CSV.
- Add students to the selected demo batch.
- Display the two independent product tracks: operational System A and later progressive DTE enrichment.

## Next engineering gates

1. Inspect and finalize the System A database schema against the live Supabase project.
2. Design institute membership, roles and tenant-scoped RLS policies; test cross-tenant denial.
3. Implement authenticated, server-backed repositories and replace localStorage without losing demo/test workflows.
4. Extend report/verification contracts into append-only server-side event storage and immutable assignment/exercise versions.
5. Implement correction cycles, attempt cycles and doubt cases as separate linked records.
6. Add idempotency, audit history, browser tests and accessibility checks before production deployment.
