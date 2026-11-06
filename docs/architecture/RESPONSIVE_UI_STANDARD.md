# PULSE Responsive UI Standard

Status: **Implemented in shared frontend foundation; adoption required for each app**.

## Scope and audit
The repository currently contains one implemented frontend entry point: `apps/student-tracking/src/main.tsx`. Its responsive rules previously lived in the application-specific `styles.css`, including multiple overlapping breakpoint sections. This made the behaviour difficult to reuse consistently across future PULSE modules.

## Global default
- Shared stylesheet: `packages/ui/src/styles/responsive.css`.
- Student Tracking imports the shared stylesheet before its local styles.
- New PULSE frontend entry points must import the shared stylesheet before app-specific styles.
- Use the shared `--pulse-*` layout tokens and `.pulse-*` utility contracts for page gutters, containers, grids, forms, panels, scrolling tables and dialogs.
- App-specific styles may customize colours and component appearance but must preserve the shared overflow, touch, focus, reduced-motion and viewport constraints.

## Responsive contract
- Wide desktop: fluid content with a bounded reading width and adaptive grids.
- Compact desktop/tablet: reduced gutters and adaptive columns.
- Mobile (<=768px): single-column forms, two-column data grids by default, safe-area-aware page spacing and full-width dialogs.
- Narrow mobile (<=420px): tighter spacing; components needing one column opt into `data-pulse-single-mobile="true"`.
- Short landscape: dialogs remain within the visible viewport.
- Two-dimensional data tables may scroll horizontally; do not crush column semantics to force them into a narrow viewport.

## Required adoption in new modules
1. Import `packages/ui/src/styles/responsive.css` in the app entry point before local CSS.
2. Use `.pulse-page` and `.pulse-container` for page structure.
3. Use `.pulse-grid`, `.pulse-form-grid`, `.pulse-row`, and `.pulse-stack` for responsive layout.
4. Wrap wide tables in `.pulse-table-scroll` or use `data-pulse-scroll="horizontal"`.
5. Constrain dialogs with `.pulse-dialog` or semantic `role="dialog"`.
6. Test 320, 375, 430, 768, 1024, 1366 and 1920 CSS-pixel widths, portrait and landscape, keyboard navigation, zoom and reduced-motion settings.

## Limitations and release gate
This standard is wired into the existing Student Tracking app and available for future PULSE apps to import. It does not automatically style an app that does not import it, nor does it replace component-level responsive design. Browser/device visual QA has not been run in this change. Keep PR #2 in draft until build, unit tests and viewport/accessibility checks are recorded.
