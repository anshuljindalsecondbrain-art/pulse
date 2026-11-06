import { describe, expect, it } from "vitest";
import {
  prepareDoubtCreation,
  prepareDoubtTransition,
  type DoubtCase,
  type DoubtEvent,
} from "./doubt-management-domain";

const obligation = Object.freeze({
  id: "obl-1", instituteId: "inst-1", studentId: "stu-1",
  exerciseSlotId: "slot-1", eligibility: "ELIGIBLE" as const,
});
const raise = (overrides: Record<string, unknown> = {}, existingCases: DoubtCase[] = []) =>
  prepareDoubtCreation({
    command: {
      doubtCaseId: "doubt-1", eventId: "doubt-event-1", instituteId: "inst-1",
      studentId: "stu-1", actorId: "stu-1", actorRole: "STUDENT",
      reason: "I cannot understand the free body diagram",
      occurredAt: "2026-11-06T12:00:00.000Z", ...overrides,
    },
    obligation, authorizedStudentObligationIds: ["obl-1"], existingCases,
  });
const opened = () => raise();
const advance = (
  current: DoubtCase,
  history: DoubtEvent[],
  action: "ASSIGN" | "START_INVESTIGATION" | "RESOLVE" | "CONFIRM_BY_STUDENT" | "REOPEN",
  actorId: string,
  actorRole: "STUDENT" | "TEACHER" | "ACADEMIC_REVIEWER",
  overrides: Record<string, unknown> = {},
) => prepareDoubtTransition({
  doubtCase: current,
  command: {
    eventId: `event-${history.length + 1}`, instituteId: "inst-1",
    actorId, actorRole, action, reason: `Reason for ${action}`,
    occurredAt: `2026-11-06T12:${String(history.length + 1).padStart(2, "0")}:00.000Z`,
    ...overrides,
  },
  authorizedObligationIds: ["obl-1"],
  authorizedAssigneeIds: ["teacher-1", "reviewer-1"],
  existingEvents: history,
});

describe("System A doubt management command contract", () => {
  it("raises a doubt against one exact eligible obligation", () => {
    const result = opened();
    expect(result.value.state).toBe("OPEN");
    expect(result.value.exerciseSlotId).toBe("slot-1");
    expect(result.event?.toState).toBe("OPEN");
    expect(Object.isFrozen(result.value)).toBe(true);
    expect(Object.isFrozen(result.event)).toBe(true);
  });

  it("supports exact idempotent creation and rejects conflicting case IDs", () => {
    const first = opened();
    expect(raise({}, [first.value]).outcome).toBe("IDEMPOTENT_REPLAY");
    expect(() => raise({ reason: "Different doubt" }, [first.value])).toThrow(/ID conflict/i);
  });

  it("rejects exempted and removed obligations", () => {
    for (const eligibility of ["EXEMPTED", "REMOVED"] as const) {
      expect(() => prepareDoubtCreation({
        command: { doubtCaseId: "d", eventId: "e", instituteId: "inst-1",
          studentId: "stu-1", actorId: "stu-1", actorRole: "STUDENT",
          reason: "Need help", occurredAt: "2026-11-06T12:00:00Z" },
        obligation: { ...obligation, eligibility },
        authorizedStudentObligationIds: ["obl-1"],
      })).toThrow(/eligible obligation/i);
    }
  });

  it("rejects cross-institute and cross-student obligation references", () => {
    expect(() => raise({ instituteId: "inst-2" })).toThrow(/does not belong/i);
    expect(() => prepareDoubtCreation({
      command: { doubtCaseId: "d", eventId: "e", instituteId: "inst-1",
        studentId: "stu-2", actorId: "stu-2", actorRole: "STUDENT",
        reason: "Need help", occurredAt: "2026-11-06T12:00:00Z" },
      obligation, authorizedStudentObligationIds: ["obl-1"],
    })).toThrow(/does not belong/i);
  });

  it("prevents a student raising a doubt for another learner", () => {
    expect(() => raise({ actorId: "stu-2" })).toThrow(/own work/i);
  });

  it("requires a non-empty reason", () => {
    expect(() => raise({ reason: " " })).toThrow(/reason/i);
  });

  it("assigns only to an assignee in the supplied academic scope", () => {
    const first = opened();
    const assigned = advance(first.value, [first.event!], "ASSIGN", "teacher-1", "TEACHER",
      { assignedToId: "teacher-1" });
    expect(assigned.value.doubtCase.state).toBe("ASSIGNED");
    expect(assigned.value.doubtCase.assignedToId).toBe("teacher-1");
    expect(() => advance(first.value, [first.event!], "ASSIGN", "teacher-1", "TEACHER",
      { assignedToId: "outside-teacher" })).toThrow(/authorized academic scope/i);
  });

  it("only the assigned teacher can start investigation", () => {
    const first = opened();
    const assigned = advance(first.value, [first.event!], "ASSIGN", "teacher-1", "TEACHER",
      { assignedToId: "teacher-1" });
    expect(() => advance(assigned.value.doubtCase, [first.event!, assigned.event],
      "START_INVESTIGATION", "teacher-2", "TEACHER")).toThrow(/assigned academic actor/i);
    const started = advance(assigned.value.doubtCase, [first.event!, assigned.event],
      "START_INVESTIGATION", "teacher-1", "TEACHER");
    expect(started.value.doubtCase.state).toBe("IN_PROGRESS");
  });

  it("requires a resolution note and preserves the separate student confirmation step", () => {
    const first = opened();
    const assigned = advance(first.value, [first.event!], "ASSIGN", "teacher-1", "TEACHER",
      { assignedToId: "teacher-1" });
    const started = advance(assigned.value.doubtCase, [first.event!, assigned.event],
      "START_INVESTIGATION", "teacher-1", "TEACHER");
    expect(() => advance(started.value.doubtCase, [first.event!, assigned.event, started.event],
      "RESOLVE", "teacher-1", "TEACHER", { resolutionNote: " " })).toThrow(/resolutionNote/i);
    const resolved = advance(started.value.doubtCase, [first.event!, assigned.event, started.event],
      "RESOLVE", "teacher-1", "TEACHER", { resolutionNote: "Explained the vector decomposition" });
    expect(resolved.value.doubtCase.state).toBe("RESOLVED");
    expect(() => advance(resolved.value.doubtCase,
      [first.event!, assigned.event, started.event, resolved.event],
      "CONFIRM_BY_STUDENT", "teacher-1", "TEACHER")).toThrow(/affected student/i);
    const confirmed = advance(resolved.value.doubtCase,
      [first.event!, assigned.event, started.event, resolved.event],
      "CONFIRM_BY_STUDENT", "stu-1", "STUDENT");
    expect(confirmed.value.doubtCase.state).toBe("STUDENT_CONFIRMED");
  });

  it("allows the affected student to reopen and requires a fresh assignment", () => {
    const first = opened();
    const assigned = advance(first.value, [first.event!], "ASSIGN", "teacher-1", "TEACHER",
      { assignedToId: "teacher-1" });
    const started = advance(assigned.value.doubtCase, [first.event!, assigned.event],
      "START_INVESTIGATION", "teacher-1", "TEACHER");
    const resolved = advance(started.value.doubtCase, [first.event!, assigned.event, started.event],
      "RESOLVE", "teacher-1", "TEACHER", { resolutionNote: "Explained" });
    const reopened = advance(resolved.value.doubtCase,
      [first.event!, assigned.event, started.event, resolved.event],
      "REOPEN", "stu-1", "STUDENT");
    expect(reopened.value.doubtCase.state).toBe("REOPENED");
    expect(reopened.value.doubtCase.assignedToId).toBeUndefined();
    expect(reopened.value.doubtCase.resolvedAt).toBe(resolved.value.doubtCase.resolvedAt);
    expect(() => advance(reopened.value.doubtCase,
      [first.event!, assigned.event, started.event, resolved.event, reopened.event],
      "START_INVESTIGATION", "teacher-1", "TEACHER")).toThrow();
  });

  it("rejects cross-institute transitions and unauthorized obligations", () => {
    const first = opened();
    expect(() => advance(first.value, [first.event!], "ASSIGN", "teacher-1", "TEACHER",
      { instituteId: "inst-2", assignedToId: "teacher-1" })).toThrow(/crosses institute/i);
    expect(() => prepareDoubtTransition({
      doubtCase: first.value,
      command: { eventId: "e2", instituteId: "inst-1", actorId: "teacher-1",
        actorRole: "TEACHER", action: "ASSIGN", reason: "Assign",
        occurredAt: "2026-11-06T12:10:00Z", assignedToId: "teacher-1" },
      authorizedObligationIds: [], authorizedAssigneeIds: ["teacher-1"], existingEvents: [first.event!],
    })).toThrow(/not authorized/i);
  });

  it("supports exact idempotent transition replay and rejects event ID conflicts", () => {
    const first = opened();
    const assigned = advance(first.value, [first.event!], "ASSIGN", "teacher-1", "TEACHER",
      { assignedToId: "teacher-1" });
    const replay = prepareDoubtTransition({
      doubtCase: assigned.value.doubtCase,
      command: { eventId: assigned.event.id, instituteId: "inst-1", actorId: "teacher-1",
        actorRole: "TEACHER", action: "ASSIGN", reason: assigned.event.reason,
        occurredAt: assigned.event.occurredAt, assignedToId: "teacher-1" },
      authorizedObligationIds: ["obl-1"], authorizedAssigneeIds: ["teacher-1"],
      existingEvents: [first.event!, assigned.event],
    });
    expect(replay.outcome).toBe("IDEMPOTENT_REPLAY");
    expect(() => prepareDoubtTransition({
      doubtCase: assigned.value.doubtCase,
      command: { eventId: assigned.event.id, instituteId: "inst-1", actorId: "teacher-1",
        actorRole: "TEACHER", action: "REOPEN", reason: "Different action",
        occurredAt: assigned.event.occurredAt },
      authorizedObligationIds: ["obl-1"], existingEvents: [first.event!, assigned.event],
    })).toThrow(/ID conflict/i);
  });

  it("requires the case latest-event pointer to match immutable history", () => {
    const first = opened();
    expect(() => prepareDoubtTransition({
      doubtCase: { ...first.value, latestEventId: "stale-event" },
      command: { eventId: "next", instituteId: "inst-1", actorId: "teacher-1",
        actorRole: "TEACHER", action: "ASSIGN", reason: "Assign",
        occurredAt: "2026-11-06T12:10:00Z", assignedToId: "teacher-1" },
      authorizedObligationIds: ["obl-1"], authorizedAssigneeIds: ["teacher-1"],
      existingEvents: [first.event!],
    })).toThrow(/latest-event pointer/i);
  });

  it("requires resolution explanation and stores all transitions as immutable linked events", () => {
    const first = opened();
    const assigned = advance(first.value, [first.event!], "ASSIGN", "teacher-1", "TEACHER",
      { assignedToId: "teacher-1" });
    expect(assigned.event.previousEventId).toBe(first.event!.id);
    expect(Object.isFrozen(assigned.event)).toBe(true);
    expect(Object.isFrozen(assigned.value.doubtCase)).toBe(true);
  });
});
