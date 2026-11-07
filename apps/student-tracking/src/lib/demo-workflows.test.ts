import { describe, expect, it } from "vitest";
import {
  appendAttendance,
  appendReportEvent,
  appendVerificationDecision,
  transitionAssignment,
  transitionDoubt,
  type DemoAssignment,
  type DemoDoubt,
  type DemoReportEvent,
} from "./demo-workflows";

const draft: DemoAssignment = {
  id: "a1", title: "DPP 1", questionRefs: ["q1", "q2"], targetBatch: "JEE XII",
  dueDate: "2026-11-12", state: "DRAFT",
};
const report: DemoReportEvent = {
  id: "r1", studentId: "s1", assignmentId: "a1", questionRef: "q1",
  status: "C", reportedAt: "2026-11-07T09:00:00.000Z",
};

describe("demo assignment workflow", () => {
  it("publishes only non-empty assignments and freezes a question snapshot", () => {
    const published = transitionAssignment(draft, "PUBLISH", "2026-11-07T09:00:00Z");
    expect(published.state).toBe("PUBLISHED");
    expect(published.publishedSnapshot?.questionRefs).toEqual(["q1", "q2"]);
    expect(Object.isFrozen(published.publishedSnapshot?.questionRefs)).toBe(true);
  });
  it("rejects empty or duplicate question selections", () => {
    expect(() => transitionAssignment({ ...draft, questionRefs: [] }, "PUBLISH", "2026-11-07")).toThrow();
    expect(() => transitionAssignment({ ...draft, questionRefs: ["q1", "q1"] }, "PUBLISH", "2026-11-07")).toThrow();
  });
  it("enforces draft → published → completed", () => {
    expect(() => transitionAssignment(draft, "COMPLETE", "2026-11-07")).toThrow();
    const published = transitionAssignment(draft, "PUBLISH", "2026-11-07");
    expect(transitionAssignment(published, "COMPLETE", "2026-11-08").state).toBe("COMPLETED");
    expect(() => transitionAssignment(published, "PUBLISH", "2026-11-08")).toThrow();
  });
});

describe("append-only report and verification evidence", () => {
  it("appends a later report without mutating the earlier event", () => {
    const first = appendReportEvent([], report);
    const second = appendReportEvent(first, { ...report, id: "r2", status: "I" });
    expect(first).toHaveLength(1);
    expect(first[0].status).toBe("C");
    expect(second).toHaveLength(2);
  });
  it("treats repeated report IDs as idempotent", () => {
    expect(appendReportEvent([report], report)).toHaveLength(1);
  });
  it("keeps verification separate and requires a real report reference", () => {
    const decision = { id: "v1", reportEventId: "r1", outcome: "VERIFIED" as const, decidedAt: "2026-11-07" };
    expect(() => appendVerificationDecision([], [], decision)).toThrow();
    expect(appendVerificationDecision([report], [], decision)).toHaveLength(1);
    expect(appendVerificationDecision([report], [decision], decision)).toHaveLength(1);
  });
});

describe("doubt lifecycle", () => {
  const doubt: DemoDoubt = { id: "d1", studentId: "s1", questionRef: "q1", description: "Need help", state: "OPEN" };
  it("enforces open → assigned → resolved → reopened", () => {
    expect(() => transitionDoubt(doubt, "RESOLVE")).toThrow();
    const assigned = transitionDoubt(doubt, "ASSIGN", "teacher-1");
    expect(assigned.state).toBe("ASSIGNED");
    expect(transitionDoubt(assigned, "RESOLVE").state).toBe("RESOLVED");
    expect(transitionDoubt({ ...assigned, state: "RESOLVED" }, "REOPEN").state).toBe("OPEN");
  });
  it("requires an assignee", () => {
    expect(() => transitionDoubt(doubt, "ASSIGN")).toThrow();
  });
});

describe("attendance uniqueness", () => {
  it("rejects a second record for the same student and date", () => {
    const record = { id: "at1", studentId: "s1", date: "2026-11-07", status: "PRESENT" as const };
    expect(appendAttendance([], record)).toHaveLength(1);
    expect(() => appendAttendance([record], { ...record, id: "at2", status: "ABSENT" })).toThrow();
  });
});
