# DTE-M13 — Validation & Quality Engine Specification

- Document ID: PULSE-DTE-M13
- Version: 0.2.0
- Status: Draft — Phase 1 rewrite; pending product, academic and technical review
- Phase: Current — offline tagging framework and operating management
- Governing references:
  - `docs/dte/DTE_PRODUCT_SCOPE_AND_PHASE_ROADMAP.md`
  - `docs/dte/DTE_MODULE_PHASE_DISPOSITION.md`
  - `docs/dte/current-phase/DTE-P1_FRAMEWORK_CONFIGURATION_SPECIFICATION.md`
  - `docs/dte/current-phase/DTE-P1_OFFLINE_TAGGING_OPERATING_MODEL.md`
  - `docs/dte/current-phase/DTE-P1_REQUIREMENTS_AND_ACCEPTANCE_BASELINE.md`
  - `docs/dte/modules/DTE-M04_CLASSIFICATION_CONFIGURATION_STUDIO_SPECIFICATION.md`
  - `docs/dte/modules/DTE-M10_REVIEW_APPROVAL_SPECIFICATION.md`
  - `docs/dte/modules/DTE-M11_VERSION_HISTORY_MANAGER_SPECIFICATION.md`
- Last updated: 2026-11-06
- Implementation authorization: Not granted

## 1. Purpose

M13 evaluates whether Phase 1 DTE framework configurations and confirmed offline-process artifacts satisfy explicit, institution-approved structural and operational rules. It provides deterministic, explainable findings to configuration and approved offline workflows.

M13 determines whether defined rules pass, fail or cannot be evaluated. It does not decide academic correctness. Quality reporting, if included, summarizes rule evidence and must not replace it with an opaque score.

## 2. Governing boundaries

1. Institution-defined academic meaning remains authoritative. M13 checks the software representation against approved requirements; it does not judge the academic merits of the classification.
2. Rules derive only from the configured framework and explicit institution-approved constraints. No universal subject/chapter/topic/concept hierarchy, depth or tag count may be imposed.
3. Validation is not approval. M10 owns human review and decision workflow.
4. M04 owns framework configuration. M13 validates; it does not create or prescribe framework definitions.
5. M11 owns version/revision/snapshot/history semantics. M13 identifies the exact evaluated inputs and rule/profile versions.
6. Unknown, deprecated, malformed or ambiguous values are reported, never silently replaced or auto-created.
7. An offline question locator is an external reference, not a question record.

## 3. Phase 1 scope

### 3.1 In scope

- Structural validation of framework drafts and revisions.
- Stable identifier presence, uniqueness and reference integrity.
- Consistency of configured groups, fields, values and explicitly defined relationships.
- Supported field type, cardinality and required/optional/conditional rule checks.
- Validation of institution-configured constraints.
- Lifecycle checks for inactive, deprecated or retired configuration elements where policy prohibits use.
- Template/instruction consistency against the pinned framework version, if templates are managed by DTE.
- Work-package metadata and pinned-version checks, if work-package management is confirmed.
- Structural validation of completed offline sheets/files only if DTE intake is approved.
- Actionable findings with severity, location, explanation and remediation.
- Versioned rules, identifiable result snapshots and revalidation controls.
- Descriptive validation/quality reporting if explicitly approved.

### 3.2 Conditional — requires product-owner confirmation

Do not assume these features are implementation scope:
- Intake of completed offline sheets.
- File parsing and row/column validation.
- Quarantine and partial-file recovery.
- Completeness checks over offline tagging results.
- Quality dashboards and operational threshold alerts.
- Scheduled/background validation jobs.

### 3.3 Explicitly out of scope

M13 MUST NOT implement in Phase 1:
- Question upload, OCR, extraction, parsing or question-content storage.
- Digital question inventory or question-to-tag mapping validation.
- Question identity, version or placement validation.
- Question type, archetype, pedagogical metadata or PYQ provenance validation as question records.
- Digital bulk-tagging validation.
- AI/probabilistic academic tagging or AI validation decisions.
- Student performance, mastery, attendance or assignment validation.
- Test paper validation, delivery or scoring.
- Difficulty scoring, exam multipliers or DRE calculations.
- Human approval/rejection decisions.
- Academic taxonomy design or correction.

These capabilities require separate future-phase discovery and approval.

## 4. Validation domains

| Domain | Phase 1 responsibility | Boundary |
|---|---|---|
| Framework structure | Validate configured groups, fields, values and supported structures | Does not judge academic suitability |
| Identifier integrity | Check stable identifiers and references | Does not invent academic identifiers |
| Field configuration | Check supported data type, cardinality and rule consistency | Does not decide which fields are mandatory |
| Controlled values | Check IDs, labels, aliases and lifecycle references | Does not create missing academic values |
| Configured relationships | Check endpoints and explicitly configured constraints | Does not infer unconfigured relationships |
| Version compatibility | Check artifact references against intended framework/template version | M11 owns version semantics |
| Template consistency | Check template against pinned framework version | Only if DTE manages templates |
| Work-package metadata | Check identifiers and pinned versions | Only if DTE manages packages |
| Offline submission structure | Check file/row structure and approved values | Only if intake is approved |
| Completeness | Check explicit institution-approved profile requirements | No universal hierarchy or tag count |

## 5. Rule model and governance

Each rule must define:
- Stable rule ID and rule version.
- Name and plain-language description.
- Applicable artifact type and institution/tenant scope.
- Inputs evaluated.
- Deterministic evaluation definition or versioned implementation reference.
- Severity: Blocking Error, Warning or Information.
- Applicable workflow stage.
- Effective status/date.
- Remediation guidance.
- Owner and change history.
- Whether it is a technical integrity rule or institution-approved policy rule.

Technical integrity rules require product/architecture governance. Academic or operational constraints must come from the institution's authorized authority. A rule must not make an academic category mandatory unless the institution has approved that requirement. Rule-authoring permissions and approval are open decisions.

Rules should be deterministic for the same input snapshot and rule version. Any future probabilistic/AI signal must be labelled advisory and must not masquerade as deterministic validation.

## 6. Severity and findings

| Severity | Meaning |
|---|---|
| Blocking Error | Defined technical or approved policy condition is violated; the current action cannot proceed |
| Warning | Potential issue or non-blocking condition requiring attention |
| Information | Contextual result that does not indicate failure |

Each finding should identify rule ID/version, severity, result, artifact and exact revision, field/relationship/row location where available, expected and observed condition, explanation, remediation and validation run.

“Failed” and “not evaluated” must be distinct. Missing evidence, unsupported input or an execution error must never be represented as a pass.

## 7. Completeness profiles

Completeness is optional, contextual and institution-governed. If required in Phase 1, a profile may define:
- Stable profile ID/version and institution scope.
- Applicable framework/version.
- Explicitly approved required groups, fields or relationships.
- Conditional requirements, eligibility and exclusions.
- Applicable workflow stage and effective dates.
- Profile owner and approval evidence.

No default six-level taxonomy or universal tag count may be hardcoded. A profile cannot add categories or fields to the framework. Results must disclose the profile version and each unmet requirement. No profile is to be seeded with assumed academic requirements.

## 8. Validation run and result model

Each run should identify:
- Run ID and institution scope.
- Artifact type and stable artifact ID.
- Exact revision/snapshot ID.
- Framework/template version where relevant.
- Rule-set and individual rule versions.
- Completeness profile/version, if used.
- Initiator/source (interactive, approved file intake, scheduled or API).
- Start/end timestamps and execution status.
- Findings and severity counts.
- Current/stale status.
- Correlation/idempotency reference where relevant.

A result is evidence about the exact input and rule versions evaluated. It must not be detached from that context or treated as a mutable property of an artifact.

## 9. Workflow gates

Candidate gates, subject to approval:

| Action | Candidate validation requirement |
|---|---|
| Save framework draft | Basic structural integrity; warnings may remain |
| Submit framework for academic review | Required structural rules pass and blocking errors are resolved |
| Academic approval | Current result for exact submitted revision; human decision still required |
| Activate framework | Activation checks pass against exact approved revision |
| Generate/issue template | Template matches selected approved framework version |
| Issue work package | Required metadata and framework/template references are valid |
| Accept completed offline sheet | File/row rules pass or submission is quarantined with actionable findings; only if intake is approved |

M13 reports technical outcomes. It never automatically approves or activates a framework or work package. M10 owns human decisions; framework lifecycle authority remains separately governed.

## 10. Revalidation and stale results

Revalidation may be required when:
- Evaluated artifact revision changes.
- Referenced framework/template version changes.
- Relevant rule or completeness profile version changes.
- A configured value/relationship becomes deprecated or retired.
- A supported template/submission is corrected or transformed.
- An approved migration changes configuration references.

A result is stale when its input revision or applicable rule/profile context no longer matches the target action's required context. Consumers must not use stale results to satisfy a gate requiring current validation. Any freshness window is a workflow-policy decision, not a hardcoded assumption.

## 11. Failure and exception handling

- Execution failure is distinct from rule failure.
- Partial validation identifies rules run and not run.
- Timeout/service failure is never a pass.
- Retrying a run preserves previous result evidence.
- File parsing failure, if intake is approved, retains the submission reference and gives actionable diagnostics.
- Unknown values are surfaced for authorized human resolution; they are not auto-mapped.
- Any permitted waiver requires explicit authority, reason, scope, expiry where applicable and audit evidence.

## 12. Quality reporting

If Phase 1 reporting is confirmed, possible descriptive indicators include:
- Framework configurations passing/failing named structural rules.
- Blocking errors and warnings by rule.
- Unresolved configuration defects.
- Offline submission outcomes, if intake is approved.
- Completeness against a named approved profile.
- Stale validation result counts.
- Repeated error categories that may indicate unclear instructions.

Every aggregate metric must disclose formula, numerator/denominator, eligible population, exclusions, time window, rule/profile version and source/refresh timing. M13 must not create an unexplained composite score or imply that structural validity equals academic quality. Broader productivity/coverage analytics belong to the approved reporting owner.

## 13. Security, performance and audit

1. Enforce tenant/resource authorization for rules, runs, findings and reports.
2. Do not expose restricted field values or source content in findings.
3. Record initiator and exact evaluation context.
4. Protect approved rules/profiles from unauthorized change.
5. Version and audit rule/profile changes.
6. Large file/batch validation, if approved, may run asynchronously with explicit progress and failure states.
7. Cache only when keys include artifact, revision, framework, rule and profile context.
8. Client parameters cannot override server-side outcomes.
9. Retain validation history under the approved retention policy.
10. Define file/row/resource limits and performance targets before production; none are assumed here.

## 14. Dependencies and ownership

- **M04:** owns framework definitions and constraints; M13 validates structural consistency.
- **M10:** owns human review decisions; M13 supplies evidence and never approves.
- **M11:** owns version/revision/snapshot/history semantics; M13 references exact versions.
- **Phase 1 operating workflow:** defines offline process; M13 validates only approved software-managed portions.
- **Identity/authorization:** supplies actor and scope controls.
- **M01:** may present authorized summaries but does not own rule outcomes.
- **M14 or shared reporting:** may aggregate approved quality facts; metric ownership needs confirmation.
- **Student Tracking:** remains independent; missing DTE tags/validation must not block student workflows.

M05–M09, M12 digital bulk tagging, question inventory, digital mapping, AI assistance, Q-GENOME and DRE are not Phase 1 implementation dependencies.

## 15. Acceptance criteria

| ID | Acceptance criterion |
|---|---|
| M13-AC-001 | Each executed rule has an identifiable ID/version and scope. |
| M13-AC-002 | Findings distinguish Blocking Error, Warning and Information. |
| M13-AC-003 | Each result identifies exact artifact revision and applicable framework/template/rule/profile versions. |
| M13-AC-004 | No fixed taxonomy depth, chapter field or universal tag count is hardcoded. |
| M13-AC-005 | Unknown/deprecated values are reported, never silently replaced or created. |
| M13-AC-006 | Failed/not-evaluated states are never represented as pass. |
| M13-AC-007 | Completeness is evaluated only against an explicit approved profile. |
| M13-AC-008 | Stale results cannot satisfy a gate requiring current validation. |
| M13-AC-009 | Technical validation never automatically approves or activates a framework. |
| M13-AC-010 | Rule/profile changes are versioned and auditable. |
| M13-AC-011 | Retry preserves prior validation evidence. |
| M13-AC-012 | Tenant/resource permissions apply to rules, results, findings and exports. |
| M13-AC-013 | Phase 1 has no question-content ingestion or digital question-record validation path. |
| M13-AC-014 | Student Tracking and DRE responsibilities are not duplicated. |
| M13-AC-015 | Aggregate metrics disclose formulas, denominators and rule/profile context. |

## 16. Open decisions

| ID | Decision required | Owner | Status |
|---|---|---|---|
| DTE-M13-OD-001 | Which framework structural rules are mandatory for initial Phase 1 release? | Product + Architecture | Open |
| DTE-M13-OD-002 | Who may create/change technical rules and institution-approved profiles? | Product + Academic Authority | Open |
| DTE-M13-OD-003 | Are completeness profiles required; if yes, who supplies them? | Product + Academic Authority | Open |
| DTE-M13-OD-004 | Is completed offline sheet intake into DTE required? | Product + Operations | Open |
| DTE-M13-OD-005 | If intake is required, which formats, row limits and error-handling rules apply? | Product + Engineering | Open |
| DTE-M13-OD-006 | What are the exact save/submit/approve/activate gates? | Product + Academic Authority | Open |
| DTE-M13-OD-007 | Which rule/profile changes require revalidation and what freshness policy applies? | Product + Architecture | Open |
| DTE-M13-OD-008 | Are waivers permitted; who authorizes them and under what controls? | Product + Academic Authority | Open |
| DTE-M13-OD-009 | Which quality indicators are required and who owns their definitions? | Product Owner | Open |
| DTE-M13-OD-010 | What performance, concurrency and retention targets apply? | Architecture + QA + Security | Open |
| DTE-M13-OD-011 | Is asynchronous or scheduled validation required in Phase 1? | Product + Engineering | Open |

## 17. Implementation readiness

Before implementation:
1. Confirm the Phase 1 artifacts M13 validates.
2. Resolve whether completed offline sheets are ingested into DTE.
3. Obtain institution-approved constraints and any completeness profiles.
4. Define rule ownership, severity and change approval.
5. Ratify gates with M04/M10/M11 owners.
6. Define stale-result and revalidation semantics.
7. Approve waiver, security, retention and performance controls.
8. Trace accepted rules to UX, data, authorization and executable tests.
9. Obtain explicit product, academic, architecture, operations, security and QA approval.

This draft authorizes no schema, API, UI, validation job, automation or production change.

## 18. Change history

| Version | Date | Status | Change |
|---|---|---|---|
| 0.1.0 | 2026-11-06 | Superseded Draft | Initial broad specification included digital question mapping, metadata, provenance, bulk and publication validation |
| 0.2.0 | 2026-11-06 | Draft | Rewritten for Phase 1 framework/offline-process validation; separated technical validation from academic approval; deferred digital question and student/difficulty validation |

## 19. Approval

- Product owner: Pending
- Academic authority: Pending
- Operations owner: Pending
- Architecture: Pending
- Security: Pending
- QA: Pending
- Implementation authorization: Not granted
