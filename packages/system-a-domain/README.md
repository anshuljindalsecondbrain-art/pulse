# PULSE System A Domain Foundation

This package contains the first persistence-independent System A domain slice.

## Included

- Immutable work-evidence and verification-decision contracts.
- Separate evidence source, actor attribution, work progress, verification purpose and outcome.
- Input validation for identifiers, timestamps and source/actor consistency.
- Duplicate event-ID detection for in-memory batches.
- Unit tests for the above invariants.

## Explicitly excluded

- Authentication and authorization.
- Tenant or student identity resolution.
- Database access, Supabase clients, RLS policies and migrations.
- Assignment publication, obligation expansion and notifications.
- UI components, routing and browser storage.
- Correctness or completion inference from student self-report.

Actor and tenant fields are domain data only. They are not proof of identity, role or permission. Trusted server/database boundaries must derive the actor and enforce tenant scope before persistence.

This package is intentionally framework-agnostic and can be consumed by the selected Vite application. It does not establish production readiness.
