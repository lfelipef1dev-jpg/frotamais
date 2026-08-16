export interface SafetyEvent {
  id: string;
  driverId: string;
  vehicleId?: string;
  type: string;
  severity: string;
  speed?: number;
  speedLimit?: number;
  lat?: number;
  lng?: number;
  occurredAt: string;
}

const SEVERITY_WEIGHTS: Record<string, number> = {
  low: 2,
  medium: 5,
  high: 10,
  critical: 20,
};

const EVENT_TYPE_WEIGHTS: Record<string, number> = {
  speeding: 1.2,
  harsh_braking: 1.0,
  harsh_acceleration: 1.0,
  harsh_cornering: 1.1,
  geofence: 1.5,
  idle: 0.5,
};

const BASE_SCORE = 100;
const MIN_SCORE = 0;

export function calculateSafetyScore(events: SafetyEvent[]): number {
  if (events.length === 0) return BASE_SCORE;

  let penalty = 0;
  for (const event of events) {
    const severityWeight = SEVERITY_WEIGHTS[event.severity] ?? 5;
    const typeWeight = EVENT_TYPE_WEIGHTS[event.type] ?? 1.0;
    penalty += severityWeight * typeWeight;
  }

  const score = BASE_SCORE - penalty;
  return Math.max(MIN_SCORE, Math.round(score));
}

export function calculateSafetyScoreForDriver(
  events: SafetyEvent[],
  driverId: string
): number {
  const driverEvents = events.filter((e) => e.driverId === driverId);
  return calculateSafetyScore(driverEvents);
}

export interface SafetyScoreBreakdown {
  driverId: string;
  score: number;
  totalEvents: number;
  eventsByType: Record<string, number>;
  eventsBySeverity: Record<string, number>;
  recentEvents: SafetyEvent[];
}

export function getSafetyScoreBreakdown(
  events: SafetyEvent[],
  driverId: string
): SafetyScoreBreakdown {
  const driverEvents = events.filter((e) => e.driverId === driverId);

  const eventsByType: Record<string, number> = {};
  const eventsBySeverity: Record<string, number> = {};

  for (const event of driverEvents) {
    eventsByType[event.type] = (eventsByType[event.type] ?? 0) + 1;
    eventsBySeverity[event.severity] = (eventsBySeverity[event.severity] ?? 0) + 1;
  }

  const sortedEvents = [...driverEvents].sort(
    (a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime()
  );

  return {
    driverId,
    score: calculateSafetyScore(driverEvents),
    totalEvents: driverEvents.length,
    eventsByType,
    eventsBySeverity,
    recentEvents: sortedEvents.slice(0, 5),
  };
}

export function getScoreLabel(score: number): string {
  if (score >= 90) return 'Excelente';
  if (score >= 75) return 'Bom';
  if (score >= 60) return 'Regular';
  if (score >= 40) return 'Risco';
  return 'Critico';
}

export function getScoreColor(score: number): string {
  if (score >= 90) return 'text-green-400';
  if (score >= 75) return 'text-blue-400';
  if (score >= 60) return 'text-yellow-400';
  if (score >= 40) return 'text-orange-400';
  return 'text-red-400';
}
