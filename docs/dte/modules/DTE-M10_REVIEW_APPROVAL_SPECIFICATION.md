# DTE-M10 — Review, Correction & Approval Specification

- Document ID: PULSE-DTE-M10
- Version: 0.2.0
- Status: Draft — Phase 1 rewrite; pending review
- Phase: Current — offline tagging framework and operating management
- Last updated: 2026-11-06
- Implementation authorization: Not granted

## 1. Purpose

M10 governs human review, correction, adjudication and approval for the Phase 1 institution-approved framework and offline tagging process. It separates technical validation from operational checking and academic approval, preserves review evidence, and ensures decisions apply to identifiable versions.

M10 is a workflow/governance capability. It does not determine academic taxonomy, perform offline tagging, or create question records.

## 2. Phase 1 scope

### In scope
Subject to product-owner and operations confirmation:
- Academic review of a configured framework representation before activation.
- Checking of completed offline work packages, if software-managed intake/review is confirmed.
- Correction requests, resubmission and review history.
- Escalation and resolution of unmatched or ambiguous values.
- Version-specific approval/rejection decisions and evidence.
- Reviewer assignment/queues only if explicitly selected.
- Role-scoped access and separation-of-duties controls.

### Out of scope
M10 MUST NOT implement:
- Digital question inventory, question-content records or upload/OCR.
- Digital question-to-tag mapping review or digital tagging submissions.
- Question identity, version or placement approval.
- Review of uploaded question documents or OCR results.
- AI-generated academic tags or AI approval.
- Student evidence, attendance, assignments, attempts or performance review.
- Test delivery/scoring or difficulty/DRE approval.
- Automatic academic approval based on validation, receipt, queue completion or administrator status.

Legacy review categories such as digital mappings, archetypes, question types, pedagogical metadata, PYQ provenance and digital bulk batches are deferred to later-phase reassessment.

## 3. Authority and governing principles

1. Institution-designated academic authority owns academic interpretation and approval.
2. DTE records and enforces authorized decisions; it does not invent or prescribe academic categories.
3. Technical validation, operational checking and academic approval are distinct outcomes.
4. Unknown, deprecated or disputed values are escalated; they are never silently substituted or auto-created.
5. Every decision identifies the exact framework version and, where applicable, template version and work-package submission revision.
6. No implicit approval is permitted.
7. Corrections preserve prior submissions, reviewer comments and decision history.
8. Role combinations and separation-of-duties policy require institutional approval.

## 4. Reviewable items

| Item | Review purpose | Decision authority | Applicability |
|---|---|---|---|
| Framework version | Verify faithful representation of institution-approved definitions | Academic Framework Owner/Approver | Phase 1 |
| Offline work package | Check compliance with approved framework and instructions | Checker; academic reviewer for disputes | Conditional |
| Exception | Decide unmatched/ambiguous academic value | Authorized academic authority | Conditional |
| Template/instruction revision | Verify operational and academic consistency | Operations owner and academic authority | Conditional |
| Digital question mapping | Review digital mapping revision | Later-phase authority | Deferred |
| Uploaded question content | Review ingested content | Later-phase authority | Deferred |

Product owner must confirm which conditional item types require software-managed review.

## 5. Roles and responsibilities

| Role | Proposed responsibility | Boundary |
|---|---|---|
| Academic Framework Owner | Own academic definitions and decide disputed interpretations | Admin privilege alone does not confer authority |
| Framework Administrator | Encode approved definitions and prepare versions for review | Cannot self-authorize academic meaning unless delegated |
| Tagging Coordinator | Receive and route work packages | Receipt is not approval |
| Tagger | Complete offline work and respond to corrections | Cannot self-approve where prohibited |
| Checker | Check completeness and compliance with instructions | Check-pass is not automatically academic approval |
| Academic Reviewer/Approver | Resolve academic exceptions and approve within delegated scope | Cannot act outside assigned authority |
| DTE Administrator | Manage technical access/configuration | No implied academic authority |
| Auditor | View permitted review evidence | No modification/approval rights |

These are logical roles, not a final account-role design. A person may hold multiple roles only if institutional policy permits.

## 6. Status dimensions

Do not collapse these into one status:
- Operational work status: Assigned, In Progress, Submitted, Closed (candidate values).
- Technical validation: Not Run, Passed, Failed, Passed with Warnings.
- Review: Not Required, Pending, In Review, Returned, Approved, Rejected, Withdrawn.
- Exception: Open, Assigned, Resolved, Not Accepted, Closed.
- Framework lifecycle: Draft, Under Review, Approved, Active, Retired/Superseded.

These are candidate values, not an approved state machine. The shared workflow catalogue must define transitions, guards, actors, reversibility and side effects before implementation.

## 7. Framework review workflow

1. Framework Administrator prepares a draft from institution-supplied approved material.
2. Structural validation checks identifiers, references and configured constraints.
3. Draft is submitted with its exact version and source/approval reference.
4. Authorized academic reviewer checks fidelity to the institution's decision.
5. Reviewer records Approve, Return for Correction or Reject, with reason/evidence as required.
6. Corrections create a traceable new revision; submitted snapshot remains available.
7. Only the separately authorized framework lifecycle action may activate the approved version.
8. Approval evidence and active version remain reconstructable.

M10 does not author academic definitions on behalf of the institution.

## 8. Offline work-package review

This workflow applies only if product owner confirms completed-sheet intake and software-managed review:
1. Coordinator records receipt against the work-package ID.
2. Technical intake validation runs independently and records its result.
3. Failed submissions are returned or quarantined; they cannot be approved.
4. Valid submissions enter checking.
5. Checker compares work with the framework/template versions pinned to the package.
6. Checker passes, returns for correction or raises an academic exception.
7. Academic Reviewer adjudicates disputed/unmatched interpretations.
8. Correction request identifies affected locator/row/field and reason.
9. Resubmission is a new identifiable revision linked to the prior submission.
10. Authorized approver records the final decision under the approved separation-of-duties policy.
11. Approved work is eligible for handoff only after required checks/exceptions are resolved.

A checker pass is not academic approval unless that authority is explicitly delegated.

## 9. Exception handling

Each exception should retain an identifier, category, work-package/external locator where relevant, framework/template version, reported issue/value, reporter, timestamp, evidence, assigned authority, decision, reason and resolver.

If no approved value fits, M10 routes the issue to an authorized academic decision-maker. It MUST NOT create a category or alter the framework automatically. An approved framework change follows the framework version lifecycle and does not silently rewrite active work packages.

## 10. Actions and decision semantics

| Action | Required controls |
|---|---|
| Approve | Authorized role, exact revision, actor and timestamp |
| Return for Correction | Specific defect, reason and requested action |
| Request Clarification | Question/request and response tracking |
| Reject | Explicit reason and authority |
| Reassign | Previous/new reviewer, actor and reason |
| Withdraw | Authorized actor, reason and policy guard |
| Resolve Exception | Decision, evidence and authorized resolver |

“Approve” is not synonymous with technically valid, checked, received or closed.

## 11. Correction and re-review

- Correction links to the review event that requested it.
- Prior submission and comments remain available to authorized users.
- Resubmission is distinguishable and linked to the previous revision.
- Every review identifies the exact revision under consideration.
- Changes after submission invalidate the current review snapshot or create a new revision.
- Material post-approval changes trigger re-review according to approved policy.
- Framework changes do not silently reinterpret packages pinned to older versions.
- Institution must decide whether active packages continue, pause or are reissued after framework change.

## 12. Assignment and queues

If assignment is approved for Phase 1, implement only selected modes. Candidate modes: coordinator assignment, role/team queue with authorized claim, or direct assignment by authorized coordinator. Round-robin, workload-aware assignment and automatic SLA escalation are not baseline requirements.

Queue access is tenant-, role-, scope- and assignment-restricted. Reassignment requires authorization and a reason. Guessing an item identifier must not grant access.

## 13. Evidence, comments and audit

Preserve as applicable:
- Review event and item identifiers.
- Exact framework/template version and work-package submission revision.
- Actor identity and role context.
- Action, timestamp, reason and comments.
- Validation result reference/snapshot.
- Exception and resolution references.
- Previous/resulting status.
- Assignment history and approval authority reference.

Comment visibility is permission-controlled. Internal notes are not exposed to submitters unless policy permits. Exports are permission-controlled and audited. Retention periods are defined by the approved retention policy, not invented here.

## 14. Security and integrity

1. Enforce authorization server-side for every review action.
2. Scope review access by tenant and resource.
3. Client-side hidden controls are not authorization.
4. Protect against duplicate approval actions.
5. Detect concurrent decisions on the same revision.
6. Protect submitted snapshots and audit records from unauthorized changes.
7. Stale revisions require explicit resolution; they cannot be silently approved.
8. Any future emergency override requires dedicated permission, reason and immutable audit evidence.
9. Cross-tenant review access is prohibited.
10. Review exports/evidence follow data-access and licensing policy.

## 15. Notifications and reporting

Notifications for submission, assignment, return, clarification, decision and overdue review may be required; channels and escalation rules remain open. No fixed SLA, automatic rejection or automatic approval is defined.

If reporting is confirmed, M10 may expose pending reviews by queue/age, correction rounds, outcomes by item/framework version, open exceptions and turnaround time. M10 owns review-event facts, not broader productivity or academic coverage metric definitions.

## 16. Acceptance criteria

| ID | Acceptance criterion |
|---|---|
| M10-AC-001 | Validation, checking and academic approval are distinct outcomes. |
| M10-AC-002 | Each decision identifies exact revision and framework/template version. |
| M10-AC-003 | Unauthorized users cannot approve, reject, reassign or resolve exceptions. |
| M10-AC-004 | Separation-of-duties rules are enforced server-side. |
| M10-AC-005 | Return-for-correction provides actionable details and preserves prior evidence. |
| M10-AC-006 | Resubmission is a new identifiable revision linked to correction. |
| M10-AC-007 | Unknown/ambiguous values can be escalated without auto-creation or substitution. |
| M10-AC-008 | Framework changes do not silently rewrite version-pinned work. |
| M10-AC-009 | Decisions, comments and assignment changes are auditable. |
| M10-AC-010 | Evidence visibility respects tenant/resource permissions. |
| M10-AC-011 | Stale/concurrent revisions cannot be silently approved. |
| M10-AC-012 | Approval does not activate a framework unless separately authorized lifecycle policy says so. |
| M10-AC-013 | Phase 1 review requires no digital question record or question-content upload. |
| M10-AC-014 | Student Tracking, test and DRE workflows remain independent of DTE review completion. |

## 17. Dependencies and boundaries

- M04 owns framework definition/configuration; M10 governs review decisions.
- M11/shared version capability owns version/history semantics; M10 references revisions and emits decisions, not a competing version authority.
- M13 owns validation rules/results; M10 consumes validation evidence.
- M01 may present summaries but does not own review states or metrics.
- Phase 1 Operating Model owns the end-to-end offline workflow; M10 specifies its review controls.
- Identity/authorization provides authenticated actors; M10 defines action-level authorization needs.
- Student Tracking owns student activity/evidence and must not depend on DTE review completion.

Digital inventory, digital Tagging Studio, mapping, PYQ, digital bulk tagging, AI and external-engine integrations are deferred.

## 18. Open decisions

| ID | Decision | Owner | Status |
|---|---|---|---|
| DTE-M10-OD-001 | Which Phase 1 items require review: framework, work package, exception, template? | Product + Academic Authority | Open |
| DTE-M10-OD-002 | Is completed-sheet intake and software-managed review required? | Product + Operations | Open |
| DTE-M10-OD-003 | Which roles may author, check, review, approve, reject and resolve? | Product + Academic Authority | Open |
| DTE-M10-OD-004 | Is self-checking/self-approval prohibited? | Academic Authority | Open |
| DTE-M10-OD-005 | Is framework approval separate from activation? | Product + Academic Authority | Open |
| DTE-M10-OD-006 | Which reviewer assignment mode is required, if any? | Operations | Open |
| DTE-M10-OD-007 | Are multiple reviewers required for high-impact framework decisions? | Academic Authority | Open |
| DTE-M10-OD-008 | What decision evidence is mandatory? | Academic Authority + Operations | Open |
| DTE-M10-OD-009 | What correction, dispute, escalation and overdue rules apply? | Operations | Open |
| DTE-M10-OD-010 | What comment visibility and retention policy applies? | Product + Security | Open |
| DTE-M10-OD-011 | Which review metrics are required now? | Product | Open |
| DTE-M10-OD-012 | What happens to active packages when their framework version is superseded? | Academic Authority + Operations | Open |

## 19. Implementation readiness

Before implementation, resolve applicable open decisions; approve roles/separation of duties; ratify state transitions; confirm whether completed sheets are ingested or reviewed outside DTE; define evidence, retention and notification requirements; trace requirements to UX/data/authorization/tests; and obtain explicit product, academic, operations and technical approval.

This draft authorizes no schema, API, UI, automation or production change.

## 20. Change history

| Version | Date | Status | Change |
|---|---|---|---|
| 0.1.0 | 2026-11-06 | Superseded Draft | Initial broad specification included future digital question-domain review categories |
| 0.2.0 | 2026-11-06 | Draft | Rewritten for Phase 1 offline framework/work-process governance; separated validation, checking, academic decisions, correction and activation; deferred digital question/mapping review |

## 21. Approval

- Product owner: Pending
- Academic authority: Pending
- Operations owner: Pending
- Architecture/security: Pending
- QA: Pending
- Implementation authorization: Not granted
