# DTE — Audit of All 18 Module Specifications

- Document ID: PULSE-DTE-AUDIT-001
- Version: 0.1.0
- Status: Draft — Audit findings; remediation required
- Audit date: 2026-11-06
- Repository: anshuljindalsecondbrain-art/pulse
- Scope: DTE-M01 through DTE-M18, plus consistency against DTE_MODULE_REGISTER.md
- Audit method: Read-back of all 18 committed GitHub files; structural, scope, cross-module boundary, lifecycle, data-contract, security, scale, testability and open-decision review.
- Important limitation: This is a documentation architecture audit. It is not a code, database, security penetration, performance or operational audit.

## 1. Executive finding

**Result: The 18 documents form a coherent first-pass functional outline, but they are not yet an implementation-ready specification baseline.**

They consistently preserve several important architectural decisions:
- DTE is configurable and multi-tenant rather than a fixed Physics/JEE hierarchy.
- Question identity, question version and placement are distinct.
- Classification mappings are normalized relationships rather than arbitrary secondary-ID arrays.
- Question type, archetype, pedagogical metadata and PYQ provenance are distinct concepts.
- Published records are versioned and auditable.
- Difficulty calculations remain outside DTE in the separate DRE.
- Student Tracking and other consumer systems retain ownership of their own records and business logic.

However, the documents currently defer too many decisions to future documents. The largest risks are unresolved ownership boundaries, absent canonical data model, incomplete workflow state machines, incomplete authorization model, and overlapping responsibilities between modules. Several acceptance criteria are principles rather than executable tests.

No implementation should begin from the 18 module documents alone.

## 2. Severity model

- **Critical** — could cause fundamental data corruption, tenant exposure or incompatible system ownership if implemented without resolution.
- **High** — likely to cause architectural rework, inconsistent workflows or untestable behaviour.
- **Medium** — meaningful completeness, usability, operational or governance gap.
- **Low** — editorial consistency or refinement.

## 3. Cross-module findings

### C-01 — No canonical DTE data model / ERD
**Severity: Critical**

The documents describe logical entities and references but do not establish a canonical entity catalogue, cardinalities, ownership, keys, constraints or lifecycle relationships. M05 explicitly leaves the physical schema unspecified; M11 describes event fields but not the canonical persistence model.

Required remediation:
- Create a canonical logical data model and ERD.
- Define entity ownership, primary identifiers, foreign-key semantics and tenant scope.
- Model question, question version, placement reference, schema, schema version, group, node/field definition, relationship type, mapping, mapping revision, archetype, question type, metadata definition/assignment, PYQ appearance, source evidence, review event, validation run, bulk job, AI suggestion and audit event.
- Decide which entities are DTE-owned versus referenced from external systems.
- Define uniqueness, nullability, cardinality, deletion/deactivation and historical retention.

### C-02 — Question identity and mapping attachment policy unresolved
**Severity: Critical**

M02 distinguishes logical question, exact content version and placement correctly. M03, M05, M07, M08 and M09 repeatedly defer whether metadata/mappings attach to the logical question, exact version or both. This is a foundational identity decision.

Required remediation:
- Define mapping categories and their attachment level.
- Specify inheritance or non-inheritance across question versions.
- Define how a content revision affects classification validity.
- Define placement-specific overrides, if any.
- Define how a question version is selected and pinned in tagging and review workflows.

### C-03 — Module ownership overlaps
**Severity: High**

The following responsibilities are not yet sufficiently separated:
- M10 Review & Approval versus M15 Configuration Version Manager: both describe approval/publication lifecycle for schema versions.
- M11 Version & History Manager versus M15: both describe version lifecycle, immutable snapshots, supersession and rollback.
- M16 Historical Enrichment Interface versus M18 External Engine Integration: both describe consumer events, APIs, replay and reconciliation.
- M01 Dashboard versus M14 Coverage & Productivity Analytics: both describe coverage, productivity and aggregate measures.
- M05 Relationship Mapping Engine versus M06 Archetype links, M09 provenance links and M02 duplicate/adapted question relationships.
- M04 Classification Configuration Studio versus M07 Question Type Manager and M08 Pedagogical Metadata Manager: ownership of their definitions, schema membership and versioning needs one consistent rule.

Required remediation:
- Add a responsibility assignment matrix (RACI/authoritative-owner matrix).
- Define one source of truth per entity and state transition.
- Treat dashboards as consumers of M14/M13 metrics, not duplicate metric owners.
- Treat M10 as workflow orchestration and M15 as schema-version lifecycle policy, or adopt another explicit division.
- Treat M11 as shared revision/audit infrastructure, not a second independent lifecycle authority.
- Decide whether M16 is a consumer-specific adapter under M18 or whether M18 is only the broader integration catalogue.

### C-04 — Workflow state machines are only illustrative
**Severity: High**

M03, M06, M10, M12 and M15 contain candidate statuses and steps, but there is no single normative state-transition specification. Status dimensions are correctly called out as separate, yet their allowed transitions and guards are not defined.

Required remediation:
- Specify separate state machines for work assignment, edit/draft, review, publication, validation, configuration lifecycle and bulk jobs.
- Define transition actor, preconditions, side effects, emitted events and failure recovery.
- Define state combinations that are valid or invalid.
- Define re-review triggers and approval invalidation rules.
- Define publication semantics for mapping records versus schema configuration.

### C-05 — Role and permission model absent
**Severity: High**

M01 provides candidate user categories and several modules mention server-side authorization, but the shared role-permission matrix is not present. “Authorized user” is too broad for implementation.

Required remediation:
- Define roles, permission actions, scope, resource types and field-level restrictions.
- Specify tenant-level, global/shared and cross-tenant administrator capabilities.
- Define separation of duties, self-approval, reviewer reassignment, emergency override and export privileges.
- Map each screen and API operation to permission checks.
- Define service-to-service identities and consumer scopes.

### C-06 — API and event contracts remain placeholders
**Severity: High**

M05, M16 and M18 list candidate fields and event names but not normative schemas, payload examples, response/error contracts, ordering, idempotency keys, authentication or compatibility rules. M16 and M18 repeat parts of the same integration requirements.

Required remediation:
- Create a single API catalogue and event catalogue.
- Provide JSON schema/examples, required/optional fields and versioning rules.
- Define authentication, authorization, rate limits, pagination, error codes and idempotency.
- Define event delivery, ordering, retry, replay, dead-letter and reconciliation.
- Document consumer-specific contracts for DRE and Student Tracking without implementing those systems.

### C-07 — Security statements are principles, not an authorization design
**Severity: High**

Most documents state tenant isolation and server-side authorization, but there is no threat model, RLS strategy, field-level policy, audit access policy or cross-tenant test matrix. M17 has governance/safety provisions but no distinct security section.

Required remediation:
- Define tenant ownership and RLS policy model.
- Define backend authorization enforcement and service-role boundaries.
- Define question licensing/content visibility and reviewer-note privacy.
- Define data retention, deletion, archival and export controls.
- Create negative security acceptance tests, especially cross-tenant read/write and aggregate leakage.

### C-08 — Acceptance criteria are not consistently executable
**Severity: High**

The documents have acceptance criteria, but most are statements such as “supports”, “preserves” or “enforces”. They lack test fixtures, precise expected results, edge cases and traceability to requirement IDs.

Required remediation:
- Create a requirements register with unique IDs.
- Link each acceptance criterion to one or more requirements and test cases.
- Define measurable performance, scale, accessibility and security tests.
- Include boundary cases and failure injection.
- Separate functional acceptance from non-functional acceptance.

### C-09 — No unified end-to-end workflow specifications
**Severity: High**

The module documents describe local workflows but do not fully specify complete journeys crossing inventory, tagging, validation, review, publication, versioning and downstream events.

Required remediation:
- Author end-to-end workflows with sequence diagrams and state transitions.
- Cover first-time tagging, correction/re-review, schema upgrade, bulk import, duplicate adjudication, PYQ verification, AI-assisted tagging and downstream mapping change.
- Include alternate, failure, retry and permission-denied paths.

### C-10 — Non-functional requirements are uneven
**Severity: Medium**

M01, M02, M05, M12 and M13 address scale/performance more directly. Several catalogue/configuration modules have no explicit performance, availability, observability or recovery requirements. The one-million-question target appears as a planning assumption but lacks workload profile and measurable service targets.

Required remediation:
- Define inventory size, tenant distribution, concurrent users, query patterns, bulk volumes and expected growth.
- Define latency, throughput, availability, recovery and background-job targets.
- Add observability, alerting, backup/restore and disaster-recovery requirements.

### C-11 — Global/shared versus tenant-owned governance remains open
**Severity: High**

M04, M06, M07 and M08 all allow global and tenant-specific catalogues but do not establish whether tenants inherit, copy, fork, override or reference global entities.

Required remediation:
- Define canonical ownership and extension model.
- Define whether tenant labels/aliases are overlays or separate records.
- Define update propagation and compatibility.
- Define how tenant-owned records may reference shared entities without cross-tenant leakage.

### C-12 — Schema migration and historical interpretation are incomplete
**Severity: High**

M04/M05/M13/M15/M11 mention compatibility and migration but no formal mapping migration algorithm, preview report, rollback strategy or historical interpretation policy exists.

Required remediation:
- Define schema diff semantics.
- Define node/field rename, split, merge, deprecation and deletion policies.
- Define mapping migration preview, conflict resolution, approval and execution.
- Preserve original mapping and schema references.
- Define revalidation and downstream notification rules.

### C-13 — AI governance is not yet an operational control framework
**Severity: Medium**

M17 captures model/prompt versions, rationale, confidence and human approval, but it does not define model-provider approval, data processing boundaries, retention controls, evaluation thresholds, monitoring ownership or release gates.

Required remediation:
- Define model/provider allowlist and data classification.
- Define prompt/retrieval versioning and evaluation datasets.
- Define category-specific thresholds and human review rules.
- Define drift monitoring, rollback and incident response.
- Define what content may be sent to external inference providers.

### C-14 — Terminology and identifiers need normalization
**Severity: Medium**

Terms such as mapping, relationship, classification field, classification node, classification group, completeness, publication, version and revision are used across documents but not all have a shared glossary. Some modules use mapping revision and relationship revision with potentially different meanings.

Required remediation:
- Create a canonical DTE glossary.
- Establish ID naming and version conventions.
- Distinguish entity version, content version, schema version, mapping revision, validation run and event schema version.
- Define status vocabulary and prohibit synonymous status labels with different semantics.

## 4. Individual module audit

| Module | Assessment | Principal gap / action |
|---|---|---|
| M01 Dashboard | Good functional outline; not implementation-ready | Metric ownership overlaps M14; role widgets, exact metric definitions, refresh and cache policy remain open |
| M02 Question Inventory | Strong identity/search foundation | Search semantics, canonical question source, duplicate adjudication, pagination consistency and saved-view policy unresolved |
| M03 Tagging Studio | Strong primary workspace description | Depends on unresolved identity policy, state machines, concurrency strategy, schema-change handling and detailed field-level permission model |
| M04 Classification Configuration Studio | Strong configurable-schema direction | Needs canonical schema metamodel, global/tenant extension policy, node/field distinction and migration semantics |
| M05 Relationship Mapping Engine | Strong normalized relationship principles | Needs relationship catalogue governance, endpoint/cardinality model, version attachment policy, inheritance decision and canonical persistence model |
| M06 Archetype Management | Clear reusable archetype identity | Needs global/tenant ownership, required fields, duplicate merge workflow and exact archetype-to-question version semantics |
| M07 Question Type Manager | Correctly separates type from difficulty/archetype | Needs definition ownership/versioning relationship with M04, seeded catalogue decision and assignment identity/cardinality |
| M08 Pedagogical Metadata Manager | Configurable descriptor model is sound | Needs controlled vocabulary governance, supported data types, assignment identity, free-text policy and downstream visibility |
| M09 PYQ Provenance Manager | Correctly separates appearance from question identity | Needs canonical exam/source catalogue, verification authority, adaptation taxonomy, evidence requirements and licensing policy |
| M10 Review & Approval | Strong separation of author/reviewer and approval/publication | Needs normative state machines, role matrix, reviewer assignment rules, self-approval policy, SLA and approval invalidation |
| M11 Version & History Manager | Strong immutable-history principles | Needs canonical revision model, retention policy, snapshot-vs-diff rules, event integrity and explicit boundary with M15 |
| M12 Bulk Tagging Manager | Strong dry-run, idempotency and reconciliation principles | Needs atomicity, file/row limits, formats, rollback/cancel semantics, approval gates and import schema contract |
| M13 Validation & Quality Engine | Strong configurable completeness and versioned rule model | Needs rule authoring governance, deterministic evaluation contract, exact workflow gates, revalidation policy and rule conflict handling |
| M14 Coverage & Productivity Analytics | Strong denominator and metric governance | Needs canonical metric catalogue, event-time semantics, refresh SLA, privacy thresholds and ownership boundary with M01 |
| M15 Configuration Version Manager | Strong immutable schema lifecycle concept | Needs separation from M10/M11, active-version resolution, multi-schema policy, migration workflow and publication failure recovery |
| M16 Historical Enrichment Interface | Correctly protects student evidence ownership | Needs a single event/API contract with M18, consumer registry, delivery guarantees and exact correction/reprocessing semantics |
| M17 AI Assistance Interface | Correct advisory/human approval boundary | Needs explicit security controls, provider/data policy, evaluation thresholds, evidence provenance, monitoring and incident controls |
| M18 External Engine Integration | Correct system ownership boundaries and DRE pointer concept | Needs concrete consumer contracts, authentication, API/event schemas, version compatibility and operational ownership |

## 5. Cross-module dependency corrections

The following ownership model is recommended for the next documentation revision. It is a proposed resolution, not yet an approved product decision.

| Concern | Authoritative owner | Other modules should do |
|---|---|---|
| Question discovery and list state | M02 | M01/M03 consume inventory queries |
| Classification schema authoring | M04 | M07/M08 manage specialized catalogues under the shared schema governance model |
| Relationship persistence and mapping semantics | M05 | M06/M09 provide domain-specific relationship workflows |
| Archetype identity and content | M06 | M03/M05 link archetypes to questions and classification nodes |
| Question type definitions | M07 | M03/M02 consume the catalogue |
| Pedagogical metadata definitions | M08 | M03/M02 consume the catalogue |
| PYQ appearance and evidence | M09 | M05 stores typed links where needed; M10 reviews verification |
| Human review workflow | M10 | M04/M06/M07/M08/M09/M12/M15 submit governed revisions |
| Shared revision and audit infrastructure | M11 | All governed modules create revisions/events through this service |
| Bulk job orchestration | M12 | Domain modules supply validation/commit handlers |
| Validation rules and completeness profiles | M13 | Other modules consume findings; M14 aggregates results |
| Metric definitions and aggregation | M14 | M01 presents dashboards and drill-downs |
| Schema lifecycle and active version selection | M15 | M04 authors; M10 reviews; M11 records history |
| Historical enrichment adapter | M16 or M18 (decision required) | Student Tracking remains an external consumer |
| AI suggestion generation and evaluation | M17 | M03 presents suggestions; M10 governs any required human review |
| External API/event catalogue | M18 | M16 should be consolidated as a consumer adapter or clearly narrowed |

## 6. Priority remediation plan

### P0 — Must resolve before data model or implementation
1. C-01 Canonical data model and entity ownership.
2. C-02 Question/mapping/version attachment policy.
3. C-03 Module responsibility boundaries.
4. C-04 Normative workflow state machines.
5. C-05 Unified roles and permissions.
6. C-06 Canonical API/event contracts.
7. C-07 Tenant/security authorization model.

### P1 — Must resolve before implementation approval
8. C-08 Requirements-to-test traceability.
9. C-09 End-to-end workflows.
10. C-11 Global/shared versus tenant-owned governance.
11. C-12 Schema migration and historical interpretation.
12. C-14 Canonical glossary and identifier/version conventions.

### P2 — Complete before production readiness
13. C-10 Measurable non-functional and operational requirements.
14. C-13 AI operational governance.
15. Module-specific UX states, reporting and edge-case refinements.

## 7. Required new DTE documentation artifacts

Recommended next artifacts:
1. DTE_CANONICAL_GLOSSARY.md
2. DTE_MODULE_RESPONSIBILITY_MATRIX.md
3. DTE_CANONICAL_DATA_MODEL.md
4. DTE_QUESTION_IDENTITY_AND_VERSIONING_POLICY.md
5. DTE_WORKFLOW_STATE_MACHINES.md
6. DTE_ROLES_AND_PERMISSIONS.md
7. DTE_API_AND_EVENT_CATALOGUE.md
8. DTE_SCHEMA_MIGRATION_POLICY.md
9. DTE_END_TO_END_WORKFLOWS.md
10. DTE_REQUIREMENTS_AND_TEST_TRACEABILITY.md
11. DTE_SECURITY_AND_TENANT_ISOLATION.md
12. DTE_NON_FUNCTIONAL_REQUIREMENTS.md
13. DTE_AI_GOVERNANCE.md

These artifacts should be authored before module documents are declared final. They may require controlled revisions to multiple module specifications.

## 8. Audit disposition

- All 18 module documents exist in GitHub and were read back for this audit.
- No module is approved for implementation by this audit.
- No code, database schema, production data or deployment was changed.
- The existing module specifications remain at v0.1.0 Draft.
- Audit status: **Remediation required before approval baseline**.
- Recommended next step: resolve P0 cross-module architecture and ownership decisions, then update affected module documents using versioned changes.

## 9. Audit change history

| Version | Date | Status | Change |
|---|---|---|---|
| 0.1.0 | 2026-11-06 | Draft | Initial cross-module audit of all 18 DTE module specifications |

## 10. Approval

- Product owner review: Pending
- Technical architecture review: Pending
- Audit closure: Not approved
