# PULSE Engineering Intelligence & Governance System (PEIGS)
## Architecture Specification v1.1 — Audited Review Draft

- **Document ID:** PULSE-GOV-PEIGS-001
- **Version:** 1.1.0
- **Status:** Draft — audited and revised; owner review and approval required
- **Repository baseline:** `main`
- **Working branch:** `docs/peigs-architecture-v1`
- **Scope:** Project-wide engineering registry and development-control methodology
- **Implementation authorization:** Not granted
- **Database authorization:** Not granted
- **Supersedes:** v1.0.0 on this branch only; v1.0.0 remains in Git history

## 1. Executive decision

PULSE should establish one evidence-driven Engineering Intelligence & Governance System (PEIGS). PEIGS is the cross-domain operational index for engineering inventory, traceability, implementation assessments, evidence, findings, dependencies and release verification.

**PEIGS does not replace the PULSE Master Documentation Index, any domain-specific register, a product specification, GitHub, Figma or CI.** Existing domain registers remain detailed authorities for their domain's scope, terminology, requirements and module-level documentation lifecycle. PEIGS stores stable references to those authorities and adds cross-domain traceability and evidence-backed engineering assessments. It must not create a second manually maintained copy of domain requirements or module definitions.

The PULSE Master Documentation Index remains the project-wide navigation and document-authority map. PEIGS becomes the cross-domain implementation/assurance index only after governance approval. Document lifecycle status (Draft/Approved/Superseded) and implementation status (Designed/Implemented/Verified) are separate dimensions.

The architecture is hybrid:
- **GitHub** remains authoritative for source code, version-controlled specifications, architecture decisions, migrations, tests and engineering change history.
- **Supabase/PostgreSQL** is proposed as the operational registry for structured records, relationships, assessments, evidence metadata, approvals, findings and change events.
- **Vercel** supplies deployment and release evidence.
- **Figma** remains the design source where used.
- **CI workflows** supply build and test evidence.
- Integrations discover and report facts; they do not silently grant product, academic, security or release approval.

No database objects, application code, deployment settings or production data are changed by this specification.

## 2. Problem statement and outcomes

The registry must prevent:
1. Rebuilding functionality that already exists.
2. Treating a specification or source file as proof of a working feature.
3. Losing requirement, decision or approval history.
4. Missing dependencies and change impact.
5. Repeating audits without closing findings.
6. Confusing proposed architecture with verified as-built state.
7. Reporting misleading completion percentages.
8. Using stale test or audit evidence after relevant changes.
9. Losing authoritative source links across sessions and contributors.

A future user or coding agent must be able to identify what is required, what exists, what is verified, what is blocked, what changed, who owns it and what should happen next without rediscovering the whole repository.

## 3. Governing principles

1. One canonical identity per tracked artifact.
2. One accountable domain owner per requirement or artifact; multiple controlled contributors are allowed.
3. Many-to-many relationships are first-class. Do not force the product into a single parent-child tree.
4. Requirement-to-implementation and implementation-to-requirement traceability are both required.
5. Target state, as-built state and verification state remain separate.
6. Status is an assessment; evidence is the support for that assessment.
7. Draft is not approved. Approved documentation does not itself authorize implementation.
8. Historical assessments, decisions, approvals and audit findings are preserved.
9. Source paths are locators, not identities. Stable IDs survive renames and moves.
10. Automation may discover and verify technical facts, but must not self-approve subjective or high-impact outcomes.
11. No duplicate institute, person, student, tenant or membership identity model is to be introduced for the registry.
12. Build a modular capability; do not introduce microservices solely to represent registry domains.
13. Do not migrate domain registers wholesale into PEIGS. Link to canonical domain authorities and only normalize cross-domain fields required for traceability and portfolio reporting.
14. Never treat an imported conversation export, generated document, Figma screenshot or branch file as approved product scope without an explicit authority and approval check.
15. Inventory all relevant branches and environments; a main-branch-only scan is not an as-built audit.
16. Preserve source provenance and distinguish directly observed facts from imported claims, inferred relationships and unresolved conflicts.

## 4. Registry scope and tracking granularity

Track these artifact classes:
- Systems and domains.
- Modules and submodules.
- Requirements and acceptance criteria.
- Workflows and business rules.
- Screens, routes and meaningful UI states.
- Reusable UI components and design-system assets.
- Templates and generated document/report formats.
- APIs, events and integration contracts.
- Data entities, fields where material, migrations, policies, functions and triggers.
- Source files, packages and services where they implement meaningful behavior.
- Tests, test suites and verification runs.
- Security controls, operational controls and release artifacts.
- Decisions, audit findings and remediation actions.

Default navigation is System → Module → Screen/Workflow → Feature → Component. This is a browsing convention, not the data model. A feature may span modules and screens; a component may be reused across screens. Use explicit relationships rather than duplicating records.

Do not create a registry record for every decorative icon, CSS declaration or trivial line of code. Track an element separately only when it has independent behavior, reuse, accessibility, validation, ownership, acceptance criteria or audit significance.

## 5. Three distinct inventories

### 5.1 Target inventory — what should exist
Approved requirements, specifications, architecture, workflows, designs, contracts and planned deliverables. Proposed and draft material must remain visibly unapproved.

### 5.2 As-built inventory — what actually exists
Discovered source files, routes, components, APIs, database objects, migrations, policies, tests, design assets and deployments. Each discovered item records source, repository, branch/ref, commit SHA or external version, environment, path/external identifier, observation time and discovery method. Scan all relevant branches, tags, connected services and deployment environments; explicitly record scan coverage and exclusions.

A source item may be present in a branch without being merged, deployed or operational. Record those states independently.

### 5.3 Assurance inventory — what has been verified
Evidence-backed build, test, design, security, migration, workflow, accessibility, performance and release assessments. Verification applies to a specific artifact version and relevant dependency versions. A successful build does not prove feature acceptance; a passing unit test does not prove tenant isolation; a deployment does not prove production readiness.

These inventories are linked but must never be collapsed into one status field.

## 6. Status and lifecycle model

Use independent lifecycle dimensions rather than a universal status:

| Dimension | Example states |
|---|---|
| Requirement | Proposed, approved, rejected, deprecated |
| Architecture | Not started, drafted, reviewed, approved |
| UI/UX | Not started, specified, wireframed, designed, approved |
| Template/asset | Not required, planned, created, validated, approved |
| Frontend | Not started, partial, implemented, integrated |
| Backend/API | Not started, designed, implemented, integrated |
| Data | Not designed, specified, migration drafted, deployed, verified |
| QA | Not tested, in progress, passed, failed, blocked |
| Security | Not assessed, in review, passed, failed, accepted exception |
| Release | Not released, preview, staging, production, rolled back |

Use a separate evidence confidence classification:
- **Verified:** acceptance criteria passed with direct, current evidence.
- **Partially verified:** some criteria passed; others remain.
- **Documented only:** specification exists; implementation is unverified.
- **Observed only:** asset exists; behavior is unverified.
- **Not verified:** evidence is insufficient or absent.
- **Contradictory:** authoritative sources disagree.
- **Blocked:** verification cannot proceed because a named dependency is unresolved.
- **Not applicable:** reason and approving authority are recorded.

Do not treat unknown as failed or complete. Do not calculate a single overall completion percentage. Report coverage metrics only with explicit denominators, evidence rules and freshness.

## 7. Verification freshness and evidence

Every verification assessment must identify:
- Artifact ID and artifact version.
- Source repository, branch/ref and commit SHA where applicable.
- Design version/node where applicable.
- Database migration/schema version where applicable.
- Test suite, run ID, result and timestamp.
- Environment (local, CI, preview, staging or production).
- Reviewer or automated verifier identity.
- Acceptance criteria covered and omitted.
- Evidence links and limitations.

A relevant change marks affected evidence as **stale / reverification required**. Invalidation must be dependency-aware: a UI copy change must not automatically invalidate unrelated database isolation tests. The dependency and test-coverage model determines the impact.

## 8. Logical registry data model

The following are proposed logical entities, not existing database tables. This is a conceptual model, not yet an implementation-ready schema. A separate data specification must define columns, primary/foreign keys, uniqueness, check constraints, indexes, RLS, retention and migration sequencing.

### 8.1 Required logical entities

| Entity | Responsibility |
|---|---|
| `systems` | System and domain catalogue |
| `modules` | Module identity, ownership and boundaries |
| `requirements` | Stable requirement identity, source authority, owner, scope, phase and lifecycle |
| `acceptance_criteria` | Atomic, testable criteria linked to one or more requirements |
| `work_items` | Delivery tasks, defects, remediation and improvements; must not be the only storage for normative requirements |
| `artifacts` | Typed identity for modules, screens, workflows, components, APIs, data objects, files, tests and assets |
| `artifact_relationships` | Typed many-to-many traceability links |
| `dependencies` | Directional technical and operational dependencies |
| `specifications` | Requirement and design document metadata |
| `artifact_versions` | Immutable source/version identity, including commit, design version, schema version or release |
| `status_assessments` | Dimension-specific status, confidence, assessor, rationale, effective time and supersession |
| `source_observations` | Raw discovery/synchronization facts with connector, source ID, observed time and payload hash |
| `sync_runs` | Connector execution, cursor, result counts, errors and last-successful sync |
| `evidence_records` | Evidence metadata and immutable references |
| `verification_runs` | Test, build, audit and release verification executions |
| `audit_findings` | Findings, severity, scope and closure criteria |
| `remediation_actions` | Corrective action, owner, due date and retest |
| `decisions` | Architecture, product, academic and engineering decisions |
| `approvals` | Explicit approval authority, scope, version and timestamp |
| `source_references` | GitHub, Figma, Supabase, CI and deployment locators |
| `change_events` | Append-only history of registry changes |
| `releases` | Release identity, environment, commit and deployment |
| `role_grants` | References to the approved shared identity and authorization model; no new user/person/institute tables |
| `conflicts` | Competing claims, sources, scope, resolution owner and final decision |

### 8.2 Identity and integrity rules

- Every registry entity has an immutable stable ID independent of its name or path.
- Every artifact has a controlled `artifact_type`; do not use unvalidated polymorphic IDs without integrity enforcement.
- Requirements and acceptance criteria are first-class records, not free-text fields embedded only in work items.
- Every relationship has a type, source/target IDs, provenance, validity period and optional confidence; enforce allowed source/target types.
- Every assessment is append-only or supersedes a prior assessment. Do not overwrite historical state.
- Every approval binds to the exact artifact/requirement version and scope approved. A later version does not inherit approval automatically.
- Every evidence record points to an immutable external reference or content hash, with access controls and retention metadata.
- Tenant scope is explicit. Shared/global artifacts and institute-owned extensions must be distinguishable. Cross-tenant integrity must be enforced, not inferred from UI context.
- Use controlled vocabularies per status dimension and validate allowed transitions. Do not let arbitrary strings become workflow states.
- Deactivation/retirement is preferred to hard deletion for referenced records. Corrections are new events or versions.

Use typed relationship kinds, for example: `satisfies`, `implements`, `appears_on`, `uses_component`, `calls_api`, `reads_entity`, `writes_entity`, `tested_by`, `verified_by`, `depends_on`, `supersedes`, `derived_from` and `documents`.

Traceability relationships and dependency relationships are distinct. A requirement may be implemented by a feature without being a runtime dependency of it.

Do not implement this logical model as a single wide table or a JSON-only document store. Normalize identities and relationships; use JSON only for bounded, versioned evidence payloads where justified.

## 9. Audit and finding lifecycle

Standard audit domains:
1. Requirements and acceptance.
2. Scope and ownership.
3. Architecture and boundaries.
4. UI/UX and interaction states.
5. Frontend and code quality.
6. Backend and API behavior.
7. Data integrity and migrations.
8. Integration and dependency behavior.
9. Security, privacy and tenant isolation.
10. Testing, reliability and performance.
11. Deployment and operational behavior.

Each finding requires a stable ID, affected artifact, severity, description, evidence, root cause (when known), owner, remediation action, acceptance criteria, retest evidence and closure authority.

Finding lifecycle:
**Open → Triaged → Assigned → Remediation in progress → Ready for retest → Verified closed**.
Reopen a finding if retest fails or the defect recurs. A parent module cannot be declared fully accepted while critical unresolved findings remain.

## 10. Approval and responsibility model

Separate contribution from approval:
- **Contributor/developer:** proposes changes and supplies implementation evidence.
- **Module owner:** confirms domain ownership and functional acceptance.
- **Product/academic owner:** approves product behavior and academic correctness where relevant.
- **QA reviewer:** verifies test coverage and results.
- **Security/privacy reviewer:** approves relevant controls and exceptions.
- **Release authority:** authorizes release according to the project policy.
- **Registry administrator:** manages registry structure and access; cannot override domain approvals merely by editing records.

A person may hold multiple roles, but approval records must state the authority exercised. High-risk changes require independent review. Automated CI may verify a test result, not approve academic correctness or security risk acceptance.

## 11. Source and platform ownership

| Platform | Canonical responsibility |
|---|---|
| GitHub | Source code, specifications, architecture decisions, migrations, tests and version-controlled engineering documents |
| Supabase | Operational registry records, relationships, assessments, approvals, findings and evidence metadata |
| Vercel | Deployment records and environment/release evidence |
| Figma | Design source and design-version references |
| GitHub Actions / CI | Build, typecheck, test and workflow evidence |
| Codex / coding agents | Execute approved tasks and report evidence; never self-authorize scope or production changes |

The registry stores stable external identifiers and links. It should not duplicate full source files or make a second copy the authoritative version.

### 11.1 Authority and conflict precedence

| Information type | Primary authority | PEIGS treatment |
|---|---|---|
| Product/domain requirements | Approved domain specification or approved decision | Link and trace; do not rewrite |
| Cross-project document navigation and authority map | PULSE Master Documentation Index | Link to and reconcile with this index |
| Domain module/scope register | Existing domain register (for example, DTE registers) | Preserve as detailed authority; index its IDs and references |
| Source code as-built state | Exact GitHub commit and branch | Discover and assess; never infer from documentation |
| Database as-built state | Live Supabase catalog plus applied migration history | Compare with migration files; record drift |
| Design as-built state | Exact Figma file/page/node/version | Link and verify; screenshots are not canonical design sources |
| Test result | Exact CI/test run | Store immutable run reference and result |
| Deployment state | Exact deployment/environment record | Store release evidence |
| Approval | Authorized human approval event | Never infer from commit, document presence or status text |

When two authoritative sources disagree, create a conflict record. Do not silently select the newest file or the most recently edited conversation. Resolve through the named domain/product authority and record the decision.

## 12. Automation policy

Automation is introduced only after the initial inventory and data model are validated. Start with read-only discovery and reporting; write-back synchronization is a later controlled increment.

**Automatically discovered:** commits, files, routes where reliably extractable, migration files, database catalog objects, CI runs and deployments.

**Automatically verified:** exact build/test outcomes, migration presence, deployment state and machine-checkable policy checks.

**Human assessed:** requirement approval, academic correctness, visual acceptance, security risk acceptance, exception approval and release authorization.

Automation must be idempotent, observable, retry-safe and source-attributed. Discovery must not create false approval. Unmatched assets enter an orphan-review queue.

Initial automated checks should identify:
- Requirements without implementation links.
- Implementations without approved requirements.
- Components without owners.
- Screens without approved specifications.
- APIs/data entities without owners or consumers.
- Tests without requirement/feature coverage.
- Stale verification evidence.
- Open findings without remediation owners.
- Conflicting or superseded documents still referenced as canonical.

## 13. Operating views

All views must query the same canonical records:
1. Executive health overview.
2. System/module explorer.
3. Requirement and feature traceability.
4. Screen and UI/UX tracker.
5. Component and template library.
6. Code/API/database inventory.
7. Audit and remediation workspace.
8. Dependency and change-impact explorer.
9. Documentation and decision index.
10. Release and environment view.
11. Work queue and blocked-items view.

The interface must support filters, saved views, server-side pagination and bounded search. It must not load the entire registry or question bank into the browser.

## 14. Development Control Protocol

Before starting any task, a developer or coding agent must:
1. Search the registry for the requirement and related artifacts.
2. Read the authoritative approved specification and relevant decisions.
3. Inspect current source across relevant branches and exact commit SHAs; inspect live connected systems where required.
4. Confirm the applicable product phase and domain authority before treating a planned screen/module as current scope.
5. Compare target, as-built and assurance inventories.
5. Identify existing implementation and reusable components.
6. Inspect dependencies and change impact.
7. Record gaps, assumptions and conflicts.
8. Define a plan and acceptance criteria.
9. Obtain required approvals.
10. Implement the smallest reviewable change.
11. Run relevant tests and capture exact evidence.
13. Update registry records, source references, findings and next actions.

If a critical fact is unknown, record it as unknown and investigate. Do not silently infer completion or invent source links.

## 15. Implementation phases

| Phase | Deliverable | Exit condition |
|---|---|---|
| 0 | Governance and source reconciliation | Canonical authorities, branch coverage, scope/phase conflicts and domain-register boundaries are recorded |
| 1 | Data architecture and threat model | Detailed schema, identity/RLS model, retention and sync design approved |
| 2 | Inventory pilot | One representative System A workflow and one in-scope DTE framework workflow traced end-to-end; existing System A and DTE inventories remain separate |
| 3 | Registry MVP | Search, source links, traceability, status dimensions, evidence and findings work on the pilot |
| 4 | Controlled expansion | Complete remaining System A and DTE scope inventories; add other PULSE domains only after owner validation |
| 5 | Read-only integrations | GitHub branches, Supabase catalog, CI, Vercel and Figma discovery synchronized with provenance |
| 6 | Verified automation | Dependency impact, stale-evidence and orphan detection tested against known changes |
| 7 | Operational governance | Recurring audits, work queues, access reviews and release gates adopted |

System A and System B must first be inventoried independently, then reconciled against shared platform ownership. Do not merge their domain responsibilities into a single module model.

**Phase control:** the GitHub DTE governance baseline currently describes an offline framework/operating-process phase and explicitly defers digital question inventory, upload and digital question-to-tag mapping. The uploaded System B Part 2 export also reports a 49-screen functional/interaction specification and a Figma design file with design foundations and only an initial subset of screens designed. These are different dimensions and potentially different scope generations. PEIGS must record the 49-screen set as documented future/target scope unless the product owner explicitly approves it for the current phase; it must not automatically classify all 49 screens as current implementation commitments. The reported Figma state must be re-verified against the live Figma file before an as-built design status is asserted.

**System A control:** the uploaded System A specification requires source-independent daily tracking and explicitly says it must not depend on QBMS or DTE. The initial pilot should therefore validate the assignment → student-question obligation → evidence/attempt lifecycle without requiring question taxonomy completion.

## 16. Explicit non-goals

PEIGS is not:
- A replacement for GitHub, Supabase, Figma or CI.
- A project-management clone with every minor activity tracked.
- A claim that all PULSE modules are implemented.
- A mechanism for automatically approving code or architecture.
- A reason to create microservices.
- A reason to duplicate existing academic identities or question/student data.
- A license to apply database migrations or deploy application changes.

## 17. Risks and controls

| Risk | Control |
|---|---|
| Registry becomes bureaucratic | Track meaningful artifacts only; automate discovery |
| Incorrect imported status | Re-audit against evidence; retain source claim separately |
| Conflicting specifications | Canonical authority map and decision/conflict register |
| Stale verification | Commit/version-aware evidence invalidation |
| Duplicate identities | Reuse approved shared PULSE identity model |
| Cross-tenant leakage | RLS, server-side authorization and cross-tenant tests |
| Automation creates false confidence | Separate discovery, machine verification and human approval |
| Registry becomes a bottleneck | Risk-based approval gates and clear delegated ownership |
| Integration outages | Store last successful sync, source timestamp and sync health |

## 18. Acceptance criteria for this specification

This architecture draft is ready for owner review when reviewers can confirm:
- The hybrid source-of-truth boundaries are clear and consistent with the Master Documentation Index and domain registers.
- Domain registers remain detailed authorities; PEIGS does not duplicate them.
- Target, as-built and assurance inventories are separate.
- Branch, commit, environment and external design-version coverage is explicit.
- The current DTE phase boundary and System A independence invariant are preserved.
- The data model has first-class requirements, acceptance criteria, artifact versions, source observations, sync runs and conflicts.
- Tracking granularity avoids both under-tracking and element-level bureaucracy.
- Status dimensions and evidence confidence are distinct.
- IDs, relationships, dependencies and version history are defined.
- Audit findings have remediation and closure lifecycles.
- Human approval authority is explicit.
- Automation is constrained to evidence-backed tasks.
- System A and System B retain independent domain ownership.
- No production implementation is implied by this approval.

## 19. Decisions intentionally deferred

The following must be resolved during detailed design, not guessed in this draft:
- Exact mapping to the existing shared PULSE identity and role tables, after live schema and policy audit.
- Whether registry access is platform-admin-only initially or supports institute-level views, subject to threat modelling.
- Evidence file storage and retention policy.
- Exact SQL column types, indexes, partitioning and RLS policies.
- GitHub webhook versus scheduled synchronization details.
- Figma integration depth and available identifiers.
- Retention periods and privacy/legal review.
- Exact UI route and design-system choices.

## 20. Approval record

| Role | Decision | Reviewer | Date | Notes |
|---|---|---|---|---|
| Product owner | Pending | — | — | |
| Architecture reviewer | Pending | — | — | |
| Data/security reviewer | Pending | — | — | |
| QA/operations reviewer | Pending | — | — | |

**Current disposition:** Review draft only. No Supabase migration, application implementation, repository reorganization, production deployment or release is authorized.


## 21. Audit corrections introduced in v1.1.0

The v1.0.0 draft was reviewed against the existing PULSE Master Documentation Index, repository governance blueprint, DTE module register and phase disposition, root agent instructions, architecture/database governance documents, and the uploaded System A/System B exports.

Corrections:
1. Clarified that PEIGS is a cross-domain engineering/assurance index, not a replacement for domain registers or the Master Documentation Index.
2. Added an authority-precedence matrix and explicit conflict records.
3. Required all relevant branches, commits and environments to be inventoried; main-only inspection is insufficient.
4. Expanded the conceptual data model with first-class requirements, acceptance criteria, source observations, sync runs and conflict records.
5. Added integrity, version-bound approval, controlled status vocabulary and tenant-boundary rules.
6. Added explicit DTE phase controls: the current GitHub DTE baseline defers digital question upload/inventory/tagging; the uploaded 49-screen System B export is not automatically current-phase scope.
7. Added a System A pilot invariant: daily tracking must function independently of QBMS/DTE.
8. Changed delivery sequencing to a representative pilot before broad inventory and integrations.
9. Required read-only discovery before controlled write-back synchronization.

This audit is a design/document review, not a live Figma verification, complete all-branch code audit, database security certification or product-owner approval.

## 22. Change history

| Version | Status | Change |
|---|---|---|
| 1.0.0 | Superseded draft | Initial PEIGS architecture proposal |
| 1.1.0 | Audited review draft | Authority hierarchy, source precedence, branch coverage, data-model integrity, phase boundaries and pilot sequence corrections |
