import { describe, expect, it } from "vitest";
import { transitionCorrection, transitionDoubt } from "./workflow-transitions";

describe("System A doubt lifecycle", () => {
  it("requires assignment, work, resolution and separate student confirmation", () => {
    expect(transitionDoubt("OPEN", "ASSIGN", "TEACHER", "Assigned to physics teacher").to).toBe("ASSIGNED");
    expect(transitionDoubt("ASSIGNED", "START", "TEACHER", "Started review").to).toBe("IN_PROGRESS");
    expect(transitionDoubt("IN_PROGRESS", "RESOLVE", "TEACHER", "Explained the concept").to).toBe("RESOLVED");
    expect(transitionDoubt("RESOLVED", "CONFIRM_BY_STUDENT", "STUDENT", "I can solve it now").to).toBe("STUDENT_CONFIRMED");
  });

  it("does not let a teacher confirm the student's understanding", () => {
    expect(() => transitionDoubt("RESOLVED", "CONFIRM_BY_STUDENT", "TEACHER", "Done")).toThrow(/only the student/i);
  });

  it("requires a reason for every transition", () => {
    expect(() => transitionDoubt("OPEN", "ASSIGN", "TEACHER", " ")).toThrow(/reason/i);
  });

  it("allows reopening without erasing the previous resolution", () => {
    const result = transitionDoubt("STUDENT_CONFIRMED", "REOPEN", "STUDENT", "Still unable to solve independently");
    expect(result.from).toBe("STUDENT_CONFIRMED");
    expect(result.to).toBe("REOPENED");
  });

  it("does not permit cohort resolution as a single shared case transition", () => {
    expect(() => transitionDoubt("OPEN", "RESOLVE", "TEACHER", "Resolved for entire class")).toThrow();
  });
});

describe("System A correction lifecycle", () => {
  it("tracks correction from required through acceptance and closure", () => {
    expect(transitionCorrection("REQUIRED", "START", "STUDENT", "Started correction").to).toBe("IN_PROGRESS");
    expect(transitionCorrection("IN_PROGRESS", "SUBMIT_CORRECTION", "STUDENT", "Submitted corrected work").to).toBe("RESUBMITTED");
    expect(transitionCorrection("RESUBMITTED", "ACCEPT_CORRECTION", "TEACHER", "Checked the correction").to).toBe("ACCEPTED");
    expect(transitionCorrection("ACCEPTED", "CLOSE_CORRECTION", "TEACHER", "Cycle closed").to).toBe("CLOSED");
  });

  it("returns a rejected resubmission to required correction", () => {
    expect(transitionCorrection("RESUBMITTED", "RETURN_CORRECTION", "ACADEMIC_REVIEWER", "Reasoning still incomplete").to).toBe("REQUIRED");
  });

  it("does not allow a student to accept their own correction", () => {
    expect(() => transitionCorrection("RESUBMITTED", "ACCEPT_CORRECTION", "STUDENT", "I approve")).toThrow(/authorised academic actor/i);
  });

  it("does not allow correction to be started by a teacher", () => {
    expect(() => transitionCorrection("REQUIRED", "START", "TEACHER", "Start it")).toThrow(/only the student/i);
  });
});
