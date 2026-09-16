# PULSE Engineering Agent Constitution

## Source of truth
The PULSE V10 Master Project Bible is the architectural source of truth. When code and specification conflict, do not silently choose; identify the conflict and stop for clarification when it affects academic truth, security, data integrity, or irreversible behavior.

## Mission
Build PULSE as an evidence-driven Student Academic Operating System for JEE/NEET academic operations.

## Non-negotiable rules
1. Inspect before modifying.
2. Store facts; derive intelligence.
3. Never fabricate academic data.
4. Missing data is not zero.
5. Historical academic truth must not be silently rewritten.
6. Academic mutations must be auditable.
7. Database changes require migrations.
8. Tenant boundaries and authorization are mandatory.
9. Business intelligence belongs in domain/application layers, not UI components.
10. Calculation and policy versions must be explicit.
11. Recommendations must preserve evidence provenance.
12. High-consequence decisions require human authorization.
13. Every completed feature must have appropriate automated tests.
14. Run typecheck, lint and tests before declaring completion.
15. Never bypass failing validation merely to make CI green.

## Execution loop
Inspect -> Plan -> Implement -> Validate -> Fix -> Revalidate -> Review diff -> Commit/PR -> Report.

## Stop conditions
Stop and request human review for destructive migrations, data loss, security-policy changes, scoring-rule changes, mastery/decision-policy changes, unexplained source conflicts, or irreversible production operations.
