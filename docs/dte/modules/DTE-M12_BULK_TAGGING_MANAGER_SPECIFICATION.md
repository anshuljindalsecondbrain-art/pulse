# DTE-M12 — Bulk Tagging Manager Specification

- Document ID: PULSE-DTE-M12
- Version: 0.1.0
- Status: Draft — Pending product review
- Parent: docs/dte/DTE_MODULE_REGISTER.md
- Last updated: 2026-11-06

## 1. Purpose

Bulk Tagging Manager enables authorized users to apply, import, validate and review classification changes across many question records while preserving data integrity, tenant boundaries, version history and auditability.

Bulk operations must use the same business rules as single-record tagging. They must not provide a shortcut around validation, review, publication or authorization.

## 2. Scope

In scope:
- Bulk selection from Question Inventory.
- Batch assignment/removal of configured classification mappings.
- Bulk metadata, question type, archetype and provenance operations where permitted.
- Import and export of mapping data.
- Template generation based on schema version.
- Dry-run validation and impact preview.
- Asynchronous job execution and progress reporting.
- Partial failure handling and per-record error reports.
- Review/publication integration.
- Idempotency, retry and audit.

Out of scope:
- Bulk editing question stem/options/answer/solution content.
- Bulk modification of student evidence.
- Bulk difficulty scoring or DRE execution.
- Bypassing record-level permissions or workflow requirements.

## 3. Entry points and job types

Entry points may include:
- Multi-select from Question Inventory.
- Schema-aware import upload.
- Re-run or retry of a failed job.
- Approved migration/enrichment job initiated by an authorized system process.

Job types should be explicit, such as mapping assignment, mapping removal, metadata assignment, provenance import or schema migration. Each job type has its own validation and authorization policy.

## 4. Import formats and templates

Potential formats include CSV and XLSX; JSON/API-based imports may be supported for integrations. The final supported format set is an open decision.

Templates must:
- Identify schema ID and schema version.
- Identify required canonical IDs and permitted labels.
- Distinguish question ID from question-version ID.
- Specify relationship types and cardinality.
- Include provenance/source columns where required.
- Include a template version and instructions.
- Reject ambiguous display-label-only references unless a deterministic resolution policy exists.

Do not treat a template generated for one schema version as automatically compatible with another.

## 5. Bulk job lifecycle

Candidate lifecycle:
1. Created.
2. File/selection accepted.
3. Parsing.
4. Dry-run validation.
5. Awaiting user confirmation.
6. Queued.
7. Processing.
8. Completed.
9. Completed with errors.
10. Failed.
11. Cancel requested / cancelled.

The authoritative job state model must distinguish validation failure from processing failure and partial completion.

Before commit, show:
- Total input rows/selected records.
- Eligible records.
- Records with blocking errors.
- Records with warnings.
- Duplicate/conflict candidates.
- Expected creates, updates and removals.
- Schema/version context.
- Whether review or publication is required.

## 6. Validation and commit semantics

- Dry-run must not mutate governed mappings.
- Commit requires explicit confirmation for the validated job snapshot.
- Revalidate permissions, schema version and target revisions at commit time.
- Detect records changed since dry-run.
- Apply the same field, relationship and completeness rules as single-record workflows.
- Do not silently skip invalid rows; report each outcome.
- Define atomicity per record, batch or job. The default must not be assumed.
- Preserve successfully committed records and clearly report failures if partial success is supported.
- A retry must not duplicate already completed changes.

## 7. Concurrency and idempotency

- Use stable job and operation identifiers.
- Each row/operation should have an idempotency key or equivalent deduplication mechanism.
- Detect stale question/mapping/schema versions.
- Avoid blind retries of non-idempotent mutations.
- Record retry count and prior job references.
- Support cancellation only where safe; explain whether in-flight records may still complete.

## 8. Scale and background processing

- Process large batches asynchronously.
- Do not hold a browser request open for long-running imports.
- Use bounded chunks and controlled concurrency.
- Provide progress counts and estimated state, not fabricated completion percentages.
- Define file size, row count, concurrency and timeout limits in technical specification.
- Support resumable/retryable jobs where safe.
- Avoid loading a million-question inventory into the browser for selection.

## 9. Error reporting and reconciliation

Provide downloadable or viewable row-level results:
- Source row/record reference.
- Question and version IDs.
- Operation attempted.
- Success/failure/skipped status.
- Error code and human-readable explanation.
- Suggested remediation.
- Resulting mapping revision ID where successful.

A job summary must reconcile input count with success, failure, skipped and pending counts. Do not label a partially completed job as fully successful.

## 10. Review, approval and audit

- Bulk-created/changed mappings enter the configured review workflow.
- Bulk execution must not imply approval or publication.
- Audit job creator, approver, upload source, template/schema version, validation report, confirmation and per-record outcomes.
- Preserve the original input file or a secure immutable reference according to retention policy.
- Restrict sensitive import/export access.

## 11. Security

- Enforce tenant scope and per-record permissions.
- Revalidate authorization at execution time.
- Prevent cross-tenant IDs in imports.
- Scan uploaded files according to platform security policy.
- Limit formula execution and spreadsheet formula injection risks in exports.
- Protect source files and result reports.
- Audit all exports and high-volume operations.

## 12. Acceptance criteria

1. Bulk operations use the same validation and mapping rules as single-record tagging.
2. Dry-run causes no governed data mutation.
3. User sees a clear impact summary before commit.
4. Schema and question-version context are checked at execution.
5. Row-level outcomes reconcile to the total input.
6. Partial completion is explicit and recoverable.
7. Retries do not duplicate completed mutations.
8. Large jobs execute asynchronously with progress and failure reporting.
9. Review/publication gates are not bypassed.
10. Tenant and record-level authorization is enforced.
11. All bulk changes and exports are auditable.
12. No question-content authoring or difficulty calculation is included.

## 13. Dependencies

- M02 Question Inventory.
- M03 Tagging Studio.
- M04 Classification Configuration Studio.
- M05 Relationship Mapping Engine.
- M10 Review & Approval.
- M11 Version & History Manager.
- M13 Validation & Quality Engine.
- Tenant authorization, background job and file storage services.

## 14. Open decisions

| ID | Question | Status |
|---|---|---|
| DTE-M12-OD-001 | Which import/export formats are mandatory for first release? | Open |
| DTE-M12-OD-002 | What are file size, row count, chunk size and concurrency limits? | Open |
| DTE-M12-OD-003 | Is commit atomic per row, chunk or whole job? | Open |
| DTE-M12-OD-004 | Which operations require second-person approval before execution? | Open |
| DTE-M12-OD-005 | What is the retry, cancellation and rollback policy? | Open |
| DTE-M12-OD-006 | How long are source files and result reports retained? | Open |
| DTE-M12-OD-007 | How are schema-version changes between dry-run and commit handled? | Open |

## 15. Change history

| Version | Date | Status | Change |
|---|---|---|---|
| 0.1.0 | 2026-11-06 | Draft | Initial bulk tagging specification |

## 16. Approval

- Product owner: Pending
- Technical review: Pending
- Implementation authorization: Not granted