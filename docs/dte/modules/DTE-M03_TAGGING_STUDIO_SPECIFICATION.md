# DTE-M03 — Tagging Studio Specification

- Document ID: PULSE-DTE-M03
- Version: 0.1.0
- Status: Draft — Pending product review
- Parent register: docs/dte/DTE_MODULE_REGISTER.md
- Last updated: 2026-11-06

## 1. Purpose

Tagging Studio is the primary workbench for assigning, reviewing and maintaining classification relationships and configured metadata for a selected question or exact question version. It presents the question content alongside a schema-driven editor, validation feedback and workflow controls.

The Studio must render its classification controls from the active configuration. It must not assume a fixed academic hierarchy or hardcode Physics/JEE-specific fields.

## 2. Scope

In scope:
- Open a question and exact version from Question Inventory or an authorized workflow.
- Load the applicable classification schema and version.
- Edit permitted classification mappings and relationships.
- Assign question type, pedagogical metadata, archetypes and PYQ provenance through their owning managers/interfaces.
- Display completeness and validation results.
- Save draft changes, submit for review and navigate between eligible records.
- Preserve mapping revisions and protect against concurrent edits.
- Support desktop and mobile tagging workflows.

Out of scope:
- Authoring question stem/options/answer/solution/media.
- Creating or changing taxonomy definitions inside the tagging form.
- Reviewing/approving one's own work where separation of duties prohibits it.
- Difficulty calculation or DRE rule configuration.
- Student evidence, test delivery or content collection management.

## 3. Layout and information architecture

### Desktop three-column workspace

**Left panel — inventory and work navigation**
- Search and filters.
- Assigned/current work queue.
- Status and eligibility indicators.
- Previous/next navigation.
- Selection context and unsaved-work warning.

**Center panel — question preview**
- Question stem and supported mathematical notation.
- Images, diagrams and media.
- Options, answer and solution only where permitted.
- Question ID, exact version, source and placement references.
- Version status and change indicator.
- Expand/collapse controls for long content.

**Right panel — classification editor**
- Schema and schema-version context.
- Dynamically rendered classification groups and fields.
- Primary/secondary relationships where configured.
- Question type.
- Pedagogical metadata.
- Archetype links.
- PYQ provenance summary and entry point.
- Validation, completeness and workflow status.
- Save/submit controls.

The three-column design is the established desktop direction. Exact sizing, resizing and panel persistence remain UX decisions.

### Mobile progressive workflow

Use a staged sequence:
1. Inventory / select question.
2. Preview question and verify version.
3. Edit classification and metadata.
4. Review validation and save/submit.

Use sticky navigation where appropriate, searchable selectors, touch-sized controls and bottom sheets for long selection lists. Avoid horizontal overflow and dense three-column compression.

## 4. Schema-driven editor

The editor must obtain field and relationship definitions from the selected classification schema version.

For each configured field/group, support as applicable:
- Canonical field or node identifier.
- Tenant-specific display label.
- Description/help text and tagging guidance.
- Data type and allowed value source.
- Required/optional rule.
- Single or multiple selection cardinality.
- Parent/dependency constraints.
- Allowed relationship type.
- Active/inactive state.
- Ordering and grouping.
- Localization.
- Validation rules.

The UI must distinguish a classification node's canonical identity from its display label. Renaming a label must not silently change the identity of existing mappings.

The editor must support hierarchical and non-hierarchical configurations. It must not force all configured fields into a single tree.

## 5. Mapping interactions

Candidate interactions:
- Search and select a classification node.
- Add/remove a mapping.
- Mark primary or secondary where the schema permits.
- Add multiple concepts or cross-domain links.
- View node path/context and definition.
- View existing linked questions or related archetypes when permitted.
- Detect invalid, inactive or incompatible selections.
- Show whether a mapping is inherited, directly assigned or suggested, if those concepts are enabled by the data model.

The mapping model must support many-to-many relationships. Do not store secondary concepts as an unvalidated array embedded in the question record.

## 6. Save and workflow behaviour

The final workflow state machine is owned by the workflow and review specifications. The Studio must expose only actions allowed by the user's role and current record state.

Candidate actions:
- Save draft.
- Validate.
- Submit for review.
- Save and next.
- Next / previous.
- Discard local changes.
- Reopen a returned item for correction.
- Compare current draft with published mapping revision.

Requirements:
- Autosave may be used for local draft protection, but its semantics and persistence must be explicit.
- Provide an explicit save action and clear saved/unsaved indicator.
- Do not imply a change is published merely because it is saved.
- Submission must validate required fields and capture the submitted revision.
- Published mappings must be revised through a new revision, not overwritten in place.
- Protect against loss of work when navigating away, refreshing or losing connectivity.
- Idempotency is required for repeated save/submit requests where feasible.

## 7. Concurrency and locking

The Studio must detect when another user has changed the same mapping or question version.

Possible approaches include optimistic concurrency using revision/version tokens, or an explicit editing lease. The final approach is an open decision.

At minimum:
- Include the revision token loaded by the editor in write requests.
- Reject stale writes rather than silently overwriting newer data.
- Show the conflicting fields/revisions and provide reload/compare guidance.
- Do not silently merge conflicting classification selections.
- Release any editing lease on completion, timeout or authorized cancellation if leases are adopted.

## 8. Validation and completeness presentation

The Studio consumes validation and completeness results from DTE-M13.

Show:
- Blocking errors.
- Warnings.
- Informational guidance.
- Missing required fields.
- Invalid/inactive references.
- Relationship conflicts.
- Current completeness profile and version.
- Completion result and remaining requirements.

Do not hardcode completeness as a count of hierarchy levels. A schema may have multiple profiles or different requirements by workflow/use case.

The user must be able to distinguish “valid to save as draft” from “valid to submit” and “approved/published”.

## 9. Keyboard and productivity interactions

Candidate productivity features:
- Keyboard navigation across fields and records.
- Searchable dropdowns/selectors.
- Quick selection of frequently used nodes.
- Save and next.
- Previous/next eligible question.
- Undo/redo for unsaved local edits where technically safe.
- Duplicate warning visibility.
- Shortcuts displayed in the UI and discoverable.
- Focus management after adding/removing a mapping.

Shortcuts must not conflict with browser, assistive technology or mathematical editor controls.

## 10. Question content and media rendering

- Render mathematical notation using the application's supported math renderer.
- Preserve image aspect ratio and allow permitted zoom/inspection.
- Clearly distinguish question content from DTE classification controls.
- Show unavailable or unsupported media with an explicit placeholder/error.
- Never mutate question content from a tagging interaction.
- Ensure the selected version is visible at all times.

## 11. Security and permissions

- Enforce all read/write permissions server-side.
- Hide unavailable actions in the UI but do not rely on hiding as authorization.
- Respect question ownership, licensing and tenant scope.
- Restrict answer/solution visibility according to the source permission model.
- Record all mapping mutations and workflow transitions in audit history.
- Recheck permission and revision state at commit time.
- Prevent cross-tenant node selection and mapping creation.

## 12. UX states and failure handling

Define and test:
- Loading question/version/schema.
- Missing or retired schema version.
- No applicable schema assignment.
- Read-only question or mapping.
- Empty classification fields.
- Validation pending/running.
- Validation errors and warnings.
- Save success/failure.
- Submit success/failure.
- Network interruption and recovery.
- Stale revision/concurrent edit.
- Question version superseded during editing.
- Permission revoked while open.
- No next/previous eligible item.
- Media or math rendering failure.
- Unsaved changes on navigation.

## 13. Acceptance criteria

1. The editor renders from configuration and supports hierarchical and non-hierarchical classification.
2. The exact question version and schema version remain visible in the workspace.
3. Canonical node IDs are distinct from tenant display labels.
4. Many-to-many and typed relationships are supported where configured.
5. Question type, archetype, pedagogical metadata and PYQ provenance remain separate governed concepts.
6. Validation and completeness are consumed from the authoritative quality engine/profile.
7. Saving a draft does not imply approval or publication.
8. Published mappings are revised without destroying prior revisions.
9. Stale concurrent writes are detected and not silently overwritten.
10. User permissions are enforced server-side for every mutation.
11. Desktop three-column and mobile progressive workflows are usable and accessible.
12. No difficulty score is calculated or owned by Tagging Studio.

## 14. Dependencies

- DTE-M02 Question Inventory.
- DTE-M04 Classification Configuration Studio.
- DTE-M05 Relationship Mapping Engine.
- DTE-M06 Archetype Management.
- DTE-M07 Question Type Manager.
- DTE-M08 Pedagogical Metadata Manager.
- DTE-M09 PYQ Provenance Manager.
- DTE-M10 Review & Approval.
- DTE-M11 Version & History Manager.
- DTE-M13 Validation & Quality Engine.
- Tenant authorization and question-content source contracts.

## 15. Open decisions

| Decision ID | Question | Status |
|---|---|---|
| DTE-M03-OD-001 | Is autosave enabled by default, and does it persist drafts remotely or locally first? | Open |
| DTE-M03-OD-002 | What is the concurrency strategy: optimistic versioning, editing lease or hybrid? | Open |
| DTE-M03-OD-003 | Can one tagging session cover multiple question versions or only one exact version? | Open |
| DTE-M03-OD-004 | Which fields are editable by each role and at each workflow state? | Open |
| DTE-M03-OD-005 | Which keyboard shortcuts and batch selection interactions are required? | Open |
| DTE-M03-OD-006 | How are schema upgrades handled for an in-progress tagging session? | Open |
| DTE-M03-OD-007 | Which question-content fields may be displayed to taggers and reviewers? | Open |
| DTE-M03-OD-008 | Is save-and-next allowed when warnings remain, and under what policy? | Open |

## 16. Change history

| Version | Date | Status | Change |
|---|---|---|---|
| 0.1.0 | 2026-11-06 | Draft | Initial Tagging Studio specification |

## 17. Approval

- Product owner approval: Pending
- Technical review: Pending
- Implementation authorization: Not granted
