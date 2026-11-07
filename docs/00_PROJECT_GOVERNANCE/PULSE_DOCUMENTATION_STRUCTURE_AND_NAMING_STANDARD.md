# PULSE Documentation Structure and Naming Standard

- Document ID: PULSE-GOV-DOC-STRUCTURE-001
- Version: 1.0.0
- Status: Draft

## Filename

Use `<DOMAIN>_<ARTIFACT-TYPE>_<SHORT-SUBJECT>.md`. Use uppercase domain/artifact tokens and underscores. Avoid final/latest/new2. Version and approval status belong in metadata, not filenames. Stable Document ID is primary identity; path is mutable.

## Folder responsibilities

- 00-project-governance: central index, authority/branch/change registers, audits and project-wide decisions.
- 01-product: product vision, scope, personas, outcomes and roadmap.
- 02-architecture: cross-domain architecture and ADRs.
- 03-platform: identity, tenancy, authorization and shared contracts.
- 04-systems/<system>: domain requirements, workflows, screen/API specs and module registers.
- 05-data: ERDs, logical/physical models, dictionary, constraints and migration design.
- 06-interfaces: API, event, import/export and integration contracts.
- 07-quality: test strategy, plans, acceptance and verification evidence.
- 08-operations: deployment, observability, security runbooks, incident response, backup/recovery.
- 09-delivery: releases, rollout plans and delivery status.
- 99-archive: superseded/historical sources retained with provenance and pointers.

## Safe move protocol

1. Update document canonical-path metadata.
2. Move with Git history-preserving rename where possible.
3. Update internal Markdown links, indexes, relative asset paths, code imports, CI paths and automation references.
4. Run case-sensitive link checks and tests.
5. Record old path, new path, commit, owner and reason in the change register.
6. Add compatibility pointer where external references require it.
7. Never move an active migration or application source file for naming consistency without dependency review.

This standard defines a target state; it does not perform mass relocation. Migrate one bounded domain at a time.
