# PULSE Engineering Intelligence & Governance System
## Data Architecture and Registry Schema v1.0 — Review Draft

- **Document ID:** PULSE-PEIGS-DATA-001
- **Version:** 1.0.0
- **Status:** Draft — audited design proposal; owner, architecture and security approval pending
- **Parent:** PULSE-GOV-PEIGS-001
- **Branch:** `docs/peigs-architecture-v1`
- **Target database:** Supabase PostgreSQL, subject to shared-core integration and access approval
- **Database schema proposal:** `peigs` (non-exposed)
- **SQL generation authorization:** Not granted
- **Migration execution authorization:** Not granted
- **Production access authorization:** Not granted
- **Supersedes:** None

## 1. Executive decision

PEIGS requires a small, normalized, platform-level engineering registry. It does **not** require a second PULSE identity model, academic database, project-management system, document register, issue tracker, event register, release system or test register.

The registry connects and assesses existing authoritative artifacts:

- requirements and acceptance criteria;
- systems, modules, workflows, screens and components;
- APIs, data entities, database objects and integrations;
- source files, migrations, tests, designs and deployments;
- verification evidence, dependencies, audit findings and remediation.

The canonical content remains in its owning system. PEIGS stores stable registry identity, source locators, relationships, version references, assessments, evidence metadata and cross-domain audit intelligence.

**Selected architecture**
1. One private PostgreSQL schema: `peigs`.
2. Platform-level scope; no institute/student operational records and no tenant-owned PEIGS data in the initial design.
3. GitHub remains canonical for requirements, specifications, decisions, code, migrations, tests and engineering history.
4. Figma, CI, Supabase and Vercel remain authoritative for their own as-built artifacts.
5. PEIGS stores source references and immutable evidence metadata, not duplicate source files.
6. Initial operating access is restricted to the authorized PULSE Super Admin pilot. No institute-level PEIGS access is included.
7. Discovery and synchronization are read-only first. No automated source mutation, merge, approval or deployment.
8. The registry must reuse the approved shared PULSE person identity when it is integrated. It must not create its own users, people, tenants, memberships or roles.

This is a design specification only. It does not create tables or authorize SQL.

## 2. Audit basis and source reconciliation

### 2.1 Existing canonical-core work discovered

The repository already contains a substantial System A/shared-platform database design sequence on feature and documentation branches:

| Source artifact | Existing purpose | Audit disposition |
|---|---|---|
| PULSE-DATA-CORE-001 | Identity, tenancy and academic-core logical model | Reuse as shared-core source; do not duplicate |
| PULSE-DATA-CORE-002 | Core ERD, data dictionary and authorization matrix | Reuse as shared-core design input |
| PULSE-DATA-CORE-003 | Database schema and migration specification | Reuse for migration and security gates |
| PULSE-DATA-CORE-004 | V10/System A migration disposition | Reuse as source-migration audit |
| PULSE-DATA-CORE-005 | System A repository dependency/schema impact audit | Reuse as application-dependency evidence |
| PULSE-DATA-CORE-006 | System A application service/API contract | Reuse; do not create a second service contract |
| PULSE-DATA-CORE-007 | System A authorization and transaction design | Reuse as System A security/workflow authority |
| PULSE-DATA-CORE-008 | System A physical table authorization/integrity mapping | Reuse as table-level System A review |
| PULSE-DATA-CORE-009 | Two physical-model documents share the same ID and version | Authority conflict; do not silently select or merge |
| PULSE-DATA-CORE-010 | Product decision closure and schema-freeze register | Reuse as decision record; statuses remain explicit |

### 2.2 Newer database-governance work discovered

The branch docs/system-a-database-governance contains a more detailed System A database workstream, including:

- Database Master Index and Database Management Master Plan.
- Database Decision Register and branch/schema reconciliation.
- Physical Database Blueprint and Physical ERD Reconciliation.
- Data Dictionary and Physical Constraints/Index Catalogue.
- Authorization Permission Catalogue and RLS Policy Specification.
- Command/RPC Catalogue and Transaction/Concurrency/Idempotency design.
- Audit/Event/Security Test Register.
- M0001 owner decision package, implementation specification and column-level review.
- P0/P1 pilot operating model and student/academic catalogue specification.

The branch head inspected was 54b756c707b7119740be4dae0478794997c2f7eb. It is not merged into main.

### 2.3 Branch and authority risk

The inspected GitHub comparisons showed substantial divergence from main:

| Branch | Ahead of main | Behind main | Disposition |
|---|---:|---:|---|
| feat/system-a-abhyas-foundation | 290 | 44 | Do not merge blindly |
| docs/system-a-a2-model-reconciliation | 289 | 44 | Do not merge blindly |
| docs/system-a-database-governance | 384 | 44 | Owner decisions and documents require controlled integration |
| docs/peigs-architecture-v1 | 4 | 0 | PEIGS review branch |

The approved database decision register states that main is the eventual canonical integration branch. That does not make the divergent documentation branch's entire tree canonical or safe to merge. Preserve owner-approved decision evidence while reconciling the branch histories through a separate review.

### 2.4 Specific document collision

Two files on feat/system-a-abhyas-foundation carry the same identifier and version, PULSE-DATA-CORE-009 v0.1.0:

- PULSE_CANONICAL_PHYSICAL_ERD_AND_DATA_DICTIONARY.md
- PULSE_CANONICAL_PHYSICAL_ERD_AND_TABLE_COLUMN_DATA_DICTIONARY.md

They have overlapping but non-identical scope. The later database-governance index instead points to a distinct Physical ERD Reconciliation, Physical Database Blueprint and Data Dictionary. PEIGS must record this as a source-authority conflict until the database documentation owner resolves it. Do not treat both CORE-009 files as independent canonical authorities.

### 2.5 Approved decisions and unresolved gates found

The newer database decision register records:

- **DEC-011:** shared PULSE identity is the permanent identity source for System A.
- **DEC-012:** tenant_memberships is the tenant association; students are tenant-owned with mandatory tenant_id and optional person_id; explicit effective-dated enrollments connect students to batches; academic context epochs reference enrollments.
- **DEC-013:** initial Supabase Auth identity mapping uses one unique auth_user_id UUID mapped to canonical people.id; email and user-editable metadata are not identity/authorization keys.
- Six M0001 owner decisions are recorded as approved, including canonical integration branch, Auth mapping, membership/role separation, tenant-safe student keys, centres/batches and the internal-only first migration boundary.
- **OPEN-010 / RECON-004 remains blocked:** concurrent active enrollment and overlap rules still require Academic Owner approval. Do not infer approval from the product direction alone.
- Role-to-permission bundles, resource-scope inheritance, separation of duties, guardian access, retention, export and other security/operational decisions remain subject to their named owners.

These decisions belong to the shared PULSE/System A database workstream. PEIGS references them; it does not restate them as PEIGS-owned identity or academic rules.

### 2.6 Existing governance registers that PEIGS must not duplicate

The inspected branch also contains:
- Master Event Register and individual event records.
- Requirement Traceability Matrix.
- Test Evidence Register.
- Open Issues and Follow-up Register.
- Release History.
- Event Governance Protocol.
- System A Database Master Index and Schema/Migration Register.

These are existing governance sources. PEIGS must index and connect them, not create competing copies. Historical coverage is explicitly incomplete in some registers; PEIGS must preserve that limitation rather than claim complete coverage.

## 3. Live infrastructure baseline

Read-only inspection of the connected PULSE Supabase project on 2026-11-07 returned:

| Item | Observed state |
|---|---|
| Project | PULSE |
| Project reference | nnvssbfezkliavwxhgbh |
| PostgreSQL | 17.x |
| Application tables in inspected public and app_private schemas | 0 |
| Applied project migrations | 0 |
| Edge Functions | 0 |
| Security advisor findings | 0 returned |
| Performance advisor findings | 0 returned |

The extension catalogue reports pgcrypto and uuid-ossp installed; vector is listed as available but was not reported as installed. PEIGS does not require vector search for its first release.

**Interpretation:** an empty schema is not evidence of a completed database design, a secure application or a working backend. Zero advisor findings on an empty application schema do not certify future PEIGS security.

### 3.1 Existing migration sources

The inspected source branches contain:
- V10 migration 0001: five shared-core tables.
- V10 migration 0002: five additional academic/event tables, eight RLS-enabled tables, broad tenant-member read policies and two SECURITY DEFINER helper functions.
- System A initial proposal: 26 sa_* tables, forced RLS, revoked client table grants and no RLS policies.

These are source proposals on divergent branches, not applied live migrations. The System A proposal is fail-closed for direct client access until a reviewed authorization path exists. Neither source migration is approved for direct application unchanged.

## 4. PEIGS scope boundary

### 4.1 PEIGS owns

- Cross-domain registry object identity and source references.
- Typed links between requirements, artifacts, tests, data objects and releases.
- Technical dependency edges and change-impact metadata.
- Version-specific engineering assessments.
- Verification run/result references and evidence metadata.
- PEIGS-specific audit findings and remediation lifecycle.
- Source discovery observations, synchronization health and unresolved source conflicts.
- References to approvals and decisions made in their canonical authority.

### 4.2 PEIGS does not own

- Tenants, people, Auth identities, memberships, role grants or students.
- Student evidence, assignments, attempts, question content or taxonomy.
- Domain module specifications, requirements, decisions or approval documents.
- GitHub issues, pull requests, commit history or source files.
- Figma design content or design-system definitions.
- CI test execution or Vercel deployment execution.
- A second general-purpose task/project-management system.
- A second event, issue, release or test register.

### 4.3 Reuse rule

If an existing canonical source already owns a record, PEIGS stores:
1. the external stable identifier;
2. the source system and exact locator;
3. the source version or immutable revision;
4. a content hash where useful;
5. typed links and PEIGS assessments.

PEIGS may cache a display label or short summary for navigation, but it must mark that value as a non-authoritative projection. It must never silently become the canonical source.

## 5. Logical architecture

Source systems: GitHub (specs, code, decisions, migrations, tests); Figma (designs); CI (build/test runs); Supabase (live catalog, schema and policies); Vercel (deployment/environment state); existing domain registers (events, issues, requirements, releases).

PEIGS private registry domains:
- registry objects and versions;
- source references and observations;
- traceability links and dependency graph;
- assessments and verification results;
- evidence metadata;
- findings and remediation;
- conflicts and synchronization runs.

All source integrations are read-only in the initial phases.

### 5.1 Database schema

Use a dedicated peigs schema, separate from:
- shared PULSE identity and academic core;
- System A sa_* records;
- QBMS-owned records;
- DTE-owned records;
- DRE-owned records.

The peigs schema must not be included in Supabase's exposed Data API schemas. Do not expose generic table CRUD to browser clients.

### 5.2 Deployment dependency

The PEIGS database implementation depends on:
1. controlled integration of the approved shared identity foundation into the canonical main migration lineage;
2. a verified, live Auth-to-person mapping and platform-admin authorization contract;
3. a reviewed private-schema access mechanism;
4. an isolated database environment for migration replay and security tests.

Until those dependencies exist, PEIGS remains a version-controlled specification and source-linked manual inventory. Do not invent a local PEIGS user table to bypass the shared identity dependency.

## 6. Proposed physical registry entities

All names below are proposals. No table exists in the live Supabase project as a result of this document.

| Table | Purpose | Main relationships |
|---|---|---|
| registry_objects | Stable identity for every tracked requirement, module, screen, feature, component, API, data object, test, document, design or release reference | Parent identity for most registry records |
| object_versions | Immutable version/revision references for a registry object | Registry object; source reference |
| source_refs | Exact GitHub, Figma, Supabase, CI, Vercel or register locator | Registry object; source observations |
| object_links | Typed traceability relationships | Registry object → registry object |
| dependency_edges | Directional technical/operational dependencies | Registry object → dependency target |
| assessment_status_catalog | Controlled status vocabulary per assessment dimension | Referenced by assessments |
| status_assessments | Append-only, version-specific status/confidence assessments | Object, object version, optional verification run |
| verification_runs | Immutable execution record for a build, test, audit or release check | Verification results |
| verification_results | Per-object/per-criterion result within a verification run | Object/version, run, evidence |
| evidence_refs | Evidence metadata, immutable locator and content hash | Source reference; verification result; finding |
| approval_refs | Reference to an authoritative, version-specific approval event | Object/version; external decision/approval source |
| audit_findings | PEIGS-originated engineering/audit finding identity | Object, evidence, remediation |
| finding_events | Append-only finding lifecycle events | Audit finding; actor; evidence |
| remediation_actions | Corrective action linked to a finding and acceptance condition | Audit finding; object/criterion references |
| sync_runs | Connector execution, cursor, counts, errors and freshness | Source connector key; observations |
| source_observations | Immutable discovery facts and payload hashes | Sync run; source reference; object |
| source_conflicts | Conflicting source claims and their resolution evidence | Object; competing source references |

### 6.1 Intentionally excluded tables

Do not create separate PEIGS tables for:
- tenants, people, person_auth_identities, tenant_memberships, tenant_role_grants, students, centres, batches or enrollments;
- canonical systems/modules if their owning domain registers already define them;
- full requirements or decision documents;
- general GitHub issues, PRs, commits, test runs or deployments;
- generic project tasks or comments.

Represent those as registry objects and source references, or consume them as read-only external records.

## 7. Table-level contracts

### 7.1 registry_objects

Purpose: stable PEIGS identity independent of source path or display name.

Required fields:
- id uuid primary key;
- object_key text not null unique — immutable human-readable key;
- object_type text not null — controlled type such as REQUIREMENT, SYSTEM, MODULE, WORKFLOW, SCREEN, FEATURE, COMPONENT, TEMPLATE, API, EVENT_CONTRACT, DATA_ENTITY, DATABASE_OBJECT, SOURCE_FILE, TEST_SUITE, TEST_CASE, DESIGN_ASSET, DOCUMENT, DECISION_REF, INTEGRATION or RELEASE_REF;
- display_name text not null;
- domain_key text not null — source-owned domain/system key, not a replacement module catalogue;
- lifecycle_state text not null — ACTIVE, RETIRED or SUPERSEDED;
- created_at timestamptz not null;
- created_by_person_id uuid null — FK to shared public.people(id) only after that approved core is integrated;
- retired_at timestamptz null.

Rules:
- Object key never changes after creation.
- Path/name changes update source references, not object identity.
- A superseded object points to its replacement through a typed object link.
- Do not create duplicate objects for the same canonical source ID.
- No student, parent or teacher operational records are stored here.

### 7.2 object_versions

Required fields:
- id uuid primary key;
- object_id uuid not null references registry_objects(id);
- version_key text not null;
- source_ref_id uuid not null references source_refs(id);
- content_hash text null;
- commit_sha text null;
- external_revision text null;
- observed_at timestamptz not null;
- unique(object_id, version_key).

Rules:
- A version record is immutable.
- GitHub versions use commit/blob identity; Figma uses exact file/node/version identifiers where available; database objects use migration/schema identity; deployments use deployment ID and commit SHA.
- A branch name alone is not an immutable version.
- Never infer that a branch commit is deployed.

### 7.3 source_refs

Required fields:
- id uuid primary key;
- object_id uuid not null references registry_objects(id);
- source_system text not null — GITHUB, FIGMA, SUPABASE, CI, VERCEL or DOMAIN_REGISTER;
- source_key text not null — repository/project/file/workflow identity;
- branch_name text null;
- path_or_node text null;
- external_id text null;
- locator text not null;
- source_revision text null;
- commit_sha text null;
- is_authoritative boolean not null default false;
- first_seen_at timestamptz not null;
- last_seen_at timestamptz not null.

Rules:
- Store no access tokens, API keys or credentials.
- Locator must be exact and source-derived; never synthesize an unverified URL.
- Multiple source refs may point to one logical object.
- Only one active authoritative source reference per object/type should be permitted unless an explicit multi-authority rule is documented.

### 7.4 object_links

Required fields:
- id uuid primary key;
- from_object_id uuid not null;
- to_object_id uuid not null;
- link_type text not null;
- source_ref_id uuid null;
- confidence text not null — VERIFIED, REVIEWED, INFERRED or UNCONFIRMED;
- valid_from timestamptz not null;
- valid_to timestamptz null;
- created_at timestamptz not null.

Initial link types:
- SPECIFIES, DOCUMENTS, IMPLEMENTS, REALIZES, APPEARS_ON, USES_COMPONENT;
- CALLS, READS, WRITES, MAPS_TO, TESTED_BY, VERIFIED_BY;
- APPROVED_BY_REF, SUPERSEDES, DERIVED_FROM.

Rules:
- Link types must have a controlled allowed source/target object-type matrix.
- A link records traceability, not runtime dependency.
- Inferred links remain explicitly marked inferred until verified.
- Corrections supersede links; historical links are not silently deleted.

### 7.5 dependency_edges

Required fields:
- id uuid primary key;
- source_object_id uuid not null;
- target_object_id uuid not null;
- dependency_kind text not null — RUNTIME, DATA, BUILD, SECURITY, OPERATIONAL, GOVERNANCE or RELEASE;
- is_mandatory boolean not null;
- failure_effect text null;
- source_ref_id uuid null;
- confidence text not null;
- created_at timestamptz not null.

Rules:
- Dependency direction is explicit: source depends on target.
- Traceability links are not stored as dependencies.
- Cycles are flagged for review; not every cycle is invalid, but no cycle is silently accepted.
- Impact analysis follows only verified/reviewed dependency edges by default.

### 7.6 assessment_status_catalog and status_assessments

The status catalogue defines allowed statuses per dimension. Initial dimensions:

| Dimension | Candidate statuses |
|---|---|
| Requirement | PROPOSED, APPROVED, REJECTED, DEPRECATED |
| Architecture | NOT_STARTED, DRAFTED, REVIEWED, APPROVED |
| Design | NOT_STARTED, SPECIFIED, WIREFRAMED, DESIGNED, APPROVED |
| Frontend | NOT_STARTED, PARTIAL, IMPLEMENTED, INTEGRATED |
| Backend/API | NOT_STARTED, PARTIAL, IMPLEMENTED, INTEGRATED |
| Data | NOT_DESIGNED, SPECIFIED, MIGRATION_DRAFTED, DEPLOYED, VERIFIED |
| QA | NOT_TESTED, IN_PROGRESS, PASSED, FAILED, BLOCKED |
| Security | NOT_ASSESSED, IN_REVIEW, PASSED, FAILED, ACCEPTED_EXCEPTION |
| Release | NOT_RELEASED, PREVIEW, STAGING, PRODUCTION, ROLLED_BACK |

Evidence confidence remains a separate field: VERIFIED, PARTIALLY_VERIFIED, DOCUMENTED_ONLY, OBSERVED_ONLY, NOT_VERIFIED, CONTRADICTORY, BLOCKED or NOT_APPLICABLE.

Each status assessment must include:
- id uuid primary key;
- object_id uuid not null;
- object_version_id uuid null;
- dimension_key text not null;
- status_key text not null;
- confidence_key text not null;
- rationale text not null;
- assessed_at timestamptz not null;
- assessed_by_person_id uuid null;
- verification_run_id uuid null;
- supersedes_assessment_id uuid null.

Rules:
- Assessments are append-only.
- A status must be valid for its dimension.
- Approval status, implementation status and verification confidence must not be collapsed.
- The current status is a derived view over valid assessments, not an overwritten historical field.
- Unknown is not failed; absent evidence is not complete.

### 7.7 verification_runs and verification_results

A verification run records one exact execution:
- run ID, run type, source system, external run ID;
- commit SHA and/or object version;
- environment: LOCAL, CI, PREVIEW, STAGING or PRODUCTION;
- runner/tool identity;
- start/end timestamps and result;
- limitations and scope.

Each verification result records:
- run ID;
- object ID and optional object version;
- optional acceptance-criterion object reference;
- result: PASS, FAIL, BLOCKED, SKIPPED or NOT_APPLICABLE;
- evidence reference;
- execution detail and timestamp.

Rules:
- A build pass does not prove functional acceptance.
- Unit tests do not prove RLS, tenant isolation, browser behavior or production persistence.
- A deployment READY state does not prove release acceptance.
- Every result is tied to the exact source revision and environment.

### 7.8 evidence_refs

Store evidence metadata only:
- evidence ID and evidence type;
- source reference ID or verification result ID;
- immutable URI/locator;
- content hash;
- media type;
- sensitivity classification;
- retention class and expiry/review date;
- created timestamp and actor reference.

Do not store student PII, parent communications, credentials, production dumps or full source files in PEIGS evidence payloads. Store approved links and hashes instead.

### 7.9 approval_refs

This table is a reference to approval, not a second decision register.

Required fields:
- object ID and exact object version;
- approval scope/type;
- canonical decision/event/document reference;
- approver person ID once shared identity is integrated;
- approval outcome and timestamp;
- supersession/revocation reference where applicable.

Rules:
- An approval must bind to the exact version and scope.
- A commit, document status label or automated test cannot create human approval.
- The canonical decision register/event record remains authoritative.
- No PEIGS administrator can override domain, academic, security or release approval.

### 7.10 audit_findings, finding_events and remediation_actions

Use these for PEIGS-originated audit findings that do not already have a canonical issue record.

A finding includes:
- stable finding key;
- affected registry object;
- severity and category;
- concise statement and evidence references;
- canonical issue reference if one exists;
- opened timestamp and initial owner reference.

Finding lifecycle events:
OPENED → TRIAGED → ASSIGNED → REMEDIATION_STARTED → READY_FOR_RETEST → VERIFIED_CLOSED.
REOPENED is allowed when retest fails or the issue recurs.

A remediation action includes:
- finding ID;
- action key and description;
- accountable owner reference;
- target date;
- linked requirement/acceptance criterion;
- completion evidence and retest reference.

Rules:
- If a finding is already tracked in the PULSE Open Issues Register or GitHub Issues, PEIGS links to that record rather than creating a competing lifecycle.
- Finding closure requires retest evidence and the required authority.
- Reopening preserves prior closure history.

### 7.11 sync_runs, source_observations and source_conflicts

A sync run records connector, source scope, cursor/checkpoint, start/end, result, counts, retry and error details.

A source observation records:
- sync run ID;
- exact source reference;
- observed source revision;
- observation timestamp;
- normalized fact type;
- content/payload hash;
- bounded metadata needed for comparison.

A source conflict records:
- affected registry object;
- competing source references and revisions;
- conflict category;
- detection time;
- resolution state;
- resolution authority and exact decision reference.

Rules:
- Synchronization is idempotent and source-attributed.
- Last successful sync and source freshness are visible.
- Source outages do not delete the last verified state.
- Conflicting sources create a conflict record; newest timestamp does not automatically win.
- Imported content is untrusted data, never executable instructions.

## 8. Relationships and cardinality

Core relationships:
- registry_objects → object_versions;
- registry_objects → source_refs;
- source_refs → source_observations;
- sync_runs → source_observations;
- registry_objects → object_links and dependency_edges;
- registry_objects → status_assessments;
- verification_runs → verification_results;
- registry_objects → verification_results and approval_refs;
- audit_findings → finding_events and remediation_actions;
- registry_objects → source_conflicts.

All relationship rows must enforce valid object references and controlled relationship types. A polymorphic source locator is acceptable as metadata; a polymorphic foreign key to arbitrary PULSE tables is not.

## 9. Identity, access and tenancy

### 9.1 Identity reuse

- Reuse shared public.people and the approved Auth-to-person mapping after controlled integration.
- Do not create peigs_users, peigs_people, peigs_tenants, peigs_memberships or peigs_roles.
- Actor and owner references should resolve to canonical person identity.
- Until the shared core is available, schema implementation remains blocked; do not create a temporary duplicate identity table.

### 9.2 Initial access

- Initial PEIGS access: authorized PULSE Super Admin pilot only.
- No institute-level registry access in v1.
- No student/parent/teacher login or operational student records in PEIGS.
- Every privileged action must record actor, timestamp, target object/version, action and reason where applicable.

### 9.3 Private schema and API

- Keep peigs outside Supabase exposed schemas.
- Revoke default PUBLIC, anon and authenticated schema/table privileges.
- Enable and force RLS on PEIGS tables as defense in depth; do not add permissive client policies.
- No direct browser table access or service-role key in frontend code.
- All access goes through a narrowly scoped trusted server-side API that validates the authenticated principal and Super Admin permission before accessing registry records.
- The server-side privilege model, function boundary, audit path and secret handling require a separate security review before implementation.
- Do not introduce broad SECURITY DEFINER functions as a shortcut.

## 10. Versioning and evidence freshness

Verification is current only for the exact object version and dependency versions tested.

A change to a source object may invalidate only affected assessments, based on dependency and coverage links. It must not invalidate every test in the registry.

Freshness states:
- CURRENT — exact source/version still matches.
- STALE — source or relevant dependency changed.
- UNKNOWN — source could not be checked.
- CONFLICTED — sources disagree.
- EXPIRED — evidence passed its defined validity period.

The system must preserve old assessments and show why a new assessment superseded them. It must not rewrite history.

## 11. Data integrity and indexing

Required baseline constraints:
- Unique immutable object_key.
- Unique (object_id, version_key).
- Unique source identity for a source system + immutable external locator/revision.
- No self-links where the relationship type prohibits them.
- Controlled object/link/dependency/status vocabularies.
- Valid effective intervals.
- Append-only verification/evidence/approval/finding-event records.
- Foreign keys use RESTRICT/NO ACTION for historical evidence and audit relationships.
- No cascading deletion across registry objects, versions, evidence, findings or approvals.
- Retire/supersede instead of deleting referenced records.

Candidate indexes:
- registry objects by object type, domain key and lifecycle;
- source references by source system, source key, branch and path;
- versions by object and observed revision;
- links/dependencies by source and target object;
- assessments by object, dimension and assessed timestamp;
- verification results by run and object;
- findings by severity, affected object and lifecycle time;
- sync runs by connector and completion time;
- source conflicts by object and unresolved state.

Add indexes only after the actual query patterns and EXPLAIN plans are reviewed.

## 12. Integration contracts

| Source | Discovery method | PEIGS stores | PEIGS must not do |
|---|---|---|---|
| GitHub | Branch, commit, tree, file, PR, workflow metadata | Repo/branch/path/SHA/blob and links | Edit source or merge branches automatically |
| Figma | File/page/node/version metadata | Exact file/node/revision refs and evidence links | Treat screenshots as the canonical design |
| CI | Workflow/run/job/test metadata | Exact run, SHA, result and scope | Infer test coverage beyond executed checks |
| Supabase | Read-only catalog, migration, policy and function metadata | Observed schema object/version and audit result | Apply DDL or infer approval from catalog presence |
| Vercel | Project/environment/deployment metadata | Deployment ID, commit, environment, status | Promote/rollback deployments |
| Domain registers | Stable document/event/issue/requirement IDs | External IDs and source refs | Duplicate canonical lifecycle or approval records |

Initial synchronization is read-only. Every connector must be idempotent, source-attributed, retry-safe and observable.

## 13. Operational views supported by this schema

1. Executive engineering health.
2. System/module inventory.
3. Requirement-to-artifact traceability.
4. Screen/feature/component coverage.
5. Data/API/code dependency explorer.
6. Verification freshness and evidence viewer.
7. Audit findings and remediation queue.
8. Source conflict and orphan review.
9. Branch/release/deployment evidence.
10. Connector health and last successful synchronization.

These are views over the same normalized records, not separate manually maintained databases.

## 14. Migration and implementation sequence

| Phase | Work | Exit condition |
|---|---|---|
| 0 | Reconcile authority sources and branch history | Duplicate CORE-009 authority resolved; approved decisions preserved; canonical source map recorded |
| 1 | Approve PEIGS logical/physical data model | Object keys, links, versioning, evidence, access and retention reviewed |
| 2 | Integrate shared identity/access foundation through its own governed migration process | Canonical person identity and Super Admin authorization verified |
| 3 | Design PEIGS private schema and threat model | Table-level privileges, RLS, backend boundary and audit contract approved |
| 4 | Local/isolated migration build | Empty-database replay, constraints and append-only tests pass |
| 5 | Representative inventory pilot | System A workflow and in-scope DTE framework workflow trace end-to-end |
| 6 | PEIGS read-only MVP | Search, source refs, links, assessments, evidence and findings work |
| 7 | Controlled source integrations | GitHub, CI, Supabase, Vercel and Figma observations synchronize |
| 8 | Verified intelligence | Orphan detection, stale evidence and dependency impact validated |

### Explicit migration prohibition

Do not generate or apply a PEIGS migration until:
- canonical shared identity is integrated into the approved migration lineage;
- Super Admin authorization is implemented and tested;
- the private-schema access design is approved;
- the source authority and branch reconciliation is complete;
- a local migration replay and negative security test plan are ready.

Do not combine PEIGS schema creation with the unresolved System A M0001/M0002 migration work.

## 15. Required tests

### Identity and access
- Unauthenticated actor denied.
- Authenticated user without canonical person mapping denied.
- Non-Super-Admin denied.
- Revoked/expired privileged grant denied.
- Browser cannot access private PEIGS tables.
- Service credentials are absent from browser bundles and public environment variables.

### Integrity
- Duplicate object key rejected.
- Duplicate object-version key rejected.
- Invalid object/link/dependency types rejected.
- Cross-object references must resolve.
- Retired objects retain history.
- Source path rename does not create a new object identity.

### Evidence and verification
- Assessment cannot claim VERIFIED without qualifying evidence.
- Test result binds to exact commit and environment.
- Changed source version marks affected verification stale.
- Unrelated change does not invalidate unrelated evidence.
- Evidence hashes and immutable references remain stable.

### Findings and approvals
- Finding closure requires retest evidence.
- Failed retest reopens without deleting prior closure.
- Approval is bound to exact object version and scope.
- AI/automation cannot create human approval.
- Existing GitHub issue/event is linked rather than duplicated.

### Synchronization
- Repeated sync is idempotent.
- Connector failure preserves last verified state.
- Source conflict creates a conflict record.
- Stale branch data is not treated as current main state.
- Missing source data is UNKNOWN, not automatically DELETED.

## 16. Risks and mitigations

| Risk | Mitigation |
|---|---|
| PEIGS duplicates existing registers | Source-reference-first design; canonical owner remains external |
| Divergent branches are treated as one source | Branch/SHA provenance and explicit reconciliation gate |
| Identity model is duplicated | FK to shared PULSE person only after integration |
| Registry becomes a project-management clone | No general task/comment system; only engineering audit/remediation |
| Status becomes manually asserted | Append-only assessment plus evidence/version binding |
| Automation overstates completeness | Discovery, verification and human approval are separate |
| Private schema is accidentally exposed | Non-exposed schema, revoked client grants and security tests |
| Source outages erase knowledge | Preserve last observation and mark freshness UNKNOWN |
| PEIGS becomes an audit bottleneck | Risk-based review and clear authority ownership |

## 17. Acceptance criteria for this specification

- PEIGS has a clear scope distinct from shared PULSE identity and academic data.
- Existing domain and governance registers remain authoritative.
- The CORE-009 duplicate-ID collision is recorded for resolution.
- Branch divergence is treated as a source-control risk.
- Every proposed table has a clear purpose and owner.
- No duplicate person, tenant, student, role, decision, issue, test or release authority is introduced.
- Source references are version-specific and immutable where possible.
- Traceability links and technical dependencies are separate.
- Assessments are append-only and evidence-backed.
- Private-schema access and initial Super Admin scope are explicit.
- The schema can support a representative pilot before dashboard development.
- No executable SQL or live database change is implied.

## 18. Approval record

| Review | Status | Reviewer | Date |
|---|---|---|---|
| Product owner | Pending | — | — |
| Architecture owner | Pending | — | — |
| Data owner | Pending | — | — |
| Security/privacy owner | Pending | — | — |
| QA/operations owner | Pending | — | — |

**Current disposition:** Draft design only. No PEIGS table, migration, RLS policy, grant, function, application endpoint, dashboard or production setting has been created or changed.

## 19. Source references reviewed

The following source records were inspected as design inputs. Their branch and revision context must be preserved when reconciling them into main.

| Source | Branch | Immutable file/blob reference |
|---|---|---|
| CORE-001 Identity/Tenancy/Academic Core | feat/system-a-abhyas-foundation | 323f6a8986db738d50aee14b0b0b34c783cf6078 |
| CORE-002 Core ERD/Data Dictionary/Authorization | feat/system-a-abhyas-foundation | 53292442a1e6c2f9a7afe0c99a78236791462cf1 |
| CORE-003 Database Schema/Migration Specification | feat/system-a-abhyas-foundation | 9a7d86ca8913e94c6d6fce84230b533234f7fef8 |
| CORE-004 Migration Reconciliation | feat/system-a-abhyas-foundation | 82bc204a3c3866ec9e382a3c966f2eda46b76254 |
| CORE-005 System A Repository Dependency Audit | feat/system-a-abhyas-foundation | e8f2882461e8d660a678a717c784b3505d174e00 |
| CORE-009 Physical ERD/Data Dictionary variant A | feat/system-a-abhyas-foundation | e7a4cc1b88bb5d8920eb823fb340f4dac56f9eb0 |
| CORE-009 Physical ERD/Table-Column Dictionary variant B | feat/system-a-abhyas-foundation | edd6f1de75310035d179b3c61b9095325a62f6c8 |
| CORE-010 Product Decision Closure Register | feat/system-a-abhyas-foundation | f3eb3dfa83755825d1f67f403b45ca6008c89266 |
| Database Decision Register | docs/system-a-database-governance | 5fbd32775be4848880500f19b726b9796d32bd5a |
| Database Master Index | docs/system-a-database-governance | 76f41c567e9fa3936a25f6af489a8daa86cbed1b |
| Physical Database Blueprint | docs/system-a-database-governance | 1dc53069540154342897edebd9289c4608590932 |
| Branch/Schema Reconciliation | docs/system-a-database-governance | ef74d375d57517381d3f7c34bde4926e634e4949 |
| M0001 Shared Identity Specification | docs/system-a-database-governance | b5ac84dc87a5b87e8da350b937dd02fa92fce58d |
| M0001 Column-Level Schema Review | docs/system-a-database-governance | 13c2d9ba4a4a885de562ef18eab7effa64c4a8d8 |
| System A Physical Authorization Mapping | feat/system-a-abhyas-foundation | 48a65f1a14576e2079c7230ae1016d4f97775634 |

The source audit is based on repository documents, migration source inspection and read-only Supabase catalog inspection. It is not a full application runtime test, security certification, Figma live verification or owner approval.
