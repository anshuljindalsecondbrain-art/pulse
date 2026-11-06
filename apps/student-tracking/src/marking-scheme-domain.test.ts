import { describe, expect, it } from "vitest";
import { scoreAssessment, type MarkingScheme } from "./marking-scheme-domain";

const scheme: MarkingScheme = {
  id: "jee-standard", version: 1,
  correct: 4, incorrect: -1, partiallyCorrect: 2.5,
  unattempted: 0, skipped: 0, notApplicable: 0,
};

describe("decimal and negative marking", () => {
  it("scores negative and decimal marks without floating point accumulation drift", () => {
    const result = scoreAssessment(scheme, [
      { questionRef: "q1", outcome: "CORRECT" },
      { questionRef: "q2", outcome: "INCORRECT" },
      { questionRef: "q3", outcome: "PARTIALLY_CORRECT" },
    ]);
    expect(result.items.map((item) => item.marks)).toEqual([4, -1, 2.5]);
    expect(result.totalMarks).toBe(5.5);
  });

  it("supports per-response marks overrides", () => {
    expect(scoreAssessment(scheme, [
      { questionRef: "q1", outcome: "CORRECT", marksOverride: 1.75 },
    ]).totalMarks).toBe(1.75);
  });

  it("does not count skipped or unattempted as attempted outcomes", () => {
    const result = scoreAssessment(scheme, [
      { questionRef: "q1", outcome: "SKIPPED" },
      { questionRef: "q2", outcome: "UNATTEMPTED" },
    ]);
    expect(result.totalMarks).toBe(0);
  });

  it("rejects duplicate question refs and precision beyond two decimals", () => {
    expect(() => scoreAssessment(scheme, [
      { questionRef: "q1", outcome: "CORRECT" },
      { questionRef: "q1", outcome: "INCORRECT" },
    ])).toThrow(/unique/);
    expect(() => scoreAssessment(scheme, [
      { questionRef: "q1", outcome: "CORRECT", marksOverride: 1.234 },
    ])).toThrow(/two decimal/);
  });

  it("preserves the negative score when incorrect marks are negative", () => {
    expect(scoreAssessment(scheme, [{ questionRef: "q1", outcome: "INCORRECT" }]).totalMarks).toBe(-1);
  });
});
