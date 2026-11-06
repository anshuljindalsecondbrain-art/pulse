# PULSE — Central Document Change Register

- Document ID: PULSE-GOV-REPO-006
- Version: 0.1.0
- Status: Draft — initial central editing ledger
- Owner: Product Owner / Repository Maintainer
- Repository: `anshuljindalsecondbrain-art/pulse`
- Canonical branch: `main`
- Related standard: [Document Control and Change Management Standard](PULSE_DOCUMENT_CONTROL_STANDARD.md)
- Last updated: 2026-11-06

## 1. Purpose

This is the central project-wide ledger for governed edits to PULSE documentation. It records what changed, why, where, under which branch/PR/commit, which document versions were affected, who reviewed or approved the change, and whether the change is merged, approved, implemented or verified.

It supplements Git commits (exact content history), pull requests (review/discussion), the Master Documentation Index (canonical navigation) and domain registers (detailed module status). It does not replace any of them.

## 2. Registry rules

1. Create a Change ID before editing controlled documents.
2. Record every affected Document ID and path.
3. Record old and new document versions; use N/A for new documents.
4. Link the branch and PR before requesting review.
5. Record commit SHA(s) and merge SHA after they exist.
6. Record approvals by role and evidence; never infer approval from a commit or merge.
7. Update this register in the same PR as the document changes.
8. Keep historical rows; corrections are new entries, not silent rewrites.
9. Update domain registers and the project index when their coverage changes.
10. Keep implementation status separate from documentation approval.

## 3. Change status vocabulary

| Status | Meaning |
|---|---|
| Proposed | Change described; not yet edited |
| In Progress | Work is on a branch |
| In Review | PR opened and awaiting review |
| Changes Requested | Review requires amendments |
| Approved | Required authority explicitly approved |
| Merged | PR merged to canonical branch |
| Implemented | Product behavior/code exists |
| Verified | Acceptance evidence confirms behavior |
| Closed — Not Accepted | Proposal closed without adoption |

A change may be merged while its product decision remains Draft or Proposed.

## 4. Central change ledger

| Change ID | Date | Class | Summary | Branch / PR | Affected documents | Version change | Approval | Status |
|---|---|---|---|---|---|---|---|---|
| PULSE-CHG-2026-11-06-001 | 2026-11-06 | SPEC / ADR / GOV / INDEX | Record configurable institute-owned tagging proposal; establish central document editing control; reconcile the proposal with the existing offline-only DTE boundary without overwriting it | `docs/configurable-tagging-governance-2026-11-06` / PR pending | PULSE-DTE-CHG-001; PULSE-GOV-REPO-003; PULSE-GOV-REPO-005; PULSE-GOV-REPO-006; PULSE-DTE-REG-002; D-010 | New docs 0.1.0; index 0.2.0; DTE register 0.4.7; decision log appended | Product owner pending; architecture review pending; academic authority pending | In Progress |

## 5. Document edit ledger

| Change ID | Document ID | Canonical path | Previous version | New version | Edit summary |
|---|---|---|---|---|---|
| PULSE-CHG-2026-11-06-001 | PULSE-GOV-REPO-005 | `docs/00_PROJECT_GOVERNANCE/PULSE_DOCUMENT_CONTROL_STANDARD.md` | N/A | 0.1.0 | Created branch/PR, document lifecycle, semantic versioning and edit-control standard |
| PULSE-CHG-2026-11-06-001 | PULSE-GOV-REPO-006 | `docs/00_PROJECT_GOVERNANCE/PULSE_DOCUMENT_CHANGE_REGISTER.md` | N/A | 0.1.0 | Created central document editing and approval ledger |
| PULSE-CHG-2026-11-06-001 | PULSE-GOV-REPO-003 | `docs/00_PROJECT_GOVERNANCE/PULSE_MASTER_DOCUMENTATION_INDEX.md` | 0.1.0 | 0.2.0 | Added document control, central editing ledger and configurable tagging proposal navigation |
| PULSE-CHG-2026-11-06-001 | PULSE-DTE-CHG-001 | `docs/dte/CONFIGURABLE_TAGGING_SYSTEM_SCOPE_CHANGE_PROPOSAL.md` | N/A | 0.1.0 | Captured Parts 2.1–2.7 as a proposed digital configurable tagging scope with DTE/DRE/STS ownership boundaries |
| PULSE-CHG-2026-11-06-001 | PULSE-DTE-REG-002 | `docs/dte/DTE_MASTER_DOCUMENTATION_REGISTER.md` | 0.4.6 | 0.4.7 | Added pending scope-change proposal; retained offline-phase authority |
| PULSE-CHG-2026-11-06-001 | PULSE-ADR-D-010 | `docs/decisions/DECISION_LOG.md` | Existing log | Appended proposal | Recorded digital configurable tagging scope change as proposed, not accepted |

## 6. Review and approval record

| Change ID | Review domain | Reviewer / authority | Outcome | Evidence |
|---|---|---|---|---|
| PULSE-CHG-2026-11-06-001 | Product scope | Product Owner | Pending | PR review required |
| PULSE-CHG-2026-11-06-001 | Academic taxonomy ownership | Institute academic authority | Pending | Explicit approval required |
| PULSE-CHG-2026-11-06-001 | Architecture boundaries | Architecture owner | Pending | DTE / DRE / STS reconciliation |
| PULSE-CHG-2026-11-06-001 | Security and data governance | Security / database owner | Pending | Required before data model or implementation |
| PULSE-CHG-2026-11-06-001 | QA and acceptance | QA owner | Pending | Required before implementation authorization |

## 7. Registry maintenance

- Add one row per governed change; never erase historical records.
- Add one document-ledger row for every controlled document changed.
- Record PR and commit references when available.
- Update status after review, merge, implementation and verification as separate events.
- Link follow-up changes rather than rewriting historical summaries.
- Reconcile this register with GitHub PRs and commit history during release reviews.

## 8. Change history

| Version | Date | Status | Change |
|---|---|---|---|
| 0.1.0 | 2026-11-06 | Draft | Initial central editing ledger and first governed change entry |
