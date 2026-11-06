# DTE-M10 — Review & Approval Specification

- Document ID: PULSE-DTE-M10
- Version: 0.1.0
- Status: Draft — Pending product review
- Parent: docs/dte/DTE_MODULE_REGISTER.md
- Last updated: 2026-11-06

## Governing scope clarification — classification management software

DTE manages institution-defined academic classification and tagging structures. It does not design, prescribe, generate or impose chapter-wise syllabus bifurcation, curriculum structure or a universal academic hierarchy. Institutions define their own categories and terminology; DTE provides software to configure, record, map, search, validate, review, version, govern and report on those existing structures. Academic terms such as subject, chapter, topic and concept are examples of institution-managed data, not mandatory DTE levels or a curriculum-design function.

## 1. Purpose

Review & Approval governs the human quality-control process for classification mappings and other governed DTE records. It separates the act of editing from the act of reviewing and, where configured, approving and publishing.

Saving a draft, submitting it for review, approving it and publishing it are distinct events and must not be represented as one generic “complete” state.

## 2. Scope

In scope:
- Submission of mapping/configuration/archetype/provenance work for review where required.
- Reviewer assignment and review queues.
- Approve, reject/return for changes and request clarification.
- Reviewer comments and evidence references.
- Separation-of-duties controls.
- Re-review after material changes.
- Review history and audit.
- Role-aware status visibility.

Out of scope:
- Defining the actual classification mapping editor.
- Defining schema configuration itself.
- Calculating completeness or validation rules (M13).
- Owning general user identity administration.
- Student assessment or DRE evaluation.

## 3. Governed record categories

The workflow may apply to:
- Question classification mapping revisions.
- Classification schema versions.
- Archetype records/revisions.
- Question type definitions.
- Pedagogical metadata definitions.
- PYQ provenance records.
- Bulk tagging batches or imported mapping sets.

Each record category may have a different review policy. Do not assume one universal approval sequence for every record.

## 4. Candidate lifecycle

A configurable workflow may include:
1. Draft.
2. Submitted for review.
3. Assigned / in review.
4. Returned for changes.
5. Resubmitted.
6. Approved.
7. Published / active.
8. Rejected or withdrawn.
9. Superseded.

The final state machine must specify allowed transitions, actors, guards, terminal states and whether approval and publication are separate. Status dimensions must remain distinct from work assignment and completeness.

## 5. Assignment and queues

Candidate assignment modes:
- Explicit reviewer assignment.
- Queue-based claim.
- Round-robin or workload-aware assignment.
- Role/team queue.

No assignment algorithm is selected by this draft. The system must prevent unauthorized self-assignment or reviewer reassignment. Reassignment must capture actor, reason and previous/new reviewer.

Queue filters may include record type, tenant/scope, schema version, submission date, submitter, priority, validation severity and current reviewer.

## 6. Review actions

Authorized reviewer actions may include:
- Approve.
- Return for correction with required comments.
- Reject with reason.
- Request clarification/evidence.
- Reassign where permitted.
- Withdraw or cancel review only under defined policy.

Review action must reference the exact submitted revision. If the author edits the record after submission, the submitted snapshot must remain identifiable and any new edit must create a new revision or return-to-draft transition.

## 7. Separation of duties

- The system should support policies preventing an author from approving their own work.
- High-impact schema or global reference changes may require more than one reviewer.
- Reviewer privileges must be scoped by tenant, record type and classification domain.
- Emergency override, if supported, requires explicit permission, reason and audit.
- Approval must not be inferred from administrator status alone.

The exact role matrix is an open decision.

## 8. Review evidence and comments

Each review event should capture:
- Record ID and exact revision.
- Reviewer identity and role context.
- Action and timestamp.
- Decision reason.
- Comments and requested corrections.
- Validation result snapshot.
- Relevant schema/configuration version.
- Attachments/evidence references where supported.

Comments may have visibility levels (author/reviewer/admin). Confidential internal notes must not be exposed to the submitter unless policy allows.

## 9. Publication boundary

Approval and publication are distinct where publication is configured separately.

- Approved records may await publication.
- Publication must use the exact approved revision.
- Any material edit after approval invalidates approval or requires a new review according to policy.
- Publication events must be auditable and idempotent.
- Consumers must be able to identify the published revision.
- A failed publication must not be shown as successful.

## 10. Re-review triggers

Potential triggers:
- Author changes submitted mapping.
- Schema version changes in a way that affects mapping validity.
- Validation rules change materially.
- Provenance evidence is disputed.
- Archetype/type/metadata definition is deprecated or materially revised.
- Bulk import produces changes after initial review.

Re-review rules must identify whether previous approval remains valid, is suspended or is superseded.

## 11. Security and audit

- Enforce reviewer authorization server-side.
- Prevent cross-tenant review access.
- Protect confidential reviewer notes.
- Record every transition and reassignment.
- Preserve submitted and reviewed snapshots.
- Do not allow silent changes to approved/published records.
- Export of review data must be permission-controlled and audited.

## 12. Acceptance criteria

1. Draft, submitted, in-review, approved and published states are distinguishable.
2. Review decisions reference an exact record revision.
3. Unauthorized users cannot approve or publish.
4. Separation-of-duties policies can prevent self-approval.
5. Return/reject actions capture reasons and comments.
6. Material post-submission changes cannot silently inherit approval.
7. Publication uses the approved revision and is independently auditable.
8. Reassignment and overrides are recorded.
9. Reviewer notes obey visibility permissions.
10. Review workflow can vary by governed record category.

## 13. Dependencies

- M03 Tagging Studio.
- M04 Configuration Studio.
- M06 Archetype Management.
- M07 Question Type Manager.
- M08 Pedagogical Metadata Manager.
- M09 PYQ Provenance Manager.
- M11 Version & History Manager.
- M13 Validation & Quality Engine.
- Identity and authorization services.

## 14. Open decisions

| ID | Question | Status |
|---|---|---|
| DTE-M10-OD-001 | Which record categories require mandatory review? | Open |
| DTE-M10-OD-002 | Is approval separate from publication for all categories or selected categories? | Open |
| DTE-M10-OD-003 | Which roles can author, review, approve and publish? | Open |
| DTE-M10-OD-004 | Is self-approval prohibited universally or configurable by risk level? | Open |
| DTE-M10-OD-005 | Which reviewer assignment modes are supported? | Open |
| DTE-M10-OD-006 | Are multi-reviewer approvals required for global schemas or high-impact changes? | Open |
| DTE-M10-OD-007 | What review SLA/overdue policy applies, if any? | Open |
| DTE-M10-OD-008 | What events invalidate or trigger re-review of prior approval? | Open |

## 15. Change history

| Version | Date | Status | Change |
|---|---|---|---|
| 0.1.0 | 2026-11-06 | Draft | Initial review and approval specification |

## 16. Approval

- Product owner: Pending
- Technical review: Pending
- Implementation authorization: Not granted