# PULSE UI Workspace

**Purpose:** Central home for product UI/UX specifications, screen inventories, design-system documentation, interaction contracts, and design QA.

This directory is the repository's **dedicated UI documentation area**. It complements, but does not replace, application source code and the Figma design workspace.

## What belongs here

- Product workspace and navigation maps.
- Page-by-page UI specifications.
- Wireframe descriptions and screen states.
- Component and design-token references.
- Interaction, responsive, accessibility, and UX acceptance criteria.
- Design-to-development handoff notes and UI review records.

## What does not belong here

- React components or production application implementation: keep those in `apps/`.
- Database schema and API contracts: keep those in their canonical architecture locations under `docs/`.
- Superseded or unverified screenshots presented as current UI.
- Secrets, private student data, or identifiable learner screenshots.

## Structure

```text
docs/ui/
├── README.md
├── design-system/
│   └── README.md
├── product-workspaces/
│   └── README.md
├── screen-specifications/
│   ├── README.md
│   └── student-risk-intelligence/
│       └── README.md
├── components/
│   └── README.md
├── interaction-patterns/
│   └── README.md
├── responsive-accessibility/
│   └── README.md
├── design-qa/
│   └── README.md
└── handoff/
    └── README.md
```

Folders are introduced with index files only when a corresponding UI artifact is approved or ready to be documented. Avoid empty placeholder folders.

## Current UI documents

- [Student Risk Intelligence — 14-page UI plan](../product-design/student-risk-intelligence-ui-plan.md)
- [Frontend and UX audit](../audits/2026-11-06-pulse-360-audit/08_FRONTEND_AND_UX_AUDIT.md)

The Student Risk Intelligence plan is currently a proposed future workspace, not an implemented application.

## UI artifact lifecycle

Every specification must carry one status:

- **Exploration:** idea or design exploration; not approved.
- **Proposed:** structured proposal awaiting product approval.
- **Approved:** accepted design baseline; implementation may be planned.
- **In implementation:** application work is underway.
- **Implemented:** code exists; acceptance evidence still needs to be linked.
- **Verified:** design and implementation have passed documented QA.
- **Superseded:** replaced by a newer version; retain history and link forward.

Do not mark a screen as implemented or verified merely because a Figma frame or written specification exists.

## Rules for updates

1. Inspect the existing Figma file, application and documentation before changing a screen.
2. Prefer updating the canonical specification over creating duplicate copies.
3. Use stable page IDs and consistent page names across Figma, docs, issues and implementation.
4. Record design decisions, alternatives rejected, and unresolved questions.
5. Keep source-of-truth status explicit: Figma for visual composition; this directory for durable UI requirements and handoff; `apps/` for implemented UI code.
6. Keep UI specifications aligned with approved permissions and backend contracts.
7. Include desktop, tablet, mobile, loading, empty, error, permission-denied, and relevant interaction states.
8. Require accessibility checks: keyboard operation, focus order, semantics, contrast, reduced motion, and screen-reader labels.
9. Use synthetic data in screenshots and examples. Never commit real student personal data.
10. Do not silently change API, database, authorization, or domain rules from a UI specification.

## Recommended workflow

1. Establish product purpose, users, permissions, and workflow.
2. Inspect existing design system and current code.
3. Create or update page specification.
4. Design/revise frames in Figma.
5. Review flows, responsive states and accessibility.
6. Link implementation PRs and QA evidence.
7. Update status and changelog.

## Naming convention

Use stable IDs with descriptive slugs, for example:

- `UI-SYS-001` — application shell and navigation
- `UI-STA-001` — Student Tracking / Abhyas Matrix
- `UI-RSK-001` — Student Risk Intelligence
- `UI-DSN-001` — shared design system

IDs are proposed labels for UI traceability; allocate them before wider use and do not reuse retired IDs.

## Governance

This directory is not authorization to deploy, migrate production data, change access policies, or release functionality. Production changes require the normal engineering, security, QA and owner-approval gates.
