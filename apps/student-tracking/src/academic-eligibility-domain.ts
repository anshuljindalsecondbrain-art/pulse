export type AcademicClass = "XI" | "XII" | "DROPPER";
export type ExamStream = "JEE" | "NEET" | "COMMON";
export type AcademicSubject = "Physics" | "Chemistry" | "Mathematics" | "Biology";

export type LearnerAcademicContext = Readonly<{
  learnerId: string;
  classLevel: AcademicClass;
  stream: ExamStream;
  programme?: string | null;
}>;

export type ContentAcademicContext = Readonly<{
  contentId: string;
  classLevel: "XI" | "XII";
  stream: ExamStream;
  subject: AcademicSubject;
}>;

export type EligibilityReason =
  | "ELIGIBLE"
  | "CLASS_LEVEL_MISMATCH"
  | "STREAM_MISMATCH"
  | "SUBJECT_STREAM_MISMATCH"
  | "INVALID_CONTEXT";

export type AcademicEligibilityResult = Readonly<{
  eligible: boolean;
  reason: EligibilityReason;
}>;

const STREAMS_BY_SUBJECT: Record<AcademicSubject, readonly ExamStream[]> = {
  Physics: ["JEE", "NEET", "COMMON"],
  Chemistry: ["JEE", "NEET", "COMMON"],
  Mathematics: ["JEE"],
  Biology: ["NEET"],
};

function isNonEmpty(value: string): boolean {
  return value.trim().length > 0;
}

/**
 * Day-1 assignment compatibility. This function deliberately has no QBMS/DTE
 * dependency: it evaluates only the effective learner context and the
 * assignment's academic metadata.
 *
 * Policy encoded from the supplied Student Tracking source:
 * - XI learners cannot receive XII-only content.
 * - XII and Droppers may receive XI revision content.
 * - Droppers may receive XI and XII content.
 * - COMMON content is available to JEE/NEET/COMMON learners for shared
 *   Physics and Chemistry; Mathematics remains JEE and Biology remains NEET.
 */
export function evaluateAcademicEligibility(
  learner: LearnerAcademicContext,
  content: ContentAcademicContext,
): AcademicEligibilityResult {
  if (
    !isNonEmpty(learner.learnerId) ||
    !isNonEmpty(content.contentId) ||
    !STREAMS_BY_SUBJECT[content.subject] ||
    !["XI", "XII", "DROPPER"].includes(learner.classLevel) ||
    !["JEE", "NEET", "COMMON"].includes(learner.stream) ||
    !["XI", "XII"].includes(content.classLevel) ||
    !["JEE", "NEET", "COMMON"].includes(content.stream)
  ) {
    return Object.freeze({ eligible: false, reason: "INVALID_CONTEXT" });
  }

  const classAllowed =
    content.classLevel === "XI" ||
    learner.classLevel === "DROPPER" ||
    learner.classLevel === "XII";
  if (!classAllowed) {
    return Object.freeze({ eligible: false, reason: "CLASS_LEVEL_MISMATCH" });
  }

  const subjectStreams = STREAMS_BY_SUBJECT[content.subject];
  if (!subjectStreams.includes(content.stream)) {
    return Object.freeze({ eligible: false, reason: "SUBJECT_STREAM_MISMATCH" });
  }

  const streamAllowed =
    content.stream === "COMMON" ||
    learner.stream === content.stream ||
    (learner.stream === "COMMON" && (content.subject === "Physics" || content.subject === "Chemistry"));
  if (!streamAllowed) {
    return Object.freeze({ eligible: false, reason: "STREAM_MISMATCH" });
  }

  return Object.freeze({ eligible: true, reason: "ELIGIBLE" });
}

export type AttemptCycle = Readonly<{
  obligationId: string;
  cycleNumber: number;
  openedAt: string;
  reason: "INITIAL" | "REVISION" | "RETEST" | "CORRECTION";
}>;

/** Pure attempt-cycle constructor; persistence must enforce unique(obligation, cycle_number). */
export function createAttemptCycle(input: AttemptCycle): AttemptCycle {
  if (!isNonEmpty(input.obligationId)) throw new Error("obligationId must be non-empty.");
  if (!Number.isInteger(input.cycleNumber) || input.cycleNumber < 1) {
    throw new Error("cycleNumber must be a positive integer.");
  }
  if (!Number.isFinite(Date.parse(input.openedAt))) throw new Error("openedAt must be a valid timestamp.");
  if (input.cycleNumber === 1 && input.reason !== "INITIAL") {
    throw new Error("The first attempt cycle must use INITIAL reason.");
  }
  if (input.cycleNumber > 1 && input.reason === "INITIAL") {
    throw new Error("Subsequent attempt cycles must declare a non-initial reason.");
  }
  return Object.freeze({ ...input });
}
