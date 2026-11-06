# Student Work Tracking — Functional Baseline

**Status:** Working requirements baseline; implementation must be audited.

## 1. Purpose

Student Work Tracking (also referred to as Abhyas Matrix) enables teachers and academic teams to record assigned work and student-level outcomes with minimal setup. It must deliver operational value from day one, even when questions have not yet been deeply classified.

## 2. Independence from DTE

Student Tracking is an independent operational track. It must not require DTE completion, concept tags, sub-concepts or archetypes to create an exercise or record student work.

DTE may later enrich derived analytics by connecting a question's historical evidence to newly available classification. This enrichment must not alter the original student evidence.

## 3. Minimum operational workflow

A lightweight exercise/assignment can be created using available operational details such as:
- chapter or syllabus scope;
- exercise label/name (for example, DPP-01);
- target question count;
- optional batch/cohort and due date;
- configured question/marking mode where relevant.

The historical design target was a quick exercise scaffolder that allows a teacher to create an exercise and open the tracking matrix with minimal steps. Exact interaction timing is a product target to validate, not a verified current capability.

## 4. Student work evidence

Historical status vocabulary includes:
- Correct
- Incorrect
- Doubt
- Solved by Teacher
- Unattempted

The implementation must distinguish a student-reported doubt from an incorrect response, unattempted question, skipped work, teacher-assisted solution or an inferred weakness. Do not automatically convert incorrect answers into reported doubts.

Formal event semantics, status transitions, correction history and who may record each event must be finalized during implementation audit.

## 5. Evidence and identity

Where question data is available, evidence should reference:
- student;
- exercise/assignment and placement slot;
- question identity;
- exact question version when available;
- attempt cycle/context;
- recorded status/response;
- actor and timestamp.

Where a fully authored question is not yet available, the operational workflow may use a lightweight numbered slot. Later linking to a question identity must preserve the original event and provenance.

## 6. Historical enrichment

When DTE later classifies a question, derived analytics may aggregate historical student evidence by concept or other classification dimensions. Processing must be asynchronous, idempotent, version-aware and auditable.

Enrichment must:
- preserve original event payload and timestamps;
- preserve the question version/context used at the time;
- record the mapping/configuration revision used for derived analytics;
- support retries without duplicate effects;
- distinguish source evidence from derived interpretation.

## 7. Teacher and academic workflows

The product should support fast exercise creation, a clear student-by-question matrix, correction of mistaken entries with audit history, visibility into unresolved reported doubts and cohort-level summaries. Teacher and administrator permissions must be explicit and tenant-scoped.

## 8. Important lifecycle and edge cases to validate

Historical project notes identify these areas for audit and testing:
- repeated assignment/revision cycles;
- student batch transfers and historical visibility;
- inactive batch handling;
- negative and decimal marks where marking schemes require them;
- exercises that track both question count and maximum marks;
- syllabus changes and deprecated academic concepts;
- multiple attempts and reassignment;
- role-based access and audit history.

These notes are audit prompts, not approval to apply historical SQL or assume the current schema is defective.

## 9. Acceptance criteria

- Teacher can create and track an exercise without DTE tags.
- Student work statuses are unambiguous and auditable.
- Reported doubt remains distinct from incorrect/unattempted/teacher-solved.
- Repeated assignment cycles do not overwrite prior evidence.
- Historical evidence remains accessible after batch transfer, subject to permissions.
- DTE enrichment does not mutate source evidence.
- Analytics identify the mapping/configuration revision used.
- Tenant boundaries are enforced for all student and teacher data.
- Desktop and mobile workflows are usable in real classroom conditions.
