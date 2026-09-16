export type Role =
  | 'ADMIN'
  | 'ACADEMIC_HEAD'
  | 'TEACHER'
  | 'MENTOR'
  | 'STUDENT'
  | 'PARENT'
  | 'PEER'
  | 'REVIEWER';

export interface TenantIdentity {
  tenantId: string;
  personId: string;
  studentId?: string;
  roles: Role[];
}

export interface TenantContext {
  tenantId: string;
  actorPersonId: string;
  actorRoles: Role[];
}

export function hasRole(context: TenantContext, role: Role): boolean {
  return context.actorRoles.includes(role);
}
