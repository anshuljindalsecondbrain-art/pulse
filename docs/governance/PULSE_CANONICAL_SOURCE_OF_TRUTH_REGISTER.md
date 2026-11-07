# PULSE Canonical Source-of-Truth Register

**Document ID:** PULSE-GOV-SOT-001  
**Version:** 1.0.0  
**Status:** Proposed governance baseline — owner review required  
**Register date:** 2026-11-07  
**Repository:** `anshuljindalsecondbrain-art/pulse`  
**Register branch:** `docs/system-a-database-governance`

---

## 1. Purpose

This register identifies the known repositories, branches, applications, databases and documentation sources associated with PULSE / STUDENT_TRACKING_SYSTEM. It distinguishes current existence from authority.

The register is intended to prevent accidental assumptions that two separately hosted applications share code, identity, schemas or data. It also provides a controlled path toward a future canonical architecture.

**This register does not appoint a canonical application or operational database.** Those choices require explicit Product Owner and Technical Owner decisions supported by source and schema audits.

## 2. Authority vocabulary

| Classification | Meaning |
|---|---|
| **Canonical** | Explicitly designated authority for a stated domain and scope. |
| **Current candidate** | Existing source that may contribute to the future canonical implementation; not yet selected as the authority. |
| **Proposed target** | Intended destination or architecture that has not been approved/implemented as operational authority. |
| **Governance source** | Controlled record of decisions, requirements, specifications or operating rules. |
| **Legacy / existing managed source** | Existing implementation or database retained for evidence and possible controlled extraction; not automatically authoritative. |
| **Experimental / prototype** | Proof-of-concept or development implementation; not production authority. |
| **Unknown / unverified** | Evidence is insufficient to establish current state or authority. |

A source can be authoritative for one domain and non-authoritative for another. Every authority designation must state its scope.

## 3. Executive source-of-truth position

As of this register date:

1. **GitHub repository:** `anshuljindalsecondbrain-art/pulse` is the intended canonical engineering repository. The `main` branch is the eventual canonical integration branch, subject to reviewed integration and release controls.
2. **Governance documentation:** the controlled PULSE governance and decision documents in GitHub are the current record of approved decisions and proposed architecture. A proposal is not an implementation.
3. **Student Tracking Lovable project:** an existing application candidate with its own managed database.
4. **QBMS Lovable project:** a separate existing application candidate with its own managed database.
5. **GitHub System A prototype:** a separate experimental implementation on a feature branch; it is not the same application as the Student Tracking Lovable project.
6. **Standalone PULSE Supabase project:** proposed target operational database, not yet confirmed as canonical and previously observed with no application tables and no applied application migrations.
7. **No shared operational data plane is established by the evidence currently recorded here.** The two Lovable managed databases and standalone Supabase project must be treated as separate environments.

## 4. Source register

### SOT-001 — GitHub repository

| Field | Recorded value |
|---|---|
| Source | GitHub repository |
| Repository | `anshuljindalsecondbrain-art/pulse` |
| URL | https://github.com/anshuljindalsecondbrain-art/pulse |
| Intended authority | Canonical engineering source, subject to governance |
| Canonical integration branch | `main` (eventual target) |
| Current governance work branch | `docs/system-a-database-governance` |
| System A prototype branch | `feat/system-a-abhyas-foundation` |
| Scope | Application code, migrations, tests, technical documentation and reviewed decisions |
| Current limitation | The repository's `main` branch was previously observed to contain documentation rather than the complete application source. |
| Required control | All integration must be reviewed; no direct assumption that a feature/docs branch is production-ready. |
| Status | **Canonical engineering repository intended; branch-level authority is scoped.** |

**Branch rules**
- `main` is the eventual integration authority.
- `docs/system-a-database-governance` is a proposal/governance work branch, not a production release branch.
- `feat/system-a-abhyas-foundation` contains a prototype and candidate implementation assets; it is not integrated authority.
- Preliminary migrations must not be merged unchanged. Reconcile against the approved shared-core decisions and canonical migration history first.
- No PR merge, branch promotion or deployment is authorized by this register.

### SOT-002 — Student_Tracking_System Lovable project

| Field | Recorded value |
|---|---|
| Source | Lovable project |
| Project ID | `3c9c95ba-5fef-4ed2-a758-b5b60bb213f0` |
| URL | https://lovable.dev/projects/3c9c95ba-5fef-4ed2-a758-b5b60bb213f0 |
| Workspace | `My Lovable` |
| Last observed edit | 2026-11-06 |
| Observed state | Ready; unpublished |
| Stack observed | TanStack Start, React 19, TypeScript, Supabase JS, Drizzle ORM |
| Database | Separate Lovable-managed database |
| Observed public base tables | 22 |
| Classification | **Current application candidate / legacy-existing managed source** |
| Authority | Not designated canonical |

**Observed functional areas**
- Authentication layout and admin/teacher dashboards.
- Student, batch and teacher-batch access.
- Curriculum hierarchy.
- Exercise/DPP creation and batch assignment.
- Question status tracking, including Correct, Incorrect, Doubt, Unattempted and Solved by Teacher.
- Completion progress RPC, dashboard reporting and question journey history.

**Known reconciliation risks**
- Existing Auth/user model and role derivation differ from the approved one-Super-Admin internal pilot and shared PULSE identity decisions.
- Existing database is separate from the standalone PULSE Supabase project and QBMS database.
- Existing completion/question-level modes have not yet been proven to implement the approved dual-entry reconciliation contract.
- The earlier source audit identified a blank/unreliable `drizzle/schema.ts`; migrations and live schema require a complete inventory before any extraction or integration.

**Handling rule:** preserve this project as an evidence source. Do not overwrite, repoint, merge or declare it canonical without an approved migration and reconciliation plan.

### SOT-003 — QBMS Lovable project

| Field | Recorded value |
|---|---|
| Source | Lovable project |
| Project ID | `ad580e88-d5ed-4854-91e4-6eb05944b1c8` |
| URL | https://lovable.dev/projects/ad580e88-d5ed-4854-91e4-6eb05944b1c8 |
| Workspace | `Anshul's Lovable` |
| Last observed edit | 2026-11-03 |
| Observed state | Ready; unpublished |
| Stack observed | TanStack Start, React, TypeScript, Supabase, Drizzle |
| Database | Separate QBMS Lovable-managed database |
| Observed public base tables | 7 |
| Classification | **Current application candidate / legacy-existing managed source** |
| Authority | Not designated canonical |

**Observed data areas**
- Canonical questions and question versions.
- Import jobs and staged question candidates.
- User profiles, roles and audit events.

**Known reconciliation risks**
- This database is independent of the Student Tracking Lovable database and standalone PULSE Supabase project.
- Existing role-driven author/reviewer/coordinator/super-admin policies do not automatically match the approved internal pilot operating model.
- Full schema, migration, media, tagging and question-identity audit is still required before integration.

**Handling rule:** preserve QBMS question identity, version and provenance evidence. Do not assume question IDs are globally portable across databases. Any future integration must reconcile identity, versions, taxonomy mappings, media and audit history.

### SOT-004 — GitHub System A prototype

| Field | Recorded value |
|---|---|
| Source | GitHub feature branch |
| Repository | `anshuljindalsecondbrain-art/pulse` |
| Branch | `feat/system-a-abhyas-foundation` |
| Application path | `apps/student-tracking` |
| Classification | **Experimental / prototype** |
| Authority | Not designated canonical |

**Observed contents**
- React/Vite prototype, domain modules, demo data, tests and Supabase repository adapter.
- Student, exercise and marks persistence includes browser `localStorage` in the prototype.
- Demo data and fictional-demo presentation are present.
- Candidate migration: `supabase/migrations/20261106000100_system_a_initial_schema.sql`.

**Handling rule:** do not treat browser storage or demo data as durable student records. The candidate migration has not been applied to the standalone PULSE database. It must be reconciled against DEC-011/012/013 and the canonical migration base before any migration proposal is approved.

### SOT-005 — Standalone PULSE Supabase project

| Field | Recorded value |
|---|---|
| Provider | Supabase |
| Project name | PULSE |
| Project ref | `nnvssbfezkliavwxhgbh` |
| Region | Mumbai (`ap-south-1`) |
| PostgreSQL | 17.11 |
| Last observed health | ACTIVE_HEALTHY |
| Last recorded schema observation | Zero application tables; zero applied application migrations |
| Classification | **Proposed target operational database** |
| Authority | Not yet approved as canonical operational database |

**Approved design direction**
- Shared PULSE identity and tenant boundaries.
- System A references shared identity; it does not create duplicate identity authorities.
- DEC-012 Option B: tenant memberships, separate scoped role grants, tenant-owned students with optional person link, explicit effective-dated enrollments and context epochs linked to enrollment.
- DEC-013: single unique Supabase Auth UUID mapping for initial release.
- M0001 remains internal-only; no `anon` or `authenticated` grants or Data API exposure until a reviewed security migration and its tests are approved.

**Handling rule:** this project is not an operational source of student/question data merely because it is the proposed target. No remote DDL, grants, RLS changes, data movement or deployment is authorized by this register.

### SOT-006 — PULSE governance and decision documentation

| Field | Recorded value |
|---|---|
| Source | GitHub documentation |
| Repository | `anshuljindalsecondbrain-art/pulse` |
| Governance branch | `docs/system-a-database-governance` |
| Key entry point | `docs/student-tracking/database/DATABASE_MASTER_INDEX.md` |
| Additional governance | `docs/governance/` |
| Classification | **Governance source** |
| Authority | Current recorded decision/specification source, subject to approval status stated in each document |

**Key controlled documents**
- Database Management Master Plan.
- Database Decision Register.
- Physical ERD Reconciliation.
- Physical Database Blueprint.
- Physical Constraints and Index Catalogue.
- M0001 Column-Level Schema Review.
- Pilot Operating Model and Implementation Plan.
- Pilot P0/P1 Student Master and Academic Catalogue Specification.
- Existing Application Source and Integration Audit.
- PULSE Engineering Maturity and Improvement Master Plan.

**Handling rule:** use the latest approved decision record when resolving conflicts. A document marked Proposed, Pending or Blocked is not an approved implementation instruction. Preserve superseded documents for traceability.

### SOT-007 — Design sources and external workspace artifacts

| Field | Recorded value |
|---|---|
| Source family | Figma/design files and other workspace artifacts |
| Current inventory | Incomplete in this register |
| Classification | **Unknown / unverified** |
| Authority | No canonical design source designated here |

**Required action:** inventory active Figma files, design systems, prototypes and their owners. Record file URL/ID, last updated date, design scope, linked product requirement and whether it is approved, exploratory or superseded. Do not infer that a screenshot or prototype is the approved product specification.

## 5. Domain authority matrix — current position

This matrix separates intended ownership from current implementation candidates.

| Domain | Intended authority | Current evidence / status |
|---|---|---|
| Tenant, person and Auth identity | Shared PULSE Core | DEC-011 and DEC-013 approved at design level; physical implementation pending |
| Tenant membership and role grants | Shared PULSE Core | DEC-012 approved at design level; lifecycle details remain open |
| Student master and enrolment | Shared PULSE Core + System A boundary | DEC-012 approved; application/database implementation not integrated |
| Academic catalogue | Ownership decision pending | Existing Student Tracking catalogue observed; OPEN-011 unresolved |
| Question identity and versions | QBMS / Q-GENOME shared intelligence layer | QBMS Lovable candidate exists; full integration audit pending |
| Taxonomy and question-concept mappings | DTE | Architecture direction documented; canonical integrated implementation not established |
| Difficulty rules and score history | Difficulty Engine | Domain design documented; canonical integrated implementation not established |
| Assignments and student obligations | System A | Existing Lovable app and GitHub prototype; neither designated canonical |
| Attempt/completion evidence and reconciliation | System A | Approved operating semantics; implementation conformance not yet proven |
| Tests, results and test assembly | Test Management domain | Existing partial test-related structures; canonical ownership/integration pending |
| Media and content assets | Media/CMS domain with QBMS relationships | Inventory and ownership reconciliation pending |
| Mentoring/interventions | AI-Mentor | Intended domain; integrated operational authority not established |
| Audit and governance decisions | PULSE governance + append-only domain audit | Documentation exists; end-to-end implementation and retention controls pending |

## 6. Cross-source separation and non-assumptions

Until an approved integration plan proves otherwise:

- The two Lovable projects are separate applications.
- Their managed databases are separate data stores.
- The standalone PULSE Supabase project is a third, separate database environment.
- The GitHub System A prototype is not the Student Tracking Lovable application.
- Similar table names do not establish shared schema, keys or semantics.
- IDs from one database must not be assumed valid in another.
- Authentication users, profiles, students and people are distinct concepts; do not conflate them.
- A student record does not require a login or tenant membership in the approved pilot model.
- Aggregate exercise counts must not be treated as individual question attempts.
- A UI feature is not evidence of a secure or validated backend workflow.
- A migration file in a branch is not evidence that it has been applied.
- A healthy database status is not evidence of schema correctness, security or production readiness.

## 7. Required metadata for every future source

Add or update a register entry whenever a new application, repository, database, design source or external system is introduced.

Minimum fields:
1. Stable source ID.
2. Source name and type.
3. Owner / accountable role.
4. URL, repository path, project ID or database reference (never secrets).
5. Environment and branch/ref/version.
6. Domain and data ownership.
7. Classification and exact authority scope.
8. Dependencies and integrations.
9. Last inspected date and inspection method.
10. Known risks, limitations and unresolved questions.
11. Data sensitivity and access model.
12. Decommissioning, retention or migration constraints.
13. Approval record and change history.

Never store passwords, API keys, service-role keys, access tokens, private connection strings or other secrets in this register.

## 8. Prioritised reconciliation plan

| Priority | Action | Required evidence / exit condition |
|---|---|---|
| P0 | Confirm accountable Product Owner and Technical Owner for each domain | Named owners and signed-off responsibility matrix |
| P0 | Confirm canonical repository integration policy | Reviewed branch protection, PR, CI and release rules |
| P0 | Inventory exact commit/ref and deployment state of both Lovable applications | Reproducible source snapshots and deployment/environment identifiers |
| P0 | Inventory all migrations and live schema for both managed databases | Ordered migration lists, schema snapshots, RLS/policy/function inventories |
| P0 | Confirm whether standalone PULSE Supabase is the target operational database | Explicit owner decision; no implicit approval |
| P1 | Complete QBMS question identity/version/media/taxonomy audit | Mapping and provenance reconciliation report |
| P1 | Reconcile System A tracking semantics against pilot operating model | Evidence that both entry modes, verification and discrepancy handling conform |
| P1 | Inventory Figma and other design sources | Approved/experimental/superseded status and owner for each |
| P1 | Define controlled data extraction and migration strategy | Counts, key mapping, validation, rollback and retention plan |
| P2 | Establish integration sequence and release gates | Approved ADRs, tests, migration plan and rollback evidence |
| P2 | Retire or archive redundant sources only after verified cutover | Reconciliation sign-off, retention approval and rollback window closure |

## 9. Approval gates

The following decisions remain explicitly open:

1. **Canonical application:** which existing application/source becomes the base for the integrated PULSE application, or whether a controlled consolidation is required.
2. **Canonical operational database:** whether standalone PULSE Supabase is approved as the target, and how existing Lovable-managed data stores will be handled.
3. **Domain ownership:** final owners for academic catalogue, teaching assignments and any cross-domain shared data not already settled.
4. **Source migration:** whether and how existing student, question, test, media and audit records are migrated, linked, retained or archived.
5. **Design authority:** which Figma/design artifacts represent approved product requirements.

No approval is implied by documenting these choices or by the existence of a candidate source.

## 10. Change-control rules

- Update this register when a source is created, retired, moved, renamed, promoted, demoted or materially changed.
- Record the exact branch, commit, project ID, database ref or version inspected.
- Keep observed facts separate from recommendations and owner decisions.
- Do not promote a Current Candidate or Proposed Target to Canonical without an explicit decision record.
- Do not change database schemas, grants, RLS, data, application source or deployment state as a side effect of updating this register.
- Reconcile this register with the Database Master Index and relevant decision records after every material authority change.
- Retain superseded entries and record the replacement source; do not erase provenance.

## 11. Initial approval record

| Approval item | Status |
|---|---|
| Register created as documentation baseline | Recorded |
| Product Owner review | Pending |
| Technical Owner review | Pending |
| Canonical application decision | Not granted |
| Canonical operational database decision | Not granted |
| Data migration authorization | Not granted |
| Source replacement / retirement authorization | Not granted |
| Production DDL / grants / RLS authorization | Not granted |
| PR merge / deployment authorization | Not granted |

**Safety statement:** this register is a read-only governance artifact. Its creation does not change any Lovable project, database, repository application source, deployment, user data, grants or security policy.
