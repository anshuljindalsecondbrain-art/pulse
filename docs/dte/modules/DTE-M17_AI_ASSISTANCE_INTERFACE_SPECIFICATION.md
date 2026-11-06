# DTE-M17 — AI Assistance Interface Specification

- Document ID: PULSE-DTE-M17
- Version: 0.1.0
- Status: Draft — Pending product review
- Parent: docs/dte/DTE_MODULE_REGISTER.md
- Last updated: 2026-11-06

## Governing scope clarification — classification management software

DTE manages institution-defined academic classification and tagging structures. It does not design, prescribe, generate or impose chapter-wise syllabus bifurcation, curriculum structure or a universal academic hierarchy. Institutions define their own categories and terminology; DTE provides software to configure, record, map, search, validate, review, version, govern and report on those existing structures. Academic terms such as subject, chapter, topic and concept are examples of institution-managed data, not mandatory DTE levels or a curriculum-design function.

## 1. Purpose

AI Assistance Interface provides machine-generated candidate classifications and metadata suggestions to assist authorized DTE users. It is an advisory layer: suggestions must be explainable, traceable and subject to configured human review. AI must not silently publish or overwrite governed mappings.

## 2. Scope

In scope:
- Generate candidate classification-node suggestions.
- Suggest question type, archetype links, pedagogical metadata and provenance candidates where enabled.
- Provide rationale/evidence and confidence indicators.
- Record model, prompt, configuration and taxonomy/schema versions.
- Allow authorized users to accept, modify or reject suggestions.
- Capture feedback and quality outcomes.
- Support batch suggestions through controlled background jobs.
- Monitor suggestion quality and failure modes.

Out of scope:
- Autonomous publication of mappings.
- Creating or changing schema definitions without human approval.
- Difficulty scoring or DRE model execution.
- Student profiling or emotion inference.
- Question-content generation unless separately specified outside this module.
- Replacing human academic review.

## 3. Suggestion record

Candidate fields:
- Suggestion ID.
- Tenant/scope.
- Question ID and exact question-version ID.
- Target field/relationship type.
- Suggested canonical node/type/archetype/metadata/provenance ID.
- Suggested value where no canonical entity exists.
- Rationale and supporting evidence references.
- Confidence score and calibration/version context.
- Model/provider identifier and model version.
- Prompt/template version.
- Retrieval/index/configuration version where applicable.
- Schema and taxonomy version used.
- Generation timestamp.
- Review/decision status.
- Human decision, actor, timestamp and reason.
- Resulting mapping revision if accepted.

Do not store only the final accepted value; preserve suggestion provenance for explainability and evaluation.

## 4. Suggestion workflow

1. Authorized user requests suggestions or an approved workflow triggers generation.
2. System verifies question, version, tenant and schema context.
3. AI generates candidate suggestions within the allowed schema.
4. Deterministic validation checks candidate IDs and relationship constraints.
5. Suggestions are presented with rationale and confidence context.
6. Human accepts, edits or rejects each suggestion or an explicitly supported group.
7. Accepted changes enter normal save/review/publication workflow.
8. Decision and model/prompt context are audited.

Acceptance of an AI suggestion is not automatically equivalent to approval or publication.

## 5. Explainability and evidence

- Explain why a node or metadata value was suggested.
- Reference relevant question text regions, source records or approved examples where available.
- Distinguish retrieved evidence from model-generated rationale.
- Show confidence meaning and calibration limitations.
- Avoid presenting unsupported precision.
- Allow users to flag incorrect, ambiguous or unsafe suggestions.

## 6. Quality and evaluation

Define evaluation datasets and measures for:
- Precision/recall by classification group.
- Top-k suggestion usefulness.
- Calibration and confidence reliability.
- Acceptance/edit/rejection rates.
- Error patterns by subject/domain, tenant and question type.
- Drift across model, prompt and schema versions.
- Performance on multilingual and mathematical content.
- Regression testing before model/prompt release.

No numeric accuracy threshold is set by this draft. Thresholds must be approved per suggestion category and risk.

## 7. Governance and safety

- Human approval remains mandatory for publishing AI-generated mappings.
- Store model and prompt versions.
- Version retrieval sources and schema context.
- Prevent AI from inventing taxonomy IDs; validate all identifiers against the active schema.
- Apply tenant isolation to prompts, retrieval and logs.
- Minimize sensitive content in external model requests.
- Define provider retention/training policies before enabling external calls.
- Log failures, retries and human decisions.
- Provide a disable/rollback control for a model or prompt version.
- AI suggestions must not be used to infer student emotion, protected attributes or unrelated personal characteristics.

## 8. UX requirements

- Clearly label AI-generated suggestions.
- Show rationale and confidence context.
- Distinguish suggested, accepted, edited, rejected and published states.
- Allow per-suggestion decisions where appropriate.
- Provide bulk acceptance only for explicitly low-risk categories and only after policy approval.
- Keep manual tagging available if AI is unavailable.
- Display model/prompt version in audit details, not necessarily as prominent operational clutter.

## 9. Acceptance criteria

1. AI suggestions are always distinguishable from human-approved mappings.
2. Every suggestion is tied to exact question/version and schema context.
3. Model, prompt and retrieval/configuration versions are recorded.
4. Suggested IDs are validated against the active schema.
5. Human acceptance is required before a suggestion enters normal mapping workflow.
6. AI acceptance does not bypass review/publication rules.
7. Rationale/evidence and confidence limitations are visible.
8. Evaluation and regression results are versioned.
9. Tenant data is isolated and provider privacy policy is reviewed.
10. No DRE difficulty score or student emotion inference is implemented.

## 10. Dependencies

- M03 Tagging Studio.
- M04 Classification Configuration Studio.
- M05 Relationship Mapping Engine.
- M06 Archetype Management.
- M07 Question Type Manager.
- M08 Pedagogical Metadata Manager.
- M09 PYQ Provenance Manager.
- M11 Version & History Manager.
- M13 Validation & Quality Engine.
- AI model gateway, retrieval and evaluation infrastructure.

## 11. Open decisions

| ID | Question | Status |
|---|---|---|
| DTE-M17-OD-001 | Which model providers/models are approved? | Open |
| DTE-M17-OD-002 | Which tagging categories are AI-assisted in the first release? | Open |
| DTE-M17-OD-003 | What evidence sources can be retrieved and shown to taggers? | Open |
| DTE-M17-OD-004 | What confidence calibration and category-specific thresholds are required? | Open |
| DTE-M17-OD-005 | Is any bulk acceptance allowed, and under what controls? | Open |
| DTE-M17-OD-006 | What data may leave the tenant boundary for model inference? | Open |
| DTE-M17-OD-007 | What evaluation datasets and human adjudication process are authoritative? | Open |

## 12. Change history

| Version | Date | Status | Change |
|---|---|---|---|
| 0.1.0 | 2026-11-06 | Draft | Initial AI assistance interface specification |

## 13. Approval

- Product owner: Pending
- AI governance review: Pending
- Implementation authorization: Not granted