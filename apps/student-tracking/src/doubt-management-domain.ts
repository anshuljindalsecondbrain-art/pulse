import type { DoubtState } from "./workflow-domain";

export type DoubtActorRole = "STUDENT" | "TEACHER" | "ACADEMIC_REVIEWER";
export type DoubtAction =
  | "RAISE"
  | "ASSIGN"
  | "START_INVESTIGATION"
  | "RESOLVE"
  | "CONFIRM_BY_STUDENT"
  | "REOPEN";

export type DoubtObligationSnapshot = Readonly<{
  id: string;
  instituteId: string;
  studentId: string;
  exerciseSlotId: string;
  eligibility: "ELIGIBLE" | "EXEMPTED" | "REMOVED";
}>;

export type DoubtCase = Readonly<{
  id: string;
  instituteId: string;
  studentId: string;
  obligationId: string;
  exerciseSlotId: string;
  raisedById: string;
  raisedByRole: DoubtActorRole;
  initialReason: string;
  state: DoubtState;
  assignedToId?: string;
  latestEventId: string;
  resolutionNote?: string;
  raisedAt: string;
  updatedAt: string;
  resolvedAt?: string;
  confirmedAt?: string;
  reopenedAt?: string;
}>;

export type DoubtEvent = Readonly<{
  id: string;
  doubtCaseId: string;
  instituteId: string;
  studentId: string;
  obligationId: string;
  exerciseSlotId: string;
  actorId: string;
  actorRole: DoubtActorRole;
  action: DoubtAction;
  fromState: DoubtState | "NONE";
  toState: DoubtState;
  reason: string;
  occurredAt: string;
  previousEventId?: string;
  assignedToId?: string;
  resolutionNote?: string;
}>;

export type DoubtCommandResult<T> = Readonly<{
  outcome: "CREATED" | "IDEMPOTENT_REPLAY";
  value: T;
  event?: DoubtEvent;
}>;

function requireText(value: string, label: string): string {
  if (!value.trim()) throw new Error(`${label} must be non-empty.`);
  return value.trim();
}

function requireTimestamp(value: string, label: string): void {
  if (!Number.isFinite(Date.parse(value))) throw new Error(`${label} must be a valid timestamp.`);
}

function freezeEvent(input: DoubtEvent): DoubtEvent {
  requireText(input.id, "eventId");
  requireText(input.doubtCaseId, "doubtCaseId");
  requireText(input.instituteId, "instituteId");
  requireText(input.studentId, "studentId");
  requireText(input.obligationId, "obligationId");
  requireText(input.exerciseSlotId, "exerciseSlotId");
  requireText(input.actorId, "actorId");
  const reason = requireText(input.reason, "reason");
  requireTimestamp(input.occurredAt, "occurredAt");
  return Object.freeze({ ...input, reason });
}

function sameRaisePayload(
  existing: DoubtCase,
  command: RaiseDoubtCommand,
  obligation: DoubtObligationSnapshot,
): boolean {
  return existing.instituteId === command.instituteId &&
    existing.studentId === command.studentId &&
    existing.obligationId === obligation.id &&
    existing.exerciseSlotId === obligation.exerciseSlotId &&
    existing.raisedById === command.actorId &&
    existing.raisedByRole === command.actorRole &&
    existing.initialReason === command.reason.trim() &&
    existing.raisedAt === command.occurredAt &&
    existing.latestEventId === command.eventId;
}

export type RaiseDoubtCommand = Readonly<{
  doubtCaseId: string;
  eventId: string;
  instituteId: string;
  studentId: string;
  actorId: string;
  actorRole: DoubtActorRole;
  reason: string;
  occurredAt: string;
}>;

/** Raise a doubt against one exact eligible learner-question obligation. */
export function prepareDoubtCreation(input: {
  command: RaiseDoubtCommand;
  obligation: DoubtObligationSnapshot;
  authorizedStudentObligationIds: readonly string[];
  existingCases?: readonly DoubtCase[];
}): DoubtCommandResult<DoubtCase> {
  const c = input.command;
  for (const [label, value] of Object.entries({
    doubtCaseId: c.doubtCaseId, eventId: c.eventId, instituteId: c.instituteId,
    studentId: c.studentId, actorId: c.actorId,
  })) requireText(value, label);
  const reason = requireText(c.reason, "reason");
  requireTimestamp(c.occurredAt, "occurredAt");
  const obligation = input.obligation;

  if (obligation.eligibility !== "ELIGIBLE") {
    throw new Error("A doubt can only be raised against an eligible obligation.");
  }
  if (obligation.instituteId !== c.instituteId || obligation.studentId !== c.studentId) {
    throw new Error("Doubt obligation does not belong to this institute and learner.");
  }
  if (!input.authorizedStudentObligationIds.includes(obligation.id)) {
    throw new Error("Actor is not authorized for this learner obligation.");
  }
  if (c.actorRole === "STUDENT" && c.actorId !== c.studentId) {
    throw new Error("A student can raise a doubt only for their own work.");
  }
  if (c.actorRole !== "STUDENT" && !["TEACHER", "ACADEMIC_REVIEWER"].includes(c.actorRole)) {
    throw new Error("Only a student or authorized academic actor can raise a doubt.");
  }

  const prior = (input.existingCases ?? []).find((item) => item.id === c.doubtCaseId);
  if (prior) {
    if (!sameRaisePayload(prior, { ...c, reason }, obligation)) {
      throw new Error("Doubt case ID conflict: identifier already belongs to different content.");
    }
    return Object.freeze({ outcome: "IDEMPOTENT_REPLAY", value: prior });
  }

  const doubtCase: DoubtCase = Object.freeze({
    id: c.doubtCaseId, instituteId: c.instituteId, studentId: c.studentId,
    obligationId: obligation.id, exerciseSlotId: obligation.exerciseSlotId,
    raisedById: c.actorId, raisedByRole: c.actorRole, initialReason: reason,
    state: "OPEN", latestEventId: c.eventId, raisedAt: c.occurredAt, updatedAt: c.occurredAt,
  });
  const event = freezeEvent({
    id: c.eventId, doubtCaseId: doubtCase.id, instituteId: c.instituteId,
    studentId: c.studentId, obligationId: obligation.id,
    exerciseSlotId: obligation.exerciseSlotId, actorId: c.actorId,
    actorRole: c.actorRole, action: "RAISE", fromState: "NONE", toState: "OPEN",
    reason, occurredAt: c.occurredAt,
  });
  return Object.freeze({ outcome: "CREATED", value: doubtCase, event });
}

export type DoubtTransitionCommand = Readonly<{
  eventId: string;
  instituteId: string;
  actorId: string;
  actorRole: DoubtActorRole;
  action: Exclude<DoubtAction, "RAISE">;
  reason: string;
  occurredAt: string;
  assignedToId?: string;
  resolutionNote?: string;
}>;

function sameTransitionPayload(existing: DoubtEvent, c: DoubtTransitionCommand, doubtCase: DoubtCase): boolean {
  return existing.doubtCaseId === doubtCase.id &&
    existing.instituteId === c.instituteId &&
    existing.actorId === c.actorId &&
    existing.actorRole === c.actorRole &&
    existing.action === c.action &&
    existing.reason === c.reason.trim() &&
    existing.occurredAt === c.occurredAt &&
    existing.assignedToId === c.assignedToId &&
    existing.resolutionNote === c.resolutionNote;
}

/** Append one authorized transition to the immutable history of a doubt case. */
export function prepareDoubtTransition(input: {
  doubtCase: DoubtCase;
  command: DoubtTransitionCommand;
  authorizedObligationIds: readonly string[];
  authorizedAssigneeIds?: readonly string[];
  existingEvents: readonly DoubtEvent[];
}): DoubtCommandResult<{ doubtCase: DoubtCase; event: DoubtEvent }> {
  const { doubtCase, command: c } = input;
  requireText(c.eventId, "eventId");
  requireText(c.instituteId, "instituteId");
  requireText(c.actorId, "actorId");
  const reason = requireText(c.reason, "reason");
  requireTimestamp(c.occurredAt, "occurredAt");

  if (c.instituteId !== doubtCase.instituteId) {
    throw new Error("Doubt transition crosses institute scope.");
  }
  if (!input.authorizedObligationIds.includes(doubtCase.obligationId)) {
    throw new Error("Actor is not authorized for this doubt obligation.");
  }
  const priorById = input.existingEvents.find((item) => item.id === c.eventId);
  if (priorById) {
    if (!sameTransitionPayload(priorById, { ...c, reason }, doubtCase)) {
      throw new Error("Doubt event ID conflict: identifier already belongs to different content.");
    }
    return Object.freeze({
      outcome: "IDEMPOTENT_REPLAY",
      value: Object.freeze({ doubtCase, event: priorById }),
    });
  }

  const latestHistoryEvent = input.existingEvents.find((item) => item.id === doubtCase.latestEventId);
  if (!latestHistoryEvent || latestHistoryEvent.doubtCaseId !== doubtCase.id ||
      latestHistoryEvent.instituteId !== doubtCase.instituteId ||
      latestHistoryEvent.studentId !== doubtCase.studentId ||
      latestHistoryEvent.obligationId !== doubtCase.obligationId ||
      latestHistoryEvent.exerciseSlotId !== doubtCase.exerciseSlotId ||
      latestHistoryEvent.toState !== doubtCase.state) {
    throw new Error("Doubt case latest-event pointer does not match its immutable history.");
  }
  const academic = c.actorRole === "TEACHER" || c.actorRole === "ACADEMIC_REVIEWER";
  let nextState: DoubtState;
  let assignedToId: string | undefined = doubtCase.assignedToId;
  let resolutionNote = doubtCase.resolutionNote;
  let resolvedAt = doubtCase.resolvedAt;
  let confirmedAt = doubtCase.confirmedAt;
  let reopenedAt = doubtCase.reopenedAt;

  switch (c.action) {
    case "ASSIGN":
      if (!academic || !["OPEN", "REOPENED"].includes(doubtCase.state)) {
        throw new Error("Only an authorized academic actor can assign an open or reopened doubt.");
      }
      assignedToId = requireText(c.assignedToId ?? "", "assignedToId");
      if (!input.authorizedAssigneeIds?.includes(assignedToId)) {
        throw new Error("Assignee is not in the caller's authorized academic scope.");
      }
      nextState = "ASSIGNED";
      break;
    case "START_INVESTIGATION":
      if (!academic || doubtCase.state !== "ASSIGNED" || doubtCase.assignedToId !== c.actorId) {
        throw new Error("Only the assigned academic actor can start this doubt investigation.");
      }
      nextState = "IN_PROGRESS";
      break;
    case "RESOLVE":
      if (!academic || doubtCase.state !== "IN_PROGRESS" ||
          (doubtCase.assignedToId !== c.actorId && c.actorRole !== "ACADEMIC_REVIEWER")) {
        throw new Error("Only the assigned academic actor or an authorized reviewer can resolve this doubt.");
      }
      resolutionNote = requireText(c.resolutionNote ?? "", "resolutionNote");
      resolvedAt = c.occurredAt;
      nextState = "RESOLVED";
      break;
    case "CONFIRM_BY_STUDENT":
      if (c.actorRole !== "STUDENT" || c.actorId !== doubtCase.studentId || doubtCase.state !== "RESOLVED") {
        throw new Error("Only the affected student can confirm a resolved doubt.");
      }
      confirmedAt = c.occurredAt;
      nextState = "STUDENT_CONFIRMED";
      break;
    case "REOPEN":
      if (doubtCase.state !== "RESOLVED" && doubtCase.state !== "STUDENT_CONFIRMED") {
        throw new Error("Only a resolved doubt can be reopened.");
      }
      if (!((c.actorRole === "STUDENT" && c.actorId === doubtCase.studentId) || academic)) {
        throw new Error("Only the affected student or an authorized academic actor can reopen this doubt.");
      }
      assignedToId = undefined;
      reopenedAt = c.occurredAt;
      nextState = "REOPENED";
      break;
    default:
      throw new Error("Unsupported doubt transition.");
  }

  const event = freezeEvent({
    id: c.eventId, doubtCaseId: doubtCase.id, instituteId: doubtCase.instituteId,
    studentId: doubtCase.studentId, obligationId: doubtCase.obligationId,
    exerciseSlotId: doubtCase.exerciseSlotId, actorId: c.actorId,
    actorRole: c.actorRole, action: c.action,
    fromState: doubtCase.state, toState: nextState, reason,
    occurredAt: c.occurredAt, previousEventId: doubtCase.latestEventId,
    ...(c.action === "ASSIGN" && assignedToId ? { assignedToId } : {}),
    ...(c.action === "RESOLVE" && resolutionNote ? { resolutionNote } : {}),
  });
  const nextCase: DoubtCase = Object.freeze({
    ...doubtCase, state: nextState, latestEventId: event.id,
    updatedAt: c.occurredAt,
    ...(assignedToId ? { assignedToId } : { assignedToId: undefined }),
    ...(resolutionNote ? { resolutionNote } : {}),
    ...(resolvedAt ? { resolvedAt } : {}),
    ...(confirmedAt ? { confirmedAt } : {}),
    ...(reopenedAt ? { reopenedAt } : {}),
  });
  return Object.freeze({ outcome: "CREATED", value: Object.freeze({ doubtCase: nextCase, event }), event });
}
