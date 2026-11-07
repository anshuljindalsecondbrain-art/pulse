import { describe, expect, it } from "vitest";
import { createDemoRepository, type DemoStorage } from "./demo-repository";

function memoryStorage(): DemoStorage {
  const values = new Map<string, string>();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => { values.set(key, value); },
    removeItem: (key) => { values.delete(key); },
  };
}

describe("demo repository adapter", () => {
  it("returns deterministic seed fallback when a collection is absent", () => {
    const repository = createDemoRepository(memoryStorage());
    expect(repository.read("students", [{ id: "seed-1" }])).toEqual([{ id: "seed-1" }]);
  });

  it("round-trips typed demo records", () => {
    const repository = createDemoRepository(memoryStorage());
    const records = [{ id: "student-1", name: "Demo Student" }, { id: "student-2", name: "Another Student" }];
    repository.write("students", records);
    expect(repository.read("students", [])).toEqual(records);
  });

  it("uses a namespaced storage key to avoid collisions with other app data", () => {
    const storage = memoryStorage();
    const repository = createDemoRepository(storage, "test-demo.");
    repository.write("attendance", { "2026-11-07-student-1": "Present" });
    expect(storage.getItem("test-demo.attendance")).toContain("Present");
    expect(storage.getItem("pulse.demo.v4.attendance")).toBeNull();
  });

  it("falls back safely when a stored collection contains invalid JSON", () => {
    const storage = memoryStorage();
    storage.setItem("pulse.demo.v4.students", "{not-json");
    const repository = createDemoRepository(storage);
    expect(repository.read("students", ["seed"])).toEqual(["seed"]);
  });

  it("clears only the known demo collections", () => {
    const storage = memoryStorage();
    const repository = createDemoRepository(storage);
    for (const name of ["students", "exercises", "marks", "doubts", "attendance"]) repository.write(name, [1]);
    repository.write("unrelated", ["keep"]);
    repository.clear();
    expect(repository.read("students", ["empty"])).toEqual(["empty"]);
    expect(repository.read("unrelated", [])).toEqual(["keep"]);
  });

  it("rejects unsafe collection names", () => {
    const repository = createDemoRepository(memoryStorage());
    expect(() => repository.read("../auth", null)).toThrow("Invalid demo collection name.");
  });
});
