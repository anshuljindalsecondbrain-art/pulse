import { describe, expect, it } from "vitest";
import { OFFLINE_MODULES } from "./offline-catalog";
import { planAssignmentPublication } from "./assignment-domain";
import { prepareStudentEvidenceSubmission } from "./evidence-submission-domain";
import type { SystemAWorkEvidence } from "./workflow-domain";

const module = OFFLINE_MODULES[0];
const plan = planAssignmentPublication({
  instituteId: "inst-1", assignmentId: "a-1", assignmentVersionId: "av-1",
  versionNumber: 1, title: "Practice", module,
  selectedQuestionIds: [module.questions[0].id],
  targetStudents: [{ studentId: "stu-1", eligibility: "ELIGIBLE" }],
  dueAt: "2026-11-10T18:00:00.000Z", publishedAt: "2026-11-06T10:00:00.000Z",
  publishedBy: "teacher-1",
});
const obligation = plan.obligations[0];
const submission = (overrides: Record<string, unknown> = {}) => ({
  instituteId: "inst-1", studentId: "stu-1", obligationId: obligation.id,
  exerciseSlotId: obligation.exerciseSlotId, actorId: "stu-1",
  workProgress: "SUBMITTED" as const, attemptCycleId: "cycle-1",
  idempotencyKey: "key-1", occurredAt: "2026-11-06T11:00:00.000Z",
  recordedAt: "2026-11-06T11:01:00.000Z", ...overrides,
});
const existing = (overrides: Partial<SystemAWorkEvidence> = {}): SystemAWorkEvidence => ({
  id: "ev-1", instituteId: "inst-1", studentId: "stu-1",
  obligationId: obligation.id, exerciseSlotId: obligation.exerciseSlotId,
  actorId: "stu-1", actorRole: "STUDENT", source: "STUDENT_SELF_REPORT",
  workProgress: "SUBMITTED", attemptCycleId: "cycle-1", idempotencyKey: "key-1",
  occurredAt: "2026-11-06T11:00:00.000Z", recordedAt: "2026-11-06T11:01:00.000Z",
  ...overrides,
});
const prepare = (s = submission(), evidence: SystemAWorkEvidence[] = []) =>
  prepareStudentEvidenceSubmission({
    submission: s, obligations: plan.obligations, assignmentVersions: [plan.assignmentVersion],
    existingEvidence: evidence, newEvidenceId: "ev-new",
  });

describe("student evidence submission command contract", () => {
  it("creates immutable append-only student evidence for an eligible published slot", () => {
    const result = prepare();
    expect(result.outcome).toBe("CREATED");
    expect(Object.isFrozen(result.evidence)).toBe(true);
    expect(result.evidence.id).toBe("ev-new");
  });

  it("rejects an actor identity that differs from the learner identity", () => {
    expect(() => prepare(submission({ actorId: "another-user" }))).toThrow(/authenticated student/i);
  });

  it("rejects cross-learner and cross-institute obligation access", () => {
    expect(() => prepare(submission({ studentId: "stu-2", actorId: "stu-2" }))).toThrow(/does not belong/i);
    expect(() => prepare(submission({ instituteId: "inst-2" }))).toThrow(/does not belong/i);
  });

  it("rejects a slot that differs from the obligation", () => {
    expect(() => prepare(submission({ exerciseSlotId: "foreign-slot" }))).toThrow(/slot does not match/i);
  });

  it("rejects exempted obligations", () => {
    const exempted = { ...obligation, eligibility: "EXEMPTED" as const };
    expect(() => prepareStudentEvidenceSubmission({
      submission: submission(), obligations: [exempted],
      assignmentVersions: [plan.assignmentVersion], existingEvidence: [], newEvidenceId: "ev-new",
    })).toThrow(/exempted or removed/i);
  });

  it("returns the original record for an identical idempotent retry", () => {
    const prior = existing();
    const result = prepare(submission(), [prior]);
    expect(result.outcome).toBe("IDEMPOTENT_REPLAY");
    expect(result.evidence).toBe(prior);
  });

  it("rejects reuse of an idempotency key with a changed payload", () => {
    expect(() => prepare(submission({ workProgress: "ATTEMPTED" }), [existing()])).toThrow(/Idempotency conflict/i);
  });

  it("requires a resubmission to reference same-obligation evidence", () => {
    expect(() => prepare(submission({ supersedesEventId: "missing" }))).toThrow(/same learner and question obligation/i);
  });

  it("preserves the attempt cycle when resubmitting corrected work", () => {
    const prior = existing({ id: "ev-prior", idempotencyKey: "key-old" });
    const result = prepare(submission({ supersedesEventId: "ev-prior" }), [prior]);
    expect(result.outcome).toBe("CREATED");
    expect(result.evidence.attemptCycleId).toBe("cycle-1");
    expect(result.evidence.supersedesEventId).toBe("ev-prior");
  });

  it("rejects a correction resubmission that changes attempt cycle", () => {
    const prior = existing({ id: "ev-prior", idempotencyKey: "key-old" });
    expect(() => prepare(submission({
      supersedesEventId: "ev-prior", attemptCycleId: "cycle-new",
    }), [prior])).toThrow(/preserve the original attemptCycleId/i);
  });

  it("does not mutate or replace historical evidence", () => {
    const prior = existing();
    prepare(submission({ idempotencyKey: "key-2" }), [prior]);
    expect(prior.workProgress).toBe("SUBMITTED");
    expect(prior.id).toBe("ev-1");
  });
});
