import { describe, expect, it } from "vitest";
import { createAttemptCycle, evaluateAcademicEligibility } from "./academic-eligibility-domain";

const learner = (classLevel: "XI" | "XII" | "DROPPER", stream: "JEE" | "NEET" | "COMMON" = "JEE") => ({
  learnerId: "learner-1", classLevel, stream,
});
const content = (classLevel: "XI" | "XII", stream: "JEE" | "NEET" | "COMMON" = "JEE", subject: "Physics" | "Chemistry" | "Mathematics" | "Biology" = "Physics") => ({
  contentId: "module-1", classLevel, stream, subject,
});

describe("academic assignment eligibility", () => {
  it("allows XI learners to receive XI content", () => {
    expect(evaluateAcademicEligibility(learner("XI"), content("XI")).eligible).toBe(true);
  });

  it("blocks XI learners from XII-only content", () => {
    expect(evaluateAcademicEligibility(learner("XI"), content("XII"))).toEqual({
      eligible: false, reason: "CLASS_LEVEL_MISMATCH",
    });
  });

  it("allows XII learners to receive XI revision content", () => {
    expect(evaluateAcademicEligibility(learner("XII"), content("XI")).eligible).toBe(true);
  });

  it("allows Droppers to receive XI and XII content", () => {
    expect(evaluateAcademicEligibility(learner("DROPPER"), content("XI")).eligible).toBe(true);
    expect(evaluateAcademicEligibility(learner("DROPPER"), content("XII")).eligible).toBe(true);
  });

  it("allows COMMON Physics and Chemistry across JEE and NEET streams", () => {
    expect(evaluateAcademicEligibility(learner("XII", "JEE"), content("XI", "COMMON", "Physics")).eligible).toBe(true);
    expect(evaluateAcademicEligibility(learner("XII", "NEET"), content("XI", "COMMON", "Chemistry")).eligible).toBe(true);
  });

  it("does not allow Mathematics content to be labelled COMMON or NEET", () => {
    expect(evaluateAcademicEligibility(learner("XII", "JEE"), content("XI", "COMMON", "Mathematics"))).toEqual({
      eligible: false, reason: "SUBJECT_STREAM_MISMATCH",
    });
  });

  it("allows a COMMON learner only when subject metadata is compatible", () => {
    expect(evaluateAcademicEligibility(learner("XII", "COMMON"), content("XI", "JEE", "Physics")).eligible).toBe(true);
    expect(evaluateAcademicEligibility(learner("XII", "COMMON"), content("XI", "NEET", "Biology")).eligible).toBe(false);
  });

  it("rejects malformed academic contexts", () => {
    expect(evaluateAcademicEligibility(learner("XI"), { ...content("XI"), contentId: " " })).toEqual({
      eligible: false, reason: "INVALID_CONTEXT",
    });
  });
});

describe("attempt cycle", () => {
  it("creates an immutable initial cycle", () => {
    const cycle = createAttemptCycle({
      obligationId: "obligation-1", cycleNumber: 1,
      openedAt: "2026-11-06T10:00:00.000Z", reason: "INITIAL",
    });
    expect(Object.isFrozen(cycle)).toBe(true);
  });

  it("requires explicit revision/retest/correction reason after cycle one", () => {
    expect(() => createAttemptCycle({
      obligationId: "obligation-1", cycleNumber: 2,
      openedAt: "2026-11-06T10:00:00.000Z", reason: "INITIAL",
    })).toThrow(/non-initial reason/);
    expect(() => createAttemptCycle({
      obligationId: "obligation-1", cycleNumber: 1,
      openedAt: "2026-11-06T10:00:00.000Z", reason: "REVISION",
    })).toThrow(/first attempt cycle/);
  });
});
