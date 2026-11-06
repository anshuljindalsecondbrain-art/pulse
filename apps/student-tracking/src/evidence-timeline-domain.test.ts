import { describe, expect, it } from "vitest";
import { buildEvidenceTimeline } from "./evidence-timeline-domain";
import type { SystemAWorkEvidence, SystemAVerificationDecision } from "./workflow-domain";
import type { CorrectionCycle, CorrectionTransitionEvent, CorrectionSubmission, CorrectionReviewRecord } from "./correction-workflow-domain";
import type { DoubtCase, DoubtEvent } from "./doubt-management-domain";

const scope = { instituteId: "inst-1", studentId: "student-1" } as const;
const evidence = (overrides: Partial<SystemAWorkEvidence> = {}): SystemAWorkEvidence => ({
  id: "ev-1", instituteId: "inst-1", studentId: "student-1", obligationId: "obl-1",
  exerciseSlotId: "slot-1", actorId: "student-1", actorRole: "STUDENT",
  source: "STUDENT_SELF_REPORT", workProgress: "SUBMITTED", attemptCycleId: "attempt-1",
  idempotencyKey: "key-1", occurredAt: "2026-11-06T09:00:00.000Z",
  recordedAt: "2026-11-06T09:01:00.000Z", ...overrides,
});
const decision = (overrides: Partial<SystemAVerificationDecision> = {}): SystemAVerificationDecision => ({
  id: "decision-1", instituteId: "inst-1", obligationId: "obl-1", evidenceEventId: "ev-1",
  verifierId: "teacher-1", purpose: "COMPLETION", outcome: "CONFIRMED",
  reason: "Reviewed work", decidedAt: "2026-11-06T10:00:00.000Z", ...overrides,
});
const cycle: CorrectionCycle = {
  id: "cycle-1", instituteId: "inst-1", studentId: "student-1", obligationId: "obl-1",
  exerciseSlotId: "slot-1", originalEvidenceEventId: "ev-1", originalAttemptCycleId: "attempt-1",
  originatingReturnedDecisionId: "return-1", startEventId: "ct-1", startReason: "Please correct",
  state: "IN_PROGRESS", startedAt: "2026-11-06T11:00:00.000Z", updatedAt: "2026-11-06T11:00:00.000Z",
};
const correctionEvent = (overrides: Partial<CorrectionTransitionEvent> = {}): CorrectionTransitionEvent => ({
  id: "ct-1", correctionCycleId: "cycle-1", instituteId: "inst-1", obligationId: "obl-1",
  actorId: "student-1", actorRole: "STUDENT", action: "START", fromState: "REQUIRED",
  toState: "IN_PROGRESS", reason: "Please correct", occurredAt: "2026-11-06T11:00:00.000Z", ...overrides,
});
const doubt: DoubtCase = {
  id: "doubt-1", instituteId: "inst-1", studentId: "student-1", obligationId: "obl-1",
  exerciseSlotId: "slot-1", raisedById: "student-1", raisedByRole: "STUDENT",
  initialReason: "Why is this sign negative?", state: "OPEN", latestEventId: "de-1",
  raisedAt: "2026-11-06T12:00:00.000Z", updatedAt: "2026-11-06T12:00:00.000Z",
};
const doubtEvent = (overrides: Partial<DoubtEvent> = {}): DoubtEvent => ({
  id: "de-1", doubtCaseId: "doubt-1", instituteId: "inst-1", studentId: "student-1",
  obligationId: "obl-1", exerciseSlotId: "slot-1", actorId: "student-1", actorRole: "STUDENT",
  action: "RAISE", fromState: "NONE", toState: "OPEN", reason: "Why is this sign negative?",
  occurredAt: "2026-11-06T12:00:00.000Z", ...overrides,
});
const empty = {
  scope, evidence: [] as SystemAWorkEvidence[], decisions: [] as SystemAVerificationDecision[],
  correctionCycles: [] as CorrectionCycle[], correctionTransitions: [] as CorrectionTransitionEvent[],
  correctionSubmissions: [] as CorrectionSubmission[], correctionReviews: [] as CorrectionReviewRecord[],
  doubtCases: [] as DoubtCase[], doubtEvents: [] as DoubtEvent[],
};

describe("read-only evidence timeline projection", () => {
  it("keeps student submissions and teacher observations distinct", () => {
    const result = buildEvidenceTimeline({ ...empty, evidence: [
      evidence(), evidence({ id: "ev-2", source: "TEACHER_OBSERVATION", actorId: "teacher-1", actorRole: "TEACHER" }),
    ] });
    expect(result.entries.map(x => x.kind)).toEqual(["STUDENT_SUBMISSION", "TEACHER_OBSERVATION"]);
  });

  it("projects completion verification and answer evaluation as separate event kinds", () => {
    const result = buildEvidenceTimeline({ ...empty, evidence: [evidence()], decisions: [
      decision(), decision({ id: "decision-2", purpose: "ANSWER_EVALUATION", outcome: "INCORRECT" }),
    ] });
    expect(result.entries.map(x => x.kind)).toEqual(["STUDENT_SUBMISSION", "COMPLETION_VERIFICATION", "ANSWER_EVALUATION"]);
  });

  it("does not infer completion from an answer-evaluation decision", () => {
    const result = buildEvidenceTimeline({ ...empty, evidence: [evidence()], decisions: [
      decision({ purpose: "ANSWER_EVALUATION", outcome: "CORRECT" }),
    ] });
    expect(result.entries.some(x => x.kind === "COMPLETION_VERIFICATION")).toBe(false);
  });

  it("filters exact institute, learner, obligation and slot scope", () => {
    const result = buildEvidenceTimeline({ ...empty, scope: { ...scope, obligationId: "obl-1", exerciseSlotId: "slot-1" },
      evidence: [evidence(), evidence({ id: "other", studentId: "student-2" }),
        evidence({ id: "other-inst", instituteId: "inst-2" }),
        evidence({ id: "other-obl", obligationId: "obl-2" }),
        evidence({ id: "other-slot", exerciseSlotId: "slot-2" })] });
    expect(result.entries).toHaveLength(1);
  });

  it("joins decisions only through the exact evidence event and matching institute/obligation", () => {
    const result = buildEvidenceTimeline({ ...empty, evidence: [evidence()],
      decisions: [decision(), decision({ id: "bad-ev", evidenceEventId: "missing" }),
        decision({ id: "bad-inst", instituteId: "inst-2" }),
        decision({ id: "bad-obl", obligationId: "obl-2" })] });
    expect(result.entries.filter(x => x.sourceType === "VERIFICATION_DECISION")).toHaveLength(1);
  });

  it("retains superseded decisions and exposes the supersession link", () => {
    const result = buildEvidenceTimeline({ ...empty, evidence: [evidence()], decisions: [
      decision(), decision({ id: "decision-2", outcome: "RETURNED", supersedesDecisionId: "decision-1" }),
    ] });
    const old = result.entries.find(x => x.sourceReference.id === "decision-1");
    expect(old?.supersededByDecisionId).toBe("decision-2");
    expect(result.entries.filter(x => x.sourceType === "VERIFICATION_DECISION")).toHaveLength(2);
  });

  it("projects correction lifecycle transitions only through a matching cycle", () => {
    const result = buildEvidenceTimeline({ ...empty, correctionCycles: [cycle],
      correctionTransitions: [correctionEvent(), correctionEvent({ id: "ct-2", action: "RETURN", fromState: "RESUBMITTED", toState: "REQUIRED" }),
        correctionEvent({ id: "foreign", correctionCycleId: "missing" })] });
    expect(result.entries.map(x => x.kind)).toEqual(["CORRECTION_STARTED", "CORRECTION_RETURNED"]);
  });

  it("projects correction reviews and links them to their exact correction evidence", () => {
    const correctionDecision: SystemAVerificationDecision = {
      id: "correction-review-1", instituteId: "inst-1", obligationId: "obl-1",
      evidenceEventId: "ev-correction", verifierId: "teacher-1", purpose: "CORRECTION",
      outcome: "ACCEPTED", reason: "Correction is complete", decidedAt: "2026-11-06T11:30:00.000Z",
    };
    const correctionEvidence = evidence({
      id: "ev-correction", occurredAt: "2026-11-06T11:20:00.000Z",
      recordedAt: "2026-11-06T11:21:00.000Z", supersedesEventId: "ev-1",
    });
    const submission: CorrectionSubmission = {
      correctionCycleId: "cycle-1", originatingReturnedDecisionId: "return-1",
      evidence: correctionEvidence, submittedAt: correctionEvidence.recordedAt,
    };
    const review: CorrectionReviewRecord = { correctionCycleId: "cycle-1", decision: correctionDecision };
    const result = buildEvidenceTimeline({
      ...empty, evidence: [evidence(), correctionEvidence], correctionCycles: [cycle],
      correctionSubmissions: [submission], correctionReviews: [review],
    });
    const entry = result.entries.find(x => x.sourceReference.id === "correction-review-1");
    expect(entry?.kind).toBe("CORRECTION_REVIEW");
    expect(entry?.relatedEvidenceEventId).toBe("ev-correction");
    expect(result.entries.find(x => x.sourceReference.id === "ev-correction")?.kind).toBe("CORRECTION_SUBMISSION");
  });

  it("does not misclassify unrelated verification purposes as answer evaluations", () => {
    const result = buildEvidenceTimeline({ ...empty, evidence: [evidence()], decisions: [
      decision({ purpose: "ATTEMPT", outcome: "CONFIRMED" }),
      decision({ id: "solve", purpose: "INDEPENDENT_SOLVE", outcome: "CORRECT" }),
    ] });
    expect(result.entries).toHaveLength(1);
    expect(result.entries[0].kind).toBe("STUDENT_SUBMISSION");
  });

  it("projects doubt raise, resolution, confirmation and reopening events", () => {
    const result = buildEvidenceTimeline({ ...empty, doubtCases: [doubt], doubtEvents: [
      doubtEvent(), doubtEvent({ id: "de-2", action: "RESOLVE", actorId: "teacher-1", actorRole: "TEACHER", fromState: "IN_PROGRESS", toState: "RESOLVED" }),
      doubtEvent({ id: "de-3", action: "CONFIRM_BY_STUDENT", fromState: "RESOLVED", toState: "STUDENT_CONFIRMED" }),
      doubtEvent({ id: "de-4", action: "REOPEN", fromState: "STUDENT_CONFIRMED", toState: "REOPENED" }),
    ] });
    expect(result.entries.map(x => x.kind)).toEqual(["DOUBT_RAISED", "DOUBT_RESOLVED", "DOUBT_STUDENT_CONFIRMED", "DOUBT_REOPENED"]);
  });

  it("sorts deterministically by event time then composite source ID", () => {
    const result = buildEvidenceTimeline({ ...empty, evidence: [
      evidence({ id: "z", occurredAt: "2026-11-06T09:00:00.000Z" }),
      evidence({ id: "a", occurredAt: "2026-11-06T09:00:00.000Z" }),
    ] });
    expect(result.entries.map(x => x.id)).toEqual(["WORK_EVIDENCE:a", "WORK_EVIDENCE:z"]);
  });

  it("preserves event time separately from recording and decision time", () => {
    const result = buildEvidenceTimeline({ ...empty, evidence: [evidence()] });
    expect(result.entries[0].eventAt).toBe("2026-11-06T09:00:00.000Z");
    expect(result.entries[0].recordedAt).toBe("2026-11-06T09:01:00.000Z");
  });

  it("rejects duplicate source IDs and freezes the result", () => {
    expect(() => buildEvidenceTimeline({ ...empty, evidence: [evidence(), evidence()] })).toThrow(/duplicate evidence ID/i);
    const result = buildEvidenceTimeline({ ...empty, evidence: [evidence()] });
    expect(Object.isFrozen(result)).toBe(true);
    expect(Object.isFrozen(result.entries)).toBe(true);
    expect(Object.isFrozen(result.entries[0])).toBe(true);
  });

  it("does not mutate source records", () => {
    const source = evidence();
    const before = JSON.stringify(source);
    buildEvidenceTimeline({ ...empty, evidence: [source] });
    expect(JSON.stringify(source)).toBe(before);
  });
});
