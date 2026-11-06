import { describe, expect, it } from "vitest";
import { prepareTeacherVerification } from "./teacher-verification-domain";
import type { SystemAWorkEvidence, SystemAVerificationDecision } from "./workflow-domain";

const report = (overrides: Partial<SystemAWorkEvidence> = {}): SystemAWorkEvidence => ({
  id: "report-1", instituteId: "inst-1", studentId: "student-1",
  obligationId: "obligation-1", exerciseSlotId: "slot-1",
  actorId: "student-1", actorRole: "STUDENT", source: "STUDENT_SELF_REPORT",
  workProgress: "SUBMITTED", attemptCycleId: "cycle-1", idempotencyKey: "report-key",
  occurredAt: "2026-11-06T10:00:00.000Z", recordedAt: "2026-11-06T10:01:00.000Z",
  ...overrides,
});
const priorDecision = (overrides: Partial<SystemAVerificationDecision> = {}): SystemAVerificationDecision => ({
  id: "decision-old", instituteId: "inst-1", obligationId: "obligation-1",
  evidenceEventId: "report-1", verifierId: "teacher-1", purpose: "COMPLETION",
  outcome: "RETURNED", reason: "Show intermediate steps",
  decidedAt: "2026-11-06T11:00:00.000Z", ...overrides,
});
const command = (overrides: Record<string, unknown> = {}) => ({
  instituteId: "inst-1", reviewerId: "teacher-2", reviewerRole: "TEACHER" as const,
  obligationId: "obligation-1", evidenceEventId: "report-1",
  outcome: "CONFIRMED" as const, reason: "Work checked against the solution",
  decidedAt: "2026-11-06T12:00:00.000Z", decisionId: "decision-new", ...overrides,
});
const prepare = (c = command(), evidence = [report()], history: SystemAVerificationDecision[] = []) =>
  prepareTeacherVerification({
    command: c, authorizedObligationIds: ["obligation-1"], evidence, decisionHistory: history,
  });

describe("teacher verification command contract", () => {
  it("creates a completion decision against the exact submitted learner report", () => {
    const result = prepare();
    expect(result.outcome).toBe("CREATED");
    expect(result.decision.evidenceEventId).toBe("report-1");
    expect(result.decision.purpose).toBe("COMPLETION");
    expect(Object.isFrozen(result.decision)).toBe(true);
  });

  it("rejects reviewers outside the authorized obligation scope", () => {
    expect(() => prepareTeacherVerification({
      command: command(), authorizedObligationIds: [], evidence: [report()], decisionHistory: [],
    })).toThrow(/not authorized/i);
  });

  it("rejects a different institute or obligation's evidence", () => {
    expect(() => prepare(command({ instituteId: "inst-2" }))).toThrow(/does not belong/i);
    expect(() => prepareTeacherVerification({
      command: command({ obligationId: "obligation-2" }),
      authorizedObligationIds: ["obligation-2"], evidence: [report()], decisionHistory: [],
    })).toThrow(/does not belong/i);
  });

  it("rejects teacher observations and non-submitted reports", () => {
    expect(() => prepare(command(), [report({ source: "TEACHER_OBSERVATION", actorRole: "TEACHER" })])).toThrow(/self-reported/i);
    expect(() => prepare(command(), [report({ workProgress: "ATTEMPTED" })])).toThrow(/submitted/i);
  });

  it("rejects self-verification by the learner", () => {
    expect(() => prepare(command({ reviewerId: "student-1" }))).toThrow(/cannot verify their own/i);
  });

  it("accepts all supported completion outcomes", () => {
    for (const outcome of ["CONFIRMED", "NOT_CONFIRMED", "RETURNED", "REJECTED"] as const) {
      expect(prepare(command({ outcome })).outcome).toBe("CREATED");
    }
  });

  it("requires a new decision to supersede the latest prior decision", () => {
    const prior = priorDecision();
    expect(() => prepare(command(), [report()], [prior])).toThrow(/supersede the latest/i);
    const result = prepare(command({ supersedesDecisionId: prior.id }), [report()], [prior]);
    expect(result.outcome).toBe("CREATED");
    expect(result.decision.supersedesDecisionId).toBe(prior.id);
  });

  it("rejects supersession when no prior decision exists", () => {
    expect(() => prepare(command({ supersedesDecisionId: "missing" }))).toThrow(/no prior/i);
  });

  it("returns an identical decision retry without creating a new decision", () => {
    const prior = priorDecision({
      id: "decision-new", verifierId: "teacher-2", outcome: "CONFIRMED",
      reason: "Work checked against the solution",
      decidedAt: "2026-11-06T12:00:00.000Z",
    });
    const result = prepare(command(), [report()], [prior]);
    expect(result.outcome).toBe("IDEMPOTENT_REPLAY");
    expect(result.decision).toBe(prior);
  });

  it("rejects a decision identifier reused with different content", () => {
    const prior = priorDecision({ id: "decision-new" });
    expect(() => prepare(command(), [report()], [prior])).toThrow(/Decision ID conflict/i);
  });

  it("does not mutate earlier decisions", () => {
    const prior = priorDecision();
    prepare(command({ supersedesDecisionId: prior.id }), [report()], [prior]);
    expect(prior.outcome).toBe("RETURNED");
    expect(prior.id).toBe("decision-old");
  });
});
