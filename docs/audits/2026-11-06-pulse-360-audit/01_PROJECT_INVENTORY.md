# Project Inventory

## Repository snapshot

- Repository: `anshuljindalsecondbrain-art/pulse`
- Branch: `feat/system-a-abhyas-foundation`
- PR head at audit time: `dee7f701b24ae341ca165e116be9cc40442f0509`
- Recursive tree: 134 tracked blobs.
- PR #2: 103 changed files, 12,359 additions, 13 deletions (PR metadata snapshot).
- Repository root: `README.md`, `AGENTS.md`, application, packages, docs, migrations and CI workflows.

## Product domains represented in repository documentation

| Domain | Inventory evidence | Implementation classification |
|---|---|---|
| Shared platform identity/tenancy | CORE-001 to CORE-009 design records | Draft design |
| System A / Abhyas | `apps/student-tracking`, System A docs | Frontend prototype + domain-only logic |
| QBMS / Q-GENOME | Architecture references and requirements | Not established as implemented in this repo |
| DTE | Register, glossary, responsibility matrix, 18 module specs, audits | Specification-only |
| DRE | Explicitly separated in DTE governance | Not established as implemented |
| Test Management | Product architecture references | Not established as implemented |
| AI Mentor | Product architecture references and memory requirements | Not established as implemented |
| Analytics / experimentation | Uploaded five-experiment plan and architecture references | Requirements/design; runtime not verified |
| Infrastructure | Supabase project, Vercel project, GitHub Actions | Connected foundation; production backend absent |

## System A code inventory

The application is a React 18 + TypeScript + Vite app. Its package scripts include build, typecheck, Vitest test, test coverage and lint (lint is a TypeScript build check). The source includes:
- Main workspace and Exercise Builder UI.
- Demo data and fictional offline-module catalogue.
- Workflow, assignment, worklist, evidence submission, teacher verification, correction, doubt, answer evaluation, timeline, eligibility and marking-scheme domain modules.
- Unit test files corresponding to many domain modules.
- Supabase client and a repository adapter.

The primary app initializes and persists student, exercise and mark state through `pulse.demo.v2.*` localStorage keys. The repository adapter is separate and not invoked by the main UI.

## Documentation inventory

- 18 DTE module specifications (M01–M18).
- DTE module register, glossary, responsibility matrix and two prior audits.
- CORE-001–009 canonical data and authorization design package.
- System A database architecture, implementation plan, master completion spec and backend status.
- Governance event register and 23 event records.
- Requirement traceability and open-issue registers.
- One proposed System A migration under `supabase/migrations`.

## Inventory caveat

A tracked document, file, module name or migration file is evidence of an artifact existing in GitHub—not evidence that its functionality exists in the running application or live database.
