# PULSE Central Management Hub

- Document ID: PULSE-GOV-CENTRAL-001
- Version: 1.0.0
- Status: Draft — audit baseline; owner approval pending
- Audit snapshot: 2026-11-07
- Repository: anshuljindalsecondbrain-art/pulse
- Integration target: main
- Supabase: PULSE / nnvssbfezkliavwxhgbh / ap-south-1
- Implementation, merge and production database authorization: Not granted

## 1. Purpose

This is the single entry point for managing PULSE. It governs navigation, source authority, change control and integration. It does not replace domain specifications, owner decisions, requirement traceability, event records, issue registers, test evidence or release history.

## 2. System ownership map

| Domain | Authoritative responsibility | Boundary |
|---|---|---|
| Shared Platform | Identity, tenancy, memberships, roles, academic context, shared audit/event contracts | Reusable platform primitives |
| System A — Student Tracking / Abhyas Matrix | Daily tracking, exercises, assignments, obligations, student evidence, verification, corrections | Must function without QBMS/DTE enrichment |
| QBMS / Q-GENOME | Question identity, versions, content, source/media provenance, question-bank lifecycle | Question content authority |
| System B — DTE | Configurable classification frameworks, nodes, relationships, mappings, tagging workflow | Does not own question content, difficulty calculation or student evidence |
| DRE | Difficulty policies, calculations, evidence and history | Separate from DTE |
| Test Management | Test composition, delivery and administration | References QBMS identity/version |
| AI Mentor / Analytics | Derived insights, interventions, recommendations | Consumer of governed evidence |
| PEIGS | Engineering target/as-built/assurance registry | Index/evidence layer; not a competing domain register |

## 3. Source-of-truth hierarchy

1. Live environment: what is actually deployed/configured, not what should exist.
2. Merged code and migrations on main: accepted repository implementation.
3. Approved, versioned decision records: owner decisions within their scope.
4. Approved requirements/specifications: intended behavior subject to decisions.
5. Open PRs and feature branches: proposals/evidence, not canonical implementation.
6. Research notes, exports, screenshots and chat summaries: supporting evidence until promoted to controlled records.

A document in Git is not automatically approved. A migration file is not proof of application. A green build does not prove production runtime, database integration, authorization or academic correctness.

## 4. Target documentation structure

The following is the target structure for gradual adoption. It is not a claim that all folders already exist. Existing files must not be bulk-moved until references, ownership and path dependencies are checked.

```text
/
├── README.md
├── AGENTS.md
├── docs/
│   ├── 00-project-governance/
│   ├── 01-product/
│   ├── 02-architecture/
│   ├── 03-platform/
│   ├── 04-systems/
│   │   ├── system-a-student-tracking/
│   │   ├── system-b-deep-tagging/
│   │   ├── qbms-q-genome/
│   │   ├── dre/
│   │   ├── test-management/
│   │   └── ai-mentor/
│   ├── 05-data/
│   ├── 06-interfaces/
│   ├── 07-quality/
│   ├── 08-operations/
│   ├── 09-delivery/
│   └── 99-archive/
├── apps/
├── packages/
└── supabase/
    ├── config.toml
    ├── migrations/
    ├── functions/
    └── tests/
```

Folder responsibilities:
- 00-project-governance: central index, authority, change/branch registers, audits and project-wide decisions.
- 01-product: vision, product scope, outcomes, personas and roadmap.
- 02-architecture: cross-domain architecture and ADRs.
- 03-platform: identity, tenancy, authorization and shared contracts.
- 04-systems: domain-owned requirements, workflows, screens, APIs and module specs.
- 05-data: logical/physical models, ERDs, data dictionary, constraints and migration design.
- 06-interfaces: APIs, events, imports/exports and integration contracts.
- 07-quality: testing strategy, test plans, acceptance and verification evidence.
- 08-operations: deployment, observability, incident response, backup and recovery.
- 09-delivery: release plans, rollout and delivery tracking.
- 99-archive: superseded/historical records retained with pointers and provenance.

## 5. Document identity and naming

Filename: `<DOMAIN>_<ARTIFACT-TYPE>_<SHORT-SUBJECT>.md`.
Use uppercase domain/artifact tokens and underscores. Avoid final/latest/new2. Version and approval status belong in document metadata, not filename. Stable Document ID is primary identity; path is mutable metadata.

Controlled documents must include ID, title, version, status, owner, approver, scope/phase, last update, canonical path and related requirements/decisions. Statuses remain distinct: Draft, In Review, Approved, Implemented, Verified, Released, Superseded, Retired.

One canonical document per subject. Supporting documents must say so and link to the canonical record.

## 6. Domain ownership invariants

- System A owns student tracking evidence and workflow state.
- QBMS/Q-GENOME owns question identity/content/version.
- DTE owns configurable classification and tagging workflow.
- DRE owns difficulty calculation/history.
- Test Management owns test composition and administration.
- AI Mentor consumes governed evidence and must not silently mutate source records.
- PEIGS references canonical requirements, decisions, events, tests, issues and releases.
- Shared identity/tenancy concepts must be approved once; modules must not create parallel people, tenant, membership or student identity models.

## 7. Database authority and safety

Supabase live schema and migration history describe deployed DB state. GitHub migrations on the approved integration branch describe proposed release lineage. A feature-branch migration is not live state.

No divergent migration streams may be deployed together until tables, fields, constraints, RLS, grants and authorization have been reconciled. Never rewrite an applied migration. No service-role/secret key in browser code. Tenant isolation must be enforced by trusted server-side actor resolution, database constraints, grants and correctly designed RLS. Review views, functions and Storage policies independently. Production DDL requires a reviewed migration, recovery plan, explicit approval and post-change verification.

## 8. Change workflow

1. Read this hub, AGENTS.md and the owning system's canonical register/spec.
2. Identify change ID, owner, requirement and impacted domains.
3. Inspect current branch, code, tests, migrations and live environment as applicable.
4. Produce source and impact assessment for cross-domain changes.
5. Implement on a task-specific branch; keep changes small and reversible.
6. Run relevant typecheck, lint, unit, integration, security and build tests; state exactly what ran.
7. Update canonical documents and change register.
8. Open PR; implementation author does not self-certify approval.
9. Merge only after owner/security/QA gates.
10. Verify deployment/runtime and database state independently after release.

## 9. Current audit snapshot (2026-11-07)

### GitHub
- Private repository: anshuljindalsecondbrain-art/pulse; default branch main.
- 25 branches returned by branch listing.
- Four open PRs observed: #1, #2, #3, #4.
- PR #1: legacy V10 platform proposal; divergent implementation line.
- PR #2: System A foundation; broad app, schema proposal and governance source corpus.
- PR #3: configurable tagging/document-control proposal; DTE phase decision remains a hold point.
- PR #4: PEIGS architecture/schema proposal; documentation-only.
- V10 implementation branch compared with main: 19 ahead / 99 behind.
- PEIGS branch compared with main: 11 ahead / 0 behind.
- Configurable tagging branch compared with main: 2 ahead / 0 behind.
- System A/database governance/A2 branches are distinct, divergent branches. No blind merge, force-push or mass cherry-pick.

### Supabase
- Project PULSE, ref nnvssbfezkliavwxhgbh, region ap-south-1.
- No PULSE application tables returned in public, app_private or peigs.
- Applied migration history empty.
- Edge Functions: none.
- Supabase development branches: none.
- Security, performance and health advisors returned no lints at audit time.
- Installed extensions include pgcrypto, uuid-ossp, pg_stat_statements, pg_graphql and supabase_vault; vector is available but not installed.
- Supabase-managed auth/storage schemas are platform objects, not PULSE application tables.
- No advisor lints on an empty application schema is not a security certification and does not validate un-applied SQL.

## 10. Priority actions

| Priority | Action | Gate |
|---|---|---|
| P0 | Publish central hub and authority/branch registers | Documentation review |
| P0 | Reconcile main index and conflicting governance registers | No deletion; link validation |
| P0 | Inventory PR and branch content | Human disposition per branch |
| P0 | Resolve duplicate CORE-009 ID/version collision | Data/architecture owner |
| P0 | Resolve System A migration count discrepancy (25 explicit CREATE TABLE statements vs 26 prose claim) | Source check and owner sign-off |
| P0 | Preserve DEC-011/012/013 and M0001 approvals with original provenance | Do not rewrite source decisions |
| P1 | Choose canonical identity/tenancy/schema lineage | Product, architecture, data and security approval |
| P1 | Reconcile System A/DTE scope and preserve System A independence | Product/academic owner |
| P1 | Confirm application topology and Vercel root/build configuration | Deployment owner |
| P2 | Add automated docs link, duplicate-ID and migration checks | CI review |
| P2 | Implement PEIGS only after pilot/inventory validates the model | Separate authorization |

## 11. Explicit non-actions

This hub does not approve PRs, merge/rebase/delete branches, move/delete existing files, apply migrations, create DB objects, change Vercel configuration, deploy apps or approve open product decisions.

## 12. Limitations

This snapshot does not include full runtime access, penetration testing, backup verification, migration dry-run, exhaustive grants/policy review or complete Vercel project configuration. Re-audit before release or DDL.
