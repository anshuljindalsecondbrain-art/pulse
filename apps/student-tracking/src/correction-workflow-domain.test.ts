import { describe, expect, it } from "vitest";
import {
  prepareCorrectionClose,
  prepareCorrectionReview,
  prepareCorrectionRestart,
  prepareCorrectionStart,
  prepareCorrectionSubmission,
  type CorrectionCycle,
  type CorrectionReviewRecord,
  type CorrectionSubmission,
} from "./correction-workflow-domain";
import type { SystemAWorkEvidence, SystemAVerificationDecision } from "./workflow-domain";

const original: SystemAWorkEvidence = Object.freeze({
  id: "e-original", instituteId: "inst-1", studentId: "stu-1", obligationId: "obl-1",
  exerciseSlotId: "slot-1", actorId: "stu-1", actorRole: "STUDENT",
  source: "STUDENT_SELF_REPORT", workProgress: "SUBMITTED", attemptCycleId: "attempt-1",
  idempotencyKey: "original-key", occurredAt: "2026-11-06T09:00:00.000Z",
  recordedAt: "2026-11-06T09:01:00.000Z",
});
const returned: SystemAVerificationDecision = Object.freeze({
  id: "decision-returned", instituteId: "inst-1", obligationId: "obl-1",
  evidenceEventId: "e-original", verifierId: "teacher-1", purpose: "COMPLETION",
  outcome: "RETURNED", reason: "Show the derivation", decidedAt: "2026-11-06T10:00:00.000Z",
});
const start = (overrides: Record<string, unknown> = {}) => prepareCorrectionStart({
  command: {
    cycleId: "corr-1", eventId: "evt-start", instituteId: "inst-1", studentId: "stu-1",
    obligationId: "obl-1", actorId: "stu-1", reason: "Teacher returned the work",
    occurredAt: "2026-11-06T10:05:00.000Z", ...overrides,
  },
  authorizedStudentObligationIds: ["obl-1"], originalEvidence: original, returnedDecision: returned,
});
const started = (): CorrectionCycle => start().value;
const submit = (cycle: CorrectionCycle, overrides: Record<string, unknown> = {}, evidence: SystemAWorkEvidence[] = [], submissions: CorrectionSubmission[] = []) =>
  prepareCorrectionSubmission({
    cycle,
    command: {
      instituteId: "inst-1", studentId: "stu-1", obligationId: "obl-1", exerciseSlotId: "slot-1", actorId: "stu-1",
      workProgress: "SUBMITTED", attemptCycleId: "attempt-1", idempotencyKey: "correction-key-1",
      occurredAt: "2026-11-06T11:00:00.000Z", recordedAt: "2026-11-06T11:01:00.000Z",
      reason: "Corrected the derivation", supersedesEventId: "e-original", ...overrides,
    },
    existingEvidence: [original, ...evidence], existingSubmissions: submissions,
    newEvidenceId: "e-correction-1", eventId: "evt-submit-1",
  });
const submitted = () => submit(started());
const review = (cycle: CorrectionCycle, submission: CorrectionSubmission, overrides: Record<string, unknown> = {}, history: CorrectionReviewRecord[] = []) =>
  prepareCorrectionReview({
    cycle, submission,
    command: {
      instituteId: "inst-1", reviewerId: "teacher-2", reviewerRole: "TEACHER",
      obligationId: "obl-1", evidenceEventId: submission.evidence.id,
      outcome: "ACCEPTED", reason: "Derivation is now complete",
      decidedAt: "2026-11-06T12:00:00.000Z", decisionId: "corr-decision-1",
      ...overrides,
    },
    authorizedObligationIds: ["obl-1"], existingReviews: history, eventId: "evt-review-1",
  });

describe("correction workflow command contract", () => {
  it("starts only from the exact returned completion decision", () => {
    expect(start().value.state).toBe("IN_PROGRESS");
    expect(start().value.originatingReturnedDecisionId).toBe(returned.id);
    expect(Object.isFrozen(start().value)).toBe(true);
  });

  it("rejects a correction start without the authorized student obligation", () => {
    expect(() => prepareCorrectionStart({
      command: { cycleId: "c", eventId: "e", instituteId: "inst-1", studentId: "stu-1",
        obligationId: "obl-1", actorId: "stu-1", reason: "Start", occurredAt: "2026-11-06T10:05:00Z" },
      authorizedStudentObligationIds: [], originalEvidence: original, returnedDecision: returned,
    })).toThrow(/not authorized/i);
  });

  it("rejects a returned decision that does not reference the exact original report", () => {
    expect(() => prepareCorrectionStart({
      command: { cycleId: "c", eventId: "e", instituteId: "inst-1", studentId: "stu-1",
        obligationId: "obl-1", actorId: "stu-1", reason: "Start", occurredAt: "2026-11-06T10:05:00Z" },
      authorizedStudentObligationIds: ["obl-1"], originalEvidence: original,
      returnedDecision: { ...returned, evidenceEventId: "different" },
    })).toThrow(/exact returned completion decision/i);
  });

  it("prevents another learner from starting correction", () => {
    expect(() => start({ actorId: "stu-2" })).toThrow(/original student/i);
  });

  it("makes exact cycle-start retries idempotent and rejects ID conflicts", () => {
    const cycle = started();
    expect(prepareCorrectionStart({
      command: { cycleId: cycle.id, eventId: "evt-start", instituteId: "inst-1",
        studentId: "stu-1", obligationId: "obl-1", actorId: "stu-1",
        reason: "Teacher returned the work", occurredAt: cycle.startedAt },
      authorizedStudentObligationIds: ["obl-1"], originalEvidence: original,
      returnedDecision: returned, existingCycles: [cycle],
    }).outcome).toBe("IDEMPOTENT_REPLAY");
    expect(() => prepareCorrectionStart({
      command: { cycleId: cycle.id, eventId: "evt-start", instituteId: "inst-1",
        studentId: "stu-1", obligationId: "obl-1", actorId: "stu-1",
        reason: "Different start", occurredAt: cycle.startedAt },
      authorizedStudentObligationIds: ["obl-1"], originalEvidence: original,
      returnedDecision: returned, existingCycles: [cycle],
    })).toThrow(/ID conflict/i);
  });

  it("submits correction as a new immutable evidence event and preserves the attempt cycle", () => {
    const result = submitted();
    expect(result.value.cycle.state).toBe("RESUBMITTED");
    expect(result.value.submission.evidence.attemptCycleId).toBe("attempt-1");
    expect(result.value.submission.evidence.supersedesEventId).toBe(original.id);
    expect(Object.isFrozen(result.value.submission.evidence)).toBe(true);
  });

  it("rejects teacher submission and a changed attempt cycle", () => {
    expect(() => submit(started(), { actorId: "teacher-1" })).toThrow(/original student/i);
    expect(() => submit(started(), { attemptCycleId: "attempt-2" })).toThrow(/preserve the original/i);
  });

  it("rejects submission against another institute or obligation", () => {
    expect(() => submit(started(), { instituteId: "inst-2" })).toThrow(/crosses institute/i);
    expect(() => submit(started(), { obligationId: "obl-2" })).toThrow(/crosses institute/i);
  });

  it("requires the latest evidence in the correction chain to be superseded", () => {
    expect(() => submit(started(), { supersedesEventId: "unrelated" })).toThrow(/latest evidence/i);
  });

  it("returns the original correction record on an exact idempotent retry", () => {
    const first = submitted();
    const prior = first.value.submission;
    const replay = submit(first.value.cycle, {
      idempotencyKey: "correction-key-1",
    }, [prior.evidence], [prior]);
    expect(replay.outcome).toBe("IDEMPOTENT_REPLAY");
    expect(replay.value.submission).toBe(prior);
  });

  it("reviews only the exact latest correction submission", () => {
    const first = submitted();
    expect(review(first.value.cycle, first.value.submission).value.cycle.state).toBe("ACCEPTED");
    expect(() => review(first.value.cycle, first.value.submission, { evidenceEventId: "old-evidence" }))
      .toThrow(/latest correction submission/i);
  });

  it("prevents learner self-review and unauthorized reviewer scope", () => {
    const first = submitted();
    expect(() => review(first.value.cycle, first.value.submission, { reviewerId: "stu-1" }))
      .toThrow(/cannot review their own/i);
    expect(() => prepareCorrectionReview({
      cycle: first.value.cycle, submission: first.value.submission,
      command: { instituteId: "inst-1", reviewerId: "teacher-2", reviewerRole: "TEACHER",
        obligationId: "obl-1", evidenceEventId: first.value.submission.evidence.id,
        outcome: "ACCEPTED", reason: "Reviewed", decidedAt: "2026-11-06T12:00:00Z", decisionId: "d" },
      authorizedObligationIds: [], existingReviews: [], eventId: "e",
    })).toThrow(/not authorized/i);
  });

  it("preserves returned review history and allows a second correction submission in the same cycle", () => {
    const first = submitted();
    const returnedReview = review(first.value.cycle, first.value.submission, { outcome: "RETURNED" });
    expect(returnedReview.value.cycle.state).toBe("REQUIRED");
    const restarted = prepareCorrectionRestart({
      cycle: returnedReview.value.cycle,
      command: { eventId: "evt-restart", actorId: "stu-1", reason: "Continue corrections",
        occurredAt: "2026-11-06T12:30:00.000Z" },
    }).value;
    const second = submit(restarted, {
      idempotencyKey: "correction-key-2",
      supersedesEventId: first.value.submission.evidence.id,
      occurredAt: "2026-11-06T13:00:00.000Z",
      recordedAt: "2026-11-06T13:01:00.000Z",
    }, [first.value.submission.evidence]);
    expect(second.value.cycle.state).toBe("RESUBMITTED");
    expect(second.value.submission.evidence.attemptCycleId).toBe("attempt-1");
    expect(returnedReview.value.review.decision.outcome).toBe("RETURNED");
  });

  it("makes exact review retries idempotent and rejects decision ID reuse with different content", () => {
    const first = submitted();
    const accepted = review(first.value.cycle, first.value.submission);
    const replay = review(accepted.value.cycle, first.value.submission, {}, [accepted.value.review]);
    expect(replay.outcome).toBe("IDEMPOTENT_REPLAY");
    expect(() => review(accepted.value.cycle, first.value.submission, { outcome: "RETURNED" }, [accepted.value.review]))
      .toThrow(/decision ID conflict/i);
  });

  it("closes only an accepted latest correction and preserves prior snapshots", () => {
    const first = submitted();
    const accepted = review(first.value.cycle, first.value.submission);
    const closed = prepareCorrectionClose({
      cycle: accepted.value.cycle, latestReview: accepted.value.review,
      command: { eventId: "evt-close", actorId: "teacher-2", actorRole: "TEACHER",
        reason: "Correction accepted and archived", occurredAt: "2026-11-06T12:05:00.000Z" },
      authorizedObligationIds: ["obl-1"],
    });
    expect(closed.value.state).toBe("CLOSED");
    expect(accepted.value.cycle.state).toBe("ACCEPTED");
    expect(first.value.cycle.state).toBe("RESUBMITTED");
    expect(() => prepareCorrectionClose({
      cycle: first.value.cycle, latestReview: accepted.value.review,
      command: { eventId: "evt-close-2", actorId: "teacher-2", actorRole: "TEACHER",
        reason: "Close", occurredAt: "2026-11-06T12:05:00Z" },
      authorizedObligationIds: ["obl-1"],
    })).toThrow(/Only the latest accepted correction/i);
  });

  it("requires a reason for every transition", () => {
    expect(() => start({ reason: " " })).toThrow(/reason/i);
    expect(() => submit(started(), { reason: " " })).toThrow(/reason/i);
  });
});
