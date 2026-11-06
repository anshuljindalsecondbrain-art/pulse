export type AnswerOutcome = "CORRECT" | "INCORRECT" | "PARTIALLY_CORRECT" | "UNATTEMPTED" | "SKIPPED" | "NOT_APPLICABLE";

export type MarkingScheme = Readonly<{
  id: string;
  version: number;
  correct: number;
  incorrect: number;
  partiallyCorrect: number;
  unattempted: number;
  skipped: number;
  notApplicable: number;
}>;

export type ScoredResponse = Readonly<{
  questionRef: string;
  outcome: AnswerOutcome;
  marksOverride?: number | null;
}>;

export type ScoredItem = Readonly<{
  questionRef: string;
  outcome: AnswerOutcome;
  marks: number;
}>;

export type AssessmentScore = Readonly<{
  schemeId: string;
  schemeVersion: number;
  items: readonly ScoredItem[];
  totalMarks: number;
}>;

function toMinorUnits(value: number, label: string): number {
  if (!Number.isFinite(value)) throw new Error(`${label} must be finite.`);
  const scaled = value * 100;
  if (Math.abs(scaled - Math.round(scaled)) > 1e-8) {
    throw new Error(`${label} supports at most two decimal places.`);
  }
  return Math.round(scaled);
}

function fromMinorUnits(value: number): number {
  return value / 100;
}

export function validateMarkingScheme(scheme: MarkingScheme): void {
  if (!scheme.id.trim()) throw new Error("Marking scheme id must be non-empty.");
  if (!Number.isInteger(scheme.version) || scheme.version < 1) throw new Error("Marking scheme version must be positive.");
  for (const [key, value] of Object.entries(scheme)) {
    if (key === "id" || key === "version") continue;
    toMinorUnits(value as number, key);
  }
}

export function scoreAssessment(
  scheme: MarkingScheme,
  responses: readonly ScoredResponse[],
): AssessmentScore {
  validateMarkingScheme(scheme);
  const refs = new Set<string>();
  const items = responses.map((response) => {
    if (!response.questionRef.trim()) throw new Error("questionRef must be non-empty.");
    if (refs.has(response.questionRef)) throw new Error("questionRef values must be unique within an assessment.");
    refs.add(response.questionRef);
    const base = scheme[response.outcome === "PARTIALLY_CORRECT" ? "partiallyCorrect" :
      response.outcome === "UNATTEMPTED" ? "unattempted" :
      response.outcome === "SKIPPED" ? "skipped" :
      response.outcome === "NOT_APPLICABLE" ? "notApplicable" : response.outcome.toLowerCase() as "correct" | "incorrect"];
    const marks = response.marksOverride == null ? base : response.marksOverride;
    const minor = toMinorUnits(marks, "marks");
    return Object.freeze({ questionRef: response.questionRef, outcome: response.outcome, marks: fromMinorUnits(minor) });
  });
  const totalMinor = items.reduce((sum, item) => sum + toMinorUnits(item.marks, "marks"), 0);
  return Object.freeze({
    schemeId: scheme.id,
    schemeVersion: scheme.version,
    items: Object.freeze(items),
    totalMarks: fromMinorUnits(totalMinor),
  });
}
