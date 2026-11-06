import type { OfflineModule } from "./offline-catalog";

/**
 * Pure publication planner. It creates an immutable snapshot and obligation
 * plan; persistence, authorization, roster freshness and atomic commit belong
 * to the server/database boundary.
 */
export type AssignmentTargetStudent = Readonly<{
  studentId: string;
  eligibility: "ELIGIBLE" | "EXEMPTED";
}>;

export type AssignmentSlotSnapshot = Readonly<{
  id: string;
  position: number;
  sourceModuleId: string;
  sourceQuestionId: string;
  questionLabel: string;
  difficulty: "Easy" | "Medium" | "Hard";
}>;

export type AssignmentVersionSnapshot = Readonly<{
  id: string;
  instituteId: string;
  assignmentId: string;
  versionNumber: number;
  title: string;
  sourceModuleId: string;
  sourceModuleTitle: string;
  subject: OfflineModule["subject"];
  chapter: string;
  classLevel: OfflineModule["classLevel"];
  examTrack: OfflineModule["examTrack"];
  dueAt: string;
  publishedAt: string;
  publishedBy: string;
  slots: readonly AssignmentSlotSnapshot[];
}>;

export type PlannedStudentObligation = Readonly<{
  id: string;
  instituteId: string;
  assignmentVersionId: string;
  studentId: string;
  exerciseSlotId: string;
  eligibility: "ELIGIBLE" | "EXEMPTED";
}>;

export type AssignmentPublicationPlan = Readonly<{
  assignmentVersion: AssignmentVersionSnapshot;
  obligations: readonly PlannedStudentObligation[];
  summary: Readonly<{
    targetStudents: number;
    eligibleStudents: number;
    exemptedStudents: number;
    questionSlots: number;
    eligibleObligations: number;
    exemptedObligations: number;
  }>;
}>;

function requireText(value: string, label: string): void {
  if (!value.trim()) throw new Error(`${label} must be non-empty.`);
}

function requireTimestamp(value: string, label: string): number {
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) throw new Error(`${label} must be a valid timestamp.`);
  return timestamp;
}

/**
 * Validates selected catalogue references, freezes the exact question snapshot,
 * and expands one obligation per target-student/slot pair.
 *
 * IDs are deterministic within an assignment version, making retries
 * idempotent at the planning layer. Database uniqueness and transaction
 * semantics are still required for production publication.
 */
export function planAssignmentPublication(input: {
  instituteId: string;
  assignmentId: string;
  assignmentVersionId: string;
  versionNumber: number;
  title: string;
  module: OfflineModule;
  selectedQuestionIds: readonly string[];
  targetStudents: readonly AssignmentTargetStudent[];
  dueAt: string;
  publishedAt: string;
  publishedBy: string;
}): AssignmentPublicationPlan {
  for (const [label, value] of Object.entries({
    instituteId: input.instituteId,
    assignmentId: input.assignmentId,
    assignmentVersionId: input.assignmentVersionId,
    title: input.title,
    publishedBy: input.publishedBy,
    moduleId: input.module.id,
  })) requireText(value, label);

  if (!Number.isInteger(input.versionNumber) || input.versionNumber < 1) {
    throw new Error("versionNumber must be a positive integer.");
  }
  const dueAt = requireTimestamp(input.dueAt, "dueAt");
  const publishedAt = requireTimestamp(input.publishedAt, "publishedAt");
  if (dueAt < publishedAt) throw new Error("dueAt cannot be earlier than publishedAt.");

  if (input.selectedQuestionIds.length === 0) {
    throw new Error("At least one question must be selected.");
  }
  if (input.targetStudents.length === 0) {
    throw new Error("At least one target student is required.");
  }

  const selectedIds = new Set(input.selectedQuestionIds);
  if (selectedIds.size !== input.selectedQuestionIds.length) {
    throw new Error("Selected question references must be unique.");
  }
  const questionById = new Map(input.module.questions.map((question) => [question.id, question]));
  const slots = input.selectedQuestionIds.map((questionId, index) => {
    const question = questionById.get(questionId);
    if (!question) throw new Error(`Question ${questionId} does not belong to the selected module.`);
    return Object.freeze({
      id: `${input.assignmentVersionId}::slot::${encodeURIComponent(questionId)}`,
      position: index + 1,
      sourceModuleId: input.module.id,
      sourceQuestionId: question.id,
      questionLabel: question.label,
      difficulty: question.difficulty,
    });
  });

  const studentIds = new Set<string>();
  for (const target of input.targetStudents) {
    requireText(target.studentId, "studentId");
    if (studentIds.has(target.studentId)) throw new Error("Target student identifiers must be unique.");
    studentIds.add(target.studentId);
  }

  const version: AssignmentVersionSnapshot = Object.freeze({
    id: input.assignmentVersionId,
    instituteId: input.instituteId,
    assignmentId: input.assignmentId,
    versionNumber: input.versionNumber,
    title: input.title.trim(),
    sourceModuleId: input.module.id,
    sourceModuleTitle: input.module.title,
    subject: input.module.subject,
    chapter: input.module.chapter,
    classLevel: input.module.classLevel,
    examTrack: input.module.examTrack,
    dueAt: input.dueAt,
    publishedAt: input.publishedAt,
    publishedBy: input.publishedBy,
    slots: Object.freeze(slots),
  });

  const obligations = input.targetStudents.flatMap((target) =>
    slots.map((slot) => Object.freeze({
      id: `${input.assignmentVersionId}::obligation::${encodeURIComponent(target.studentId)}::${encodeURIComponent(slot.id)}`,
      instituteId: input.instituteId,
      assignmentVersionId: input.assignmentVersionId,
      studentId: target.studentId,
      exerciseSlotId: slot.id,
      eligibility: target.eligibility,
    })),
  );

  const eligibleStudents = input.targetStudents.filter((target) => target.eligibility === "ELIGIBLE").length;
  const exemptedStudents = input.targetStudents.length - eligibleStudents;
  return Object.freeze({
    assignmentVersion: version,
    obligations: Object.freeze(obligations),
    summary: Object.freeze({
      targetStudents: input.targetStudents.length,
      eligibleStudents,
      exemptedStudents,
      questionSlots: slots.length,
      eligibleObligations: eligibleStudents * slots.length,
      exemptedObligations: exemptedStudents * slots.length,
    }),
  });
}
