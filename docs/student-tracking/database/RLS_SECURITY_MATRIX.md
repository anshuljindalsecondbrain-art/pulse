# System A — RLS and Database Security Matrix

**Document ID:** STS-DB-SECURITY-001  
**Version:** 1.0.0  
**Status:** Design baseline; executable policies not yet approved  
**Date:** 2026-11-07

## 1. Security principles

- Deny by default.
- Authentication establishes the caller; it does not establish academic authorization.
- Resolve Supabase Auth UID to canonical person identity through a trusted mapping.
- Check active tenant membership, role grant and resource scope for each request.
- Do not trust client-provided tenant, actor, role, batch, centre or student IDs as proof of permission.
- Every tenant reference and relationship must be cross-tenant safe.
- Enable RLS on all exposed tenant-bearing tables.
- No broad client writes to evidence or lifecycle tables.
- Multi-record operations require narrow transactional commands.
- No service-role/secret key in browser.
- Append-only academic evidence and audit records must not have general UPDATE/DELETE access.

## 2. Actor families

| Actor | Access model |
|---|---|
| Student | Own identity and own active obligations; append own report; read own authorized history |
| Parent/guardian | Authenticated, currently verified parent-student relationship; read-only purpose-limited fields |
| Teacher | Explicit current teaching/resource assignment for relevant tenant, centre, batch and subject |
| Academic reviewer | Explicit review grant and scope; cannot approve own authored submission where separation applies |
| Mentor | Explicitly scoped learner/batch relationship; intervention records only within scope |
| Institute administrator | Manage institution resources and grants within delegated authority; administration does not imply academic review authority |
| Platform operator | Separate platform-level support authority, time-bound and audited; no ambient student-data access |

## 3. Table family access matrix

| Data family | Student | Parent | Teacher | Reviewer | Mentor | Admin |
|---|---|---|---|---|---|---|
| Tenant identity/context | Own authorized context | Linked context | Assigned tenant | Assigned tenant | Assigned tenant | Tenant admin |
| Student profile | Own allowed fields | Verified child, minimal fields | Assigned learners | Review scope | Assigned learners | Tenant roster scope |
| Batch/enrolment | Own current/history as policy | Minimal child context | Assigned batch | Review scope | Assigned batch | Tenant admin |
| Exercise draft | No | No | Authorized authors | Review scope | No | Configured admin scope |
| Published exercise/assignment | Own assigned work | Linked child read-only | Assigned resources | Review scope | Assigned worklist scope | Tenant reporting scope |
| Student obligations | Own only | Linked child projection | Assigned learners | Review scope | Assigned learners | Authorized admin/report |
| Student report events | Own only | Linked child permitted view | Assigned learners | Review scope | Limited summary | Restricted/audited |
| Teacher observations | Own visible outcomes only | Only authorized final visibility | Assigned scope | Review scope | Limited | Restricted |
| Answer evaluation / verification | Own decisions | Allowed final outcome only | Assigned scope | Assigned scope | Summary only | Restricted |
| Corrections | Own correction chain | Authorized child status | Assigned scope | Assigned scope | Summary only | Restricted |
| Doubts | Own cases | Limited child status | Assigned scope | Review scope | Assigned cases | Restricted |
| Disputes/appeals | Own case | Final authorized outcome only | Assigned if involved and policy allows | Independent reviewer | No | Limited case administration |
| Recognition | Own outcome | Limited child outcome | Authorized academic scope | Approval scope | No | Restricted |
| Audit/security logs | No | No | No general access | No general access | No | Restricted security role |

This is a design matrix. Every table/command requires a precise policy and positive/negative test; do not translate this table directly into generic RLS policies.

## 4. Required RLS policy tests

For every exposed table:
1. Unauthenticated request is denied.
2. Authenticated user with no tenant membership is denied.
3. Tenant A user cannot read/write Tenant B rows.
4. Student A cannot read/write Student B obligations/evidence.
5. Parent without verified active relationship is denied.
6. Parent cannot write any academic record.
7. Teacher with no current scope cannot access batch data by guessing a UUID.
8. Teacher in Batch A cannot access Batch B merely because both share a tenant.
9. Author cannot perform a prohibited self-approval.
10. Revoked membership/grant is denied on subsequent authorized requests.
11. UPDATE policy has both USING and WITH CHECK where updates are permitted.
12. Direct client writes to append-only records are denied except through approved narrow command paths.
13. Unauthorized callers cannot distinguish another tenant's resource existence through error behavior.
14. All SECURITY DEFINER functions are inventoried, scoped and explicitly tested.

## 5. Views and functions

- On PostgreSQL 15+, views exposing protected records must be reviewed for `security_invoker = true` where caller RLS should apply.
- A view is not safe merely because its underlying tables use RLS.
- Prefer SECURITY INVOKER functions where possible.
- SECURITY DEFINER functions require a documented exception, fixed safe search_path, non-exposed internal helpers, trusted actor derivation, tenant/resource checks and restricted EXECUTE grants.
- Revoke default PUBLIC EXECUTE where functions are not intended as public APIs.
- Use explicit grants for the minimum required role.
- Never use user-editable profile metadata as authorization truth.

## 6. Supabase keys

Client code may use the project URL and a publishable key. Service-role/secret credentials remain exclusively in trusted server environments and must not be committed or included in browser build variables.

## 7. Deployment status

No policy implementation or authorization grant has been applied to the live PULSE project during this documentation increment.
