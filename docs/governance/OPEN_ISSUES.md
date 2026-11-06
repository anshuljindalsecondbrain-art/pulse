# PULSE Open Issues and Follow-up Register

| Issue ID | Module | Description | Severity | Status | Dependency / next action |
|---|---|---|---|---|---|
| PULSE-ISSUE-0001 | Governance | Historical event and requirement backfill incomplete | High | OPEN | Audit source documents, conversation decisions and PR commit history |
| PULSE-ISSUE-0002 | System A | Latest evidence projection commit needs fresh CI confirmation | High | CLOSED | CI passed on audited head 59523c4a7119cb526b6dd7d47a657c8310f4abaf; later documentation commit does not alter domain code |
| PULSE-ISSUE-0003 | System A | Exercise subject selection is uncontrolled / creation hardcodes Physics | Medium | IMPLEMENTED_PENDING_CI | Controlled subject state and selected value persisted in exercise; browser regression test pending |
| PULSE-ISSUE-0004 | System A | Batch selector mutates exercise batch instead of acting as view filter | High | IMPLEMENTED_PENDING_CI | Separate selectedBatch view state; browser regression test pending |
| PULSE-ISSUE-0005 | Platform | Supabase project not connected for as-built schema audit | Blocking | BLOCKED | Connect intended project; inspect before DDL |
| PULSE-ISSUE-0006 | System A | No browser interaction/accessibility test suite | Medium | OPEN | Add Playwright tests after workflow stabilizes |

Close issues only with evidence; preserve closed issue history. Link each issue to its event and PR.
