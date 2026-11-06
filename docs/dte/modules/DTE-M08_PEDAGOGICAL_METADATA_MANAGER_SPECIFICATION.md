# DTE-M08 — Pedagogical Metadata Manager Specification

- Document ID: PULSE-DTE-M08
- Version: 0.1.0
- Status: Draft — Pending product review
- Parent: docs/dte/DTE_MODULE_REGISTER.md
- Last updated: 2026-11-06

## Governing scope clarification — classification management software

DTE manages institution-defined academic classification and tagging structures. It does not design, prescribe, generate or impose chapter-wise syllabus bifurcation, curriculum structure or a universal academic hierarchy. Institutions define their own categories and terminology; DTE provides software to configure, record, map, search, validate, review, version, govern and report on those existing structures. Academic terms such as subject, chapter, topic and concept are examples of institution-managed data, not mandatory DTE levels or a curriculum-design function.

## 1. Purpose

Pedagogical Metadata Manager defines configurable descriptors that communicate teaching, learning or question-design characteristics not adequately represented by the classification taxonomy or question type. It provides controlled vocabularies and assignment rules for these descriptors.

## 2. Scope

In scope:
- Define metadata groups and descriptor definitions.
- Configure allowed values, data types, cardinality and applicability.
- Support tenant-specific labels and localized descriptions.
- Assign descriptors to questions or versions under explicit rules.
- Support free-text or numeric attributes only where governed and validated.
- Preserve metadata revisions and audit history.
- Expose metadata to Tagging Studio, Inventory and authorized consumers.

Out of scope:
- Student-specific learning state or behaviour.
- Difficulty scores, weights, thresholds or exam multipliers.
- Question type definitions.
- Archetype identity and strategy.
- Uncontrolled hashtag storage.

## 3. Descriptor catalogue

Illustrative descriptor labels from prior planning include:
- Must Solve.
- Kota Trick.
- Repeated Trap.
- Calculation Intensive.
- Conceptual Trap.
- Multi-Concept.
- Graph/Diagram Based.
- Approximation Required.
- Time Consuming.
- High Exam Relevance.

These are examples, not a fixed universal enum. Each tenant may configure descriptors appropriate to its pedagogy and content policy.

## 4. Metadata definition model

Candidate attributes:
- Stable metadata definition ID.
- Group/category ID.
- Canonical key/code.
- Display label and localized labels.
- Description and tagging guidance.
- Data type (controlled value, boolean, numeric, text or reference).
- Allowed values / validation constraints.
- Cardinality (single or multiple).
- Applicability rules by schema, question type or content scope.
- Required/optional status by completeness profile.
- Active/deprecated/retired state.
- Tenant/global scope.
- Version and audit metadata.

Free text must be constrained to avoid creating an unsearchable and inconsistent tag vocabulary. Where possible, use controlled values and aliases.

## 5. Assignment semantics

- Metadata may apply to a logical question or exact version according to the approved field definition.
- Assignment identity level must be visible to users.
- Multiple descriptors may coexist when cardinality permits.
- Metadata must not be used as a substitute for formal classification relationships.
- A descriptor may be informational, required for a workflow, or used for filtering; each use must be explicit.
- Assignment changes to published records create revisions and preserve prior values.
- AI-suggested metadata must retain suggestion provenance until accepted by an authorized user.

## 6. Configuration UX

- Metadata group list.
- Definition editor with stable key, label, description, type and cardinality.
- Allowed-value editor.
- Applicability and dependency rules.
- Localization/alias management.
- Preview in Tagging Studio.
- Usage statistics and retirement warnings.
- Version/history view.

## 7. Validation and quality

Validate data type, allowed values, cardinality, applicability, tenant scope and lifecycle state. Prevent assignment of retired descriptors to new records unless a migration/exception policy permits it. Identify near-duplicate labels and keys during configuration.

## 8. Security and governance

- Only authorized users may create or modify metadata definitions.
- Tenant-specific metadata is isolated.
- Shared definitions require explicit governance.
- Stable keys are never reused after retirement.
- Audit definition and assignment changes.
- Preserve historical labels and values for historical display.
- Do not expose private pedagogical notes to unauthorized roles.

## 9. Acceptance criteria

1. Metadata definitions are configurable and versioned.
2. Illustrative labels are not treated as a fixed global enum.
3. Metadata types, allowed values and cardinality are validated.
4. Metadata is distinct from taxonomy, question type, archetype and difficulty.
5. Tagging Studio and Inventory consume the same authoritative definitions.
6. Published assignment changes preserve history.
7. AI suggestions cannot silently publish metadata.
8. Tenant access and visibility are enforced.
9. Controlled values are preferred over uncontrolled hashtag proliferation.
10. Student-specific behaviour and DRE scoring remain outside this module.

## 10. Dependencies

- M03 Tagging Studio.
- M04 Classification Configuration Studio.
- M11 Version & History Manager.
- M12 Bulk Tagging Manager.
- M13 Validation & Quality Engine.
- M15 Configuration Version Manager.

## 11. Open decisions

| ID | Question | Status |
|---|---|---|
| DTE-M08-OD-001 | Which metadata data types are supported initially? | Open |
| DTE-M08-OD-002 | Which descriptors are global seeds versus tenant-defined? | Open |
| DTE-M08-OD-003 | Can tenants create free-text metadata, and under what controls? | Open |
| DTE-M08-OD-004 | Which metadata is required for each completeness profile? | Open |
| DTE-M08-OD-005 | Which metadata is visible to downstream systems and which remains internal? | Open |

## 12. Change history

| Version | Date | Status | Change |
|---|---|---|---|
| 0.1.0 | 2026-11-06 | Draft | Initial pedagogical metadata manager specification |

## 13. Approval

- Product owner: Pending
- Technical review: Pending
- Implementation authorization: Not granted