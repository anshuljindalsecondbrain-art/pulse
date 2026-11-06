# DTE Decision Paper — Logical Question Identity and Content Revision Policy

- Document ID: PULSE-DTE-DEC-002
- Version: 0.1.0
- Status: Draft — Proposed policy for product review
- Date: 2026-11-06
- Repository: anshuljindalsecondbrain-art/pulse
- Related decision: docs/dte/decisions/DTE_QUESTION_CLASSIFICATION_ATTACHMENT_POLICY.md
- Related modules: M02 Question Inventory, M03 Tagging Studio, M05 Relationship Mapping Engine, M06 Archetype Management, M09 PYQ Provenance Manager, M10 Review & Approval, M11 Version & History Manager, M12 Bulk Tagging Manager, M13 Validation & Quality Engine, M17 AI Assistance Interface, M18 External Engine Integration

## 1. Decision proposed

Logical question identity changes must be decided through an authorized human-governed process.

- A content edit that preserves the identity of the question creates a new question version under the same logical question.
- A change that creates a materially different question may require a new logical question identity, with an explicit relationship to the prior question where appropriate.
- DTE may provide evidence, comparison tools, duplicate candidates and AI recommendations.
- DTE must not autonomously merge two logical questions, split one logical question into multiple identities, or declare a materially changed question to be a new identity.
- The final authority, roles and separation-of-duties rules must be defined in the shared DTE permissions and governance documents.

This is a proposed policy, not an approved implementation rule.

## 2. Definitions

### 2.1 Logical question identity

A stable identifier for a question that remains the same question through content revisions that do not materially change its identity.

### 2.2 Question version

An immutable or historically reconstructable content revision associated with one logical question. It identifies the exact content state, including relevant stem, options, answer, solution, media, language and other versioned content fields.

### 2.3 New logical question

A distinct question identity created when an authorized decision determines that the changed or related content is no longer the same logical question under the institution's identity policy.

### 2.4 Related question

A separate logical question connected through an explicit, typed relationship such as adapted-from, derived-from, parameterized-from, translated-variant-of, duplicate-candidate-of or related-to. The final relationship catalogue and labels are institution-governed where they represent academic/content meaning.

## 3. Proposed decision authority

1. The content/question owner or authorized academic content authority initiates or supplies the identity-change request.
2. A user with the explicitly granted question-identity adjudication permission makes the identity decision.
3. Where separation of duties is required, the initiator cannot approve their own identity change.
4. DTE records the decision, rationale, evidence, actor, timestamp and affected question/version references.
5. AI, duplicate detection and automated comparison are advisory only.
6. Bulk imports and automated pipelines may create candidate records or quarantine ambiguous records, but may not autonomously merge or split established logical identities.
7. The precise role names, delegation, escalation and self-approval rules remain open pending the shared roles/permissions matrix.

## 4. Proposed classification of content changes

The table provides decision guidance, not automatic rules. The authorized reviewer must consider the actual question content and institution policy.

| Change scenario | Candidate treatment | Required review consideration |
|---|---|---|
| Typographical, punctuation or spelling correction | New version, same logical question | Confirm meaning, data and answer are unchanged |
| Formatting, layout or typesetting change | New version, same logical question | Confirm no mathematical/semantic change |
| Image resolution improvement with identical information | New version, same logical question | Confirm the visual information is equivalent |
| Diagram redraw that preserves all relevant information | New version, same logical question | Confirm geometry, labels, scale and interpretation are unchanged |
| Option order change | New version, same logical question | Confirm option content and correct answer mapping remain valid |
| Correction of an erroneous answer or solution | New version; same logical identity is a candidate | Determine whether the question itself changed or only its answer/solution record was corrected |
| Numerical parameter change | Review required; may be same identity or new identity | Determine whether the mathematical structure, solution path, concept or intended task materially changes |
| Change in given data that changes the required reasoning | New logical question is a candidate | Record why the new task is materially distinct |
| Stem rewritten without changing the task | New version, same logical question is a candidate | Confirm semantic equivalence |
| Stem changed so that the question asks a different task | New logical question is a candidate | Record the identity distinction and relationship, if applicable |
| New diagram or graph changes the problem constraints | New logical question is a candidate | Review whether the underlying task remains the same |
| Translation | New version under same identity only if equivalence is confirmed | Record language and equivalence decision; otherwise use separate identity and relationship |
| Adaptation for another exam or audience | Usually review as a possible new identity | Do not assume exam context alone creates or preserves identity |
| Same question reproduced in another book, test or worksheet | Same logical question; new placement reference | Placement does not create a new logical question |
| Same question found in another PYQ source/year | Same logical question only if identity is established; add provenance appearance | Similarity alone is insufficient evidence of identity |
| Two existing records found to be exact duplicates | Merge/redirect only after authorized adjudication | Preserve both source histories, references and mapping/evidence consequences |
| Two similar but non-identical questions | Keep separate unless adjudicated otherwise | A similarity score is not an identity decision |

## 5. Evidence available to support adjudication

The identity review interface should be capable of showing, where available and permitted:

- Side-by-side content comparison of candidate versions.
- Stem, options, answer and solution differences.
- Mathematical expression and numerical value differences.
- Diagram/image comparison and associated metadata.
- Language and translation relationships.
- Existing logical question and version histories.
- Source and PYQ provenance records.
- Existing classification mappings and their attachment scopes.
- Archetype and related-question relationships.
- Placement references and downstream usage counts.
- Student Tracking references or other consumer dependencies, subject to access controls.
- Duplicate-detection explanation and model output, if available.

The absence of one evidence type must not be treated as proof of identity or non-identity.

## 6. Required outcomes

An adjudication should result in one of the following explicit outcomes:

1. **Same logical question — create new version.**
2. **New logical question — create a new identity and optionally link it to the prior question.**
3. **Existing identity — link as an additional source/provenance appearance**, where the evidence supports the same question.
4. **Related but distinct questions — retain separate identities and create an approved typed relationship.**
5. **Insufficient evidence — leave unresolved and route for further review.**
6. **Confirmed duplicate records — initiate a separately governed merge/redirect process**, preserving references and history.

The exact status names and transition rules belong in the normative workflow/state-machine specification.

## 7. Identity changes and downstream integrity

Before an identity decision is published, the system must identify affected references, including where applicable:

- Question versions.
- Classification mappings at logical-question and version scope.
- Archetype links.
- PYQ provenance appearances.
- Content placements owned by external content systems.
- Review and validation history.
- DRE evaluation pointers.
- Student Tracking evidence and historical attempts.
- External consumer references and cached projections.

DTE must not silently rewrite external records. Affected consumers receive governed change events or reconciliation instructions through the integration contract.

Student Tracking evidence must continue to identify the question/version/placement that was actually presented at the time of the event. Historical evidence must not be reassigned to a newly created logical identity merely because a later adjudication changes the current identity relationship.

DRE remains the owner of difficulty calculations and evaluation history. DTE may expose identity/version relationship changes so DRE can decide whether a prior evaluation remains applicable; DTE does not decide or recalculate difficulty.

## 8. Duplicate merge and identity split safeguards

### 8.1 Merge

A merge is not a destructive delete. The eventual design must specify:
- Canonical surviving logical question ID.
- Retired/redirected identity and reason.
- Exact source records and versions considered.
- Mapping/provenance/archetype relationship reconciliation.
- Placement and external consumer reference handling.
- Student evidence preservation.
- Reversibility or compensating correction procedure.
- Approval and audit trail.

### 8.2 Split

A split must specify:
- New logical question IDs.
- Which existing versions belong to each identity.
- Which mappings and relationships are retained, reviewed or reassigned.
- Provenance and placement reference implications.
- External consumer notifications/reconciliation.
- Historical identity interpretation and audit history.

No merge or split may cascade-delete question history, source evidence or student evidence.

## 9. AI and duplicate detection boundary

AI and automated matching may:
- Identify likely exact duplicates and near-duplicates.
- Compare content versions and highlight changed elements.
- Suggest candidate outcomes with evidence and confidence.
- Identify downstream references that may be affected.
- Route ambiguous cases to authorized reviewers.

AI and automated matching must not:
- Make final logical identity decisions.
- Merge or split logical question records.
- Delete or rewrite historical references.
- Automatically transfer classification mappings between identities.
- Treat a high similarity score as proof of identity.
- Publish identity changes without required human approval.

Every accepted AI recommendation must record the model/prompt version and the human decision. The AI output itself remains distinguishable from the human adjudication.

## 10. Audit and history requirements

For each identity adjudication, retain:
- Decision ID.
- Outcome.
- Existing and resulting logical question IDs.
- Relevant question version IDs.
- Evidence references and comparison context.
- Decision rationale.
- Initiator and adjudicator.
- Approval/review events.
- Timestamp.
- Applicable policy/configuration version.
- Downstream impact assessment.
- Events emitted and consumer acknowledgements/reconciliation state.

Corrections to an adjudication must create a new auditable decision/revision. Prior decisions must remain reconstructable.

## 11. Open decisions

| Decision ID | Question | Status |
|---|---|---|
| DTE-DEC-010 | Which named role(s) may adjudicate logical question identity? | Open |
| DTE-DEC-011 | Is independent second-person approval required for merge/split decisions? | Open |
| DTE-DEC-012 | Which content fields are versioned and compared as part of identity review? | Open |
| DTE-DEC-013 | Which relationship types are required for adapted, translated, parameterized and duplicate questions? | Open |
| DTE-DEC-014 | What are the exact merge/redirect and split workflows? | Open |
| DTE-DEC-015 | What downstream impact threshold requires blocking publication until reconciliation? | Open |
| DTE-DEC-016 | How should identity adjudication interact with licensing and ownership boundaries? | Open |

## 12. Required follow-on documentation

Reconcile this policy into:
- M02 — show logical identity, versions and identity-review state distinctly.
- M03 — prevent tagging against an ambiguous or superseded identity without explicit workflow permission.
- M05 — support governed related-question and identity relationship records.
- M06 — preserve archetype associations and review their impact after identity changes.
- M09 — preserve provenance appearances and exact version references.
- M10 — define identity adjudication workflow, permissions and approvals.
- M11 — preserve immutable identity decisions and reconstruct historical states.
- M12 — quarantine ambiguous bulk-import identity matches for review.
- M13 — validate identity/version/reference consistency.
- M17 — keep AI duplicate and identity recommendations advisory.
- M18 — define identity-change events and consumer reconciliation contracts.

The canonical data model/ERD must represent stable logical identity separately from version and placement, and must preserve redirects/relationships without destructive cascades.

## 13. Governance and implementation gate

- This document is Draft and requires product and technical review.
- The policy is proposed, not approved.
- No schema, migration, merge/split automation or production change is authorized.
- Approval must follow the documented DTE change-control and versioning process.

## 14. Change history

| Version | Date | Status | Change |
|---|---|---|---|
| 0.1.0 | 2026-11-06 | Draft | Proposed human-governed logical question identity and content revision policy |

## 15. Approval

- Product owner: Pending
- Technical review: Pending
- Implementation authorization: Not granted
