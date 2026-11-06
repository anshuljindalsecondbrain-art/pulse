export const STATUSES = ["U", "C", "I", "D", "S", "P"] as const;
export type Status = (typeof STATUSES)[number];

const NEXT_STATUS: Record<Status, Status> = {
  U: "C",
  C: "I",
  I: "D",
  D: "S",
  S: "P",
  P: "U",
};

export function nextStatus(status: Status): Status {
  return NEXT_STATUS[status];
}

export function isAttemptedStatus(status: Status): boolean {
  return status !== "U" && status !== "S";
}

export function summarizeStatuses(statuses: readonly Status[]) {
  return {
    total: statuses.length,
    recorded: statuses.filter((status) => status !== "U").length,
    attempted: statuses.filter(isAttemptedStatus).length,
    skipped: statuses.filter((status) => status === "S").length,
    unattempted: statuses.filter((status) => status === "U").length,
    correct: statuses.filter((status) => status === "C").length,
    incorrect: statuses.filter((status) => status === "I").length,
    doubt: statuses.filter((status) => status === "D").length,
    partiallyCorrect: statuses.filter((status) => status === "P").length,
  };
}
