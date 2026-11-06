# Security and Privacy Audit

## Evidence-based status

The live Supabase project contains no application tables, migrations or Edge Functions. Therefore, no deployed tenant RLS policy, application grant matrix, secure RPC, storage policy or server authorization boundary could be validated. Empty-schema advisor output is not a security certification.

## Findings

### Critical
- **No live authorization implementation:** RLS/grants/role policies are not deployed.
- **No trusted server command boundary:** actor, tenant, role and scope validation are not implemented in a production backend.
- **No production data path:** the main UI is localStorage-backed and should remain fictional/demo-only.

### High
- Repository adapter's client-side filters are defense in depth only. Database-side RLS and server-derived actor context are mandatory.
- Proposed SQL stores actor IDs/roles in event records; the authoritative actor must be derived from Auth identity and trusted membership/role records, not client payload.
- Parent/student access requires verified, tenant-scoped, time-bounded and revocable links. Tokenized parent cards from the uploaded source require high-entropy tokens, short expiry, revocation, scope limitation, rate limits, audit and careful PII minimization.
- Security review must include BOLA/IDOR, privilege escalation, stale JWT claims, cross-tenant foreign-key attacks, replay, idempotency collisions and unauthorized event mutation.
- No verified data retention, deletion/rectification, consent, export or breach-response implementation was found.

## Required Supabase security controls

- RLS on every exposed tenant-owned table; grants and RLS designed together.
- Deny-by-default policies with tenant, membership, action and resource scope.
- UPDATE requires a SELECT policy and both USING and WITH CHECK.
- Do not treat `TO authenticated` alone as authorization.
- Do not use user-editable Auth metadata for authorization.
- Do not expose service-role/secret keys in browser bundles.
- Prefer SECURITY INVOKER. Any justified SECURITY DEFINER function must be in a non-exposed schema, have a fixed safe search_path, derive actor identity, validate tenant/resource scope and have explicit EXECUTE grants.
- Restrict views or use security-invoker semantics as appropriate.
- Append-only evidence and audit data must be enforced by database controls and tests, not UI conventions.

## Privacy gates

Define purpose, minimum data, retention, access, parent visibility, consent/notice, export, correction, erasure exceptions, audit access and incident response before importing real learner records. Treat student data as high sensitivity and keep all demos synthetic.
