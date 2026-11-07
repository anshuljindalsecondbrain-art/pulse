# PULSE Branch and Pull Request Reconciliation Register

- Document ID: PULSE-GOV-BRANCH-001
- Version: 1.0.0
- Status: Draft — inventory only; no branch disposition approved
- Snapshot: 2026-11-07

## Policy

main is the intended integration baseline. Feature branches are not canonical implementation until merged. No blind merge, force-push, mass cherry-pick or deletion. Before integration compare full tree, commit history, migrations, configuration, requirements, decisions and test evidence.

## Open pull requests

| PR | Head | Purpose | Observed state | Proposed disposition |
|---|---|---|---|---|
| #1 | feat/pulse-v10-implementation | Legacy V10 shared platform foundation | Open, unmerged, reported non-mergeable; 19 commits | Reconcile against System A/shared core; selectively salvage or supersede |
| #2 | feat/system-a-abhyas-foundation | System A application, schema proposal and governance | Open draft, unmerged | Principal System A source corpus; controlled extraction/rebuild onto current main |
| #3 | docs/configurable-tagging-governance-2026-11-06 | Document control and configurable tagging proposal | Open draft; 2 ahead / 0 behind | Review proposal; preserve current DTE phase gate |
| #4 | docs/peigs-architecture-v1 | PEIGS architecture and registry proposal | Open draft; 11 ahead / 0 behind | Documentation review; no implementation authorization |

## Branch families observed

| Family | Branches | Treatment |
|---|---|---|
| Canonical | main | Integration target |
| PEIGS | docs/peigs-architecture-v1 | Isolated review |
| Tagging | docs/configurable-tagging-governance-2026-11-06 | Isolated review |
| System A/data | feat/system-a-abhyas-foundation, docs/system-a-a2-model-reconciliation, docs/system-a-database-governance | Compare as one related source family; do not merge branch heads directly |
| V10 legacy | feat/pulse-domain-core, feat/pulse-foundation, feat/pulse-v10-auto*, feat/pulse-v10-build, feat/pulse-v10-complete, feat/pulse-v10-core*, feat/pulse-v10-delivery, feat/pulse-v10-final-build, feat/pulse-v10-foundation*, feat/pulse-v10-implementation*, feat/pulse-v10-production, feat/pulse-v10-shippable | Inventory unique assets and commits before archive/salvage/retire |

## Reconciliation sequence

1. Avoid spawning parallel implementation branches for the same scope.
2. Inventory all branch paths and commits; deduplicate by blob SHA, not filename alone.
3. Map each source to domain, stable document ID, authority, status, branch, dependencies and proposed destination.
4. Preserve approved decision records with original commit provenance.
5. Build a clean integration branch from current main using selected files/commits; retain source branches.
6. Resolve duplicate IDs and migration discrepancies.
7. Run link, code, migration static, security and domain acceptance checks.
8. Open bounded integration PRs by domain slice.
9. Close/retire source PRs and delete branches only after accepted integration and archival record.

## Hold points

CORE-009 collision; 25/26 System A migration count; conflicting identity/authorization proposals; Next.js root and System A Vite topology; configurable tagging scope vs DTE phase decision; any release claim without environment-specific evidence.
