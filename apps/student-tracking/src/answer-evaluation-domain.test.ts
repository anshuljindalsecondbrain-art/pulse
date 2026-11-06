import { describe, expect, it } from "vitest";
import { prepareAnswerEvaluation } from "./answer-evaluation-domain";
import type { AnswerEvaluationObligation } from "./answer-evaluation-domain";
import type { SystemAWorkEvidence, SystemAVerificationDecision } from "./workflow-domain";

const obligation: AnswerEvaluationObligation = Object.freeze({
  id: "obligation-1", instituteId: "inst-1", studentId: "student-1",
  exerciseSlotId: "slot-1", eligibility: "ELIGIBLE" as const,
});
const report = (overrides: Partial<SystemAWorkEvidence> = {}): SystemAWorkEvidence => ({
  id: "report-1", instituteId: "inst-1", studentId: "student-1",
  obligationId: "obligation-1", exerciseSlotId: "slot-1",
  actorId: "student-1", actorRole: "STUDENT", source: "STUDENT_SELF_REPORT",
  workProgress: "SUBMITTED", attemptCycleId: "cycle-1", idempotencyKey: "report-key",
  occurredAt: "2026-11-06T10:00:00.000Z", recordedAt: "2026-11-06T10:01:00.000Z",
  ...overrides,
});
const prior = (overrides: Partial<SystemAVerificationDecision> = {}): SystemAVerificationDecision => ({
  id: "evaluation-old", instituteId: "inst-1", obligationId: "obligation-1",
  evidenceEventId: "report-1", verifierId: "teacher-1", purpose: "ANSWER_EVALUATION",
  outcome: "INCORRECT", reason: "The sign convention is incorrect",
  decidedAt: "2026-11-06T11:00:00.000Z", ...overrides,
});
const command = (overrides: Record<string, unknown> = {}) => ({
  decisionId: "evaluation-new", instituteId: "inst-1",
  obligationId: "obligation-1", exerciseSlotId: "slot-1", evidenceEventId: "report-1",
  evaluatorId: "teacher-2", evaluatorRole: "TEACHER" as const,
  outcome: "CORRECT" as const, reason: "Method and final result are correct",
  decidedAt: "2026-11-06T12:00:00.000Z", ...overrides,
});
const prepare = (
  c = command(),
  evidence = [report()],
  history: SystemAVerificationDecision[] = [],
  authorizedObligationIds = ["obligation-1"],
  target = obligation,
) => prepareAnswerEvaluation({
  command: c, obligation: target, authorizedObligationIds, evidence, decisionHistory: history,
});

describe("independent answer evaluation command contract", () => {
  it("creates a decision linked to the exact submitted evidence and question slot", () => {
    const result = prepare();
    expect(result.outcome).toBe("CREATED");
    expect(result.decision.evidenceEventId).toBe("report-1");
    expect(result.decision.purpose).toBe("ANSWER_EVALUATION");
    expect(result.decision.outcome).toBe("CORRECT");
    expect(Object.isFrozen(result.decision)).toBe(true);
  });

  it("supports all three answer-evaluation outcomes", () => {
    for (const outcome of ["CORRECT", "INCORRECT", "PARTIALLY_CORRECT"] as const) {
      expect(prepare(command({ outcome })).decision.outcome).toBe(outcome);
    }
  });

  it("does not require a completion-verification decision before evaluation", () => {
    expect(prepare().decision.purpose).toBe("ANSWER_EVALUATION");
  });

  it("rejects unauthorized evaluators and self-evaluation", () => {
    expect(() => prepare(command(), [report()], [], [])).toThrow(/not authorized/i);
    expect(() => prepare(command({ evaluatorId: "student-1" }))).toThrow(/own answer/i);
  });

  it("rejects evidence from a different institute, learner, obligation or slot", () => {
    expect(() => prepare(command({ instituteId: "inst-2" }))).toThrow(/does not match/i);
    expect(() => prepare(command({ exerciseSlotId: "slot-2" }))).toThrow(/does not match/i);
    expect(() => prepare(command(), [report({ studentId: "student-2", actorId: "student-2" })])).toThrow(/exact learner/i);
    expect(() => prepare(command(), [report({ obligationId: "obligation-2" })])).toThrow(/exact learner/i);
    expect(() => prepare(command(), [report({ exerciseSlotId: "slot-2" })])).toThrow(/exact learner/i);
  });

  it("rejects exempted and removed obligations", () => {
    for (const eligibility of ["EXEMPTED", "REMOVED"] as const) {
      expect(() => prepare(command(), [report()], [], ["obligation-1"],
        { ...obligation, eligibility })).toThrow(/eligible obligation/i);
    }
  });

  it("accepts only submitted student self-report evidence", () => {
    expect(() => prepare(command(), [report({ workProgress: "ATTEMPTED" })])).toThrow(/submitted learner/i);
    expect(() => prepare(command(), [report({ source: "TEACHER_OBSERVATION", actorRole: "TEACHER" })])).toThrow(/submitted learner/i);
    expect(() => prepare(command(), [report({ actorId: "other-actor" })])).toThrow(/submitted learner/i);
  });

  it("requires a reason and valid timestamp", () => {
    expect(() => prepare(command({ reason: " " }))).toThrow(/reason/i);
    expect(() => prepare(command({ decidedAt: "not-a-date" }))).toThrow(/valid timestamp/i);
  });

  it("requires a new decision to supersede the latest evaluation", () => {
    const previous = prior();
    expect(() => prepare(command(), [report()], [previous])).toThrow(/supersede the latest/i);
    const result = prepare(command({ supersedesDecisionId: previous.id }), [report()], [previous]);
    expect(result.decision.supersedesDecisionId).toBe(previous.id);
  });

  it("rejects supersession when there is no prior answer evaluation", () => {
    expect(() => prepare(command({ supersedesDecisionId: "missing" }))).toThrow(/no prior/i);
  });

  it("returns an exact retry and rejects conflicting decision-ID reuse", () => {
    const previous = prior({
      id: "evaluation-new", verifierId: "teacher-2", outcome: "CORRECT",
      reason: "Method and final result are correct",
      decidedAt: "2026-11-06T12:00:00.000Z",
    });
    expect(prepare(command(), [report()], [previous]).outcome).toBe("IDEMPOTENT_REPLAY");
    expect(() => prepare(command(), [report()], [prior({ id: "evaluation-new" })])).toThrow(/ID conflict/i);
  });

  it("does not mutate prior decisions and keeps completion decisions separate", () => {
    const previous = prior();
    const completion: SystemAVerificationDecision = {
      ...previous, id: "completion-1", purpose: "COMPLETION",
      outcome: "CONFIRMED", reason: "Submission completed",
    };
    prepare(command({ supersedesDecisionId: previous.id }), [report()], [previous, completion]);
    expect(previous.outcome).toBe("INCORRECT");
    expect(completion.outcome).toBe("CONFIRMED");
    expect(completion.purpose).toBe("COMPLETION");
  });
});
