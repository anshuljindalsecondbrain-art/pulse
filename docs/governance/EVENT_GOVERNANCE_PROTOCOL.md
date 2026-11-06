# PULSE Event Governance Protocol

Status: Proposed governance baseline — adoption requires project-owner approval
Protocol version: 1.0 | Effective date: 2026-11-06
Scope: All PULSE modules, services, data models, infrastructure, research and delivery work

## 1. Purpose
Every meaningful event must retain its origin, rationale, impact, decision, implementation evidence, validation and follow-up. Conversation history is an input channel, not the permanent system of record.

## 2. Event definition
An event is any meaningful occurrence that may change project requirements, design, code, data, security posture, delivery status or operational understanding. Examples: requirements, proposals, decisions, bugs, audit findings, research findings, implementation changes, test results, incidents, releases, rejected proposals and deprecations. Routine discussion that changes no project understanding may be omitted; when uncertain, register it.

## 3. Event identifiers and records
Use immutable IDs PULSE-EVT-000001, incrementing globally. Never reuse an ID. Each event has an individual Markdown record in docs/governance/events/ and one index row in MASTER_EVENT_REGISTER.md.

Required metadata: ID, title, category, status, dates, origin/source and original request reference, affected modules/requirements/dependencies, problem/opportunity, impact/risk, options and proposed approach, decision owner and approval evidence, branch/PR/commits/changed paths, validation plan and actual results, documentation updates, unresolved items, next action, related/superseding events.

Do not invent missing dates, approvals, test results or source content. Use Unknown, Not yet assessed or Pending.

## 4. Lifecycle
CAPTURED → TRIAGED → PROPOSED → APPROVED → IMPLEMENTING → IN_REVIEW → VALIDATED → CLOSED.
Alternative states: REJECTED, DEFERRED, BLOCKED, SUPERSEDED.

A proposal is not approved merely because it was discussed or implemented in a prototype. Approval must be explicit and attributable. A CI pass validates only the checks that actually ran.

## 5. Mandatory workflow
1. Register event and preserve source wording/reference.
2. Classify category, module, priority and status.
3. Search existing requirements, events and decisions for duplicates/conflicts.
4. Identify affected dependencies, data, APIs, screens, roles and workflows.
5. Record impact, risk, alternatives and proposed solution.
6. Obtain and record approval where required.
7. Implement on an appropriate branch; link substantive commits/PRs to event ID.
8. Add/update tests and record actual outcomes, including failures.
9. Update specifications, architecture, traceability and open issues.
10. Close only when acceptance criteria and approvals are met; otherwise record blockers and next action.

For documentation-only events, code/test steps may be marked not applicable with a reason.

## 6. Change classes
- Requirement: acceptance criteria and traceability entry.
- Architecture/data/security: ADR, impact/threat review and approval. Database DDL also requires inspected target environment, reviewed migration and rollback/recovery plan.
- Code/bug fix: linked event, tests and PR review.
- Research: source references, date, findings, limitations and recommendation.
- Incident: timeline, impact, containment, root cause, recovery and preventive actions.
- Release: release record, included events/commits, CI evidence, migration/deployment status and rollback plan.
- Rejected/deferred: retain rationale and reconsideration condition.

## 7. Immutability
Do not silently rewrite history. Correct an event with a dated amendment or create a superseding event and link both. Preserve rejected options and prior decisions. Never delete an event to conceal an error.

## 8. Sources of truth
- Git commits and PRs: code history and review evidence.
- Event records/register: event lifecycle and cross-linking.
- Requirement traceability: requirement-to-design/code/test coverage.
- ADR log: architectural decisions.
- Test evidence register: test execution evidence.
- Module specifications: current intended behavior, with change history links.
- Conversations: source material only unless explicitly archived as an event source.

Resolve conflicts explicitly; do not silently choose one source.

## 9. Definition of done
CLOSED only when outcome is clear, acceptance criteria are met, implementation evidence is linked, required tests pass, affected documents are updated, approval is recorded and no untracked follow-up remains. Deferred work must state dependency and revisit condition.

## 10. Security and privacy
Never store secrets, credentials, access tokens, production student PII, medical data or private parent/student communications in event records. Use synthetic identifiers and approved secure systems. Redact logs.

## 11. Backfill
Historical backfill is separate. Distinguish verified facts from inferred chronology. Link commits/PRs where available. Mark conversation-only decisions with source references and verification status. Do not claim complete historical coverage until audited.

## 12. Governance changes
Changes to this protocol require a new event and versioned amendment. This protocol does not itself grant product, security or release approval authority.
