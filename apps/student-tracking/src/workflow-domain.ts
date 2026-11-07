/**
 * Canonical System A workflow vocabulary.
 *
 * The six-cell Abhyas Matrix status remains an interaction shorthand. These
 * independent dimensions are the domain model and must not be collapsed into
 * a single status or inferred from a student self-report.
 */
export type WorkProgress =
  | "NOT_STARTED"
  | "ATTEMPTED"
  | "SUBMITTED"
  | "SKIPPED";

export type AnswerEvaluation =
  | "NOT_EVALUATED"
  | "CORRECT"
  | "INCORRECT"
  | "PARTIALLY_CORRECT"
  | "NOT_APPLICABLE";

export type DoubtState =
  | "NONE"
  | "OPEN"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "STUDENT_CONFIRMED"
  | "REOPENED";

export type VerificationState =
  | "PENDING"
  | "CONFIRMED"
  | "RETURNED"
  | "REJECTED";

export type CorrectionState =
  | "NOT_REQUIRED"
  | "REQUIRED"
  | "IN_PROGRESS"
  | "RESUBMITTED"
  | "ACCEPTED"
  | "CLOSED";

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

export type SystemAWorkEvidence = Readonly<{
  id: string;
  instituteId: string;
  studentId: string;
  obligationId: string;
  exerciseSlotId: string;
  actorId: string;
  actorRole: ActorRole;
  source: EvidenceSource;
  workProgress: Exclude<WorkProgress, "NOT_STARTED">;
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

export type SystemAVerificationDecision = Readonly<{
  id: string;
  instituteId: string;
  obligationId: string;
  evidenceEventId: string;
  verifierId: string;
  purpose: VerificationPurpose;
  outcome: VerificationOutcome;
  reason: string;
  decidedAt: string;
  supersedesDecisionId?: string;
}>;

export type SystemAObligation = Readonly<{
  id: string;
  studentId: string;
  assignmentVersionId: string;
  exerciseSlotId: string;
  eligibility: "ELIGIBLE" | "EXEMPTED" | "REMOVED";
}>;

export type DoubtCaseSnapshot = Readonly<{
  id: string;
  obligationId: string;
  state: DoubtState;
}>;

export type CorrectionCycleSnapshot = Readonly<{
  id: string;
  obligationId: string;
  state: CorrectionState;
}>;

export type RecognitionSnapshot = Readonly<{
  obligationId: string;
  state: "PENDING" | "RECOGNISED" | "NOT_RECOGNISED" | "FRESH_PRACTICE_REQUIRED" | "REVOKED";
}>;

export type DisputeSnapshot = Readonly<{
  obligationId: string;
  state: "OPEN" | "UNDER_REVIEW" | "APPEALED" | "UPHELD" | "REJECTED" | "WITHDRAWN";
}>;

function requireText(value: string, label: string): void {
  if (!value.trim()) throw new Error(`${label} must be non-empty.`);
}

function requireDate(value: string, label: string): void {
  if (!Number.isFinite(Date.parse(value))) throw new Error(`${label} must be a valid timestamp.`);
}

/** Validates and freezes one append-only evidence record. */
export function createWorkEvidence(input: SystemAWorkEvidence): SystemAWorkEvidence {
  for (const [key, value] of Object.entries({
    id: input.id,
    instituteId: input.instituteId,
    studentId: input.studentId,
    obligationId: input.obligationId,
    exerciseSlotId: input.exerciseSlotId,
    actorId: input.actorId,
    attemptCycleId: input.attemptCycleId,
    idempotencyKey: input.idempotencyKey,
  })) requireText(value, key);
  requireDate(input.occurredAt, "occurredAt");
  requireDate(input.recordedAt, "recordedAt");

  if (input.source === "STUDENT_SELF_REPORT" && input.actorRole !== "STUDENT") {
    throw new Error("Student self-report must be attributed to a student actor.");
  }
  if (input.source === "TEACHER_OBSERVATION" && !["TEACHER", "ACADEMIC_REVIEWER"].includes(input.actorRole)) {
    throw new Error("Teacher observation must be attributed to an authorised academic actor.");
  }
  if (input.source === "AUTHORIZED_GUARDIAN_INPUT" && input.actorRole !== "PARENT") {
    throw new Error("Guardian input must be attributed to a parent actor.");
  }
  if (input.source === "SYSTEM_IMPORT" && input.actorRole !== "SYSTEM") {
    throw new Error("System import evidence must be attributed to the system actor.");
  }
  return Object.freeze({ ...input });
}

/** A decision always references the exact evidence event that was reviewed. */
export function createSystemAVerificationDecision(
  input: SystemAVerificationDecision,
): SystemAVerificationDecision {
  for (const [key, value] of Object.entries({
    id: input.id,
    instituteId: input.instituteId,
    obligationId: input.obligationId,
    evidenceEventId: input.evidenceEventId,
    verifierId: input.verifierId,
    reason: input.reason,
  })) requireText(value, key);
  requireDate(input.decidedAt, "decidedAt");

  if (input.purpose === "ANSWER_EVALUATION" &&
      !["CORRECT", "INCORRECT", "PARTIALLY_CORRECT", "REJECTED"].includes(input.outcome)) {
    throw new Error("Answer evaluation requires an evaluation outcome.");
  }
  if (input.purpose === "COMPLETION" &&
      !["CONFIRMED", "NOT_CONFIRMED", "RETURNED", "REJECTED"].includes(input.outcome)) {
    throw new Error("Completion verification requires a completion outcome.");
  }
  if (input.purpose === "CORRECTION" &&
      !["ACCEPTED", "RETURNED", "REJECTED"].includes(input.outcome)) {
    throw new Error("Correction verification requires a correction outcome.");
  }
  return Object.freeze({ ...input });
}

function requireUniqueIds<T extends { id: string }>(items: readonly T[], label: string): void {
  const seen = new Set<string>();
  for (const item of items) {
    if (seen.has(item.id)) throw new Error(`Duplicate ${label} ID: ${item.id}`);
    seen.add(item.id);
  }
}

function compareEvents<T extends { recordedAt?: string; decidedAt?: string; id: string }>(a: T, b: T): number {
  const at = Date.parse(a.recordedAt ?? a.decidedAt ?? "");
  const bt = Date.parse(b.recordedAt ?? b.decidedAt ?? "");
  return at - bt || a.id.localeCompare(b.id);
}

const OPEN_DOUBT_STATES = new Set<DoubtState>(["OPEN", "ASSIGNED", "IN_PROGRESS", "REOPENED"]);
const OPEN_CORRECTION_STATES = new Set<CorrectionState>(["REQUIRED", "IN_PROGRESS", "RESUBMITTED"]);
const ACTIVE_DISPUTE_STATES = new Set<DisputeSnapshot["state"]>(["OPEN", "UNDER_REVIEW", "APPEALED"]);

/**
 * Derives explicitly named metrics. Student-reported status never becomes
 * verified completion or answer correctness without a matching decision.
 */
export function deriveSystemAMetrics(input: {
  obligations: readonly SystemAObligation[];
  evidence: readonly SystemAWorkEvidence[];
  decisions: readonly SystemAVerificationDecision[];
  doubts?: readonly DoubtCaseSnapshot[];
  corrections?: readonly CorrectionCycleSnapshot[];
  recognitions?: readonly RecognitionSnapshot[];
  disputes?: readonly DisputeSnapshot[];
}) {
  requireUniqueIds(input.obligations, "obligation");
  requireUniqueIds(input.evidence, "evidence");
  requireUniqueIds(input.decisions, "decision");

  const eligible = input.obligations.filter((item) => item.eligibility === "ELIGIBLE");
  const eligibleIds = new Set(eligible.map((item) => item.id));
  const evidenceById = new Map(input.evidence.map((item) => [item.id, item]));
  const validEvidence = input.evidence.filter((item) => eligibleIds.has(item.obligationId));
  const studentReports = validEvidence
    .filter((item) => item.source === "STUDENT_SELF_REPORT")
    .sort(compareEvents);
  const latestStudentReport = new Map<string, SystemAWorkEvidence>();
  for (const event of studentReports) latestStudentReport.set(event.obligationId, event);

  const validDecisions = input.decisions
    .filter((item) => eligibleIds.has(item.obligationId))
    .filter((item) => {
      const event = evidenceById.get(item.evidenceEventId);
      return event?.obligationId === item.obligationId && event.instituteId === item.instituteId;
    })
    .sort(compareEvents);

  const latestDecision = new Map<string, SystemAVerificationDecision>();
  for (const decision of validDecisions) {
    const key = `${decision.evidenceEventId}|${decision.purpose}`;
    latestDecision.set(key, decision);
  }

  const reportedComplete = [...latestStudentReport.values()]
    .filter((event) => event.workProgress === "SUBMITTED").length;
  const attempted = new Set(studentReports
    .filter((event) => event.workProgress === "ATTEMPTED" || event.workProgress === "SUBMITTED")
    .map((event) => event.obligationId)).size;
  const skipped = [...latestStudentReport.values()]
    .filter((event) => event.workProgress === "SKIPPED").length;

  let verifiedComplete = 0;
  const currentReportIds = new Set([...latestStudentReport.values()].map((event) => event.id));
  for (const event of latestStudentReport.values()) {
    const completion = latestDecision.get(`${event.id}|COMPLETION`);
    const correction = latestDecision.get(`${event.id}|CORRECTION`);
    if (completion?.outcome === "CONFIRMED" || correction?.outcome === "ACCEPTED") verifiedComplete += 1;
  }

  const evaluations = [...latestDecision.values()].filter((decision) =>
    currentReportIds.has(decision.evidenceEventId) &&
    decision.purpose === "ANSWER_EVALUATION" &&
    ["CORRECT", "INCORRECT", "PARTIALLY_CORRECT"].includes(decision.outcome),
  );
  const correct = evaluations.filter((item) => item.outcome === "CORRECT").length;
  const incorrect = evaluations.filter((item) => item.outcome === "INCORRECT").length;
  const partiallyCorrect = evaluations.filter((item) => item.outcome === "PARTIALLY_CORRECT").length;
  const evaluated = evaluations.length;

  const doubts = (input.doubts ?? []).filter((item) =>
    eligibleIds.has(item.obligationId) && OPEN_DOUBT_STATES.has(item.state),
  );
  const corrections = (input.corrections ?? []).filter((item) =>
    eligibleIds.has(item.obligationId) && OPEN_CORRECTION_STATES.has(item.state),
  );
  const recognised = (input.recognitions ?? []).filter((item) =>
    eligibleIds.has(item.obligationId) && item.state === "RECOGNISED",
  );
  const freshPracticeRequired = (input.recognitions ?? []).filter((item) =>
    eligibleIds.has(item.obligationId) && item.state === "FRESH_PRACTICE_REQUIRED",
  );
  const disputed = (input.disputes ?? []).filter((item) =>
    eligibleIds.has(item.obligationId) && ACTIVE_DISPUTE_STATES.has(item.state),
  );

  return Object.freeze({
    assignedObligations: input.obligations.length,
    eligibleObligations: eligible.length,
    exemptedObligations: input.obligations.filter((item) => item.eligibility === "EXEMPTED").length,
    removedObligations: input.obligations.filter((item) => item.eligibility === "REMOVED").length,
    attemptedObligations: attempted,
    reportedCompleteObligations: reportedComplete,
    verifiedCompleteObligations: verifiedComplete,
    skippedObligations: skipped,
    evaluatedObligations: evaluated,
    correctEvaluations: correct,
    incorrectEvaluations: incorrect,
    partiallyCorrectEvaluations: partiallyCorrect,
    openDoubtCases: doubts.length,
    openCorrectionCycles: corrections.length,
    recognisedObligations: recognised.length,
    freshPracticeRequiredObligations: freshPracticeRequired.length,
    activeDisputes: disputed.length,
    reportedProgressPercent: eligible.length ? reportedComplete / eligible.length * 100 : null,
    verifiedProgressPercent: eligible.length ? verifiedComplete / eligible.length * 100 : null,
    accuracyPercent: evaluated ? correct / evaluated * 100 : null,
  });
}
