# PULSE V10 Foundation

## Product
PULSE is an event-native, evidence-driven Student Academic Operating System for JEE/NEET academic operations.

## North-star loop
Plan → Teach → Practice → Assign → Attempt → Assess → Evaluate → Evidence → Diagnose → Prioritize → Recommend → Remedy/Recovery → Execute → Reassess → Measure Improvement.

## Truth layers
- Operational Truth: what happened.
- Evidence Truth: what the evidence demonstrates.
- Action Truth: what should happen next.

## Initial implementation order
1. Identity and tenant boundary
2. Academic context epochs
3. Versioned taxonomy and academic objects
4. Assignment instances
5. Domain events and auditability
6. Read models
7. Evidence ledger
8. Core student/teacher workflows
9. Assessment
10. Recovery and attention
11. Next Best Action

## Architecture rule
The UI consumes governed read models and commands. It does not become the system of record and does not independently calculate consequential academic truth.
