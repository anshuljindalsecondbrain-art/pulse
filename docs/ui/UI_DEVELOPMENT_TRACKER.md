# PULSE — Master UI Development Tracker

**Status:** Initial baseline · Draft for product/design review  
**Branch:** `feat/system-a-abhyas-foundation`  
**Last reconciled:** 7 November 2026  
**Purpose:** One traceable register for page-level specification, design, implementation and acceptance.  
**Important:** A specification being complete does not mean the screen is designed, coded, integrated or verified. A screen may ultimately be a route, tab, drawer or panel; the inventory is functional, not a route-count commitment.

## 1. Status definitions

| Status | Meaning |
|---|---|
| Not specified | No adequate page-level functional specification identified |
| Proposed | Concept or structured plan exists; approval not established |
| Specified | Functional requirements are documented |
| Decision pending | Specification exists but named product/governance decisions remain open |
| Design in progress | Figma work has started; not yet accepted |
| Design verified | Figma design reviewed against requirements and accepted |
| Implemented — prototype | Frontend code exists, but production integration/acceptance is not implied |
| Implemented — production candidate | Production-oriented implementation exists; acceptance gates remain |
| Verified | Design, implementation, integration and QA evidence are linked and accepted |
| Placeholder | Navigation or placeholder UI exists without the complete workflow |
| Not verified | No reliable evidence in the reviewed repository/source material |

## 2. System A — Student Tracking / Abhyas Matrix

The first nine rows below are UI areas identified in the repository audit. The remaining rows are navigation placeholders recorded in that audit. “Implemented — prototype” does not mean production-ready.

| ID | Page / UI area | Functional specification | Figma design | Frontend | Backend / data | Next gate |
|---|---|---|---|---|---|---|
| UI-STA-001 | PULSE Workspace Shell | Specified | Partial foundations only | Implemented — prototype | Demo data | Finalize shared shell and role navigation |
| UI-STA-002 | Abhyas Matrix | Specified | Not verified | Implemented — prototype | LocalStorage | Replace demo state with secure persisted workflow |
| UI-STA-003 | Exercise Overview | Specified | Not verified | Implemented — prototype | Local calculations | Connect to assignment/evidence lifecycle |
| UI-STA-004 | Quick Exercise Creator | Specified | Not verified | Implemented — prototype | Local only | Align with approved exercise/assignment contracts |
| UI-STA-005 | Assign Module | Specified | Not verified | Implemented — prototype | Local only | Implement publication and obligation generation |
| UI-STA-006 | Student Roster / Manage Students | Specified | Not verified | Implemented — prototype | Demo roster/local only | Integrate canonical identity and enrollment |
| UI-STA-007 | Matrix Filters / Search | Specified | Not verified | Implemented — prototype | Local data | Connect to scoped server-side queries |
| UI-STA-008 | Matrix Export | Specified | Not verified | Implemented — prototype | Browser-side CSV | Add permission checks and export audit |
| UI-STA-009 | Question-level Statistics | Specified | Not verified | Implemented — prototype | Demo calculations | Replace with governed evidence projections |
| UI-STA-010 | Dashboard Overview | Specified at concept level | Not verified | Placeholder | Not verified | Define KPI contracts and role-specific view |
| UI-STA-011 | Exercises & DPPs | Specified at concept level | Not verified | Placeholder | Not integrated | Build exercise library and assignment lifecycle |
| UI-STA-012 | Doubt Radar | Domain logic documented; screen incomplete | Not verified | Placeholder | Not integrated | Design operational student/cohort worklists |
| UI-STA-013 | Academic Review | Domain logic documented; screen incomplete | Not verified | Placeholder | Not integrated | Build reviewer queue and decision UI |
| UI-STA-014 | Attendance | Navigation-level scope | Not verified | Placeholder | Not implemented/verified | Define attendance capture and policy |
| UI-STA-015 | Insights | Concept-level scope | Not verified | Placeholder | Not integrated | Define trusted metrics and analytics projections |

## 3. System B — Deep Tagging Engine / Configurable Tagging System

**Source baseline:** System B Part 2.7 screen register. All 49 screens have functional specifications recorded in the source. This is not evidence of 49 Figma designs or frontend implementations. Decision status is tracked separately.

| ID | Screen | Workspace | Functional spec | Product decisions | Figma | Frontend |
|---|---|---|---|---|---|---|
| UI-DTE-001 | Structure Library | Academic Structure Management | Specified | Complete | Not verified | Not verified |
| UI-DTE-002 | Create Structure | Academic Structure Management | Specified | Complete | Not verified | Not verified |
| UI-DTE-003 | Structure Builder | Academic Structure Management | Specified | Complete | Not verified | Not verified |
| UI-DTE-004 | Hierarchy & Tag Manager | Academic Structure Management | Specified | Complete | Not verified | Not verified |
| UI-DTE-005 | Level Configuration | Academic Structure Management | Specified | Complete | Not verified | Not verified |
| UI-DTE-006 | Structure Preview | Academic Structure Management | Specified | Complete | Not verified | Not verified |
| UI-DTE-007 | Version History | Academic Structure Management | Specified | Complete | Not verified | Not verified |
| UI-DTE-008 | Structure Comparison | Academic Structure Management | Specified | Complete | Not verified | Not verified |
| UI-DTE-009 | Import, Export & Clone | Academic Structure Management | Specified | Complete | Not verified | Not verified |
| UI-DTE-010 | Context Registry | Academic Context Management | Specified | Complete | Not verified | Not verified |
| UI-DTE-011 | Context Detail | Academic Context Management | Specified | Complete | Not verified | Not verified |
| UI-DTE-012 | Structure Assignment | Academic Context Management | Specified | Complete | Not verified | Not verified |
| UI-DTE-013 | Context Configuration | Academic Context Management | Specified | Complete | Not verified | Not verified |
| UI-DTE-014 | Teaching Structure Manager | Teaching Structure & Coverage | Specified | Complete | Not verified | Not verified |
| UI-DTE-015 | Teaching Sequence Builder | Teaching Structure & Coverage | Specified | Complete | Not verified | Not verified |
| UI-DTE-016 | Teaching Structure Assignment | Teaching Structure & Coverage | Specified | Complete | Not verified | Not verified |
| UI-DTE-017 | Teaching-to-Question Mapping | Teaching Structure & Coverage | Specified | Complete | Not verified | Not verified |
| UI-DTE-018 | Teaching Coverage & Operational Dashboard | Teaching Structure & Coverage | Specified | Complete | Not verified | Not verified |
| UI-DTE-019 | Tagging Workspace | Question Tagging Studio | Specified | Complete | Not verified | Not verified |
| UI-DTE-020 | Question Navigator | Question Tagging Studio | Specified | Complete | Not verified | Not verified |
| UI-DTE-021 | Question Detail | Question Tagging Studio | Specified | Complete | Not verified | Not verified |
| UI-DTE-022 | Contextual Tagging Panel | Question Tagging Studio | Specified | Complete | Not verified | Not verified |
| UI-DTE-023 | Contextual Difficulty Panel | Question Tagging Studio | Specified | Complete | Not verified | Not verified |
| UI-DTE-024 | Teaching Mapping Panel | Question Tagging Studio | Specified | Complete | Not verified | Not verified |
| UI-DTE-025 | Bulk Tagging Workspace | Question Tagging Studio | Specified | Complete | Not verified | Not verified |
| UI-DTE-026 | Tagging Review Workspace | Question Tagging Studio | Specified | Complete | Not verified | Not verified |
| UI-DTE-027 | Tagging History | Question Tagging Studio | Specified | Complete | Not verified | Not verified |
| UI-DTE-028 | Tagging Coverage Dashboard | Tagging Analytics & Governance | Specified | Complete | Not verified | Not verified |
| UI-DTE-029 | Tagging Analytics & Diagnostic Reports | Tagging Analytics & Governance | Specified | **5 decisions pending** | Not verified | Not verified |
| UI-DTE-030 | Analytics Report Builder & Scheduling | Tagging Analytics & Governance | Specified | Complete | Not verified | Not verified |
| UI-DTE-031 | Report Library & Execution Centre | Tagging Analytics & Governance | Specified | Complete | Not verified | Not verified |
| UI-DTE-032 | Analytics Governance, Metric Definitions & Data Quality | Tagging Analytics & Governance | Specified | Complete | Not verified | Not verified |
| UI-DTE-033 | Analytics Access Governance & Data Privacy | Tagging Analytics & Governance | Specified | Complete | Not verified | Not verified |
| UI-DTE-034 | Automation Alerts & Scheduled Monitoring | Automation Ecosystem | Specified | Complete | Not verified | Not verified |
| UI-DTE-035 | Automation Workflow Builder & Action Orchestration | Automation Ecosystem | Specified | **1 decision pending** | Not verified | Not verified |
| UI-DTE-036 | Integration Registry & Connector Governance | Automation Ecosystem | Specified | Complete | Not verified | Not verified |
| UI-DTE-037 | Automation Execution Centre | Automation Ecosystem | Specified | Complete | Not verified | Not verified |
| UI-DTE-038 | Automation Governance & Operational Policies | Automation Ecosystem | Specified | Complete | Not verified | Not verified |
| UI-DTE-039 | Automation Analytics, Performance & ROI | Automation Ecosystem | Specified | Complete | Not verified | Not verified |
| UI-DTE-040 | Automation Intelligence & Continuous Improvement | Automation Ecosystem | Specified | Complete | Not verified | Not verified |
| UI-DTE-041 | Automation Lifecycle Management | Automation Ecosystem | Specified | Complete | Not verified | Not verified |
| UI-DTE-042 | Automation Asset Catalogue | Automation Ecosystem | Specified | Complete | Not verified | Not verified |
| UI-DTE-043 | Automation Marketplace | Automation Ecosystem | Specified | Complete | Not verified | Not verified |
| UI-DTE-044 | Developer Ecosystem, SDK, API & Extension Governance | Automation Ecosystem | Specified | Complete | Not verified | Not verified |
| UI-DTE-045 | Automation Ecosystem Governance | Automation Ecosystem | Specified | **1 decision pending** | Not verified | Not verified |
| UI-DTE-046 | Platform Administration | Platform Operations & Observability | Specified | Complete | Not verified | Not verified |
| UI-DTE-047 | Observability & Incident Response | Platform Operations & Observability | Specified | **10 decisions pending** | Not verified | Not verified |
| UI-DTE-048 | Platform Security Operations, Threat Detection, Vulnerability Management & Security Incident Management | Security, Privacy & Compliance | Specified | Complete | Not verified | Not verified |
| UI-DTE-049 | Compliance, Privacy & Audit | Security, Privacy & Compliance | Specified | **12 decisions pending** | Not verified | Not verified |

**DTE decision-register reconciliation required:** the source's summary reports 30 pending decisions, while the five screen-level counts above total 29 (5 + 1 + 1 + 10 + 12). Do not treat the total as resolved until the source register is reconciled.

## 4. Student Risk Intelligence — proposed future workspace

These 14 pages come from the repository's proposed Student Risk Intelligence UI plan. They are not approved or implemented production screens.

| ID | Page | Specification | Figma | Frontend |
|---|---|---|---|---|
| UI-RSK-001 | Risk Overview | Proposed | Not started | Not started |
| UI-RSK-002 | Student Risk Explorer | Proposed | Not started | Not started |
| UI-RSK-003 | Risk Alerts & Early Warning | Proposed | Not started | Not started |
| UI-RSK-004 | Student Risk Profile | Proposed | Not started | Not started |
| UI-RSK-005 | Academic Performance Analysis | Proposed | Not started | Not started |
| UI-RSK-006 | Learning Behaviour & Consistency | Proposed | Not started | Not started |
| UI-RSK-007 | Chapter & Concept Weakness | Proposed | Not started | Not started |
| UI-RSK-008 | Intervention Worklist | Proposed | Not started | Not started |
| UI-RSK-009 | Intervention Detail | Proposed | Not started | Not started |
| UI-RSK-010 | Intervention Planner | Proposed | Not started | Not started |
| UI-RSK-011 | Follow-up & Outcome Analysis | Proposed | Not started | Not started |
| UI-RSK-012 | Batch Intelligence | Proposed | Not started | Not started |
| UI-RSK-013 | Risk Rules & Model Configuration | Proposed | Not started | Not started |
| UI-RSK-014 | Risk Audit & History | Proposed | Not started | Not started |

## 5. Shared UI foundation — cross-cutting capabilities

These are shared capabilities, not extra page-count entries.

| ID | Capability | Current status | Evidence required to close |
|---|---|---|---|
| UI-SYS-001 | Application shell and navigation | Prototype implemented | Approved navigation and role-aware states |
| UI-SYS-002 | Design tokens: colour, type, spacing, grid | Partial foundation | Published token library and usage examples |
| UI-SYS-003 | Reusable component library | Partial / not verified | Component inventory, variants and states |
| UI-SYS-004 | Light theme | Foundation exists | Visual and accessibility QA |
| UI-SYS-005 | Dark theme | Not verified | Complete token and component coverage |
| UI-SYS-006 | Authentication screens and flows | Foundation only | Production identity flow and error states |
| UI-SYS-007 | Role- and scope-aware navigation | Not verified | Permission matrix mapped to navigation |
| UI-SYS-008 | Notifications centre | Not verified | Notification types, permissions and lifecycle |
| UI-SYS-009 | Global search | Not verified | Search scope, indexing and access filtering |
| UI-SYS-010 | Responsive layout system | Not verified | Desktop/tablet/mobile acceptance |
| UI-SYS-011 | Accessibility patterns | Not verified | Keyboard, focus, contrast and screen-reader QA |
| UI-SYS-012 | Loading, empty, error and denied states | Not verified | Shared state patterns and page-level coverage |

## 6. Consolidated inventory totals

| Inventory | Entries | Specification state | Visual / implementation state |
|---|---:|---|---|
| System A | 15 | Mixed: specified / concept-level | 9 prototype areas; 6 placeholders |
| System B | 49 | 49 specified | Visual design and implementation not verified |
| Student Risk Intelligence | 14 | Proposed | Not started |
| **Total page/UI inventory entries** | **78** | Mixed maturity | Not a count of independent routes |
| Shared UI foundation | 12 capabilities | Mixed | Not counted as pages |

The PULSE shell is included in System A row UI-STA-001 and is not counted again. Shared foundation capabilities are excluded from the 78 page/UI entries.

## 7. UI completion gates

A page may advance only when evidence is linked. Do not infer a later status from an earlier one.

| Gate | Required evidence |
|---|---|
| G0 — Scope | Purpose, user roles, workflow boundary and dependencies |
| G1 — Functional specification | Fields, actions, validation, permissions, navigation and states |
| G2 — Product approval | Explicit approval of open product decisions |
| G3 — Figma design | Desktop/tablet/mobile frames and component references |
| G4 — Design QA | Usability, consistency, accessibility and responsive review |
| G5 — Frontend implementation | Code path, PR and automated test references |
| G6 — Backend integration | Approved API, authorization and persistence evidence |
| G7 — Acceptance QA | End-to-end scenarios, negative tests and defect closure |
| G8 — Release acceptance | Product, engineering and security sign-off |

## 8. Immediate priority queue

| Priority | Work item | Why it is next | Completion condition |
|---|---|---|---|
| P0 | Reconcile System B 29-vs-30 pending-decision discrepancy | Prevents inaccurate governance baseline | One authoritative decision count |
| P0 | Confirm canonical page inventory and route-vs-panel mapping | Avoids building 78 independent routes | Approved navigation map |
| P1 | Complete shared design system and component library | Reduces repeated UI work | Approved tokens and reusable components |
| P1 | Design System A's complete vertical workflow | Highest operational value | Exercise → publish → student evidence → review → progress |
| P2 | Design DTE foundational workflow | Enables configurable manual tagging | Structure → context → question tagging → review |
| P3 | Close DTE open decisions | Required before freezing affected specifications | Screens 29, 35, 45, 47 and 49 resolved |
| P4 | Design Student Risk Intelligence | Depends on trusted System A evidence | Risk model and intervention workflows approved |

## 9. Governance and update rules

1. This tracker is the status register, not a replacement for canonical functional specifications.
2. Figma is the source of truth for visual composition; this tracker records links and status.
3. `apps/` is the source of truth for frontend implementation.
4. API and database contracts remain in their canonical architecture documents.
5. Every status change must include a date, evidence link and reviewer/owner.
6. Use synthetic student data in Figma, screenshots and tests.
7. Do not mark a screen **Verified** without design, implementation, integration and QA evidence.
8. Do not treat this tracker as authorization to deploy, migrate production data or release features.

## 10. Evidence sources used for this baseline

- `docs/ui/README.md` — UI documentation governance and lifecycle.
- `docs/audits/2026-11-06-pulse-360-audit/08_FRONTEND_AND_UX_AUDIT.md` — frontend and UX audit.
- `docs/audits/2026-11-06-pulse-360-audit/10_SYSTEM_A_STUDENT_TRACKING_AUDIT.md` — System A page status.
- `docs/product-design/student-risk-intelligence-ui-plan.md` — proposed 14-page risk intelligence plan.
- Uploaded `SYSTEM B _ PART 2.pdf`, Part 2.7 screen register — DTE screens 1–49 and pending decision counts.

**Baseline limitation:** this tracker reconciles documented requirements and previously inspected repository evidence. It does not claim a fresh frame-by-frame Figma audit, browser QA, current CI pass, or production deployment verification.
