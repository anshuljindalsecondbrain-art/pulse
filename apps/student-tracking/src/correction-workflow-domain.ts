import {
  createSystemAVerificationDecision,
  createWorkEvidence,
  type CorrectionState,
  type SystemAWorkEvidence,
  type SystemAVerificationDecision,
} from "./workflow-domain";

export type CorrectionCycle = Readonly<{
  id: string;
  instituteId: string;
  studentId: string;
  obligationId: string;
  exerciseSlotId: string;
  originalEvidenceEventId: string;
  originalAttemptCycleId: string;
  originatingReturnedDecisionId: string;
  state: CorrectionState;
  latestCorrectionEvidenceEventId?: string;
  latestReviewDecisionId?: string;
  startedAt: string;
  updatedAt: string;
  closedAt?: string;
}>;

export type CorrectionTransitionEvent = Readonly<{
  id: string;
  correctionCycleId: string;
  instituteId: string;
  obligationId: string;
  actorId: string;
  actorRole: "STUDENT" | "TEACHER" | "ACADEMIC_REVIEWER";
  action: "START" | "SUBMIT" | "ACCEPT" | "RETURN" | "CLOSE";
  fromState: CorrectionState;
  toState: CorrectionState;
  reason: string;
  occurredAt: string;
  relatedEvidenceEventId?: string;
  relatedDecisionId?: string;
}>;

export type CorrectionSubmission = Readonly<{
  correctionCycleId: string;
  originatingReturnedDecisionId: string;
  evidence: SystemAWorkEvidence;
  submittedAt: string;
}>;

export type CorrectionReviewRecord = Readonly<{
  correctionCycleId: string;
  decision: SystemAVerificationDecision;
}>;

export type CorrectionCommandResult<T> = Readonly<{
  outcome: "CREATED" | "IDEMPOTENT_REPLAY";
  value: T;
  event?: CorrectionTransitionEvent;
}>;

function requireText(value: string, label: string): void {
  if (!value.trim()) throw new Error(`${label} must be non-empty.`);
}

function requireTimestamp(value: string, label: string): void {
  if (!Number.isFinite(Date.parse(value))) throw new Error(`${label} must be a valid timestamp.`);
}

function requireReason(value: string): string {
  requireText(value, "reason");
  return value.trim();
}

function makeEvent(input: CorrectionTransitionEvent): CorrectionTransitionEvent {
  requireText(input.id, "eventId");
  requireText(input.correctionCycleId, "correctionCycleId");
  requireText(input.instituteId, "instituteId");
  requireText(input.obligationId, "obligationId");
  requireText(input.actorId, "actorId");
  const reason = requireReason(input.reason);
  requireTimestamp(input.occurredAt, "occurredAt");
  return Object.freeze({ ...input, reason });
}

function sameEvidencePayload(
  existing: SystemAWorkEvidence,
  input: CorrectionSubmissionCommand,
): boolean {
  return existing.instituteId === input.instituteId &&
    existing.studentId === input.studentId &&
    existing.obligationId === input.obligationId &&
    existing.exerciseSlotId === input.exerciseSlotId &&
    existing.actorId === input.actorId &&
    existing.actorRole === "STUDENT" &&
    existing.source === "STUDENT_SELF_REPORT" &&
    existing.workProgress === input.workProgress &&
    existing.attemptCycleId === input.attemptCycleId &&
    existing.idempotencyKey === input.idempotencyKey &&
    existing.occurredAt === input.occurredAt &&
    existing.supersedesEventId === input.supersedesEventId;
}

/** Start one correction cycle from the exact completion decision that returned the original submission. */
export function prepareCorrectionStart(input: {
  command: {
    cycleId: string;
    eventId: string;
    instituteId: string;
    studentId: string;
    obligationId: string;
    actorId: string;
    reason: string;
    occurredAt: string;
  };
  authorizedStudentObligationIds: readonly string[];
  originalEvidence: SystemAWorkEvidence;
  returnedDecision: SystemAVerificationDecision;
  existingCycles?: readonly CorrectionCycle[];
}): CorrectionCommandResult<CorrectionCycle> {
  const c = input.command;
  for (const [label, value] of Object.entries({
    cycleId: c.cycleId, eventId: c.eventId, instituteId: c.instituteId,
    studentId: c.studentId, obligationId: c.obligationId, actorId: c.actorId,
  })) requireText(value, label);
  const reason = requireReason(c.reason);
  requireTimestamp(c.occurredAt, "occurredAt");
  if (c.actorId !== c.studentId) throw new Error("Only the original student may start this correction.");
  if (!input.authorizedStudentObligationIds.includes(c.obligationId)) {
    throw new Error("Student is not authorized for this obligation.");
  }
  const evidence = input.originalEvidence;
  const decision = input.returnedDecision;
  if (evidence.instituteId !== c.instituteId || evidence.studentId !== c.studentId ||
      evidence.obligationId !== c.obligationId) {
    throw new Error("Original evidence does not belong to this student, institute and obligation.");
  }
  if (evidence.source !== "STUDENT_SELF_REPORT" || evidence.actorRole !== "STUDENT" ||
      evidence.workProgress !== "SUBMITTED") {
    throw new Error("Correction must originate from a submitted student self-report.");
  }
  if (decision.instituteId !== c.instituteId || decision.obligationId !== c.obligationId ||
      decision.evidenceEventId !== evidence.id || decision.purpose !== "COMPLETION" ||
      decision.outcome !== "RETURNED") {
    throw new Error("Correction must reference the exact returned completion decision for the original evidence.");
  }

  const prior = (input.existingCycles ?? []).find((item) => item.id === c.cycleId);
  if (prior) {
    const same = prior.instituteId === c.instituteId && prior.studentId === c.studentId &&
      prior.obligationId === c.obligationId && prior.originalEvidenceEventId === evidence.id &&
      prior.originatingReturnedDecisionId === decision.id && prior.startedAt === c.occurredAt;
    if (!same) throw new Error("Correction cycle ID conflict: identifier already belongs to different content.");
    return Object.freeze({ outcome: "IDEMPOTENT_REPLAY", value: prior });
  }

  const cycle: CorrectionCycle = Object.freeze({
    id: c.cycleId, instituteId: c.instituteId, studentId: c.studentId,
    obligationId: c.obligationId, exerciseSlotId: evidence.exerciseSlotId,
    originalEvidenceEventId: evidence.id, originalAttemptCycleId: evidence.attemptCycleId,
    originatingReturnedDecisionId: decision.id, state: "IN_PROGRESS",
    startedAt: c.occurredAt, updatedAt: c.occurredAt,
  });
  const event = makeEvent({
    id: c.eventId, correctionCycleId: cycle.id, instituteId: c.instituteId,
    obligationId: c.obligationId, actorId: c.actorId, actorRole: "STUDENT",
    action: "START", fromState: "REQUIRED", toState: "IN_PROGRESS",
    reason, occurredAt: c.occurredAt, relatedEvidenceEventId: evidence.id,
    relatedDecisionId: decision.id,
  });
  return Object.freeze({ outcome: "CREATED", value: cycle, event });
}

export type CorrectionSubmissionCommand = Readonly<{
  instituteId: string;
  studentId: string;
  obligationId: string;
  actorId: string;
  workProgress: "ATTEMPTED" | "SUBMITTED";
  attemptCycleId: string;
  idempotencyKey: string;
  occurredAt: string;
  recordedAt: string;
  reason: string;
  supersedesEventId: string;
}>;

/** Append a correction submission; the original attempt-cycle identity is immutable. */
export function prepareCorrectionSubmission(input: {
  cycle: CorrectionCycle;
  command: CorrectionSubmissionCommand;
  existingEvidence: readonly SystemAWorkEvidence[];
  existingSubmissions: readonly CorrectionSubmission[];
  newEvidenceId: string;
  eventId: string;
}): CorrectionCommandResult<{ cycle: CorrectionCycle; submission: CorrectionSubmission }> {
  const { cycle, command: c } = input;
  for (const [label, value] of Object.entries({
    instituteId: c.instituteId, studentId: c.studentId, obligationId: c.obligationId,
    actorId: c.actorId, attemptCycleId: c.attemptCycleId, idempotencyKey: c.idempotencyKey,
    newEvidenceId: input.newEvidenceId, eventId: input.eventId, supersedesEventId: c.supersedesEventId,
  })) requireText(value, label);
  const reason = requireReason(c.reason);
  requireTimestamp(c.occurredAt, "occurredAt");
  requireTimestamp(c.recordedAt, "recordedAt");
  if (c.actorId !== c.studentId || c.studentId !== cycle.studentId) {
    throw new Error("Only the original student may submit correction work.");
  }
  if (c.instituteId !== cycle.instituteId || c.obligationId !== cycle.obligationId) {
    throw new Error("Correction submission crosses institute or obligation scope.");
  }
  if (c.attemptCycleId !== cycle.originalAttemptCycleId) {
    throw new Error("Correction must preserve the original attemptCycleId.");
  }
  if (cycle.state !== "IN_PROGRESS") throw new Error("Correction must be in progress before resubmission.");

  const priorByKey = input.existingSubmissions.filter((item) =>
    item.evidence.instituteId === c.instituteId &&
    item.evidence.studentId === c.studentId &&
    item.evidence.idempotencyKey === c.idempotencyKey);
  if (priorByKey.length > 1) throw new Error("Correction idempotency key has multiple existing records.");
  if (priorByKey.length === 1) {
    const prior = priorByKey[0];
    if (prior.correctionCycleId !== cycle.id || !sameEvidencePayload(prior.evidence, c)) {
      throw new Error("Correction idempotency conflict: key reused with different content.");
    }
    return Object.freeze({ outcome: "IDEMPOTENT_REPLAY", value: Object.freeze({ cycle, submission: prior }) });
  }
  if (input.existingEvidence.some((item) => item.id === input.newEvidenceId)) {
    throw new Error("Correction evidence ID must be unique.");
  }
  const expectedSuperseded = cycle.latestCorrectionEvidenceEventId ?? cycle.originalEvidenceEventId;
  if (c.supersedesEventId !== expectedSuperseded) {
    throw new Error("Correction must supersede the latest evidence in this exact correction chain.");
  }
  const superseded = input.existingEvidence.find((item) => item.id === c.supersedesEventId);
  if (!superseded || superseded.instituteId !== cycle.instituteId ||
      superseded.studentId !== cycle.studentId || superseded.obligationId !== cycle.obligationId ||
      superseded.exerciseSlotId !== cycle.exerciseSlotId ||
      superseded.attemptCycleId !== cycle.originalAttemptCycleId ||
      superseded.source !== "STUDENT_SELF_REPORT") {
    throw new Error("Superseded evidence must belong to the same learner, obligation, slot and original attempt.");
  }

  const evidence = createWorkEvidence({
    id: input.newEvidenceId, instituteId: cycle.instituteId, studentId: cycle.studentId,
    obligationId: cycle.obligationId, exerciseSlotId: cycle.exerciseSlotId,
    actorId: c.actorId, actorRole: "STUDENT", source: "STUDENT_SELF_REPORT",
    workProgress: c.workProgress, attemptCycleId: cycle.originalAttemptCycleId,
    idempotencyKey: c.idempotencyKey, occurredAt: c.occurredAt, recordedAt: c.recordedAt,
    supersedesEventId: c.supersedesEventId,
  });
  const submission: CorrectionSubmission = Object.freeze({
    correctionCycleId: cycle.id,
    originatingReturnedDecisionId: cycle.originatingReturnedDecisionId,
    evidence,
    submittedAt: c.recordedAt,
  });
  const nextCycle: CorrectionCycle = Object.freeze({
    ...cycle, state: "RESUBMITTED", latestCorrectionEvidenceEventId: evidence.id,
    updatedAt: c.recordedAt,
  });
  const event = makeEvent({
    id: input.eventId, correctionCycleId: cycle.id, instituteId: cycle.instituteId,
    obligationId: cycle.obligationId, actorId: c.actorId, actorRole: "STUDENT",
    action: "SUBMIT", fromState: cycle.state, toState: "RESUBMITTED",
    reason, occurredAt: c.recordedAt, relatedEvidenceEventId: evidence.id,
  });
  return Object.freeze({ outcome: "CREATED", value: Object.freeze({ cycle: nextCycle, submission }), event });
}

export type CorrectionReviewCommand = Readonly<{
  instituteId: string;
  reviewerId: string;
  reviewerRole: "TEACHER" | "ACADEMIC_REVIEWER";
  obligationId: string;
  evidenceEventId: string;
  outcome: "ACCEPTED" | "RETURNED";
  reason: string;
  decidedAt: string;
  decisionId: string;
  supersedesDecisionId?: string;
}>;

/** Review only the latest correction submission for the exact cycle and obligation. */
export function prepareCorrectionReview(input: {
  cycle: CorrectionCycle;
  submission: CorrectionSubmission;
  command: CorrectionReviewCommand;
  authorizedObligationIds: readonly string[];
  existingReviews: readonly CorrectionReviewRecord[];
  eventId: string;
}): CorrectionCommandResult<{ cycle: CorrectionCycle; review: CorrectionReviewRecord }> {
  const { cycle, submission, command: c } = input;
  for (const [label, value] of Object.entries({
    instituteId: c.instituteId, reviewerId: c.reviewerId, obligationId: c.obligationId,
    evidenceEventId: c.evidenceEventId, decisionId: c.decisionId, eventId: input.eventId,
  })) requireText(value, label);
  const reason = requireReason(c.reason);
  requireTimestamp(c.decidedAt, "decidedAt");
  if (!["TEACHER", "ACADEMIC_REVIEWER"].includes(c.reviewerRole)) {
    throw new Error("Only a teacher or academic reviewer may review correction work.");
  }
  if (!input.authorizedObligationIds.includes(c.obligationId)) {
    throw new Error("Reviewer is not authorized for this correction obligation.");
  }
  if (cycle.state !== "RESUBMITTED" || submission.correctionCycleId !== cycle.id ||
      submission.originatingReturnedDecisionId !== cycle.originatingReturnedDecisionId ||
      submission.evidence.id !== cycle.latestCorrectionEvidenceEventId ||
      c.evidenceEventId !== submission.evidence.id) {
    throw new Error("Review must reference the latest correction submission in this exact cycle.");
  }
  const evidence = submission.evidence;
  if (c.instituteId !== cycle.instituteId || c.obligationId !== cycle.obligationId ||
      evidence.instituteId !== cycle.instituteId || evidence.obligationId !== cycle.obligationId ||
      evidence.studentId !== cycle.studentId || evidence.attemptCycleId !== cycle.originalAttemptCycleId) {
    throw new Error("Correction review crosses institute, learner, obligation or attempt scope.");
  }
  if (c.reviewerId === cycle.studentId) throw new Error("A learner cannot review their own correction.");

  const priorById = input.existingReviews.find((item) => item.decision.id === c.decisionId);
  if (priorById) {
    const d = priorById.decision;
    const same = priorById.correctionCycleId === cycle.id && d.instituteId === c.instituteId &&
      d.obligationId === c.obligationId && d.evidenceEventId === c.evidenceEventId &&
      d.verifierId === c.reviewerId && d.purpose === "CORRECTION" && d.outcome === c.outcome &&
      d.reason === reason && d.decidedAt === c.decidedAt &&
      d.supersedesDecisionId === c.supersedesDecisionId;
    if (!same) throw new Error("Correction decision ID conflict: identifier already belongs to different content.");
    return Object.freeze({ outcome: "IDEMPOTENT_REPLAY", value: Object.freeze({ cycle, review: priorById }) });
  }
  const history = input.existingReviews.filter((item) =>
    item.correctionCycleId === cycle.id &&
    item.decision.evidenceEventId === evidence.id &&
    item.decision.purpose === "CORRECTION");
  const latest = history.slice().sort((a, b) =>
    Date.parse(a.decision.decidedAt) - Date.parse(b.decision.decidedAt) ||
    a.decision.id.localeCompare(b.decision.id)).at(-1);
  if (latest && c.supersedesDecisionId !== latest.decision.id) {
    throw new Error("A replacement review must supersede the latest decision for this correction submission.");
  }
  if (!latest && c.supersedesDecisionId) throw new Error("There is no prior review decision to supersede.");

  const decision = createSystemAVerificationDecision({
    id: c.decisionId, instituteId: cycle.instituteId, obligationId: cycle.obligationId,
    evidenceEventId: evidence.id, verifierId: c.reviewerId, purpose: "CORRECTION",
    outcome: c.outcome, reason, decidedAt: c.decidedAt,
    ...(c.supersedesDecisionId ? { supersedesDecisionId: c.supersedesDecisionId } : {}),
  });
  const review: CorrectionReviewRecord = Object.freeze({ correctionCycleId: cycle.id, decision });
  const nextCycle: CorrectionCycle = Object.freeze({
    ...cycle, state: c.outcome === "ACCEPTED" ? "ACCEPTED" : "REQUIRED",
    latestReviewDecisionId: decision.id, updatedAt: c.decidedAt,
  });
  const event = makeEvent({
    id: input.eventId, correctionCycleId: cycle.id, instituteId: cycle.instituteId,
    obligationId: cycle.obligationId, actorId: c.reviewerId, actorRole: c.reviewerRole,
    action: c.outcome === "ACCEPTED" ? "ACCEPT" : "RETURN",
    fromState: "RESUBMITTED", toState: nextCycle.state, reason,
    occurredAt: c.decidedAt, relatedEvidenceEventId: evidence.id, relatedDecisionId: decision.id,
  });
  return Object.freeze({ outcome: "CREATED", value: Object.freeze({ cycle: nextCycle, review }), event });
}

/** Close only the cycle whose latest review explicitly accepted its latest correction submission. */
export function prepareCorrectionClose(input: {
  cycle: CorrectionCycle;
  latestReview: CorrectionReviewRecord;
  command: {
    eventId: string;
    actorId: string;
    actorRole: "TEACHER" | "ACADEMIC_REVIEWER";
    reason: string;
    occurredAt: string;
  };
  authorizedObligationIds: readonly string[];
}): CorrectionCommandResult<CorrectionCycle> {
  const { cycle, latestReview, command: c } = input;
  requireText(c.eventId, "eventId");
  requireText(c.actorId, "actorId");
  const reason = requireReason(c.reason);
  requireTimestamp(c.occurredAt, "occurredAt");
  if (!input.authorizedObligationIds.includes(cycle.obligationId)) {
    throw new Error("Academic actor is not authorized to close this correction obligation.");
  }
  if (cycle.state !== "ACCEPTED" || latestReview.correctionCycleId !== cycle.id ||
      latestReview.decision.id !== cycle.latestReviewDecisionId ||
      latestReview.decision.outcome !== "ACCEPTED" ||
      latestReview.decision.purpose !== "CORRECTION" ||
      latestReview.decision.evidenceEventId !== cycle.latestCorrectionEvidenceEventId) {
    throw new Error("Only the latest accepted correction may be closed.");
  }
  const nextCycle: CorrectionCycle = Object.freeze({
    ...cycle, state: "CLOSED", updatedAt: c.occurredAt, closedAt: c.occurredAt,
  });
  const event = makeEvent({
    id: c.eventId, correctionCycleId: cycle.id, instituteId: cycle.instituteId,
    obligationId: cycle.obligationId, actorId: c.actorId, actorRole: c.actorRole,
    action: "CLOSE", fromState: "ACCEPTED", toState: "CLOSED",
    reason, occurredAt: c.occurredAt,
    ...(cycle.latestCorrectionEvidenceEventId ? { relatedEvidenceEventId: cycle.latestCorrectionEvidenceEventId } : {}),
    relatedDecisionId: latestReview.decision.id,
  });
  return Object.freeze({ outcome: "CREATED", value: nextCycle, event });
}
