# Figma Reconciliation Log

**Status:** Blocked — live Figma inspection unavailable  
**Version:** 0.1.0  
**Date:** 2026-11-08  
**Scope:** Existing PULSE design system; read-only reconciliation  
**Canonical Figma file:** [PULSE design file](https://www.figma.com/design/bFxTXeFj5b1PYfe9WpnaKm)  
**GitHub design-system specification:** [PULSE_DESIGN_SYSTEM_SPECIFICATION.md](./PULSE_DESIGN_SYSTEM_SPECIFICATION.md)  
**CSS token register:** [DESIGN_TOKEN_REGISTER.md](./DESIGN_TOKEN_REGISTER.md)

> This log records the attempted inspection and defines the comparison protocol. No Figma variables, styles, components or canvas nodes were read or modified. No Figma-to-code parity conclusion can be made.

## 1. Inspection attempt

| Item | Result |
|---|---|
| Canonical file key | `bFxTXeFj5b1PYfe9WpnaKm` |
| File URL | `https://www.figma.com/design/bFxTXeFj5b1PYfe9WpnaKm` |
| Operation | Read-only file metadata / page inventory |
| Session created | Yes |
| Metadata request | Rejected by Figma MCP call limit |
| Reported reason | Figma Starter plan tool-call limit reached |
| Figma content inspected | None |
| Figma content changed | None |

This is a tooling/access blocker, not evidence that the Figma file is empty or that its design system is missing.

## 2. Reconciliation status

| Reconciliation area | GitHub/code evidence available | Figma evidence | Status |
|---|---|---|---|
| File and page inventory | Canonical file URL recorded in project history | Not accessible | Blocked |
| Colour variables | 221 unique hex literals extracted from System A stylesheet; semantic subset catalogued | Not accessible | Not compared |
| Typography styles | DM Sans, Manrope and DM Mono observed in code; complete measured type scale pending | Not accessible | Not compared |
| Spacing variables | Shared responsive tokens and application pixel values extracted | Not accessible | Not compared |
| Radius variables | 12 distinct radius declarations observed in System A CSS | Not accessible | Not compared |
| Effect styles | Nine unique box-shadow declarations observed in System A CSS | Not accessible | Not compared |
| Components and variants | Candidate component families listed in specification; no shared Figma inventory verified | Not accessible | Not compared |
| Theme modes | Light theme not evidenced in audited CSS files | Not accessible | Not compared |
| Responsive frames | Required viewport matrix documented | Not accessible | Not compared |

## 3. Code-side baseline

The code-side baseline comes from the feature branch at the time of this audit:

| Source | Branch | Blob SHA |
|---|---|---|
| `apps/student-tracking/src/styles.css` | `feat/system-a-abhyas-foundation` | `cb23e7659698669dba8ce4057bcc0034eb0c3ef8` |
| `packages/ui/src/styles/responsive.css` | `feat/system-a-abhyas-foundation` | `0c0adc39671c039eca6e928cd8f1bbfa3e47d4e7` |

Code-side findings:
- Shared responsive stylesheet declares seven variables, with breakpoint overrides for page gutter, layout gap and control height.
- System A stylesheet contains 221 unique hex literals.
- System A stylesheet contains 12 distinct border-radius declarations.
- System A stylesheet contains nine distinct box-shadow declarations.
- Font families observed: DM Sans, Manrope and DM Mono.
- The CSS inventory covers these two files only, not every stylesheet in the repository.

See the CSS Token Register for the full extracted literal inventory and qualifications.

## 4. Required Figma inspection when access is restored

Perform these read-only inspections against the canonical file:

1. List all pages and top-level frames.
2. List local variable collections, variable names, resolved types, scopes, values and modes.
3. List local paint styles, text styles and effect styles.
4. List on-canvas components and component sets, with variant names.
5. Identify any light/dark theme modes and their variable coverage.
6. Record exact node IDs and links for the design-system foundations and representative application screens.

Do not create, rename, delete or modify any Figma assets during this audit.

## 5. Comparison protocol

For every candidate token or reusable component, record:

| Field | Required value |
|---|---|
| Stable reconciliation ID | Unique ID, e.g. `F4-COLOR-001` |
| Category | Colour, typography, spacing, radius, elevation, component, theme |
| Code source | File path and line/range or exact CSS declaration |
| Code value | Exact literal or variable expression |
| Figma source | Page, collection/style/component and node ID |
| Figma value | Exact value, mode and relevant properties |
| Comparison | Match, mismatch, code-only, Figma-only, ambiguous |
| Proposed disposition | Keep, map, split, rename, deprecate, investigate |
| Rationale | Semantic and interaction reasoning |
| Approval | Reviewer, decision and date |
| Follow-up | GitHub issue/PR and Figma reference |

Comparison rules:
- Compare semantic purpose, not just numerical similarity.
- Do not merge status colours that represent different academic outcomes.
- Preserve alpha/opacity and gradient semantics.
- Compare typography family, weight, size, line height, letter spacing and text case.
- Compare responsive values by mode and breakpoint where the design defines them.
- Compare component anatomy, variants, states and interaction semantics, not names alone.
- Mark absent evidence as unknown; do not infer a Figma value from code or historical notes.

## 6. Decision and change control

- This log does not approve any token or component.
- Do not create a second Figma file.
- Do not alter the existing Figma library during reconciliation.
- Do not migrate CSS or replace literals while comparison is blocked.
- Once evidence is available, append dated findings rather than overwriting the audit trail.
- Any proposed breaking change requires explicit product/design-owner approval.
- Preserve prior approved versions and record supersession explicitly.

## 7. Exit criteria

F4 can be marked complete only when:
- The canonical Figma file has been inspected successfully.
- Variables, styles, components and relevant page structure have been inventoried.
- Code-to-Figma comparisons have explicit evidence and dispositions.
- Unresolved mismatches are recorded with owners or decisions needed.
- The product/design owner has reviewed the reconciliation findings.

## 8. Changelog

### 0.1.0 — 2026-11-08
- Recorded the live Figma inspection attempt and access blocker.
- Preserved the verified code-side baseline and its source SHAs.
- Added the read-only inspection protocol, comparison schema and exit criteria.
- No Figma or application assets were modified.
