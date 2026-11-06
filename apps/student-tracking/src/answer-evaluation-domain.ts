import {
  createSystemAVerificationDecision,
  type SystemAWorkEvidence,
  type SystemAVerificationDecision,
} from "./workflow-domain";

export type AnswerEvaluationOutcome = "CORRECT" | "INCORRECT" | "PARTIALLY_CORRECT";
export type AnswerEvaluatorRole = "TEACHER" | "ACADEMIC_REVIEWER";

export type AnswerEvaluationObligation = Readonly<{
  id: string;
  instituteId: string;
  studentId: string;
  exerciseSlotId: string;
  eligibility: "ELIGIBLE" | "EXEMPTED" | "REMOVED";
}>;

export type AnswerEvaluationCommand = Readonly<{
  decisionId: string;
  instituteId: string;
  obligationId: string;
  exerciseSlotId: string;
  evidenceEventId: string;
  evaluatorId: string;
  evaluatorRole: AnswerEvaluatorRole;
  outcome: AnswerEvaluationOutcome;
  reason: string;
  decidedAt: string;
  supersedesDecisionId?: string;
}>;

export type PreparedAnswerEvaluation =
  | Readonly<{ outcome: "CREATED"; decision: SystemAVerificationDecision }>
  | Readonly<{ outcome: "IDEMPOTENT_REPLAY"; decision: SystemAVerificationDecision }>;

/**
 * Prepares an independent answer-evaluation decision for one exact submitted
 * learner evidence event. Completion verification is deliberately not a
 * prerequisite and is never inferred from this evaluation.
 */
export function prepareAnswerEvaluation(input: {
  command: AnswerEvaluationCommand;
  obligation: AnswerEvaluationObligation;
  authorizedObligationIds: readonly string[];
  evidence: readonly SystemAWorkEvidence[];
  decisionHistory: readonly SystemAVerificationDecision[];
}): PreparedAnswerEvaluation {
  const c = input.command;
  for (const [label, value] of Object.entries({
    decisionId: c.decisionId,
    instituteId: c.instituteId,
    obligationId: c.obligationId,
    exerciseSlotId: c.exerciseSlotId,
    evidenceEventId: c.evidenceEventId,
    evaluatorId: c.evaluatorId,
    reason: c.reason,
  })) {
    if (!value.trim()) throw new Error(`${label} must be non-empty.`);
  }
  if (!Number.isFinite(Date.parse(c.decidedAt))) {
    throw new Error("decidedAt must be a valid timestamp.");
  }
  if (!["TEACHER", "ACADEMIC_REVIEWER"].includes(c.evaluatorRole)) {
    throw new Error("Only a teacher or academic reviewer may evaluate an answer.");
  }
  if (!input.authorizedObligationIds.includes(c.obligationId)) {
    throw new Error("Evaluator is not authorized for this obligation.");
  }

  const obligation = input.obligation;
  if (obligation.eligibility !== "ELIGIBLE") {
    throw new Error("Answer evaluation requires an eligible obligation.");
  }
  if (obligation.id !== c.obligationId ||
      obligation.instituteId !== c.instituteId ||
      obligation.exerciseSlotId !== c.exerciseSlotId) {
    throw new Error("Evaluation obligation does not match the exact institute, obligation and question slot.");
  }

  const event = input.evidence.find((item) => item.id === c.evidenceEventId);
  if (!event) throw new Error("The submitted evidence event does not exist.");
  if (event.instituteId !== c.instituteId ||
      event.obligationId !== c.obligationId ||
      event.exerciseSlotId !== c.exerciseSlotId ||
      event.studentId !== obligation.studentId) {
    throw new Error("Evidence does not belong to the exact learner, institute, obligation and question slot.");
  }
  if (event.source !== "STUDENT_SELF_REPORT" ||
      event.actorRole !== "STUDENT" ||
      event.actorId !== event.studentId ||
      event.workProgress !== "SUBMITTED") {
    throw new Error("Only submitted learner self-report evidence can be answer-evaluated.");
  }
  if (c.evaluatorId === event.studentId) {
    throw new Error("A learner cannot evaluate their own answer.");
  }

  const duplicateId = input.decisionHistory.find((item) => item.id === c.decisionId);
  if (duplicateId) {
    const samePayload =
      duplicateId.instituteId === c.instituteId &&
      duplicateId.obligationId === c.obligationId &&
      duplicateId.evidenceEventId === c.evidenceEventId &&
      duplicateId.verifierId === c.evaluatorId &&
      duplicateId.purpose === "ANSWER_EVALUATION" &&
      duplicateId.outcome === c.outcome &&
      duplicateId.reason === c.reason.trim() &&
      duplicateId.decidedAt === c.decidedAt &&
      duplicateId.supersedesDecisionId === c.supersedesDecisionId;
    if (samePayload) return Object.freeze({ outcome: "IDEMPOTENT_REPLAY", decision: duplicateId });
    throw new Error("Decision ID conflict: this identifier already belongs to a different decision.");
  }

  const history = input.decisionHistory
    .filter((item) =>
      item.instituteId === c.instituteId &&
      item.obligationId === c.obligationId &&
      item.evidenceEventId === c.evidenceEventId &&
      item.purpose === "ANSWER_EVALUATION",
    )
    .sort((a, b) =>
      Date.parse(a.decidedAt) - Date.parse(b.decidedAt) || a.id.localeCompare(b.id),
    );
  const latest = history.at(-1);

  if (latest && c.supersedesDecisionId !== latest.id) {
    throw new Error("A new evaluation must explicitly supersede the latest answer-evaluation decision.");
  }
  if (!latest && c.supersedesDecisionId) {
    throw new Error("There is no prior answer-evaluation decision to supersede.");
  }

  const decision = createSystemAVerificationDecision({
    id: c.decisionId,
    instituteId: c.instituteId,
    obligationId: c.obligationId,
    evidenceEventId: c.evidenceEventId,
    verifierId: c.evaluatorId,
    purpose: "ANSWER_EVALUATION",
    outcome: c.outcome,
    reason: c.reason.trim(),
    decidedAt: c.decidedAt,
    ...(c.supersedesDecisionId ? { supersedesDecisionId: c.supersedesDecisionId } : {}),
  });
  return Object.freeze({ outcome: "CREATED", decision });
}
