# PULSE Student Tracking — Interactive Demo

This branch intentionally delivers the demo-first product experience. It uses fictional sample records and a browser-persisted mock repository. It does not require Supabase credentials and does not write to a live database.

## Run locally

```bash
cd apps/student-tracking
npm install
npm run dev
```

## Demo modules

- Dashboard: institute-level metrics, quick navigation and recent assignments.
- Students: search and batch-filter the roster; add fictional learner records.
- Batches: inspect cohort sizes and batch summaries.
- Assignments: create a draft from the offline module catalogue, select question references, choose a target batch and due date, then publish the draft.
- Abhyas Matrix: select an assignment, update question-level statuses and export CSV.
- Doubt Radar: create doubt cases and change their status.
- Academic Review: verify or return individual student reports without rewriting the reported status.
- Attendance: record daily presence by learner and date.
- Reports: view sample report counts and operational indicators.
- Settings: reset the demo data.

## Demo data and persistence

- Seed roster: 24 fictional students across three JEE batches.
- Seed assignments: five fictional practice assignments.
- Question references come from the offline catalogue and are placeholders, not QBMS question identities or question text.
- Mutations are stored in browser localStorage under the `pulse.demo.v4.*` namespace.
- Assignment publishing runs through a typed lifecycle service and locks a question-reference snapshot.
- The demo workflow service includes append-only report events, separate verification decisions, guarded doubt transitions and one-attendance-record-per-student-per-day validation. These domain services are unit tested; only assignment publishing is currently wired into the screen.
- Use Reset demo data to restore the seed records.
- Do not enter real student personal data into this preview.

## Backend boundary

The current demo repository is implemented in the browser using localStorage. It simulates create, read and update workflows for product demonstrations. The workflow service is pure TypeScript and can later be called by a server API. It is not a real API, server, Supabase database, or security boundary. The next backend increment should persist the same domain events through a replaceable API adapter while keeping demo fixtures available for repeatable testing.

## Validation

```bash
npm run typecheck
npm test
npm run build
```

No database migration is applied by this demo branch. No production deployment or merge is performed.
