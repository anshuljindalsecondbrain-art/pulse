# AI Mentor and Intelligence Audit

## Evidence classification

The audited repository provides architectural references and product requirements for AI Mentor, explainable diagnostics, student journey, adaptive intervention and learning models. No production AI Mentor application, model orchestration service, vector index, prompt registry, tool permission model, evaluation pipeline or intervention persistence was verified.

## Required architecture

- Treat AI as an advisory/decision-support layer, not a source of truth.
- Consume verified academic evidence and versioned question/DTE mappings.
- Preserve provenance: evidence IDs, source versions, model/version, prompt/version, retrieved context and policy.
- Distinguish observed facts, derived metrics, model inference and human decisions.
- Require human approval for consequential interventions, parent communications and academic overrides.
- Use tenant-scoped retrieval and test for cross-tenant leakage.
- Add prompt injection defenses for question content, uploaded documents and retrieved records.
- Add evaluation datasets for accuracy, calibration, bias, hallucination, retrieval quality and action safety.
- Maintain immutable audit records for recommendations, approval/rejection and resulting action.

## Intelligence dependencies

Concept-level diagnostics require stable question identity/version and DTE mapping history. Until mappings exist, the platform can still report question-level operational outcomes but must not fabricate concept weakness. DRE difficulty values must come from the separate engine and its versioned evaluation contract.

## Release verdict

AI Mentor and advanced intelligence should be classified as **specified/planned, not implemented** until a running service, governed data access, evaluation evidence and human approval gates are demonstrated.
