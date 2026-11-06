# DTE-M09 — PYQ Provenance Manager Specification

- Document ID: PULSE-DTE-M09
- Version: 0.1.0
- Status: Draft — Pending product review
- Parent: docs/dte/DTE_MODULE_REGISTER.md
- Last updated: 2026-11-06

## Governing scope clarification — classification management software

DTE manages institution-defined academic classification and tagging structures. It does not design, prescribe, generate or impose chapter-wise syllabus bifurcation, curriculum structure or a universal academic hierarchy. Institutions define their own categories and terminology; DTE provides software to configure, record, map, search, validate, review, version, govern and report on those existing structures. Academic terms such as subject, chapter, topic and concept are examples of institution-managed data, not mandatory DTE levels or a curriculum-design function.

## 1. Purpose

PYQ Provenance Manager records the exam and source appearances of a question independently from the question's logical identity and content version. It must support one logical question having multiple provenance records and preserve the distinction between an original question, a reproduced appearance and an adapted variant.

## 2. Scope

In scope:
- Record prior-year-question (PYQ) appearance/provenance entries.
- Link appearances to logical questions and, where required, exact question versions.
- Capture exam, year, session/shift, paper, question number and source references.
- Support multiple appearances for one logical question.
- Represent adapted/translated/modified relationships without falsely asserting identity.
- Preserve source attribution and licensing metadata references.
- Search, filter and display provenance in Inventory and Tagging Studio.
- Version and audit provenance changes.

Out of scope:
- Owning exam catalogues as a global authoritative service unless separately assigned.
- Creating question content or reproducing copyrighted material.
- Computing exam weightage or difficulty.
- Student attempt history or exam analytics.

## 3. Core concepts

### 3.1 Logical question
The stable intellectual question identity. It may have one or more versions.

### 3.2 PYQ appearance
A record that identifies an occurrence of a question in a particular examination, year, paper, session/shift or question number. An appearance is not a new question identity by itself.

### 3.3 Source record
A reference to the origin of the content/evidence, such as an official paper, authorized source, licensed repository or internal archive.

### 3.4 Adaptation relationship
A typed relationship indicating that a question version is translated, modified, parameterized, reformatted or otherwise derived from another version. Adaptation must not be treated as exact identity without an explicit adjudication.

## 4. Candidate provenance attributes

- Provenance/appearance ID.
- Logical question ID.
- Exact question version ID, where applicable.
- Exam identifier and display name.
- Exam authority/organizer reference.
- Exam year.
- Session/shift/date.
- Paper, subject or section.
- Question number / booklet code / set code where available.
- Source document or source reference.
- Source URL or repository identifier, where policy permits.
- Page/section locator.
- Source type and verification status.
- Copyright/licensing/usage-rights reference.
- Original, reproduced or adapted relationship classification.
- Confidence/evidence note and verifier.
- Created/updated actor and timestamps.
- Revision and lifecycle status.

The final required field set depends on the supported exam catalogue and source availability.

## 5. Multiple appearances and adapted variants

- One logical question may have several PYQ appearance records.
- One appearance may reference a specific question version.
- Similar questions from different exams must not be merged solely because their wording resembles one another.
- Translated or parameter-changed versions should be represented as related/adapted variants where the relationship is established.
- A single question version may be associated with multiple source appearances only where evidence supports that claim.
- Provenance must retain its own source and verification status.
- Removing a provenance link must not delete the question or its source evidence.

## 6. Verification and evidence

Provenance status should distinguish at least:
- Unverified / user-entered.
- Evidence attached / awaiting verification.
- Verified.
- Rejected / disputed.
- Superseded or corrected.

The exact state model remains open. Verification should capture who checked the evidence, when, and against which source reference. AI extraction may suggest provenance fields but cannot mark them verified without an authorized review step.

## 7. UX requirements

- Search exam catalogue and existing provenance entries.
- Add an appearance from Tagging Studio or a provenance detail view.
- Display all known appearances for a question.
- Show evidence/source reference and verification state.
- Link to related/adapted question versions.
- Warn about possible conflicting exam/year/question-number combinations.
- Support correction without erasing previous provenance history.
- Respect tenant and source licensing permissions.

## 8. Validation

Validate:
- Exam/year and other structured identifiers against configured catalogues where available.
- Required source/evidence fields for verification.
- Valid question and version references.
- Duplicate appearance candidates.
- Consistency of exam/session/paper fields.
- Adaptation relationship endpoint validity.
- Tenant and licensing scope.
- Provenance lifecycle state.

A missing field must not be fabricated. Unknown values should remain explicitly unknown or unverified.

## 9. Security, copyright and audit

- Store references and permitted metadata; do not assume unrestricted rights to copy source papers.
- Respect source licenses and tenant access.
- Restrict source URLs and document previews according to policy.
- Audit creation, verification, correction, rejection and removal of provenance links.
- Preserve old provenance states for historical interpretation.
- Do not expose restricted source documents through public APIs.

## 10. Acceptance criteria

1. PYQ appearance is separate from logical question identity.
2. One question can have multiple exam/year/shift provenance records.
3. Adapted variants are represented by explicit relationships.
4. Provenance can reference an exact question version.
5. Source and verification evidence are retained and auditable.
6. AI suggestions cannot silently verify provenance.
7. Similar wording alone does not trigger automatic question merge.
8. Licensing and tenant visibility are enforced.
9. Provenance corrections preserve history.
10. No difficulty or exam-weightage calculations are implemented here.

## 11. Dependencies

- M02 Question Inventory.
- M05 Relationship Mapping Engine.
- M10 Review & Approval.
- M11 Version & History Manager.
- M13 Validation & Quality Engine.
- Exam catalogue/source reference contract.

## 12. Open decisions

| ID | Question | Status |
|---|---|---|
| DTE-M09-OD-001 | Which exam catalogues are seeded and who governs them? | Open |
| DTE-M09-OD-002 | Which provenance fields are mandatory for an unverified entry versus verified record? | Open |
| DTE-M09-OD-003 | What adaptation categories and relationship semantics are required? | Open |
| DTE-M09-OD-004 | Which source document types and licensing metadata are supported? | Open |
| DTE-M09-OD-005 | Who may verify or dispute provenance? | Open |
| DTE-M09-OD-006 | Can one appearance map to multiple logical questions or versions? Under what evidence standard? | Open |

## 13. Change history

| Version | Date | Status | Change |
|---|---|---|---|
| 0.1.0 | 2026-11-06 | Draft | Initial PYQ provenance specification |

## 14. Approval

- Product owner: Pending
- Technical review: Pending
- Implementation authorization: Not granted