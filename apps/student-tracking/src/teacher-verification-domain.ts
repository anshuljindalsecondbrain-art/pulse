import {
  createSystemAVerificationDecision,
  type SystemAWorkEvidence,
  type SystemAVerificationDecision,
} from "./workflow-domain";

export type TeacherVerificationCommand = Readonly<{
  instituteId: string;
  reviewerId: string;
  reviewerRole: "TEACHER" | "ACADEMIC_REVIEWER";
  obligationId: string;
  evidenceEventId: string;
  outcome: "CONFIRMED" | "NOT_CONFIRMED" | "RETURNED" | "REJECTED";
  reason: string;
  decidedAt: string;
  decisionId: string;
  supersedesDecisionId?: string;
}>;

export type PreparedTeacherVerification =
  | Readonly<{ outcome: "CREATED"; decision: SystemAVerificationDecision }>
  | Readonly<{ outcome: "IDEMPOTENT_REPLAY"; decision: SystemAVerificationDecision }>;

/**
 * Prepares an append-only completion decision against one exact learner report.
 * Scope must be resolved by trusted server authorization before this function.
 */
export function prepareTeacherVerification(input: {
  command: TeacherVerificationCommand;
  authorizedObligationIds: readonly string[];
  evidence: readonly SystemAWorkEvidence[];
  decisionHistory: readonly SystemAVerificationDecision[];
}): PreparedTeacherVerification {
  const command = input.command;
  for (const [label, value] of Object.entries({
    instituteId: command.instituteId,
    reviewerId: command.reviewerId,
    obligationId: command.obligationId,
    evidenceEventId: command.evidenceEventId,
    reason: command.reason,
    decidedAt: command.decidedAt,
    decisionId: command.decisionId,
  })) {
    if (!value.trim()) throw new Error(`${label} must be non-empty.`);
  }
  if (!["TEACHER", "ACADEMIC_REVIEWER"].includes(command.reviewerRole)) {
    throw new Error("Only a teacher or academic reviewer may verify learner work.");
  }
  if (!input.authorizedObligationIds.includes(command.obligationId)) {
    throw new Error("Reviewer is not authorized for this obligation.");
  }

  const event = input.evidence.find((item) => item.id === command.evidenceEventId);
  if (!event) throw new Error("The evidence event does not exist.");
  if (event.instituteId !== command.instituteId || event.obligationId !== command.obligationId) {
    throw new Error("Evidence does not belong to the authorized institute and obligation.");
  }
  if (event.source !== "STUDENT_SELF_REPORT" || event.actorRole !== "STUDENT") {
    throw new Error("Only a learner's self-reported evidence can enter the completion verification workflow.");
  }
  if (event.workProgress !== "SUBMITTED") {
    throw new Error("Only submitted learner work can receive a completion decision.");
  }
  if (command.reviewerId === event.studentId) {
    throw new Error("A learner cannot verify their own submission.");
  }

  const history = input.decisionHistory.filter((item) =>
    item.instituteId === command.instituteId &&
    item.obligationId === command.obligationId &&
    item.evidenceEventId === command.evidenceEventId &&
    item.purpose === "COMPLETION",
  ).sort((a, b) =>
    Date.parse(a.decidedAt) - Date.parse(b.decidedAt) || a.id.localeCompare(b.id),
  );
  const latest = history.at(-1);

  if (latest && command.supersedesDecisionId !== latest.id) {
    throw new Error("A new decision must explicitly supersede the latest completion decision.");
  }
  if (!latest && command.supersedesDecisionId) {
    throw new Error("There is no prior completion decision to supersede.");
  }

  const duplicateId = input.decisionHistory.find((item) => item.id === command.decisionId);
  if (duplicateId) {
    const samePayload =
      duplicateId.instituteId === command.instituteId &&
      duplicateId.obligationId === command.obligationId &&
      duplicateId.evidenceEventId === command.evidenceEventId &&
      duplicateId.verifierId === command.reviewerId &&
      duplicateId.purpose === "COMPLETION" &&
      duplicateId.outcome === command.outcome &&
      duplicateId.reason === command.reason.trim() &&
      duplicateId.decidedAt === command.decidedAt &&
      duplicateId.supersedesDecisionId === command.supersedesDecisionId;
    if (samePayload) return Object.freeze({ outcome: "IDEMPOTENT_REPLAY", decision: duplicateId });
    throw new Error("Decision ID conflict: this identifier already belongs to a different decision.");
  }

  const decision = createSystemAVerificationDecision({
    id: command.decisionId,
    instituteId: command.instituteId,
    obligationId: command.obligationId,
    evidenceEventId: command.evidenceEventId,
    verifierId: command.reviewerId,
    purpose: "COMPLETION",
    outcome: command.outcome,
    reason: command.reason.trim(),
    decidedAt: command.decidedAt,
    ...(command.supersedesDecisionId ? { supersedesDecisionId: command.supersedesDecisionId } : {}),
  });
  return Object.freeze({ outcome: "CREATED", decision });
}
