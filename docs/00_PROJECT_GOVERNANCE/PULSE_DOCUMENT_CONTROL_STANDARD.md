# PULSE — Document Control and Change Management Standard

- Document ID: PULSE-GOV-REPO-005
- Version: 0.1.0
- Status: Draft — proposed operating standard; pending owner approval
- Owner: Product Owner / Repository Maintainer
- Repository: `anshuljindalsecondbrain-art/pulse`
- Effective date: 2026-11-06
- Related: PULSE-GOV-REPO-003, PULSE-GOV-REPO-006
- Implementation authorization: Documentation governance only; no product implementation authorization

## 1. Purpose

This standard defines how PULSE documentation is created, edited, reviewed, approved, versioned, superseded and traced. GitHub is the canonical record of document content and its revision history. The project-wide Document Change Register is the central human-readable index of editing activity. Domain registers remain authoritative for the detailed status and ownership of their documents.

## 2. Sources of truth

1. GitHub repository `anshuljindalsecondbrain-art/pulse` is the canonical source for PULSE specifications, architecture decisions, source code, migrations, tests and delivery history.
2. The default branch `main` is the release baseline. Substantive work is proposed through feature branches and pull requests.
3. A pull request is the review and approval record for a change. A commit is the immutable content-history record.
4. `PULSE_DOCUMENT_CHANGE_REGISTER.md` is the central index of document edits and their review status. It does not replace Git commit history or domain-specific registers.
5. `PULSE_MASTER_DOCUMENTATION_INDEX.md` is the project navigation and authority index.
6. Each domain register remains the detailed authority for its domain.
7. A document's existence, commit or merged PR does not automatically approve product scope. Approval must be explicit and attributable to the required authority.

## 3. Change classification

| Class | Examples | Required handling |
|---|---|---|
| DOC | Wording, navigation, formatting, metadata | Feature branch and PR; update central change register |
| SPEC | Requirements, workflows, screen behavior, acceptance criteria | Feature branch and PR; impact review and domain-register update |
| ADR | Product or architecture decision | Record options, decision status, consequences and approval; update decision log |
| UX | Screen, journey, interaction, design-system changes | Stable screen/journey IDs and UI/UX register update |
| API | API/event contract changes | Versioned contract, compatibility and consumer review |
| DATA | Entity/schema/migration changes | Data register, reviewed migration, backup/rollback and security review |
| CODE | Application behavior | Tests, code review and release traceability |
| OPS | Deployment, backup, monitoring or incident process | Operational evidence and owner approval |

A change affecting more than one class must list every applicable class.

## 4. Branch and pull-request method

1. Start from the latest `main` unless an approved release branch is explicitly required.
2. Create a task-specific branch using one of:
   - `docs/<topic>-YYYY-MM-DD`
   - `feature/<module>-<capability>`
   - `fix/<module>-<issue>`
   - `refactor/<module>-<scope>`
3. Do not make substantive unreviewed edits directly on `main`.
4. Keep each branch focused and reviewable.
5. Open a PR to `main`; include change ID, purpose, affected artifacts, conflicts, checks, risks and approval requirements.
6. Update the central Document Change Register with branch, PR, commits, changed document IDs, versions, status and approval evidence.
7. Merge only after required reviews and checks. Automatic merge is not a substitute for review.
8. After merge, update the register with merge commit SHA and release reference (if any).
9. Preserve branches and history until the PR is merged or explicitly closed; do not force-push shared history without approval.

## 5. Document identity and versioning

Every controlled document must include a stable Document ID (never reused), title, version, lifecycle status, owner, required approvers, applicable product/module/phase, canonical path, last-updated date, related artifact IDs, change history and approval/implementation authorization statement where relevant.

Semantic document versions:
- Patch (0.1.0 → 0.1.1): editorial correction, link repair or clarification that does not change meaning.
- Minor (0.1.0 → 0.2.0): additive requirements or workflows preserving prior meaning.
- Major (0.9.0 → 1.0.0): approved baseline or material change to scope, semantics, ownership or compatibility.

A material scope change must never be hidden as a patch. Preserve prior content in Git history and identify superseded documents explicitly.

## 6. Lifecycle statuses

Keep dimensions separate:
- Document lifecycle: Proposed, Draft, In Review, Approved, Superseded, Archived.
- Implementation lifecycle: Not Authorized, Planned, In Progress, Implemented, Verified, Released.
- Decision status: Proposed, Accepted, Rejected, Superseded.
- PR status: Draft, Open, Changes Requested, Approved, Merged, Closed.

Do not label a document Approved merely because it was committed or merged.

## 7. Central editing register requirements

For each governed change, record:
- Change ID and date.
- Change class, request/source and rationale.
- Branch and PR URL/number.
- Commit SHA(s) and merge SHA.
- Every affected Document ID and path.
- Previous and new document versions.
- Summary of edits.
- Related decisions and requirements.
- Conflict/impact review and checks performed.
- Required approvals and evidence.
- Current status and follow-up actions.

Update domain registers when a domain document is added, revised, superseded or moved. Update the project index when a canonical governance document or domain authority is added or changes location.

## 8. Required PR description

- Change ID and change class.
- Objective and source decision/request.
- Branch and affected Document IDs/paths.
- Version changes.
- Scope conflicts and resolution.
- Requirement/screen/API/data/test traceability.
- Checks performed.
- Security/privacy/migration impact.
- Approvals required.
- Implementation authorization.
- Revert/rollback approach.

## 9. Editing protocol for AI agents and contributors

Before editing:
1. Read `AGENTS.md`, this standard, the project index and relevant domain register.
2. Inspect target documents and linked governing decisions.
3. Check for conflicts or superseding content.
4. Propose the smallest coherent change set.
5. Never invent approvals.

After editing:
1. Update document metadata and change history.
2. Update the central Document Change Register.
3. Update project/domain indexes and traceability registers.
4. Validate internal links and stable IDs.
5. Review the diff for unintended deletion or scope drift.
6. Report changed paths, versions, PR, checks, unresolved conflicts and approval state.

## 10. Security and backup boundaries

GitHub stores source text, code, migrations, tests and documentation. It must not store secrets, student PII, production database dumps or private uploaded content. Production data and file assets require independent encrypted backups and tested restore procedures. Git history is version control, not a substitute for production database backup.

## 11. Current status and approval

This standard is a proposed governance baseline. It does not certify that branch protection, required reviews, CI checks, automated backups or restore drills are configured. Those controls must be inspected and enabled separately.

- Product owner approval: Pending
- Repository maintainer approval: Pending
- Branch protection verification: Pending
- PR checks verification: Pending
- Implementation authorization: Not granted

## 12. Change history

| Version | Date | Status | Change |
|---|---|---|---|
| 0.1.0 | 2026-11-06 | Draft | Initial document control, central editing registry and branch/PR workflow standard |
