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

  const cycleEvidence = input.existingEvidence.filter((item) =>
    item.instituteId === submission.instituteId &&
    item.studentId === submission.studentId &&
    item.obligationId === submission.obligationId &&
    item.exerciseSlotId === submission.exerciseSlotId &&
    item.source === "STUDENT_SELF_REPORT" &&
    item.attemptCycleId === submission.attemptCycleId,
  );
  const cycleById = new Map<string, SystemAWorkEvidence>();
  for (const event of cycleEvidence) {
    if (cycleById.has(event.id)) throw new Error("Evidence lineage contains duplicate event IDs.");
    cycleById.set(event.id, event);
  }

  const childByParent = new Map<string, string>();
  for (const event of cycleEvidence) {
    if (!event.supersedesEventId) continue;
    const parent = cycleById.get(event.supersedesEventId);
    if (!parent) throw new Error("Evidence lineage contains a missing or cross-cycle supersession parent.");
    if (childByParent.has(parent.id)) throw new Error("Evidence lineage is branched; more than one event supersedes the same parent.");
    childByParent.set(parent.id, event.id);
  }

  // Every cycle must be one linear chain. Detect cycles and disconnected roots
  // before allowing another event to extend the chain.
  const roots = cycleEvidence.filter((event) => !event.supersedesEventId);
  if (cycleEvidence.length > 0 && roots.length !== 1) {
    throw new Error("Evidence lineage must contain exactly one root for an attempt cycle.");
  }
  const visited = new Set<string>();
  let cursor = roots[0];
  let currentHead = cursor;
  while (cursor && !visited.has(cursor.id)) {
    visited.add(cursor.id);
    currentHead = cursor;
    const childId = childByParent.get(cursor.id);
    cursor = childId ? cycleById.get(childId) : undefined;
  }
  if (visited.size !== cycleEvidence.length) {
    throw new Error("Evidence lineage contains a cycle or disconnected event.");
  }
  if (submission.supersedesEventId) {
    if (!currentHead || currentHead.id !== submission.supersedesEventId) {
      throw new Error("A resubmission must supersede the current evidence lineage head, not a stale ancestor.");
    }
  } else if (cycleEvidence.length > 0) {
    throw new Error("A new report in an existing attempt cycle must explicitly supersede its current evidence lineage head.");
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
