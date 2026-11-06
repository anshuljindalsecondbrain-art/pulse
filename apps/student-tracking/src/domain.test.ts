import { describe, expect, it } from "vitest";
import { isAttemptedStatus, nextStatus, summarizeStatuses, STATUSES } from "./domain";

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
