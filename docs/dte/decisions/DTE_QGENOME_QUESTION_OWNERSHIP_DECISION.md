# DTE Decision Paper — Canonical Question Ownership and Q-GENOME Boundary

- Document ID: PULSE-DTE-DEC-003
- Version: 0.1.0
- Status: Draft — Architecture decision proposed; product approval pending
- Date: 2026-11-06
- Repository: anshuljindalsecondbrain-art/pulse
- Related documents:
  - `docs/dte/DTE_MASTER_DOCUMENTATION_REGISTER.md`
  - `docs/dte/DTE_MODULE_REGISTER.md`
  - `docs/dte/modules/DTE-M02_QUESTION_INVENTORY_SPECIFICATION.md`
  - `docs/dte/modules/DTE-M05_RELATIONSHIP_MAPPING_ENGINE_SPECIFICATION.md`
  - `docs/dte/modules/DTE-M18_EXTERNAL_ENGINE_INTEGRATION_SPECIFICATION.md`
  - `docs/dte/decisions/DTE_QUESTION_CLASSIFICATION_ATTACHMENT_POLICY.md`
  - `docs/dte/decisions/DTE_LOGICAL_QUESTION_IDENTITY_POLICY.md`

## 1. Decision required

DTE requires a stable canonical question identity and exact question-version reference. However, DTE's governing scope says that DTE does not author or own question content. The architecture must therefore name the authoritative owner of:
- Logical question identity.
- Question content and immutable content versions.
- Media and source-content references.
- Placement/instance identity.
- Cross-module question relationships that are shared intelligence rather than DTE-specific classification.

The Q-GENOME concept has been described as a shared intelligence layer. Its exact ownership, scope and deployment boundary have not yet been approved.

## 2. Facts established by current DTE documents

The following are already stated in current specifications:

1. M02 distinguishes logical question, question version and placement/instance.
2. M02 says DTE does not author question content or create/own placements.
3. M05 manages DTE relationship mappings and classification relationships, and does not own content placement.
4. M18 says DTE is authoritative for its classification schemas and question-to-classification mappings, while each consumer owns its own domain.
5. M18 requires consumer references to distinguish `question_id`, `question_version_id`, mapping revision and schema version.
6. DRE owns difficulty calculations and evaluation history.
7. Student Tracking owns student assignment, attendance, attempt evidence and student analytics.
8. The current documents do not identify an approved system of record for canonical question identity/content or decide whether Q-GENOME is a separate service.

These facts establish the need for an ownership decision; they do not themselves prove that Q-GENOME must be a microservice or that DTE should own question content.

## 3. Options

### Option A — Q-GENOME owns canonical question identity and content domain

Q-GENOME is the authoritative domain for logical question identity, question versions, content references, media/source links and shared question relationships. DTE consumes canonical question references and owns classification configuration and mapping records.

**Advantages**
- One canonical identity for every PULSE consumer.
- Avoids duplicate question identity implementations in DTE, DRE, Student Tracking and content systems.
- Aligns with the stated intention for Q-GENOME to be a shared intelligence layer.
- Keeps DTE focused on classification management.

**Risks / decisions**
- Q-GENOME scope must be tightly defined so it does not absorb content authoring, placement management or other module workflows.
- Ownership, access control, version lifecycle and licensing need their own specification.
- Requires stable contracts and migration strategy for any existing question records.

### Option B — DTE owns canonical question identity and content versions

DTE stores the canonical question and versions, while other systems consume its identifiers.

**Advantages**
- Simple local access for tagging and inventory workflows.
- Fewer immediate service-to-service dependencies.

**Risks**
- Conflicts with DTE's current boundary that it does not author or own question content.
- Makes DTE a general question content system, expanding its scope.
- Couples all PULSE consumers to DTE and risks making DTE a central dependency for unrelated workflows.
- Would require rewriting the product boundary and multiple module specifications.

### Option C — PULSE Core owns question identity; Q-GENOME is only an intelligence/relationship layer

A central PULSE Core domain owns question identity and versions. Q-GENOME consumes those records to provide shared intelligence and relationships. DTE consumes identity from PULSE Core and owns classification mappings.

**Advantages**
- Preserves a core platform identity service separate from DTE.
- Allows Q-GENOME to focus on enrichment, similarity, relationships and intelligence.
- May fit an architecture where PULSE Core already owns shared domain entities.

**Risks**
- No approved PULSE Core question domain has been identified in the current DTE documents.
- Could split identity, content and intelligence ownership across two services without clear value.
- Requires proof that PULSE Core has an established owner and lifecycle for question identity.

### Option D — Each module owns its own question identity and reconciles through matching

DTE, DRE, Student Tracking and content systems each maintain local question identities, with cross-system matching.

**Advantages**
- Local autonomy and fewer central dependencies.

**Risks**
- Creates identity fragmentation and duplicate reconciliation.
- Makes exact-version references and historical evidence difficult to reconcile.
- Weakens shared question intelligence and increases integration complexity.
- Not recommended for a shared PULSE question ecosystem.

## 4. Recommended direction for review

**Recommend Option A at the domain-ownership level: Q-GENOME should be the canonical shared question identity/content-reference domain, while DTE remains the owner of classification configuration and tagging mappings.**

This recommendation concerns logical ownership, not deployment topology.

### Deployment recommendation

Start with a **modular domain boundary inside the existing PULSE application/database architecture**, if the current codebase supports enforceable module boundaries. Do not create a separately deployed microservice solely because the domain is called Q-GENOME.

A separate service/database can be considered later if justified by independent scaling, team ownership, security boundary, release cadence or operational needs. The domain contract and identifiers should remain stable if deployment topology changes.

This reduces premature distributed-system complexity while protecting the shared domain boundary.

The recommendation is not an approved product decision until the owner confirms it and the architecture review validates current codebase constraints.

## 5. Proposed responsibility boundary if Option A is approved

| Capability / entity | Proposed authoritative owner | DTE responsibility |
|---|---|---|
| Logical question ID | Q-GENOME | Store and consume stable reference |
| Question content | Q-GENOME or its explicitly governed content source | Display permitted preview; no content authoring |
| Question version ID | Q-GENOME | Attach version-scoped mapping to exact reference |
| Question media/source-content references | Q-GENOME/content source | Consume authorized references |
| Placement/slot identity | External content system | Store external owner + placement reference; do not create or own placement |
| Classification schemas/configuration | DTE | Create/maintain institution-approved configuration records |
| Question-to-classification mappings | DTE | Full ownership, validation, review, publication and history |
| DTE mapping revisions | DTE | Full ownership |
| Archetype definitions | DTE, subject to approved product boundary | Manage reusable archetype records and links |
| Question type definitions | DTE | Manage configurable question types |
| Pedagogical metadata definitions/assignments | DTE | Manage institution-configured metadata |
| PYQ appearance/provenance | DTE M09, linked to canonical question/version | Record, verify and audit provenance |
| Difficulty rules/results | DRE | Consume references only; no calculation |
| Student attempt/assignment evidence | Student Tracking | No ownership; preserve external references |
| Test/book/exercise composition | Assessment/content systems | Consume placement references only |

The final ownership of archetype and shared question relationships must be checked against Q-GENOME's intended shared-intelligence scope. This table is proposed, not yet authoritative.

## 6. Canonical reference contract

If Option A is approved, DTE should reference at minimum:

- `question_id`: stable logical question identifier from Q-GENOME.
- `question_version_id`: exact immutable content revision identifier from Q-GENOME.
- `question_owner_id` or equivalent ownership scope, if required.
- `content_source_id` or equivalent source reference, where applicable.
- `placement_system_id` and `placement_id`: external placement reference, when a mapping is placement-scoped.
- `tenant_id` or authorized sharing scope.
- `identity_status`: only if exposed by the canonical owner and needed by DTE.
- `content_version_status`: only if exposed by the canonical owner and needed by DTE.

The canonical owner must define ID format, immutability, lifecycle, access control, version retrieval and historical resolution. DTE must not mint substitute canonical question IDs or infer identity from text similarity.

## 7. Required integration behaviours

1. DTE must reject or quarantine an unknown canonical question/version reference; it must not silently create a canonical question.
2. DTE must verify that a version belongs to the referenced logical question.
3. DTE must not assume the latest version is the version that was tagged or used in an assessment.
4. DTE mappings must pin exact version references wherever their configured attachment scope requires it.
5. If the canonical owner retires, merges or splits an identity, DTE must receive a governed event or reconciliation instruction.
6. DTE must preserve its historical mapping and review records through identity changes.
7. DTE must not rewrite Student Tracking evidence or assessment placements; external owners reconcile their own records.
8. Consumer APIs must distinguish canonical question identity/version from DTE mapping/schema revision.
9. Cross-tenant access and shared-question visibility must be explicitly authorized.
10. An integration outage must not corrupt already-published DTE mapping data.

## 8. Migration and coexistence questions

Before migration or implementation, establish:
- Whether a canonical question repository already exists in the PULSE codebase.
- Which current tables/services hold question IDs and content.
- Whether any IDs are already consumed by Student Tracking, DRE or content systems.
- How duplicates and conflicting identities will be adjudicated.
- How existing DTE question records, if any, map to canonical IDs.
- Whether source ownership/licensing permits central reference or storage.
- How old IDs resolve after migration.
- Whether consumers can support dual-read/dual-reference transition.
- How cutover, rollback and reconciliation will be tested.

No migration strategy can be finalized until the existing repository and data are inspected.

## 9. Open architecture decisions

| Decision ID | Question | Status |
|---|---|---|
| DTE-DEC-003-01 | Approve Q-GENOME as canonical logical question identity/content-reference owner? | Product decision pending |
| DTE-DEC-003-02 | Is Q-GENOME an independent deployed service or an internal modular domain initially? | Architecture decision pending |
| DTE-DEC-003-03 | Does Q-GENOME own question content/media or only identity and references to content sources? | Open |
| DTE-DEC-003-04 | Which shared question relationships belong in Q-GENOME versus DTE M05? | Open |
| DTE-DEC-003-05 | Where do archetype identity and shared archetype intelligence belong? | Open |
| DTE-DEC-003-06 | Which current PULSE component/database is the source of existing question IDs? | Requires codebase/data audit |
| DTE-DEC-003-07 | What is the tenant/global ownership and licensing model for shared questions? | Open |
| DTE-DEC-003-08 | What are the canonical identity/version API and event contracts? | Open |

## 10. Consequences if recommended direction is approved

- DTE-M02 becomes a consumer of canonical question identity/content references.
- DTE-M05 manages DTE-owned classification relationships, while shared identity/semantic relationships are assigned explicitly to their authoritative owner.
- DTE-M18 documents Q-GENOME API/event contracts.
- DTE-DOC-013/014/019/040 define canonical entity ownership and reference constraints.
- Existing DTE module specifications must be reconciled to the approved ownership boundary.
- The database ERD must not create a second authoritative question identity table in DTE.
- No assumption is made that the physical deployment must be a microservice.

## 11. Approval and implementation gate

- Product owner approval: Pending
- Q-GENOME/domain owner approval: Pending
- Architecture approval: Pending
- Data migration approval: Pending
- Implementation authorization: Not granted

This decision paper does not authorize a schema, service, migration, code or production change.

## 12. Change history

| Version | Date | Status | Change |
|---|---|---|---|
| 0.1.0 | 2026-11-06 | Draft | Documented canonical question ownership options and recommended Q-GENOME domain boundary |
