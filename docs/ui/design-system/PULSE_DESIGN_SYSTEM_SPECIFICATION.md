# PULSE Design System Specification

**Status:** Proposed — review required  
**Version:** 0.1.0  
**Date:** 2026-11-08  
**Scope:** Shared design-system foundation for PULSE applications  
**Initial implementation reference:** System A / Student Tracking  
**Figma status:** Not reconciled; live Figma inspection was unavailable during this revision

> This document formalizes a proposed shared design system from the repository's existing frontend implementation. It is not evidence that the tokens, components, themes, or visual states have been approved in Figma or implemented as shared components.

## 1. Purpose

Establish a common visual and interaction language for PULSE while preserving each product module's domain-specific workflows.

The design system must:
- Reuse the current System A visual identity as the initial reference rather than redesigning it without approval.
- Separate raw design primitives from semantic tokens and component-level decisions.
- Keep responsive and accessibility contracts shared across applications.
- Permit product-specific extensions without forking the shared foundation.
- Maintain traceability between design decisions, Figma, documentation, implementation, and QA evidence.

## 2. Evidence and decision labels

Use these labels throughout this document and future design-system work:

| Label | Meaning |
|---|---|
| Existing in code | Directly observed in the inspected repository source |
| Proposed | A recommended standard that has not been approved |
| Figma verification pending | Requires inspection of the canonical Figma file |
| QA pending | Requires browser/device or accessibility evidence |
| Approved | Explicitly accepted by the product/design owner |
| Superseded | Replaced by a later version; retain history |

Do not treat an existing CSS value as an approved design token merely because it appears in code.

## 3. Architecture

The design system is organized into four layers.

1. **Primitive tokens:** raw palette, font families, spacing, radii, shadows and motion primitives.
2. **Semantic tokens:** purpose-based values such as canvas, surface, primary text, border, focus and status.
3. **Component tokens:** component-specific geometry, state and appearance.
4. **Product implementation:** application components and module-specific patterns.

Dependency direction is one-way: product components consume component and semantic tokens; semantic tokens consume primitives. Components must not independently redefine shared semantic meaning.

## 4. Existing visual baseline — System A

The following values were observed in `apps/student-tracking/src/styles.css`. They are a source inventory, not a finalized token contract.

### 4.1 Colour inventory

| Observed value | Current use observed | Proposed semantic mapping | Evidence |
|---|---|---|---|
| `#0b1020` | Main application background | `--pulse-color-bg-canvas` | Existing in code |
| `#0c1222` | Sidebar background | `--pulse-color-bg-sidebar` | Existing in code |
| `#111a2c` / `#111a2b` | Cards and panels | `--pulse-color-bg-surface` | Existing in code |
| `#151f33` | Elevated controls and surfaces | `--pulse-color-bg-elevated` | Existing in code |
| `#e8edf8` | Root text colour | `--pulse-color-text-primary` | Existing in code |
| `#93a0b8` | Supporting copy | `--pulse-color-text-secondary` | Existing in code |
| `#7787a3` | Muted metadata | `--pulse-color-text-muted` | Existing in code |
| `#827cff` / `#8b83ff` | Accent and focus-related styling | `--pulse-color-accent-primary` | Existing in code |
| `#28364e` | Panel border | `--pulse-color-border-default` | Existing in code |
| `#39c99a` | Correct/success legend | `--pulse-color-status-success` | Existing in code |
| `#f06e82` | Incorrect/error legend | `--pulse-color-status-error` | Existing in code |
| `#e9b45b` | Doubt/warning legend | `--pulse-color-status-warning` | Existing in code |
| `#9a8cff` | Partial/violet state | `--pulse-color-status-partial` | Existing in code |

**Important:** several related colours appear in component-specific shades. Consolidate only after checking all usages and contrast. Do not globally replace near-matching colours based on this abbreviated inventory.

### 4.2 Typography inventory

Existing font families:
- **DM Sans:** root interface font and general text.
- **Manrope:** headings, prominent metrics and selected titles.
- **DM Mono:** technical labels, compact metadata, codes and table headings.

Observed use includes multiple font sizes and weights. A complete, measured type scale has not yet been extracted.

**Proposed semantic typography roles:**

| Token | Intended role | Status |
|---|---|---|
| `--pulse-font-body` | General interface copy | Proposed; map to DM Sans |
| `--pulse-font-heading` | Page and section headings | Proposed; map to Manrope |
| `--pulse-font-mono` | IDs, labels, tabular metadata | Proposed; map to DM Mono |
| `--pulse-type-page-title` | Primary page heading | Proposed; size/line-height pending |
| `--pulse-type-section-title` | Section and panel heading | Proposed; size/line-height pending |
| `--pulse-type-body` | Standard interface text | Proposed; size/line-height pending |
| `--pulse-type-caption` | Supporting labels and helper text | Proposed; size/line-height pending |
| `--pulse-type-data` | Dense numeric/table content | Proposed; size/line-height pending |

Do not publish a fixed type scale until computed styles and the Figma typography styles have been compared.

### 4.3 Layout and responsive primitives

The shared stylesheet `packages/ui/src/styles/responsive.css` currently defines:

| Existing token | Observed purpose |
|---|---|
| `--pulse-content-max` | Maximum content width; currently 1600px |
| `--pulse-page-gutter` | Responsive page gutter using clamp() |
| `--pulse-layout-gap` | Responsive layout gap |
| `--pulse-control-height` | Default control height; 40px, 44px on mobile |
| `--pulse-safe-bottom` | Device safe-area bottom inset |
| `--pulse-safe-top` | Device safe-area top inset |
| `--pulse-focus-ring` | Shared keyboard focus outline |

Existing utility contracts include:
- `.pulse-page`
- `.pulse-container`
- `.pulse-grid`
- `.pulse-row`
- `.pulse-stack`
- `.pulse-form-grid`
- `.pulse-table-scroll`
- `.pulse-dialog`
- `.pulse-media`

These are existing shared CSS contracts. Their adoption and visual behaviour still require app-by-app QA.

## 5. Proposed token naming contract

Use lowercase kebab-case names with the `--pulse-` prefix.

### 5.1 Semantic token namespaces

| Namespace | Examples |
|---|---|
| Colour | `--pulse-color-bg-canvas`, `--pulse-color-text-primary` |
| Typography | `--pulse-font-body`, `--pulse-type-body` |
| Spacing | `--pulse-space-1`, `--pulse-space-2` |
| Radius | `--pulse-radius-sm`, `--pulse-radius-card` |
| Border | `--pulse-border-default`, `--pulse-border-strong` |
| Elevation | `--pulse-shadow-card`, `--pulse-shadow-overlay` |
| Motion | `--pulse-motion-fast`, `--pulse-motion-standard` |
| Focus | `--pulse-focus-ring`, `--pulse-focus-color` |
| Layering | `--pulse-z-sidebar`, `--pulse-z-modal`, `--pulse-z-toast` |

These names are proposed. Before adoption, check for existing names in all packages and avoid duplicate aliases.

### 5.2 Spacing scale

**Proposed direction:** a 4px base spacing unit, with a restrained scale for common layout and component spacing.

The current CSS contains many values, including 4px, 6px, 8px, 9px, 10px, 12px, 14px, 16px, 20px and 24px. These are observations, not proof of a coherent scale.

Before standardizing:
1. Extract all spacing declarations from shared and app stylesheets.
2. Cluster values by actual usage.
3. Identify values that are intentional exceptions.
4. Compare against Figma variables.
5. Approve the final scale before replacing CSS values.

### 5.3 Radius scale

The current System A stylesheet uses several small-to-medium radii across controls, cards, badges and dialogs. A shared radius scale is proposed, but exact values and aliases remain pending full CSS extraction and Figma reconciliation.

### 5.4 Elevation and shadows

Preserve the current restrained dark-surface treatment. Define semantic elevation levels only after auditing shadows, borders, gradients and overlays across the application. Do not equate elevation exclusively with box-shadow; surface contrast and border treatment also communicate hierarchy.

## 6. Component inventory and ownership

The following is a proposed shared inventory. It does not assert that each item already exists as a reusable component.

| Component family | Candidate components | Shared responsibility |
|---|---|---|
| Application shell | Sidebar, topbar, breadcrumbs, workspace switcher | Navigation and application framing |
| Navigation | Nav item, tabs, badges | Selection, hierarchy and navigation states |
| Data display | Metric card, data table, progress indicator, status cell | Consistent information presentation |
| Forms | Text input, select, checkbox, form grid | Input geometry, labels, validation and focus |
| Feedback | Notice, toast, empty state, error state | System feedback and recovery |
| Overlays | Dialog, confirmation dialog, modal sheet | Focus management, dismissal and viewport fit |
| Academic workflow | Exercise card, question picker, matrix, eligibility preview | Product-level patterns; promote to shared only when reuse is demonstrated |

### Component contract

Each shared component specification must record:
- Stable component ID and name.
- Purpose and prohibited use cases.
- Anatomy and slot structure.
- Variants and sizes.
- Default, hover, focus, active, disabled, loading, error and selected states where relevant.
- Keyboard interaction and accessible name/description.
- Responsive behaviour.
- Semantic token dependencies.
- Figma component/variant reference.
- Implemented component path and QA evidence.

Do not create an abstraction solely because two screens look similar. Confirm equivalent semantics and interaction contracts first.

## 7. Status semantics

System A currently uses distinct visual states for correct, incorrect, doubt, skipped and partially correct responses. Their academic meaning must remain explicit.

Proposed shared visual aliases:
- Success
- Error
- Warning / attention
- Informational
- Neutral
- Partial / mixed

**Governance rule:** visual tone is not domain truth. Product modules must define their own domain status semantics and map them to shared visual aliases without collapsing distinct academic states.

## 8. Theme strategy

A light theme is a product requirement recorded in historical project context, but this repository audit does not establish a completed light-theme implementation.

Proposed approach:
- Define semantic tokens independently of theme.
- Provide theme-specific primitive values.
- Keep component code bound to semantic tokens.
- Validate contrast and status differentiation in every supported theme.
- Do not ship a theme switch until all relevant screens and states are tested.

Theme values, persistence behaviour and default theme selection remain **decision pending**.

## 9. Responsive and accessibility contract

The shared responsive stylesheet and `docs/architecture/RESPONSIVE_UI_STANDARD.md` remain the current baseline.

Required viewport widths:
- 320px
- 375px
- 430px
- 768px
- 1024px
- 1366px
- 1920px

Required checks:
- Portrait and landscape where relevant.
- Keyboard-only navigation and visible focus.
- Zoom and text scaling.
- Reduced-motion preference.
- Touch target usability.
- Dialog viewport containment and focus handling.
- Horizontal table scrolling without destroying column semantics.
- Safe-area handling on mobile.
- Accessible labels, roles and error announcements.
- Colour contrast and non-colour-only status communication.

The existence of responsive CSS does not prove visual QA has passed. Record screenshots, browser/device, viewport, test date, result and issue references before marking a screen verified.

## 10. Figma reconciliation requirements

Canonical Figma file recorded in project history:
https://www.figma.com/design/bFxTXeFj5b1PYfe9WpnaKm

Historical project notes report a foundation of 12 colour tokens, 10 spacing/radius tokens and 7 typography styles. These values have not been inspected live during this specification work.

Before marking this specification approved:
1. Inspect the live Figma pages, variables, styles and components.
2. Export or record exact token names, values, modes and descriptions.
3. Compare Figma values with the CSS inventory in Section 4.
4. Record each match, mismatch, missing token and duplicate.
5. Reconcile component names and variants.
6. Obtain design-owner approval for any breaking visual changes.
7. Link the final Figma pages and version in this document.

Until then, Figma reconciliation status is **pending**.

## 11. CSS migration rules

When implementation is approved:
1. Add semantic tokens to the shared UI foundation in an additive change.
2. Preserve existing computed appearance while replacing literals in small, reviewable groups.
3. Avoid broad search-and-replace for colours that have different semantic meanings.
4. Keep product-specific overrides explicit and documented.
5. Do not remove legacy declarations until visual regression checks pass.
6. Do not combine token migration with domain, API, data-model or authorization changes.
7. Test the full viewport matrix and the main interaction states.
8. Link screenshots and test results to the relevant PR.

No CSS migration is authorized by this specification.

## 12. Proposed file organization

Keep the current `docs/ui/` structure and extend its existing design-system area only when artifacts are ready.

Proposed future artifacts:
- `docs/ui/design-system/PULSE_DESIGN_SYSTEM_SPECIFICATION.md` — this canonical specification.
- `docs/ui/design-system/DESIGN_TOKEN_REGISTER.md` — approved token catalogue and provenance.
- `docs/ui/design-system/COMPONENT_INVENTORY.md` — shared component catalogue and ownership.
- `docs/ui/design-system/FIGMA_RECONCILIATION_LOG.md` — Figma-to-code comparison and decisions.

Avoid creating empty placeholder files. The latter three should be created when their respective inventories are ready.

## 13. Approval gates

| Gate | Required evidence | Status |
|---|---|---|
| G1 — Source inventory | CSS and shared responsive source reviewed | Complete for initial System A sample |
| G2 — Figma reconciliation | Live variables, styles and components inspected | Pending |
| G3 — Token approval | Token register reviewed and accepted | Pending |
| G4 — Component approval | Component inventory and ownership accepted | Pending |
| G5 — Implementation plan | Additive migration plan and regression scope | Pending |
| G6 — Visual QA | Viewport, interaction and accessibility evidence | Pending |

## 14. Changelog

### 0.1.0 — 2026-11-08
- Established the proposed four-layer design-system architecture.
- Recorded an initial System A colour, typography and responsive-token inventory.
- Proposed semantic naming and component ownership contracts.
- Recorded Figma reconciliation, theme definition and QA as pending.
- No application code or Figma assets changed.
