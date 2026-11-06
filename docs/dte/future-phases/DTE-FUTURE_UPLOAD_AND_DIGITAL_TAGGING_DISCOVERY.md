# DTE Future Phases — Question Upload and Digital Tagging Discovery

- Document ID: PULSE-DTE-FUTURE-ARCH-001
- Version: 0.1.0
- Status: Draft — discovery brief only; not an approved technical design
- Applies to: Future Phase 2 and Phase 3
- Parent: docs/dte/DTE_PRODUCT_SCOPE_AND_PHASE_ROADMAP.md
- Implementation authorization: Not granted

## 1. Purpose

Record the future capabilities that must be discovered before question upload and digital tagging are designed. This document deliberately avoids committing to a database schema, service boundary, canonical question owner or API before those decisions are supported by repository/codebase and stakeholder evidence.

## 2. Phase 2 — Question upload and ingestion

### 2.1 Candidate workflow

1. Authorized user selects a supported source/input mode.
2. Upload job is created with tenant, actor, source and batch metadata.
3. File/content is staged in a controlled temporary area.
4. Extraction/OCR/parsing runs if required by the input type.
5. Candidate question segments and media references are presented for human verification.
6. Validation checks format, required content, provenance, licensing metadata and possible duplicates.
7. Candidate records are accepted, rejected, quarantined or returned for correction.
8. Accepted questions become available to the digital tagging workflow under an explicitly approved identity/content ownership model.

This workflow is illustrative and requires product confirmation. It does not prescribe a final upload UI or ingestion architecture.

### 2.2 Discovery questions

- Which inputs are required: manual entry, image, PDF, DOCX, Excel/CSV or other?
- Is OCR required, and which languages/scripts/formula formats must be supported?
- What constitutes one question when a page contains multiple parts, passages, diagrams or shared instructions?
- How are options, equations, tables, diagrams and media represented?
- Which fields are required to establish source provenance and usage rights?
- What is the human verification responsibility after OCR?
- What are maximum file size, page count, question count and batch size?
- How are partial failures, retries and duplicate uploads handled?
- Which existing PULSE question tables/IDs are already used by Student Tracking, assessment or other modules?
- Is Q-GENOME the canonical identity/content owner, or is another domain authoritative?
- Does canonical ownership include content bytes, media, metadata, identity, versions or only references?
- What is the tenant ownership/licensing model for shared questions?
- How will migration and coexistence with existing records work?

## 3. Phase 3 — Digital tagging

### 3.1 Candidate workflow

1. User opens an accepted uploaded question.
2. The system resolves the institution-approved framework version applicable to the work.
3. The tagging interface displays approved fields and allowed values.
4. Tagger assigns permitted values and records exceptions where no value fits.
5. Validation checks required fields, allowed values, relationship constraints and configured completeness.
6. Work is submitted for review.
7. Reviewer approves, rejects or returns for correction.
8. Publication makes the approved tagging result available to authorized consumers.
9. Revisions preserve prior mappings and framework versions.
10. Digital tagging may reconcile previously completed offline work through an approved external locator/handoff process.

### 3.2 Decisions required before implementation

- Mapping attachment level: logical question, exact content version, placement, provenance appearance or a controlled combination.
- Inheritance/override rules, if any.
- Whether multiple frameworks may tag the same question.
- Mapping identity, revision and history semantics.
- Duplicate identity merge/split authority.
- Relationship model and allowed cardinality.
- Schema version migration and historical interpretation.
- Review/publish state machines and re-review triggers.
- Bulk tagging atomicity, idempotency and partial failure behaviour.
- Question/media access and licensing.
- Tenant/shared catalogue and question visibility.
- API/event contract for Student Tracking, DRE, Q-GENOME and content/assessment systems.

DEC-001, DEC-002 and DEC-003 are preserved Draft decision papers and must be reconsidered against these questions. None is approved by this discovery brief.

## 4. Future Student Tracking integration

Student Tracking owns student attendance, assignments, attempts, response status, doubts, completion and performance evidence. It must remain operational even when deep tagging is incomplete.

A future integration may use approved question/version references and tagging-change events to enrich historical analytics. It must:
- preserve original evidence;
- use idempotent, replayable processing;
- identify the exact question/tagging/framework versions;
- record enrichment provenance;
- avoid changing historical student responses;
- handle missing, retired or revised mappings explicitly;
- not block live student tracking.

No student evidence is stored in DTE.

## 5. Future DRE integration

DRE owns static/dynamic difficulty calculations, weights, thresholds, exam multipliers and student/group/region difficulty outputs. DTE may expose approved question and framework references only where needed. No difficulty calculation is transferred to DTE.

The future contract must define exact version references, evaluation lifecycle, stale-result handling and authorization.

## 6. Future AI-assisted tagging

AI is optional and must be introduced only after approved framework configuration and a quality-reviewed human-tagged evaluation corpus exist.

Controls:
- suggestions may reference existing approved values only;
- no AI creation or approval of academic categories;
- evidence and confidence are recorded;
- model, prompt and framework versions are traceable;
- human review remains authoritative;
- rejection/override feedback is auditable;
- evaluation thresholds, drift monitoring and rollback are approved before release;
- external model data processing and retention are reviewed for privacy/security.

## 7. Future non-functional design areas

Before implementation, specify:
- inventory scale and tenant distribution;
- upload throughput and concurrent users;
- extraction/OCR accuracy and verification rates;
- search/indexing and query latency;
- background job reliability, retries and idempotency;
- file/media storage, access and retention;
- security, RLS and cross-tenant isolation;
- availability, backup, RPO/RTO and recovery;
- observability, alerting and incident response;
- accessibility and localization;
- data migration and rollback.

Do not carry forward a historical one-million-question target as a committed SLO without workload evidence.

## 8. Future phase gate

Phase 2 discovery may begin after Phase 1 scope and framework baseline are approved. Phase 2 implementation requires its own product requirements, identity/content ownership decision, security review, data model and test plan. Phase 3 digital tagging implementation requires the approved framework contract plus mapping identity/version policy and review workflow.

## 9. Approval

- Product owner: Pending
- Question/content domain owner: Pending
- Student Tracking owner: Pending
- DRE owner: Pending
- Security/architecture: Pending
- Implementation authorization: Not granted

## 10. Change history

| Version | Date | Status | Change |
|---|---|---|---|
| 0.1.0 | 2026-11-06 | Draft | Initial future upload/digital-tagging discovery brief |
