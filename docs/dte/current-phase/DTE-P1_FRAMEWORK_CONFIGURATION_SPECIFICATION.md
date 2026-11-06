# DTE Phase 1 — Framework Configuration Specification

- Document ID: PULSE-DTE-P1-FRAME-001
- Version: 0.1.0
- Status: Draft — functional specification
- Phase: Current
- Implementation authorization: Not granted

## 1. Purpose

Specify the software capability for recording and managing an academic classification/tagging framework already defined and approved by an institution.

DTE is a configuration-management tool for the institution's decisions. It is not a curriculum designer, syllabus authoring engine or academic taxonomy recommendation system.

## 2. Configuration scope

A framework may contain institution-defined:
- Classification groups or dimensions.
- Fields and their data types.
- Optional or required flags.
- Controlled-value catalogues.
- Hierarchical or non-hierarchical structures.
- Relationships and allowed combinations.
- Stable framework-element identifiers.
- Display labels, descriptions, aliases and translations.
- Ordering and grouping.
- Applicability rules and conditional requirements.
- Validation rules and completeness profiles.
- Effective dates and lifecycle states.

No element or depth is mandatory unless the institution explicitly configures it.

## 3. Structural model

The software must not hardcode a Subject → Chapter → Topic → Concept → Sub-concept → Archetype hierarchy. It should represent the structure the institution supplies, including flat lists, independent groups, configurable parent-child relationships, cross-links or combinations where approved.

Separate:
- Internal stable identifier.
- Canonical institutional code, if supplied.
- Display label(s).
- Definition/instruction.
- Parent/relationship references, if applicable.
- Status and effective dates.
- Version and provenance of the approval decision.

Do not treat a display label as an identifier. Renaming a label must not silently create a new identity.

## 4. Field definition requirements

Each configurable field should define:
- Stable field ID.
- Institutional name/code and display label.
- Description and tagging instruction.
- Data type (for example, controlled value, text, number, date, boolean or multi-select) only where needed.
- Cardinality/minimum/maximum selections.
- Required/optional/conditional status.
- Allowed values or validation expression where approved.
- Applicability scope.
- Visibility and edit permissions.
- Effective version.
- Deprecation/replacement information.

The supported field types and rule language must be finalized in technical design after the real framework is collected.

## 5. Academic authority workflow

1. Academic authority supplies the approved framework.
2. Framework administrator encodes it.
3. DTE performs structural validation only.
4. Academic authority checks that the encoded configuration faithfully represents the approved source.
5. Authorized approver records approval evidence.
6. The configuration version is activated for operational use.

DTE must not decide that a proposed academic category is correct merely because it is structurally valid.

## 6. Validation

Structural checks may include:
- Unique stable IDs within defined scope.
- Unique codes where required.
- Valid references.
- No prohibited cycles in hierarchical structures.
- Compatible field types and cardinality.
- Valid allowed-value references.
- No use of retired values for new work.
- Complete required metadata for configured elements.
- Valid effective-date ranges.

Academic-semantic validity requires institutional review and cannot be inferred by generic software validation.

## 7. Lifecycle

Candidate lifecycle:
- Draft
- Submitted for Academic Review
- Changes Requested
- Approved
- Active
- Superseded
- Retired

Configuration publication, review approval and version history are separate concerns. Their ownership must be unified in the current-phase responsibility model to avoid M04/M10/M11/M15 overlap.

## 8. Configuration changes

- Approved configuration is immutable as a historical version.
- Edits create a new draft version.
- Renames preserve stable identity unless the academic authority declares a new concept.
- Split/merge/replacement of categories requires an explicit institutional decision and recorded rationale.
- Retired values remain visible in historical records.
- Existing offline work packages remain pinned to their original version unless explicitly reissued or migrated.

## 9. Security and audit

- Enforce institution/tenant isolation.
- Restrict framework edit and approval permissions.
- Separate configuration authoring from academic approval where required.
- Record before/after values, actor, time, reason and approval evidence.
- Preserve read-only historical versions.
- Export only within authorized scope.

## 10. Acceptance criteria

1. The institution's supplied framework can be represented without forcing a fixed hierarchy.
2. Stable IDs are distinct from labels.
3. Required/optional rules are configurable.
4. Structural validation does not claim academic approval.
5. Approval evidence and configuration version are recorded.
6. Published versions are not silently overwritten.
7. Active offline work can be associated with the exact framework version.
8. Retired values remain historically interpretable.
9. Cross-institution access is blocked unless an explicit shared-reference policy is approved.
10. DTE does not generate or prescribe academic classification values.

## 11. Open requirements

- Institution-provided framework file/source.
- Exact field types required in Phase 1.
- Whether multiple independent frameworks can be active for one institution.
- Shared/global versus institution-owned governance.
- Approval roles and evidence.
- Localization requirements.
- Export format and downstream version contract.

## 12. Approval

- Product owner: Pending
- Academic authority: Pending
- Architecture: Pending
- Implementation authorization: Not granted

## 13. Change history

| Version | Date | Status | Change |
|---|---|---|---|
| 0.1.0 | 2026-11-06 | Draft | Initial framework configuration specification |