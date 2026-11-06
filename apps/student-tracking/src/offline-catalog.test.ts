import { describe, expect, it } from "vitest";
import { OFFLINE_MODULES } from "./offline-catalog";

describe("fictional offline module catalogue", () => {
  it("contains modules across the demonstration subjects", () => {
    expect(new Set(OFFLINE_MODULES.map(module => module.subject))).toEqual(
      new Set(["Physics", "Chemistry", "Mathematics", "Biology"]),
    );
  });

  it("keeps module identifiers and question references unique", () => {
    const moduleIds = OFFLINE_MODULES.map(module => module.id);
    const questionIds = OFFLINE_MODULES.flatMap(module => module.questions.map(question => question.id));
    expect(new Set(moduleIds).size).toBe(moduleIds.length);
    expect(new Set(questionIds).size).toBe(questionIds.length);
  });

  it("provides valid chapter and exam metadata for every module", () => {
    for (const module of OFFLINE_MODULES) {
      expect(module.chapter.trim()).not.toBe("");
      expect(module.title.trim()).not.toBe("");
      expect(module.questions.length).toBeGreaterThan(0);
      expect(["JEE", "NEET"]).toContain(module.examTrack);
      expect(["XI", "XII"]).toContain(module.classLevel);
    }
  });
});
