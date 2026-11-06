import { describe, expect, it } from "vitest";
import { OFFLINE_MODULES } from "./offline-catalog";
import { planAssignmentPublication } from "./assignment-domain";
import { buildStudentWorklist, buildTeacherVerificationQueue } from "./worklist-domain";
import type { SystemAWorkEvidence, SystemAVerificationDecision } from "./workflow-domain";

const module = OFFLINE_MODULES[0];
const plan = planAssignmentPublication({
  instituteId: "inst-1",
  assignmentId: "assignment-1",
  assignmentVersionId: "assignment-v1",
  versionNumber: 1,
  title: "Rotational Motion Practice",
  module,
  selectedQuestionIds: [module.questions[0].id, module.questions[1].id],
  targetStudents: [
    { studentId: "student-1", eligibility: "ELIGIBLE" },
    { studentId: "student-2", eligibility: "ELIGIBLE" },
    { studentId: "student-3", eligibility: "EXEMPTED" },
  ],
  dueAt: "2026-11-10T18:00:00.000Z",
  publishedAt: "2026-11-06T10:00:00.000Z",
  publishedBy: "teacher-1",
});

const evidence = (overrides: Partial<SystemAWorkEvidence> = {}): SystemAWorkEvidence => ({
  id: "event-1",
  instituteId: "inst-1",
  studentId: "student-1",
  obligationId: plan.obligations[0].id,
  exerciseSlotId: plan.obligations[0].exerciseSlotId,
  actorId: "student-1",
  actorRole: "STUDENT",
  source: "STUDENT_SELF_REPORT",
  workProgress: "SUBMITTED",
  attemptCycleId: "attempt-1",
  idempotencyKey: "idem-1",
  occurredAt: "2026-11-06T10:01:00.000Z",
  recordedAt: "2026-11-06T10:02:00.000Z",
  ...overrides,
});

const decision = (overrides: Partial<SystemAVerificationDecision> = {}): SystemAVerificationDecision => ({
  id: "decision-1",
  instituteId: "inst-1",
  obligationId: plan.obligations[0].id,
  evidenceEventId: "event-1",
  verifierId: "teacher-1",
  purpose: "COMPLETION",
  outcome: "CONFIRMED",
  reason: "Reviewed work",
  decidedAt: "2026-11-06T11:00:00.000Z",
  ...overrides,
});

describe("student worklist projection", () => {
  it("returns only the requested learner's eligible obligations", () => {
    const rows = buildStudentWorklist({
      studentId: "student-1",
      obligations: plan.obligations,
      versions: [plan.assignmentVersion],
      evidence: [],
      decisions: [],
    });
    expect(rows).toHaveLength(2);
    expect(rows.every((row) => row.state === "NOT_STARTED")).toBe(true);
  });

  it("projects submission and verification as separate states", () => {
    const submitted = buildStudentWorklist({
      studentId: "student-1",
      obligations: plan.obligations,
      versions: [plan.assignmentVersion],
      evidence: [evidence()],
      decisions: [],
    });
    expect(submitted[0].state).toBe("SUBMITTED");

    const verified = buildStudentWorklist({
      studentId: "student-1",
      obligations: plan.obligations,
      versions: [plan.assignmentVersion],
      evidence: [evidence()],
      decisions: [decision()],
    });
    expect(verified[0].state).toBe("VERIFIED");
  });

  it("does not expose exempted obligations or another learner's reports", () => {
    const rows = buildStudentWorklist({
      studentId: "student-1",
      obligations: plan.obligations,
      versions: [plan.assignmentVersion],
      evidence: [evidence({ studentId: "student-2", id: "other-event" })],
      decisions: [],
    });
    expect(rows).toHaveLength(2);
    expect(rows.every((row) => row.latestEvidenceId === null)).toBe(true);
  });

  it("rejects a blank learner identity", () => {
    expect(() => buildStudentWorklist({
      studentId: " ",
      obligations: [],
      versions: [],
      evidence: [],
      decisions: [],
    })).toThrow(/studentId/);
  });
});

describe("teacher verification queue projection", () => {
  it("queues submitted reports with pending state", () => {
    const queue = buildTeacherVerificationQueue({
      obligations: plan.obligations,
      versions: [plan.assignmentVersion],
      evidence: [evidence()],
      decisions: [],
    });
    expect(queue).toHaveLength(1);
    expect(queue[0].state).toBe("PENDING");
    expect(queue[0].evidenceEventId).toBe("event-1");
  });

  it("uses the latest completion decision for the exact current report", () => {
    const queue = buildTeacherVerificationQueue({
      obligations: plan.obligations,
      versions: [plan.assignmentVersion],
      evidence: [evidence()],
      decisions: [
        decision({ id: "decision-old", outcome: "RETURNED", decidedAt: "2026-11-06T10:30:00.000Z" }),
        decision({ id: "decision-new", outcome: "CONFIRMED", decidedAt: "2026-11-06T11:00:00.000Z" }),
      ],
    });
    expect(queue[0].state).toBe("CONFIRMED");
  });

  it("does not queue teacher observations or reports from another institute", () => {
    const queue = buildTeacherVerificationQueue({
      obligations: plan.obligations,
      versions: [plan.assignmentVersion],
      evidence: [
        evidence({ source: "TEACHER_OBSERVATION", id: "teacher-event" }),
        evidence({ instituteId: "inst-other", id: "foreign-event" }),
      ],
      decisions: [],
    });
    expect(queue).toHaveLength(0);
  });
});
