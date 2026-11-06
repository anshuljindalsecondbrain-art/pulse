# PULSE — Project Master Plan

**Document status:** Initial foundation  
**Last updated:** 2026-11-06  
**Authority:** Working project baseline; implementation status must be verified against the live repository and services.

## 1. Vision

PULSE is intended to become a multi-institute academic technology platform that connects question-bank operations, academic content, classroom work tracking, assessments, and AI-supported learner development. The platform should support multiple institutions with tenant-specific workflows and configurations while retaining shared infrastructure where appropriate.

The platform must be developed incrementally. This document records the direction and boundaries; it does not claim that all listed capabilities already exist.

## 2. Product domains

The following are product domains, not a commitment to separate deployable services:

- **Student Work Tracking / Abhyas Matrix:** daily assignment, exercise and student-response tracking.
- **QBMS:** question identity, question versions, question sources/media, taxonomy associations, question metadata, review and quality evidence.
- **Deep Tagging Engine (DTE):** generic, configurable classification and progressive academic enrichment of questions.
- **Difficulty Rule Engine (DRE):** separate engine for difficulty rules, evaluation and difficulty history.
- **Test Management:** test blueprints, assembly, delivery, results and analysis.
- **Content Management:** institution-owned content collections, series, editions, units, exercises and question placements.
- **AI Mentor and learner intelligence:** learner progress, diagnostic interpretation, intervention workflows and explainable recommendations.
- **Shared platform capabilities:** identity, tenant management, roles, permissions, audit, notifications, integrations, analytics and automation.

These domains must be reconciled with the existing implementation before code is reorganized.

## 3. Core product principles

1. **Operational utility before enrichment:** teachers must be able to track student work from day one without waiting for a fully classified question bank.
2. **Progressive intelligence:** richer question classification can be added over time and used to improve analytics retrospectively.
3. **Evidence preservation:** original student attempts and responses remain immutable; derived analytics may be recomputed with traceable provenance.
4. **Configurable academic structures:** institutions may use different taxonomies, labels, levels and relationships.
5. **Separation of concerns:** question identity, content version, placement, classification, difficulty evaluation and student evidence are distinct concepts.
6. **Tenant isolation:** institution-specific records and permissions must be enforced at the data and service layers.
7. **Human governance:** AI can assist but must not silently approve or publish academic classifications.
8. **Auditable evolution:** configuration and published mapping changes are versioned and attributable.
9. **Scale-aware design:** question inventory may grow to approximately one million PCMB questions; use indexed search, server-side pagination and background processing.
10. **Reuse before rebuild:** inspect the live repository and connected services before choosing an implementation.

## 4. Student Tracking and DTE: two independent tracks

### Track A — Student Work Tracking
Minimum operational data can include a chapter or syllabus reference, exercise label, question count and student-level response status. The historical operating statuses include Correct, Incorrect, Doubt, Solved by Teacher and Unattempted. Exact event semantics and status transitions must be verified and formalized during implementation.

This track must be useful even when no question-level taxonomy exists.

### Track B — Deep Tagging Engine
Academic and content teams progressively classify questions using institution-configured structures, relationships and metadata. When classification becomes available, the platform may enrich historical analytics by associating existing evidence with the newly classified question.

The enrichment process must be asynchronous, idempotent, version-aware and auditable. It must not rewrite original student evidence. An incorrect response is not automatically a student-reported doubt.

## 5. Question and content identity model

Keep these concepts separate:

- **Question identity:** stable logical identity of a question.
- **Question version:** a specific revision of question content or answer/solution data.
- **Question placement/slot:** a question's use in an exercise, worksheet, test or other content instance.
- **Content collection/series:** institution-owned or shared grouping of learning materials.
- **Classification mapping:** versioned association between a question/version and configured academic classification entities.
- **Student evidence:** an attempt, response or teacher-recorded status tied to the exact question version and relevant placement/context.

A question may be reused in multiple placements. Reuse must not create duplicate question identities. Content series names and structures are tenant-specific; do not hardcode one institution's branding as global categories.

## 6. DTE scope boundary

DTE owns configurable classification definitions, relationships and question mappings, plus its review, versioning, validation and audit workflow. It does not own the difficulty algorithms or student evidence.

DTE must not hardcode Subject → Chapter → Topic → Concept → Sub-concept → Archetype as a universal six-level hierarchy. It must support configurable hierarchical and non-hierarchical structures, multiple classification groups, relationship types, optional/required fields and many-to-many mappings.

Archetype identity is reusable and must not be structurally trapped under one sub-concept. Question Type is distinct from difficulty. Pedagogical metadata and PYQ provenance are separate configurable/relational concerns.

## 7. DRE boundary

DRE is a separate future engine. It owns difficulty rules, formulas, thresholds, exam scaling, student/global/group evaluations and difficulty history. DTE must not implement these calculations. DTE may retain a pointer to an external DRE evaluation that identifies the exact question version.

## 8. Multi-institute and content ownership

Support tenant-owned/private content and, where later approved, shared or licensed platform content. Ownership, licensing and access rules must be explicit. Tenant-specific collections and product/series names must not be forced into a global enum. Optional standardized purpose mappings may support cross-institute analytics without replacing local labels.

## 9. Roles and governance

Previously identified role families include Teacher/Question Author, Academic Reviewer, DTP/Production, Content Administrator and System Administrator. The final permission matrix must be derived from actual workflows and enforced server-side, not merely hidden in the UI.

Sensitive actions should be auditable, including classification edits, review decisions, publication, configuration changes, bulk actions and access-control changes.

## 10. AI assistance

AI may assist with classification suggestions, duplicate/similarity detection, extraction and quality checks. Store relevant model/prompt versions, evidence and confidence where appropriate. Human review is required before approval/publication. AI output must never silently become authoritative academic data.

## 11. Delivery governance

The first engineering phase is a live-system audit: source tree, application routes, dependencies, data model, migrations, RLS, database functions, storage, edge functions, integrations, tests and deployment configuration. The audit must identify verified implementation, partial implementation, obsolete proposals and missing capabilities.

Only after that audit should the team produce a reuse-versus-change plan and implementation sequence. Production changes require reviewed migrations, backups/rollback planning where appropriate, tests and explicit approval.
