# DTE-M11 — Version & History Manager Specification

- Document ID: PULSE-DTE-M11
- Version: 0.1.0
- Status: Draft — Pending product review
- Parent: docs/dte/DTE_MODULE_REGISTER.md
- Last updated: 2026-11-06

## 1. Purpose

Version & History Manager preserves the evolution of DTE-governed records and makes historical states explainable. It ensures that published classification mappings, schema definitions and governed metadata are not silently overwritten and that a consumer can identify which version was effective at a given time.

## 2. Scope

In scope:
- Versioning of question classification mapping sets and governed configuration artifacts.
- Revision history and before/after comparison.
- Immutable published snapshots.
- Actor, timestamp, reason and workflow-event provenance.
- Supersession and rollback-by-new-revision patterns.
- Historical reconstruction.
- Version references for external consumers.
- Audit event integrity and retention policy integration.

Out of scope:
- Versioning the actual question content if owned by a separate question content service (DTE consumes its question_version_id).
- Student attempt history.
- Difficulty evaluation history owned by DRE.
- General database backup/restore operations.

## 3. Versioning concepts

Distinguish:
- Logical entity identity.
- Draft revision.
- Submitted revision snapshot.
- Approved revision.
- Published immutable version.
- Superseding revision.
- Source question content version.
- Classification schema version.
- Mapping revision/version.

These identifiers are not interchangeable. A mapping may refer to a specific question version and schema version while having its own independent revision history.

## 4. Revision rules

1. Drafts may be edited according to permission and concurrency policy.
2. Submission captures an identifiable snapshot.
3. Review decisions reference that exact snapshot.
4. Published versions are immutable.
5. A post-publication change creates a new revision.
6. Rollback is implemented as a new revision restoring prior values, not deletion or rewriting of history.
7. Superseded versions remain readable subject to authorization and retention.
8. A question content update does not silently rewrite its historical classification mapping.
9. A schema update does not silently reinterpret old mappings without a migration/resolution record.
10. All revisions identify the applicable schema and question content version.

## 5. History record requirements

Candidate event fields:
- Event/revision ID.
- Tenant/scope.
- Entity type and stable entity ID.
- Revision sequence or version identifier.
- Previous revision reference.
- Changed fields or structured diff.
- Before/after values where permitted.
- Actor and acting role.
- Action/event type.
- Timestamp.
- Reason/comment.
- Workflow/review reference.
- Question version and schema version references.
- Source (UI, import, AI accepted, migration, API).
- Correlation/idempotency identifier.

Sensitive content should be referenced rather than copied into audit payloads unless explicitly required and protected.

## 6. Comparison and reconstruction

Users with permission should be able to:
- Compare two mapping revisions.
- Identify added, removed and changed relationships.
- Compare schema versions.
- See who changed a record and why.
- Reconstruct the published mapping at a given revision/time.
- Identify whether a value was human-entered, imported, AI-suggested and accepted, or system-derived.

Historical display must use the labels and schema context effective at that time, while optionally showing current labels as a separate convenience.

## 7. Retention and integrity

- Audit history must be append-only at the application contract level.
- Unauthorized users cannot alter or delete history.
- Retention and archival policies must be explicit.
- Data correction must create a compensating event/revision.
- Referential integrity must be preserved for all referenced question, schema and mapping versions.
- No cascade deletion of history due to taxonomy retirement or tenant configuration changes.

## 8. Security

- Enforce tenant and entity permissions on history reads.
- Restrict sensitive before/after values.
- Audit administrative history exports.
- Protect event integrity and privileged maintenance paths.
- Ensure service credentials remain server-side.

## 9. Acceptance criteria

1. Published mapping/configuration versions cannot be edited in place.
2. Every revision identifies its logical entity and applicable question/schema versions.
3. Review decisions point to the exact submitted revision.
4. Rollback creates a new revision and preserves prior history.
5. Historical states can be reconstructed.
6. Before/after comparison is available to authorized roles.
7. AI/import/migration origin is traceable.
8. Tenant and field-level visibility rules are enforced.
9. Deactivation/retirement does not destroy history.
10. External consumers can reference stable version identifiers.

## 10. Dependencies

- M04 Classification Configuration Studio.
- M05 Relationship Mapping Engine.
- M06–M10 governed record managers and review workflow.
- M12 Bulk Tagging Manager.
- M13 Validation & Quality Engine.
- Audit/event infrastructure.

## 11. Open decisions

| ID | Question | Status |
|---|---|---|
| DTE-M11-OD-001 | What version identifier format is canonical: sequence, UUID, semantic version or combination? | Open |
| DTE-M11-OD-002 | Which fields require full before/after snapshots versus structured diffs? | Open |
| DTE-M11-OD-003 | What retention and archival periods apply to audit events and published mappings? | Open |
| DTE-M11-OD-004 | Can historical versions be exported, and which roles may do so? | Open |
| DTE-M11-OD-005 | What is the policy for schema migration and mapping reinterpretation? | Open |
| DTE-M11-OD-006 | Which events must be cryptographically tamper-evident? | Open |

## 12. Change history

| Version | Date | Status | Change |
|---|---|---|---|
| 0.1.0 | 2026-11-06 | Draft | Initial version and history specification |

## 13. Approval

- Product owner: Pending
- Technical review: Pending
- Implementation authorization: Not granted