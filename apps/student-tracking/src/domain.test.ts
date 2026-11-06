import { describe, expect, it } from "vitest";
import {
  createStudentReportEvent,
  createVerificationDecision,
  isAttemptedStatus,
  nextStatus,
  summarizeStatuses,
  STATUSES,
} from "./domain";

describe("Abhyas Matrix status domain", () => {
  it("defines exactly the six supported operational statuses", () => {
    expect(STATUSES).toEqual(["U", "C", "I", "D", "S", "P"]);
  });

  it("cycles through all six statuses and returns to unattempted", () => {
    const cycle = [nextStatus("U"), nextStatus("C"), nextStatus("I"), nextStatus("D"), nextStatus("S"), nextStatus("P")];
    expect(cycle).toEqual(["C", "I", "D", "S", "P", "U"]);
  });

  it("does not count skipped or unattempted work as attempted", () => {
    expect(isAttemptedStatus("U")).toBe(false);
    expect(isAttemptedStatus("S")).toBe(false);
    for (const status of ["C", "I", "D", "P"] as const) {
      expect(isAttemptedStatus(status)).toBe(true);
    }
  });

  it("keeps recorded, attempted and skipped counts separate", () => {
    expect(summarizeStatuses(["U", "C", "I", "D", "S", "P"])).toEqual({
      total: 6, recorded: 5, attempted: 4, skipped: 1, unattempted: 1,
      correct: 1, incorrect: 1, doubt: 1, partiallyCorrect: 1,
    });
  });

  it("handles an empty cohort without inventing counts", () => {
    expect(summarizeStatuses([])).toEqual({
      total: 0, recorded: 0, attempted: 0, skipped: 0, unattempted: 0,
      correct: 0, incorrect: 0, doubt: 0, partiallyCorrect: 0,
    });
  });
});

describe("Student evidence and teacher verification", () => {
  const reportInput = {
    id: "report-001",
    studentId: "student-001",
    obligationId: "obligation-001",
    questionNumber: 3,
    status: "C" as const,
    reportedBy: "student-001",
    reportedAt: "2026-11-06T08:30:00.000Z",
  };

  it("creates a student report without implying teacher verification", () => {
    const report = createStudentReportEvent(reportInput);
    expect(report.status).toBe("C");
    expect(report.reportedBy).toBe("student-001");
    expect("verification" in report).toBe(false);
  });

  it("records verification as a separate decision linked to a report event", () => {
    const decision = createVerificationDecision({
      id: "verification-001",
      reportEventId: "report-001",
      decidedBy: "teacher-001",
      outcome: "VERIFIED",
      decidedAt: "2026-11-06T09:00:00.000Z",
    });
    expect(decision.reportEventId).toBe("report-001");
    expect(decision.outcome).toBe("VERIFIED");
  });

  it("does not rewrite the original student report when a verification is added", () => {
    const report = createStudentReportEvent(reportInput);
    const before = { ...report };
    createVerificationDecision({
      id: "verification-002",
      reportEventId: report.id,
      decidedBy: "teacher-001",
      outcome: "CORRECTION_REQUIRED",
      decidedAt: "2026-11-06T09:05:00.000Z",
    });
    expect(report).toEqual(before);
    expect(report.status).toBe("C");
  });
});
