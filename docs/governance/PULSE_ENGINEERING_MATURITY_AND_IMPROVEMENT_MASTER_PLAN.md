# PULSE Engineering Maturity & Improvement Master Plan

**Document ID:** PULSE-GOV-ENG-001  
**Version:** 1.0.0  
**Status:** Proposed improvement baseline — owner review required  
**Date:** 2026-11-07  
**Repository:** `anshuljindalsecondbrain-art/pulse`  
**Branch:** `docs/system-a-database-governance`

> This document is an improvement plan, not an approval to execute production changes. It does not authorize application-source replacement, schema changes, data movement, grants/RLS changes, PR merge, deployment or release.

## 1. Purpose

Establish an evidence-driven engineering operating model for PULSE. The objective is to close the gap between product requirements, approved architecture, application source, operational databases, tests and releases.

PULSE should adopt useful engineering practices from mature technology organisations without copying their scale or introducing unnecessary organisational and infrastructure complexity.

## 2. Assessment method and limitations

This is a preliminary, evidence-based assessment using:
- Existing PULSE governance decisions and GitHub documentation.
- Uploaded System A and System B project exports and the Student Tracking System document.
- The read-only source and integration audit recorded in `PULSE_EXISTING_APPLICATION_SOURCE_AND_INTEGRATION_AUDIT.md`.
- Engineering practices publicly documented by Google, Amazon, Shopify, Uber, Airbnb and Stripe.

The maturity scores below are advisory ordinal ratings, not external certifications, statistical benchmarks or independent audit results. A score must be raised only when evidence exists. A document or proposal alone does not prove implementation.

## 3. Executive assessment

PULSE has a substantial product vision, rich domain discussions, and meaningful governance decisions. The primary weakness is the incomplete operational link between approved requirements, canonical source code, databases, automated verification and releases.

### 3.1 Provisional maturity scorecard

| Dimension | Current score / 10 | Target / 10 | Assessment |
|---|---:|---:|---|
| Product vision | 8 | 9 | Strong direction; consolidate into one approved product baseline |
| Requirements management | 7 | 9 | Rich specifications; cross-domain traceability needs enforcement |
| Documentation governance | 7 | 9 | Registers and versioning exist; synchronisation with code is not consistently evidenced |
| Architecture governance | 6 | 9 | Important decisions exist; application and data boundaries remain unreconciled |
| Domain ownership | 6 | 9 | Conceptual boundaries exist; enforce through schema and interfaces |
| Database governance | 6 | 9 | Strong decision work; target physical schema and migration pipeline remain incomplete |
| Source control | 5 | 9 | GitHub exists; multiple application candidates and data stores remain |
| Testing and QA | 5 | 9 | Test scenarios specified; execution evidence is incomplete |
| Security governance | 6 | 10 | Security principles approved; comprehensive enforcement evidence is outstanding |
| Release management | 4 | 9 | Exact-commit validation and release controls need strengthening |
| Observability | 3 | 9 | Operational telemetry and incident evidence are not yet established |
| Experimentation | 4 | 8 | A/B testing concepts exist; telemetry and experiment validity are unverified |

### 3.2 Overall conclusion

PULSE is stronger in product and architecture planning than in integrated implementation and operations. The immediate objective is not to add more modules. It is to establish one traceable engineering path from approved requirement to verified release.

## 4. Benchmark principles and PULSE adaptations

| Reference organisation | Publicly documented practice | PULSE adaptation |
|---|---|---|
| Amazon | Working Backwards / PRFAQ: start from customer outcome and work backwards | Product brief, user problem, FAQ, measurable outcome and scope before implementation |
| Google | Design review, code review, test and documentation discipline, SRE launch readiness | Architecture review, mandatory PR checks, docs-in-change, release readiness checklist |
| Shopify | Modular monolith and explicit component boundaries | Modular monolith first; domain ownership and dependency rules before service extraction |
| Uber | Domain-Oriented Microservice Architecture (DOMA) | Clear domain boundaries, dependency direction and ownership; defer microservices |
| Airbnb | Domain-aware data modelling and unified models for cross-cutting concepts where appropriate | Shared platform identity, domain-owned academic entities and explicit contracts |
| Stripe | Safe online database migration patterns and validation | Backups, backfill, comparison, controlled cutover, rollback and retirement gates |

These are inspiration and benchmark references, not assertions that PULSE should reproduce each company's complete architecture.

## 5. Current PULSE evidence baseline

### 5.1 Established strengths

- DEC-011 approved the shared PULSE identity architecture for System A.
- DEC-012 selected tenant memberships, tenant-owned students with optional person identity, and explicit enrollments.
- DEC-013 selected the initial single-key Supabase Auth identity mapping.
- The internal pilot operating model selected one Super Admin, no student login initially, and both exercise-level and question-level tracking.
- System A has detailed academic workflow and evidence requirements.
- System B/DTE has extensive configurable classification, manual-first tagging, review and versioning specifications.
- GitHub is intended as the canonical engineering record.
- Existing database governance documents explicitly distinguish proposals from approvals and do not authorize production DDL.

### 5.2 Known structural gaps

- Student Tracking Lovable, QBMS Lovable, GitHub prototype and standalone PULSE Supabase are separate environments.
- The standalone PULSE Supabase project was previously inspected as healthy but empty of application tables and applied migrations.
- The Student Tracking Lovable application has an independent managed database and an existing identity model that requires reconciliation with the approved shared identity decisions.
- The QBMS application has a separate managed database.
- The GitHub System A prototype is not the same source as the Student Tracking Lovable application.
- Some schema decisions remain open; examples include enrollment lifecycle and concurrent active enrollment policy.
- The earlier audit did not establish full local test execution, migration replay, browser automation, penetration testing or load-test evidence.
- A successful build or preview is not proof of production readiness.

### 5.3 Evidence status rule

Use these terms consistently:
- **Verified:** directly inspected evidence exists.
- **Proposed:** design or recommendation exists but is not approved.
- **Approved:** explicit owner decision exists.
- **Implemented:** code or schema exists in the intended canonical source.
- **Tested:** named test ran against a stated commit/environment and passed.
- **Released:** exact artifact/commit was deployed and verified.
- **Blocked:** a named dependency or approval prevents safe progress.
- **Superseded:** retained for history but replaced by a later decision.

Never promote an item from Proposed to Approved, Implemented, Tested or Released without evidence.

## 6. Target engineering operating model

### 6.1 Product-to-release traceability

Every meaningful change must be traceable through:

`Problem → Requirement → Specification → Decision/ADR → Issue/Task → Branch → PR → Test Evidence → Release`

Recommended identifiers:
- `PULSE-REQ-####` — requirement
- `PULSE-ADR-####` — architecture decision
- `PULSE-EVT-####` — change/event record
- `PULSE-ISSUE-####` — implementation work item (GitHub issue number may serve as the external key)
- `PULSE-TEST-####` — test case/evidence
- `PULSE-REL-####` — release record

Do not create duplicate registers when an existing canonical register can hold the information. The master register should index detailed records rather than duplicate them.

### 6.2 Five approval gates

| Gate | Approval authority | Required evidence | Authorises |
|---|---|---|---|
| G1 Product | Product Owner | Problem, users, outcome, scope, requirements and acceptance criteria | Product scope |
| G2 Architecture | Technical Owner | Domain boundaries, data ownership, security, interfaces, ADRs and risks | Technical baseline |
| G3 Experience | Product + Technical Owner | Approved workflows, screen states, accessibility and interaction rules | UX baseline |
| G4 Build | Technical Owner / reviewer | Issue, implementation plan, tests, reviewed PR and migration review | Merge to canonical branch, subject to branch policy |
| G5 Release | Product + Technical Owner | Exact commit, CI, migration status, security checks, backup/rollback and acceptance | Deployment/release |

Security-sensitive, destructive or difficult-to-reverse changes require explicit approval regardless of gate.

### 6.3 Change control

Every significant change must record:
- Original request/source and date.
- Event ID and affected requirements.
- Affected domains, data entities, APIs, screens and integrations.
- Current behaviour and problem.
- Proposed change and alternatives.
- Compatibility and migration impact.
- Security, privacy and academic-integrity impact.
- Approval, rejection or deferral and rationale.
- Branch, PR, commit SHA and changed files.
- Test cases, exact run evidence and result.
- Documentation updated.
- Release reference and follow-up.

No silent deletion of requirements or decisions. Superseded records remain discoverable.

## 7. Canonical domain ownership baseline

This table is a proposed logical ownership direction and must be reconciled with the approved domain specifications before implementation.

| Domain | Owns | Boundary |
|---|---|---|
| Shared PULSE Core | Tenants, people, Auth identity mapping, tenant memberships, role grants and shared platform identity | Does not own student academic activity |
| System A | Tenant-owned student records, enrollments, academic context, assignments, obligations, activity evidence, verification, correction and doubt workflows | References canonical question identities/versions where available; does not own QBMS question content |
| QBMS | Canonical question identity, question versions, content, sources and media relationships | Does not own student performance |
| DTE | Configurable classification frameworks, taxonomy versions and question-classification mappings | Does not become a duplicate question identity owner |
| Difficulty Engine | Static/dynamic difficulty models, contextual scores, rules and scoring history | Difficulty context must be explicit; no universal difficulty assumption |
| Test Management | Test blueprints, assembled test versions, delivery and results under its approved ownership contract | References canonical question versions; avoids duplicated question content |
| AI-Mentor | Mentoring workflows, intervention recommendations, explanations and decision evidence | Reads approved domain data through contracts; does not create shadow academic truth |
| Media/CMS | Managed learning assets and content lifecycle | Domain-specific ownership and access rules remain explicit |
| Analytics | Governed metrics, reporting models and derived data | Derived metrics must preserve lineage to source records |

### 7.1 Required ownership artefact

Create and maintain a canonical entity register with:
- Entity name and stable identifier.
- Owning domain.
- Authoritative write path.
- Read consumers.
- Tenant scope.
- Lifecycle and retention.
- Versioning requirements.
- Cross-domain references.
- API/event contract.
- Migration owner.

## 8. Architecture and implementation strategy

### 8.1 Recommended starting architecture

Use a modular monolith with clear domain modules, shared platform capabilities and controlled database interfaces. Do not introduce microservices until independent scaling, deployment, team ownership or fault-isolation needs justify them.

### 8.2 Source-of-truth policy

- GitHub is the canonical source for approved application code, migrations, tests, engineering documentation and decision records.
- Supabase is the operational database platform only after the target project and migration strategy are explicitly approved.
- Lovable is a development/prototyping surface; it is not automatically the canonical source of truth.
- Figma is the design collaboration source; approved design decisions and links must be recorded in GitHub.
- Chat conversations and exported PDFs are source material, not automatically current specifications.
- The current standalone PULSE Supabase project is a proposed consolidation target, not an approved target until the owner confirms it.

### 8.3 Canonical application decision gate

Before implementation resumes, explicitly decide:
1. Which application source becomes the canonical System A baseline.
2. Which application source becomes the canonical QBMS baseline.
3. Whether to consolidate into one repository/monorepo or maintain multiple repositories with explicit contracts.
4. Which Supabase project is the canonical operational database.
5. What data must be migrated, retained, archived or excluded.

The prior recommendation to consider the standalone PULSE Supabase project remains a proposal pending owner confirmation. No source replacement or database consolidation is authorised by this document.

## 9. Database engineering controls

Every database change must follow:

1. Requirement and ownership review.
2. Logical ERD and physical schema review.
3. Decision closure or explicit safe deferral.
4. Migration generation in canonical repository.
5. Local database replay from a clean state.
6. Schema, constraint and index assertions.
7. RLS, grants, actor-resolution and tenant-isolation tests.
8. Data migration rehearsal with controlled fixtures.
9. Backup and recovery verification.
10. Explicit deployment approval.
11. Deployment with exact migration identifiers.
12. Post-deployment verification and monitoring.

For data consolidation, adopt a staged approach inspired by Stripe:
- Inventory and backup source systems.
- Map source identifiers to canonical identifiers.
- Backfill into a target without destroying source data.
- Compare counts, relationships, constraints and business-level results.
- Reconcile discrepancies.
- Switch reads and writes only after approval.
- Retain a rollback window.
- Retire old sources only after acceptance.

Do not use dual-write as a default. If dual-write is necessary, define idempotency, conflict resolution, replay and reconciliation first.

## 10. Source control and code review policy

Recommended controls:
- Protected canonical `main`.
- Feature branches for meaningful changes.
- Pull request for every merge.
- Required reviewer for code and schema changes.
- CI checks on the exact PR head SHA.
- No direct production edits outside versioned migrations.
- No secrets in source code or browser bundles.
- No real student personal data in demo fixtures.
- PR description links requirements, ADRs, issues and tests.
- Architecture-impacting changes require an ADR.
- Generated code is reviewed as code; generation is not approval.

Minimum CI checks:
- Formatting and lint.
- Typecheck.
- Unit tests.
- Integration tests.
- Build.
- Migration replay and schema assertions.
- RLS/security tests where applicable.
- Dependency and secret scanning.
- E2E tests for critical user journeys.

## 11. Quality engineering framework

### 11.1 Test layers

| Layer | Purpose | Candidate tooling |
|---|---|---|
| Unit | Pure domain logic and calculations | Vitest |
| Integration | Repository, service and database interactions | Vitest + local Supabase |
| Database | Constraints, triggers, functions and RLS | pgTAP / SQL assertions |
| API contract | Compatibility between domain interfaces | Contract tests |
| E2E | End-to-end critical workflows | Playwright |
| Accessibility | Keyboard, focus, labels and assistive technology | Playwright + axe |
| Security | Tenant isolation, authorization, abuse and data exposure | Dedicated security test suite |
| AI evaluation | Accuracy, groundedness, safety and regression | Promptfoo / DeepEval |
| Performance | Latency, concurrency and capacity | Load-test tooling selected during implementation |

### 11.2 System A critical acceptance journey

The first usable pilot must demonstrate:
1. Super Admin creates and maintains student records.
2. Academic catalogue and batches can be configured within approved ownership boundaries.
3. Exercise inventory can be created.
4. Exercise can be assigned to eligible students.
5. Student obligations are generated correctly.
6. Exercise-level quick entry works.
7. Question-level detailed evidence works.
8. Aggregate/question-level reconciliation flags discrepancies.
9. Verification is distinct from correctness.
10. Doubt and correction workflows preserve history.
11. Reports reconcile to source evidence.
12. Tenant isolation and audit provenance pass tests.

### 11.3 DTE critical acceptance journey

DTE should prove:
1. Frameworks can be configured without hardcoded academic levels.
2. Manual tagging is the default.
3. AI tagging is inactive unless explicitly enabled.
4. AI suggestions do not constitute academic approval.
5. Review and correction cycles preserve version-specific evidence.
6. Approved mappings can be traced to framework versions.
7. Question identity, question version and exercise slot remain distinct.
8. Historical enrichment does not rewrite original student evidence.

## 12. Security, privacy and governance controls

Minimum controls before multi-user or production exposure:
- Threat model and data classification.
- Tenant-scoped authorization and cross-tenant regression tests.
- Server-side actor resolution.
- No browser service-role credentials.
- Reviewed grants and RLS policies.
- Audit events for sensitive operations.
- Secret management and rotation.
- Dependency and vulnerability scanning.
- Data retention and deletion policy.
- Export and reporting authorization.
- Backup restore drills.
- Incident response and access revocation procedures.

The internal pilot's one-Super-Admin model does not eliminate tenant boundaries, provenance, auditability or server-side authorization.

## 13. Release and operational readiness

Every release must include:
- Exact Git commit SHA.
- Build and CI evidence tied to that SHA.
- Migration identifiers and application status.
- Environment and configuration references.
- Security and access checks.
- Backup status and restore evidence.
- Rollback plan.
- Known issues and accepted risks.
- Product acceptance.
- Release owner and timestamp.
- Post-release health check.

Operational monitoring should cover:
- Application availability and errors.
- Database health, slow queries and connection saturation.
- Failed jobs and integration failures.
- Authorization denials and suspicious access patterns.
- Migration failures.
- Data reconciliation exceptions.
- AI latency, cost, evaluation quality and failure rates where AI is enabled.

Define service-level objectives only after baseline measurements exist. Do not invent reliability targets without operational evidence.

## 14. Experimentation and product analytics

PULSE has proposed A/B experiments for faculty logging, doubt triage, mentor intervention, student backlog and parent engagement. These remain design proposals until telemetry and experiment validity are verified.

Before an experiment:
- State the hypothesis.
- Define eligible population and randomisation unit.
- Define primary metric and guardrail metrics.
- Define exposure and outcome events.
- Prevent duplicate or missing event capture.
- Establish privacy and retention rules.
- Calculate sample-size and duration requirements.
- Define stopping and decision rules.
- Record results and limitations.

Do not treat a proposed uplift target as a measured result. Avoid experiments that compromise student privacy or academic fairness.

## 15. Six-stage improvement roadmap

| Stage | Workstream | Main deliverables | Exit criteria |
|---|---|---|---|
| 1 | Governance Freeze | Canonical registers, source inventory, decision status, baseline policy | One reviewed engineering baseline; unresolved decisions visible |
| 2 | Architecture and Database Foundation | Canonical app/database decision, domain ownership, ERD, contracts, migration strategy | Approved target architecture and migration plan |
| 3 | Engineering Infrastructure | Protected branches, CI, test environments, migration replay, security checks | Reproducible build and automated verification |
| 4 | System A pilot | Student Master, academic setup, exercises, assignments, dual tracking, verification and reports | Critical end-to-end pilot acceptance tests pass |
| 5 | Domain Integration | QBMS, DTE and Difficulty Engine contracts and integrations | Cross-domain contract and reconciliation tests pass |
| 6 | Intelligence and Scale | AI-Mentor, advanced analytics, experiments, performance and capacity | Measured academic value, quality and operational readiness |

Stages are sequential decision gates, not calendar promises. Work may overlap only when dependencies are satisfied.

## 16. Prioritised gap register

| Gap ID | Gap | Severity | Required improvement | Closure evidence |
|---|---|---|---|---|
| ENG-GAP-001 | Multiple candidate application sources | Critical | Select and document canonical application source(s) | Approved source-of-truth decision |
| ENG-GAP-002 | Separate application databases | Critical | Inventory, map and approve consolidation strategy | Source inventory, mappings and approved migration plan |
| ENG-GAP-003 | No complete integrated architecture baseline | High | Approve domain, identity, data and interface architecture | Versioned architecture baseline |
| ENG-GAP-004 | Requirements-to-test traceability incomplete | High | Link requirements to tasks and tests | Traceability report |
| ENG-GAP-005 | CI and test evidence not consistently tied to release SHA | High | Enforce exact-head CI and release evidence | Required checks on exact commit |
| ENG-GAP-006 | Database migration pipeline incomplete | Critical | Local replay, schema tests, RLS tests and controlled deployment | Reproducible migration test report |
| ENG-GAP-007 | Security enforcement evidence incomplete | Critical | Threat model, grants/RLS tests and actor-resolution checks | Security test evidence |
| ENG-GAP-008 | Release and rollback process incomplete | High | Release checklist, backup and rollback rehearsal | Approved release record |
| ENG-GAP-009 | Operational observability immature | High | Health metrics, logs, alerts and incident process | Verified dashboards and alert tests |
| ENG-GAP-010 | Experimentation telemetry unverified | Medium | Event contracts, privacy and experiment analysis | Validated telemetry and experiment report |
| ENG-GAP-011 | Module inventory contains historical competing counts | Medium | Canonical module register with supersession | Approved module/domain register |
| ENG-GAP-012 | Documentation/code drift risk | High | PR-linked documentation checks and ownership | Sampled PR audit with no unexplained drift |

Severity is a prioritisation assessment, not a formal risk certification.

## 17. Quarterly maturity measurement

Review the scorecard quarterly. Each score increase must cite evidence such as:
- Approved document or decision.
- Merged PR and commit SHA.
- CI run and test report.
- Applied migration record.
- Security review.
- Release record.
- Monitoring or incident evidence.

Do not increase scores based solely on plans, prompts, mockups, prototypes or successful local builds.

## 18. Roles and responsibility

For the current internal pilot:
- **Product Owner / Academic Owner:** approves product scope, academic workflows, priorities and academic policy.
- **Technical Owner:** approves architecture, schema, security design, implementation standards and technical release readiness.
- **Developer:** implements approved tasks, tests, documents and submits PRs.
- **Reviewer:** checks code, tests, architecture impact and documentation.
- **Super Admin / Pilot Operator:** operates the pilot and reports workflow defects; operational data entry does not grant engineering approval.

One person may hold multiple roles in a small team, but the approval being exercised must be explicit. High-risk changes should receive a separate review wherever practical.

## 19. Immediate action plan

The next safe actions are read-only or documentation-only until the relevant owner approvals are obtained:

1. Reconcile this plan with the existing master index and decision register.
2. Create a canonical source-of-truth inventory covering GitHub, both Lovable projects and Supabase.
3. Create a domain/entity ownership register.
4. Create a requirement-to-test traceability baseline for System A P0/P1.
5. Create an open-decision and blocker dashboard.
6. Prepare the canonical application/database options paper.
7. Present the target architecture and migration strategy for owner approval.

Do not start source replacement, production DDL, data movement, grants/RLS changes, PR merge or deployment as a consequence of this plan alone.

## 20. External engineering references

- Google Cloud, change management: https://cloud.google.com/architecture/framework/operational-excellence/change-management
- Google, documentation best practices: https://developers.google.com/tech-writing
- Google Engineering Practices, code review: https://google.github.io/eng-practices/
- Google SRE, launch coordination: https://sre.google/workbook/launch-checklist/
- Amazon, Working Backwards: https://www.amazon.jobs/content/en/our-workplace/working-backwards
- Shopify Engineering, modular monolith: https://shopify.engineering/deconstructing-monolith-designing-software-maximizes-developer-productivity
- Uber Engineering, DOMA: https://www.uber.com/blog/microservice-architecture/
- Stripe, online migrations: https://stripe.com/blog/online-migrations
- Airbnb Engineering, Viaduct: https://medium.com/airbnb-engineering

External links are reference starting points. Revalidate URLs and source content before using them in a formal external benchmark or policy citation.

## 21. Approval record

| Item | Status |
|---|---|
| Document drafted | Complete |
| Evidence baseline compiled | Preliminary |
| Product Owner approval | Pending |
| Technical Owner approval | Pending |
| Architecture baseline approval | Pending |
| Implementation authorisation | Not granted |
| Production change authorisation | Not granted |

---
**End of document**
