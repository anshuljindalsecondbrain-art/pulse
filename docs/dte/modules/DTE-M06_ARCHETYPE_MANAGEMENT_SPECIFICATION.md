# DTE-M06 — Archetype Management Specification

- Document ID: PULSE-DTE-M06
- Version: 0.1.0
- Status: Draft — Pending product review
- Parent: docs/dte/DTE_MODULE_REGISTER.md
- Last updated: 2026-11-06

## Governing scope clarification — classification management software

DTE manages institution-defined academic classification and tagging structures. It does not design, prescribe, generate or impose chapter-wise syllabus bifurcation, curriculum structure or a universal academic hierarchy. Institutions define their own categories and terminology; DTE provides software to configure, record, map, search, validate, review, version, govern and report on those existing structures. Academic terms such as subject, chapter, topic and concept are examples of institution-managed data, not mandatory DTE levels or a curriculum-design function.

## 1. Purpose

Archetype Management maintains reusable identities for recurring question patterns, solution structures or pedagogical models. An archetype describes a recognizable problem family and may be linked to many questions and multiple classification entities.

An archetype is not a question, not a taxonomy node by default, and not a difficulty level. Its identity must not be structurally trapped beneath one sub-concept.

## 2. Scope

In scope:
- Create and maintain reusable archetype records.
- Assign stable IDs/codes and descriptive names.
- Store strategy, characteristic features, common traps and benchmark solving-time metadata.
- Link archetypes to questions, question versions and classification entities through governed relationships.
- Discover related and potentially duplicate archetypes.
- Manage lifecycle, review and revision history.
- Search and filter archetypes.

Out of scope:
- Authoring question content.
- Defining the classification schema itself.
- Computing question difficulty or student-specific solving performance.
- Prescribing a single solution method for all linked questions.
- Owning student outcomes or test analytics.

## 3. Archetype identity and attributes

Candidate fields:
- Stable archetype ID.
- Human-readable code.
- Canonical title.
- Short description and detailed definition.
- Recognition criteria / defining characteristics.
- General solution strategy or reasoning pattern.
- Common conceptual or procedural traps.
- Typical prerequisites or related concepts.
- Benchmark solving time (optional reference metadata, with unit and context).
- Related archetype links.
- Language-specific labels and descriptions.
- Lifecycle status.
- Owner/tenant scope and source.
- Version and audit metadata.

Benchmark time is descriptive reference data only. It is not a DRE score, student timing prediction or universal exam threshold.

## 4. Reuse and relationships

- One archetype may link to many questions.
- One question may link to multiple archetypes where configured and justified.
- Archetypes may link to multiple classification nodes.
- Related-archetype links must use explicit relationship types.
- Do not force archetype parent-child placement under one concept or sub-concept.
- Preserve the distinction between archetype identity and a tenant's preferred display label.
- Support tenant-specific archetypes and any approved shared/global catalogue without cross-tenant leakage.

## 5. Creation and maintenance workflow

Candidate lifecycle:
1. User searches for an existing archetype.
2. User opens a candidate or creates a draft.
3. User enters identity and descriptive attributes.
4. User links relevant classification entities and question examples.
5. Duplicate and quality checks run.
6. Record is submitted for review where required.
7. Authorized reviewer approves or returns it.
8. Approved version becomes available for tagging.
9. Subsequent changes create a new revision.

Exact state transitions and permissions are owned by M10/M11 and remain to be specified.

## 6. Duplicate detection and consolidation

Before creating a new archetype, the interface should search similar titles, codes, descriptions and linked question patterns.

Duplicate candidates are advisory until reviewed. Consolidation must:
- Preserve old identifiers as aliases or redirects where needed.
- Preserve question links and historical references.
- Record the decision and rationale.
- Avoid destructive deletion of an archetype referenced by published mappings.
- Distinguish synonyms from genuinely different archetypes.

## 7. Search and discovery

Support search/filter by:
- ID/code/title.
- Description and strategy text.
- Classification links.
- Linked question/source scope.
- Lifecycle status.
- Tenant/shared scope.
- Related archetype.
- Language.

Results must be permission-scoped and paginated. Similarity search may assist discovery but must not automatically merge records.

## 8. UX requirements

Archetype detail view should show:
- Identity and status.
- Definition and recognition criteria.
- Strategy and traps.
- Benchmark-time context, if present.
- Linked classification entities.
- Example questions and versions.
- Related archetypes.
- Revision and review history.

The editor should make clear that an archetype is a reusable cross-question identity, not a required child in every taxonomy tree.

## 9. Data governance and security

- Stable identifiers must never be reused after retirement.
- Published archetype revisions remain historically readable.
- Tenant-owned records are isolated.
- Shared records require explicit governance and tenant visibility rules.
- All edits, links, approvals, merges and retirements are audited.
- Archive/deactivate rather than destructive deletion when referenced.
- Benchmark metadata must include context and must not be misrepresented as measured student performance.

## 10. Acceptance criteria

1. Archetypes have stable identities and versioned descriptive content.
2. An archetype can link to multiple questions and classification entities.
3. A question can link to multiple archetypes where rules allow.
4. Archetypes are not forced beneath one concept/sub-concept.
5. Strategy, traps and benchmark time are optional descriptive attributes.
6. Duplicate candidates do not trigger automatic merges.
7. Retired archetypes remain resolvable in historical mappings.
8. Tenant/shared visibility is enforced.
9. Changes and link operations are auditable.
10. No difficulty score is calculated or assigned by this module.

## 11. Dependencies

- M05 Relationship Mapping Engine.
- M10 Review & Approval.
- M11 Version & History Manager.
- M12 Bulk Tagging Manager.
- M13 Validation & Quality Engine.
- Question identity/version service.

## 12. Open decisions

| ID | Question | Status |
|---|---|---|
| DTE-M06-OD-001 | Are archetypes global, tenant-specific or both? | Open |
| DTE-M06-OD-002 | Which archetype fields are mandatory? | Open |
| DTE-M06-OD-003 | Is benchmark solving time required, optional or omitted in the first release? | Open |
| DTE-M06-OD-004 | What approval policy applies to new archetypes and edits? | Open |
| DTE-M06-OD-005 | What are the duplicate adjudication and merge rules? | Open |
| DTE-M06-OD-006 | Can tenants extend shared archetypes without forking identity? | Open |

## 13. Change history

| Version | Date | Status | Change |
|---|---|---|---|
| 0.1.0 | 2026-11-06 | Draft | Initial archetype management specification |

## 14. Approval

- Product owner: Pending
- Technical review: Pending
- Implementation authorization: Not granted