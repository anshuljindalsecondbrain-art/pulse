/**
 * System A's first persistence-independent domain boundary.
 *
 * These records describe academic evidence and decisions. They do not perform
 * authentication, authorization, persistence, or tenant isolation. Actor and
 * tenant values supplied by a caller are data, never proof of permission.
 */

export type WorkProgress = "ATTEMPTED" | "SUBMITTED" | "SKIPPED";
export type EvidenceSource =
  | "STUDENT_SELF_REPORT"
  | "TEACHER_OBSERVATION"
  | "SYSTEM_IMPORT"
  | "AUTHORIZED_GUARDIAN_INPUT";
export type ActorRole =
  | "STUDENT"
  | "TEACHER"
  | "ACADEMIC_REVIEWER"
  | "PARENT"
  | "SYSTEM";

export type WorkEvidence = Readonly<{
  id: string;
  tenantId: string;
  studentId: string;
  obligationId: string;
  exerciseSlotId: string;
  actorId: string;
  actorRole: ActorRole;
  source: EvidenceSource;
  workProgress: WorkProgress;
  attemptCycleId: string;
  idempotencyKey: string;
  occurredAt: string;
  recordedAt: string;
  supersedesEventId?: string;
}>;

export type VerificationPurpose =
  | "ATTEMPT"
  | "COMPLETION"
  | "ANSWER_EVALUATION"
  | "CORRECTION"
  | "INDEPENDENT_SOLVE";

export type VerificationOutcome =
  | "CONFIRMED"
  | "NOT_CONFIRMED"
  | "CORRECT"
  | "INCORRECT"
  | "PARTIALLY_CORRECT"
  | "RETURNED"
  | "ACCEPTED"
  | "REJECTED";

export type VerificationDecision = Readonly<{
  id: string;
  tenantId: string;
  obligationId: string;
  evidenceEventId: string;
  verifierId: string;
  purpose: VerificationPurpose;
  outcome: VerificationOutcome;
  reason: string;
  decidedAt: string;
  supersedesDecisionId?: string;
}>;

function requireText(value: string, field: string): void {
  if (!value.trim()) throw new Error(`${field} must be non-empty.`);
}

function requireTimestamp(value: string, field: string): void {
  if (!Number.isFinite(Date.parse(value))) {
    throw new Error(`${field} must be a valid timestamp.`);
  }
}

function validateSourceActor(source: EvidenceSource, role: ActorRole): void {
  const valid =
    (source === "STUDENT_SELF_REPORT" && role === "STUDENT") ||
    (source === "TEACHER_OBSERVATION" && (role === "TEACHER" || role === "ACADEMIC_REVIEWER")) ||
    (source === "SYSTEM_IMPORT" && role === "SYSTEM") ||
    (source === "AUTHORIZED_GUARDIAN_INPUT" && role === "PARENT");

  if (!valid) throw new Error("Evidence source and actor role are inconsistent.");
}

/** Validates and freezes an evidence event; it does not persist or authorize it. */
export function createWorkEvidence(input: WorkEvidence): WorkEvidence {
  for (const [field, value] of Object.entries({
    id: input.id,
    tenantId: input.tenantId,
    studentId: input.studentId,
    obligationId: input.obligationId,
    exerciseSlotId: input.exerciseSlotId,
    actorId: input.actorId,
    attemptCycleId: input.attemptCycleId,
    idempotencyKey: input.idempotencyKey,
  })) requireText(value, field);

  requireTimestamp(input.occurredAt, "occurredAt");
  requireTimestamp(input.recordedAt, "recordedAt");
  validateSourceActor(input.source, input.actorRole);

  if (input.supersedesEventId !== undefined) {
    requireText(input.supersedesEventId, "supersedesEventId");
    if (input.supersedesEventId === input.id) {
      throw new Error("An evidence event cannot supersede itself.");
    }
  }

  return Object.freeze({ ...input });
}

function validatePurposeOutcome(purpose: VerificationPurpose, outcome: VerificationOutcome): void {
  const allowed: Record<VerificationPurpose, readonly VerificationOutcome[]> = {
    ATTEMPT: ["CONFIRMED", "NOT_CONFIRMED", "RETURNED", "REJECTED"],
    COMPLETION: ["CONFIRMED", "NOT_CONFIRMED", "RETURNED", "REJECTED"],
    ANSWER_EVALUATION: ["CORRECT", "INCORRECT", "PARTIALLY_CORRECT", "REJECTED"],
    CORRECTION: ["ACCEPTED", "RETURNED", "REJECTED"],
    INDEPENDENT_SOLVE: ["CONFIRMED", "NOT_CONFIRMED", "CORRECT", "INCORRECT", "PARTIALLY_CORRECT", "REJECTED"],
  };

  if (!allowed[purpose].includes(outcome)) {
    throw new Error("Verification outcome is incompatible with its purpose.");
  }
}

/** A decision references one exact evidence event and never mutates that event. */
export function createVerificationDecision(input: VerificationDecision): VerificationDecision {
  for (const [field, value] of Object.entries({
    id: input.id,
    tenantId: input.tenantId,
    obligationId: input.obligationId,
    evidenceEventId: input.evidenceEventId,
    verifierId: input.verifierId,
    reason: input.reason,
  })) requireText(value, field);

  requireTimestamp(input.decidedAt, "decidedAt");
  validatePurposeOutcome(input.purpose, input.outcome);

  if (input.supersedesDecisionId !== undefined) {
    requireText(input.supersedesDecisionId, "supersedesDecisionId");
    if (input.supersedesDecisionId === input.id) {
      throw new Error("A verification decision cannot supersede itself.");
    }
  }

  return Object.freeze({ ...input });
}

/**
 * Checks identity uniqueness within one proposed batch. Database constraints
 * and transaction-level idempotency remain mandatory at the persistence layer.
 */
export function assertUniqueEventIds<T extends { id: string }>(
  records: readonly T[],
  label: string,
): void {
  const seen = new Set<string>();
  for (const record of records) {
    requireText(record.id, `${label} id`);
    if (seen.has(record.id)) throw new Error(`Duplicate ${label} id: ${record.id}`);
    seen.add(record.id);
  }
}
