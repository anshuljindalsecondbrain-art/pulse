# DTE-M04 — Classification Configuration Studio Specification

- Document ID: PULSE-DTE-M04
- Version: 0.1.0
- Status: Draft — Pending product review
- Parent: docs/dte/DTE_MODULE_REGISTER.md
- Last updated: 2026-11-06

## Governing scope clarification — classification management software

DTE manages institution-defined academic classification and tagging structures. It does not design, prescribe, generate or impose chapter-wise syllabus bifurcation, curriculum structure or a universal academic hierarchy. Institutions define their own categories and terminology; DTE provides software to configure, record, map, search, validate, review, version, govern and report on those existing structures. Academic terms such as subject, chapter, topic and concept are examples of institution-managed data, not mandatory DTE levels or a curriculum-design function.

## 1. Purpose

The Classification Configuration Studio defines the classification schemas that drive DTE tagging. It allows authorized administrators to configure classification groups, fields, nodes, relationships, labels, constraints and validation behaviour without hardcoding a particular academic taxonomy into the application.

A schema is a governed configuration artifact. It is distinct from the mappings that associate questions with its classification entities.

## 2. Scope

In scope:
- Create and edit draft classification schemas.
- Define multiple classification groups within a schema.
- Configure hierarchical and non-hierarchical classification structures.
- Define node/field types, relationship types, cardinality and constraints.
- Configure required/optional rules, dependencies and display ordering.
- Manage canonical identifiers, tenant labels, aliases and localization.
- Preview the schema as it will appear in Tagging Studio.
- Validate configuration before submission/publication.
- Integrate with schema version lifecycle in DTE-M15.

Out of scope:
- Assigning question mappings (M05/M03).
- Managing question content or content collections.
- Calculating question difficulty.
- Owning approval workflow beyond configuration-specific hand-off to M15.

## 3. Configuration model

The configuration model must separate:
1. Schema identity — stable identity across versions.
2. Schema version — immutable published definition snapshot.
3. Classification group — a logical set of classification fields or nodes.
4. Classification node/field — a configurable classification entity or attribute definition.
5. Relationship definition — permitted typed links between entities.
6. Display label/alias — tenant- and language-specific presentation, not identity.
7. Validation/dependency rule — machine-enforceable configuration constraints.

Do not equate the display tree with the underlying data model. A user interface may render a tree for a hierarchical group while the schema also supports cross-links and non-hierarchical groups.

## 4. Schema capabilities

A schema may define:
- One or more classification groups.
- Hierarchical groups with parent-child edges.
- Non-hierarchical groups and flat controlled vocabularies.
- Multiple independent hierarchies in the same schema.
- Configurable node/field types.
- Single-select or multi-select assignment rules.
- Primary/secondary designation where meaningful.
- Cross-group relationships.
- Required/optional fields by completeness profile or workflow.
- Field dependencies and conditional visibility.
- Validation constraints and allowed combinations.
- Ordering, grouping and help text.
- Active, deprecated and retired states.

No universal six-level Subject/Chapter/Topic/Concept/Sub-concept/Archetype structure is assumed.

## 5. Canonical identity and labels

- Every schema, version, group, node/field and relationship definition must have a stable identifier.
- Display labels may differ by tenant and language.
- Label changes must not change canonical identity.
- Aliases and legacy labels may be retained for search and migration.
- Duplicate labels are permitted only where disambiguation and stable identity remain clear.
- Deactivation must preserve existing mapping references and historical display context.

## 6. Tenant and global configuration governance

The architecture may support global reference schemas and tenant-specific schemas or extensions. The exact inheritance and override policy remains open.

Regardless of the selected policy:
- Tenant isolation is mandatory.
- A tenant cannot mutate a global published schema unless explicitly authorized.
- Tenant extensions must not silently alter another tenant's schema.
- A schema assignment must identify the effective schema and version.
- Any inherited configuration must be inspectable and reproducible.
- The system must define how global updates affect tenant extensions before enabling inheritance.

## 7. Configuration editor UX

Candidate workspace:
- Schema list and lifecycle status.
- Schema metadata and scope.
- Classification group navigator.
- Structure editor for nodes/fields and relationships.
- Properties panel for labels, types, cardinality, constraints and help.
- Dependency/validation rule editor.
- Localization and alias editor.
- Preview of Tagging Studio form.
- Validation issues and version history.

Support tree editing where a group is hierarchical, but do not force a tree representation for non-hierarchical structures. Provide explicit confirmation for operations that affect many nodes or downstream mappings.

## 8. Configuration validation

Before a schema version can be submitted or published, validate:
- Unique stable identifiers within required scopes.
- Valid parent references and no prohibited cycles in hierarchical groups.
- Valid relationship endpoints and allowed relationship types.
- Valid cardinality and data types.
- No impossible dependency cycles.
- Required labels and localization fallbacks.
- Valid active/deprecated states.
- Completeness profile references.
- Compatibility with existing question mappings.
- No destructive removal of nodes still referenced by published mappings without an approved migration/deprecation plan.

Errors block publication where integrity would be compromised. Warnings require documented acknowledgement according to policy.

## 9. Versioning and lifecycle

Configuration editing occurs in a draft version. Published schema versions are immutable snapshots. Changes to a published schema create a new draft version and must be reviewed through M15.

Lifecycle candidates:
- Draft
- In review
- Approved
- Published/active
- Superseded
- Retired

The exact transition model is governed by M15. Existing question mappings must retain the schema version against which they were created or validated.

## 10. Security and audit

- Only authorized configuration administrators may create or edit schemas.
- All mutations require tenant/scope authorization on the server.
- Record actor, timestamp, action, before/after values, reason and schema version.
- Published versions cannot be edited in place.
- Protect global reference definitions from tenant-level writes.
- Audit exports and bulk configuration changes.
- Do not expose configuration write credentials in the frontend.

## 11. Acceptance criteria

1. Administrators can define multiple groups in one schema.
2. Both hierarchical and non-hierarchical structures are supported.
3. Canonical IDs are independent of labels and aliases.
4. Required/optional, cardinality, dependency and validation rules are configurable.
5. A schema preview matches the dynamic editor configuration consumed by Tagging Studio.
6. Invalid structures and relationship definitions are detected before publication.
7. Published versions are immutable.
8. Existing mappings remain historically interpretable when a node is deprecated.
9. Tenant configuration cannot mutate another tenant's configuration.
10. No fixed academic hierarchy is required by the platform.
11. Configuration changes are auditable.
12. No question difficulty calculations are defined here.

## 12. Dependencies

- M05 Relationship Mapping Engine.
- M10 Review & Approval.
- M11 Version & History Manager.
- M13 Validation & Quality Engine.
- M15 Configuration Version Manager.
- Tenant authorization and localization services.

## 13. Open decisions

| ID | Question | Status |
|---|---|---|
| DTE-M04-OD-001 | Are global schemas inherited, copied, forked or referenced by tenant extensions? | Open |
| DTE-M04-OD-002 | Can one schema contain multiple independent classification groups? | Open |
| DTE-M04-OD-003 | Which field/node data types are supported in the first release? | Open |
| DTE-M04-OD-004 | Can tenant administrators create custom relationship types? | Open |
| DTE-M04-OD-005 | What is the policy for changing/deprecating nodes with active mappings? | Open |
| DTE-M04-OD-006 | How are localization fallbacks and duplicate labels handled? | Open |
| DTE-M04-OD-007 | Which configuration changes require migration versus simple version publication? | Open |

## 14. Change history

| Version | Date | Status | Change |
|---|---|---|---|
| 0.1.0 | 2026-11-06 | Draft | Initial configuration studio specification |

## 15. Approval

- Product owner: Pending
- Technical review: Pending
- Implementation authorization: Not granted