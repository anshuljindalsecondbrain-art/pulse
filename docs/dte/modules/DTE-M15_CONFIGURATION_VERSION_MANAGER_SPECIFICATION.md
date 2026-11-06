# DTE-M15 — Configuration Version Manager Specification

- Document ID: PULSE-DTE-M15
- Version: 0.1.0
- Status: Draft — Pending product review
- Parent: docs/dte/DTE_MODULE_REGISTER.md
- Last updated: 2026-11-06

## Governing scope clarification — classification management software

DTE manages institution-defined academic classification and tagging structures. It does not design, prescribe, generate or impose chapter-wise syllabus bifurcation, curriculum structure or a universal academic hierarchy. Institutions define their own categories and terminology; DTE provides software to configure, record, map, search, validate, review, version, govern and report on those existing structures. Academic terms such as subject, chapter, topic and concept are examples of institution-managed data, not mandatory DTE levels or a curriculum-design function.

## 1. Purpose

Configuration Version Manager governs the lifecycle of classification schemas and related configuration profiles. It coordinates drafting, validation, review, approval, publication, supersession and retirement while preserving the historical meaning of mappings created against earlier versions.

M15 is the lifecycle authority for configuration versions. M04 provides the configuration authoring experience; M11 provides the shared revision and audit history capability.

## 2. Scope

In scope:
- Manage schema identity and immutable schema versions.
- Coordinate draft, review, approval, publication and retirement.
- Validate compatibility before publication.
- Define effective dates and active version selection.
- Assess impact on existing question mappings.
- Plan and record mapping migrations where necessary.
- Support rollback through a new version, not history rewriting.
- Notify dependent DTE modules and consumers of version changes.
- Preserve old versions for historical interpretation.

Out of scope:
- Editing schema fields/nodes (M04).
- Direct question mapping (M05).
- Owning review assignment mechanics (M10).
- Rewriting historical student evidence or downstream analytics.
- Difficulty configuration or DRE rules.

## 3. Configuration identity and version model

Distinguish:
- Schema identity: stable logical schema.
- Schema version: immutable definition snapshot.
- Draft revision: mutable working copy before publication.
- Published/active version: effective version for new work in a defined scope.
- Superseded version: previously active version retained for history.
- Retired schema/version: no longer available for new assignments under policy.

A published version must be immutable. Any change creates a new draft version. Semantic version numbering may be used for human communication, but stable machine identifiers are also required.

## 4. Lifecycle

Candidate lifecycle:
1. Draft created.
2. Configuration validated.
3. Submitted for review.
4. Approved.
5. Scheduled or immediately published.
6. Active.
7. Superseded by a later version.
8. Retired.

A draft may be rejected, withdrawn or returned for changes. Exact transitions and guards must be aligned with M10. Approval and publication may be separate events.

## 5. Publication controls

Before publication, verify:
- Structural schema validity.
- Relationship type validity.
- Completeness profile validity.
- Required labels/localization.
- Tenant/global governance constraints.
- Compatibility with active mappings.
- Deprecation/retirement plan for referenced nodes.
- Effective date and active-scope rules.
- Required review and approval events.

Publication must identify the exact approved version. Failed publication must leave the prior active version intact.

## 6. Impact analysis and migration

For each proposed version, calculate and report:
- Added, changed, deprecated and removed nodes/fields.
- Changed relationship definitions.
- Changed required/optional rules.
- Changed completeness profiles.
- Existing mappings affected.
- Records that remain valid, require warning, become invalid or require migration.
- Downstream consumer impact.

Do not automatically reinterpret historical mappings against a new schema. A migration must be explicit, versioned, auditable and tested. Existing mapping snapshots must retain the schema version originally used.

## 7. Active version resolution

The system must define how a tagging session determines its applicable schema version:
- Tenant/scope assignment.
- Effective date/time.
- Workflow state.
- Existing in-progress session policy.
- Explicit version pinning where required.

A user must not unknowingly edit against a different schema version after a page refresh or deployment. In-progress work should either remain pinned to its loaded version or be explicitly prompted to migrate/reload.

## 8. Retirement and rollback

- Retiring a schema version must not delete historical mappings.
- New tagging may be blocked against retired versions.
- Read-only historical display remains available subject to permission.
- Rollback means publishing a new version that restores prior configuration semantics.
- A rollback must not erase the intervening version or its audit trail.
- Consumer notifications and compatibility checks apply to rollback as to any publication.

## 9. UX requirements

Provide:
- Schema/version list and status.
- Draft editor entry to M04.
- Version comparison.
- Validation report.
- Mapping impact analysis.
- Review/approval status.
- Effective date and scope.
- Publish/schedule/retire controls by permission.
- Migration plan and execution status.
- Change history and consumer notifications.

## 10. Security and audit

- Only authorized configuration administrators can manage lifecycle.
- Tenant administrators cannot publish global schemas without explicit global permission.
- Record every transition, approval, publication, schedule change, retirement and migration.
- Preserve actor, reason, timestamp and exact version IDs.
- Enforce tenant boundaries for version visibility and activation.
- Prevent a client from selecting an unauthorized schema version by changing request parameters.

## 11. Acceptance criteria

1. Published schema versions are immutable.
2. New changes create a new version.
3. Publication is gated by validation and required review.
4. The exact approved version is the one published.
5. Failed publication does not deactivate the previous active version.
6. Impact analysis identifies affected existing mappings.
7. Historical mappings retain their original schema-version reference.
8. Migration is explicit and auditable.
9. In-progress tagging sessions handle version changes predictably.
10. Retirement preserves historical reads.
11. Rollback creates a new version rather than rewriting history.
12. Tenant/global governance is enforced.

## 12. Dependencies

- M04 Classification Configuration Studio.
- M10 Review & Approval.
- M11 Version & History Manager.
- M13 Validation & Quality Engine.
- Tenant governance and event notification services.

## 13. Open decisions

| ID | Question | Status |
|---|---|---|
| DTE-M15-OD-001 | What version numbering convention is used for schema versions? | Open |
| DTE-M15-OD-002 | Can a tenant maintain multiple active schemas for different scopes? | Open |
| DTE-M15-OD-003 | How are active versions selected for existing/in-progress work? | Open |
| DTE-M15-OD-004 | Which schema changes require migration versus compatibility warnings? | Open |
| DTE-M15-OD-005 | Can publication be scheduled for a future effective date? | Open |
| DTE-M15-OD-006 | Who can approve/publish/retire global versus tenant schemas? | Open |
| DTE-M15-OD-007 | What is the required consumer notification and acknowledgement protocol? | Open |

## 14. Change history

| Version | Date | Status | Change |
|---|---|---|---|
| 0.1.0 | 2026-11-06 | Draft | Initial configuration version manager specification |

## 15. Approval

- Product owner: Pending
- Technical review: Pending
- Implementation authorization: Not granted