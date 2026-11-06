import type { ActorRole, CorrectionState, DoubtState } from "./workflow-domain";

export type WorkflowAction =
  | "ASSIGN"
  | "START"
  | "RESOLVE"
  | "CONFIRM_BY_STUDENT"
  | "REOPEN"
  | "SUBMIT_CORRECTION"
  | "ACCEPT_CORRECTION"
  | "RETURN_CORRECTION"
  | "CLOSE_CORRECTION";

export type TransitionResult<T extends string> = Readonly<{
  from: T;
  to: T;
  action: WorkflowAction;
  actorRole: ActorRole;
  reason: string;
}>;

function requireReason(reason: string): void {
  if (!reason.trim()) throw new Error("A non-empty reason is required for this workflow action.");
}

/** Doubt resolution is individual; cohort-level resolution must emit one transition per case. */
export function transitionDoubt(
  current: DoubtState,
  action: WorkflowAction,
  actorRole: ActorRole,
  reason: string,
): TransitionResult<DoubtState> {
  requireReason(reason);
  let next: DoubtState;

  switch (action) {
    case "ASSIGN":
      if (!["TEACHER", "ACADEMIC_REVIEWER"].includes(actorRole) || !["OPEN", "REOPENED"].includes(current)) {
        throw new Error("Only an authorised academic actor can assign an open or reopened doubt.");
      }
      next = "ASSIGNED";
      break;
    case "START":
      if (!["TEACHER", "ACADEMIC_REVIEWER"].includes(actorRole) || current !== "ASSIGNED") {
        throw new Error("Only the assigned academic workflow can start an assigned doubt.");
      }
      next = "IN_PROGRESS";
      break;
    case "RESOLVE":
      if (!["TEACHER", "ACADEMIC_REVIEWER"].includes(actorRole) || current !== "IN_PROGRESS") {
        throw new Error("Only an academic actor can resolve an in-progress doubt.");
      }
      next = "RESOLVED";
      break;
    case "CONFIRM_BY_STUDENT":
      if (actorRole !== "STUDENT" || current !== "RESOLVED") {
        throw new Error("Only the student can confirm a resolved doubt.");
      }
      next = "STUDENT_CONFIRMED";
      break;
    case "REOPEN":
      if (!["STUDENT", "TEACHER", "ACADEMIC_REVIEWER"].includes(actorRole) ||
          !["RESOLVED", "STUDENT_CONFIRMED"].includes(current)) {
        throw new Error("Only an involved academic actor or the student can reopen a resolved doubt.");
      }
      next = "REOPENED";
      break;
    default:
      throw new Error("Action is not valid for a doubt case.");
  }

  return Object.freeze({ from: current, to: next, action, actorRole, reason: reason.trim() });
}

/**
 * Correction is a separate lifecycle. Resubmission does not create a new
 * practice attempt cycle; callers must retain the originating cycle reference.
 */
export function transitionCorrection(
  current: CorrectionState,
  action: WorkflowAction,
  actorRole: ActorRole,
  reason: string,
): TransitionResult<CorrectionState> {
  requireReason(reason);
  let next: CorrectionState;

  switch (action) {
    case "START":
      if (actorRole !== "STUDENT" || current !== "REQUIRED") {
        throw new Error("Only the student can start required correction work.");
      }
      next = "IN_PROGRESS";
      break;
    case "SUBMIT_CORRECTION":
      if (actorRole !== "STUDENT" || current !== "IN_PROGRESS") {
        throw new Error("Only the student can resubmit an in-progress correction.");
      }
      next = "RESUBMITTED";
      break;
    case "ACCEPT_CORRECTION":
      if (!["TEACHER", "ACADEMIC_REVIEWER"].includes(actorRole) || current !== "RESUBMITTED") {
        throw new Error("Only an authorised academic actor can accept a resubmitted correction.");
      }
      next = "ACCEPTED";
      break;
    case "RETURN_CORRECTION":
      if (!["TEACHER", "ACADEMIC_REVIEWER"].includes(actorRole) || current !== "RESUBMITTED") {
        throw new Error("Only an authorised academic actor can return a resubmitted correction.");
      }
      next = "REQUIRED";
      break;
    case "CLOSE_CORRECTION":
      if (!["TEACHER", "ACADEMIC_REVIEWER"].includes(actorRole) || current !== "ACCEPTED") {
        throw new Error("Only an authorised academic actor can close an accepted correction.");
      }
      next = "CLOSED";
      break;
    default:
      throw new Error("Action is not valid for a correction cycle.");
  }

  return Object.freeze({ from: current, to: next, action, actorRole, reason: reason.trim() });
}

/** A teacher observation is never allowed to masquerade as a student report. */
export function assertEvidenceActor(source: string, actorRole: ActorRole): void {
  if (source === "STUDENT_SELF_REPORT" && actorRole !== "STUDENT") {
    throw new Error("Student self-report requires a student actor.");
  }
  if (source === "TEACHER_OBSERVATION" && !["TEACHER", "ACADEMIC_REVIEWER"].includes(actorRole)) {
    throw new Error("Teacher observation requires an academic actor.");
  }
}
