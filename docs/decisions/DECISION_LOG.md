# PULSE — Architecture Decision Log

This log records current working decisions. New decisions should be appended with date, status, context, decision and consequences. Superseded decisions remain in history.

## D-001 — GitHub is the canonical project source
- **Date:** 2026-11-06
- **Status:** Accepted
- **Decision:** Keep the PULSE repository private and use one repository for the PULSE ecosystem.
- **Repository:** https://github.com/anshuljindalsecondbrain-art/pulse
- **Consequence:** Code, specifications, architecture decisions, migrations, tests and delivery history are maintained together. Lovable and Codex are development environments, not competing sources of truth.

## D-002 — Student Tracking and DTE are independent tracks
- **Status:** Accepted
- **Decision:** Student Work Tracking must operate from day one without requiring deep question classification. DTE progressively enriches question metadata and may enrich derived historical analytics later.
- **Consequence:** Tracking cannot be blocked by taxonomy completeness. Original student evidence remains immutable.

## D-003 — DTE is generic and configurable
- **Status:** Accepted
- **Decision:** Do not hardcode a universal six-level taxonomy. Support configurable hierarchical and non-hierarchical classification structures, multiple groups, relationship types and many-to-many mappings.
- **Consequence:** Academic taxonomy and final catalogue configuration are deferred; build the configurable software infrastructure first.

## D-004 — Question identity, version and placement are distinct
- **Status:** Accepted
- **Decision:** Model stable question identity, specific content version and exercise/test placement slot as separate concepts.
- **Consequence:** Reuse of a question across content placements does not create duplicate question identities. Student evidence can identify the exact version and context.

## D-005 — DRE is separate from DTE
- **Status:** Accepted
- **Decision:** Difficulty rules, scoring formulas, thresholds, exam multipliers and difficulty history belong to a separate Difficulty Rule Engine. DTE may retain a pointer to a version-specific external evaluation.
- **Consequence:** DTE implementation must not include difficulty algorithms or difficulty scoring logic.

## D-006 — Archetype identity is reusable
- **Status:** Accepted
- **Decision:** Archetype identity is separate from its classification relationships and must not be structurally confined to one sub-concept.
- **Consequence:** Archetypes can be reused across multiple questions and classification contexts.

## D-007 — Published academic mappings are versioned
- **Status:** Accepted
- **Decision:** Do not silently overwrite published mappings. Changes create a new revision with actor, timestamp, reason and review/publication history.
- **Consequence:** Historical mappings and audit evidence remain interpretable.

## D-008 — Tenant-specific content branding remains tenant-owned
- **Status:** Accepted
- **Decision:** Institution-specific series/product names and structures are not global categories. Optional standardized purpose mappings may be added without replacing local identity.
- **Consequence:** Content collections and product labels must be configurable and tenant-scoped.

## D-009 — Audit before schema modification
- **Date:** 2026-11-06
- **Status:** Accepted
- **Decision:** Inspect current source code, Supabase schema, migrations, RLS, functions and workflows before making structural changes.
- **Consequence:** No production migrations or destructive edits during the initial audit.

## Open decisions
- Final tenant sharing/licensing model for platform-wide questions and taxonomies.
- Exact role/permission matrix.
- Exact framework and deployment architecture after codebase inspection.
- Exact boundary between QBMS and Content Management.
- Search, async job and event infrastructure.
- Approval defaults and configurable publication controls.
- Formal status/event vocabulary for student tracking.


## D-010 — Configurable digital tagging scope change (proposed)
- **Date:** 2026-11-06
- **Status:** Proposed — not accepted; owner decision required
- **Source:** Product-planning discussion consolidated in `docs/dte/CONFIGURABLE_TAGGING_SYSTEM_SCOPE_CHANGE_PROPOSAL.md`.
- **Proposal:** Extend the institute-configurable classification framework toward multiple named structures per institute, context-specific assignments, independent contextual question mappings, a digital tagging workspace and governed integrations.
- **Conflict:** The existing `PULSE-DTE-DEC-004` and DTE Master Documentation Register define the current phase as offline framework management and explicitly defer digital question inventory and digital tagging.
- **Decision required:** Product owner must choose whether digital configurable tagging replaces the current phase, is a later phase, or is a separate module.
- **Architecture constraints:** QBMS/Q-GENOME owns canonical question identity/content unless a separate decision changes that boundary; DRE owns difficulty rules/calculation/history; Student Tracking owns student attempts and evidence; tagging completeness must not block Student Tracking.
- **Consequence while pending:** Existing offline-only phase boundary remains the controlling baseline. No schema, code, migration or deployment work is authorized by this proposal.
