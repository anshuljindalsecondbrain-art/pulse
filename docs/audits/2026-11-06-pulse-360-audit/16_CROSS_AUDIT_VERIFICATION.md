# Cross-Audit Verification

## Method

Cross-checks were performed across repository README, AGENTS, System A README/backend status/database architecture, CORE-001/002/003/009, DTE module register and prior audits, proposed migration, App.tsx, repository adapter, requirement traceability, live Supabase metadata, GitHub PR/Actions and Vercel deployment metadata.

## Consistency matrix

| Claim | Independent evidence | Result |
|---|---|---|
| Main UI is local demo | README, app README, App.tsx localStorage reads/writes | CONFIRMED |
| Repository adapter is separate from UI | App.tsx imports do not include adapter; adapter exists separately | CONFIRMED |
| Live database is empty | Supabase list tables, migrations, edge functions | CONFIRMED |
| Proposed migration not applied | Live migration history empty; repository file marked proposed | CONFIRMED |
| No-lint result is not schema validation | Empty schema + advisor output | CONFIRMED LIMITATION |
| DTE has 18 module specs | Git tree + module register | CONFIRMED |
| DTE audit is documentation-only | DTE_18_MODULE_AUDIT scope statement | CONFIRMED |
| Current PR is draft/open/unmerged | PR #2 metadata | CONFIRMED |
| CI green on current PR head | Latest successful run SHA differs from PR head | NOT CONFIRMED |
| Vercel current PR head deployed | Latest READY deployment SHA differs from PR head | NOT CONFIRMED |
| Production release is live | Vercel project metadata reports live=false; target metadata null | NOT ESTABLISHED |
| Five A/B experiments implemented | Source doc describes experiments; no matching telemetry service verified | NOT CONFIRMED |
| Production security controls work | No live app schema/RLS/API | NOT TESTABLE |

## Conflicts and reconciliation

1. **Schema identity conflict:** proposed migration uses `sa_institutes` and direct Auth-user linkage; canonical CORE uses `tenants`, `people`, Auth identity links, memberships and scoped role grants. Resolve before DDL.
2. **Classroom status count:** source has six states; current app includes Partially Correct in addition to the six source labels. Product owner must decide whether this is an additional operational state or a separate evaluation dimension.
3. **Current SHA drift:** PR head, latest CI success and latest Vercel READY deployment refer to different SHAs. Release claims must be bound to one exact SHA.
4. **Design vs implementation:** extensive docs do not prove runtime functionality; report status matrix explicitly separates them.

## Audit confidence

High confidence for repository metadata and live project metadata at the inspection time. Medium confidence for architecture completeness because not every line of every design document was exhaustively parsed. Low/no confidence for unexecuted runtime, browser, penetration, load and production behavior; these are marked unverified rather than inferred.
