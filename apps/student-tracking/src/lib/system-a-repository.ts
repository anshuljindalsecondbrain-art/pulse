import type { User } from "@supabase/supabase-js";
import { supabase } from "./supabase";

export type InstituteMembership = {
  id: string;
  institute_id: string;
  user_id: string;
  role_key: "STUDENT" | "PARENT" | "TEACHER" | "ACADEMIC_REVIEWER" | "MENTOR" | "CONTENT_ADMIN" | "INSTITUTE_ADMIN";
  centre_id: string | null;
  is_active: boolean;
};

export type StudentIdentity = {
  id: string;
  institute_id: string;
  auth_user_id: string | null;
  institute_student_code: string;
  full_name: string;
  is_active: boolean;
};

export type StudentObligation = {
  id: string;
  institute_id: string;
  assignment_version_id: string;
  assignment_item_id: string;
  exercise_slot_id: string;
  student_id: string;
  source_batch_id: string | null;
  eligibility_status: "ELIGIBLE" | "EXEMPTED" | "REMOVED";
  created_at: string;
};

export type StudentReportInput = {
  instituteId: string;
  obligationId: string;
  attemptCycleId?: string | null;
  workStatus: "NOT_STARTED" | "ATTEMPTED" | "SUBMITTED" | "COMPLETED" | "SKIPPED";
  answerOutcome?: "NOT_EVALUATED" | "CORRECT" | "INCORRECT" | "PARTIALLY_CORRECT" | "NOT_APPLICABLE";
  idempotencyKey: string;
  occurredAtClient?: string;
  payload?: Record<string, unknown>;
};

export type EvidenceEvent = {
  id: string;
  institute_id: string;
  obligation_id: string;
  attempt_cycle_id: string | null;
  event_type: "STUDENT_REPORT" | "TEACHER_OBSERVATION" | "SYSTEM_IMPORT";
  work_status: StudentReportInput["workStatus"] | null;
  answer_outcome: NonNullable<StudentReportInput["answerOutcome"]> | null;
  source_actor_id: string;
  source_actor_role: string;
  recorded_at_server: string;
  idempotency_key: string;
  payload: Record<string, unknown>;
};

export class SystemARepositoryError extends Error {
  constructor(message: string, readonly cause?: unknown) {
    super(message);
    this.name = "SystemARepositoryError";
  }
}

async function requireUser(): Promise<User> {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    throw new SystemARepositoryError("A valid authenticated session is required.", error);
  }
  return data.user;
}

/**
 * Returns only the signed-in user's active institute memberships.
 * The database must enforce the same predicate with RLS; this client filter
 * is not an authorization boundary.
 */
export async function listMyInstituteMemberships(): Promise<InstituteMembership[]> {
  const user = await requireUser();
  const { data, error } = await supabase
    .from("sa_institute_memberships")
    .select("id,institute_id,user_id,role_key,centre_id,is_active")
    .eq("user_id", user.id)
    .eq("is_active", true);

  if (error) throw new SystemARepositoryError("Could not load institute memberships.", error);
  return (data ?? []) as InstituteMembership[];
}

/**
 * Resolve the learner record from the authenticated identity. Do not accept a
 * student ID from a route or local storage as proof of ownership.
 */
export async function getMyStudentIdentity(instituteId: string): Promise<StudentIdentity | null> {
  const user = await requireUser();
  const { data, error } = await supabase
    .from("sa_students")
    .select("id,institute_id,auth_user_id,institute_student_code,full_name,is_active")
    .eq("institute_id", instituteId)
    .eq("auth_user_id", user.id)
    .eq("is_active", true)
    .maybeSingle();

  if (error) throw new SystemARepositoryError("Could not resolve the signed-in learner.", error);
  return data as StudentIdentity | null;
}

/** List the authenticated learner's obligations for one institute. */
export async function listMyObligations(instituteId: string): Promise<StudentObligation[]> {
  const student = await getMyStudentIdentity(instituteId);
  if (!student) return [];

  const { data, error } = await supabase
    .from("sa_student_obligations")
    .select("id,institute_id,assignment_version_id,assignment_item_id,exercise_slot_id,student_id,source_batch_id,eligibility_status,created_at")
    .eq("institute_id", instituteId)
    .eq("student_id", student.id)
    .eq("eligibility_status", "ELIGIBLE")
    .order("created_at", { ascending: false });

  if (error) throw new SystemARepositoryError("Could not load learner obligations.", error);
  return (data ?? []) as StudentObligation[];
}

/**
 * Append a learner self-report. This never updates an earlier event.
 * RLS and a database-side actor/role check are mandatory before enabling this
 * operation in a deployed environment. The client-provided role is not trusted.
 */
export async function appendMyStudentReport(input: StudentReportInput): Promise<EvidenceEvent> {
  const user = await requireUser();
  const student = await getMyStudentIdentity(input.instituteId);
  if (!student) throw new SystemARepositoryError("No active learner identity exists in this institute.");

  const { data: obligation, error: obligationError } = await supabase
    .from("sa_student_obligations")
    .select("id,student_id,eligibility_status")
    .eq("id", input.obligationId)
    .eq("institute_id", input.instituteId)
    .eq("student_id", student.id)
    .maybeSingle();

  if (obligationError) throw new SystemARepositoryError("Could not validate the learner obligation.", obligationError);
  if (!obligation || obligation.eligibility_status !== "ELIGIBLE") {
    throw new SystemARepositoryError("The obligation is unavailable or not eligible for reporting.");
  }

  const { data, error } = await supabase
    .from("sa_evidence_events")
    .insert({
      institute_id: input.instituteId,
      obligation_id: input.obligationId,
      attempt_cycle_id: input.attemptCycleId ?? null,
      event_type: "STUDENT_REPORT",
      work_status: input.workStatus,
      answer_outcome: input.answerOutcome ?? "NOT_EVALUATED",
      source_actor_id: user.id,
      source_actor_role: "STUDENT",
      occurred_at_client: input.occurredAtClient ?? null,
      idempotency_key: input.idempotencyKey,
      payload: input.payload ?? {},
    })
    .select("id,institute_id,obligation_id,attempt_cycle_id,event_type,work_status,answer_outcome,source_actor_id,source_actor_role,recorded_at_server,idempotency_key,payload")
    .single();

  if (error) throw new SystemARepositoryError("Could not append the learner report.", error);
  return data as EvidenceEvent;
}
