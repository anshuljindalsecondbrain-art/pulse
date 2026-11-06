# DTE Phase 1 — Offline Template and Handoff Specification

- Document ID: PULSE-DTE-P1-TEMPLATE-001
- Version: 0.1.0
- Status: Draft — contract requirements
- Phase: Current framework / future upload handoff
- Implementation authorization: Not granted

## 1. Purpose

Define the requirements for a controlled offline tagging template and the handoff metadata needed so a later question-upload module can interpret completed tagging work against the correct approved framework.

This is not a question upload specification. DTE does not ingest question content in the current phase.

## 2. Template principles

- Template columns derive from the institution-approved framework and selected work profile.
- No fixed taxonomy column set is mandatory.
- Each template identifies the framework ID/version, template ID/version, work-package ID and issue date.
- Stable framework-element IDs should be represented in a machine-readable form where practical; human-readable labels must also be present for taggers.
- Instructions and allowed values must be available to taggers.
- The template must clearly mark required, optional and conditional fields.
- The question locator is external and must not be described as a DTE question ID.
- A blank or ambiguous value must not be silently replaced by a default academic value.

## 3. Candidate template sections

The exact columns must be confirmed from an existing approved sample. Candidate sections:
1. Work-package metadata.
2. External source/question locator.
3. Institution-configured classification fields.
4. Question type or other approved catalogues, if configured.
5. Pedagogical metadata, if configured.
6. PYQ appearance fields, if approved for offline capture.
7. Exception/dispute code.
8. Tagger identifier and completion timestamp, where permitted.
9. Checker/reviewer fields, if review occurs in the sheet.
10. Instructions and controlled-value reference.

Do not force all candidate sections into every template.

## 4. External question locator

The institution must define the locator. Candidate components may include source code/title, book/test/exercise code, paper/set/shift, printed question number, page or source revision. These are examples only.

Rules:
- Preserve leading zeros and source formatting.
- Avoid relying on row number alone as a durable reference.
- Do not infer canonical identity across different sources.
- Duplicate locators must be flagged for human resolution.
- If the source changes, retain the original locator and record the source revision where known.

## 5. Export contract

A framework/template export should include:
- Framework identifier and version.
- Template identifier and version.
- Export timestamp.
- Institution/tenant scope.
- Configured fields and stable field identifiers.
- Allowed values and stable value identifiers.
- Required/optional/conditional rules.
- Instructions and locale.
- Compatibility marker/schema version.
- Checksum or integrity marker where technically appropriate.

## 6. Returned-file intake (conditional current capability)

Whether DTE accepts completed files is an open product decision. If accepted:
- Identify file format and template version.
- Validate required columns and identifiers.
- Validate all values against the exact framework version.
- Report row and field-level errors.
- Preserve original submitted file and intake metadata according to retention policy.
- Do not silently map unknown labels to a nearest value.
- Quarantine unknown IDs, invalid values or mismatched framework versions.
- Duplicate submission handling must be idempotent and auditable.
- Technical acceptance must not be confused with academic approval.

If returned-file intake is not required in Phase 1, DTE may provide template generation/export and record operational completion only; this must be confirmed before build.

## 7. Later upload-module handoff

The future upload module may consume an approved handoff package containing:
- Framework ID/version.
- Template ID/version.
- Work-package ID.
- External source/question locator.
- Approved classification value identifiers.
- Approval/review status and evidence reference.
- Exception/resolution status.
- Export manifest and integrity metadata.

The later upload module must separately resolve its canonical question identity and match the external locator to uploaded content. A matching locator is not proof of identity.

## 8. Compatibility and version changes

- Never interpret an old template using the newest framework version by default.
- A framework version mismatch requires explicit migration or reissue.
- A removed/renamed value must remain resolvable in historical submissions.
- Export packages must be reproducible for a known framework/template version.
- Any transformation during handoff must be recorded and reviewable.

## 9. Security and privacy

- Limit export and returned-file access to authorized roles.
- Avoid including question content in template files.
- Protect files in transit and at rest.
- Define retention and deletion rules.
- Audit export, download, submission and validation events.
- Prevent cross-tenant template and work-package disclosure.

## 10. Acceptance criteria

1. Every template identifies its framework and template versions.
2. The structure reflects institution-approved fields only.
3. Human labels and stable machine identifiers are distinguishable.
4. External question locators are not treated as DTE question IDs.
5. Unknown values are reported, not auto-created or guessed.
6. Historical submissions retain the version used at the time.
7. Future handoff packages are traceable to an approved framework.
8. No question content is ingested or stored in the current phase.

## 11. Open decisions

- Actual template format(s): XLSX, CSV, printable PDF or other.
- Whether DTE accepts completed files in Phase 1.
- Existing external locator convention.
- Required metadata and evidence columns.
- Multi-language instruction requirements.
- File size, row count and batch limits.
- Handoff transport and future receiving module.

## 12. Approval

- Product owner: Pending
- Academic authority: Pending
- Operations owner: Pending
- Future upload-module owner: Pending
- Implementation authorization: Not granted

## 13. Change history

| Version | Date | Status | Change |
|---|---|---|---|
| 0.1.0 | 2026-11-06 | Draft | Initial offline template and future handoff requirements |