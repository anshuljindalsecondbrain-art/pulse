# DTE-M14 — Coverage & Productivity Analytics Specification

- Document ID: PULSE-DTE-M14
- Version: 0.1.0
- Status: Draft — Pending product review
- Parent: docs/dte/DTE_MODULE_REGISTER.md
- Last updated: 2026-11-06

## 1. Purpose

Coverage & Productivity Analytics provides transparent measures of classification coverage, workflow throughput, review outcomes and quality trends. It supports operational planning and identifies gaps without conflating activity volume with tagging quality.

## 2. Scope

In scope:
- Coverage by tenant, schema/version, classification group, source and configured dimensions.
- Completeness-profile reporting.
- Work backlog and throughput.
- Review outcomes and rework.
- Trend analysis over selected time windows.
- Drill-down to authorized question records.
- Export of permitted aggregate reports.
- Metric definitions and denominator governance.

Out of scope:
- Student performance or attendance analytics.
- Difficulty distribution or DRE calculations.
- Test result analytics.
- Defining completeness rules (M13).
- Assigning work or approving mappings.

## 3. Measurement principles

Every metric must document:
- Stable metric ID and label.
- Business definition and formula.
- Counting unit (logical question, question version, mapping revision, review task or event).
- Numerator and denominator.
- Inclusion/exclusion rules.
- Tenant and permission scope.
- Schema and completeness profile versions.
- Time-window and timezone semantics.
- Source data and refresh cadence.
- Drill-down behaviour.

Never compare counts using different units or denominators without explicit disclosure. A question count must not be mixed with a version count or placement count.

## 4. Coverage metrics

Candidate measures:
- Eligible question inventory.
- Questions with at least one valid mapping under a specified schema.
- Questions complete under a specified completeness profile.
- Incomplete records by missing requirement.
- Coverage by classification group/node.
- Coverage by source or content collection.
- Coverage by question type or configured metadata.
- Verified PYQ provenance coverage, where relevant.

Coverage denominator must be explicit. Exclusions such as archived, restricted, ineligible or superseded records must be visible in metric definitions.

A “fully tagged” metric is invalid unless it identifies the exact profile and version used.

## 5. Productivity and workflow metrics

Candidate measures:
- Tagging work started/completed during period.
- Mapping submissions.
- Review throughput.
- Approval and return rates.
- Rework cycles.
- Backlog age.
- Queue size by workflow state.
- Bulk job throughput and failure rate.

Productivity metrics are not quality scores. Individual performance reporting requires role-based visibility and context such as assignment scope, complexity and review load.

## 6. Quality trend measures

Potential measures:
- Blocking validation findings per eligible record.
- Warning prevalence.
- Invalid relationship rate.
- Duplicate mapping rate.
- Review return/rejection rate.
- Provenance verification rate.
- Stale validation result count.

All measures must link to the authoritative rule/profile version. Composite scores are not permitted without an explicit documented model and approval.

## 7. Filters and drill-down

Potential dimensions:
- Tenant/institute.
- Schema and schema version.
- Completeness profile/version.
- Classification group/node.
- Question source/content collection.
- Question type and pedagogical metadata.
- Workflow/review/publication status.
- Assignee/reviewer.
- Time period.

Drill-downs must preserve the metric's exact denominator and filter context. Users must not be able to infer restricted records from counts or small groups.

## 8. UX and reporting

- Show metric definition and counting unit.
- Display last refreshed timestamp and data freshness.
- Distinguish no data from zero.
- Provide tables alongside charts for exact values.
- Support comparison only when metric definitions and scope are compatible.
- Export only authorized data and log export activity.
- Avoid leaderboards unless specifically approved.
- Provide accessible text alternatives for charts.

## 9. Data quality and reconciliation

- Reconcile aggregates against source records.
- Identify late-arriving events and backfilled history.
- Define whether metrics are event-time or processing-time based.
- Version metric definitions.
- Explain changes in denominator after schema/profile updates.
- Do not rewrite historical metrics without a documented restatement policy.

## 10. Security and performance

- Tenant-scoped aggregation and authorization.
- Prevent small-cell or cross-tenant inference.
- Use pre-aggregations where needed.
- Do not scan the full question inventory on each dashboard request.
- Paginate detailed records and large exports.
- Cache with tenant, scope, schema, profile and permission context.

## 11. Acceptance criteria

1. Every metric has a stable definition, unit and denominator.
2. Coverage always identifies schema and completeness profile versions.
3. Productivity and quality are presented separately.
4. Logical question, version, mapping and review counts are never conflated.
5. Drill-down results reconcile to the metric definition.
6. Restricted records cannot be inferred from aggregates.
7. Refresh time and stale-data state are visible.
8. Historical metric restatements are governed.
9. Individual productivity is permission-controlled and contextualized.
10. No student or difficulty analytics are introduced.

## 12. Dependencies

- M01 Dashboard.
- M02 Question Inventory.
- M10 Review & Approval.
- M11 Version & History Manager.
- M12 Bulk Tagging Manager.
- M13 Validation & Quality Engine.
- Audit/event and analytics infrastructure.

## 13. Open decisions

| ID | Question | Status |
|---|---|---|
| DTE-M14-OD-001 | Which coverage metrics are mandatory for the initial release? | Open |
| DTE-M14-OD-002 | What are the standard reporting windows and timezone rules? | Open |
| DTE-M14-OD-003 | Which individual productivity metrics may be visible to managers? | Open |
| DTE-M14-OD-004 | What aggregation refresh cadence is required? | Open |
| DTE-M14-OD-005 | What small-cell suppression or aggregate privacy rules apply? | Open |
| DTE-M14-OD-006 | How are historical metrics restated after profile/schema changes? | Open |

## 14. Change history

| Version | Date | Status | Change |
|---|---|---|---|
| 0.1.0 | 2026-11-06 | Draft | Initial coverage and productivity analytics specification |

## 15. Approval

- Product owner: Pending
- Technical review: Pending
- Implementation authorization: Not granted