export type Stream = 'JEE' | 'NEET';
export type ClassLevel = 'XI' | 'XII';

export interface AcademicContextEpoch {
  id: string;
  tenantId: string;
  studentId: string;
  batchId: string;
  validFrom: string;
  validTo?: string;
  teacherIds: string[];
  stream: Stream;
  classLevel: ClassLevel;
  reason?: string;
}

export function isContextActive(
  epoch: AcademicContextEpoch,
  at: Date = new Date(),
): boolean {
  const from = new Date(epoch.validFrom).getTime();
  const to = epoch.validTo ? new Date(epoch.validTo).getTime() : Number.POSITIVE_INFINITY;
  const point = at.getTime();
  return point >= from && point < to;
}
