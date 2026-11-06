# DTE-M05 — Relationship Mapping Engine Specification

- Document ID: PULSE-DTE-M05
- Version: 0.1.0
- Status: Draft — Pending product review
- Parent: docs/dte/DTE_MODULE_REGISTER.md
- Last updated: 2026-11-06

## 1. Purpose

The Relationship Mapping Engine governs links between questions, question versions, classification entities, archetypes and other approved DTE entities. It provides a normalized, typed and version-aware relationship model rather than embedding arbitrary arrays or labels in question records.

## 2. Scope

In scope:
- Question-to-classification mappings.
- Many-to-many question/concept relationships.
- Typed relationships between classification entities.
- Primary/secondary designation where configured.
- Direct versus inherited mapping provenance where supported.
- Effective schema-version association.
- Validation of relationship endpoints and constraints.
- Revision history and audit of relationship changes.
- Read contracts for DTE consumers.

Out of scope:
- Defining taxonomy structure (M04).
- Defining archetype identity (M06).
- Calculating difficulty.
- Student attempt relationships or test composition.
- Content placement ownership.

## 3. Relationship principles

1. Relationships are first-class records with stable identity where history requires it.
2. Each relationship has a defined type and valid endpoint types.
3. Many-to-many mappings are supported.
4. A question may map to multiple concepts or configured classification nodes where rules permit.
5. Primary/secondary semantics are configuration-driven, not universal assumptions.
6. Relationship identity is distinct from endpoint display labels.
7. Mapping revisions preserve prior published states.
8. Relationships must identify the relevant question identity/version and schema version according to the approved mapping policy.
9. No array of unvalidated foreign identifiers is accepted as the canonical representation for secondary concept links.

## 4. Relationship catalogue

Candidate relationship families:
- Question → classification node.
- Question version → classification node, where version-specific mapping is required.
- Classification node → parent node.
- Classification node → related node.
- Question → archetype.
- Archetype → related archetype.
- Question → PYQ appearance/provenance record.
- Question → source/placement reference.
- Question → related question (e.g. duplicate candidate, adapted variant, prerequisite or follow-up), with explicit relation type.

Each relationship type must define:
- Stable type ID and display label.
- Source endpoint type.
- Target endpoint type.
- Directionality and inverse display behaviour.
- Cardinality constraints.
- Whether self-links are allowed.
- Whether cycles are allowed.
- Whether a primary designation is meaningful.
- Tenant/scope restrictions.
- Effective date/lifecycle behaviour.
- Validation and deletion/deprecation rules.

## 5. Mapping record requirements

A governed mapping record should be able to capture:
- Mapping ID.
- Tenant/scope.
- Source entity type and ID.
- Target entity type and ID.
- Relationship type ID.
- Logical question ID and exact version reference when applicable.
- Schema ID and schema version.
- Primary/secondary or configured role designation.
- Mapping source: human, import, AI suggestion accepted, migration or system process.
- Mapping revision/status.
- Created/updated actor and timestamps.
- Reason/evidence or reviewer note reference where required.
- Supersession/replacement reference.

The physical schema is not prescribed here; canonical identity and history semantics are mandatory.

## 6. Inheritance and resolution

If classification inheritance is supported, it must be explicit and reproducible:
- Distinguish direct assignment from inherited/resolved membership.
- Identify the rule and schema version that produced inheritance.
- Prevent ambiguous duplicate resolution.
- Define whether descendants inherit parent classification and whether ancestors are derived from child assignments.
- Preserve the direct mapping as source evidence.
- Do not materialize derived mappings as if a user explicitly assigned them.
- Provide explainability: why a question appears under a resolved node.

Inheritance policy is an open decision and must not be assumed by consumers.

## 7. Validation

Validate:
- Endpoint existence and type compatibility.
- Tenant/scope compatibility.
- Active/deprecated/retired endpoint state.
- Relationship type validity.
- Cardinality and uniqueness constraints.
- Schema-version compatibility.
- Prohibited cycles or self-links.
- Primary designation uniqueness where configured.
- Duplicate relationship records.
- Effective date and lifecycle constraints.
- Question-version compatibility.

A mapping to a deprecated node may remain historically valid while being blocked for new assignments. The exact policy is configuration-dependent.

## 8. Revision and publication

- Draft mapping changes may be edited according to permissions.
- Submitted/reviewed/published states are separate.
- Published relationship sets must not be silently overwritten.
- A change creates a new mapping revision or versioned relationship event.
- Historical reads must be able to reconstruct the mapping state at a given point/version.
- Removing a mapping from the current set must preserve its historical existence and reason.
- Bulk changes use M12 and pass through validation/audit.

## 9. API and event contract requirements

Consumers should be able to retrieve:
- Stable source and target IDs.
- Relationship type.
- Effective schema/version.
- Question and question-version references.
- Current mapping revision/status.
- Direct/inherited indicator where applicable.
- Change timestamp and event/revision identifier.

Change events should support idempotent processing and ordering/reconciliation. Event payloads must not contain unauthorized question content.

## 10. Security and performance

- Tenant and endpoint permissions must be validated on every read/write.
- No cross-tenant relationship may be created unless an explicit global reference policy permits it.
- Index by tenant, endpoint ID/type, relationship type and relevant version fields.
- Paginate high-degree relationship lists.
- Bulk mapping changes must be asynchronous when volume requires it.
- Audit all relationship mutations.
- Preserve referential integrity without destructive cascade deletion.

## 11. Acceptance criteria

1. The model supports many-to-many question/classification links.
2. Relationship types declare endpoint compatibility and constraints.
3. Canonical IDs are independent of display labels.
4. Primary/secondary designation is configurable.
5. Direct and inherited mappings are distinguishable if inheritance is enabled.
6. Validation rejects invalid endpoint, tenant, schema and cardinality combinations.
7. Published mapping changes preserve prior revisions.
8. Historical mappings can be reconstructed.
9. Bulk operations use the governed validation and audit pipeline.
10. Consumer APIs expose stable version-aware references.
11. The design does not depend on a fixed academic hierarchy.
12. No difficulty score or student-performance relationship is owned by this engine.

## 12. Dependencies

- M04 Classification Configuration Studio.
- M06 Archetype Management.
- M09 PYQ Provenance Manager.
- M11 Version & History Manager.
- M12 Bulk Tagging Manager.
- M13 Validation & Quality Engine.
- Question identity/version service.

## 13. Open decisions

| ID | Question | Status |
|---|---|---|
| DTE-M05-OD-001 | Which relationship types are mandatory in the first release? | Open |
| DTE-M05-OD-002 | Are mappings attached to logical questions, exact versions or both by mapping category? | Open |
| DTE-M05-OD-003 | Is taxonomy inheritance enabled, and what are its exact resolution rules? | Open |
| DTE-M05-OD-004 | Which relationship types permit cycles or self-links? | Open |
| DTE-M05-OD-005 | How are global reference nodes linked to tenant-owned nodes? | Open |
| DTE-M05-OD-006 | What is the conflict policy for multiple primary mappings? | Open |
| DTE-M05-OD-007 | What event ordering and replay guarantees do consumers require? | Open |

## 14. Change history

| Version | Date | Status | Change |
|---|---|---|---|
| 0.1.0 | 2026-11-06 | Draft | Initial relationship mapping specification |

## 15. Approval

- Product owner: Pending
- Technical review: Pending
- Implementation authorization: Not granted