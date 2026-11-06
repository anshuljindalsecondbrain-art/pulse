# DTE-M02 — Question Inventory Specification

- Document ID: PULSE-DTE-M02
- Version: 0.1.0
- Status: Draft — Pending product review
- Parent register: docs/dte/DTE_MODULE_REGISTER.md
- Related module: DTE-M01 Dashboard
- Last updated: 2026-11-06

## 1. Purpose

Question Inventory is the searchable, permission-aware catalogue of logical questions and their available content versions that DTE can classify. It provides the controlled entry point into Tagging Studio and related DTE workflows.

The inventory is a discovery and work-management surface. It does not author question content, own exercise/test placement, or calculate difficulty.

## 2. Scope

### In scope
- Browse and search authorized question records.
- Filter by tenant, source, content scope, classification state and workflow state.
- Distinguish logical question identity from question version and placement/instance.
- Display compact question previews and metadata.
- Identify duplicate candidates and related question records.
- Select one or many records for permitted bulk workflows.
- Navigate to tagging, review, history and provenance views according to permission.
- Support large inventories through server-side query execution and pagination.

### Out of scope
- Editing question stem, options, answer, solution, diagrams or media.
- Creating books, tests, assignments, courses, exercises or question slots.
- Defining classification schemas or taxonomy nodes.
- Performing tagging or review decisions in the inventory list itself.
- Difficulty calculation or student performance analytics.

## 3. Core identity model

The inventory must preserve three distinct concepts:

### 3.1 Logical question
A stable identity representing the intellectual/content question across revisions. It is represented by a stable question identifier.

### 3.2 Question version
A specific revision of the question content at a point in time. It may include a particular stem, options, answer, solution, media set, language variant or other content fields. Classification work and external evaluations must be able to reference the exact version where required.

### 3.3 Placement / instance
A reference to where a question is used, such as an exercise, book, test, worksheet or assignment slot. A question can appear in multiple placements without creating a new logical question identity. Placement ownership belongs to the relevant content system; DTE consumes the reference.

The inventory must never silently treat these three identifiers as interchangeable.

## 4. Inventory record presentation

Each row or card should expose only fields authorized for the current user. Candidate fields:

- Stable question identifier or human-readable code.
- Compact question preview (subject to content permission).
- Current/latest version indicator.
- Version status and creation timestamp.
- Tenant/content ownership indicator.
- Source or collection reference.
- Question type, when assigned.
- Classification schema assignment and completeness status.
- Work status, review status and publication status as separate values.
- Assigned tagger/reviewer, where permitted.
- Validation warning/error count.
- Duplicate-candidate indicator.
- Last modified timestamp and actor, where permitted.

The UI must label whether a value refers to the logical question, a particular version, or a placement.

## 5. Search

Search must support the applicable indexed fields, subject to authorization:
- Question identifier/code.
- Full-text question content where indexed and permitted.
- Source/exam identifiers.
- Configured classification labels or stable IDs.
- Archetype identifier/title.
- Question type.
- Provenance fields such as exam, year, session/shift and question number.
- Approved metadata values.

Search requirements:
1. Search must be tenant- and permission-scoped on the server.
2. Search syntax and matching behaviour must be documented (exact, prefix, token, phrase and/or fuzzy).
3. Search must not expose restricted question text through snippets, counts or autocomplete.
4. Search results must identify the version or scope used for matching.
5. Search must support stable sorting and deterministic pagination.
6. Search failures must be distinguishable from an empty result set.

No specific search technology is mandated by this module document.

## 6. Filters and sorting

Candidate filters:
- Tenant/institute (only where multi-tenant access is explicitly granted).
- Question ownership or licensing scope.
- Source/content collection.
- Logical question or version state.
- Classification schema and schema version.
- Configured classification group/node.
- Question type.
- Pedagogical metadata.
- PYQ provenance.
- Tagging work status.
- Review status.
- Publication status.
- Completeness profile/result.
- Validation severity.
- Assignee/reviewer.
- Duplicate candidate state.
- Created/modified date range.

Sorting candidates:
- Recently modified.
- Oldest untouched.
- Identifier/code.
- Workflow priority.
- Validation severity.
- Source-specific order, if provided by the source system.

The final filter catalogue must be driven by configured fields and permissions. Do not hardcode the six-level academic taxonomy.

## 7. Views and saved queries

Potential views:
- All accessible questions.
- Untagged / not yet classified.
- Incomplete under selected completeness profile.
- In progress.
- Returned for correction.
- Submitted for review.
- Approved/published.
- Validation exceptions.
- Duplicate candidates.
- Recently updated.
- Assigned to me.

A saved view may store filter/sort definitions, but it must re-evaluate permissions when opened. A saved query must not preserve access that the user no longer has.

Whether users can create shared or private saved views is an open decision.

## 8. Selection and bulk entry points

- Support single-record selection and multi-selection.
- Selection must be cleared or revalidated when filters, tenant scope or permissions change.
- Bulk actions must be shown only when the user has permission.
- The inventory may launch a bulk workflow but must not bypass the Bulk Tagging Manager's validation, preview, confirmation and audit requirements.
- Large selections should use server-side selection tokens or equivalent safe mechanisms rather than sending an unbounded list of IDs from the browser.
- The UI must show the effective number of selected records and any excluded/ineligible records before proceeding.

## 9. Duplicate candidate handling

The inventory may display duplicate-candidate signals produced by a governed duplicate detection process.

Requirements:
- A candidate match is not proof that two records are identical.
- Show the basis/status of the duplicate signal where permitted.
- Do not automatically merge or delete records from the inventory.
- Preserve source provenance and existing mappings during any future merge workflow.
- Distinguish exact duplicates, near-duplicates, translated/adapted variants and reused placements where the detection model supports those distinctions.
- A duplicate decision must be auditable and must preserve redirects/identity references if records are merged.

The final duplicate scoring and merge policy is an open decision.

## 10. Question preview and navigation

- Provide a compact preview sufficient to identify the record.
- Respect permissions for answer, solution, source and licensed content.
- Open the exact question version selected by the user.
- Navigate to Tagging Studio with the question identity, exact version and selected schema context.
- Provide links to permitted version history, provenance, archetype links and relationship views.
- If the selected version is superseded, visibly identify that state and prevent accidental tagging of the wrong version according to the final lifecycle rules.

## 11. Lifecycle and eligibility

Inventory visibility and tagging eligibility are separate concepts.

The module must represent, at minimum, whether a record is:
- Available for tagging.
- Already being edited or claimed.
- In review.
- Published/approved for the relevant mapping context.
- Blocked by validation or configuration.
- Archived/inactive.
- Restricted due to ownership/licensing or user permission.

The authoritative state machine is defined by workflow and version-management specifications. This module consumes those states and must not invent parallel status rules.

## 12. Performance and scale

The design target includes inventories approaching 1,000,000 PCMB questions.

Requirements:
- Server-side pagination and filtering.
- Indexed search and filter dimensions.
- Avoid loading the entire inventory into the browser.
- Use stable cursors or deterministic offset pagination with documented consistency behaviour.
- Define query timeouts, maximum page size and export limits in technical specification.
- Use asynchronous jobs for large exports or bulk selections.
- Provide progress and failure reporting for long-running operations.
- Prevent N+1 query patterns when displaying classification and status summaries.
- Measure query plans against realistic tenant and data-volume distributions.

## 13. Security and data governance

- Enforce tenant and record-level access on the server for list, search, preview, export and detail requests.
- Apply content ownership, licensing and confidentiality rules.
- Do not leak inaccessible records through result counts, duplicate indicators, autocomplete or timing-sensitive error messages.
- Audit exports and sensitive bulk selection operations.
- Do not expose privileged service credentials in the client.
- Preserve question and version history; inventory actions must not perform destructive cascade deletion.
- Recheck authorization at action time, not only when the list is initially loaded.

## 14. UX states

Define and test:
- Initial load and subsequent page load.
- Empty inventory.
- No results for current filters.
- No matching search result.
- Search/index temporarily unavailable.
- Permission denied or access revoked.
- Question content unavailable while metadata remains visible.
- Version superseded or archived.
- Duplicate candidate found.
- Mixed eligibility in a bulk selection.
- Stale results after another user changes a record.
- Long-running export or bulk action in progress.
- Partial data failure (e.g., list loads but classification summary fails).

## 15. Acceptance criteria

1. Logical question, question version and placement references are distinct in data and UI.
2. Search and filters are enforced server-side within the user's authorized scope.
3. The inventory supports deterministic pagination without loading the complete dataset.
4. The user can identify the exact question version before opening Tagging Studio.
5. Classification and workflow statuses are displayed as separate dimensions.
6. Completeness is tied to an identified profile and version.
7. Duplicate candidates are warnings/signals and never trigger automatic merge or deletion.
8. Bulk actions respect permissions and route through governed bulk workflows.
9. Content, answer and solution visibility respects licensing and role permissions.
10. Saved views re-evaluate current permissions.
11. Counts and search snippets do not reveal inaccessible tenant records.
12. The inventory does not calculate difficulty or own content placement lifecycle.

## 16. Dependencies

- DTE-M01 Dashboard.
- Question identity and question-version source contract.
- Content source/placement reference contract.
- DTE-M03 Tagging Studio.
- DTE-M10 Review & Approval.
- DTE-M11 Version & History Manager.
- DTE-M12 Bulk Tagging Manager.
- DTE-M13 Validation & Quality Engine.
- Tenant and authorization services.

## 17. Open decisions

| Decision ID | Question | Status |
|---|---|---|
| DTE-M02-OD-001 | What is the canonical source of logical question and version records? | Open |
| DTE-M02-OD-002 | Which fields are searchable, and what exact/prefix/fuzzy semantics apply? | Open |
| DTE-M02-OD-003 | Which saved views are system-provided, user-private or tenant-shared? | Open |
| DTE-M02-OD-004 | What is the duplicate detection taxonomy, confidence model and adjudication workflow? | Open |
| DTE-M02-OD-005 | What are the maximum page size, export limits and pagination consistency guarantees? | Open |
| DTE-M02-OD-006 | Can users claim unassigned work, and what locking/lease behaviour applies? | Open |
| DTE-M02-OD-007 | Which question fields are visible to each role and licensing scope? | Open |
| DTE-M02-OD-008 | Can inventory filters span multiple schemas or only one active schema context? | Open |

## 18. Change history

| Version | Date | Status | Change |
|---|---|---|---|
| 0.1.0 | 2026-11-06 | Draft | Initial inventory specification |

## 19. Approval

- Product owner approval: Pending
- Technical review: Pending
- Implementation authorization: Not granted
