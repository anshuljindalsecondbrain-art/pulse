import { describe, expect, it } from "vitest";
import { createExerciseRecord, publishExercise, reviseExercise, validateExerciseDraft, type ExerciseDraft } from "./exercise-builder-domain";

const base: ExerciseDraft = {
  id: "ex-1", title: "Mechanics assessment", subject: "Physics",
  scope: "MULTI_CHAPTER", chapters: ["Kinematics", "Laws of Motion"],
  assessmentMode: "HYBRID",
  slots: [
    { id: "s1", order: 1, origin: "MANUAL", label: "Question 1", chapter: "Kinematics", maxMarks: 4 },
    { id: "s2", order: 2, origin: "OFFLINE_MODULE", questionRef: "mod-q2", label: "Question 2", chapter: "Laws of Motion", maxMarks: 4 },
  ],
  markingScheme: { id: "jee-4-minus-1", version: 1, correct: 4, incorrect: -1, partiallyCorrect: 2, unattempted: 0, skipped: 0, notApplicable: 0 },
};

describe("exercise builder domain", () => {
  it("supports multi-chapter exercises with manual and sourced slots", () => {
    expect(() => validateExerciseDraft(base)).not.toThrow();
  });
  it("supports full-syllabus scope without requiring QBMS references", () => {
    const draft = { ...base, scope: "FULL_SYLLABUS" as const, chapters: ["Kinematics", "Laws of Motion", "Waves"] };
    expect(() => validateExerciseDraft({ ...draft, slots: [...draft.slots, { id: "s3", order: 3, origin: "MANUAL", label: "Question 3", chapter: "Waves" }] })).not.toThrow();
  });
  it("requires exact chapter cardinality for single and multi chapter", () => {
    expect(() => validateExerciseDraft({ ...base, scope: "SINGLE_CHAPTER" })).toThrow(/exactly one/);
    expect(() => validateExerciseDraft({ ...base, chapters: ["Kinematics"] })).toThrow(/at least two/);
  });
  it("requires source refs for QBMS and offline slots but not manual slots", () => {
    expect(() => validateExerciseDraft({ ...base, slots: [{ ...base.slots[1], questionRef: undefined }] })).toThrow(/source question reference/);
  });
  it("requires explicit marking configuration for marks-based modes", () => {
    expect(() => validateExerciseDraft({ ...base, markingScheme: undefined })).toThrow(/explicit marking scheme/);
  });
  it("rejects duplicate slot IDs, duplicate order and unselected chapter references", () => {
    expect(() => validateExerciseDraft({ ...base, slots: [base.slots[0], { ...base.slots[1], id: "s1" }] })).toThrow(/unique/);
    expect(() => validateExerciseDraft({ ...base, slots: [base.slots[0], { ...base.slots[1], order: 1 }] })).toThrow(/order/);
    expect(() => validateExerciseDraft({ ...base, slots: [{ ...base.slots[0], chapter: "Thermodynamics" }] })).toThrow(/selected chapter/);
  });
  it("publishes immutable snapshots and preserves history across revisions", () => {
    const first = publishExercise(createExerciseRecord(base), "2026-11-06T12:00:00.000Z");
    const revised = reviseExercise(first, { ...base, title: "Mechanics assessment · revised" });
    const second = publishExercise(revised, "2026-11-07T12:00:00.000Z");
    expect(first.publishedVersions[0].version).toBe(1);
    expect(second.publishedVersions.map(version => version.version)).toEqual([1, 2]);
    expect(second.publishedVersions[0].title).toBe("Mechanics assessment");
    expect(second.publishedVersions[1].title).toContain("revised");
    expect(Object.isFrozen(second.publishedVersions)).toBe(true);
  });
  it("rejects invalid timestamps and changed identity on revision", () => {
    const record = createExerciseRecord(base);
    expect(() => publishExercise(record, "not-a-date")).toThrow(/timestamp/);
    expect(() => reviseExercise(record, { ...base, id: "other" })).toThrow(/identity/);
  });
});
