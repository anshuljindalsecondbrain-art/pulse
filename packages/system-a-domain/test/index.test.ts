import { describe, expect, it } from "vitest";
import {
  assertUniqueEventIds,
  createVerificationDecision,
  createWorkEvidence,
  type VerificationDecision,
  type WorkEvidence,
} from "../src/index";

const evidenceInput: WorkEvidence = {
  id: "evidence-1",
  tenantId: "tenant-1",
  studentId: "student-1",
  obligationId: "obligation-1",
  exerciseSlotId: "slot-1",
  actorId: "student-1",
  actorRole: "STUDENT",
  source: "STUDENT_SELF_REPORT",
  workProgress: "SUBMITTED",
  attemptCycleId: "attempt-1",
  idempotencyKey: "request-1",
  occurredAt: "2026-11-07T08:00:00.000Z",
  recordedAt: "2026-11-07T08:00:01.000Z",
};

const decisionInput: VerificationDecision = {
  id: "decision-1",
  tenantId: "tenant-1",
  obligationId: "obligation-1",
  evidenceEventId: "evidence-1",
  verifierId: "teacher-1",
  purpose: "COMPLETION",
  outcome: "CONFIRMED",
  reason: "Reviewed against the submitted work.",
  decidedAt: "2026-11-07T09:00:00.000Z",
};

describe("System A work evidence", () => {
  it("creates an immutable student report", () => {
    const event = createWorkEvidence(evidenceInput);
    expect(Object.isFrozen(event)).toBe(true);
    expect(event.source).toBe("STUDENT_SELF_REPORT");
  });

  it("rejects source and actor-role mismatches", () => {
    expect(() => createWorkEvidence({
      ...evidenceInput,
      actorRole: "TEACHER",
    })).toThrow(/source and actor role/i);
  });

  it("rejects empty identifiers and invalid timestamps", () => {
    expect(() => createWorkEvidence({ ...evidenceInput, studentId: " " })).toThrow(/studentId/i);
    expect(() => createWorkEvidence({ ...evidenceInput, recordedAt: "not-a-date" })).toThrow(/timestamp/i);
  });

  it("prevents an event from superseding itself", () => {
    expect(() => createWorkEvidence({
      ...evidenceInput,
      supersedesEventId: evidenceInput.id,
    })).toThrow(/cannot supersede itself/i);
  });
});

describe("System A verification decisions", () => {
  it("creates a separate immutable completion decision", () => {
    const evidence = createWorkEvidence(evidenceInput);
    const decision = createVerificationDecision(decisionInput);
    expect(Object.isFrozen(decision)).toBe(true);
    expect(decision.evidenceEventId).toBe(evidence.id);
    expect(evidence.workProgress).toBe("SUBMITTED");
  });

  it("does not allow completion confirmation to be recorded as correctness", () => {
    expect(() => createVerificationDecision({
      ...decisionInput,
      outcome: "CORRECT",
    })).toThrow(/incompatible with its purpose/i);
  });

  it("requires a reason and valid timestamp", () => {
    expect(() => createVerificationDecision({ ...decisionInput, reason: " " })).toThrow(/reason/i);
    expect(() => createVerificationDecision({ ...decisionInput, decidedAt: "invalid" })).toThrow(/timestamp/i);
  });

  it("prevents a decision from superseding itself", () => {
    expect(() => createVerificationDecision({
      ...decisionInput,
      supersedesDecisionId: decisionInput.id,
    })).toThrow(/cannot supersede itself/i);
  });
});

describe("batch identity integrity", () => {
  it("rejects duplicate event IDs before projection or persistence preparation", () => {
    expect(() => assertUniqueEventIds(
      [{ id: "same" }, { id: "same" }],
      "evidence",
    )).toThrow(/duplicate evidence id/i);
  });

  it("accepts unique IDs", () => {
    expect(() => assertUniqueEventIds([{ id: "one" }, { id: "two" }], "evidence")).not.toThrow();
  });
});
