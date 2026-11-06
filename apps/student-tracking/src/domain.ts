export const STATUSES = ["U", "C", "I", "D", "S", "P"] as const;
export type Status = (typeof STATUSES)[number];

const NEXT_STATUS: Record<Status, Status> = {
  U: "C",
  C: "I",
  I: "D",
  D: "S",
  S: "P",
  P: "U",
};

export function nextStatus(status: Status): Status {
  return NEXT_STATUS[status];
}

export function isAttemptedStatus(status: Status): boolean {
  return status !== "U" && status !== "S";
}

export function summarizeStatuses(statuses: readonly Status[]) {
  return {
    total: statuses.length,
    recorded: statuses.filter((status) => status !== "U").length,
    attempted: statuses.filter(isAttemptedStatus).length,
    skipped: statuses.filter((status) => status === "S").length,
    unattempted: statuses.filter((status) => status === "U").length,
    correct: statuses.filter((status) => status === "C").length,
    incorrect: statuses.filter((status) => status === "I").length,
    doubt: statuses.filter((status) => status === "D").length,
    partiallyCorrect: statuses.filter((status) => status === "P").length,
  };
}

/**
 * A student's statement about work is evidence, not a teacher-approved result.
 * These records are append-only by contract; later decisions reference the event
 * and must never mutate its status.
 */
export type StudentReportEvent = Readonly<{
  id: string;
  studentId: string;
  obligationId: string;
  questionNumber: number;
  status: Status;
  reportedBy: string;
  reportedAt: string;
}>;

export type VerificationOutcome = "VERIFIED" | "CORRECTION_REQUIRED" | "NOT_ACCEPTED";

export type VerificationDecision = Readonly<{
  id: string;
  reportEventId: string;
  decidedBy: string;
  outcome: VerificationOutcome;
  decidedAt: string;
}>;

export type StudentReportEventInput = StudentReportEvent;
export type VerificationDecisionInput = VerificationDecision;

export function createStudentReportEvent(input: StudentReportEventInput): StudentReportEvent {
  if (!input.id.trim() || !input.studentId.trim() || !input.obligationId.trim() || !input.reportedBy.trim()) {
    throw new Error("Student report event identifiers must be non-empty.");
  }
  if (!Number.isInteger(input.questionNumber) || input.questionNumber < 1) {
    throw new Error("Question number must be a positive integer.");
  }
  if (Number.isNaN(Date.parse(input.reportedAt))) {
    throw new Error("Student report timestamp must be a valid date.");
  }
  return Object.freeze({ ...input });
}

export function createVerificationDecision(input: VerificationDecisionInput): VerificationDecision {
  if (!input.id.trim() || !input.reportEventId.trim() || !input.decidedBy.trim()) {
    throw new Error("Verification decision identifiers must be non-empty.");
  }
  if (Number.isNaN(Date.parse(input.decidedAt))) {
    throw new Error("Verification timestamp must be a valid date.");
  }
  return Object.freeze({ ...input });
}

export type EvidenceSlotProjection = Readonly<{
  studentId: string;
  obligationId: string;
  questionNumber: number;
  latestReport: StudentReportEvent;
  latestVerification: VerificationDecision | null;
}>;

function isLater<T extends { decidedAt?: string; reportedAt?: string; id: string }>(candidate: T, current: T): boolean {
  const candidateTime = Date.parse(candidate.decidedAt ?? candidate.reportedAt ?? "");
  const currentTime = Date.parse(current.decidedAt ?? current.reportedAt ?? "");
  return candidateTime > currentTime || (candidateTime === currentTime && candidate.id.localeCompare(current.id) > 0);
}

/**
 * Rebuilds a read model from append-only evidence.
 * A later report supersedes the displayed report for that slot, but never deletes
 * earlier events. Verification is scoped to the currently projected report event.
 */
export function projectEvidence(
  reports: readonly StudentReportEvent[],
  decisions: readonly VerificationDecision[],
): EvidenceSlotProjection[] {
  const latestBySlot = new Map<string, StudentReportEvent>();
  for (const report of reports) {
    const key = `${report.studentId}|${report.obligationId}|${report.questionNumber}`;
    const current = latestBySlot.get(key);
    if (!current || isLater(report, current)) latestBySlot.set(key, report);
  }

  const reportsById = new Set(reports.map((report) => report.id));
  const latestDecisionByReport = new Map<string, VerificationDecision>();
  for (const decision of decisions) {
    if (!reportsById.has(decision.reportEventId)) continue;
    const current = latestDecisionByReport.get(decision.reportEventId);
    if (!current || isLater(decision, current)) latestDecisionByReport.set(decision.reportEventId, decision);
  }

  return [...latestBySlot.values()]
    .sort((a, b) => a.studentId.localeCompare(b.studentId)
      || a.obligationId.localeCompare(b.obligationId)
      || a.questionNumber - b.questionNumber)
    .map((latestReport) => ({
      studentId: latestReport.studentId,
      obligationId: latestReport.obligationId,
      questionNumber: latestReport.questionNumber,
      latestReport,
      latestVerification: latestDecisionByReport.get(latestReport.id) ?? null,
    }));
}
