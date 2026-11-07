import type { Status } from "../domain";

export type AssignmentState = "DRAFT" | "PUBLISHED" | "COMPLETED";
export type DemoAssignment = Readonly<{
  id: string;
  title: string;
  questionRefs: readonly string[];
  targetBatch: string;
  dueDate: string;
  state: AssignmentState;
  publishedSnapshot?: Readonly<{ questionRefs: readonly string[]; publishedAt: string }>;
}>;

export function transitionAssignment(
  assignment: DemoAssignment,
  action: "PUBLISH" | "COMPLETE",
  at: string,
): DemoAssignment {
  if (Number.isNaN(Date.parse(at))) throw new Error("A valid workflow timestamp is required.");
  if (action === "PUBLISH") {
    if (assignment.state !== "DRAFT") throw new Error("Only draft assignments can be published.");
    if (!assignment.questionRefs.length) throw new Error("An assignment needs at least one question.");
    if (new Set(assignment.questionRefs).size !== assignment.questionRefs.length) {
      throw new Error("An assignment cannot contain duplicate question references.");
    }
    return Object.freeze({
      ...assignment,
      questionRefs: Object.freeze([...assignment.questionRefs]),
      state: "PUBLISHED",
      publishedSnapshot: Object.freeze({
        questionRefs: Object.freeze([...assignment.questionRefs]),
        publishedAt: at,
      }),
    });
  }
  if (assignment.state !== "PUBLISHED") throw new Error("Only published assignments can be completed.");
  return Object.freeze({ ...assignment, state: "COMPLETED" });
}

export type DemoReportEvent = Readonly<{
  id: string;
  studentId: string;
  assignmentId: string;
  questionRef: string;
  status: Status;
  reportedAt: string;
}>;

export type DemoVerificationDecision = Readonly<{
  id: string;
  reportEventId: string;
  outcome: "VERIFIED" | "CORRECTION_REQUIRED";
  decidedAt: string;
}>;

export function appendReportEvent(
  events: readonly DemoReportEvent[],
  event: DemoReportEvent,
): DemoReportEvent[] {
  if (!event.id.trim() || !event.studentId.trim() || !event.assignmentId.trim() || !event.questionRef.trim()) {
    throw new Error("Report event identifiers must be non-empty.");
  }
  if (Number.isNaN(Date.parse(event.reportedAt))) throw new Error("Report timestamp must be valid.");
  if (events.some((item) => item.id === event.id)) return [...events];
  return [...events, Object.freeze({ ...event })];
}

export function appendVerificationDecision(
  reports: readonly DemoReportEvent[],
  decisions: readonly DemoVerificationDecision[],
  decision: DemoVerificationDecision,
): DemoVerificationDecision[] {
  if (!reports.some((report) => report.id === decision.reportEventId)) {
    throw new Error("Verification must reference an existing report event.");
  }
  if (!decision.id.trim() || Number.isNaN(Date.parse(decision.decidedAt))) {
    throw new Error("Verification decision ID and timestamp are required.");
  }
  if (decisions.some((item) => item.id === decision.id)) return [...decisions];
  return [...decisions, Object.freeze({ ...decision })];
}

export type DemoDoubt = Readonly<{
  id: string;
  studentId: string;
  questionRef: string;
  description: string;
  state: "OPEN" | "ASSIGNED" | "RESOLVED";
  assignedTo?: string;
}>;

export function transitionDoubt(
  doubt: DemoDoubt,
  action: "ASSIGN" | "RESOLVE" | "REOPEN",
  assignedTo?: string,
): DemoDoubt {
  if (action === "ASSIGN") {
    if (doubt.state !== "OPEN" || !assignedTo?.trim()) {
      throw new Error("Only open doubts can be assigned to a named reviewer.");
    }
    return Object.freeze({ ...doubt, state: "ASSIGNED", assignedTo });
  }
  if (action === "RESOLVE") {
    if (doubt.state !== "ASSIGNED") throw new Error("Only assigned doubts can be resolved.");
    return Object.freeze({ ...doubt, state: "RESOLVED" });
  }
  if (doubt.state !== "RESOLVED") throw new Error("Only resolved doubts can be reopened.");
  return Object.freeze({ ...doubt, state: "OPEN", assignedTo: undefined });
}

export type DemoAttendance = Readonly<{
  id: string;
  studentId: string;
  date: string;
  status: "PRESENT" | "ABSENT" | "LATE";
}>;

export function appendAttendance(
  records: readonly DemoAttendance[],
  record: DemoAttendance,
): DemoAttendance[] {
  if (!record.id.trim() || !record.studentId.trim() || !/^\\d{4}-\\d{2}-\\d{2}$/.test(record.date)) {
    throw new Error("Attendance requires an ID, student and ISO date.");
  }
  if (records.some((item) => item.studentId === record.studentId && item.date === record.date)) {
    throw new Error("Attendance already exists for this student and date.");
  }
  return [...records, Object.freeze({ ...record })];
}
