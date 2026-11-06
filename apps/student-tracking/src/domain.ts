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
