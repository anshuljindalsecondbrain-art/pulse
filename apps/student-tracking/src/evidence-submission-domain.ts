import type { PlannedStudentObligation, AssignmentVersionSnapshot } from "./assignment-domain";
import { createWorkEvidence, type SystemAWorkEvidence } from "./workflow-domain";

export type StudentEvidenceSubmission = Readonly<{
  instituteId: string;
  studentId: string;
  obligationId: string;
  exerciseSlotId: string;
  actorId: string;
  workProgress: Exclude<SystemAWorkEvidence["workProgress"], "NOT_STARTED">;
  attemptCycleId: string;
  idempotencyKey: string;
  occurredAt: string;
  recordedAt: string;
  supersedesEventId?: string;
}>;

export type PreparedEvidenceSubmission =
  | Readonly<{ outcome: "CREATED"; evidence: SystemAWorkEvidence }>
  | Readonly<{ outcome: "IDEMPOTENT_REPLAY"; evidence: SystemAWorkEvidence }>;

/**
 * Validates a learner report against an already-authorized, published obligation.
 * This function does not authenticate the actor, query storage or write records.
 * The caller must supply tenant-scoped authoritative records from a trusted server.
 */
export function prepareStudentEvidenceSubmission(input: {
  submission: StudentEvidenceSubmission;
  obligations: readonly PlannedStudentObligation[];
  assignmentVersions: readonly AssignmentVersionSnapshot[];
  existingEvidence: readonly SystemAWorkEvidence[];
  newEvidenceId: string;
}): PreparedEvidenceSubmission {
  const submission = input.submission;
  for (const [label, value] of Object.entries({
    instituteId: submission.instituteId,
    studentId: submission.studentId,
    obligationId: submission.obligationId,
    exerciseSlotId: submission.exerciseSlotId,
    actorId: submission.actorId,
    attemptCycleId: submission.attemptCycleId,
    idempotencyKey: submission.idempotencyKey,
    newEvidenceId: input.newEvidenceId,
  })) {
    if (!value.trim()) throw new Error(`${label} must be non-empty.`);
  }
  if (submission.actorId !== submission.studentId) {
    throw new Error("A student self-report must be submitted by the authenticated student identity.");
  }

  const obligation = input.obligations.find((item) => item.id === submission.obligationId);
  if (!obligation) throw new Error("The obligation does not exist in the authorized publication scope.");
  if (obligation.instituteId !== submission.instituteId || obligation.studentId !== submission.studentId) {
    throw new Error("The obligation does not belong to this student and institute.");
  }
  if (obligation.eligibility !== "ELIGIBLE") {
    throw new Error("Evidence cannot be submitted against an exempted or removed obligation.");
  }
  if (obligation.exerciseSlotId !== submission.exerciseSlotId) {
    throw new Error("The submitted question slot does not match the obligation.");
  }

  const version = input.assignmentVersions.find((item) => item.id === obligation.assignmentVersionId);
  if (!version || version.instituteId !== obligation.instituteId ||
      !version.slots.some((slot) => slot.id === obligation.exerciseSlotId)) {
    throw new Error("The obligation is not backed by a matching published assignment version and slot.");
  }

  const priorByKey = input.existingEvidence.filter((item) =>
    item.instituteId === submission.instituteId &&
    item.studentId === submission.studentId &&
    item.idempotencyKey === submission.idempotencyKey,
  );
  const payloadMatches = (event: SystemAWorkEvidence) =>
    event.obligationId === submission.obligationId &&
    event.exerciseSlotId === submission.exerciseSlotId &&
    event.actorId === submission.actorId &&
    event.actorRole === "STUDENT" &&
    event.source === "STUDENT_SELF_REPORT" &&
    event.workProgress === submission.workProgress &&
    event.attemptCycleId === submission.attemptCycleId &&
    event.occurredAt === submission.occurredAt &&
    event.supersedesEventId === submission.supersedesEventId;

  if (priorByKey.length > 1) throw new Error("Idempotency conflict: multiple records already use this key.");
  if (priorByKey.length === 1) {
    if (!payloadMatches(priorByKey[0])) {
      throw new Error("Idempotency conflict: this key was already used with a different submission payload.");
    }
    return Object.freeze({ outcome: "IDEMPOTENT_REPLAY", evidence: priorByKey[0] });
  }

  if (input.existingEvidence.some((item) => item.id === input.newEvidenceId)) {
    throw new Error("newEvidenceId must be unique.");
  }

  if (submission.supersedesEventId) {
    const superseded = input.existingEvidence.find((item) => item.id === submission.supersedesEventId);
    if (!superseded ||
        superseded.instituteId !== submission.instituteId ||
        superseded.studentId !== submission.studentId ||
        superseded.obligationId !== submission.obligationId ||
        superseded.exerciseSlotId !== submission.exerciseSlotId ||
        superseded.source !== "STUDENT_SELF_REPORT") {
      throw new Error("A resubmission must supersede prior evidence for the same learner and question obligation.");
    }
    if (superseded.attemptCycleId !== submission.attemptCycleId) {
      throw new Error("A resubmission within a correction cycle must preserve the original attemptCycleId.");
    }
  }

  const evidence = createWorkEvidence({
    id: input.newEvidenceId,
    instituteId: submission.instituteId,
    studentId: submission.studentId,
    obligationId: submission.obligationId,
    exerciseSlotId: submission.exerciseSlotId,
    actorId: submission.actorId,
    actorRole: "STUDENT",
    source: "STUDENT_SELF_REPORT",
    workProgress: submission.workProgress,
    attemptCycleId: submission.attemptCycleId,
    idempotencyKey: submission.idempotencyKey,
    occurredAt: submission.occurredAt,
    recordedAt: submission.recordedAt,
    ...(submission.supersedesEventId ? { supersedesEventId: submission.supersedesEventId } : {}),
  });
  return Object.freeze({ outcome: "CREATED", evidence });
}
