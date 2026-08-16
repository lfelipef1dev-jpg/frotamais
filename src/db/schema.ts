import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// Better Auth tables
export const user = sqliteTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: integer('email_verified', { mode: 'boolean' }).notNull().default(false),
  image: text('image'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const session = sqliteTable('session', {
  id: text('id').primaryKey(),
  expiresAt: text('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
});

export const account = sqliteTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: text('access_token_expires_at'),
  refreshTokenExpiresAt: text('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const verification = sqliteTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: text('expires_at').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Fleet tables
export const vehicles = sqliteTable('vehicles', {
  id: text('id').primaryKey(),
  plate: text('plate').notNull().unique(),
  make: text('make').notNull(),
  model: text('model').notNull(),
  year: integer('year').notNull(),
  type: text('type').notNull(),
  status: text('status').notNull(),
  fuelType: text('fuel_type').notNull(),
  currentOdometer: integer('current_odometer').notNull().default(0),
  fuelLevel: integer('fuel_level').notNull().default(100),
  currentLat: real('current_lat'),
  currentLng: real('current_lng'),
  assignedDriverId: text('assigned_driver_id'),
  lastLocationUpdate: text('last_location_update'),
});

export const drivers = sqliteTable('drivers', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  licenseNumber: text('license_number').notNull().unique(),
  licenseExpiry: text('license_expiry').notNull(),
  phone: text('phone').notNull(),
  status: text('status').notNull(),
  currentVehicleId: text('current_vehicle_id'),
  safetyScore: integer('safety_score').notNull().default(100),
  totalTrips: integer('total_trips').notNull().default(0),
  totalKm: integer('total_km').notNull().default(0),
});

export const trips = sqliteTable('trips', {
  id: text('id').primaryKey(),
  vehicleId: text('vehicle_id').notNull(),
  driverId: text('driver_id').notNull(),
  status: text('status').notNull(),
  startAddress: text('start_address'),
  startLat: real('start_lat'),
  startLng: real('start_lng'),
  endAddress: text('end_address'),
  endLat: real('end_lat'),
  endLng: real('end_lng'),
  startedAt: text('started_at'),
  completedAt: text('completed_at'),
  distanceKm: real('distance_km'),
  durationMinutes: integer('duration_minutes'),
  fuelUsedLiters: real('fuel_used_liters'),
});

export const maintenance = sqliteTable('maintenance', {
  id: text('id').primaryKey(),
  vehicleId: text('vehicle_id').notNull(),
  type: text('type').notNull(),
  description: text('description'),
  cost: real('cost'),
  performedAt: text('performed_at').notNull(),
  performedBy: text('performed_by'),
  nextDueKm: integer('next_due_km'),
  nextDueDate: text('next_due_date'),
});

export const fuelLogs = sqliteTable('fuel_logs', {
  id: text('id').primaryKey(),
  vehicleId: text('vehicle_id').notNull(),
  date: text('date').notNull(),
  odometer: integer('odometer').notNull(),
  liters: real('liters').notNull(),
  cost: real('cost').notNull(),
  station: text('station'),
});

export const alerts = sqliteTable('alerts', {
  id: text('id').primaryKey(),
  vehicleId: text('vehicle_id').notNull(),
  type: text('type').notNull(),
  severity: text('severity').notNull(),
  details: text('details').notNull(),
  triggeredAt: text('triggered_at').notNull(),
  resolvedAt: text('resolved_at'),
});

export const safetyEvents = sqliteTable('safety_events', {
  id: text('id').primaryKey(),
  driverId: text('driver_id').notNull(),
  vehicleId: text('vehicle_id'),
  type: text('type').notNull(),
  severity: text('severity').notNull(),
  speed: real('speed'),
  speedLimit: real('speed_limit'),
  lat: real('lat'),
  lng: real('lng'),
  occurredAt: text('occurred_at').notNull(),
});
