import { eq } from 'drizzle-orm';
import { getDb } from './client';
import * as schema from './schema';

export type Database = ReturnType<typeof getDb>;

export async function getVehicles(db: Database) {
  return db.select().from(schema.vehicles).all();
}

export async function getVehicle(db: Database, id: string) {
  const results = await db.select().from(schema.vehicles).where(eq(schema.vehicles.id, id)).limit(1);
  return results[0] ?? null;
}

export async function getDrivers(db: Database) {
  return db.select().from(schema.drivers).all();
}

export async function getDriver(db: Database, id: string) {
  const results = await db.select().from(schema.drivers).where(eq(schema.drivers.id, id)).limit(1);
  return results[0] ?? null;
}

export async function getTrips(db: Database) {
  return db.select().from(schema.trips).all();
}

export async function getMaintenance(db: Database) {
  return db.select().from(schema.maintenance).all();
}

export async function getFuelLogs(db: Database) {
  return db.select().from(schema.fuelLogs).all();
}

export async function getAlerts(db: Database) {
  return db.select().from(schema.alerts).all();
}

export async function getSafetyEvents(db: Database) {
  return db.select().from(schema.safetyEvents).all();
}

export async function getSafetyEventsForDriver(db: Database, driverId: string) {
  return db
    .select()
    .from(schema.safetyEvents)
    .where(eq(schema.safetyEvents.driverId, driverId))
    .all();
}

export async function getFleetSummary(db: Database) {
  const allVehicles = await getVehicles(db);
  const allAlerts = await getAlerts(db);
  const allTrips = await getTrips(db);
  const allFuel = await getFuelLogs(db);

  const active = allVehicles.filter((v) => v.status === 'in_use').length;
  const inMaintenance = allVehicles.filter((v) => v.status === 'maintenance').length;
  const totalKm = allVehicles.reduce((sum, v) => sum + (v.currentOdometer ?? 0), 0);
  const criticalAlerts = allAlerts.filter(
    (a) => a.severity === 'critical' && !a.resolvedAt
  ).length;

  const totalFuelLiters = allFuel.reduce((sum, f) => sum + f.liters, 0);
  const totalFuelCost = allFuel.reduce((sum, f) => sum + f.cost, 0);

  return {
    totalVehicles: allVehicles.length,
    activeVehicles: active,
    inMaintenance,
    totalKm,
    criticalAlerts,
    totalFuelLiters,
    totalFuelCost,
    recentAlerts: allAlerts.slice(-5),
    activeTrips: allTrips.filter((t) => t.status === 'in_progress'),
  };
}

export async function getUsers(db: Database) {
  return db.select({
    id: schema.user.id,
    name: schema.user.name,
    email: schema.user.email,
    role: schema.user.role,
    createdAt: schema.user.createdAt,
  }).from(schema.user).all();
}

export async function getInspections(db: Database) {
  return db.select().from(schema.inspections).all();
}

export async function getInspectionsForVehicle(db: Database, vehicleId: string) {
  return db.select().from(schema.inspections).where(eq(schema.inspections.vehicleId, vehicleId)).all();
}

export async function getTripsForVehicle(db: Database, vehicleId: string) {
  return db.select().from(schema.trips).where(eq(schema.trips.vehicleId, vehicleId)).all();
}

export async function getMaintenanceForVehicle(db: Database, vehicleId: string) {
  return db.select().from(schema.maintenance).where(eq(schema.maintenance.vehicleId, vehicleId)).all();
}

export async function getFuelLogsForVehicle(db: Database, vehicleId: string) {
  return db.select().from(schema.fuelLogs).where(eq(schema.fuelLogs.vehicleId, vehicleId)).all();
}

export async function getTripsForDriver(db: Database, driverId: string) {
  return db.select().from(schema.trips).where(eq(schema.trips.driverId, driverId)).all();
}

export async function getAlertsForVehicle(db: Database, vehicleId: string) {
  return db.select().from(schema.alerts).where(eq(schema.alerts.vehicleId, vehicleId)).all();
}
