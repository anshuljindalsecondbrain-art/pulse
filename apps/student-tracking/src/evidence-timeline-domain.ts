import type { SystemAWorkEvidence, SystemAVerificationDecision } from "./workflow-domain";
import type {
  CorrectionCycle, CorrectionTransitionEvent, CorrectionSubmission, CorrectionReviewRecord,
} from "./correction-workflow-domain";
import type { DoubtCase, DoubtEvent } from "./doubt-management-domain";

export type EvidenceTimelineScope = Readonly<{
  instituteId: string;
  studentId: string;
  obligationId?: string;
  exerciseSlotId?: string;
}>;

export type EvidenceTimelineKind =
  | "STUDENT_SUBMISSION"
  | "TEACHER_OBSERVATION"
  | "SYSTEM_IMPORT"
  | "GUARDIAN_INPUT"
  | "COMPLETION_VERIFICATION"
  | "ANSWER_EVALUATION"
  | "CORRECTION_SUBMISSION"
  | "CORRECTION_REVIEW"
  | "CORRECTION_STARTED"
  | "CORRECTION_RESTARTED"
  | "CORRECTION_ACCEPTED"
  | "CORRECTION_RETURNED"
  | "CORRECTION_CLOSED"
  | "DOUBT_RAISED"
  | "DOUBT_ASSIGNED"
  | "DOUBT_INVESTIGATION_STARTED"
  | "DOUBT_RESOLVED"
  | "DOUBT_STUDENT_CONFIRMED"
  | "DOUBT_REOPENED";

export type EvidenceTimelineSourceType =
  | "WORK_EVIDENCE"
  | "VERIFICATION_DECISION"
  | "CORRECTION_TRANSITION"
  | "DOUBT_EVENT";

export type EvidenceTimelineEntry = Readonly<{
  id: string;
  sourceType: EvidenceTimelineSourceType;
  kind: EvidenceTimelineKind;
  instituteId: string;
  studentId: string;
  obligationId: string;
  exerciseSlotId: string;
  actorId: string;
  actorRole?: string;
  eventAt: string;
  recordedAt?: string;
  reason?: string;
  outcome?: string;
  supersedesEventId?: string;
  supersededByEventId?: string;
  supersedesDecisionId?: string;
  supersededByDecisionId?: string;
  relatedEvidenceEventId?: string;
  relatedDecisionId?: string;
  sourceReference: Readonly<{ type: EvidenceTimelineSourceType; id: string }>;
}>;

export type EvidenceTimelineResult = Readonly<{
  scope: EvidenceTimelineScope;
  entries: readonly EvidenceTimelineEntry[];
}>;

function requireText(value: string, label: string): void {
  if (!value.trim()) throw new Error(`${label} must be non-empty.`);
}
function validDate(value: string, label: string): number {
  const parsed = Date.parse(value);
  if (!Number.isFinite(parsed)) throw new Error(`${label} must be a valid timestamp.`);
  return parsed;
}
function scoped(scope: EvidenceTimelineScope, value: {
  instituteId: string; studentId: string; obligationId: string; exerciseSlotId: string;
}): boolean {
  return value.instituteId === scope.instituteId &&
    value.studentId === scope.studentId &&
    (scope.obligationId === undefined || value.obligationId === scope.obligationId) &&
    (scope.exerciseSlotId === undefined || value.exerciseSlotId === scope.exerciseSlotId);
}
function timelineId(type: EvidenceTimelineSourceType, id: string): string {
  return `${type}:${id}`;
}
function assertUniqueIds<T extends { id: string }>(items: readonly T[], label: string): void {
  const ids = new Set<string>();
  for (const item of items) {
    requireText(item.id, `${label}.id`);
    if (ids.has(item.id)) throw new Error(`Duplicate ${label} ID: ${item.id}.`);
    ids.add(item.id);
  }
}

/**
 * Read-only projection of immutable System A source records. This function
 * does not infer academic state, mutate source records, or perform authorization.
 * Callers must load records through a trusted, tenant-scoped server boundary.
 */
export function buildEvidenceTimeline(input: {
  scope: EvidenceTimelineScope;
  evidence: readonly SystemAWorkEvidence[];
  decisions: readonly SystemAVerificationDecision[];
  correctionCycles: readonly CorrectionCycle[];
  correctionTransitions: readonly CorrectionTransitionEvent[];
  correctionSubmissions: readonly CorrectionSubmission[];
  correctionReviews: readonly CorrectionReviewRecord[];
  doubtCases: readonly DoubtCase[];
  doubtEvents: readonly DoubtEvent[];
}): EvidenceTimelineResult {
  const scope = input.scope;
  requireText(scope.instituteId, "scope.instituteId");
  requireText(scope.studentId, "scope.studentId");
  if (scope.obligationId !== undefined) requireText(scope.obligationId, "scope.obligationId");
  if (scope.exerciseSlotId !== undefined) requireText(scope.exerciseSlotId, "scope.exerciseSlotId");

  assertUniqueIds(input.evidence, "evidence");
  assertUniqueIds(input.decisions, "decision");
  assertUniqueIds(input.correctionCycles, "correction cycle");
  assertUniqueIds(input.correctionTransitions, "correction transition");
  assertUniqueIds(input.doubtCases, "doubt case");
  assertUniqueIds(input.doubtEvents, "doubt event");

  const evidenceById = new Map(input.evidence.map(item => [item.id, item]));
  const cyclesById = new Map(input.correctionCycles.map(item => [item.id, item]));
  const doubtsById = new Map(input.doubtCases.map(item => [item.id, item]));
  const correctionEvidenceIds = new Set<string>();
  const correctionDecisionIds = new Set<string>();

  for (const submission of input.correctionSubmissions) {
    const cycle = cyclesById.get(submission.correctionCycleId);
    const event = evidenceById.get(submission.evidence.id);
    if (!cycle || !event || event.id !== submission.evidence.id ||
        cycle.instituteId !== event.instituteId || cycle.studentId !== event.studentId ||
        cycle.obligationId !== event.obligationId || cycle.exerciseSlotId !== event.exerciseSlotId ||
        submission.originatingReturnedDecisionId !== cycle.originatingReturnedDecisionId ||
        !scoped(scope, cycle)) continue;
    if (correctionEvidenceIds.has(event.id)) throw new Error(`Duplicate correction submission reference: ${event.id}.`);
    correctionEvidenceIds.add(event.id);
  }

  for (const review of input.correctionReviews) {
    const cycle = cyclesById.get(review.correctionCycleId);
    const decision = review.decision;
    const evidence = evidenceById.get(decision.evidenceEventId);
    if (!cycle || !evidence || decision.purpose !== "CORRECTION" ||
        decision.instituteId !== cycle.instituteId || decision.obligationId !== cycle.obligationId ||
        evidence.studentId !== cycle.studentId || evidence.exerciseSlotId !== cycle.exerciseSlotId ||
        !scoped(scope, cycle)) continue;
    if (correctionDecisionIds.has(decision.id)) throw new Error(`Duplicate correction review reference: ${decision.id}.`);
    correctionDecisionIds.add(decision.id);
  }

  const supersededEvidence = new Map<string, string>();
  for (const event of input.evidence) {
    if (event.supersedesEventId) supersededEvidence.set(event.supersedesEventId, event.id);
  }
  const supersededDecisions = new Map<string, string>();
  for (const decision of input.decisions) {
    if (decision.supersedesDecisionId) supersededDecisions.set(decision.supersedesDecisionId, decision.id);
  }

  const entries: EvidenceTimelineEntry[] = [];
  for (const event of input.evidence) {
    if (!scoped(scope, event)) continue;
    const kind: EvidenceTimelineKind = correctionEvidenceIds.has(event.id)
      ? "CORRECTION_SUBMISSION"
      : event.source === "STUDENT_SELF_REPORT" ? "STUDENT_SUBMISSION"
        : event.source === "TEACHER_OBSERVATION" ? "TEACHER_OBSERVATION"
          : event.source === "SYSTEM_IMPORT" ? "SYSTEM_IMPORT" : "GUARDIAN_INPUT";
    validDate(event.occurredAt, "evidence.occurredAt");
    validDate(event.recordedAt, "evidence.recordedAt");
    entries.push(Object.freeze({
      id: timelineId("WORK_EVIDENCE", event.id), sourceType: "WORK_EVIDENCE", kind,
      instituteId: event.instituteId, studentId: event.studentId,
      obligationId: event.obligationId, exerciseSlotId: event.exerciseSlotId,
      actorId: event.actorId, actorRole: event.actorRole,
      eventAt: event.occurredAt, recordedAt: event.recordedAt,
      ...(event.supersedesEventId ? { supersedesEventId: event.supersedesEventId } : {}),
      ...(supersededEvidence.has(event.id) ? { supersededByEventId: supersededEvidence.get(event.id) } : {}),
      sourceReference: Object.freeze({ type: "WORK_EVIDENCE", id: event.id }),
    }));
  }

  for (const decision of input.decisions) {
    if (decision.purpose !== "COMPLETION" && decision.purpose !== "ANSWER_EVALUATION") continue;
    const event = evidenceById.get(decision.evidenceEventId);
    if (!event || event.instituteId !== decision.instituteId ||
        event.obligationId !== decision.obligationId || !scoped(scope, event)) continue;
    validDate(decision.decidedAt, "decision.decidedAt");
    entries.push(Object.freeze({
      id: timelineId("VERIFICATION_DECISION", decision.id),
      sourceType: "VERIFICATION_DECISION",
      kind: decision.purpose === "COMPLETION" ? "COMPLETION_VERIFICATION" : "ANSWER_EVALUATION",
      instituteId: event.instituteId, studentId: event.studentId,
      obligationId: event.obligationId, exerciseSlotId: event.exerciseSlotId,
      actorId: decision.verifierId, eventAt: decision.decidedAt,
      reason: decision.reason, outcome: decision.outcome,
      ...(decision.supersedesDecisionId ? { supersedesDecisionId: decision.supersedesDecisionId } : {}),
      ...(supersededDecisions.has(decision.id) ? { supersededByDecisionId: supersededDecisions.get(decision.id) } : {}),
      sourceReference: Object.freeze({ type: "VERIFICATION_DECISION", id: decision.id }),
    }));
  }

  const correctionKind: Record<CorrectionTransitionEvent["action"], EvidenceTimelineKind> = {
    START: "CORRECTION_STARTED", SUBMIT: "CORRECTION_SUBMISSION",
    ACCEPT: "CORRECTION_ACCEPTED", RETURN: "CORRECTION_RETURNED", CLOSE: "CORRECTION_CLOSED",
  };
  for (const event of input.correctionTransitions) {
    const cycle = cyclesById.get(event.correctionCycleId);
    if (!cycle || event.instituteId !== cycle.instituteId ||
        event.obligationId !== cycle.obligationId || !scoped(scope, cycle)) continue;
    validDate(event.occurredAt, "correctionTransition.occurredAt");
    entries.push(Object.freeze({
      id: timelineId("CORRECTION_TRANSITION", event.id), sourceType: "CORRECTION_TRANSITION",
      kind: correctionKind[event.action], instituteId: cycle.instituteId,
      studentId: cycle.studentId, obligationId: cycle.obligationId,
      exerciseSlotId: cycle.exerciseSlotId, actorId: event.actorId,
      actorRole: event.actorRole, eventAt: event.occurredAt, reason: event.reason,
      outcome: event.toState,
      ...(event.relatedEvidenceEventId ? { relatedEvidenceEventId: event.relatedEvidenceEventId } : {}),
      ...(event.relatedDecisionId ? { relatedDecisionId: event.relatedDecisionId } : {}),
      sourceReference: Object.freeze({ type: "CORRECTION_TRANSITION", id: event.id }),
    }));
  }

  for (const review of input.correctionReviews) {
    const cycle = cyclesById.get(review.correctionCycleId);
    const decision = review.decision;
    const event = evidenceById.get(decision.evidenceEventId);
    if (!cycle || !event || decision.purpose !== "CORRECTION" ||
        decision.instituteId !== cycle.instituteId || decision.obligationId !== cycle.obligationId ||
        event.instituteId !== cycle.instituteId || event.studentId !== cycle.studentId ||
        event.obligationId !== cycle.obligationId || event.exerciseSlotId !== cycle.exerciseSlotId ||
        !scoped(scope, cycle)) continue;
    validDate(decision.decidedAt, "correctionReview.decidedAt");
    entries.push(Object.freeze({
      id: timelineId("VERIFICATION_DECISION", decision.id),
      sourceType: "VERIFICATION_DECISION", kind: "CORRECTION_REVIEW",
      instituteId: cycle.instituteId, studentId: cycle.studentId,
      obligationId: cycle.obligationId, exerciseSlotId: cycle.exerciseSlotId,
      actorId: decision.verifierId, eventAt: decision.decidedAt,
      reason: decision.reason, outcome: decision.outcome,
      ...(decision.supersedesDecisionId ? { supersedesDecisionId: decision.supersedesDecisionId } : {}),
      ...(supersededDecisions.has(decision.id) ? { supersededByDecisionId: supersededDecisions.get(decision.id) } : {}),
      relatedEvidenceEventId: event.id,
      sourceReference: Object.freeze({ type: "VERIFICATION_DECISION", id: decision.id }),
    }));
  }

  const doubtKind: Record<DoubtEvent["action"], EvidenceTimelineKind> = {
    RAISE: "DOUBT_RAISED", ASSIGN: "DOUBT_ASSIGNED",
    START_INVESTIGATION: "DOUBT_INVESTIGATION_STARTED", RESOLVE: "DOUBT_RESOLVED",
    CONFIRM_BY_STUDENT: "DOUBT_STUDENT_CONFIRMED", REOPEN: "DOUBT_REOPENED",
  };
  for (const event of input.doubtEvents) {
    const doubtCase = doubtsById.get(event.doubtCaseId);
    if (!doubtCase || !scoped(scope, doubtCase) ||
        event.instituteId !== doubtCase.instituteId || event.studentId !== doubtCase.studentId ||
        event.obligationId !== doubtCase.obligationId || event.exerciseSlotId !== doubtCase.exerciseSlotId) continue;
    validDate(event.occurredAt, "doubtEvent.occurredAt");
    entries.push(Object.freeze({
      id: timelineId("DOUBT_EVENT", event.id), sourceType: "DOUBT_EVENT",
      kind: doubtKind[event.action], instituteId: event.instituteId,
      studentId: event.studentId, obligationId: event.obligationId,
      exerciseSlotId: event.exerciseSlotId, actorId: event.actorId,
      actorRole: event.actorRole, eventAt: event.occurredAt,
      reason: event.reason, outcome: event.toState,
      sourceReference: Object.freeze({ type: "DOUBT_EVENT", id: event.id }),
    }));
  }

  entries.sort((a, b) =>
    Date.parse(a.eventAt) - Date.parse(b.eventAt) || a.id.localeCompare(b.id));
  return Object.freeze({
    scope: Object.freeze({ ...scope }),
    entries: Object.freeze(entries),
  });
}
