# PULSE — Master Documentation Index

- Document ID: PULSE-GOV-REPO-003
- Version: 0.1.0
- Status: Draft — navigation baseline; pending owner review
- Repository: `anshuljindalsecondbrain-art/pulse`
- Branch baseline: `main`
- Created: 2026-11-06
- Related governance: [Repository Architecture and Documentation Governance Blueprint](PULSE_REPOSITORY_ARCHITECTURE_AND_DOCUMENTATION_GOVERNANCE_BLUEPRINT.md)
- Related inventory: [Repository File Inventory and Disposition Matrix](PULSE_REPOSITORY_FILE_INVENTORY_AND_DISPOSITION_MATRIX.md)
- Implementation authorization: Not granted

## 1. Purpose

This is the project-wide entry point for PULSE documentation. It identifies the current tracked documents, their subject, proposed authority, status and relationship to other artifacts. Domain-specific registers remain responsible for detailed module inventories and lifecycle tracking; this index links to them rather than duplicating their contents.

This index is a navigation and governance aid. It does not approve requirements, architecture, designs, database changes or implementation.

## 2. Reading and authority rules

1. **Draft is not approved.** Every document's own status and approval section governs whether it is approved.
2. **Verified state outranks proposals for as-built claims.** Architecture and roadmap documents describe proposed/target state unless explicitly marked as verified.
3. **One canonical authority per subject.** Where this index says "candidate", owner approval and conflict review are still required.
4. **Domain registers remain detailed authorities for their domain.** The project index provides navigation and cross-domain visibility.
5. **Stable document IDs outrank file paths.** Paths can change; IDs should remain stable.
6. **No implicit implementation authorization.** A specification or index entry does not authorize code, schema, deployment or production changes.
7. **Disposition labels below are proposed.** They reproduce the inventory's recommendations and are not owner-approved file actions.

## 3. Project governance documents

| Document ID | Document | Subject / authority boundary | Status / proposed role |
|---|---|---|---|
| PULSE-GOV-REPO-001 | [Repository Architecture and Documentation Governance Blueprint](PULSE_REPOSITORY_ARCHITECTURE_AND_DOCUMENTATION_GOVERNANCE_BLUEPRINT.md) | Repository organization, documentation lifecycle, IDs, traceability and agent workflow | Draft; project governance baseline candidate |
| PULSE-GOV-REPO-002 | [Repository File Inventory and Disposition Matrix](PULSE_REPOSITORY_FILE_INVENTORY_AND_DISPOSITION_MATRIX.md) | Tracked-file inventory, proposed dispositions and repository gaps | Draft; inventory baseline, owner review pending |
| PULSE-GOV-REPO-003 | [Master Documentation Index](PULSE_MASTER_DOCUMENTATION_INDEX.md) | Project-wide documentation navigation and authority map | Draft; this document |

## 4. Project-wide product and engineering documentation

| Path | Subject | Proposed role / status | Related documents |
|---|---|---|---|
| [`docs/PROJECT_MASTER_PLAN.md`](../PROJECT_MASTER_PLAN.md) | Product vision, domains and strategic direction | Canonical candidate for product-level direction; not proof of implementation | Roadmap, architecture, domain specifications |
| [`docs/ARCHITECTURE.md`](../ARCHITECTURE.md) | Logical architecture, domain boundaries, identity/versioning, tenancy and integration | Proposed logical architecture; reconcile with verified as-built state | Project plan, database governance, decisions |
| [`docs/DEVELOPMENT_ROADMAP.md`](../DEVELOPMENT_ROADMAP.md) | Proposed delivery phases and gates | Proposed sequence; owner approval and audit alignment required | Project plan, architecture, domain specs |
| [`docs/DATABASE_GOVERNANCE.md`](../DATABASE_GOVERNANCE.md) | Database audit, migration safety, data preservation, tenant security and testing | Project-wide database governance candidate | Architecture, AGENTS, future data register |
| [`docs/decisions/DECISION_LOG.md`](../decisions/DECISION_LOG.md) | Project-wide decision log | Decision index candidate; domain decision linking convention to be defined | Architecture and domain decision records |
| [`AGENTS.md`](../../AGENTS.md) | AI coding-agent instructions, architecture invariants, database/security rules and reporting | Root-level agent governance candidate; reconcile with approved governance | All project governance and implementation tasks |
| [`README.md`](../../README.md) | Repository overview and navigation | Entry point; contains a stale audit statement requiring a separately reviewed correction | This index and project governance |

## 5. Domain documentation

### 5.1 Student Tracking

| Path | Subject | Proposed role / status |
|---|---|---|
| [`docs/modules/STUDENT_TRACKING_SPECIFICATION.md`](../modules/STUDENT_TRACKING_SPECIFICATION.md) | Student Tracking module specification | Retain and review as specification candidate; Student Tracking owns operational student work evidence and must not depend on deep tagging completeness |

**Important boundary:** Student Tracking owns attendance, assignments, attempts, doubts, work status and student performance evidence. DTE does not own or gate these operational records.

### 5.2 Deep Tagging Engine (DTE)

The dedicated DTE documentation area is `docs/dte/`. The detailed module and artifact lifecycle remains in the DTE registers.

#### DTE governance and registers

| Path | Subject | Proposed role / status |
|---|---|---|
| [`docs/dte/DTE_MASTER_DOCUMENTATION_REGISTER.md`](../dte/DTE_MASTER_DOCUMENTATION_REGISTER.md) | DTE document inventory, versions and statuses | DTE-specific detailed documentation register candidate |
| [`docs/dte/DTE_MODULE_REGISTER.md`](../dte/DTE_MODULE_REGISTER.md) | DTE module catalogue | DTE module identity and summary register candidate |
| [`docs/dte/DTE_MODULE_RESPONSIBILITY_MATRIX.md`](../dte/DTE_MODULE_RESPONSIBILITY_MATRIX.md) | DTE module responsibility and ownership boundaries | DTE responsibility authority candidate |
| [`docs/dte/DTE_MODULE_PHASE_DISPOSITION.md`](../dte/DTE_MODULE_PHASE_DISPOSITION.md) | M01–M18 phase disposition | DTE phase classification candidate |
| [`docs/dte/DTE_CANONICAL_GLOSSARY.md`](../dte/DTE_CANONICAL_GLOSSARY.md) | DTE terminology | DTE glossary candidate |
| [`docs/dte/DTE_PRODUCT_SCOPE_AND_PHASE_ROADMAP.md`](../dte/DTE_PRODUCT_SCOPE_AND_PHASE_ROADMAP.md) | DTE scope and phase roadmap | Reconcile with current-phase boundary decision and project roadmap |

#### DTE current-phase baseline

| Path | Subject | Proposed role / status |
|---|---|---|
| [`docs/dte/decisions/DTE_CURRENT_PHASE_BOUNDARY_DECISION.md`](../dte/decisions/DTE_CURRENT_PHASE_BOUNDARY_DECISION.md) | Phase 1 offline framework and operating-process boundary | Leading DTE scope candidate; Draft, approval pending |
| [`docs/dte/current-phase/DTE-P1_FRAMEWORK_CONFIGURATION_SPECIFICATION.md`](../dte/current-phase/DTE-P1_FRAMEWORK_CONFIGURATION_SPECIFICATION.md) | Institution-approved framework configuration | Phase 1 specification candidate |
| [`docs/dte/current-phase/DTE-P1_OFFLINE_TAGGING_OPERATING_MODEL.md`](../dte/current-phase/DTE-P1_OFFLINE_TAGGING_OPERATING_MODEL.md) | Offline tagging operating process | Phase 1 process candidate |
| [`docs/dte/current-phase/DTE-P1_TEMPLATE_AND_HANDOFF_SPECIFICATION.md`](../dte/current-phase/DTE-P1_TEMPLATE_AND_HANDOFF_SPECIFICATION.md) | Offline templates and handoff | Phase 1 specification candidate; operational details remain subject to confirmation |
| [`docs/dte/current-phase/DTE-P1_REQUIREMENTS_AND_ACCEPTANCE_BASELINE.md`](../dte/current-phase/DTE-P1_REQUIREMENTS_AND_ACCEPTANCE_BASELINE.md) | Phase 1 requirement IDs and acceptance baseline | Requirements baseline candidate; full engineering traceability remains outstanding |

#### DTE module specifications

| Module | Path | Proposed scope classification |
|---|---|---|
| M01 Dashboard | [DTE-M01](../dte/modules/DTE-M01_DASHBOARD_SPECIFICATION.md) | Narrow/revise for framework and offline operations |
| M02 Question Inventory | [DTE-M02](../dte/modules/DTE-M02_QUESTION_INVENTORY_SPECIFICATION.md) | Deferred; digital question inventory is not Phase 1 |
| M03 Tagging Studio | [DTE-M03](../dte/modules/DTE-M03_TAGGING_STUDIO_SPECIFICATION.md) | Narrow/defer; no digital question tagging workspace in Phase 1 |
| M04 Classification Configuration | [DTE-M04](../dte/modules/DTE-M04_CLASSIFICATION_CONFIGURATION_STUDIO_SPECIFICATION.md) | Rewritten Phase 1 v0.2.0 draft; canonical candidate |
| M05 Relationship Mapping | [DTE-M05](../dte/modules/DTE-M05_RELATIONSHIP_MAPPING_ENGINE_SPECIFICATION.md) | Narrow/reconcile; framework-definition relationships only if approved |
| M06 Archetype Management | [DTE-M06](../dte/modules/DTE-M06_ARCHETYPE_MANAGEMENT_SPECIFICATION.md) | Conditional; confirm institution need |
| M07 Question Type Manager | [DTE-M07](../dte/modules/DTE-M07_QUESTION_TYPE_MANAGER_SPECIFICATION.md) | Conditional framework configuration; not a question inventory |
| M08 Pedagogical Metadata | [DTE-M08](../dte/modules/DTE-M08_PEDAGOGICAL_METADATA_MANAGER_SPECIFICATION.md) | Conditional; confirm approved offline need |
| M09 PYQ Provenance | [DTE-M09](../dte/modules/DTE-M09_PYQ_PROVENANCE_MANAGER_SPECIFICATION.md) | Narrow/defer; offline fields only if approved |
| M10 Review and Approval | [DTE-M10](../dte/modules/DTE-M10_REVIEW_APPROVAL_SPECIFICATION.md) | Rewritten Phase 1 v0.2.0 draft; canonical candidate |
| M11 Version and History | [DTE-M11](../dte/modules/DTE-M11_VERSION_HISTORY_MANAGER_SPECIFICATION.md) | Rewritten Phase 1 v0.2.0 draft; canonical candidate |
| M12 Bulk Tagging | [DTE-M12](../dte/modules/DTE-M12_BULK_TAGGING_MANAGER_SPECIFICATION.md) | Split/defer; offline package handling distinct from digital bulk tagging |
| M13 Validation and Quality | [DTE-M13](../dte/modules/DTE-M13_VALIDATION_QUALITY_ENGINE_SPECIFICATION.md) | Rewritten Phase 1 v0.2.0 draft; canonical candidate |
| M14 Coverage and Productivity | [DTE-M14](../dte/modules/DTE-M14_COVERAGE_PRODUCTIVITY_ANALYTICS_SPECIFICATION.md) | Narrow to confirmed offline operations |
| M15 Configuration Version Manager | [DTE-M15](../dte/modules/DTE-M15_CONFIGURATION_VERSION_MANAGER_SPECIFICATION.md) | Reconcile potential overlap with M04/M10/M11 |
| M16 Historical Enrichment | [DTE-M16](../dte/modules/DTE-M16_HISTORICAL_ENRICHMENT_INTERFACE_SPECIFICATION.md) | Deferred future integration |
| M17 AI Assistance | [DTE-M17](../dte/modules/DTE-M17_AI_ASSISTANCE_INTERFACE_SPECIFICATION.md) | Deferred future advisory capability |
| M18 External Engine Integration | [DTE-M18](../dte/modules/DTE-M18_EXTERNAL_ENGINE_INTEGRATION_SPECIFICATION.md) | Deferred/reconcile future integration boundaries |

#### DTE audits and historical records

| Path | Subject | Proposed role / status |
|---|---|---|
| [DTE full documentation audit](../dte/audits/DTE_FULL_DOCUMENTATION_AUDIT_002.md) | Consolidated DTE documentation audit | Current audit candidate |
| [DTE 18-module audit](../dte/audits/DTE_18_MODULE_AUDIT.md) | Earlier module audit | Preserve as historical audit |
| [DTE register audit 001](../dte/audits/DTE_DOCUMENTATION_REGISTER_AUDIT_001.md) | Earlier register audit | Preserve as historical audit |
| [DTE scope compliance audit](../dte/audits/DTE_SCOPE_COMPLIANCE_AUDIT_001.md) | Scope compliance evidence | Retain |
| [DTE semantic scope audit](../dte/audits/DTE_SEMANTIC_SCOPE_AUDIT_001.md) | Semantic scope audit | Retain |
| [DTE semantic remediation](../dte/audits/DTE_SEMANTIC_SCOPE_REMEDIATION_001.md) | Remediation record | Retain and track closure |

#### DTE decisions and future-phase references

| Path | Subject | Proposed role / status |
|---|---|---|
| [Question identity policy](../dte/decisions/DTE_LOGICAL_QUESTION_IDENTITY_POLICY.md) | Future question identity policy | Deferred reference; not Phase 1 |
| [Q-GENOME ownership decision](../dte/decisions/DTE_QGENOME_QUESTION_OWNERSHIP_DECISION.md) | Future question ownership boundary | Deferred reference; reconcile when upload is designed |
| [Question classification attachment policy](../dte/decisions/DTE_QUESTION_CLASSIFICATION_ATTACHMENT_POLICY.md) | Digital question-to-classification mapping | Deferred reference; not Phase 1 |
| [Future upload and digital tagging discovery](../dte/future-phases/DTE-FUTURE_UPLOAD_AND_DIGITAL_TAGGING_DISCOVERY.md) | Later question upload and digital tagging discovery | Future-phase discovery only |

### 5.3 General/legacy DTE specification

| Path | Subject | Proposed role / status |
|---|---|---|
| [`docs/modules/DTE_SPECIFICATION.md`](../modules/DTE_SPECIFICATION.md) | Earlier/general DTE specification | Reconciliation candidate; preserve until unique content and references are mapped against dedicated DTE documentation |

## 6. Documentation gaps — planned registers

The following are not present in the inspected repository tree. They are planned governance artifacts, not existing documents.

| Proposed artifact | Intended authority | Proposed location | Status |
|---|---|---|---|
| Requirements Traceability Matrix | Requirement-to-workflow/module/UI/API/data/code/test/release links | `docs/00_PROJECT_GOVERNANCE/PULSE_REQUIREMENTS_TRACEABILITY_MATRIX.md` | Not created |
| Module Dependency Map | Module ownership, dependency direction and prohibited coupling | `docs/00_PROJECT_GOVERNANCE/PULSE_MODULE_DEPENDENCY_MAP.md` | Not created |
| UI/UX Screen Register | Screen IDs, roles, routes, states, design and dependencies | `docs/01_PRODUCT_AND_UX/PULSE_UI_UX_SCREEN_REGISTER.md` | Not created |
| API/Event Register | API and event contract IDs, owners, payload versions and consumers | `docs/02_INTERFACE_CONTRACTS/PULSE_API_EVENT_REGISTER.md` | Not created |
| Data Entity Register | Data entity IDs, domain owners, tenant scope and lifecycle | `docs/03_DATA_GOVERNANCE/PULSE_DATA_ENTITY_REGISTER.md` | Not created |
| Repository Change Register | Approved moves, merges, renames and archival evidence | `docs/00_PROJECT_GOVERNANCE/PULSE_REPOSITORY_CHANGE_REGISTER.md` | Not created |
| As-built System Audit | Verified application, deployment, database, auth, storage, integrations and CI | `docs/04_TECHNICAL_AUDITS/PULSE_AS_BUILT_SYSTEM_AUDIT.md` | Not created |

## 7. Document lifecycle and ownership

Each document owner must maintain:
- stable document ID;
- title, version, status and canonical path;
- last-updated date and change history;
- applicable phase;
- related requirement, module, workflow, screen, API, data and test IDs;
- approvers and approval evidence;
- supersedes/superseded-by links where relevant.

Lifecycle statuses should be used consistently: Proposed, Draft, In Review, Approved, Implemented, Verified, Superseded, Archived. A document may be Approved but not Implemented; a document may be Implemented but not Verified. Do not collapse these dimensions into one status.

## 8. Change-control rules

- Do not move, delete, merge or rename a document based on this index alone.
- When an approved path change occurs, update this index and inbound links in the same reviewable change.
- Keep domain-specific registers as detailed authorities; this index should link to them.
- Do not duplicate full requirements or decisions into this index.
- Update the index whenever a canonical document is created, retired, superseded or moved.
- Record unresolved conflicts explicitly; do not silently select one source.
- No implementation, migration or deployment authorization is granted by this index.

## 9. Review checklist

- [ ] Confirm project-wide document authority assignments.
- [ ] Confirm DTE register remains the detailed DTE documentation authority.
- [ ] Confirm Student Tracking specification ownership and status.
- [ ] Confirm whether the general DTE specification remains supporting, legacy or superseded.
- [ ] Confirm document owners and approvers.
- [ ] Validate every relative link after any path change.
- [ ] Approve this index as the navigation baseline.

## 10. Approval

- Product owner: Pending
- Architecture owner: Pending
- Domain owners: Pending
- Repository governance approval: Pending
- File moves/deletions/merges authorized: No
- Implementation authorization: Not granted

## 11. Change history

| Version | Date | Status | Change |
|---|---|---|---|
| 0.1.0 | 2026-11-06 | Draft | Initial project-wide index based on the inspected main-branch inventory; proposed authority assignments remain pending review |


## Central Management Control Plane (2026-11-07)

The following documents are the project-wide management entry point. They are draft governance records and do not supersede owner decisions.

- [Central Management Hub](PULSE_CENTRAL_MANAGEMENT_HUB.md) — project/system ownership, authority hierarchy, audit baseline and operating workflow.
- [Source Authority Register](PULSE_SOURCE_AUTHORITY_REGISTER.md) — canonical source by concern and known conflicts.
- [Branch Reconciliation Register](PULSE_BRANCH_RECONCILIATION_REGISTER.md) — branch/PR inventory and safe integration sequence.
- [Documentation Structure and Naming Standard](PULSE_DOCUMENTATION_STRUCTURE_AND_NAMING_STANDARD.md) — target folder taxonomy and safe file-move protocol.
- [Control Plane README](README.md) — navigation entry.

**Current integration warning:** main remains the intended integration baseline. Open PRs and divergent branches are proposals until reviewed and merged. Do not apply SQL from any feature branch. Current live Supabase application schema and migration history are empty; see the hub for audit scope and limits.


## System A and shared database consolidation (2026-11-07)

- [System A and Shared Database Source Consolidation Register](PULSE_SYSTEM_A_AND_SHARED_DATABASE_SOURCE_CONSOLIDATION_REGISTER.md) — proposed canonical document map, branch divergence evidence, M0001 decision preservation, 25-table migration audit and integration gates.
