# PULSE Repository Architecture & Documentation Governance Blueprint

- Document ID: PULSE-GOV-REPO-001
- Version: 0.1.0
- Status: Draft — proposed repository baseline; pending owner review and approval
- Product: PULSE — Multi-Institute Academic Technology Platform
- Repository: `anshuljindalsecondbrain-art/pulse`
- Branch inspected: `main`
- Audit date: 2026-11-06
- Authority: Proposed repository and documentation governance standard
- Implementation authorization: Not granted
- Supersedes: None

## 1. Executive purpose

This blueprint establishes how PULSE repository assets should be organized, named, governed, linked and maintained as the product grows across product requirements, domain modules, UI/UX, architecture, database, APIs, AI systems, source code, tests, deployment and operations.

The goal is not merely a clean folder tree. The goal is traceable engineering: any approved requirement can be followed through its owning module, workflow, screen, API, data model, implementation and tests; any implementation artifact can be traced back to the approved requirement and design that justify it.

This is a proposed target architecture. It does not assert that proposed folders, source code, services, database entities or workflows already exist. It does not authorize code changes, database changes, repository-wide moves, deployment changes or production work.

## 2. Governing principles

1. **One canonical home per subject.** Every concept, rule, decision, contract and specification has one authoritative document. Other documents link to it rather than copy it.
2. **Traceability is mandatory.** Requirements, modules, screens, APIs, entities, migrations, code and tests use stable IDs and explicit relationships.
3. **Separate product domains from engineering disciplines.** Module specifications describe domain behavior; UI/UX, API, data, security and test documents describe cross-cutting engineering artifacts.
4. **Do not confuse logical modules with deployable services.** Folder boundaries do not mandate microservices or separate deployments.
5. **Current state and target state are distinct.** Audits describe verified as-built facts; architecture documents describe proposed or approved target state.
6. **Draft is not approval.** No document or design authorizes implementation until its required owners approve it.
7. **Preserve history.** Prefer additive changes, redirects/index updates and Git history over destructive renaming or duplicated copies.
8. **No speculative proliferation.** Create a separate document only when it has a distinct owner, lifecycle, audience or substantial independent content.
9. **Security is cross-cutting.** Tenant isolation, least privilege, privacy, auditability and data minimization apply to UI, APIs, data, jobs, storage and operations.
10. **Automated agents follow the same governance.** Codex or another agent must read governing instructions, trace the task, plan changes, test and report evidence.

## 3. Repository audit — observed baseline

### 3.1 Verified repository facts

The recursive Git tree of the `main` branch was inspected on 2026-11-06. The visible repository currently contains:
- Root `README.md` and `AGENTS.md`.
- General project documents under `docs/`, including architecture, database governance, roadmap, project master plan and decision log.
- DTE documentation under `docs/dte/`, including audits, current-phase documents, decisions, future-phase discovery, module specifications, registers, glossary and responsibility matrix.
- Legacy/general module specifications under `docs/modules/`, including DTE and Student Tracking specifications.
- The DTE module specification set M01–M18, with selected modules rewritten for the Phase 1 offline-framework scope.

The inspected recursive tree did not show application source directories, package manifests, Supabase migration directories, automated test directories or GitHub Actions workflow files. This is a repository-tree observation only; it does not establish whether a deployed application, external codebase or connected Supabase project exists elsewhere.

### 3.2 Findings and risks

| Finding | Evidence in inspected tree | Risk / required treatment |
|---|---|---|
| General project governance and DTE governance coexist | `docs/*.md` and `docs/dte/*` | Define a project-wide index that links domain registers rather than replacing them |
| DTE documents exist in a dedicated domain folder | `docs/dte/` | Preserve the existing domain structure during initial governance work |
| Older/general module documents coexist with newer DTE module specifications | `docs/modules/` and `docs/dte/modules/` | Mark canonical, legacy, superseded or redirect status; do not silently delete |
| README says initial audit found only README on main | Current tree contains many documents | Correct this stale statement in a separately reviewed README update |
| No central project traceability matrix is visible | No project-wide RTM in inspected tree | Create a controlled requirements-to-engineering traceability system |
| No dedicated UI/UX artifact structure is visible | No UI/UX folders in inspected tree | Establish screen, journey, interaction and design-system documentation homes |
| No project-wide API/data entity catalog is visible | General database governance exists; no central catalogs visible | Create canonical API and data registers before broad implementation |
| No source/migration/test tree is visible | No `src/`, `supabase/`, `tests/` or workflow paths in tree | Treat codebase and deployment state as unverified; perform a separate as-built audit before creating or moving implementation assets |

### 3.3 Existing-file disposition rule

No existing file is to be moved, renamed, deleted, rewritten or treated as obsolete solely because the target tree differs. Each existing artifact must be classified in an inventory with one of:
- **Canonical:** authoritative current home.
- **Supporting:** valid supporting content linked by a canonical document.
- **Legacy:** retained for historical context; not current authority.
- **Superseded:** replaced by an identified newer document.
- **Duplicate candidate:** overlapping content requiring owner review.
- **Unverified:** content or status has not been reviewed.
- **Archive candidate:** may be moved to an archive only after approval and link-impact assessment.

## 4. Target repository architecture

The following is the proposed logical target. It is not an instruction to create all directories immediately. Existing paths may remain canonical where migration would add risk without meaningful benefit.

```text
pulse/
├── README.md
├── AGENTS.md
├── CONTRIBUTING.md                         # proposed
├── .github/
│   ├── PULL_REQUEST_TEMPLATE.md             # proposed
│   ├── ISSUE_TEMPLATE/                      # proposed
│   └── workflows/                           # CI only after implementation audit
│
├── docs/
│   ├── 00_PROJECT_GOVERNANCE/
│   │   ├── PULSE_REPOSITORY_ARCHITECTURE_AND_DOCUMENTATION_GOVERNANCE_BLUEPRINT.md
│   │   ├── MASTER_DOCUMENTATION_INDEX.md
│   │   ├── REQUIREMENTS_TRACEABILITY_MATRIX.md
│   │   ├── MODULE_DEPENDENCY_MAP.md
│   │   ├── ARTIFACT_REGISTER.md
│   │   ├── DOCUMENT_NAMING_AND_ID_STANDARD.md
│   │   └── CHANGE_AND_APPROVAL_PROCESS.md
│   │
│   ├── 01_PRODUCT/
│   │   ├── VISION_AND_OUTCOMES.md
│   │   ├── PRODUCT_SCOPE_AND_ROADMAP.md
│   │   ├── PERSONAS_AND_ROLES.md
│   │   └── PRODUCT_REQUIREMENTS/
│   │
│   ├── 02_DOMAIN_MODULES/
│   │   ├── QBMS/
│   │   ├── DTE/                              # may retain docs/dte during migration
│   │   ├── DRE/
│   │   ├── STUDENT_TRACKING/
│   │   ├── TEST_MANAGEMENT/
│   │   ├── CONTENT_MANAGEMENT/
│   │   └── AI_MENTOR/
│   │
│   ├── 03_SYSTEM_ARCHITECTURE/
│   │   ├── SYSTEM_CONTEXT.md
│   │   ├── CONTAINER_AND_COMPONENT_VIEWS.md
│   │   ├── DOMAIN_BOUNDARIES.md
│   │   ├── SECURITY_AND_TENANCY.md
│   │   ├── EVENT_AND_JOB_ARCHITECTURE.md
│   │   └── ARCHITECTURE_DECISIONS/
│   │
│   ├── 04_UI_UX/
│   │   ├── DESIGN_SYSTEM/
│   │   ├── USER_JOURNEYS/
│   │   ├── SCREEN_REGISTER.md
│   │   ├── SCREEN_SPECIFICATIONS/
│   │   ├── INTERACTION_FLOWS/
│   │   ├── WIREFRAMES_AND_PROTOTYPES.md
│   │   └── ACCESSIBILITY/
│   │
│   ├── 05_DATA_AND_DATABASE/
│   │   ├── DATA_OWNERSHIP_AND_GLOSSARY.md
│   │   ├── ENTITY_REGISTER.md
│   │   ├── ERD/
│   │   ├── DATA_DICTIONARY/
│   │   ├── DATABASE_SECURITY_AND_RLS/
│   │   └── MIGRATION_GOVERNANCE.md
│   │
│   ├── 06_API_AND_INTEGRATIONS/
│   │   ├── API_CATALOGUE.md
│   │   ├── API_CONTRACTS/
│   │   ├── EVENT_CATALOGUE.md
│   │   └── EXTERNAL_INTEGRATIONS/
│   │
│   ├── 07_AI_AND_ANALYTICS/
│   │   ├── MODEL_REGISTER.md
│   │   ├── PROMPT_AND_VERSION_GOVERNANCE.md
│   │   ├── EVALUATION_AND_OBSERVABILITY.md
│   │   └── ANALYTICS_DEFINITIONS/
│   │
│   ├── 08_QUALITY_AND_TESTING/
│   │   ├── TEST_STRATEGY.md
│   │   ├── TEST_CATALOGUE.md
│   │   ├── ACCEPTANCE_CRITERIA/
│   │   ├── SECURITY_TESTING/
│   │   └── PERFORMANCE_TESTING/
│   │
│   ├── 09_DELIVERY_AND_OPERATIONS/
│   │   ├── ENVIRONMENTS.md
│   │   ├── RELEASE_PROCESS.md
│   │   ├── DEPLOYMENT_RUNBOOKS/
│   │   ├── MONITORING_AND_ALERTING.md
│   │   └── BACKUP_AND_RECOVERY.md
│   │
│   └── 10_AUDITS_AND_EVIDENCE/
│       ├── REPOSITORY_AUDITS/
│       ├── SECURITY_AUDITS/
│       ├── DATA_AUDITS/
│       └── RELEASE_EVIDENCE/
│
├── src/                                     # application code, if/when verified
├── supabase/                                # migrations/functions/tests, if applicable
├── tests/                                   # automated test suites, if applicable
└── scripts/                                 # controlled developer/operations scripts
```

### 4.1 Important placement rule

The target tree separates documentation by engineering discipline, but each module remains the owner of its domain behavior. A module's detailed requirements should stay in its domain specification; its screen designs belong in UI/UX; its API contract belongs in API documentation; its schema belongs in data documentation; its executable code belongs in source; its tests belong in test suites. Stable IDs and links connect these artifacts.

### 4.2 DTE migration exception

The current `docs/dte/` folder is already a coherent domain documentation area. It should remain in place until:
1. the project-wide index and traceability standards are approved;
2. every existing DTE file has been inventoried and classified;
3. relative links and register references are mapped;
4. the owner approves whether to retain `docs/dte/` or migrate it to `docs/02_DOMAIN_MODULES/DTE/`;
5. a migration PR preserves Git history and validates links.

Do not create a second copy of all DTE documents under the target path.

## 5. Canonical documentation hierarchy

| Level | Artifact type | Authority / purpose |
|---|---|---|
| L0 | Project governance | Naming, lifecycle, approval, index, traceability and change rules |
| L1 | Product requirements | User needs, product scope, outcomes, roles and acceptance intent |
| L2 | Domain/module specifications | Module responsibilities, workflows, business rules and state transitions |
| L3 | System architecture and decisions | Domain boundaries, system qualities, cross-module decisions and technical rationale |
| L4 | UI/UX, API and data contracts | Screen behavior, interaction contracts, API/event payloads and data ownership/schema |
| L5 | Implementation artifacts | Source code, migrations, configuration and infrastructure definitions |
| L6 | Verification and operations | Automated tests, test evidence, release records, monitoring and runbooks |

An artifact at a lower level must not silently redefine an approved higher-level requirement or decision. If implementation evidence reveals a necessary change, raise a change request and update the authoritative source.

## 6. Artifact IDs and naming conventions

### 6.1 Stable IDs

IDs are permanent identifiers; filenames and display titles may change without changing the ID.

Recommended prefixes:
- Product requirement: `PULSE-REQ-###`
- Non-functional requirement: `PULSE-NFR-###`
- Domain module: `PULSE-MOD-[DOMAIN]-##`
- Workflow: `PULSE-FLOW-[DOMAIN]-###`
- Screen: `PULSE-UI-[DOMAIN]-###`
- Interaction: `PULSE-UX-[DOMAIN]-###`
- API operation: `PULSE-API-[DOMAIN]-###`
- Event: `PULSE-EVT-[DOMAIN]-###`
- Data entity: `PULSE-DATA-[DOMAIN]-###`
- Migration: tool-native ordered migration identifier plus linked change/requirement IDs
- Test case: `PULSE-TC-[DOMAIN]-###`
- Architecture decision: `PULSE-ADR-###`
- Security control: `PULSE-SEC-###`
- Operational procedure: `PULSE-OPS-###`

Domain tokens should be registered once, e.g. `QBMS`, `DTE`, `DRE`, `ST`, `TEST`, `CMS`, `AIM`. Do not reuse an ID after retirement.

### 6.2 Filename convention

Use:
`<DOMAIN>_<ARTIFACT-TYPE>_<SHORT-SUBJECT>.md`

Examples:
- `DTE_MODULE_M04_CLASSIFICATION_CONFIGURATION.md`
- `ST_WORKFLOW_DAILY_CLASSROOM_TRACKING.md`
- `QBMS_UI_QUESTION_CANDIDATE_EDITOR.md`
- `DRE_API_DIFFICULTY_EVALUATION.md`
- `PULSE_ADR_001_QUESTION_IDENTITY_OWNERSHIP.md`

Rules:
- Use uppercase domain and artifact tokens; use underscores consistently.
- Keep filenames descriptive but concise.
- Avoid vague names such as `final.md`, `new2.md`, `latest_spec.md`.
- Do not put mutable version numbers in filenames; version belongs in document metadata and Git history.
- Do not encode approval status in filenames.
- Use README/index files for navigation, not as substitutes for detailed specifications.

### 6.3 Required document metadata

Every controlled specification should begin with:
- Document ID.
- Title.
- Version.
- Status.
- Owner.
- Approvers / approval authority.
- Applicable phase/release.
- Last updated date.
- Canonical path.
- Related requirement/module/decision IDs.
- Implementation authorization status, where relevant.

For UI/API/data/test documents, also include their owning module and upstream/downstream artifact IDs.

## 7. Traceability model — mandatory relationship system

### 7.1 End-to-end chain

Every implemented capability must have traceable links through the following chain where applicable:

```text
Product outcome
   ↓
Requirement (REQ / NFR)
   ↓
Domain module + workflow
   ↓
UI screen + interaction
   ↓
API / event contract
   ↓
Data entity + migration
   ↓
Source code component / service
   ↓
Automated test + acceptance evidence
   ↓
Release / operational evidence
```

Not every feature needs every artifact. A purely internal data job may not have a user screen; a static screen may not require a new database entity. The traceability record must state N/A with rationale rather than inventing a dependency.

### 7.2 Traceability matrix

The project-wide `REQUIREMENTS_TRACEABILITY_MATRIX.md` is the canonical index of relationships. Each row should include:

| Field | Meaning |
|---|---|
| Requirement ID | Stable source requirement |
| Requirement status | Draft / review / approved / superseded |
| Domain/module ID | Authoritative behavior owner |
| Workflow ID | User/business process affected |
| Screen ID | UI entry points, or N/A with reason |
| API/event ID | Contract used, or N/A |
| Data entity ID | Authoritative data affected, or N/A |
| Migration reference | Schema change implementing it, or N/A |
| Code reference | Repository path and symbol/component/service |
| Test ID | Automated/manual verification |
| Decision IDs | Governing architectural/product decisions |
| Release | Planned or delivered release |
| Evidence/status | Not started / designed / implemented / tested / released |

Use stable IDs as primary references; paths are secondary because paths may change.

### 7.3 Dependency map

The project-wide `MODULE_DEPENDENCY_MAP.md` should show:
- Module-to-module dependencies.
- Authoritative data ownership.
- API/event boundaries.
- Synchronous vs asynchronous interactions.
- Dependencies that are optional or phase-gated.
- Prohibited dependency directions.
- External system ownership.

Use Mermaid diagrams where they materially clarify architecture. Every diagram must identify whether it is current/as-built, proposed or approved target state and include a date/version.

### 7.4 Avoiding broken or stale links

- Prefer relative Markdown links for files in the same repository.
- Link by stable artifact ID in addition to path.
- When a file moves, update all known inbound links and the master index in the same PR.
- Do not leave duplicate active copies.
- Use GitHub search and a link-check script/CI check when implementation is established.
- A link checker must distinguish external links from internal canonical references.

## 8. UI/UX documentation standard

UI/UX is a first-class engineering discipline, not a collection of disconnected screenshots.

### 8.1 Required UI/UX registers

- **Screen Register:** Screen ID, name, module owner, role, route, status, design link, requirement IDs, API/data dependencies and test IDs.
- **User Journey Register:** Journey ID, actor, trigger, preconditions, steps, exception paths, completion outcome and related screens.
- **Design System Register:** Tokens, typography, color semantics, spacing, responsive breakpoints, components, variants, accessibility and ownership.
- **Interaction Flow Register:** Trigger, state transition, validation, loading/empty/error/permission states and resulting action.

### 8.2 Screen specification template

Every non-trivial screen specification should define:
1. Screen ID and canonical name.
2. Owning module and user roles.
3. Linked requirements and workflow IDs.
4. User goal and entry/exit paths.
5. Layout regions and component inventory.
6. Data displayed and source of truth.
7. Actions and state transitions.
8. Field validation and business rules.
9. Loading, empty, error, offline and permission-denied states.
10. Responsive behavior.
11. Accessibility requirements.
12. API/event dependencies.
13. Analytics/audit events, if approved.
14. Acceptance criteria and linked tests.
15. Figma/prototype reference, if one exists.

Screenshots and Figma files are supporting design evidence; the screen specification remains the text-based behavioral contract. A screenshot alone is not sufficient to implement a workflow.

## 9. API and integration documentation standard

Every API operation or event should have a stable ID and specify:
- Owning domain/module and operation owner.
- Consumer(s) and authorized roles/scopes.
- Purpose and linked requirements/workflows.
- Method, route or event name.
- Request/response or event schema.
- Field semantics, nullability and validation.
- Authentication, authorization and tenant context.
- Error model and status behavior.
- Idempotency, retry and ordering semantics where relevant.
- Pagination, filtering and rate/size constraints.
- Versioning and backward-compatibility policy.
- Audit/observability requirements.
- Contract tests and examples.
- Data entities read/written and transaction boundary.

No API contract should be inferred solely from frontend usage or a database table name. The contract is documented and reviewed explicitly.

## 10. Data and database documentation standard

### 10.1 Data ownership

Each entity has one authoritative domain owner. Other modules reference it through stable IDs and documented contracts; they must not create duplicate authoritative records.

### 10.2 Entity register

Each entity entry must define:
- Data entity ID and canonical name.
- Owning module.
- Purpose and lifecycle.
- Tenant ownership model.
- Primary identity and alternate keys.
- Relationships and cardinality.
- Version/history behavior.
- Sensitive/PII classification.
- Retention/archive/deletion policy.
- RLS/authorization policy reference.
- API and code consumers.
- Migration(s) and tests.
- Current status: proposed, approved, implemented, deprecated.

### 10.3 ERD and data dictionary

ERDs must show ownership boundaries, tenant relationships, cardinality and key constraints. Data dictionaries define field names, types, nullability, semantics, allowed values and source. A diagram is not a substitute for constraints or migration files.

### 10.4 Migration governance

- Database DDL is delivered through ordered, reviewed migrations.
- Applied migrations are immutable; corrections use forward migrations.
- Each migration links to approved requirement/change IDs, affected entities, tests and rollback/recovery notes.
- Validate in a safe non-production environment before production.
- Production changes require explicit approval.
- Preserve existing data and historical references.
- RLS tests must cover allowed and denied access, including cross-tenant cases.
- Never commit secrets, production exports or student PII.

This blueprint does not assert that Supabase is the verified production database. Existing project documents identify Supabase as a relevant platform, but live environment/schema status requires a separate audit.

## 11. Source code and implementation documentation

When application source is introduced or confirmed, organize by established framework conventions and domain ownership. Do not force a speculative source tree before inspecting the actual codebase.

Expected principles:
- Group domain logic by bounded context, not only by technical file type.
- Keep UI presentation, application orchestration, domain rules and infrastructure adapters distinguishable.
- Avoid circular imports and cross-module direct database access.
- Keep shared utilities small and genuinely shared.
- Use explicit public interfaces for cross-domain calls.
- Keep generated code clearly identified and reproducible.
- Co-locate unit tests where the framework convention supports it; maintain integration/E2E suites in a discoverable test structure.
- Every significant source component/service should reference relevant requirement, module, API/data and test IDs in a nearby README, code comment or metadata catalog where appropriate.
- Do not add comments that merely repeat obvious code; traceability metadata should be concise and useful.

## 12. Testing and quality governance

Testing should map to risk and requirement:
- Unit tests: isolated domain rules and utilities.
- Integration tests: API/data boundaries, authorization and transactions.
- Contract tests: API/event compatibility between modules.
- Database tests: constraints, RLS, migrations, triggers and data integrity.
- End-to-end tests: critical user journeys and role-based behavior.
- Accessibility tests: keyboard, semantics and responsive usability.
- Performance tests: bounded queries, concurrency and large-volume workflows.
- AI evaluation tests: prompt/model versions, quality, safety, regressions and human review gates.

Every approved requirement must have acceptance evidence. A test passing is evidence of behavior, not proof that the requirement itself was approved.

## 13. Architecture decisions and change control

### 13.1 Architecture Decision Records (ADRs)

Create an ADR for decisions with material long-term impact, such as:
- Domain ownership and bounded-context boundaries.
- Question identity/version/placement semantics.
- Tenant model and shared/global data policy.
- Authentication/authorization and RLS model.
- API/event patterns and asynchronous job infrastructure.
- Storage/search strategy.
- Deployment topology and service extraction.
- AI model/provider governance.

Each ADR should include: ID, title, status, context, decision, alternatives considered, consequences, security/data impact, affected artifacts, approvers and supersession links.

### 13.2 Change request workflow

1. Identify the reason and affected artifact IDs.
2. Assess product, workflow, UI, API, data, security, testing, migration and operational impact.
3. Identify backward compatibility and historical data implications.
4. Update the canonical document(s) and traceability links.
5. Provide a concise before/after summary.
6. Obtain the designated approvals.
7. Implement on a focused branch/PR only after authorization.
8. Update tests, migration evidence, indexes and release documentation.
9. Mark replaced documents/artifacts as superseded; preserve history.

No approved document is silently overwritten in meaning. Git history must remain available.

## 14. Document lifecycle and versioning

Status vocabulary:
- Planned
- Draft
- Under Review
- Approved
- Implemented (for specifications with implementation evidence)
- Superseded
- Retired
- Not Applicable

Versioning:
- Major: fundamental change to scope, contract, ownership or compatibility.
- Minor: new capability, workflow, section or materially expanded behavior.
- Patch: clarification, correction or non-semantic editorial update.

Document version is not the same as Git commit SHA or application release version. Record all three where relevant.

Approval must identify the approving authority and date. A status label alone is not evidence of approval.

## 15. Codex and AI coding-agent governance

Before acting, Codex must:
1. Read root `AGENTS.md`, `README.md`, the master index and relevant approved specifications/ADRs.
2. Inspect current branch, repository state, existing implementation, tests and conventions.
3. Locate the requirement and all related artifact IDs.
4. Report missing or contradictory specifications before making assumptions.
5. Produce a scoped implementation plan with files, APIs, data changes, tests, risks and migration impact.
6. Stop when approval is required but absent.
7. Implement only the approved scope.
8. Run relevant tests, type checks, lint/build and security checks available in the repository.
9. Update traceability, API/data/UI documentation, tests and change history in the same PR.
10. Report exact files changed, behavior changed, tests run/results, migration impact, security implications, unresolved risks and evidence.

Agents must not invent an approved requirement, silently change a domain boundary, create an unreviewed migration, or treat an old draft as implementation authority.

## 16. Git workflow and pull-request governance

Proposed standard:
- Keep `main` releasable and protected where repository permissions permit.
- Use short-lived feature branches for substantive changes.
- Use focused pull requests; separate documentation, code and database changes where review clarity requires it, while linking them through one change/requirement ID.
- Require review from the relevant domain owner and technical/security reviewers according to impact.
- Require automated checks when CI is established.
- Do not force-push shared branches or rewrite approved history.
- Use descriptive commits and PRs that reference artifact IDs.
- Link issues, ADRs, requirements and tests.
- Production deployment remains a separate explicit approval gate.

Suggested branch naming:
- `docs/<domain>-<short-topic>`
- `feat/<domain>-<short-topic>`
- `fix/<domain>-<short-topic>`
- `db/<domain>-<short-topic>`
- `test/<domain>-<short-topic>`

Suggested PR checklist:
- [ ] Requirement and approval status identified.
- [ ] Scope and affected modules documented.
- [ ] UI/API/data/security impacts reviewed.
- [ ] Traceability and indexes updated.
- [ ] Tests and evidence added/updated.
- [ ] Migrations reviewed and safe-environment validation recorded, if applicable.
- [ ] No secrets, PII or production exports.
- [ ] Rollback/recovery notes supplied where needed.
- [ ] Reviewer approvals obtained.
- [ ] No unapproved production action.

## 17. Master registers to establish

The following are required project-level control documents. They should be created incrementally, after this blueprint is approved, and must not duplicate domain registers.

| Register | Canonical purpose | Minimum fields |
|---|---|---|
| Master Documentation Index | Find authoritative documents | ID, title, path, owner, version, status, domain, dependencies |
| Artifact Register | Index all traceable engineering artifacts | Artifact ID, type, owner, status, canonical path/link |
| Requirements Traceability Matrix | Link requirement through implementation and tests | REQ, module, workflow, UI, API, data, code, test, release |
| Module Dependency Map | Show ownership and dependencies | Module, owns, consumes, dependency type, phase, direction |
| Screen Register | Index user-facing screens | Screen ID, module, role, route, requirement, design, API, tests |
| API/Event Catalogue | Index integration contracts | Contract ID, owner, consumers, version, auth, schema, tests |
| Data Entity Register | Index canonical data ownership | Entity ID, owner, tenant model, versioning, RLS, migrations |
| ADR Register | Find material decisions | ADR ID, title, status, decision date, approver, affected artifacts |
| Test Catalogue | Trace verification coverage | Test ID, level, requirement, module, automation path, status |
| Release/Evidence Register | Prove what was delivered | Release, PR/commit, artifacts, tests, migrations, approval |

## 18. Phased adoption plan

### Stage 0 — Blueprint review (current)
- Review this blueprint with product and technical owners.
- Resolve target architecture principles and naming/ID choices.
- Explicitly approve or revise the document.
- No repository-wide restructuring or implementation.

### Stage 1 — Repository inventory and classification
- Inventory every tracked file and classify it.
- Identify duplicate/overlapping documents and stale statements.
- Identify canonical vs legacy DTE and general module specifications.
- Map links and dependencies.
- Audit repository branches and determine whether source code exists in another branch/path.
- Deliver a file disposition matrix and migration proposal.

### Stage 2 — Governance navigation foundation
- Establish the master documentation index and artifact register.
- Establish ID/naming standards and document templates.
- Establish the requirements traceability matrix and module dependency map.
- Update README navigation and correct stale repository claims.
- Preserve current file paths until migration is approved.

### Stage 3 — Domain documentation alignment
- Align each product domain's register and specifications.
- Reconcile duplicates such as general DTE module documents vs DTE-specific module documents.
- Add cross-domain ownership and dependency contracts.
- Preserve phase boundaries and approval status.

### Stage 4 — UI/UX, API and data catalogs
- Create screen and user journey registers.
- Create API/event catalogue.
- Create data entity register and ERD/data dictionary.
- Link all artifacts to requirements and module ownership.
- Do not invent screens, APIs or tables before their behavior is approved.

### Stage 5 — Implementation repository alignment
- Audit actual application source, package manifests, deployment and connected database.
- Agree source tree based on verified framework and existing conventions.
- Introduce migration/test/CI folders only where applicable.
- Link implementation paths and migrations back to traceability IDs.
- Use incremental, reviewable moves; preserve Git history.

### Stage 6 — Automated governance
- Add Markdown link checking.
- Validate unique artifact IDs and required document metadata.
- Detect missing traceability links for approved requirements.
- Validate migration naming/order and test evidence where practical.
- Add CI gates only after tooling and repository state are verified.

## 19. Acceptance criteria for this blueprint

| ID | Acceptance criterion |
|---|---|
| GOV-REPO-AC-001 | The repository has one discoverable project-level documentation index. |
| GOV-REPO-AC-002 | Every controlled artifact has a stable unique ID, owner, status and canonical path. |
| GOV-REPO-AC-003 | Each approved requirement is linked to its applicable module/workflow and verification evidence. |
| GOV-REPO-AC-004 | UI screens have a screen ID, module owner, requirements, role, contract dependencies and tests. |
| GOV-REPO-AC-005 | APIs/events and data entities have explicit authoritative owners and consumers. |
| GOV-REPO-AC-006 | Code, migrations and tests can be traced to requirements and approved design artifacts. |
| GOV-REPO-AC-007 | Duplicate or legacy documents are identified and not treated as competing authorities. |
| GOV-REPO-AC-008 | Repository moves preserve history and update inbound links/indexes. |
| GOV-REPO-AC-009 | Draft documents and proposals cannot be mistaken for implementation approval. |
| GOV-REPO-AC-010 | Codex instructions require inspection, traceability, approval gates, tests and reporting. |
| GOV-REPO-AC-011 | Tenant security, data governance and audit requirements are represented across relevant artifacts. |
| GOV-REPO-AC-012 | Automated checks detect broken internal links and duplicate/missing IDs once CI is established. |

## 20. Open decisions

| ID | Decision | Owner | Status |
|---|---|---|---|
| GOV-REPO-OD-001 | Approve proposed top-level documentation domains and numbering | Product Owner + Technical Lead | Open |
| GOV-REPO-OD-002 | Retain `docs/dte/` as canonical or migrate to `docs/02_DOMAIN_MODULES/DTE/` | Product + DTE Owner | Open |
| GOV-REPO-OD-003 | Approve artifact ID prefixes and domain tokens | Product + Architecture | Open |
| GOV-REPO-OD-004 | Choose canonical document status vocabulary and approver roles | Product + Governance | Open |
| GOV-REPO-OD-005 | Determine whether UI/UX source of truth is Figma, repository specs or both, and define authority split | Design + Product | Open |
| GOV-REPO-OD-006 | Confirm actual application source repository/path and branch strategy | Engineering | Open |
| GOV-REPO-OD-007 | Confirm actual Supabase project/environment and migration ownership | Engineering + Database Owner | Open |
| GOV-REPO-OD-008 | Define required PR approvals and branch protection | Repository Owner | Open |
| GOV-REPO-OD-009 | Select link/ID/traceability validation tooling after repository audit | Engineering | Open |
| GOV-REPO-OD-010 | Decide whether domain-specific registers remain standalone with project-level index links | Product + Domain Owners | Open |

## 21. Approval and implementation gate

Required review:
- Product Owner: Pending
- Technical/Architecture Owner: Pending
- Domain Owners: Pending
- UI/UX Owner: Pending
- Database/Security Owner: Pending
- QA/Delivery Owner: Pending

**Current status:** Draft — proposed baseline only.

**Implementation authorization:** Not granted. Approval of this blueprint would authorize the next documentation/governance stage only if explicitly stated by the owner. It would not automatically authorize code changes, database migrations, production deployment or bulk repository restructuring.

## 22. Change history

| Version | Date | Status | Change |
|---|---|---|---|
| 0.1.0 | 2026-11-06 | Draft | Initial repository architecture, documentation governance, traceability, UI/UX, API, data, code, testing and Codex governance blueprint |
