# System A — A2 Architecture Decision Matrix

**Date:** 2026-11-06  
**Status:** Proposed defaults for owner review; none of these proposals authorize a production migration  
**Related:** `SYSTEM_A_SOURCE_RECONCILIATION_2026-11-06.md`

## Decision register

| ID | Decision area | Recommended default | Why this is the safest baseline | What must be confirmed |
|---|---|---|---|---|
| A2-01 | Shared identity ownership | PULSE platform owns institute/tenant, person/auth mapping, student identity, batch, effective-dated membership and role grants. System A references those records. | Prevents duplicate identities and inconsistent tenant boundaries across PULSE modules. | Exact shared schema/table names, primary keys, tenant key and membership relationship. |
| A2-02 | System A data ownership | System A owns exercises, immutable exercise versions, slots, assignments, assignment versions, target snapshots, obligations, reports, evaluations, verification, correction, doubts, disputes and recognition. | Keeps academic work lifecycle isolated while using common platform identity. | Confirm ownership list and whether any existing shared service already owns one of these entities. |
| A2-03 | Assignment publication | Publishing freezes an immutable assignment version and resolves eligible students into a publication-time target snapshot; obligation creation is atomic and idempotent. | Prevents later batch changes from rewriting who was assigned the work. | Confirm whether publication is immediate or requires reviewer approval; define withdrawal/addendum behavior. |
| A2-04 | Post-publication changes | Do not edit a published version in place. Create a new version/amendment event. Preserve prior obligations and evidence; explicitly add, withdraw or supersede obligations according to an approved amendment policy. | Maintains auditability and historical truth. | Choose whether changes apply prospectively only, or can explicitly supersede existing obligations. |
| A2-05 | Matrix status actor/source | Persist student self-report and teacher observation as different event types. The six current UI states may be used as input labels, but each write must carry actor, source, timestamp and target obligation/slot. | Prevents teacher-entered observations from being misrepresented as student claims. | Confirm whether the current matrix is teacher entry, student self-report, or a mixed view with separate actions. |
| A2-06 | Six-state UI vocabulary | Keep U/C/I/D/S/P as the current interaction vocabulary provisionally. Map each to domain events/dimensions; do not create one universal status enum. | The six labels combine progress, answer evaluation and doubt semantics. | Academic owner approves labels, transitions, and whether P means partially correct answer or partial completion. |
| A2-07 | “Solved by Teacher” | Represent as a teacher-attributed event, not a student answer status. Distinguish explanation/demonstration, teacher evaluation, and student independent re-solve after intervention. | These actions have different educational meanings and should not inflate student correctness. | Select which of these events the diary/matrix intends to record. |
| A2-08 | Question identity | An exercise slot is valid without a QBMS question ID. When linked, store the exact QBMS question identity and version through an optional versioned mapping. | Supports offline/local numbered exercises and later question-bank enrichment. | Confirm the QBMS canonical IDs and version contract before adding the optional FK. |
| A2-09 | DTE enrichment | DTE tags, concepts, archetypes and difficulty are optional, versioned enrichment. System A must not own taxonomy tables or require enrichment to assign/track work. | Preserves the boundary between tracking and academic classification. | Confirm the DTE/QBMS integration contract and how stale enrichment is displayed. |
| A2-10 | Common subject/stream eligibility | Use configurable subject/stream/course compatibility rules, evaluated at assignment publication. Do not hard-code JEE/NEET or XI/XII assumptions in UI logic. | Makes cross-class revision and common subjects governable. | Approve the first policy matrix: cohort × target course/stream × subject × content scope. |
| A2-11 | Parent access | Default to authenticated, relationship-scoped read-only access. Do not implement zero-login bearer links in the MVP. | Reduces risk of forwarded links exposing student records. | Confirm parent/guardian relationship source, consent/verification process and whether secure links are later required. |
| A2-12 | Teacher authorization | Resolve actor and permissions server-side from active institute membership, role grants, teaching assignment and scope. Never trust client-supplied role/tenant identifiers. | Enforces tenant and academic scope consistently. | Confirm role matrix and delegation rules for teacher, reviewer, mentor and institute admin. |
| A2-13 | Evidence and corrections | Append reports, evaluations and verification decisions; corrections/resubmissions create linked new records. Never overwrite historical evidence. | Supports appeals, audit and longitudinal progress. | Confirm correction cycle closure rules and whether a student can retract a self-report. |
| A2-14 | Analytics | Derive matrix counts and risk indicators from evidence/event records using versioned projection logic. Store source watermark and projection version. | Allows analytics rebuilds without changing source truth. | Confirm definitions/denominators for attempted, correct, incorrect, doubt, skipped and pending. |
| A2-15 | Experimentation | Defer A/B experiment instrumentation until the baseline workflow is stable. Treat all proposed numerical lifts as hypotheses, not results. | Avoids instrumenting an unstable workflow and collecting unnecessary student telemetry. | Select one experiment only after baseline metrics, privacy review and event contracts are approved. |

## Recommended first policy defaults

These are implementation recommendations, not confirmed user decisions:

1. **Identity:** one shared PULSE identity and membership model.
2. **Assignment:** publication-time roster snapshot plus one obligation per eligible student × assigned slot.
3. **Immutability:** published versions and evidence are append-only; changes are explicit amendments.
4. **Status:** six labels remain UI inputs only until the academic semantics are signed off.
5. **Actors:** student report, teacher observation, teacher evaluation and verification remain distinct.
6. **QBMS/DTE:** optional references only; no dependency for day-one System A operation.
7. **Parent:** authenticated read-only access for MVP.
8. **Security:** server-derived actor, tenant and permission scope; fail closed when context is missing.

## Minimum owner decisions required before the first production migration

The first migration should remain blocked until these six items are resolved:

- [ ] A2-01: exact shared identity schema and foreign-key map.
- [ ] A2-03/A2-04: publication approval and post-publication amendment policy.
- [ ] A2-05/A2-06: actor semantics and final interpretation of U/C/I/D/S/P.
- [ ] A2-07: precise meaning of “Solved by Teacher”.
- [ ] A2-10: initial COMMON/JEE/NEET/class-level eligibility matrix.
- [ ] A2-11/A2-12: parent access model and server-side role/authorization matrix.

## Migration gate

A migration may be drafted for review only after the shared identity schema is inspected and the six owner decisions above are recorded. It must then be checked for:

- tenant-consistent foreign keys;
- append-only evidence and immutable published versions;
- idempotent transactional publication;
- explicit RLS policies and least-privilege grants;
- server-derived actor context;
- indexes for matrix paging and obligation lookups;
- rollback and backfill strategy;
- integration tests for cross-tenant denial and batch-transfer history.

**No schema is applied by this document. No Supabase, Vercel, production data, or application runtime is changed.**
