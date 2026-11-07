# PULSE Source Authority Register

- Document ID: PULSE-GOV-AUTH-001
- Version: 1.0.0
- Status: Draft — owner approval pending
- Snapshot: 2026-11-07

## Authority by concern

| Concern | Canonical authority | Rule |
|---|---|---|
| Repository implementation | Merged files on main | Feature branches/PRs remain proposals |
| Live database state | Supabase project nnvssbfezkliavwxhgbh | Live state does not validate target design |
| Migration release lineage | Reviewed migrations on canonical main | One ordered lineage |
| Product scope | Approved product decision record | Draft proposal cannot supersede approved phase boundary |
| Academic behavior | Approved academic specification/decision | Academic owner approval required |
| Domain ownership | Approved architecture decision | One authoritative owner per concept |
| Requirement traceability | Existing canonical requirement register | PEIGS references; does not duplicate |
| Events/audit | Existing event governance register and immutable source events | Preserve original event evidence |
| Issue/risk closure | Existing Open Issues/risk register | Close only against evidence |
| Test evidence | Canonical test evidence register and exact CI run | Bind to commit and environment |
| Release state | Release history plus deployment evidence | Merge/build does not equal production release |
| UI design | Approved Figma artifact/version | Screenshot/spec alone is not implementation |
| Engineering inventory | PEIGS, if approved | Registry is index/evidence layer, not domain authority |

## Known authority collisions and unresolved items

1. CORE-009: two physical ERD/data dictionary files use the same ID and version but have overlapping, non-identical scopes. Preserve both until owner review; assign distinct IDs or designate one canonical and one supporting.
2. System A schema migration: 25 explicit CREATE TABLE statements versus 26 in CORE-008 prose. Verify against exact migration and mapping before correction.
3. Shared identity: DEC-011/012/013 and M0001 owner decisions were found on a divergent branch. Preserve original record provenance and verify their controlled transfer before they are considered canonical on main.
4. DTE digital configurable tagging: PR #3 proposes scope expansion while current DTE phase boundary is narrower. Product owner must decide replacement phase, future phase or separate module.
5. PEIGS: explicitly named registry entity list enumerates 17 principal tables, not 18; correct references before schema generation.
6. Branch/PR claims may be stale. Re-fetch branch heads and CI state immediately before integration.

## Conflict resolution

Freeze the affected merge/deployment decision. Compare document IDs, contents, versions, approvals and source commits. Record resolution in the canonical decision/change register. Keep superseded records with pointers. Never resolve conflict by choosing the newest filename or branch automatically.
