# DTE-M18 — External Engine Integration Specification

- Document ID: PULSE-DTE-M18
- Version: 0.1.0
- Status: Draft — Integration contract only
- Parent: docs/dte/DTE_MODULE_REGISTER.md
- Last updated: 2026-11-06

## 1. Purpose

External Engine Integration defines how DTE exposes its governed question classification references and version-aware metadata to other PULSE engines and authorized external consumers. It establishes stable contracts without absorbing the business logic or data ownership of those systems.

DTE remains the authority for its classification schemas and question-to-classification mappings. Each consumer remains the authority for its own domain.

## 2. Scope

In scope:
- Read APIs and event contracts for published DTE classification data.
- Consumer registration and authorization requirements.
- Stable question, version, schema and mapping references.
- Compatibility and contract versioning.
- DRE evaluation pointer hand-off.
- Consumer access to current and historical published mapping snapshots.
- Integration health, retries, reconciliation and audit requirements.

Out of scope:
- Implementing DRE algorithms, difficulty formulas, weights, thresholds, exam multipliers or results.
- Implementing Student Tracking, student evidence or analytics.
- Test generation, test delivery or scoring.
- General content management.
- Consumer-specific user interfaces or workflows.

## 3. Consumer ownership map

| Consumer | DTE provides | Consumer owns |
|---|---|---|
| Difficulty Rule Engine (DRE) | Stable question/version references and the approved hand-off context | Difficulty rules, static/dynamic calculations, results, evaluation history and interpretation |
| Student Tracking | Published classification references and mapping-change events | Student assignment, attendance, attempt evidence, student analytics and historical enrichment decisions |
| Test/assessment systems | Question identity/version and permitted classification metadata | Test assembly, delivery, response capture and scoring |
| Content systems | Question/source/placement references and permitted classification metadata | Books, exercises, content collections, editions and placements |
| AI Mentor or other learning systems | Authorized published classification references | Their own personalization, intervention and learner-facing logic |

This table is a boundary map, not a specification of those systems.

## 4. Common identity contract

Consumer-facing references should distinguish:
- tenant_id / authorized scope.
- question_id — stable logical question identity.
- question_version_id — exact content revision.
- mapping_id and mapping_revision_id.
- classification_schema_id and classification_schema_version_id.
- classification node/relationship stable IDs.
- publication state and effective timestamp.
- provenance references where permission allows.

A consumer must not assume that a question ID alone identifies an immutable question body or an immutable classification state.

## 5. DRE hand-off contract

DRE is a separate system and owns all difficulty evaluation.

The DTE-to-DRE pointer contract may include:
- question_id
- question_version_id
- external_engine_identifier
- external_evaluation_identifier
- evaluation_status
- result_reference
- last_evaluation_timestamp

Contract rules:
1. The pointer must identify the exact question version evaluated.
2. A new question version does not automatically inherit the validity of an earlier evaluation.
3. DTE does not calculate or store DRE scoring logic/results as its own data.
4. DRE owns evaluation rules, thresholds, multipliers, output semantics and history.
5. DTE may display an authorized external status/reference, but must label it as externally owned.
6. DRE failures or unavailable results must not invalidate DTE classification mappings.
7. The exact request/response, authentication, event and error contracts remain open.

## 6. API design requirements

The detailed API specification must define:
- Endpoint/resource identifiers.
- Authentication and consumer identity.
- Tenant/scope authorization.
- Read access to current published mappings.
- Read access to historical mapping revisions.
- Exact question-version resolution.
- Pagination and filtering.
- Rate limits and timeout behaviour.
- Error codes and retry guidance.
- Idempotency for write-like hand-off operations.
- API versioning and deprecation policy.

DTE should expose only published/authorized data by default. Draft or reviewer-only content requires an explicit consumer permission.

## 7. Event integration requirements

Potential events:
- question.mapping_published
- question.mapping_superseded
- question.mapping_revised
- classification.schema_version_published
- classification.node_deprecated
- provenance.verified_or_disputed
- external_evaluation.pointer_updated (only if DRE contract requires DTE to relay pointer state)

Every event must include a stable event ID, event type/version, tenant scope, entity/version references, occurred timestamp and correlation/idempotency reference. Payload details and delivery guarantees are open decisions.

## 8. Compatibility and lifecycle

- Published API/event contracts are versioned.
- Breaking changes require a new major contract version or an explicitly approved migration path.
- Consumers must be notified before deprecation.
- Historical references remain resolvable for the agreed retention period.
- Schema version changes must not silently alter the meaning of an existing consumer reference.
- Consumer-specific optional fields must not become mandatory without a compatibility review.

## 9. Security and governance

- Register each consumer and its allowed scopes.
- Enforce tenant isolation and least privilege.
- Use server-side secrets and authenticated service-to-service communication.
- Audit consumer registration, credential rotation, reads of sensitive records and hand-off requests.
- Do not expose service-role keys or privileged credentials to browser clients.
- Minimize payload data and avoid including student personal data in DTE events.
- Apply rate limits and abuse protection.
- Revoke consumer access promptly when authorization is removed.

## 10. Reliability and operations

The integration design must define:
- Delivery semantics.
- Retry and backoff policy.
- Dead-letter handling.
- Event ordering scope.
- Idempotency and deduplication.
- Replay and reconciliation.
- Consumer health monitoring.
- Timeout and circuit-breaker behaviour.
- Contract/schema validation.
- Operational ownership and escalation path.

DTE must distinguish “event published”, “consumer received” and “consumer processed” where the infrastructure exposes these states. It must not claim downstream completion based only on event publication.

## 11. Acceptance criteria

1. Consumers receive stable question, exact version, mapping revision and schema version references.
2. DTE exposes only authorized data and respects tenant scope.
3. DRE remains the sole owner of difficulty calculation and evaluation history.
4. DRE pointer validity is tied to exact question version.
5. Student Tracking remains the owner of student evidence and analytics.
6. API/event contracts are versioned and have compatibility rules.
7. Retries and event replays are idempotent or safely deduplicated.
8. Integration failures do not corrupt DTE-owned mapping data.
9. Consumer access and sensitive operations are audited.
10. Event publication is not misrepresented as consumer processing success.

## 12. Dependencies

- M05 Relationship Mapping Engine.
- M11 Version & History Manager.
- M15 Configuration Version Manager.
- M16 Historical Enrichment Interface.
- External consumer identity, API gateway and event infrastructure.
- Separate DRE and Student Tracking specifications maintained in their own project scopes.

## 13. Open decisions

| ID | Question | Status |
|---|---|---|
| DTE-M18-OD-001 | Which consumers are enabled in the first integration release? | Open |
| DTE-M18-OD-002 | What API style and event transport are selected? | Open |
| DTE-M18-OD-003 | What authentication and consumer registration model is required? | Open |
| DTE-M18-OD-004 | What are the exact DRE request/response and pointer lifecycle contracts? | Open |
| DTE-M18-OD-005 | Which mapping/schema events are required by each consumer? | Open |
| DTE-M18-OD-006 | What are delivery, ordering, retry, replay and retention guarantees? | Open |
| DTE-M18-OD-007 | What contract compatibility and deprecation windows apply? | Open |
| DTE-M18-OD-008 | Which consumers may access draft, review-only or published data? | Open |

## 14. Change history

| Version | Date | Status | Change |
|---|---|---|---|
| 0.1.0 | 2026-11-06 | Draft | Initial external engine integration specification |

## 15. Approval

- Product owner: Pending
- Consumer/system owner review: Pending
- Implementation authorization: Not granted
