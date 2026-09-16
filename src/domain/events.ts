export interface DomainEvent<TPayload = unknown> {
  eventId: string;
  tenantId: string;
  aggregateId: string;
  aggregateType: string;
  eventType: string;
  eventVersion: number;
  schemaVersion: number;
  occurredAt: string;
  recordedAt: string;
  effectiveAcademicTime?: string;
  actorId: string;
  actorRole: string;
  correlationId: string;
  causationId?: string;
  idempotencyKey: string;
  payload: TPayload;
}

export function createEventIdempotencyKey(
  aggregateId: string,
  commandId: string,
): string {
  return `${aggregateId}:${commandId}`;
}
