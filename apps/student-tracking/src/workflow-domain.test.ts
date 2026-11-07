import { describe, expect, it } from "vitest";
import {
  createSystemAVerificationDecision,
  createWorkEvidence,
  deriveSystemAMetrics,
  type SystemAObligation,
  type SystemAWorkEvidence,
  type SystemAVerificationDecision,
} from "./workflow-domain";

const obligation: SystemAObligation = {
  id: "obl-1", studentId: "stu-1", assignmentVersionId: "av-1",
  exerciseSlotId: "slot-1", eligibility: "ELIGIBLE",
};
const report = (overrides: Partial<SystemAWorkEvidence> = {}) => createWorkEvidence({
  id: "ev-1", instituteId: "inst-1", studentId: "stu-1", obligationId: "obl-1",
  exerciseSlotId: "slot-1", actorId: "stu-1", actorRole: "STUDENT",
  source: "STUDENT_SELF_REPORT", workProgress: "SUBMITTED", attemptCycleId: "cycle-1",
  idempotencyKey: "idem-1", occurredAt: "2026-11-06T08:00:00.000Z",
  recordedAt: "2026-11-06T08:00:01.000Z", ...overrides,
});
const decision = (overrides: Partial<SystemAVerificationDecision> = {}) =>
  createSystemAVerificationDecision({
    id: "vd-1", instituteId: "inst-1", obligationId: "obl-1", evidenceEventId: "ev-1",
    verifierId: "teacher-1", purpose: "COMPLETION", outcome: "CONFIRMED",
    reason: "Reviewed in class", decidedAt: "2026-11-06T09:00:00.000Z", ...overrides,
  });

describe("System A canonical evidence contract", () => {
  it("rejects student self-reports attributed to non-student actors", () => {
    expect(() => report({ actorRole: "TEACHER" })).toThrow(/student actor/i);
  });

  it("keeps teacher observations distinct from student self-reports", () => {
    const observation = report({
      id: "ev-teacher", actorId: "teacher-1", actorRole: "TEACHER",
      source: "TEACHER_OBSERVATION", workProgress: "ATTEMPTED",
    });
    expect(observation.source).toBe("TEACHER_OBSERVATION");
    expect(observation.actorRole).toBe("TEACHER");
  });

  it("freezes source evidence records", () => {
    const event = report();
    expect(Object.isFrozen(event)).toBe(true);
  });

  it("requires system-import events to use the system actor", () => {
    expect(() => report({ source: "SYSTEM_IMPORT", actorRole: "STUDENT" })).toThrow(/system actor/i);
  });

  it("requires purpose-compatible outcomes for verification", () => {
    expect(() => decision({ purpose: "ANSWER_EVALUATION", outcome: "CONFIRMED" })).toThrow(/evaluation outcome/i);
    expect(() => decision({ purpose: "COMPLETION", outcome: "CORRECT" })).toThrow(/completion outcome/i);
  });

  it("keeps student submission separate from verified completion and accuracy", () => {
    const metrics = deriveSystemAMetrics({
      obligations: [obligation], evidence: [report()], decisions: [],
    });
    expect(metrics.reportedCompleteObligations).toBe(1);
    expect(metrics.verifiedCompleteObligations).toBe(0);
    expect(metrics.accuracyPercent).toBeNull();
  });

  it("requires a decision against the exact submitted evidence for verified completion", () => {
    const metrics = deriveSystemAMetrics({
      obligations: [obligation], evidence: [report()], decisions: [decision()],
    });
    expect(metrics.verifiedCompleteObligations).toBe(1);
  });

  it("does not use completion confirmation as answer correctness", () => {
    const metrics = deriveSystemAMetrics({
      obligations: [obligation], evidence: [report()], decisions: [decision()],
    });
    expect(metrics.accuracyPercent).toBeNull();
    expect(metrics.evaluatedObligations).toBe(0);
  });

  it("does not include an evaluation attached to an older superseded report", () => {
    const old = report({ id: "ev-old", workProgress: "ATTEMPTED", recordedAt: "2026-11-06T08:00:00.000Z" });
    const current = report({ id: "ev-current", recordedAt: "2026-11-06T09:00:00.000Z" });
    const oldEvaluation = decision({
      id: "vd-old", evidenceEventId: "ev-old", purpose: "ANSWER_EVALUATION",
      outcome: "CORRECT", decidedAt: "2026-11-06T08:30:00.000Z",
    });
    const metrics = deriveSystemAMetrics({
      obligations: [obligation], evidence: [old, current], decisions: [oldEvaluation],
    });
    expect(metrics.evaluatedObligations).toBe(0);
    expect(metrics.accuracyPercent).toBeNull();
  });

  it("counts accuracy only from explicit answer-evaluation decisions", () => {
    const evaluation = decision({
      id: "vd-eval", purpose: "ANSWER_EVALUATION", outcome: "CORRECT",
      decidedAt: "2026-11-06T09:05:00.000Z",
    });
    const metrics = deriveSystemAMetrics({
      obligations: [obligation], evidence: [report()], decisions: [evaluation],
    });
    expect(metrics.accuracyPercent).toBe(100);
  });

  it("excludes exempted and removed obligations from progress denominators", () => {
    const metrics = deriveSystemAMetrics({
      obligations: [
        obligation,
        { ...obligation, id: "obl-2", eligibility: "EXEMPTED" },
        { ...obligation, id: "obl-3", eligibility: "REMOVED" },
      ],
      evidence: [report()], decisions: [],
    });
    expect(metrics.assignedObligations).toBe(3);
    expect(metrics.eligibleObligations).toBe(1);
    expect(metrics.exemptedObligations).toBe(1);
    expect(metrics.removedObligations).toBe(1);
    expect(metrics.reportedProgressPercent).toBe(100);
  });

  it("returns null percentages when the relevant denominator is zero", () => {
    const metrics = deriveSystemAMetrics({ obligations: [], evidence: [], decisions: [] });
    expect(metrics.reportedProgressPercent).toBeNull();
    expect(metrics.verifiedProgressPercent).toBeNull();
    expect(metrics.accuracyPercent).toBeNull();
  });

  it("does not count teacher observations as student attempts", () => {
    const observation = report({
      id: "ev-observation", actorId: "teacher-1", actorRole: "TEACHER",
      source: "TEACHER_OBSERVATION", workProgress: "ATTEMPTED",
    });
    const metrics = deriveSystemAMetrics({
      obligations: [obligation], evidence: [observation], decisions: [],
    });
    expect(metrics.attemptedObligations).toBe(0);
  });
});

describe("System A metrics input integrity", () => {
  it("rejects duplicate obligation IDs instead of inflating assigned counts", () => {
    expect(() => deriveSystemAMetrics({
      obligations: [obligation, { ...obligation }],
      evidence: [], decisions: [],
    })).toThrow(/duplicate.*obligation/i);
  });

  it("rejects duplicate evidence IDs instead of silently overwriting the lookup entry", () => {
    const first = report({ id: "duplicate-evidence", workProgress: "ATTEMPTED" });
    const second = report({ id: "duplicate-evidence", workProgress: "SUBMITTED" });
    expect(() => deriveSystemAMetrics({
      obligations: [obligation], evidence: [first, second], decisions: [],
    })).toThrow(/duplicate.*evidence/i);
  });

  it("rejects duplicate decision IDs even when their purposes differ", () => {
    const completion = decision({ id: "duplicate-decision" });
    const evaluation = decision({
      id: "duplicate-decision", purpose: "ANSWER_EVALUATION", outcome: "CORRECT",
    });
    expect(() => deriveSystemAMetrics({
      obligations: [obligation], evidence: [report()], decisions: [completion, evaluation],
    })).toThrow(/duplicate.*decision/i);
  });
});
