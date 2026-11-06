# DTE-M16 — Historical Enrichment Interface Specification

- Document ID: PULSE-DTE-M16
- Version: 0.1.0
- Status: Draft — Integration contract only
- Parent: docs/dte/DTE_MODULE_REGISTER.md
- Last updated: 2026-11-06

## Governing scope clarification — classification management software

DTE manages institution-defined academic classification and tagging structures. It does not design, prescribe, generate or impose chapter-wise syllabus bifurcation, curriculum structure or a universal academic hierarchy. Institutions define their own categories and terminology; DTE provides software to configure, record, map, search, validate, review, version, govern and report on those existing structures. Academic terms such as subject, chapter, topic and concept are examples of institution-managed data, not mandatory DTE levels or a curriculum-design function.

## 1. Purpose

Historical Enrichment Interface exposes version-aware DTE classification changes to authorized downstream consumers so they can enrich or reinterpret historical records under their own governance. It is an integration boundary, not an implementation of Student Tracking or any student analytics system.

DTE owns classification definitions and question-to-classification mappings. The consuming system owns student assignment, attempt evidence and analytics.

## 2. Scope

In scope:
- Publish mapping-created, mapping-updated, mapping-published and schema-version events.
- Provide stable question, question-version, mapping-revision and schema-version references.
- Support idempotent event consumption and replay/reconciliation.
- Expose mapping snapshots or lookup APIs for authorized consumers.
- Report delivery/processing status where contractually required.
- Preserve historical mapping context.

Out of scope:
- Student records, attendance, homework, diary, assignment eligibility or parent notifications.
- Recalculating student performance or historical scores.
- Mutating original student attempt evidence.
- Defining the consumer's enrichment algorithm or user interface.

## 3. Ownership boundary

DTE owns:
- Classification schema and version.
- Classification node/relationship identity.
- Question-to-classification mapping revision.
- Publication state and change history.
- Provenance and DTE metadata.

Consumer owns:
- Student activity and evidence.
- Assignment/test/attempt context.
- Historical analytics and any interpretation logic.
- User-facing student/parent workflows.

A consumer must not write directly into DTE-owned mapping tables.

## 4. Event contract requirements

Candidate event envelope:
- event_id (stable unique ID).
- event_type.
- event_schema_version.
- occurred_at.
- tenant_id / authorized scope reference.
- question_id.
- question_version_id, when applicable.
- mapping_id / mapping_revision_id.
- classification_schema_id.
- classification_schema_version_id.
- publication_status.
- actor/source reference where permitted.
- correlation_id.
- idempotency key.

Payload may include a compact mapping snapshot or a secure lookup reference. The exact payload shape is an open contract decision.

Event types may include:
- mapping.created
- mapping.revised
- mapping.published
- mapping.superseded
- schema.version_published
- mapping.validation_changed

Only events relevant to the consumer should be subscribed to.

## 5. Historical interpretation rules

- Original student evidence remains immutable in the consuming system.
- Mapping changes are new DTE revisions; they do not rewrite old student events.
- Consumers must retain the mapping/schema version used for each enrichment result.
- A new question content version does not automatically inherit prior mapping validity.
- Consumer reprocessing must be an explicit, idempotent operation.
- If a mapping is corrected, consumers may receive a correction event and decide whether to recompute derived analytics.
- DTE must not claim that downstream analytics have been updated merely because an event was emitted.

## 6. Delivery and reliability

Contract must define:
- At-least-once or other delivery semantics.
- Ordering scope (per question, mapping or tenant).
- Retry/backoff and dead-letter handling.
- Idempotency strategy.
- Replay window and reconciliation process.
- Consumer acknowledgement and failure reporting.
- Event retention.
- Schema evolution and compatibility policy.

No delivery guarantee is selected by this draft.

## 7. Read API requirements

Authorized consumers may need to retrieve:
- Current published mapping.
- Mapping by exact revision ID.
- Mapping by question and exact question version.
- Schema/version metadata.
- Provenance and configured metadata references.
- Change history or event cursor.

All endpoints must enforce tenant and consumer authorization. A read API must not expose question content unless the consumer is separately authorized.

## 8. Security and privacy

- Authenticate each consumer and scope its access.
- Enforce tenant boundaries and minimum required data.
- Sign or otherwise authenticate event delivery where appropriate.
- Avoid embedding student data in DTE events; DTE does not own it.
- Protect event replay and lookup endpoints.
- Audit consumer registration, access and data exports.

## 9. Acceptance criteria

1. Events identify exact question/version and mapping/schema revision context.
2. Consumer ownership boundaries are explicit.
3. Original student evidence is never mutated by DTE.
4. Consumers can retrieve historical mapping revisions.
5. Event processing supports idempotency and reconciliation.
6. New question versions do not silently inherit old mapping validity.
7. Tenant and consumer authorization is enforced.
8. DTE does not implement student tracking or analytics.
9. Event delivery status is not misrepresented as downstream processing success.

## 10. Dependencies

- M05 Relationship Mapping Engine.
- M10 Review & Approval.
- M11 Version & History Manager.
- M15 Configuration Version Manager.
- External consumer identity/event infrastructure.

## 11. Open decisions

| ID | Question | Status |
|---|---|---|
| DTE-M16-OD-001 | Which consumer systems subscribe to enrichment events? | Open |
| DTE-M16-OD-002 | Is delivery at-least-once, ordered per question, or another model? | Open |
| DTE-M16-OD-003 | Is payload snapshot-based or reference-based? | Open |
| DTE-M16-OD-004 | What replay and reconciliation window is required? | Open |
| DTE-M16-OD-005 | Which mapping changes trigger consumer reprocessing recommendations? | Open |
| DTE-M16-OD-006 | How are event schema versions evolved compatibly? | Open |

## 12. Change history

| Version | Date | Status | Change |
|---|---|---|---|
| 0.1.0 | 2026-11-06 | Draft | Initial historical enrichment integration contract |

## 13. Approval

- Product owner: Pending
- Consumer/system owner review: Pending
- Implementation authorization: Not granted