# DTE-M01 — DTE Dashboard Specification

- Document ID: PULSE-DTE-M01
- Version: 0.2.0
- Status: Draft — Phase 1 rewrite; pending product, operations and technical review
- Phase: Current — offline tagging framework and operating management
- Governing references:
  - `docs/dte/DTE_PRODUCT_SCOPE_AND_PHASE_ROADMAP.md`
  - `docs/dte/DTE_MODULE_PHASE_DISPOSITION.md`
  - `docs/dte/current-phase/DTE-P1_OFFLINE_TAGGING_OPERATING_MODEL.md`
  - `docs/dte/current-phase/DTE-P1_REQUIREMENTS_AND_ACCEPTANCE_BASELINE.md`
  - `docs/dte/modules/DTE-M04_CLASSIFICATION_CONFIGURATION_STUDIO_SPECIFICATION.md`
  - `docs/dte/modules/DTE-M10_REVIEW_APPROVAL_SPECIFICATION.md`
  - `docs/dte/modules/DTE-M11_VERSION_HISTORY_MANAGER_SPECIFICATION.md`
  - `docs/dte/modules/DTE-M13_VALIDATION_QUALITY_ENGINE_SPECIFICATION.md`
- Last updated: 2026-11-06
- Implementation authorization: Not granted

## 1. Purpose

The DTE Dashboard is the role- and permission-aware operational entry point for the current Phase 1 product. It gives authorized users a concise view of institution-approved framework status, offline tagging work-package operations where confirmed, review activity, validation findings and recent governance events.

The dashboard is an overview, navigation and monitoring surface. Detailed framework editing belongs to M04; review decisions belong to M10; version/history semantics belong to M11; validation execution and findings belong to M13. The dashboard does not become the authoritative owner of those records or business rules.

## 2. Phase 1 product boundary

### 2.1 In scope

The Phase 1 dashboard may present:
- Framework configuration and lifecycle status.
- Framework versions awaiting academic review or activation, where applicable.
- Template/instruction readiness and version references, if managed in DTE.
- Offline work-package counts and status, if work-package management is confirmed.
- Assignment and submission status, if confirmed.
- Review queue and correction status, if software-managed review is confirmed.
- Validation errors, warnings and unresolved configuration exceptions.
- Recent framework, review, validation and work-package activity.
- Current-phase operational metrics only where definitions and data sources are approved.
- Role-aware navigation to the owning modules.
- Tenant/scope-aware filters and reporting period controls where useful.

### 2.2 Explicitly out of scope

M01 MUST NOT display or calculate as Phase 1 dashboard features:
- Total digital question inventory.
- Question upload/ingestion, OCR or parsing activity.
- Digital question tagging queues or question-to-tag mappings.
- Question identity, question version or placement metrics.
- Question-level archetype, question-type, pedagogical or PYQ assignment coverage.
- Digital bulk-tagging throughput.
- AI tagging suggestions or AI acceptance metrics.
- Student attendance, assignments, attempts, performance, mastery or behavior.
- Test series, test delivery or test scoring.
- Difficulty scores, exam multipliers or DRE analytics.
- Q-GENOME or other future-engine integration status unless separately approved as a later-phase dashboard.

A question locator appearing in an offline work package remains an external reference; it does not authorize question inventory counts or question-level dashboard entities.

## 3. Users and access

Candidate roles, subject to the approved roles/permissions matrix:

| Role | Dashboard purpose | Proposed visibility |
|---|---|---|
| Academic Framework Owner | Monitor framework review, approval and active versions | Frameworks within delegated institution scope |
| Framework Administrator | Monitor configuration drafts, validation defects and review returns | Frameworks they are authorized to administer |
| Tagging Coordinator | Monitor offline packages, assignment, submission and exceptions | Assigned operational scope, if enabled |
| Tagger | See own assigned packages and returned corrections | Own/assigned work only, if enabled |
| Checker / Academic Reviewer | See assigned review queue and pending exceptions | Assigned review scope |
| DTE Administrator | Monitor technical/configuration health and permitted operational status | Explicitly authorized tenant scope; no implied academic authority |
| Auditor / Read-only User | Inspect permitted status and governance history | Read-only authorized scope |

The final role list and grants are not approved by this specification. A technical administrator does not automatically receive academic approval authority.

### 3.1 Authorization requirements

- Every metric, filter, drill-down and activity item must be authorized server-side.
- Tenant and institution boundaries apply to aggregate as well as record-level queries.
- The dashboard must not reveal the existence or count of inaccessible records through totals, error messages or filter options.
- A user may see only data within the user's assigned and delegated scope.
- Role changes and access revocation must affect subsequent requests and cached data access.

## 4. Dashboard information architecture

The dashboard is composed of independently permissioned sections. Exact widget visibility is role- and workflow-dependent. No widget is mandatory for every role.

### 4.1 Header and context

Potential elements:
- Product title: Deep Tagging Engine.
- Active institution/tenant context.
- Current framework and version context where relevant.
- Reporting period selector only for time-based metrics.
- Navigation to permitted DTE modules.
- Notifications/activity entry point, if notifications are approved.
- User/account menu.
- Visible indication of the scope being reported.

The dashboard must not show an active framework as a universal global framework if the institution has multiple independent frameworks or scopes.

### 4.2 Framework status

Potential indicators:
- Number of framework records in the user's scope.
- Draft framework versions.
- Framework versions submitted for academic review.
- Approved versions awaiting activation, if activation is separate.
- Active framework versions.
- Superseded/retired versions, where useful and permitted.
- Structural validation failures and warnings.

Every count must define whether it counts logical frameworks, revisions or framework versions. Do not add all three units into one total.

### 4.3 Offline work-package operations

This section is conditional on confirmation that DTE manages work packages.

Potential indicators:
- Packages in Draft / Ready / Assigned / In Progress.
- Packages awaiting submission or receipt.
- Packages undergoing technical validation.
- Packages in checking/review.
- Packages returned for correction.
- Packages with unresolved exceptions.
- Approved or closed packages.
- Packages by coordinator, assignee or due date, if those attributes are approved.

The dashboard must use the state vocabulary and transition rules ratified by the operating workflow. Candidate states in draft documents are not automatically approved. Do not infer overdue status unless an SLA and timezone policy are configured.

### 4.4 Review and approval overview

Where software-managed review is enabled, potential indicators:
- Framework versions awaiting review.
- Work-package submissions awaiting checking/review.
- Items assigned to the current reviewer.
- Returned items awaiting correction.
- Open academic exceptions.
- Recent approval, rejection and return decisions.

The dashboard must distinguish technical validation, operational checking, academic approval and framework activation. It must not imply that these are the same status or that approval automatically means activation.

### 4.5 Validation and quality overview

Potential indicators:
- Blocking validation errors.
- Warnings requiring attention.
- Framework configurations with unresolved structural findings.
- Stale validation results.
- Offline submission validation outcomes, only if file intake is approved.
- Unresolved validation-related exceptions.

M13 owns validation rules, severities and findings. M01 only summarizes them and links to the permitted resolution view. A validation failure must not be counted as an academic rejection unless a separate human decision says so.

### 4.6 Current-phase operational metrics

If confirmed by product owner, metrics may include:
- Work packages issued/completed during a period.
- Work-package completion by status.
- Review turnaround time.
- Return/correction rounds.
- Open exception counts and age.
- Framework configuration/review throughput.

These are candidate metrics, not approved KPI targets. Productivity must not be used as a proxy for academic quality. Do not rank individual taggers or reviewers unless explicitly approved.

### 4.7 Recent activity

A permission-filtered feed may include:
- Framework created or revised.
- Framework submitted, approved, activated, superseded or retired.
- Template/instruction package issued.
- Work package assigned, submitted, returned or closed, if enabled.
- Validation run completed or failed.
- Exception opened or resolved.
- Review decision recorded.

Each event should display an understandable event label, actor where permitted, timestamp, artifact reference and relevant version. The feed must not expose confidential reviewer notes, restricted evidence or question content.

## 5. Filters and drill-down

Candidate filters:
- Institution/tenant, only where the user is authorized for multiple scopes.
- Framework identity and version.
- Framework lifecycle status.
- Work-package status, if enabled.
- Review status and reviewer, if enabled.
- Validation severity/result.
- Coordinator/assignee, if enabled.
- Reporting period for time-based measures.

Rules:
1. Filter options must themselves be permission-scoped.
2. Every card/chart drill-down preserves the exact filters and counting semantics used by its summary.
3. Changing a filter refreshes all dependent widgets consistently.
4. The UI indicates the active scope and reporting period.
5. Zero matching records, no data, loading, unavailable and error are distinct states.
6. The browser must not download all work packages, framework records or event history to calculate dashboard totals.
7. Filter combinations must not expose inaccessible record counts.

## 6. Metric specification requirements

No ambiguous metric label may ship without a documented definition. For every metric, record:
- Stable metric ID and display label.
- Business definition and purpose.
- Counting unit: logical framework, framework revision, framework version, work package, submission, review event, exception or another explicitly named unit.
- Formula and aggregation.
- Included/excluded statuses.
- Tenant, institution and role scope.
- Time-window semantics and timezone.
- Source module/API/read model.
- Refresh cadence and last-updated semantics.
- Drill-down mapping and authorization behavior.
- Empty/error behavior.
- Acceptance tests.

A count of work packages is not a count of questions. Offline external locators must not be aggregated and presented as a digital question inventory.

No numeric target, SLA, threshold or default reporting period is established by this draft.

## 7. Data ownership and dependencies

M01 is a consumer/presentation layer.

| Source/owner | Dashboard data consumed | Dashboard must not own |
|---|---|---|
| M04 Framework Configuration | Framework identity, configuration and lifecycle context | Framework definitions or edits |
| M10 Review & Approval | Review queues, decisions and correction status | Approval decisions or review state transitions |
| M11 Version & History | Version references and permitted history events | Version numbering, snapshots or history authority |
| M13 Validation & Quality | Rule findings, validation run status and severity | Validation rules, result semantics or waivers |
| Offline operating workflow | Work-package and assignment status, if confirmed | Offline tagging decisions or academic interpretation |
| Identity/authorization | Actor, tenant and permitted scope | User identity/role authority |
| M14/shared reporting | Approved aggregate metrics, if defined | Independent metric formulas that conflict with source owners |

M01 must not create shadow copies of business states. If a read model is used, it must be traceable to the authoritative source and have defined freshness/reconciliation behavior.

## 8. UX requirements

### 8.1 Desktop

- Present high-priority framework and operational status first.
- Put actionable queues and blocking exceptions before secondary trend charts.
- Use clear labels, units and contextual metric definitions.
- Provide navigation from each actionable widget to the owning workflow.
- Support independent widget loading and localized failure.
- Avoid showing every metric to every role.
- Distinguish current status from time-period activity.

### 8.2 Mobile and narrow screens

- Use a single-column or responsive layout.
- Keep scope and filter controls accessible.
- Avoid horizontal overflow.
- Preserve readable labels, units and status distinctions.
- Ensure drill-down targets are touch-friendly.
- Do not compress dense tables/charts into unreadable miniature elements.

### 8.3 Accessibility and appearance

- Keyboard navigation and visible focus.
- Accessible names and textual summaries for charts.
- Status must not be communicated by colour alone.
- Provide text/table alternatives for essential values.
- Respect supported light/dark appearance settings.
- Use clear date/time formatting and timezone context.

## 9. States and failure handling

The dashboard must distinguish:
- Initial loading.
- Individual widget loading.
- Partial success with one or more failed widgets.
- No frameworks in scope.
- No active framework.
- No work packages configured.
- No work assigned to the current user.
- No pending review.
- No validation findings.
- No data for selected period.
- Filter combination with zero results.
- Permission denied or scope unavailable.
- API timeout or temporary service failure.
- Stale cached data with last-updated timestamp.
- Aggregation still processing.
- Access revoked while dashboard is open.

A failed or unavailable widget must not display a misleading zero. Provide a localized error and retry path where appropriate. One failed widget must not block the entire dashboard.

## 10. Security, privacy and governance

- Enforce tenant isolation and resource authorization server-side for every metric and drill-down.
- Aggregates must not leak cross-tenant or unauthorized scope counts.
- Do not expose privileged backend credentials or service-role tokens to the client.
- Apply evidence, comments and activity visibility rules from the owning modules.
- Cache keys must account for tenant, permission scope, framework/version, filters and reporting context as applicable.
- Access revocation must prevent cached data from remaining available to unauthorized users.
- If dashboard layout customization is later enabled, audit administrative/shared configuration changes.
- Data exports, if added, require explicit authorization and audit controls.

## 11. Performance and scale

Phase 1 dashboard load must not depend on scanning a digital question inventory; no such inventory exists in this phase.

Requirements:
- Use bounded queries and pre-aggregated/read models where justified by measured workload.
- Paginate activity/event feeds.
- Avoid unbounded history retrieval on page load.
- Index filter dimensions based on actual query plans.
- Cache only with complete scope/version/filter context and a defined invalidation strategy.
- Display data freshness where asynchronous aggregation or caching is used.
- Define quantitative latency, concurrency and availability targets before production; this draft does not invent numeric SLAs.

The legacy one-million-question scale assumption belongs to future digital question inventory planning, not Phase 1 dashboard sizing.

## 12. Acceptance criteria

| ID | Acceptance criterion |
|---|---|
| M01-AC-001 | Dashboard shows only Phase 1 framework/offline-process data and approved metrics. |
| M01-AC-002 | Every widget and drill-down enforces tenant/resource permissions server-side. |
| M01-AC-003 | Role-specific users see only permitted widgets and records. |
| M01-AC-004 | Framework, revision and version counts are not conflated. |
| M01-AC-005 | Work-package counts are not labelled or presented as question inventory counts. |
| M01-AC-006 | Technical validation, operational checking, academic approval and activation remain distinct. |
| M01-AC-007 | Every metric has a documented formula, unit, scope and source. |
| M01-AC-008 | Widget drill-down preserves the summary's filter and count semantics. |
| M01-AC-009 | No-data, zero-result, loading, unavailable and error states are distinguishable. |
| M01-AC-010 | A failed widget does not render as zero or block unrelated widgets. |
| M01-AC-011 | Dashboard totals are not calculated by downloading all underlying records to the browser. |
| M01-AC-012 | Mobile layout remains usable without horizontal overflow. |
| M01-AC-013 | Activity feeds respect permissions and do not expose restricted notes/evidence. |
| M01-AC-014 | No Phase 1 dashboard feature calculates student performance, test results or DRE difficulty. |
| M01-AC-015 | No digital question inventory, upload, OCR or digital tagging metric is presented as current Phase 1 scope. |

## 13. Open decisions

| ID | Decision required | Owner | Status |
|---|---|---|---|
| DTE-M01-OD-001 | Which widgets are mandatory for each approved Phase 1 role? | Product Owner | Open |
| DTE-M01-OD-002 | Are offline work-package assignment and status tracking managed inside DTE? | Product + Operations | Open |
| DTE-M01-OD-003 | Are completed sheets submitted into DTE for validation/review? | Product + Operations | Open |
| DTE-M01-OD-004 | Which framework lifecycle states and review queue summaries must be visible? | Product + Academic Authority | Open |
| DTE-M01-OD-005 | Which current-phase operational metrics are required, and who owns definitions? | Product + Operations | Open |
| DTE-M01-OD-006 | What reporting periods and timezone rules are required? | Product Owner | Open |
| DTE-M01-OD-007 | What data refresh cadence/freshness guarantee is required? | Product + Architecture | Open |
| DTE-M01-OD-008 | Are user-customizable widget order, visibility or saved filters required? | Product Owner | Open |
| DTE-M01-OD-009 | Are review SLAs, due-date alerts or workload targets required? | Operations Owner | Open |
| DTE-M01-OD-010 | Which roles may view/export activity and historical metrics? | Product + Security | Open |
| DTE-M01-OD-011 | What performance and concurrency targets apply to Phase 1? | Architecture + QA | Open |

## 14. Implementation readiness constraints

Before implementation:
1. Confirm Phase 1 user roles and permissions.
2. Decide whether work-package assignment/status tracking is managed in DTE.
3. Decide whether completed offline sheets are submitted into DTE.
4. Select mandatory widgets by role.
5. Approve metric definitions, units, filters and time semantics.
6. Confirm authoritative source modules and read-model freshness strategy.
7. Approve access, activity visibility, caching and export controls.
8. Define measurable performance/accessibility targets.
9. Trace each approved widget and metric to UX, API/data source, authorization and executable tests.
10. Obtain explicit product, operations, academic, architecture, security and QA approval.

This draft authorizes no UI, API, read model, database schema, analytics job or production change.

## 15. Change history

| Version | Date | Status | Change |
|---|---|---|---|
| 0.1.0 | 2026-11-06 | Superseded Draft | Initial broad dashboard specification included digital question inventory, tagging queues, mapping coverage and future analytics |
| 0.2.0 | 2026-11-06 | Draft | Rewritten for Phase 1 framework/offline-process operations; removed digital question inventory/tagging and student/test/difficulty analytics; clarified source ownership and conditional workflows |

## 16. Approval

- Product owner: Pending
- Academic authority: Pending
- Operations owner: Pending
- Architecture: Pending
- Security: Pending
- QA: Pending
- Implementation authorization: Not granted
