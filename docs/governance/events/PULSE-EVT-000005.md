# PULSE-EVT-000005 — Harden prototype CSV export and keyboard reset

- Category: Prototype stabilization / data safety
- Module: System A / Abhyas Matrix
- Created: 2026-11-06
- Status: IMPLEMENTED_PENDING_CI
- Origin: System A Master Completion Specification; prototype audit.
- Branch: feat/system-a-abhyas-foundation
- PR: https://github.com/anshuljindalsecondbrain-art/pulse/pull/2

## Change
- Added a shared CSV cell encoder that quotes values, escapes embedded quotes and prefixes spreadsheet formula-like values with an apostrophe.
- Replaced ad hoc CSV serialization in the matrix export with the shared encoder.
- Added Delete as a reset-to-Unattempted keyboard shortcut, matching the uploaded tracking specification.
- Replaced the hardcoded header date with a runtime-localized date.

## Validation
- Added unit cases for ordinary CSV values, embedded quotes and formula-like prefixes.
- CI must pass on the resulting branch head.
- Browser-level keyboard and export tests remain pending.

## Limitations
- CSV formula mitigation is defense-in-depth and must be reviewed against target spreadsheet applications.
- Localized date formatting uses the browser runtime locale/timezone; institution timezone policy remains a backend/domain decision.
- No database, API or production data changes.
