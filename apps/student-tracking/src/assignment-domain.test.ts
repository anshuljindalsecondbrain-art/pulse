import { describe, expect, it } from "vitest";
import { OFFLINE_MODULES } from "./offline-catalog";
import { planAssignmentPublication } from "./assignment-domain";

const module = OFFLINE_MODULES[0];
const baseInput = {
  instituteId: "inst-1",
  assignmentId: "assignment-1",
  assignmentVersionId: "assignment-1-v1",
  versionNumber: 1,
  title: "Rotational Motion Practice",
  module,
  selectedQuestionIds: [module.questions[0].id, module.questions[2].id],
  targetStudents: [
    { studentId: "student-1", eligibility: "ELIGIBLE" as const },
    { studentId: "student-2", eligibility: "EXEMPTED" as const },
  ],
  dueAt: "2026-11-10T18:00:00.000Z",
  publishedAt: "2026-11-06T10:00:00.000Z",
  publishedBy: "teacher-1",
};

describe("assignment publication planner", () => {
  it("snapshots selected existing questions and expands student obligations", () => {
    const plan = planAssignmentPublication(baseInput);
    expect(plan.assignmentVersion.slots.map((slot) => slot.sourceQuestionId)).toEqual(baseInput.selectedQuestionIds);
    expect(plan.obligations).toHaveLength(4);
    expect(plan.summary).toEqual({
      targetStudents: 2,
      eligibleStudents: 1,
      exemptedStudents: 1,
      questionSlots: 2,
      eligibleObligations: 2,
      exemptedObligations: 2,
    });
    expect(plan.obligations.every((item) => item.instituteId === "inst-1")).toBe(true);
  });

  it("is deterministic for the same version and inputs", () => {
    expect(planAssignmentPublication(baseInput)).toEqual(planAssignmentPublication(baseInput));
  });

  it("freezes the version, slots and obligations", () => {
    const plan = planAssignmentPublication(baseInput);
    expect(Object.isFrozen(plan)).toBe(true);
    expect(Object.isFrozen(plan.assignmentVersion)).toBe(true);
    expect(Object.isFrozen(plan.assignmentVersion.slots)).toBe(true);
    expect(Object.isFrozen(plan.obligations)).toBe(true);
    expect(Object.isFrozen(plan.obligations[0])).toBe(true);
  });

  it("rejects empty question selections and target rosters", () => {
    expect(() => planAssignmentPublication({ ...baseInput, selectedQuestionIds: [] })).toThrow(/At least one question/);
    expect(() => planAssignmentPublication({ ...baseInput, targetStudents: [] })).toThrow(/At least one target student/);
  });

  it("rejects duplicate and foreign question references", () => {
    expect(() => planAssignmentPublication({
      ...baseInput,
      selectedQuestionIds: [module.questions[0].id, module.questions[0].id],
    })).toThrow(/must be unique/);
    expect(() => planAssignmentPublication({
      ...baseInput,
      selectedQuestionIds: ["question-from-another-module"],
    })).toThrow(/does not belong/);
  });

  it("rejects duplicate target students and invalid publication dates", () => {
    expect(() => planAssignmentPublication({
      ...baseInput,
      targetStudents: [
        { studentId: "student-1", eligibility: "ELIGIBLE" },
        { studentId: "student-1", eligibility: "ELIGIBLE" },
      ],
    })).toThrow(/Target student identifiers must be unique/);
    expect(() => planAssignmentPublication({
      ...baseInput,
      dueAt: "2026-11-05T10:00:00.000Z",
    })).toThrow(/earlier than publishedAt/);
  });

  it("keeps exempted learners in the snapshot without counting their work as eligible", () => {
    const plan = planAssignmentPublication(baseInput);
    expect(plan.obligations.filter((item) => item.eligibility === "EXEMPTED")).toHaveLength(2);
    expect(plan.summary.eligibleObligations).toBe(2);
  });
});
