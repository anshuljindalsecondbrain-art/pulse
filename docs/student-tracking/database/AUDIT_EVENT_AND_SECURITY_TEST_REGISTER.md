# System A — Audit, Domain Events and Security Test Register

**Document ID:** STS-DB-AUDIT-002  
**Version:** 1.0.0  
**Status:** Detailed proposal — security/privacy approval pending  
**Date:** 2026-11-07  
**Parent:** PULSE-DATA-CORE-007; STS-DB-TXN-002

## 1. Event taxonomy

Keep three distinct record classes:

| Class | Purpose | Examples | Mutation rule |
|---|---|---|---|
| Domain event | Immutable academic/business fact | Assignment published, student report submitted, teacher observation, verification decision | Append-only |
| Audit event | Who performed what, under which tenant/context, when and why | Grant revoked, export executed, privileged decision | Append-only |
| Operational log | Runtime/infra diagnostics | Function failure, latency, worker retry | Operational retention; never source academic truth |

Do not use an operational log as evidence of student performance. Do not use an audit event as a substitute for a typed domain event.

## 2. Minimum audit event contract

Required fields:
- id UUID;
- tenant_id (nullable only for explicitly approved platform-level events);
- actor_person_id (nullable only for approved system/worker events);
- actor_auth_user_id snapshot only if privacy/security approves; do not expose it to general academic readers;
- action_code;
- target_type and target_id;
- request_id/correlation_id;
- reason where action requires rationale;
- authorization context snapshot: permission code and scope identifier, not a copy of every grant;
- source_channel;
- recorded_at server timestamp;
- metadata JSONB with allowlisted keys only.

Do not store access tokens, passwords, secrets, full JWTs, unnecessary PII or raw request payloads in audit metadata. Store normalized request fingerprint where idempotency requires it, not full sensitive payload.

## 3. Required domain event coverage

- assignment draft created/version created;
- assignment approved/rejected;
- assignment published/withdrawn/amended;
- target snapshot generated/amended;
- obligation generated/exempted/removed/recognized;
- student report submitted/superseded;
- teacher observation appended;
- attempt cycle started/ended;
- answer evaluation recorded/superseded;
- completion verification recorded/superseded;
- correction cycle opened/submitted/reviewed/closed;
- doubt raised/assigned/started/resolved/confirmed/reopened;
- dispute raised/appeal decided;
- recognition decision recorded/revoked;
- membership created/suspended/revoked;
- role grant created/revoked;
- export requested/completed/failed;
- policy version published.

Domain events should reference typed source rows, exact aggregate/version IDs and actor person IDs. Avoid a generic event payload that becomes the only record of a domain fact.

## 4. Append-only controls

For evidence, observations, evaluations, verification decisions, correction/doubt/dispute events, recognition decisions and audit events:
- no application UPDATE/DELETE grants;
- no UPDATE/DELETE RLS policies;
- narrow INSERT command only;
- database trigger may reject UPDATE/DELETE as defense in depth;
- corrections use supersedes/reversal/revocation records;
- privileged maintenance access is separately controlled and audited;
- backups and retention policies preserve chain-of-custody.

Append-only does not mean every row is publicly readable. Read scope remains tenant/resource/field limited.

## 5. Evidence provenance

Every evidence/decision record must identify:
- canonical actor person;
- tenant;
- obligation and exact assignment item/version;
- event/decision type;
- server recorded timestamp;
- client occurred timestamp only as optional untrusted provenance;
- request/idempotency reference;
- predecessor/superseded record where relevant;
- evaluator/reviewer and rationale for decisions.

A student report, teacher observation, completion verification and answer evaluation are separate facts. No one event should imply another.

## 6. Security test fixtures

Use synthetic tenants A and B with:
- one institute admin in each tenant;
- teacher scoped to batch A1 only;
- reviewer scoped to review queue A1;
- student A1 and student A2;
- verified parent of A1;
- unverified and revoked guardian links;
- user with membership but no role grant;
- person with multiple tenant memberships;
- revoked/expired teacher grant;
- author and independent approver;
- reviewer who is also evidence author where self-review should fail;
- platform support identity with no routine academic grant.

No real student data or production PII in security tests.

## 7. Security test register

| ID | Test | Expected |
|---|---|---|
| SEC-001 | anon reads tenant/student/assignment data | Denied |
| SEC-002 | Auth UID without person mapping | Denied |
| SEC-003 | Ambiguous active Auth mappings | Denied and flagged |
| SEC-004 | Membership without permission grant invokes CMD-004 | Denied |
| SEC-005 | Tenant A user queries tenant B resource UUID | No data; no existence leak |
| SEC-006 | Teacher A1 reads batch A2 | Denied |
| SEC-007 | Teacher reads another tenant's batch | Denied |
| SEC-008 | Student A1 reads/submits for student A2 | Denied |
| SEC-009 | Parent with pending relationship reads learner evidence | Denied |
| SEC-010 | Revoked guardian reads after revocation | Denied next request |
| SEC-011 | Parent tries INSERT/UPDATE academic evidence | Denied |
| SEC-012 | Client supplies another actor_person_id | Ignored/rejected; actor derived from auth |
| SEC-013 | Client supplies role/admin flag | Ignored/rejected |
| SEC-014 | Teacher without publish grant calls CMD-004 | Denied |
| SEC-015 | Assignment author approves own version | Denied where separation policy applies |
| SEC-016 | Unapproved version published | Denied |
| SEC-017 | Cross-tenant source question linked to assignment | FK/command rejects |
| SEC-018 | Cross-tenant student target in publication | FK/command rejects |
| SEC-019 | Direct client INSERT obligation | Denied |
| SEC-020 | Direct UPDATE/DELETE evidence event | Denied |
| SEC-021 | Direct UPDATE/DELETE verification decision | Denied |
| SEC-022 | Student report idempotency replay | One event; original result returned |
| SEC-023 | Same key different payload | IDEMPOTENCY_CONFLICT |
| SEC-024 | Concurrent publication | One logical publication |
| SEC-025 | Failure mid-publication | Zero partial publication/obligations |
| SEC-026 | Teacher observation submitted as student report | Command rejects wrong event type |
| SEC-027 | Completion verification interpreted as correctness | Read model keeps dimensions separate |
| SEC-028 | Answer evaluation interpreted as completion | Read model keeps dimensions separate |
| SEC-029 | Reviewer verifies own report | Denied where policy applies |
| SEC-030 | Correction starts from non-returned decision | Denied |
| SEC-031 | Correction overwrites original evidence | Denied |
| SEC-032 | Doubt cohort resolution closes unrelated student cases | Denied; per-case events required |
| SEC-033 | SECURITY DEFINER helper callable by PUBLIC/anon | Denied |
| SEC-034 | Security-definer helper has mutable search_path | Static security check fails |
| SEC-035 | Public view bypasses source RLS | Security test/advisor fails |
| SEC-036 | Realtime subscription crosses tenant | Denied |
| SEC-037 | Storage object key guessed across tenant | Denied |
| SEC-038 | Export omits scope filter | Denied |
| SEC-039 | Export contains unauthorized fields | Denied |
| SEC-040 | Service-role secret present in frontend bundle/repository | CI secret scan fails |
| SEC-041 | Role revoked concurrently with command | Defined transaction policy enforced |
| SEC-042 | Outbox worker delivers same event twice | Consumer idempotency prevents duplicate side effect |
| SEC-043 | Audit metadata contains JWT/password/secret | Test rejects forbidden fields |
| SEC-044 | Historical actor/grant removed by cascade | FK restricts; archival workflow required |

## 8. Test evidence and release criteria

Each test result records:
- test ID and description;
- source commit SHA;
- migration head;
- database environment and PostgreSQL version;
- role/JWT fixture used;
- request payload fingerprint (not sensitive payload);
- expected and actual result;
- pass/fail;
- execution timestamp;
- defect reference and retest commit.

Release requires all applicable tests to pass in a disposable/staging database, plus independent security review. Supabase advisor output is supplemental and does not replace adversarial RLS testing.

## 9. Privacy, retention and operational policy gates

Still require owner/security approval:
- audit retention duration and legal hold;
- evidence/attachment retention and deletion/anonymization;
- whether actor Auth UID snapshots are necessary;
- export retention and signed URL lifetime;
- support break-glass authorization and notification;
- minimum cohort size/disclosure thresholds;
- operational log redaction and access policy.

Do not invent statutory retention periods or privacy exceptions in SQL.
