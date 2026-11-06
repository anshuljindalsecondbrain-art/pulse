# PULSE — Repository File Inventory and Disposition Matrix

- Document ID: PULSE-GOV-REPO-002
- Version: 0.1.0
- Status: Draft — audit baseline; pending owner review
- Repository: anshuljindalsecondbrain-art/pulse
- Audited branch: main
- Audit date: 2026-11-06
- Related baseline: [Repository Architecture and Documentation Governance Blueprint](PULSE_REPOSITORY_ARCHITECTURE_AND_DOCUMENTATION_GOVERNANCE_BLUEPRINT.md)
- Implementation authorization: Not granted

## 1. Purpose

This document inventories every tracked path visible in the recursive Git tree of the `main` branch at the audit point and proposes a disposition for each file. It is intended to prevent loss of context, duplicate sources of truth, broken cross-references and accidental scope changes as the repository grows.

This is a documentation governance artifact. It does not itself authorize file moves, deletion, consolidation, code changes, database changes or deployment.

## 2. Audit method and limits

The repository tree was fetched recursively from GitHub. The tree response reported `truncated: false`. All tracked file paths returned by that response are listed below.

Content inspection was performed on the root agent instructions, README, architecture baseline, database governance, development roadmap, project master plan, decision log, core module specifications, DTE master registers, DTE scope/disposition/audit documents, Phase 1 requirements and current-phase boundary decision. Other DTE module specifications and supporting decisions were inventoried by their tracked path, file identity and the existing DTE register/disposition documentation; this matrix is not a line-by-line semantic review of every paragraph in every module file.

No source-code directory, package manifest, test directory, migration directory, Supabase configuration, or CI workflow appeared in the inspected recursive tree. This is a statement about the returned `main` tree only; it does not establish that no implementation exists in another repository, branch, connected service or deployment.

## 3. Disposition vocabulary

| Disposition | Meaning |
|---|---|
| RETAIN | Keep at current path as a valid artifact; update links/indexes when governance is established. |
| RETAIN / REVIEW | Keep, but inspect for freshness, authority, duplication or scope alignment before treating as canonical. |
| CANONICAL CANDIDATE | Potential authoritative document for a defined subject, pending owner approval and conflict review. |
| RECONCILE | Compare against other documents and explicitly designate authority; do not merge or delete yet. |
| NARROW / REVISE | Existing artifact may remain useful, but its content or scope requires a controlled revision before implementation. |
| DEFERRED REFERENCE | Preserve as future-phase or historical reference; do not treat as current implementation scope. |
| ARCHIVE CANDIDATE | Potentially superseded or historical; archive only after dependency/link review and owner approval. |
| NEW ARTIFACT REQUIRED | A missing governance artifact should be created in a later approved step. |

## 4. Repository-level findings

### 4.1 Verified observations

1. The inspected `main` tree contains 50 tracked files across the root, `docs/`, project governance, general project documentation, decisions and DTE documentation.
2. The repository currently has no visible application source tree, package manifest, automated test tree, migration directory or CI workflow in the inspected tree.
3. General project governance documents coexist with a detailed DTE-specific documentation system.
4. The repository has both general DTE specification material under `docs/modules/` and a dedicated DTE documentation set under `docs/dte/`.
5. The DTE directory contains a master register, module register, responsibility matrix, glossary, scope roadmap, audits, phase documents, decisions and M01–M18 specifications.
6. The DTE current-phase boundary explicitly distinguishes offline framework/operating-process management from later question upload and digital question tagging.
7. `README.md` contains a repository-status sentence claiming the initial audit found only the README on `main`. That sentence is inconsistent with the current tree and must be corrected through a separately reviewed documentation update.
8. `AGENTS.md` provides detailed agent workflow, architecture, database safety, tenant security and reporting rules. It should be treated as a high-priority agent-governance artifact, subject to alignment with approved project decisions.

### 4.2 Governance risks

- **Authority ambiguity:** project-wide architecture and DTE-specific documents may overlap. A master index must identify the authoritative artifact for each subject.
- **Duplicate or divergent scope:** the general DTE specification and the detailed DTE Phase 1 documents may describe different scope generations. Preserve both until a controlled reconciliation is complete.
- **Stale repository narrative:** README's audit statement is outdated.
- **Cross-document traceability gap:** no project-wide requirements-to-UX/API/data/code/test/release matrix is visible in the inspected tree.
- **No visible UI/UX register:** screens, states, role access and interaction contracts are not discoverable through a dedicated central register.
- **No visible API/event register:** module-to-module contracts are not centrally indexed.
- **No visible project-wide data dictionary/entity register:** database governance exists, but the tree does not show a central entity/field catalogue.
- **Implementation state is unverified:** documentation describes proposed architecture and workflows; it must not be treated as proof of deployed code or live schema.

## 5. File-by-file inventory and proposed disposition

### 5.1 Root-level governance

| Path | Artifact type / subject | Proposed disposition | Notes / required action |
|---|---|---|---|
| `AGENTS.md` | AI coding-agent operating rules | CANONICAL CANDIDATE | Retain at root. Cross-check against approved governance, especially approval gates and repository workflow. |
| `README.md` | Repository entry point and navigation | NARROW / REVISE | Retain at root. Correct stale audit statement and later add links to approved governance index and registers. Do not rewrite until this matrix is approved. |

### 5.2 Project-wide governance and architecture

| Path | Artifact type / subject | Proposed disposition | Notes / required action |
|---|---|---|---|
| `docs/00_PROJECT_GOVERNANCE/PULSE_REPOSITORY_ARCHITECTURE_AND_DOCUMENTATION_GOVERNANCE_BLUEPRINT.md` | Repository structure and documentation governance | CANONICAL CANDIDATE | Proposed governance baseline. Draft; owner approval pending. |
| `docs/ARCHITECTURE.md` | Logical architecture and domain boundaries | RECONCILE | Explicitly proposed, not as-built. Align with approved product boundaries and later verified implementation audit. |
| `docs/DATABASE_GOVERNANCE.md` | Database safety, migrations, RLS and audit rules | CANONICAL CANDIDATE | Retain as project-wide database governance; reconcile with any future Supabase-specific runbook. |
| `docs/DEVELOPMENT_ROADMAP.md` | Proposed delivery phases | RECONCILE | Proposed sequence. Align with approved scope, dependencies and actual codebase audit before treating as execution plan. |
| `docs/PROJECT_MASTER_PLAN.md` | Product vision and project domains | CANONICAL CANDIDATE | Retain as product-level direction; separate vision from approved requirements and verified implementation. |
| `docs/decisions/DECISION_LOG.md` | Project-wide decision register | CANONICAL CANDIDATE | Retain as index for project-wide decisions. Define relationship to domain-specific decision records. |

### 5.3 General module specifications

| Path | Artifact type / subject | Proposed disposition | Notes / required action |
|---|---|---|---|
| `docs/modules/DTE_SPECIFICATION.md` | Earlier/general DTE specification | RECONCILE / ARCHIVE CANDIDATE | Compare requirement-by-requirement with current DTE scope, phase boundary and M01–M18 register. Preserve until links and unique content are mapped. |
| `docs/modules/STUDENT_TRACKING_SPECIFICATION.md` | Student Tracking product/module specification | RETAIN / REVIEW | Keep as current specification candidate. Review against Student Tracking ownership, school diary workflow, lightweight question references and independence from deep tagging. |

### 5.4 DTE governance and master registers

| Path | Artifact type / subject | Proposed disposition | Notes / required action |
|---|---|---|---|
| `docs/dte/DTE_CANONICAL_GLOSSARY.md` | DTE terminology | CANONICAL CANDIDATE | Retain as DTE terminology authority after conflict review with project-wide glossary, if created. |
| `docs/dte/DTE_MASTER_DOCUMENTATION_REGISTER.md` | DTE artifact index and status | CANONICAL CANDIDATE | Retain as DTE-specific register. Later link it to the project-wide master documentation index; do not duplicate its detailed module status. |
| `docs/dte/DTE_MODULE_PHASE_DISPOSITION.md` | M01–M18 phase disposition | CANONICAL CANDIDATE | Retain as the detailed DTE module phase map; keep implementation authorization distinct from disposition. |
| `docs/dte/DTE_MODULE_REGISTER.md` | DTE module catalogue | CANONICAL CANDIDATE | Retain as module identity/name/summary register. Clarify its distinction from phase disposition. |
| `docs/dte/DTE_MODULE_RESPONSIBILITY_MATRIX.md` | DTE module ownership and boundaries | CANONICAL CANDIDATE | Retain; reconcile with module specs and current phase scope. |
| `docs/dte/DTE_PRODUCT_SCOPE_AND_PHASE_ROADMAP.md` | DTE scope and phase roadmap | RECONCILE | Retain; align with current-phase boundary decision and master roadmap. Explicitly mark proposed vs approved phases. |

### 5.5 DTE audit records

| Path | Artifact type / subject | Proposed disposition | Notes / required action |
|---|---|---|---|
| `docs/dte/audits/DTE_18_MODULE_AUDIT.md` | Earlier M01–M18 audit | RETAIN / ARCHIVE CANDIDATE | Preserve as audit history; compare findings with later audits before designating current audit authority. |
| `docs/dte/audits/DTE_DOCUMENTATION_REGISTER_AUDIT_001.md` | Earlier register audit | RETAIN / ARCHIVE CANDIDATE | Preserve audit history; link to subsequent register revisions. |
| `docs/dte/audits/DTE_FULL_DOCUMENTATION_AUDIT_002.md` | Comprehensive DTE documentation audit | CANONICAL CANDIDATE | Current consolidated audit candidate. Confirm all remediation actions are reflected in live registers. |
| `docs/dte/audits/DTE_SCOPE_COMPLIANCE_AUDIT_001.md` | DTE scope compliance audit | RETAIN | Preserve as scope-control evidence; reconcile any findings with current phase decision. |
| `docs/dte/audits/DTE_SEMANTIC_SCOPE_AUDIT_001.md` | Semantic scope audit | RETAIN | Preserve as audit evidence; verify remediation closure. |
| `docs/dte/audits/DTE_SEMANTIC_SCOPE_REMEDIATION_001.md` | Semantic scope remediation record | RETAIN | Preserve as remediation evidence; link each action to current authoritative specification. |

### 5.6 DTE current-phase specifications

| Path | Artifact type / subject | Proposed disposition | Notes / required action |
|---|---|---|---|
| `docs/dte/current-phase/DTE-P1_FRAMEWORK_CONFIGURATION_SPECIFICATION.md` | Phase 1 framework configuration | CANONICAL CANDIDATE | Current-phase specification candidate; ensure institution owns academic structure and no universal hierarchy is imposed. |
| `docs/dte/current-phase/DTE-P1_OFFLINE_TAGGING_OPERATING_MODEL.md` | Phase 1 offline operating model | CANONICAL CANDIDATE | Current-phase process baseline; unresolved operational details must remain explicit. |
| `docs/dte/current-phase/DTE-P1_REQUIREMENTS_AND_ACCEPTANCE_BASELINE.md` | Phase 1 requirements and acceptance | CANONICAL CANDIDATE | Retain as requirement-ID baseline; full requirement-to-screen/data/test traceability remains to be created. |
| `docs/dte/current-phase/DTE-P1_TEMPLATE_AND_HANDOFF_SPECIFICATION.md` | Phase 1 templates and handoff | CANONICAL CANDIDATE | Retain; distinguish confirmed requirements from proposed fields and future upload handoff. |

### 5.7 DTE decisions

| Path | Artifact type / subject | Proposed disposition | Notes / required action |
|---|---|---|---|
| `docs/dte/decisions/DTE_CURRENT_PHASE_BOUNDARY_DECISION.md` | Current DTE phase boundary | CANONICAL CANDIDATE | Highest-priority DTE scope reference; draft and pending approval. |
| `docs/dte/decisions/DTE_LOGICAL_QUESTION_IDENTITY_POLICY.md` | Future question identity policy | DEFERRED REFERENCE / RECONCILE | Must not be treated as Phase 1 requirement; reconcile with QBMS/Q-GENOME ownership when future upload is designed. |
| `docs/dte/decisions/DTE_QGENOME_QUESTION_OWNERSHIP_DECISION.md` | Future Q-GENOME ownership decision | DEFERRED REFERENCE / RECONCILE | Preserve as future architecture decision candidate; verify consistency with current PULSE domain ownership. |
| `docs/dte/decisions/DTE_QUESTION_CLASSIFICATION_ATTACHMENT_POLICY.md` | Digital question-to-classification attachment policy | DEFERRED REFERENCE | Future digital tagging concern; must not introduce current-phase question entities or mapping persistence. |

### 5.8 DTE future-phase discovery

| Path | Artifact type / subject | Proposed disposition | Notes / required action |
|---|---|---|---|
| `docs/dte/future-phases/DTE-FUTURE_UPLOAD_AND_DIGITAL_TAGGING_DISCOVERY.md` | Discovery for later upload/digital tagging | DEFERRED REFERENCE | Preserve as future discovery; do not treat as approved design or current implementation authorization. |

### 5.9 DTE module specifications

| Path | Artifact type / subject | Proposed disposition | Notes / required action |
|---|---|---|---|
| `docs/dte/modules/DTE-M01_DASHBOARD_SPECIFICATION.md` | M01 dashboard | NARROW / REVISE | Existing module retained as candidate; rewrite/narrow to current-phase framework and offline work management after approval. |
| `docs/dte/modules/DTE-M02_QUESTION_INVENTORY_SPECIFICATION.md` | M02 question inventory | DEFERRED REFERENCE | Digital question inventory is outside current DTE phase. Preserve for later review. |
| `docs/dte/modules/DTE-M03_TAGGING_STUDIO_SPECIFICATION.md` | M03 tagging studio | NARROW / DEFER | Digital question tagging is future scope. Current phase may cover offline instructions/templates, not a digital question tagging workspace. |
| `docs/dte/modules/DTE-M04_CLASSIFICATION_CONFIGURATION_STUDIO_SPECIFICATION.md` | M04 framework configuration | CANONICAL CANDIDATE | Rewritten Phase 1 v0.2.0 draft; reconcile with Phase 1 framework configuration spec and DTE registers. |
| `docs/dte/modules/DTE-M05_RELATIONSHIP_MAPPING_ENGINE_SPECIFICATION.md` | M05 relationships | NARROW / RECONCILE | Only institution-approved relationships among framework definitions may be current scope; question mapping is future scope. |
| `docs/dte/modules/DTE-M06_ARCHETYPE_MANAGEMENT_SPECIFICATION.md` | M06 archetypes | RETAIN / REVIEW | Conditional current scope only if institution confirms archetypes as approved framework definitions. |
| `docs/dte/modules/DTE-M07_QUESTION_TYPE_MANAGER_SPECIFICATION.md` | M07 question types | RETAIN / REVIEW | Conditional framework configuration scope; avoid creating a question inventory or question assignment workflow. |
| `docs/dte/modules/DTE-M08_PEDAGOGICAL_METADATA_MANAGER_SPECIFICATION.md` | M08 pedagogical metadata | RETAIN / REVIEW | Conditional and institution-defined; confirm exact offline framework need before implementation. |
| `docs/dte/modules/DTE-M09_PYQ_PROVENANCE_MANAGER_SPECIFICATION.md` | M09 PYQ provenance | NARROW / DEFER | Possible offline template fields only if approved; digital provenance repository is later scope. |
| `docs/dte/modules/DTE-M10_REVIEW_APPROVAL_SPECIFICATION.md` | M10 review and approval | CANONICAL CANDIDATE | Rewritten Phase 1 v0.2.0 draft; preserve distinction between technical validation and academic approval. |
| `docs/dte/modules/DTE-M11_VERSION_HISTORY_MANAGER_SPECIFICATION.md` | M11 version and history | CANONICAL CANDIDATE | Rewritten Phase 1 v0.2.0 draft; shared history/governance, not question-version ownership. |
| `docs/dte/modules/DTE-M12_BULK_TAGGING_MANAGER_SPECIFICATION.md` | M12 bulk tagging | SPLIT / DEFER | Current-phase possibility is template/work-package export and offline return validation; digital bulk tagging is future scope. |
| `docs/dte/modules/DTE-M13_VALIDATION_QUALITY_ENGINE_SPECIFICATION.md` | M13 validation and quality | CANONICAL CANDIDATE | Rewritten Phase 1 v0.2.0 draft; validate framework and offline submissions, not digital question inventory. |
| `docs/dte/modules/DTE-M14_COVERAGE_PRODUCTIVITY_ANALYTICS_SPECIFICATION.md` | M14 analytics | NARROW / REVISE | Limit current metrics to framework readiness and confirmed offline operations; defer digital inventory coverage. |
| `docs/dte/modules/DTE-M15_CONFIGURATION_VERSION_MANAGER_SPECIFICATION.md` | M15 configuration versioning | RECONCILE / MERGE CANDIDATE | Potential overlap with M04, M10 and M11; compare responsibilities before deciding whether separate module is justified. |
| `docs/dte/modules/DTE-M16_HISTORICAL_ENRICHMENT_INTERFACE_SPECIFICATION.md` | M16 historical enrichment | DEFERRED REFERENCE | Future integration concern; Student Tracking owns source student evidence. |
| `docs/dte/modules/DTE-M17_AI_ASSISTANCE_INTERFACE_SPECIFICATION.md` | M17 AI assistance | DEFERRED REFERENCE | Future advisory capability; no AI-generated authoritative taxonomy or automatic approval. |
| `docs/dte/modules/DTE-M18_EXTERNAL_ENGINE_INTEGRATION_SPECIFICATION.md` | M18 external integrations | DEFERRED REFERENCE / RECONCILE | Future integration; DRE owns difficulty calculations and external engine contracts require separate approval. |

## 6. Required new project-wide registers and artifacts

These are gaps in the inspected repository tree. They are recommendations, not claims that the artifacts already exist.

| Proposed artifact | Purpose | Proposed location | Priority |
|---|---|---|---|
| Master Documentation Index | One entry point to canonical, supporting, draft, deferred and archived documents | `docs/00_PROJECT_GOVERNANCE/PULSE_MASTER_DOCUMENTATION_INDEX.md` | P0 |
| Requirements Traceability Matrix | Requirement → workflow/module → UI → API/event → data → code → test → release evidence | `docs/00_PROJECT_GOVERNANCE/PULSE_REQUIREMENTS_TRACEABILITY_MATRIX.md` | P0 |
| Module Dependency Map | Ownership, dependencies, upstream/downstream contracts and prohibited coupling | `docs/00_PROJECT_GOVERNANCE/PULSE_MODULE_DEPENDENCY_MAP.md` | P0 |
| UI/UX Screen Register | Screen IDs, routes, roles, states, component specs and linked requirements | `docs/01_PRODUCT_AND_UX/PULSE_UI_UX_SCREEN_REGISTER.md` | P1 |
| API and Event Register | Contract IDs, owners, payload/version references, authorization and consumers | `docs/02_INTERFACE_CONTRACTS/PULSE_API_EVENT_REGISTER.md` | P1 |
| Data Entity Register | Entity IDs, domain owner, tenant scope, lifecycle, relationships and source of truth | `docs/03_DATA_GOVERNANCE/PULSE_DATA_ENTITY_REGISTER.md` | P1 |
| File Disposition Change Log | Approval and evidence for any future move, merge, rename or archive | `docs/00_PROJECT_GOVERNANCE/PULSE_REPOSITORY_CHANGE_REGISTER.md` | P1 |
| As-built System Audit | Verified code, deployment, database, auth, storage, integrations and CI state | `docs/04_TECHNICAL_AUDITS/PULSE_AS_BUILT_SYSTEM_AUDIT.md` | P0 before implementation |

## 7. High-priority reconciliation work

1. **README vs repository tree:** update the stale repository-status statement only after approval of this inventory.
2. **General DTE spec vs DTE governance set:** map unique requirements, conflicts and superseded content. Keep DTE current-phase boundary decision and Phase 1 specifications as the leading candidates, subject to approval.
3. **Architecture vs as-built state:** retain `docs/ARCHITECTURE.md` as proposed logical architecture until actual implementation and services are inspected.
4. **Roadmap vs phase scope:** distinguish proposed sequencing from owner-approved delivery commitments.
5. **M04/M10/M11/M13 module specs vs Phase 1 documents:** establish explicit links and identify which document owns detailed requirements versus module behavior.
6. **M15 vs M04/M10/M11:** resolve overlapping configuration/version lifecycle responsibilities.
7. **Project-wide vs DTE-specific decision records:** define whether domain decisions are linked from the project decision log or indexed through it; avoid duplicate decision text.
8. **Student Tracking vs DTE:** preserve the invariant that student operational evidence and daily tracking do not depend on deep tagging completeness.

## 8. Change-control rules for this inventory

- No file is to be deleted, moved, renamed, merged or overwritten solely on the basis of a proposed disposition in this document.
- Before any move, record old path, new path, stable artifact ID, inbound/outbound links, Git history considerations and owner approval.
- Before any merge, identify unique content and preserve its provenance and decision history.
- Before archiving, update all indexes and links and record the reason and replacement authority.
- A path is not an artifact identity. Stable document IDs should be added/maintained in each canonical document.
- Draft status remains draft until the relevant owner approves it.
- Product-owner approval does not replace academic-authority, architecture, security or QA approval where those authorities are required.

## 9. Acceptance criteria for this inventory

- [x] Recursive `main` tree inspected; GitHub response was not truncated.
- [x] Every tracked file path in the returned tree is listed in this matrix.
- [x] Repository observations are distinguished from inferred or proposed dispositions.
- [x] DTE Phase 1 and future-phase boundaries are reflected in proposed dispositions.
- [x] Missing project-wide registers are identified.
- [ ] Product owner reviews and approves or amends each proposed disposition.
- [ ] Ambiguous/overlapping files receive content-level reconciliation records.
- [ ] Approved dispositions are transferred into the Master Documentation Index.
- [ ] Only after approval, separately authorize and execute any file moves or content changes.

## 10. Approval

- Product owner: Pending
- Architecture owner: Pending
- DTE academic authority (where applicable): Pending
- Repository governance approval: Pending
- File moves/deletions/merges authorized: No

## 11. Change history

| Version | Date | Status | Change |
|---|---|---|---|
| 0.1.0 | 2026-11-06 | Draft | Initial complete tracked-file inventory and proposed disposition matrix based on the inspected main-branch tree |
