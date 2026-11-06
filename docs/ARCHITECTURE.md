# PULSE — Architecture Baseline

**Status:** Proposed logical architecture; not yet a verified as-built architecture.

## 1. Architecture approach

Start with a modular application and a well-governed relational data model. Do not introduce microservices solely because the product has multiple modules. Extract services only when operational scale, independent deployment, security boundaries or team ownership justify the complexity.

The existing repository and Supabase deployment must be inspected before selecting or changing frameworks, deployment topology or database structure.

## 2. Logical layers

1. **Experience layer:** role-aware web/mobile experiences for teachers, authors, reviewers, administrators and learners.
2. **Application/domain layer:** Student Tracking, QBMS, DTE, DRE integration, Test Management, Content Management and AI Mentor workflows.
3. **Shared platform layer:** identity, tenant context, authorization, audit, notifications, configuration and integration contracts.
4. **Data layer:** relational academic records, question versions, classification mappings, student evidence, content placements and derived analytics.
5. **Async processing layer:** imports, bulk tagging, validation, duplicate detection, historical enrichment, analytics refresh and AI assistance.
6. **External services:** model providers, messaging, file processing and other approved integrations.

## 3. Core domain boundaries

### Student Work Tracking
Owns exercise/assignment operations, student work events, attempt cycles and tracking views. It can reference a question/version/slot when available, but must work with a lightweight exercise/question-slot representation when deep tagging is absent.

### QBMS
Owns stable question identity and governed question content/version lifecycle, source and media provenance, and question-level quality evidence. The exact boundary with existing content management must be resolved during audit.

### DTE
Owns classification schemas/configuration, classification entities, relationship definitions, question-to-classification mappings, validation, review, publication, configuration versioning and audit. It consumes authorized question references/previews; it need not own question content.

### DRE
Owns difficulty rules and evaluation. DTE stores only an external, version-specific pointer/reference if integration requires it.

### Content Management
Owns tenant-specific collections/series and their editions, units, exercises and placements. It must not assume all content is a printed book or force tenant branding into global enums.

### AI Mentor
Consumes governed evidence and derived analytics. It should not directly mutate authoritative question, classification or student-evidence records without approved workflows.

## 4. Identity and versioning

At minimum, preserve separate identities for:
- logical question;
- question content version;
- exercise/test/content placement slot;
- classification schema and schema version;
- classification entity/node;
- question-to-classification mapping revision;
- student evidence event;
- external DRE evaluation.

Historical evidence should reference the relevant question version and placement context. Configuration changes must not silently reinterpret or erase historical mappings.

## 5. Multi-tenancy and authorization

- Every tenant-owned record must have an explicit tenant boundary or be reachable only through a tenant-scoped parent with enforced constraints.
- Shared/global reference data must be distinguished from tenant-owned extensions.
- Enforce authorization in database RLS and trusted server-side services.
- Test cross-tenant reads, writes, joins, RPCs, storage access and background jobs.
- Never rely on frontend filtering as the security boundary.
- Service-role credentials must remain server-side.

The exact shared-data policy (global catalogue, tenant extension, cloning, licensing) remains a decision to validate before schema design.

## 6. Data integrity and lifecycle

- Prefer deactivation/archive and restricted deletion for academic entities.
- Avoid cascades that can erase questions, attempts, results, mappings or audit history.
- Published mapping edits create new revisions rather than silently overwriting approved history.
- Separate work status, review status, publication status and completeness.
- Derive completeness from configurable profiles rather than a hardcoded tag count.
- Store audit provenance for sensitive actions.

## 7. Async jobs and historical enrichment

Use durable job/event records with:
- stable event/job identity;
- tenant and source record references;
- question and question-version references;
- mapping/configuration revision references;
- idempotency key;
- state, retry count and timestamps;
- error details and processing outcome.

A historical enrichment job adds derived associations or refreshes derived aggregates. It never edits the original student event. Reprocessing must be safe and traceable.

## 8. Scale and performance

For a potential inventory of one million questions:
- server-side pagination and filtering;
- indexed exact and text search;
- bounded result sizes;
- query plans and measured indexes;
- batch operations with chunking;
- background processing for expensive work;
- avoid N+1 relationship queries;
- avoid loading the complete inventory into browser memory.

Performance targets should be set after baseline measurement and workload definition.

## 9. Integration contracts

Prefer stable identifiers and explicit version references across module boundaries. Events and APIs should be documented, tenant-scoped, idempotent where retried, and backward-compatible where feasible.

DTE-to-DRE pointer contract should identify at least question ID, question version ID, external engine/evaluation identifier, evaluation status, result reference and last evaluation timestamp. DRE owns the meaning and validity of the result.

## 10. Architecture decisions still open

- Verified frontend/backend framework and deployment topology.
- Exact ownership boundary between QBMS and Content Management.
- Global reference taxonomy sharing and tenant extension policy.
- Search technology and indexing strategy.
- Event/job infrastructure appropriate to measured volume.
- Exact permission matrix and publication policy.
- Backup, recovery, observability and service-level objectives.
