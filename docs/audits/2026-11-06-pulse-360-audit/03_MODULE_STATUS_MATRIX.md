# Module Status Matrix

Status definitions: **Implemented** means present in production-connected runtime; **Prototype** means UI/demo behavior; **Domain-only** means pure logic/contracts; **Specified** means documentation only; **Not evidenced** means no reliable implementation evidence in the audited repository/live systems.

| System / module | Evidence | Status | Main gap |
|---|---|---|---|
| Shared identity/tenant core | CORE-001–009 | SPECIFIED / DRAFT | No live schema; owner decisions pending |
| System A Abhyas Matrix | React/Vite UI | PROTOTYPE | localStorage; no real roster/auth/persistence |
| System A Exercise Builder | UI + domain tests | PROTOTYPE + DOMAIN | No server persistence, publishing/revision workflow |
| Assignment publication | assignment-domain.ts | DOMAIN-ONLY | Atomic DB publication and target expansion absent |
| Evidence submission | evidence-submission-domain.ts | DOMAIN-ONLY | No live command endpoint or RLS |
| Teacher verification | teacher-verification-domain.ts | DOMAIN-ONLY | No trusted role validation or persisted decision |
| Corrections | correction-workflow-domain.ts | DOMAIN-ONLY | No transactional persistence/UI integration |
| Doubts | doubt-management-domain.ts | DOMAIN-ONLY | No operational case-management backend |
| Answer evaluation | answer-evaluation-domain.ts | DOMAIN-ONLY | No live persisted scoring/decision workflow |
| Evidence timeline | evidence-timeline-domain.ts | DOMAIN-ONLY | No event-store integration |
| Academic eligibility | academic-eligibility-domain.ts | DOMAIN/PROTOTYPE | Demo batch context is inferred from labels |
| Marking scheme | marking-scheme-domain.ts | DOMAIN/PROTOTYPE | No approved server-side policy/version store |
| QBMS / Q-GENOME | Architecture/requirements references | NOT EVIDENCED AS IMPLEMENTED | No production question service established |
| DTE M01–M18 | 18 module specs | SPECIFIED ONLY | No DTE application/backend found |
| DRE | DTE boundary docs | NOT EVIDENCED AS IMPLEMENTED | Separate engine required |
| Test management | Product-level docs/references | NOT EVIDENCED | No operational implementation evidence |
| AI Mentor | Product-level requirements/memory | NOT EVIDENCED | No model orchestration, evaluations or live intervention |
| Five A/B experiments | Uploaded source | SPECIFIED ONLY | No deterministic assignment/telemetry/admin analytics verified |
| Parent engagement card | Uploaded source | PROPOSED | Secure token lifecycle and privacy controls not verified |

## Interpretation

The strongest implemented layer is System A's frontend prototype and pure TypeScript domain logic. The weakest layer is production integration: database schema, trusted identity/authorization, transactional commands, UI/backend integration and operational testing. DTE is a well-documented planned subsystem, not a coded module set.
