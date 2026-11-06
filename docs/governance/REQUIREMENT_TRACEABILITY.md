# PULSE Requirement Traceability Matrix

Status: Initial baseline; coverage incomplete pending source/specification backfill.

| Requirement ID | Requirement | Source | Module | Design / implementation | Test evidence | Status |
|---|---|---|---|---|---|---|
| PULSE-REQ-SYA-001 | System A operates without QBMS/DTE tags; local numbered slots are sufficient | System A architecture and tracking specification | System A | SYSTEM_A_DATABASE_ARCHITECTURE.md; Abhyas Matrix slot model | Domain/UI tests; full acceptance pending | PARTIAL |
| PULSE-REQ-SYA-002 | Preserve six operational status values and meanings | Uploaded Student Tracking source and project decisions | System A | src/domain.ts, src/App.tsx | domain.test.ts | IMPLEMENTED_IN_PROTOTYPE |
| PULSE-REQ-SYA-003 | Skipped and Unattempted are not counted as attempted | Academic metric clarification | System A | isAttemptedStatus, summarizeStatuses | domain.test.ts | IMPLEMENTED_IN_PROTOTYPE |
| PULSE-REQ-SYA-004 | Student report must not imply teacher verification | System A architecture baseline | System A | StudentReportEvent, VerificationDecision | domain.test.ts | DOMAIN_ONLY |
| PULSE-REQ-SYA-005 | Verification references exact report; historical evidence is preserved | System A architecture baseline | System A | projectEvidence; workflow-domain.ts | domain.test.ts; workflow-domain.test.ts | DOMAIN_ONLY |\n| PULSE-REQ-SYA-006 | Keep work progress, answer evaluation, doubt, verification and correction as independent dimensions; calculate reported, verified and accuracy metrics separately | System A Master Completion Specification §§5–8 | System A | workflow-domain.ts | workflow-domain.test.ts | DOMAIN_ONLY |\n| PULSE-REQ-SYA-007 | Enforce explicit doubt and correction lifecycle transitions with actor-specific actions and reasons | System A Master Completion Specification §§7.E–7.G | System A | workflow-transitions.ts | workflow-transitions.test.ts | DOMAIN_ONLY |
| PULSE-GOV-001 | Every meaningful event has source, rationale, impact, evidence and follow-up | Governance discussion | Platform-wide | Event Governance Protocol | Governance CI check pending | PROPOSED |

Rules: assign stable IDs and never reuse them. Preserve exact source wording or link the source. Link design, code, tests and release evidence. Status values: NOT_IMPLEMENTED, PARTIAL, IMPLEMENTED_IN_PROTOTYPE, DOMAIN_ONLY, VALIDATED, DEFERRED, REJECTED. A passing unit test is not proof of end-to-end or production readiness. Changed requirements require a new version/superseding record. Backfill remaining requirements from uploaded specifications; this starter matrix is not exhaustive.
