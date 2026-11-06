# DTE-M07 — Question Type Manager Specification

- Document ID: PULSE-DTE-M07
- Version: 0.1.0
- Status: Draft — Pending product review
- Parent: docs/dte/DTE_MODULE_REGISTER.md
- Last updated: 2026-11-06

## 1. Purpose

Question Type Manager maintains configurable definitions for question formats and response structures used by tagging workflows, inventory filters and downstream consumers. Question type is a distinct classification dimension and must not be conflated with difficulty, archetype or pedagogical metadata.

## 2. Scope

In scope:
- Create and manage question type definitions.
- Define stable codes, labels, descriptions and applicability.
- Configure optional validation hints or structural expectations.
- Assign question types to questions or exact versions according to the approved mapping policy.
- Support tenant-specific catalogues and approved shared definitions.
- Version and retire definitions while preserving historical references.
- Provide searchable options to Tagging Studio and Question Inventory.

Out of scope:
- Scoring or difficulty calculations.
- Defining question archetypes.
- Authoring or parsing the question content itself.
- Test response evaluation or student analytics.

## 3. Type definition model

Candidate attributes:
- Stable question-type ID.
- Code/key.
- Canonical name.
- Tenant/language-specific display labels.
- Description and usage guidance.
- Optional response/structure category.
- Optional validation hints (e.g. expected option count or response format).
- Applicability constraints.
- Sort/display order.
- Active/deprecated/retired state.
- Scope/ownership.
- Version and audit metadata.

Examples such as single-correct MCQ, multiple-correct MCQ, numerical/integer response, assertion-reason, matching, matrix/multiple-statement or subjective response are illustrative only. The catalogue must remain configurable and must not assume this is a complete universal enum.

## 4. Assignment rules

- Assignment may be to a logical question, exact question version or both depending on the approved data contract.
- The UI must show which identity level the type applies to.
- A question may have one or more types only if the applicable schema explicitly permits it.
- Type assignment is distinct from the archetype link and pedagogical descriptors.
- Changing a type must create an auditable mapping revision.
- Retired types remain readable for historical records but may be unavailable for new assignments.

## 5. Configuration and governance

- Authorized administrators manage the type catalogue.
- Shared/global definitions and tenant-specific extensions follow an explicit governance policy.
- Codes must be stable and must not be reused after retirement.
- Labels may be localized without changing identity.
- Structural validation hints must be advisory or blocking only according to explicit configuration.
- Changes to published type definitions are versioned and reviewed as required.

## 6. UX requirements

- Catalogue list with search, filters, status and scope.
- Create/edit form for code, name, labels, description and applicability.
- Preview of how the type appears in Tagging Studio and Inventory.
- Usage count and linked question references where permission permits.
- Warning before retirement if active mappings exist.
- Historical view for deprecated definitions.

## 7. Validation

Validate unique code within defined scope, required labels, valid applicability constraints, permitted cardinality, and compatibility with the selected schema/version. A retired type must not be silently assigned to new work.

## 8. Security and audit

Enforce tenant and administrative permissions server-side. Record create/update/retire actions and all assignments. Preserve old labels and definitions for historical display. Never delete referenced type definitions destructively.

## 9. Acceptance criteria

1. Question types are configurable, not a hardcoded universal enum.
2. Each type has a stable identity independent of display labels.
3. Question type is separate from difficulty and archetype.
4. Assignment cardinality and identity level are governed by configuration.
5. Retired types remain readable in historical mappings.
6. Type assignment changes are versioned and audited.
7. Inventory and Tagging Studio consume the same authoritative catalogue.
8. Tenant-specific type data is isolated.
9. Validation rules are explicit and testable.
10. No difficulty scoring is implemented.

## 10. Dependencies

- M03 Tagging Studio.
- M04 Classification Configuration Studio.
- M11 Version & History Manager.
- M13 Validation & Quality Engine.
- M15 Configuration Version Manager.

## 11. Open decisions

| ID | Question | Status |
|---|---|---|
| DTE-M07-OD-001 | Is question type assigned to logical question, exact version or both? | Open |
| DTE-M07-OD-002 | Is one type or multiple types allowed per question/version? | Open |
| DTE-M07-OD-003 | Are type catalogues global, tenant-owned or hybrid? | Open |
| DTE-M07-OD-004 | Which example type definitions should be seeded initially? | Open |
| DTE-M07-OD-005 | Can types carry structural validation rules, and which are blocking? | Open |

## 12. Change history

| Version | Date | Status | Change |
|---|---|---|---|
| 0.1.0 | 2026-11-06 | Draft | Initial question type manager specification |

## 13. Approval

- Product owner: Pending
- Technical review: Pending
- Implementation authorization: Not granted