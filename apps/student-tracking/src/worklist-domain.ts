import type { AssignmentVersionSnapshot, PlannedStudentObligation } from "./assignment-domain";
import type { SystemAVerificationDecision, SystemAWorkEvidence } from "./workflow-domain";

export type StudentWorklistState =
  | "NOT_STARTED"
  | "ATTEMPTED"
  | "SUBMITTED"
  | "VERIFIED"
  | "RETURNED"
  | "REJECTED";

export type StudentWorklistItem = Readonly<{
  obligationId: string;
  assignmentVersionId: string;
  assignmentTitle: string;
  subject: string;
  chapter: string;
  slotId: string;
  slotPosition: number;
  questionLabel: string;
  difficulty: string;
  dueAt: string;
  state: StudentWorklistState;
  latestEvidenceId: string | null;
  latestReportedAt: string | null;
}>;

export type TeacherVerificationQueueItem = Readonly<{
  obligationId: string;
  instituteId: string;
  studentId: string;
  assignmentVersionId: string;
  assignmentTitle: string;
  slotId: string;
  slotPosition: number;
  questionLabel: string;
  evidenceEventId: string;
  submittedAt: string;
  state: "PENDING" | "RETURNED" | "REJECTED" | "CONFIRMED";
}>;

function latestByRecordedAt<T extends { recordedAt: string; id: string }>(items: readonly T[]): T | undefined {
  return [...items].sort((a, b) =>
    Date.parse(a.recordedAt) - Date.parse(b.recordedAt) || a.id.localeCompare(b.id),
  ).at(-1);
}

function latestDecision(
  decisions: readonly SystemAVerificationDecision[],
  evidenceEventId: string,
  purpose: SystemAVerificationDecision["purpose"],
): SystemAVerificationDecision | undefined {
  return [...decisions]
    .filter((item) => item.evidenceEventId === evidenceEventId && item.purpose === purpose)
    .sort((a, b) => Date.parse(a.decidedAt) - Date.parse(b.decidedAt) || a.id.localeCompare(b.id))
    .at(-1);
}

/**
 * Builds a learner-scoped worklist from already-authorized input records.
 * Callers must resolve the student identity and tenant scope on the server.
 */
export function buildStudentWorklist(input: {
  studentId: string;
  obligations: readonly PlannedStudentObligation[];
  versions: readonly AssignmentVersionSnapshot[];
  evidence: readonly SystemAWorkEvidence[];
  decisions: readonly SystemAVerificationDecision[];
}): readonly StudentWorklistItem[] {
  if (!input.studentId.trim()) throw new Error("studentId must be non-empty.");
  const versions = new Map(input.versions.map((item) => [item.id, item]));
  const items = input.obligations
    .filter((item) => item.studentId === input.studentId && item.eligibility === "ELIGIBLE")
    .flatMap((obligation) => {
      const version = versions.get(obligation.assignmentVersionId);
      const slot = version?.slots.find((item) => item.id === obligation.exerciseSlotId);
      if (!version || !slot) return [];

      const report = latestByRecordedAt(input.evidence.filter((item) =>
        item.obligationId === obligation.id &&
        item.studentId === input.studentId &&
        item.instituteId === obligation.instituteId &&
        item.source === "STUDENT_SELF_REPORT",
      ));
      const completion = report
        ? latestDecision(input.decisions, report.id, "COMPLETION")
        : undefined;
      const state: StudentWorklistState = completion?.outcome === "CONFIRMED"
        ? "VERIFIED"
        : completion?.outcome === "RETURNED"
          ? "RETURNED"
          : completion?.outcome === "REJECTED"
            ? "REJECTED"
            : report?.workProgress === "SUBMITTED"
              ? "SUBMITTED"
              : report?.workProgress === "ATTEMPTED"
                ? "ATTEMPTED"
                : "NOT_STARTED";

      return [Object.freeze({
        obligationId: obligation.id,
        assignmentVersionId: version.id,
        assignmentTitle: version.title,
        subject: version.subject,
        chapter: version.chapter,
        slotId: slot.id,
        slotPosition: slot.position,
        questionLabel: slot.questionLabel,
        difficulty: slot.difficulty,
        dueAt: version.dueAt,
        state,
        latestEvidenceId: report?.id ?? null,
        latestReportedAt: report?.recordedAt ?? null,
      })];
    });

  return Object.freeze(items.sort((a, b) =>
    Date.parse(a.dueAt) - Date.parse(b.dueAt) ||
    a.assignmentVersionId.localeCompare(b.assignmentVersionId) ||
    a.slotPosition - b.slotPosition,
  ));
}

/**
 * Builds a teacher review queue from the latest learner report for each
 * eligible obligation. It is a projection only: callers must enforce teacher
 * batch/assignment scope and reviewer independence on the server.
 */
export function buildTeacherVerificationQueue(input: {
  obligations: readonly PlannedStudentObligation[];
  versions: readonly AssignmentVersionSnapshot[];
  evidence: readonly SystemAWorkEvidence[];
  decisions: readonly SystemAVerificationDecision[];
}): readonly TeacherVerificationQueueItem[] {
  const versions = new Map(input.versions.map((item) => [item.id, item]));
  const rows = input.obligations
    .filter((item) => item.eligibility === "ELIGIBLE")
    .flatMap((obligation) => {
      const version = versions.get(obligation.assignmentVersionId);
      const slot = version?.slots.find((item) => item.id === obligation.exerciseSlotId);
      if (!version || !slot) return [];

      const latestReport = latestByRecordedAt(input.evidence.filter((item) =>
        item.obligationId === obligation.id &&
        item.studentId === obligation.studentId &&
        item.instituteId === obligation.instituteId &&
        item.source === "STUDENT_SELF_REPORT",
      ));
      // A later report supersedes an earlier submission for queue purposes.
      if (!latestReport || latestReport.workProgress !== "SUBMITTED") return [];
      const report = latestReport;

      const decision = latestDecision(input.decisions, report.id, "COMPLETION");
      const state: TeacherVerificationQueueItem["state"] =
        decision?.outcome === "CONFIRMED" ? "CONFIRMED"
          : decision?.outcome === "RETURNED" ? "RETURNED"
            : decision?.outcome === "REJECTED" ? "REJECTED"
              : "PENDING";

      return [Object.freeze({
        obligationId: obligation.id,
        instituteId: obligation.instituteId,
        studentId: obligation.studentId,
        assignmentVersionId: version.id,
        assignmentTitle: version.title,
        slotId: slot.id,
        slotPosition: slot.position,
        questionLabel: slot.questionLabel,
        evidenceEventId: report.id,
        submittedAt: report.recordedAt,
        state,
      })];
    });

  return Object.freeze(rows.sort((a, b) =>
    Date.parse(a.submittedAt) - Date.parse(b.submittedAt) ||
    a.obligationId.localeCompare(b.obligationId),
  ));
}
