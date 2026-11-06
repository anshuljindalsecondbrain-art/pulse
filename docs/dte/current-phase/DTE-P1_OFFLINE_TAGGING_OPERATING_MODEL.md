# DTE Phase 1 — Offline Tagging Operating Model

- Document ID: PULSE-DTE-P1-OPS-001
- Version: 0.1.0
- Status: Draft — requirements baseline
- Phase: Current — Offline tagging framework and operating management
- Implementation authorization: Not granted

## 1. Purpose

Define how an institution-approved tagging framework is prepared, distributed, applied by humans outside the DTE question-upload/digital-tagging workflow, checked, corrected, approved and handed forward.

This specification does not authorize question upload, question-content storage or digital question-to-tag mappings.

## 2. Operating principles

1. Institution-approved academic definitions are authoritative.
2. A tagger applies existing approved values; a tagger does not create new academic categories during routine work.
3. If no approved value fits, the tagger records an exception and requests an authorized decision.
4. A question reference on an offline sheet is an external locator, not a DTE question record or canonical question ID.
5. Student Tracking operates independently of deep-tagging completion.
6. Framework and template versions must be identifiable on every work package.
7. A submitted sheet is not approved merely because it passed file-format validation.

## 3. Actors

Candidate roles, to be confirmed:
- Academic Framework Owner: accountable for academic definitions and taxonomy approval.
- Framework Administrator: configures approved definitions in DTE.
- Tagging Coordinator: prepares and allocates offline work packages.
- Tagger: applies approved tags using the current instructions/template.
- Checker: verifies submitted tagging work.
- Academic Reviewer/Approver: adjudicates ambiguity and approves work where required.
- DTE Administrator: manages access, tenant settings and technical configuration.
- Auditor/Read-only User: views permitted history and evidence.

A single person may hold multiple roles only where the institution's separation-of-duties policy permits it.

## 4. End-to-end workflow

### 4.1 Framework preparation
1. Academic authority supplies or approves the classification structure and definitions.
2. Framework Administrator encodes the approved structure in DTE.
3. DTE validates structural integrity, identifiers, required fields and references.
4. Academic authority reviews the representation for fidelity.
5. Authorized approver activates a version for use.
6. DTE records approval evidence, effective date and version.

### 4.2 Work-package preparation
1. Coordinator selects an approved framework version and template version.
2. Coordinator creates a work package with a unique work-package ID.
3. Package records scope/owner/due date/assigned taggers where the institution requires them.
4. Questions are referenced using the institution's existing external locator convention (for example, printed paper + exercise + question number); DTE does not create a question entity.
5. The package/template and instructions are exported or made available to authorized taggers.
6. Package records the exact framework/template version used.

### 4.3 Offline tagging
1. Tagger reviews the approved instructions and examples.
2. Tagger identifies the question using the external locator.
3. Tagger selects only permitted values from the approved framework.
4. Tagger records required/optional fields according to the approved profile.
5. Ambiguity, missing category, unreadable source or disputed interpretation is recorded as an exception, not guessed.
6. Tagger records required rationale/evidence only where the approved procedure requires it.
7. Tagger submits the completed work package through the agreed handoff method.

### 4.4 Intake and validation of completed work
1. Coordinator records receipt and associates it with the work-package ID.
2. DTE validates template version, framework version, identifiers, allowed values, required fields, duplicate rows and basic file structure if file submission is in scope.
3. Validation errors identify row/column and reason.
4. Invalid submissions are returned for correction or quarantined; they are not silently normalized into different academic values.
5. Successful technical validation advances to checking; it does not equal academic approval.

### 4.5 Checking, correction and approval
1. Checker reviews completeness and adherence to instructions.
2. Checker may pass, return for correction or escalate an exception.
3. Academic Reviewer decides disputed academic interpretation.
4. Corrections preserve prior submission/review evidence.
5. Approver records the outcome, actor, timestamp, rationale and applicable framework version.
6. Approved work is marked ready for the later handoff only if required by the institution.

### 4.6 Framework change during active work
1. A proposed framework change is recorded as a new draft version.
2. Impact analysis identifies active work packages using the affected version.
3. Academic authority approves or rejects the change.
4. Existing work packages remain pinned to their original version unless an explicit migration/reissue is approved.
5. Coordinator communicates whether work must continue, pause or be reissued.
6. Historical records retain the version under which they were completed.

## 5. Work-package states

Candidate states:
- Draft
- Ready for Assignment
- Assigned
- In Progress
- Submitted
- Intake Validation Failed
- Intake Validated
- Checking
- Returned for Correction
- Exception Escalated
- Approved
- Rejected
- Closed
- Cancelled

State transitions, role permissions, reopening rules and SLA values require approval. Do not merge work-package status with framework publication status or validation status.

## 6. Exception catalogue

At minimum, support distinct exception categories:
- No approved tag fits.
- Multiple approved tags appear equally plausible.
- Source/question locator is missing or ambiguous.
- Source content is unreadable or unavailable to the tagger.
- Required information cannot be determined.
- Framework/template version mismatch.
- Deprecated value used.
- Duplicate locator.
- Conflicting reviewer decisions.
- Suspected source/licensing restriction.

Each exception should capture category, reference, description, reporter, timestamp, status, resolution, resolver and decision evidence where applicable.

## 7. Offline question reference

The reference format is an institution decision, not a DTE-generated question identity. It may consist of one or more external locator components such as source/book/test code, exercise or paper, question number, page, set/shift or source revision. Exact required fields must be agreed with the institution.

DTE must not infer that two matching locators are the same logical question across sources. Duplicate identity adjudication belongs to the later question domain.

## 8. Audit and evidence

Record:
- Work-package ID and version.
- Framework and template version.
- Tagger/checker/reviewer/approver identities.
- Assignment, submission, receipt and review timestamps.
- Validation result and errors.
- Correction rounds and before/after values where retained.
- Exception and resolution evidence.
- Approval/rejection decision and reason.
- Export/handoff manifest identifier.

Retention periods and privacy classification remain to be approved.

## 9. Failure and recovery

- Partial file intake must not silently mark the entire package complete.
- Repeated submission must be detected using package identity, version and submission fingerprint where feasible.
- A retry must not duplicate approved records or erase prior submissions.
- Interrupted exports must be reproducible for the same framework/template versions.
- Conflicting simultaneous edits to the same package require a controlled resolution path.

## 10. Acceptance criteria

1. A work package identifies its framework and template versions.
2. A tagger can use approved values without creating new academic categories.
3. An unmatched or ambiguous value can be escalated without forcing a guess.
4. Technical validation and academic approval are separate outcomes.
5. Corrections preserve an auditable history.
6. A framework change does not silently rewrite active or completed work.
7. Question locators remain external references; no question content record is created in DTE.
8. Student Tracking workflows are not blocked by missing tagging.
9. Work-package states and permissions are explicitly configured before implementation.
10. A handoff manifest can identify the approved framework/template versions used.

## 11. Open requirements

- Existing offline sheet and real completed examples.
- Exact external question locator convention.
- Whether file upload of completed sheets is required.
- Supported formats and file limits.
- Work allocation and assignment needs.
- Checker/approver separation.
- Evidence and rationale requirements.
- Correction and dispute SLA.
- Retention policy.
- Export/handoff destination and format.

## 12. Approval

- Product owner: Pending
- Academic authority: Pending
- Operations owner: Pending
- Implementation authorization: Not granted

## 13. Change history

| Version | Date | Status | Change |
|---|---|---|---|
| 0.1.0 | 2026-11-06 | Draft | Initial offline tagging operating model |