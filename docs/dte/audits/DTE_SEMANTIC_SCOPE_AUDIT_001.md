# DTE Semantic Scope Audit — M01 to M18

- Document ID: PULSE-DTE-SEMANTIC-AUDIT-001
- Version: 0.1.0
- Status: Draft — semantic review findings
- Audit date: 2026-11-06
- Scope: Detailed requirement-language review of all 18 DTE module specifications
- Governing rule: DTE manages institution-defined academic classification; it does not design or generate curriculum structures or chapter-wise bifurcation.

## 1. Executive result

The 18 module specifications were reviewed for whether their detailed responsibilities, workflows and acceptance criteria imply that DTE designs academic structures. No requirement was found that explicitly makes curriculum or chapter-wise syllabus generation a DTE capability.

One material wording ambiguity remains in M04. Its phrases “defines the classification schemas”, “define multiple classification groups” and “configure hierarchical structures” could be read as giving DTE responsibility for academic structure design. The intended responsibility must be stated as encoding and maintaining a structure already defined and approved by the institution.

## 2. Module-by-module result

| Module | Result | Finding |
|---|---|---|
| M01 Dashboard | Consistent | Displays configured coverage/work metrics; no curriculum authoring |
| M02 Question Inventory | Consistent | Filters by configured fields; excludes schema/node definition |
| M03 Tagging Studio | Consistent | Uses active configuration; excludes taxonomy definition |
| M04 Classification Configuration Studio | Wording correction required | Must distinguish software configuration from academic structure design |
| M05 Relationship Mapping | Consistent with guardrail | May use only institution-approved relationship types and endpoints |
| M06 Archetype Management | Consistent | Manages reusable archetype records, not mandatory hierarchy levels |
| M07 Question Type Manager | Consistent | Configurable question-format catalogue, separate from curriculum structure |
| M08 Pedagogical Metadata | Consistent with guardrail | Descriptors are institution-managed metadata, not mandatory global categories |
| M09 PYQ Provenance | Consistent | Records exam appearances and evidence |
| M10 Review & Approval | Consistent | Governs human review workflow |
| M11 Version & History | Consistent | Preserves technical revisions and audit history |
| M12 Bulk Tagging | Consistent with guardrail | Bulk imports must not auto-create unknown academic nodes |
| M13 Validation & Quality | Consistent with guardrail | Validates against approved tenant rules, not a fixed hierarchy |
| M14 Coverage & Productivity | Consistent | Reports against configured dimensions |
| M15 Configuration Version | Consistent with guardrail | Versions approved configuration; does not author academic meaning |
| M16 Historical Enrichment | Consistent | Sends mapping changes to downstream consumers |
| M17 AI Assistance | Consistent with existing safeguards | Validates suggestions against active schema; must not invent new nodes |
| M18 External Integration | Consistent | Exposes managed references to external consumers |

## 3. Required M04 wording

Recommended purpose statement:

> The Classification Configuration Studio provides the software interface for encoding and maintaining classification schemas that an institution has already defined and approved. Authorized administrators use it to represent that existing structure in DTE. The module does not decide the institution's academic structure, create chapter-wise bifurcation, recommend a curriculum hierarchy or determine which academic categories should exist.

Recommended language changes:
- “Create/edit a draft configuration record representing an institution-approved schema.”
- “Record classification groups specified by the institution.”
- “Encode institution-approved hierarchical or non-hierarchical structures.”
- “Encode technical fields, relationships, constraints and labels specified by the institution.”

The existing M04 file has not been changed by this audit. This correction remains pending.

## 4. Cross-module guardrails

1. M05 uses only relationship types and endpoints allowed by the active approved configuration.
2. M08 manages institution-selected descriptors; illustrative labels are not mandatory categories.
3. M12 rejects or quarantines unknown classification identifiers; it does not auto-create academic nodes.
4. M13 validates against tenant-approved rules and never enforces a fixed six-level hierarchy.
5. M15 versions institution-approved configuration artifacts.
6. M17 suggests existing approved nodes and values only. If none match, it reports no suitable configured value or requests human action.
7. Demo schemas are optional illustrative data and are never silently imposed on a tenant.

## 5. Required acceptance tests

| Test ID | Scenario | Expected result |
|---|---|---|
| DTE-SEM-001 | Blank tenant configuration | No chapter/topic/concept hierarchy is generated or imposed |
| DTE-SEM-002 | Institution imports its approved structure | DTE preserves the supplied structure |
| DTE-SEM-003 | Bulk file contains an unknown classification ID | Reject/quarantine or request authorized review; do not auto-create a node |
| DTE-SEM-004 | AI finds no matching configured value | Report no match; do not invent a category |
| DTE-SEM-005 | Tenant uses a flat classification model | Validation does not require parent-child levels |
| DTE-SEM-006 | Demo tenant is initialized | Sample structure remains optional and illustrative |
| DTE-SEM-007 | Institution requests a category change | DTE records the authorized decision; it does not make the academic decision |
| DTE-SEM-008 | Configuration version is published | Publication follows the institution's approval process |

## 6. Audit disposition

M01–M03 and M05–M18 show no material contradiction with the governing scope in the reviewed text, subject to the guardrails above. M04 requires wording correction. This is a documentation semantic review, not implementation-readiness approval. The previous cross-module architecture findings remain open.

## 7. Change history

| Version | Date | Change |
|---|---|---|
| 0.1.0 | 2026-11-06 | Initial semantic scope audit |
