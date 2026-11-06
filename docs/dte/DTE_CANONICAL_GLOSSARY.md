# DTE Canonical Glossary

- Document ID: PULSE-DTE-GLOSSARY-001
- Version: 0.1.0
- Status: Draft — terminology harmonization; not approved for implementation
- Product: PULSE — Deep Tagging Engine (DTE)
- Scope: DTE terminology and cross-system references only
- Last updated: 2026-11-06

## 1. Purpose and authority

This glossary establishes a common working vocabulary for the 18 DTE module specifications. It is intended to prevent different modules from using the same term for different concepts, or different terms for the same concept.

This is a draft terminology baseline. Where a definition depends on an unresolved architecture decision, the entry is explicitly marked **Provisional**. This document does not approve a database schema, API, workflow or implementation.

## 2. Core identity and content terms

| Term | Working definition | Boundary / note |
|---|---|---|
| Question | A stable logical identity representing an academic question independently of a particular wording revision or placement | Does not by itself identify exact content shown to a learner |
| Question Version | An immutable or otherwise historically addressable revision of a question's content and answer-related material | Exact versioning rules remain to be finalized |
| Question Placement / Slot | A contextual occurrence of a question in a book, worksheet, exercise, test, assignment or other content unit | A placement is not a new logical question |
| Question Source | The origin or evidence source from which question content or provenance was obtained | Distinct from tenant ownership and licensing |
| Question Relationship | A typed relationship between two question identities or versions, such as duplicate, near-duplicate, adapted-from or prerequisite-related | Relationship catalogue and endpoint rules require approval |
| Question Identity | The stable identifier and continuity of a logical question across versions and placements | Must not be conflated with a question version or placement |
| Content Owner | The tenant, platform or licensed party with defined ownership/control rights over a question or content asset | Ownership and visibility policy remain open |

## 3. Classification terms

| Term | Working definition | Boundary / note |
|---|---|---|
| Classification Schema | A versioned definition of the classification model available to a tenant or governed scope | Defines structure and rules, not the question's assigned values |
| Schema Version | A specific, immutable or historically addressable revision of a classification schema | Separate from a question's content version |
| Classification Group | A named, configurable grouping of classification fields/nodes used for a particular classification purpose | Must not imply a fixed academic hierarchy |
| Classification Field | A configurable attribute definition used to capture a value or reference during classification | May be scalar, enumerated, relational or another approved data type |
| Classification Node | A governed entity within a classification vocabulary or graph | Not synonymous with a display label |
| Classification Edge | A typed, governed relationship between classification nodes | May represent hierarchy or another relationship type |
| Classification Value | A selected or recorded value for a classification field | Must retain canonical identity where the value references a governed entity |
| Display Label | A localized or tenant-specific human-readable label for an entity or field | Not a canonical identifier |
| Alias | An alternate term or label that resolves to a canonical entity | Alias uniqueness and search behavior require policy |
| Classification Mapping | The governed assignment of one or more classification values/relationships to a question at a defined attachment level | Attachment to logical question, exact version or both remains a critical open decision |
| Mapping Revision | A historically addressable revision of a question's classification mapping | Not the same as schema version or question version |
| Mapping Attachment Level | The identity level to which a mapping applies: logical question, exact question version, placement, or an explicitly approved combination | **Critical policy decision pending** |
| Primary / Secondary Relationship | A governed distinction in the role or precedence of a mapping relationship | Must be defined by relationship type and schema rules, not assumed to be universal |
| Inheritance | A defined rule by which a value or mapping remains applicable across related versions, scopes or entities | No inheritance should be assumed unless explicitly specified |
| Schema Migration | A controlled transformation of mappings from one schema version to another | Must preserve source history and report conflicts |

## 4. Pedagogical and provenance terms

| Term | Working definition | Boundary / note |
|---|---|---|
| Archetype | A reusable identity for a recognizable question pattern, solution strategy or pedagogical structure | Not a mandatory child of a single concept or sub-concept |
| Archetype Version | A revision of an archetype's descriptive or governed content | Exact version impact on linked questions remains to be specified |
| Question Type | A configurable classification of the question's response or interaction format | Separate from difficulty and pedagogical metadata |
| Pedagogical Metadata | Configurable descriptors that communicate teaching, learning or solving characteristics | Examples are not a fixed global enumeration |
| PYQ | Previous-year question appearance or occurrence in a particular examination context | An appearance is not the same as the logical question identity |
| PYQ Appearance | A recorded occurrence of a question in an exam, year, session/shift, paper or question position | One question may have multiple appearances |
| Provenance | Evidence describing where content or a claim originated and how it was verified | Distinct from classification |
| Adapted Question | A question whose content is derived from or materially modified from another question | Must preserve relationship and source evidence; exact adaptation categories remain open |

## 5. Workflow and governance terms

| Term | Working definition | Boundary / note |
|---|---|---|
| Work Status | State of the work item or tagging task, such as unassigned, assigned or in progress | Independent from review and publication |
| Review Status | State of human review, such as not submitted, pending, changes requested, approved or rejected | Exact state machine remains pending |
| Publication Status | Whether a governed mapping or configuration is available for operational consumption | Independent from work and review status |
| Completeness | A derived measure of whether required classification information is present under a specific completeness profile | Not a universal count of hierarchy levels |
| Completeness Profile | A versioned set of required/weighted fields and rules used to evaluate completeness for a defined scope | Owner and lifecycle to be finalized |
| Validation Rule | A deterministic rule that checks structural, semantic or workflow constraints | Must be versioned and traceable to a validation run |
| Validation Run | A recorded execution of a defined rule set against a specified record/version and context | Result must be reproducible or explainably versioned |
| Review Event | A recorded human decision or review action with actor, timestamp, outcome and context | Distinct from a general audit event |
| Audit Event | A trace record of a governed action, including actor, time, target, action and relevant before/after context | Retention and access policy to be defined |
| Configuration Lifecycle | The controlled draft, review, publication, retirement and supersession of configuration versions | M15 owns schema lifecycle policy provisionally |
| Approval | A recorded authorization decision made by an eligible actor under a defined workflow | Approval is not automatically equivalent to publication |
| Archive / Deactivate | A non-destructive lifecycle action that prevents ordinary use while preserving references/history | Avoid destructive cascade deletion |

## 6. AI and integration terms

| Term | Working definition | Boundary / note |
|---|---|---|
| AI Suggestion | A machine-generated candidate classification or metadata proposal | Must not silently become a published mapping |
| AI Evidence | The explanation, source evidence or supporting signals associated with a suggestion | Must be retained according to approved policy |
| Model Version | The exact model/provider version used to generate a suggestion | Separate from prompt and evaluation versions |
| Prompt Version | The versioned instruction/template used for an AI tagging operation | Must be traceable for reproducibility |
| Tagging Run | A bounded execution of manual, bulk or AI-assisted tagging activity | Exact run entity and lifecycle to be finalized |
| External Consumer | A system outside DTE that reads DTE-owned references or receives DTE events | Examples: Student Tracking and DRE |
| Integration Contract | A versioned agreement for identifiers, payloads, authorization, delivery and compatibility between DTE and a consumer | Normative schemas belong in the API/event catalogue |
| Enrichment Event | A notification that a DTE-owned mapping or reference changed and may require consumer-side processing | Does not authorize DTE to mutate consumer-owned evidence |
| External Evaluation Pointer | A reference to an evaluation owned by another engine, tied to an exact question version | DTE does not own DRE formulas or results |

## 7. Version terminology — do not conflate

| Version/revision type | What it versions |
|---|---|
| Question Version | Question content |
| Schema Version | Classification structure and rules |
| Mapping Revision | Classification assignment for a question at the approved attachment level |
| Archetype Version | Archetype definition/content |
| Validation Rule Version | Validation logic |
| Validation Run ID | One execution of validation; not a version |
| AI Model Version | Inference model |
| Prompt Version | AI instruction/template |
| API/Event Contract Version | Consumer-facing interface contract |
| Document Version | This specification artifact |

A change to one version type must not implicitly mutate another. Explicit compatibility and revalidation rules are required.

## 8. Status vocabulary rules

1. Do not use “status” without naming the status dimension.
2. Work, review, publication, validation, configuration lifecycle and bulk-job status are separate.
3. “Approved” does not automatically mean “published”.
4. “Complete” means complete under a named completeness profile and version.
5. “Active” must identify the entity lifecycle and effective scope.
6. “Current” must identify the relevant tenant/scope and version-resolution rule.
7. “Deleted” must not be used as a substitute for archived, retired or deactivated.

## 9. Unresolved terminology/policy decisions

| ID | Decision required | Why it matters |
|---|---|---|
| G-01 | Define mapping attachment level for each mapping category | Question identity and version integrity |
| G-02 | Define whether “classification field” and “classification node” may both hold selectable values and how they differ | Canonical data model |
| G-03 | Define relationship catalogue and endpoint types | Prevent overlapping relationship semantics |
| G-04 | Define global/shared and tenant-owned entity terminology and inheritance | Multi-tenant governance |
| G-05 | Define whether mapping revision is a full snapshot, delta or hybrid | History and reproducibility |
| G-06 | Define exact status vocabularies and transition ownership | Workflow consistency |
| G-07 | Define canonical ID formats and externally exposed identifiers | API stability |
| G-08 | Define how completeness profile versions are pinned to results | Historical analytics consistency |

## 10. Change control

Any term change that affects entity identity, mapping semantics, API meaning, workflow status or historical interpretation must be treated as a governed documentation change. Update this glossary, identify impacted module specifications and contracts, record the rationale, and preserve the previous Git history. Do not treat wording-only edits as approval of an unresolved architecture policy.
