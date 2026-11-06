# DTE-M01 — DTE Dashboard Specification

- Document ID: PULSE-DTE-M01
- Version: 0.1.0
- Status: Draft — Pending product review
- Parent register: docs/dte/DTE_MODULE_REGISTER.md (v0.1.0)
- Product: PULSE — Deep Tagging Engine
- Last updated: 2026-11-06

## Governing scope clarification — classification management software

DTE manages institution-defined academic classification and tagging structures. It does not design, prescribe, generate or impose chapter-wise syllabus bifurcation, curriculum structure or a universal academic hierarchy. Institutions define their own categories and terminology; DTE provides software to configure, record, map, search, validate, review, version, govern and report on those existing structures. Academic terms such as subject, chapter, topic and concept are examples of institution-managed data, not mandatory DTE levels or a curriculum-design function.

## 1. Purpose

The DTE Dashboard is the operational entry point for authorized DTE users. It presents a role-appropriate view of question inventory, tagging workload, review activity, classification coverage, quality exceptions and recent activity.

The dashboard is an operational overview and navigation surface. It is not the place where users perform detailed question tagging, configure classification schemas, or calculate question difficulty.

## 2. Scope

### In scope
- Summary of question inventory within the user's authorized tenant and scope.
- Tagging work queue and status distribution.
- Review and approval queue summaries.
- Classification completeness and coverage summaries.
- Validation and quality exception summaries.
- Workload and productivity indicators.
- Recent DTE activity and notifications.
- Filters and drill-down navigation to the owning DTE modules.
- Role- and permission-aware visibility.

### Out of scope
- Editing question classifications directly on dashboard cards.
- Creating or editing classification schemas.
- Performing review decisions directly from summary widgets unless a separately approved quick-action workflow is specified.
- Student-level performance or attendance analytics.
- Difficulty scoring or difficulty analytics owned by DRE.
- Test-series or content-production dashboards owned by other PULSE modules.

## 3. Users and access

The following are candidate role groupings. The final permission matrix is an open decision and must be specified in the DTE roles and permissions document.

| User category | Dashboard purpose | Expected access |
|---|---|---|
| Question Author / Tagger | See assigned tagging work, pending items, personal progress and validation feedback | Own/assigned work and permitted aggregate views |
| Academic Reviewer | See pending reviews, rejected items, review workload and quality patterns | Assigned review scope and permitted aggregates |
| Content Administrator | Monitor inventory, tagging coverage, backlog, imports and operational exceptions | Authorized tenant-wide content scope |
| System Administrator | Monitor configuration health, tenant-level operational state and system exceptions | Explicitly authorized administrative scope |
| Read-only stakeholder | Review approved coverage and high-level status | Read-only permitted aggregates |

No role may see another tenant's records or aggregate metrics unless an explicit cross-tenant permission is granted.

## 4. Dashboard information architecture

The dashboard is composed of configurable sections. Exact widget visibility may vary by role and permission.

### 4.1 Header and global context
- Page title: Deep Tagging Engine.
- Active tenant/institute context.
- Active classification schema and version, where applicable.
- Global date range or reporting period selector.
- Search/navigation entry point.
- Notifications and user menu.
- Clear indication of the data scope currently being viewed.

### 4.2 Inventory overview
Candidate metrics:
- Total questions in authorized scope.
- Questions eligible for tagging.
- Questions currently in progress.
- Questions submitted for review.
- Questions approved/published.
- Questions archived or inactive, where permitted.

Metric definitions must identify their denominator, inclusion rules, status semantics and effective timestamp. Do not mix logical question counts with question-version counts or placement/slot counts.

### 4.3 Tagging work queue
Candidate queue groups:
- Assigned to me.
- Unassigned / available to claim, if claiming is enabled.
- In progress.
- Returned for correction.
- Saved as draft.
- Blocked by validation or missing configuration.

Each queue count must drill down to the exact filtered inventory view. Queue ownership and assignment rules are governed by the workflow and permission specifications.

### 4.4 Review and approval overview
Candidate indicators:
- Awaiting review.
- Assigned to reviewer.
- Overdue, only if a review SLA is configured.
- Returned for changes.
- Approved but not yet published, if publication is a separate state.
- Recent review outcomes.

The dashboard must not imply that review approval and publication are the same state.

### 4.5 Classification coverage
Coverage summaries may be grouped by configured schema, classification group, subject/domain, source or other configured dimensions.

Every coverage widget must disclose:
- Numerator definition.
- Denominator definition.
- Applicable completeness profile and version.
- Excluded records and exclusion reason.
- Reporting timestamp.
- Whether the metric counts questions, question versions or another unit.

Completeness must be computed from the active configured profile, not a hardcoded number of taxonomy levels or tags.

### 4.6 Validation and quality
Candidate indicators:
- Blocking validation failures.
- Warnings requiring attention.
- Unresolved duplicate candidates.
- Invalid or inactive classification references.
- Conflicting mappings.
- Records requiring re-review after a configuration change.

Severity and remediation rules are owned by the Validation & Quality Engine specification. Dashboard widgets summarize those results; they do not redefine them.

### 4.7 Productivity and workload
Candidate indicators:
- Questions tagged during selected period.
- Questions submitted for review.
- Review throughput.
- Rework / returned-for-correction rate.
- Backlog by status and assignee.

Productivity metrics must not be used as a substitute for quality metrics. Comparisons between users require consistent scope, period, task complexity and counting rules. Avoid rankings or leaderboards unless explicitly approved.

### 4.8 Recent activity
Show a permission-filtered activity feed with:
- Question or mapping reference.
- Event type.
- Actor.
- Timestamp.
- Relevant version/schema reference.
- Link to the permitted detail view.

The feed must not expose sensitive question content or reviewer notes to users lacking access.

## 5. Filters and drill-down behaviour

Candidate filters:
- Tenant/institute (only where user has access to multiple scopes).
- Classification schema and schema version.
- Subject/domain or configured classification group.
- Question source or content collection.
- Work status.
- Review status.
- Publication status.
- Assignee/reviewer.
- Date range.

Rules:
1. Filters must be permission-scoped on the server, not merely hidden in the UI.
2. A dashboard card's drill-down must preserve the filter context that produced its count.
3. Changing filters must refresh all dependent metrics consistently.
4. The UI must show when a filter materially narrows the denominator.
5. Empty results must be distinguished from loading, unavailable and error states.
6. Dashboard metrics must not be calculated by downloading the entire question inventory to the browser.

## 6. Metric definitions — specification requirements

The dashboard must not ship with ambiguous labels such as “Tagged”, “Complete”, “Pending” or “Productivity” unless the exact calculation is documented.

For every metric, the implementation specification must include:
- Metric identifier and display label.
- Business definition.
- Formula / aggregation logic.
- Counting unit: logical question, question version, mapping revision, review task or event.
- Included and excluded statuses.
- Tenant and permission scope.
- Time-window semantics and timezone.
- Source tables/events or service contract.
- Refresh/caching expectation.
- Drill-down filter mapping.
- Acceptance tests.

No numerical target, SLA or default threshold is established by this draft.

## 7. Data dependencies

The dashboard consumes read models or APIs from:
- Question Inventory (question and version counts).
- Tagging workflow (assignment and work statuses).
- Review & Approval (review queue and outcomes).
- Validation & Quality Engine (errors, warnings and completeness).
- Configuration Version Manager (active schema/profile context).
- Audit/activity service (recent events).
- Coverage & Productivity Analytics (aggregated measures).

The dashboard must not become the authoritative owner of these records or duplicate their business rules.

## 8. UX requirements

### Desktop
- Clear hierarchy: operational summary first, queues and exceptions next, analytics and activity below.
- Cards and charts must link to actionable filtered views.
- Show metric definitions through contextual help or a details view.
- Support loading skeletons and partial widget failure without blocking the entire page.
- Avoid presenting all possible metrics to every role.

### Mobile / narrow screens
- Stack widgets in a single-column flow.
- Keep filters accessible without horizontal overflow.
- Preserve readable labels and units.
- Make cards and drill-down targets touch-friendly.
- Do not compress dense charts into unreadable miniature visuals.

### Accessibility
- Keyboard navigation and visible focus.
- Accessible names for charts and controls.
- Do not communicate status using colour alone.
- Provide tabular or textual alternatives for key chart values.
- Respect user-selected light/dark appearance where supported by the platform.

## 9. States and failure handling

The dashboard must define and test:
- Initial loading.
- Partial loading by widget.
- No inventory in scope.
- No work assigned.
- No pending reviews.
- No coverage data for the selected schema/profile.
- Filter combination with zero matching records.
- Permission denied / scope unavailable.
- API timeout or temporary service failure.
- Stale cached data, including last-updated timestamp.
- Background aggregation still processing.
- User loses access while dashboard is open.

A failed widget must show a localized error and retry path. It must not display a misleading zero.

## 10. Security and governance

- Enforce tenant isolation and role authorization server-side for every metric and drill-down.
- Aggregates must not leak cross-tenant counts or sensitive activity.
- Do not expose service-role credentials or privileged backend tokens to the client.
- Audit administrative changes to dashboard configuration, if user-configurable layouts are introduced.
- Apply the same content visibility and licensing restrictions as the underlying question records.
- Define whether cached aggregates are tenant-scoped and how access revocation invalidates or bypasses them.

## 11. Performance and scale

The inventory may reach approximately 1,000,000 questions. Therefore:
- Use pre-aggregated/read-model queries where needed.
- Avoid unbounded scans on every dashboard load.
- Index filter and join dimensions according to measured query plans.
- Paginate activity feeds.
- Cache only where tenant, permissions, schema version and filter context are safely represented in cache keys.
- Display data freshness metadata.
- Define measurable latency and concurrency targets during technical specification; this draft does not invent numeric SLAs.

## 12. Acceptance criteria

1. An authorized user sees only dashboard data within their permitted tenant and scope.
2. A user without permission cannot retrieve restricted metrics by changing request parameters.
3. Every displayed metric has a documented counting unit, numerator/denominator and status rules.
4. Coverage uses the selected completeness profile and its version.
5. Question, question-version and placement counts are never silently conflated.
6. Each actionable widget drills down to a view with matching filters and count semantics.
7. Review approval and publication are represented as distinct states when the workflow configures them separately.
8. A failed widget does not render as zero and provides a retry path.
9. Large inventories are summarized server-side; the browser does not load all questions to calculate totals.
10. Mobile layout remains usable without horizontal scrolling.
11. No DRE difficulty score or student performance metric is calculated by this dashboard.
12. Recent activity respects tenant, role and content permissions.

## 13. Dependencies and related specifications

- DTE Module Register.
- Question Inventory.
- Tagging workflow / Tagging Studio.
- Review & Approval.
- Validation & Quality Engine.
- Coverage & Productivity Analytics.
- Configuration Version Manager.
- DTE roles and permissions.
- Audit and event model.

## 14. Open decisions

| Decision ID | Question | Status |
|---|---|---|
| DTE-M01-OD-001 | Which dashboard widgets are mandatory for each role? | Open |
| DTE-M01-OD-002 | Can users customize widget order, visibility or saved filter sets? | Open |
| DTE-M01-OD-003 | What reporting periods and timezone rules are supported? | Open |
| DTE-M01-OD-004 | What are the authoritative definitions for inventory eligibility and each workflow count? | Open |
| DTE-M01-OD-005 | Which coverage dimensions are available by default, and which are schema-configurable? | Open |
| DTE-M01-OD-006 | What refresh cadence and freshness guarantees are required? | Open |
| DTE-M01-OD-007 | Are workload targets or review SLAs required, and who configures them? | Open |
| DTE-M01-OD-008 | Which roles may see individual productivity measures versus aggregate measures? | Open |

## 15. Change history

| Version | Date | Status | Change |
|---|---|---|---|
| 0.1.0 | 2026-11-06 | Draft | Initial dashboard scope, information architecture, metric governance, UX, security and acceptance criteria |

## 16. Approval

- Product owner approval: Pending
- Technical review: Pending
- Implementation authorization: Not granted
