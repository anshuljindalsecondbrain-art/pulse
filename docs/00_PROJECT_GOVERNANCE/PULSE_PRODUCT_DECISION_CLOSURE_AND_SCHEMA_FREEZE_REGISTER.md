# PULSE — Product Decision Closure and Schema Freeze Register

- Document ID: PULSE-DATA-CORE-010
- Version: 0.1.0
- Status: Draft — decision proposals only; owner approvals pending
- Date: 2026-11-06
- Workstream: System A / Shared Platform
- Repository: `anshuljindalsecondbrain-art/pulse`
- Depends on: PULSE-DATA-CORE-001 through PULSE-DATA-CORE-009
- Governing rule: This document does not authorize code changes, SQL generation, migrations, grants, RLS policy deployment, merge or production release.

## 1. Purpose

Stage 9 consolidated the proposed shared-platform and System A physical data model. The model cannot be frozen responsibly while product semantics that determine cardinality, ownership, authorization, lifecycle and retention remain undecided.

This register converts those unresolved semantics into explicit decisions. Each row contains a proposed default to make review concrete. A proposed default is not an approved requirement. The accountable owner must accept, amend or reject it, and the decision must be recorded with evidence.

## 2. Decision status vocabulary

| Status | Meaning |
|---|---|
| OPEN | No accountable decision recorded |
| PROPOSED | A default is documented for review |
| APPROVED | Required owner(s) explicitly approved the recorded wording |
| REJECTED | Proposal rejected; replacement decision required |
| BLOCKED | Decision cannot close until a named dependency is resolved |
| SUPERSEDED | Replaced by a later, linked decision; history retained |

No decision may be marked APPROVED solely because it appears in a design document, code comment, meeting note without an attributable approver, or AI-generated recommendation.

## 3. Decision register

### D-001 — Concurrent active student enrollments

- **Question:** May one student hold multiple concurrent active enrollments, including across centres, batches, programmes or academic sessions?
- **Proposed default:** Permit multiple concurrent enrollments where each enrollment is independently scoped to a tenant, programme/session and centre. Enforce uniqueness only for the exact business key that the academic owner defines; do not impose a global one-active-enrollment constraint.
- **Why it matters:** Determines enrollment cardinality, active-context selection, batch membership, reporting and authorization joins.
- **Required approver:** Product Owner + Academic Owner.
- **Schema impact:** Shared enrollment and batch-membership constraints; active-context resolution.
- **Product decision recorded (2026-11-06):** ALLOW multiple concurrent active enrollments. Scope: both within the same institute (including across centres/programmes/sessions where independently valid) and across different institutes. Multiple batch memberships are permitted when each membership is valid under its associated enrollment and institutional rules. No global one-active-enrollment-per-student uniqueness constraint is permitted.
- **Operational implication:** Active academic context must be selected/resolved explicitly; it must not be inferred from a single globally unique active enrollment. Cross-institute access remains tenant-isolated and requires a separate authorized membership in each institute.
- **Approval status:** Product decision recorded at the user's direction; Academic Owner approval remains pending.
- **Status:** BLOCKED — awaiting Academic Owner approval.

### D-002 — Guardian identity and relationship verification

- **Question:** What evidence and workflow establish that a person is a legitimate parent/guardian for a student, and who can approve or revoke that relationship?
- **Proposed default:** Store the relationship assertion separately from verification evidence and verification decision. Support pending, verified, rejected, revoked and expired states only after the academic/privacy owners approve the exact transition vocabulary. Never infer guardian authority from possession of a phone number alone.
- **Why it matters:** Parent access exposes student academic and potentially personal data.
- **Required approver:** Product Owner + Privacy/Safeguarding Owner + Security Owner.
- **Schema impact:** Parent-student link, verification evidence, verifier identity, decision timestamps, revocation history and scoped access checks.
- **Status:** OPEN.

### D-003 — Role catalogue and action permissions

- **Question:** Which roles exist, which actions can each role perform, and which permissions are global, tenant-scoped or resource-scoped?
- **Proposed default:** Separate role assignment from permission definition. Authorize explicit actions against tenant and resource scope; UI role labels must not be treated as authorization. Deny by default when a permission or scope is absent.
- **Why it matters:** Role-name-only checks cannot safely express centre, batch, student or assigned-resource boundaries.
- **Required approver:** Product Owner + Security Owner.
- **Schema impact:** Role catalogue, role-permission mapping, membership assignments, scope grants and trusted authorization functions.
- **Product decision recorded (2026-11-06):** HYBRID authorization: combine role-based access control (RBAC), resource/assignment scope, and explicit action permissions. A role alone never grants unrestricted access to all resources. Authorization must evaluate the actor's tenant membership, assigned resource scope and permission for the requested action; absent or ambiguous grants deny access by default.
- **Operational implication:** Role definitions, permission catalogue, role-permission assignments and resource-scope grants are distinct concepts. Scope checks must be enforced at trusted service/database boundaries, not only in UI navigation or client-side filtering.
- **Approval status:** Product decision recorded at the user's direction; Security Owner approval remains pending.
- **Status:** BLOCKED — awaiting Security Owner approval.

### D-004 — Teacher/reviewer resource scope representation

- **Question:** How are teachers, reviewers and administrators assigned access to centres, batches, students, exercises, assignments and review queues?
- **Proposed default:** Use typed, tenant-qualified resource-scope grants for the initial domain. Avoid a generic polymorphic resource registry unless multiple modules demonstrate a concrete need and the security model can enforce referential integrity.
- **Why it matters:** Determines query filtering, RLS predicates, referential integrity and future module extensibility.
- **Required approver:** Technical Owner + Security Owner + Product Owner.
- **Schema impact:** Resource-scope grant tables, composite FKs, indexes and authorization predicates.
- **Product decision recorded (2026-11-06):** TYPED resource assignments. Use explicit, tenant-qualified relationships for supported resource types rather than a universal generic resource registry for the initial architecture.
- **Operational implication:** Model core assignments to centres, batches, students, exercises, assignments and review queues with typed references and enforceable tenant-qualified foreign keys. Authorization still requires the D-003 hybrid checks: role, explicit action permission and applicable resource scope. Adding a new resource type requires an explicit schema/API extension and review.
- **Approval status:** Product decision recorded at the user's direction; Technical Owner and Security Owner approval remain pending.
- **Status:** BLOCKED — awaiting Technical Owner and Security Owner approval.

### D-005 — Assignment publication roster semantics

- **Question:** At publication time, is the target roster fixed, or do later batch membership changes alter who owes the assignment?
- **Proposed default:** Publication creates an immutable obligation snapshot for the resolved target population. Later enrollment or batch changes do not silently rewrite existing obligations. Explicit add/remove/cancel operations append lifecycle events and preserve the original publication snapshot.
- **Why it matters:** Affects fairness, historical reporting, reproducibility and transactional publication.
- **Required approver:** Academic Owner + Product Owner.
- **Schema impact:** Publication snapshot, obligation expansion, assignment lifecycle events and idempotent publication transaction.
- **Product decision recorded (2026-11-06):** HYBRID — immutable publication snapshot by default, with explicit teacher-controlled additions and removals recorded as auditable lifecycle events.
- **Operational implication:** The initial publication roster is fixed and reproducible. Students joining the batch later do not automatically inherit the assignment. Authorized teacher actions may add or remove/cancel a student's obligation through explicit commands; preserve the original snapshot and append actor-attributed events with reason and timestamp. Do not silently rewrite historical membership or publication evidence.
- **Approval status:** Product decision recorded at the user's direction; Academic Owner approval remains pending.
- **Status:** BLOCKED — awaiting Academic Owner approval.

### D-006 — Author, approver and publisher separation

- **Question:** Can the same person author, approve and publish an assignment or academic resource?
- **Proposed default:** Record author, approver and publisher as separate attributable actions. Enforce separation of duties for high-impact publication by default; permit an explicit institution-level policy override only if the Product and Security Owners approve it. Self-approval must never be silently implied.
- **Why it matters:** Controls content quality, accountability and operational fraud/error risk.
- **Required approver:** Product Owner + Academic Owner + Security Owner.
- **Schema impact:** Review decisions, publication events, actor attribution and policy version references.
- **Status:** OPEN.

### D-007 — Evidence vocabulary and repeated submissions

- **Question:** Which evidence origins and submission types are recognized, and how are repeated reports, attempts and teacher observations represented?
- **Proposed default:** Preserve distinct immutable evidence events for learner reports, teacher observations, system imports and other explicitly approved sources. A repeated submission creates a new event linked to the relevant prior event/attempt; it does not overwrite the previous evidence. Verification decisions and answer evaluations remain separate facts.
- **Why it matters:** Prevents conflating a learner claim, observed work, verified completion and correctness.
- **Required approver:** Academic Owner + Product Owner.
- **Schema impact:** Evidence event type, source attribution, attempt linkage, deduplication/idempotency and separate verification/evaluation entities.
- **Status:** OPEN.

### D-008 — Correction and doubt lifecycle transitions

- **Question:** Which states and transitions govern correction cycles and doubt cases, including reopening, reassignment and closure?
- **Proposed default:** Use explicit, versioned transition rules and append-only transition events. Reopening creates a new cycle or linked reopen event; it must not erase prior closure. Define permitted actors and reasons for each transition.
- **Why it matters:** Determines operational queues, auditability, SLA metrics and valid state projections.
- **Required approver:** Academic Owner + Product Owner.
- **Schema impact:** State-transition events, cycle identifiers, actor/reason fields and current-state projections.
- **Status:** OPEN.

### D-009 — Metric policy versioning and effective periods

- **Question:** How are completion, accuracy, timeliness and other academic metrics defined, changed and applied to historical records?
- **Proposed default:** Store immutable, versioned metric policies with explicit effective intervals and scope. Every derived metric must identify the policy version used. A policy change must not silently recalculate historical official results; recalculation requires an explicit, auditable job and approval.
- **Why it matters:** Historical comparisons become unreliable if metric definitions drift without provenance.
- **Required approver:** Academic Owner + Analytics Owner + Product Owner.
- **Schema impact:** Metric policy versions, effective dates, scope, derivation provenance and recalculation audit.
- **Status:** OPEN.

### D-010 — PII classification, retention and export

- **Question:** Which fields are personal/sensitive data, what is the purpose and retention period for each class, and who may export or erase data?
- **Proposed default:** Maintain a field-level data inventory and purpose/retention schedule before production. Minimize collection, restrict exports by explicit permission and log them. Apply legally required retention/deletion through controlled workflows while preserving only records that have a documented lawful basis to retain.
- **Why it matters:** Guardian/student records, contact data and academic evidence require privacy-by-design and jurisdiction-aware handling.
- **Required approver:** Privacy/Data Protection Owner + Security Owner + Product Owner.
- **Schema impact:** Data classification, retention metadata, export audit, deletion/anonymization workflows and access logging.
- **Status:** OPEN.

### D-011 — Optional QBMS and DTE reference contracts

- **Question:** How may System A reference question-bank and classification records without depending on QBMS or DTE availability?
- **Proposed default:** Keep QBMS question/version references and DTE classification references optional and externally owned. Store stable external identifiers plus source/system context only where required. Missing or deleted external references must not invalidate a student obligation, attempt or evidence record. Student Tracking remains fully operable without either module.
- **Why it matters:** Preserves module boundaries and prevents academic tracking from becoming coupled to future tagging workflows.
- **Required approver:** Product Owner + QBMS Owner + DTE Owner + Technical Owner.
- **Schema impact:** Optional reference columns/link tables, validation contracts and deletion semantics.
- **Status:** OPEN.

### D-012 — Idempotency and transactional outbox retention

- **Question:** Which trusted commands require idempotency keys, how long are keys/outbox events retained, and what are retry/dead-letter rules?
- **Proposed default:** Require idempotency for publication, obligation expansion, evidence submission/import and other externally retried commands. Persist command identity and outcome transactionally with the domain write. Use an outbox for reliable downstream delivery; define bounded retry/backoff, dead-letter handling, replay authorization and retention before implementation.
- **Why it matters:** Prevents duplicate obligations/events under network retries and supports reliable integration.
- **Required approver:** Technical Owner + Security Owner + Product Owner.
- **Schema impact:** Idempotency records, outbox, delivery attempts, unique constraints, retention and operational tooling.
- **Status:** OPEN.

## 4. Cross-decision dependencies

| Dependency | Decisions | Closure rule |
|---|---|---|
| Identity, access and safeguarding | D-002, D-003, D-004, D-010 | Must be jointly reviewed; no guardian or staff access policy can be frozen in isolation |
| Academic assignment lifecycle | D-001, D-005, D-006 | Enrollment and roster semantics must be settled before publication constraints are finalized |
| Evidence and learner workflow | D-007, D-008, D-009 | Evidence vocabulary and lifecycle transitions precede metric derivation rules |
| Module boundaries and integration | D-011 | Must preserve independent Student Tracking operation |
| Reliable command execution | D-005, D-007, D-012 | Idempotency and outbox design must align with publication and evidence transaction boundaries |

## 5. Approval record template

For every decision, record:

- Decision ID:
- Final approved wording:
- Status:
- Decision owner:
- Approver name/role:
- Approval date/time:
- Rationale:
- Alternatives considered:
- Affected documents/tables/APIs:
- Required migration or backfill implications:
- Security/privacy/academic review evidence:
- Linked issue/event/PR:
- Supersedes (if applicable):

Approvals must be attributable and traceable. If approvers disagree, retain the decision as OPEN or BLOCKED and record the competing positions; do not resolve the disagreement by silently choosing the technical team's preference.

## 6. Schema freeze exit criteria

The physical schema may be marked **FROZEN FOR IMPLEMENTATION** only when all of the following are true:

1. All twelve decisions have an approved final wording or a documented, explicitly accepted deferral with a bounded scope and owner.
2. Product and Academic Owners approve enrollment, guardian, assignment, evidence, correction, doubt and metric semantics.
3. Security and Privacy Owners approve action permissions, resource scope, PII handling, retention and export controls.
4. Technical Owner confirms that every approved decision is represented consistently in the ERD, data dictionary, API contract and authorization design.
5. All cross-module references have explicit ownership, optionality, deletion and failure semantics.
6. Blocking issues are linked to the decision records and either closed with evidence or formally accepted as implementation blockers.
7. A final consistency review confirms no duplicate canonical identity, tenant, student, batch or role model.
8. A migration plan, rollback/recovery plan, RLS/grant matrix and test plan are ready for separate review.
9. The schema baseline receives explicit owner sign-off.
10. A separate implementation authorization is issued before production SQL is generated or applied.

## 7. What schema freeze does not mean

Even after approval, schema freeze does not itself authorize:

- Applying migrations to the live Supabase project.
- Creating production tables, policies, grants, functions or triggers.
- Importing or migrating real student data.
- Enabling production writes or connecting the current UI to live data.
- Merging PR #2 or deploying a production release.

Those actions require their own reviewed implementation and release approvals.

## 8. Current disposition

- Decision register: created as a Draft.
- Decisions approved: 0 of 12.
- Schema status: NOT FROZEN.
- Production SQL: BLOCKED.
- Live Supabase changes: NONE authorized.
- Next action: Product Owner assigns accountable decision owners and closes D-001 through D-012 with attributable approvals.
