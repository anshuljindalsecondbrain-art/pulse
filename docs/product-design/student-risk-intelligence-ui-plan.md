# PULSE — Student Risk Intelligence UI Plan

**Status:** Proposed product/UI specification  
**Date:** 2026-11-07  
**Scope:** Future PULSE Student Intelligence workspace; not part of the initial System A release.  
**Relationship:** Consumes System A academic evidence through defined interfaces. It must not mutate source evidence, verification decisions, or assignment history.

## Product boundary

- **System A / Abhyas Matrix:** records assignments, student work, evidence, verification, corrections, doubts, and basic academic progress.
- **Student Intelligence:** interprets authorized records, identifies explainable patterns, recommends interventions, and measures outcomes.
- Risk scores are advisory signals, not diagnoses or final academic decisions. Authorized humans retain decision authority.

## Information architecture

### Overview
1. Risk Overview
2. Student Risk Explorer
3. Risk Alerts & Early Warning

### Student Intelligence
4. Student Risk Profile
5. Academic Performance Analysis
6. Learning Behaviour & Consistency
7. Chapter & Concept Weakness

### Intervention Management
8. Intervention Worklist
9. Intervention Detail
10. Intervention Planner
11. Follow-up & Outcome Analysis

### Intelligence & Governance
12. Batch Intelligence
13. Risk Rules & Model Configuration
14. Risk Audit & History

## Page specifications

### 01 — Risk Overview
**Purpose:** Institute-wide view of students needing attention.

Components:
- Context filters: institute, centre, batch, class, stream, subject, date range.
- KPIs: active students, under observation, intervention required, critical concerns, open interventions, overdue follow-ups.
- Risk distribution and 7/30/90-day trend.
- Priority student list and intervention status distribution.
- Recent risk events.

Interactions:
- KPI click opens Explorer with equivalent filters.
- Primary CTA: View students requiring attention.

### 02 — Student Risk Explorer
**Purpose:** Search and filter students across authorized academic groups.

Filters:
- Institute/centre/batch, class, stream, subject, chapter, risk level/dimension, assigned teacher, assessment date.
Table:
- Student, batch, academic risk, engagement, attendance, current status, last updated.
Actions:
- Open profile, compare, assign mentor, create intervention, export authorized report.
- Do not rank only by composite score; dimension filters and explanations are mandatory.

### 03 — Risk Alerts & Early Warning
Tabs: New, Escalated, Resolved.
Alert card fields:
- Student/batch, signal, date and observation window.
- Previous/current values, evidence source, data completeness.
- Suggested action and review owner.
Actions: Review, acknowledge, dismiss with reason, assign follow-up.
Requirements: deduplication, escalation controls, suppression rules, and clear distinction between missing evidence and negative performance.

### 04 — Student Risk Profile
Header:
- Student identity, ID, class, batch, subjects, assigned teachers, risk classification, timestamp.
Sections:
- Risk summary.
- Academic history.
- Work completion.
- Learning signals.
- Intervention history.
Side panel:
- Current concerns, assigned mentor, next follow-up, recommended actions.
Must distinguish student-reported evidence from teacher-verified outcomes.

### 05 — Academic Performance Analysis
Components:
- Subject performance cards.
- Test-wise marks and accuracy trends.
- Chapter heatmap.
- Correct/incorrect/partially-correct/skipped distribution.
- Attempt rate versus correctness.
- Revision/retest performance.
- Comparison against the student's own historical baseline.
Drill-down: subject → chapter → question-level evidence and test history.

### 06 — Learning Behaviour & Consistency
Components:
- Assignment completion calendar.
- Submission regularity, attempt consistency, revision frequency.
- Doubt-resolution time and correction frequency.
- Assessment participation and performance change.
Guardrail: missing digital activity is “unobserved/missing evidence,” not proof of low effort or disengagement.

### 07 — Chapter & Concept Weakness
Components:
- Subject selector and chapter tree.
- Topic/concept list only when source metadata exists.
- Performance heatmap, question-level error distribution, revision history.
- Related assignment/test evidence.
QBMS/DTE may enrich concept relationships later; this page must work with System A academic metadata alone.

### 08 — Intervention Worklist
Views: My interventions, All, Unassigned, Due today, Overdue, Completed.
Columns:
- Student, concern, intervention, owner, created, due, status.
Actions:
- Assign/reassign, prioritize, open detail, close with outcome.

### 09 — Intervention Detail
Components:
- Student and risk context.
- Original alert and evidence references.
- Objective, owner, activity timeline, notes, student response.
- Follow-up records, outcome assessment, closure.
Lifecycle:
Recommended → Reviewed → Assigned → In Progress → Follow-up → Evaluated → Closed.
Closed interventions retain complete history.

### 10 — Intervention Planner
Layout:
- Left: identified student concern and evidence.
- Centre: intervention builder.
- Right: expected outcome and schedule.
Templates:
- Concept revision, practice worksheet, additional DPP, diagnostic test, doubt-clearing session, one-to-one mentoring, revision schedule, authorized parent meeting.
Required fields:
- Objective, subject/chapter, owner, start/due dates, expected evidence of improvement, follow-up date.

### 11 — Follow-up & Outcome Analysis
Components:
- Before-intervention baseline.
- Intervention activity completed.
- Follow-up assessment results.
- Changes in accuracy, marks, completion, unresolved doubts.
- Teacher assessment and outcome classification.
Outcomes: Improved, Partially improved, No significant change, Deteriorated, Insufficient evidence.
Intervention completion and learner improvement are separate facts.

### 12 — Batch Intelligence
Components:
- Batch risk distribution.
- Subject and chapter performance.
- Students requiring attention.
- Teacher workload.
- Pending doubts/corrections.
- Assessment comparison and trends.
Drill-down: batch → subject → chapter → student → question evidence.

### 13 — Risk Rules & Model Configuration
Sections:
- Risk dimensions and signal definitions.
- Thresholds, observation windows, minimum sample sizes.
- Missing-data handling, alert frequency/deduplication, escalation.
- Model weights and policy history.
Requirements:
- Versioned policies.
- Authorized publishing only.
- Every score/alert records the policy version used.
- Config changes are audited.

### 14 — Risk Audit & History
Components:
- Risk score history and evidence references.
- Alert create/dismiss/escalate events.
- Model/policy version.
- Teacher overrides and reasons.
- Intervention assignment changes, outcomes, closure.
- Access and export history.
Purpose: explainability, accountability, and review.

## Shared application shell

- Role-aware navigation and server-enforced permissions.
- Institute/centre/batch context selector.
- Date range, universal student search, notification centre.
- Breadcrumbs, filter chips, authorized export.
- Light/dark themes and responsive layouts.
- Desktop sidebar; tablet/mobile collapsible navigation.

## Role access — proposed baseline

- Institute/Academic Administrator: authorized institute scope and configuration.
- Teacher: assigned students, batches, and interventions.
- Mentor: assigned learners and intervention scope.
- Student: own approved progress and own assigned actions only.
- Parent: authorized read-only progress summary only.
- Risk rules and audit administration: restricted to authorized administrators.
All access must be enforced by backend authorization and tenant/resource scope, not UI visibility alone.

## Design system and Figma organization

Keep the existing three-page Figma organization where possible:
1. Overview & Information Architecture
2. Design System
3. Product Screens

Organize the 14 screens as sections within Product Screens rather than one Figma page per screen. Reuse shared tokens, components, grids, table patterns, filters, cards, charts, drawers, and interaction states.

## Delivery order

### P0 — Core connected prototype
- 01 Risk Overview
- 02 Student Risk Explorer
- 04 Student Risk Profile
- 08 Intervention Worklist

Prototype journey:
Risk Overview → select student → inspect evidence → create intervention → assign teacher.

### P1 — Operational workflow
- 03 Alerts
- 09 Intervention Detail
- 10 Intervention Planner
- 11 Follow-up & Outcome Analysis

### P2 — Intelligence
- 05 Academic Performance
- 06 Learning Consistency
- 07 Chapter/Concept Weakness
- 12 Batch Intelligence

### P3 — Governance
- 13 Risk Rules & Model Configuration
- 14 Risk Audit & History

## UX, data and safety acceptance criteria

1. Every risk indication shows evidence, observation window, timestamp, data completeness and policy version.
2. Missing data is not interpreted as poor performance.
3. Composite scores never hide dimension-level signals.
4. A single poor assessment does not automatically imply persistent risk.
5. Risk and intervention state changes do not mutate original academic evidence or verification.
6. Teacher overrides require a reason and are retained in audit history.
7. Students and parents see only their authorized, appropriately framed information.
8. Responsive, keyboard, accessibility, loading, empty, error, and stale-data states are designed.
9. No AI-only decision that materially affects a student's academic standing.
10. Prototype/sample data is visibly marked and never mixed with real student records.

## Open decisions before implementation

- Final risk levels and thresholds.
- Observation windows and minimum sample sizes per signal.
- Validated scoring weights and calibration dataset.
- Who can configure/publish risk policies.
- Parent/student disclosure policy and notification rules.
- Intervention template catalogue and closure authority.
- Data retention, consent, and escalation policy.
- Whether and when AI-generated recommendations are enabled.

**Implementation note:** This is a product/UI plan only. It does not authorize database migrations, production risk scoring, real student data processing, deployment, or merging PR #2.
