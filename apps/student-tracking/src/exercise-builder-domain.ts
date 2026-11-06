import { validateMarkingScheme, type MarkingScheme } from "./marking-scheme-domain";

export type ExerciseScope = "SINGLE_CHAPTER" | "MULTI_CHAPTER" | "FULL_SYLLABUS";
export type AssessmentMode = "QUESTION_LEVEL" | "MARKS_BASED" | "HYBRID";
export type SlotOrigin = "MANUAL" | "QBMS" | "OFFLINE_MODULE";
export type ExerciseStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type ExerciseSlot = Readonly<{
  id: string;
  order: number;
  origin: SlotOrigin;
  questionRef?: string;
  label: string;
  chapter: string;
  maxMarks?: number;
}>;

export type ExerciseDraft = Readonly<{
  id: string;
  title: string;
  subject: string;
  scope: ExerciseScope;
  chapters: readonly string[];
  assessmentMode: AssessmentMode;
  slots: readonly ExerciseSlot[];
  markingScheme?: MarkingScheme;
}>;

export type PublishedExerciseVersion = Readonly<{
  exerciseId: string;
  version: number;
  title: string;
  subject: string;
  scope: ExerciseScope;
  chapters: readonly string[];
  assessmentMode: AssessmentMode;
  slots: readonly ExerciseSlot[];
  markingScheme?: MarkingScheme;
  publishedAt: string;
}>;

export type ExerciseRecord = Readonly<{
  id: string;
  status: ExerciseStatus;
  currentDraft: ExerciseDraft;
  publishedVersions: readonly PublishedExerciseVersion[];
}>;

export function validateExerciseDraft(draft: ExerciseDraft): void {
  if (!draft.id.trim() || !draft.title.trim() || !draft.subject.trim()) throw new Error("Exercise id, title and subject are required.");
  const chapters = draft.chapters.map(value => value.trim()).filter(Boolean);
  if (new Set(chapters).size !== chapters.length) throw new Error("Chapter selections must be unique.");
  if (draft.scope === "SINGLE_CHAPTER" && chapters.length !== 1) throw new Error("Single-chapter exercises require exactly one chapter.");
  if (draft.scope === "MULTI_CHAPTER" && chapters.length < 2) throw new Error("Multi-chapter exercises require at least two chapters.");
  if (draft.scope === "FULL_SYLLABUS" && chapters.length < 1) throw new Error("Full-syllabus exercises require at least one syllabus chapter.");
  if (draft.slots.length < 1) throw new Error("Add at least one question slot.");
  const ids = new Set<string>();
  const orders = new Set<number>();
  for (const slot of draft.slots) {
    if (!slot.id.trim() || ids.has(slot.id)) throw new Error("Question slot IDs must be non-empty and unique.");
    ids.add(slot.id);
    if (!Number.isInteger(slot.order) || slot.order < 1 || orders.has(slot.order)) throw new Error("Question slot order must be unique positive integers.");
    orders.add(slot.order);
    if (!slot.label.trim() || !slot.chapter.trim()) throw new Error("Every question slot requires a label and chapter.");
    if (!chapters.includes(slot.chapter)) throw new Error("Every question slot must belong to a selected chapter.");
    if (slot.origin !== "MANUAL" && !slot.questionRef?.trim()) throw new Error("QBMS/offline slots require a source question reference.");
    if (slot.maxMarks !== undefined && (!Number.isFinite(slot.maxMarks) || slot.maxMarks < 0 || Math.round(slot.maxMarks * 100) !== slot.maxMarks * 100)) {
      throw new Error("Question maximum marks must be non-negative with at most two decimal places.");
    }
  }
  if (draft.assessmentMode !== "QUESTION_LEVEL") {
    if (!draft.markingScheme) throw new Error("Marks-based assessment requires an explicit marking scheme.");
    validateMarkingScheme(draft.markingScheme);
  }
  if (draft.assessmentMode === "QUESTION_LEVEL" && draft.markingScheme) validateMarkingScheme(draft.markingScheme);
}

export function createExerciseRecord(draft: ExerciseDraft): ExerciseRecord {
  validateExerciseDraft(draft);
  return Object.freeze({ id: draft.id, status: "DRAFT", currentDraft: freezeDraft(draft), publishedVersions: Object.freeze([]) });
}

export function publishExercise(record: ExerciseRecord, publishedAt: string): ExerciseRecord {
  validateExerciseDraft(record.currentDraft);
  if (record.status === "ARCHIVED") throw new Error("Archived exercises cannot be published.");
  if (!Number.isFinite(Date.parse(publishedAt))) throw new Error("publishedAt must be a valid timestamp.");
  const version: PublishedExerciseVersion = Object.freeze({
    ...record.currentDraft,
    exerciseId: record.id,
    version: record.publishedVersions.length + 1,
    chapters: Object.freeze([...record.currentDraft.chapters]),
    slots: Object.freeze(record.currentDraft.slots.map(slot => Object.freeze({ ...slot }))),
    publishedAt,
  });
  return Object.freeze({ ...record, status: "PUBLISHED", publishedVersions: Object.freeze([...record.publishedVersions, version]) });
}

export function reviseExercise(record: ExerciseRecord, nextDraft: ExerciseDraft): ExerciseRecord {
  if (record.status === "ARCHIVED") throw new Error("Archived exercises cannot be revised.");
  if (nextDraft.id !== record.id) throw new Error("A revision must retain the exercise identity.");
  validateExerciseDraft(nextDraft);
  return Object.freeze({ ...record, status: "DRAFT", currentDraft: freezeDraft(nextDraft) });
}

function freezeDraft(draft: ExerciseDraft): ExerciseDraft {
  return Object.freeze({
    ...draft,
    chapters: Object.freeze([...draft.chapters]),
    slots: Object.freeze(draft.slots.map(slot => Object.freeze({ ...slot }))),
    markingScheme: draft.markingScheme ? Object.freeze({ ...draft.markingScheme }) : undefined,
  });
}
