import type { ClassLevel, Stream } from './academic-context';

export type EnrollmentStatus = 'ACTIVE' | 'TRANSFERRED' | 'WITHDRAWN' | 'COMPLETED';
export type Role = 'ADMIN' | 'ACADEMIC_HEAD' | 'TEACHER' | 'MENTOR' | 'STUDENT' | 'PARENT' | 'PEER' | 'REVIEWER';

export interface Tenant {
  id: string;
  name: string;
  createdAt: string;
}

export interface Person {
  id: string;
  createdAt: string;
}

export interface TenantStudentIdentity {
  tenantPersonId: string;
  tenantId: string;
  personId: string;
  studentId: string;
}

export interface Batch {
  id: string;
  tenantId: string;
  name: string;
  stream: Stream;
  classLevel: ClassLevel;
  startsOn?: string;
  endsOn?: string;
}

export interface Enrollment {
  id: string;
  tenantId: string;
  studentId: string;
  batchId: string;
  validFrom: string;
  validTo?: string;
  status: EnrollmentStatus;
}

export interface TenantRoleAssignment {
  id: string;
  tenantId: string;
  personId: string;
  role: Role;
  validFrom: string;
  validTo?: string;
}

export function isEffectiveAt(validFrom: string, validTo: string | undefined, at: Date): boolean {
  const from = Date.parse(validFrom);
  const to = validTo ? Date.parse(validTo) : Number.POSITIVE_INFINITY;
  const point = at.getTime();
  return point >= from && point < to;
}

export function isActiveEnrollment(enrollment: Enrollment, at: Date = new Date()): boolean {
  return enrollment.status === 'ACTIVE' && isEffectiveAt(enrollment.validFrom, enrollment.validTo, at);
}
