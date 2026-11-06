# PULSE-EVT-000001 — Establish event-driven change governance

- Category: Governance / process
- Scope: Platform-wide
- Created: 2026-11-06
- Status: PROPOSED
- Origin: Project discussion; user requested a method for handling every project event.
- Source: Conversation dated 2026-11-06.
- Decision owner: Project owner; explicit approval pending.

## Problem
Project changes were committed to GitHub, but no single enforced record connected original request, rationale, impact, decision, implementation, tests and follow-up.

## Proposed outcome
Adopt the PULSE Event Governance Protocol and maintain an event record for every meaningful project event.

## Scope and impact
Applies to all PULSE modules. Adds documentation, traceability and contribution gates. No application behavior or database schema changes are authorized by this event.

## Acceptance criteria
- Protocol, master register and individual event record exist.
- Requirement, architecture decision, test evidence, release and issue registers exist.
- PR and issue templates request event/requirement traceability.
- CI checks a minimum governance metadata contract for PRs.
- Historical backfill is marked incomplete until audited.
- No production DDL or merge to main is performed by this governance setup.

## Decision
Proposed: repository-based governance with GitHub as code-history source of truth.
Alternative: conversation-only tracking, rejected as insufficiently durable.
Approval: Pending explicit project-owner confirmation.

## Implementation evidence
Branch: feat/system-a-abhyas-foundation
PR: https://github.com/anshuljindalsecondbrain-art/pulse/pull/2
Governance baseline commit: da8189bb8694bf19520651f1a0e33821130ea872 (CI workflow update); current PR head is tracked in PR #2.\nCI metadata check: initial run failed because the workflow event payload contained the previous PR body; PR body has since been updated. A fresh run is required.
Changed paths: governance documentation, GitHub templates and CI governance check.

## Validation
Governance checker and PR review: pending.
Protocol adoption: pending explicit project-owner approval.

## Follow-up
Backfill prior System A events from commit history and source conversations. Backfill project-wide requirements/decisions from specifications. Resolve conflicts through explicit amendment events.
