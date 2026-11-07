# PULSE Design Token Register

**Status:** Draft — inventory only; approval required  
**Version:** 0.1.0  
**Date:** 2026-11-08  
**Scope:** Initial System A / Student Tracking CSS baseline and shared responsive foundation  
**Canonical specification:** [PULSE Design System Specification](./PULSE_DESIGN_SYSTEM_SPECIFICATION.md)

> This register records source-observed values and proposed semantic mappings. It is not an approved token set. Existing literals must not be globally replaced until semantic intent, Figma parity, contrast and regression behaviour are reviewed.

## 1. Source provenance

| Source | Branch | Blob SHA | Use |
|---|---|---|---|
| `apps/student-tracking/src/styles.css` | `feat/system-a-abhyas-foundation` | `cb23e7659698669dba8ce4057bcc0034eb0c3ef8` | System A visual implementation |
| `packages/ui/src/styles/responsive.css` | `feat/system-a-abhyas-foundation` | `0c0adc39671c039eca6e928cd8f1bbfa3e47d4e7` | Shared responsive and accessibility contracts |

The extraction covers these two files only. It does not claim repository-wide CSS completeness. Figma values and computed browser styles have not been inspected in this pass.

## 2. Existing shared CSS variables

| Variable | Base value | Responsive override / note |
|---|---|---|
| `--pulse-content-max` | `1600px` | No override observed |
| `--pulse-page-gutter` | `clamp(12px, 2.5vw, 40px)` | At 1024px: `clamp(12px, 2vw, 24px)`; at 768px: `12px`; at 420px: `10px` |
| `--pulse-layout-gap` | `clamp(10px, 1.5vw, 20px)` | At 1024px: `12px`; at 768px: `10px`; at 420px: `8px` |
| `--pulse-control-height` | `40px` | At 768px: `44px` |
| `--pulse-safe-bottom` | `env(safe-area-inset-bottom, 0px)` | Device safe-area inset |
| `--pulse-safe-top` | `env(safe-area-inset-top, 0px)` | Device safe-area inset |
| `--pulse-focus-ring` | `2px solid var(--pulse-focus-color, #8b83ff)` | Uses fallback focus colour |

Existing utility contracts: `.pulse-page`, `.pulse-container`, `.pulse-grid`, `.pulse-card`, `.pulse-panel`, `.pulse-row`, `.pulse-stack`, `.pulse-form-grid`, `.pulse-table-scroll`, `[data-pulse-scroll="horizontal"]`, `.pulse-dialog`, `[role="dialog"]`, and `.pulse-media`.

## 3. System A colour inventory

### 3.1 Core candidates already mapped in the design-system specification

| Literal value(s) | Observed role | Candidate semantic token |
|---|---|---|
| `#0b1020` | Root/application canvas | `--pulse-color-bg-canvas` |
| `#0c1222` | Sidebar surface | `--pulse-color-bg-sidebar` |
| `#111a2b`, `#111a2c` | Cards and panels | `--pulse-color-bg-surface` |
| `#151f33` | Elevated controls/surfaces | `--pulse-color-bg-elevated` |
| `#e8edf8` | Root text | `--pulse-color-text-primary` |
| `#93a0b8` | Supporting copy | `--pulse-color-text-secondary` |
| `#7787a3` | Muted metadata | `--pulse-color-text-muted` |
| `#827cff`, `#8b83ff` | Accent and focus-related styling | `--pulse-color-accent-primary` / focus alias |
| `#28364e` | Panel border | `--pulse-color-border-default` |
| `#39c99a` | Correct/success indicator | `--pulse-color-status-success` |
| `#f06e82` | Incorrect/error indicator | `--pulse-color-status-error` |
| `#e9b45b` | Doubt/warning indicator | `--pulse-color-status-warning` |
| `#9a8cff` | Partial/violet state | `--pulse-color-status-partial` |

### 3.2 All unique hex literals extracted

The following inventory includes component-state, decorative, gradient and alpha-channel values. It is not a global palette recommendation.

```text
#0005 #0009 #050914c9 #0b1020 #0b1222f5 #0c1222 #0d1425cc #0e1729 #111a2b #111a2c #111d31 #112b2a #121b2e #121d31 #141d31 #141e31 #143d36 #151e33 #151f32 #151f33 #151f34 #163c3a #163d36 #18243a #1b2140 #1b2940 #1b2948 #1c2940 #202b42 #202b48 #202d43 #24324a #246c5b #252f4e #25334a #27354b #283457 #28364e #28504b #28645a #292e59 #29364b #29364d #293650 #293a56 #293e5e #2a3850 #2a3852 #2a3953 #2b3159 #2b3850 #2b3951 #2b3952 #2c3a53 #2c3b56 #2d2c55 #2d8269 #30345b #314568 #332b43 #332e56 #33415a #33425a #34335e #34415a #34425e #35445e #373366 #37345f #373c70 #39c99a #3b82f6 #3d4b64 #43351f #43516a #44351e #44365b #452a35 #492a37 #493126 #49391f #494779 #4a4780 #4a4784 #4ade9a #4ade9a88 #4b5c77 #4e3c55 #594438 #596984 #5b4e92 #5b5ad533 #5be0b0 #5e72e9 #615bff44 #62708a #62e1b3 #65e3b5 #66748b #687994 #69d8b5 #69d9ae #6e7f99 #6f7e98 #71809b #73829a #73839d #74839e #75849e #7770f5 #7787a3 #7888a2 #7889a4 #7986a3 #7c3c51 #7c73ff #7c77d9 #7c8ca5 #7e91a9 #7f8ca4 #7f8ca5 #7f8da6 #7f8da7 #7f8ea9 #8090a9 #8190a8 #8190a9 #8190aa #827aff #827cff #8290a8 #8292ad #856332 #8580ff #8592aa #8594ac #8594ad #8797af #8a82ff #8a82ff22 #8b83ff #8c9ab2 #8d83ff #8d9bb2 #8e86f5 #8e8af3 #91b7ad #928aff #93a0b8 #94a4bb #96a3ba #9a8cff #9aa6c0 #9aa8bd #9aa8bf #9ba9c0 #9ce4cf #9dbbb5 #9eacc4 #a49cff #a59cff #a69dff #a6f0d5 #a7a1ff #a8a1ff #a9a2ff #a9c7ff #aaa3ff #aaa4ff #aab7cc #aab8ce #b1aaff #b6b0ff #b6c1d4 #b9b4ff #b9c5d9 #bac5d8 #bcb1ff #bdc8da #c7c1ff #c7d0e2 #c7d1e4 #c8f0e6 #c9d3e3 #cbd5e5 #d2b9ff #d5deec #d6d1ff #d8d9ff #d8e0ee #d9e2f1 #dce4f3 #dce5f3 #dce5ff #e0b8e8 #e0e4fb #e1e8f5 #e2e8f4 #e2e9f5 #e3b7a2 #e6ebf6 #e7eaff #e7ecf7 #e8b85f #e8edf8 #e9b45b #edf1fa #f06e82 #f07e7e #f0bd66 #f0c4a8 #f0c6a0 #f1f4fc #f59e72 #f6bd66 #ff8e9c #ff9aab #ff9b88 #ffae8e #ffbd8d #ffd17b
```

Do not merge near-matching shades solely because they look similar in source. Determine whether each is a surface, border, text, status, avatar, chart, overlay, gradient stop, shadow or interaction state. Preserve alpha channels where opacity is intentional. Status colours must retain distinct academic meaning and must not rely on colour alone.

## 4. Typography inventory

Font families observed:
- `DM Sans` — root/body interface family.
- `Manrope` — headings and prominent metrics.
- `DM Mono` — compact labels, metadata and tabular/technical content.

The stylesheet contains varied sizes and weights, including responsive title sizing. This extraction does not establish a canonical type scale or line-height system.

| Proposed token | Mapping direction | Status |
|---|---|---|
| `--pulse-font-body` | DM Sans | Proposed |
| `--pulse-font-heading` | Manrope | Proposed |
| `--pulse-font-mono` | DM Mono | Proposed |
| `--pulse-type-page-title` | Page heading role | Proposed; computed size/line-height pending |
| `--pulse-type-section-title` | Section/panel heading role | Proposed; computed size/line-height pending |
| `--pulse-type-body` | Standard interface copy | Proposed; computed size/line-height pending |
| `--pulse-type-caption` | Supporting labels/helper copy | Proposed; computed size/line-height pending |
| `--pulse-type-data` | Dense numeric/table content | Proposed; computed size/line-height pending |

## 5. Geometry and spacing observations

The stylesheet uses many literal pixel values across unrelated properties. Distinct pixel values extracted from common sizing, spacing, gap and radius declarations:

```text
1px, 2px, 3px, 4px, 5px, 6px, 7px, 8px, 9px, 10px, 11px, 12px, 13px, 14px, 15px, 16px, 17px, 18px, 19px, 20px, 21px, 22px, 25px, 27px, 28px, 29px, 30px, 31px, 34px, 35px, 36px, 37px, 38px, 42px, 44px, 47px, 48px, 54px, 55px, 58px, 60px, 62px, 64px, 65px, 76px, 78px, 100px, 105px, 107px, 119px, 125px, 145px, 155px, 165px, 185px, 190px, 210px, 248px, 300px, 320px, 430px, 620px, 650px, 720px, 750px, 1500px
```

This list includes widths, heights, breakpoints, control dimensions, content limits and padding/margin values. It is not a spacing scale.

**Border-radius literals observed**

```text
11px, 10px, 9px, 8px, 5px, 50%, 2px, 7px, 3px, 6px, 14px, 4px
```

Group values by property and component role; identify frequency, intentional exceptions and responsive overrides; then compare with Figma variables. The 4px base-unit direction in the canonical specification remains a proposal, not an approved conversion rule.

## 6. Shadow and elevation inventory

Exact `box-shadow` declarations observed:

```text
- 0 5px 20px #615bff44
- inset 2px 0 #8b83ff
- 0 0 9px #4ade9a88
- 0 5px 18px #5b5ad533
- 0 1px 4px #0005
- 0 25px 80px #0009
- 0 0 0 2px #8a82ff22
- 0 10px 30px #0005
- none
```

Shadows coexist with borders, gradients and surface contrast. Elevation tokens should be based on the complete visual treatment rather than shadow values alone.

## 7. Proposed semantic token catalogue

These names are candidates only. Search the entire repository for collisions and obtain design-owner approval before implementation.

| Category | Candidate token examples | Source status |
|---|---|---|
| Canvas/surface | `--pulse-color-bg-canvas`, `--pulse-color-bg-sidebar`, `--pulse-color-bg-surface`, `--pulse-color-bg-elevated` | Proposed mappings from observed literals |
| Text | `--pulse-color-text-primary`, `--pulse-color-text-secondary`, `--pulse-color-text-muted` | Proposed mappings from observed literals |
| Border/focus | `--pulse-color-border-default`, `--pulse-focus-color`, `--pulse-focus-ring` | Mixed: focus ring exists; semantic names proposed |
| Status | `--pulse-color-status-success`, `--pulse-color-status-error`, `--pulse-color-status-warning`, `--pulse-color-status-partial` | Proposed; preserve domain distinctions |
| Typography | `--pulse-font-body`, `--pulse-font-heading`, `--pulse-font-mono` | Proposed mappings to existing font families |
| Layout | `--pulse-content-max`, `--pulse-page-gutter`, `--pulse-layout-gap`, `--pulse-control-height` | Existing shared variables |
| Device/focus | `--pulse-safe-top`, `--pulse-safe-bottom`, `--pulse-focus-ring` | Existing shared variables |
| Spacing/radius/elevation | `--pulse-space-*`, `--pulse-radius-*`, `--pulse-shadow-*` | Proposed namespaces; exact scale pending |

## 8. Exceptions and unresolved reconciliation

1. `#111a2b` and `#111a2c` both occur in surface roles; determine whether this is intentional layering or drift.
2. Accent/focus-related purples include multiple close values; do not collapse without Figma and contrast review.
3. The application stylesheet contains one-off shades for avatars, icons, charts, notices, buttons, overlays and state treatments.
4. Multiple responsive media-query blocks exist in the application stylesheet; consolidate only after behaviour is tested at all required widths.
5. Typography is not yet a measured scale; shorthand declarations must be normalized before comparing sizes and weights.
6. The light theme is not evidenced as implemented by these files.
7. Figma's reported historical token counts are not verified in the live file.
8. No browser-computed-style, screenshot, contrast or accessibility QA evidence was generated in this inventory pass.

## 9. Approval and implementation gates

| Gate | Required evidence | Status |
|---|---|---|
| T1 — Source scope | All relevant app and shared stylesheets identified | Partial: two source files audited |
| T2 — Literal extraction | Property-aware colour, typography, spacing, radius, border and elevation register | Partial: initial values extracted; full classification pending |
| T3 — Figma comparison | Live variables, styles, modes and component values compared | Pending |
| T4 — Semantic mapping | Each literal assigned, retained as exception or retired with rationale | Pending |
| T5 — Token approval | Design/product owner approves names, values and theme strategy | Pending |
| T6 — Migration plan | Additive CSS migration, compatibility and regression plan | Pending |
| T7 — Visual QA | Viewport, state, contrast, keyboard and reduced-motion evidence | Pending |

**No CSS, component, Figma, database or production changes are authorized by this register.**

## 10. Changelog

### 0.1.0 — 2026-11-08
- Recorded shared responsive variables and their breakpoint overrides.
- Extracted unique System A hex colours, selected geometry values, radius declarations and shadows from the audited source files.
- Preserved source provenance and explicitly marked semantic mappings as proposed.
- Left Figma reconciliation, full repository coverage, approval and migration pending.
