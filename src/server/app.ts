import { Hono } from 'hono';
import { eq, sql } from 'drizzle-orm';
import { getDb } from '../db/client';
import { getFleetSummary, getVehicles, getDrivers, getTrips, getMaintenance, getFuelLogs, getAlerts, getSafetyEvents, getUsers, getInspections } from '../db/queries';
import { calculateSafetyScore } from '../lib/safety-score';
import * as schema from '../db/schema';

export const createApp = () => {
  const app = new Hono<{ Bindings: Env }>();

  app.get('/api/health', (c) => c.json({ ok: true, source: 'd1' }));

  app.get('/api/fleet-summary', async (c) => {
    const db = getDb(c.env.DB);
    const summary = await getFleetSummary(db);
    return c.json(summary);
  });

  // Vehicles
  app.get('/api/vehicles', async (c) => {
    const db = getDb(c.env.DB);
    return c.json(await getVehicles(db));
  });

  app.get('/api/vehicles/:id', async (c) => {
    const db = getDb(c.env.DB);
    const vehicles = await getVehicles(db);
    const v = vehicles.find((x) => x.id === c.req.param('id'));
    return v ? c.json(v) : c.json({ error: 'not found' }, 404);
  });

  app.post('/api/vehicles', async (c) => {
    const db = getDb(c.env.DB);
    const body = await c.req.json();
    const id = `veh-${Date.now()}`;
    await db.insert(schema.vehicles).values({
      id,
      plate: body.plate,
      make: body.make,
      model: body.model,
      year: body.year,
      type: body.type ?? 'car',
      status: body.status ?? 'available',
      fuelType: body.fuelType ?? 'flex',
      currentOdometer: body.currentOdometer ?? 0,
      fuelLevel: body.fuelLevel ?? 100,
    });
    return c.json({ id, ok: true });
  });

  app.put('/api/vehicles/:id', async (c) => {
    const db = getDb(c.env.DB);
    const body = await c.req.json();
    await db.update(schema.vehicles).set(body).where(eq(schema.vehicles.id, c.req.param('id')));
    return c.json({ ok: true });
  });

  app.delete('/api/vehicles/:id', async (c) => {
    const db = getDb(c.env.DB);
    await db.delete(schema.vehicles).where(eq(schema.vehicles.id, c.req.param('id')));
    return c.json({ ok: true });
  });

  // Drivers
  app.get('/api/drivers', async (c) => {
    const db = getDb(c.env.DB);
    return c.json(await getDrivers(db));
  });

  app.post('/api/drivers', async (c) => {
    const db = getDb(c.env.DB);
    const body = await c.req.json();
    const id = `drv-${Date.now()}`;
    await db.insert(schema.drivers).values({
      id,
      name: body.name,
      licenseNumber: body.licenseNumber,
      licenseExpiry: body.licenseExpiry,
      phone: body.phone,
      status: body.status ?? 'active',
    });
    return c.json({ id, ok: true });
  });

  app.put('/api/drivers/:id', async (c) => {
    const db = getDb(c.env.DB);
    const body = await c.req.json();
    await db.update(schema.drivers).set(body).where(eq(schema.drivers.id, c.req.param('id')));
    return c.json({ ok: true });
  });

  app.delete('/api/drivers/:id', async (c) => {
    const db = getDb(c.env.DB);
    await db.delete(schema.drivers).where(eq(schema.drivers.id, c.req.param('id')));
    return c.json({ ok: true });
  });

  // Trips
  app.get('/api/trips', async (c) => {
    const db = getDb(c.env.DB);
    return c.json(await getTrips(db));
  });

  // Maintenance
  app.get('/api/maintenance', async (c) => {
    const db = getDb(c.env.DB);
    return c.json(await getMaintenance(db));
  });

  app.post('/api/maintenance', async (c) => {
    const db = getDb(c.env.DB);
    const body = await c.req.json();
    const id = `mnt-${Date.now()}`;
    await db.insert(schema.maintenance).values({
      id,
      vehicleId: body.vehicleId,
      type: body.type,
      description: body.description,
      cost: body.cost,
      performedAt: body.performedAt ?? new Date().toISOString(),
      performedBy: body.performedBy,
      nextDueKm: body.nextDueKm,
      nextDueDate: body.nextDueDate,
    });
    return c.json({ id, ok: true });
  });

  app.delete('/api/maintenance/:id', async (c) => {
    const db = getDb(c.env.DB);
    await db.delete(schema.maintenance).where(eq(schema.maintenance.id, c.req.param('id')));
    return c.json({ ok: true });
  });

  // Fuel logs
  app.get('/api/fuel-logs', async (c) => {
    const db = getDb(c.env.DB);
    return c.json(await getFuelLogs(db));
  });

  app.post('/api/fuel-logs', async (c) => {
    const db = getDb(c.env.DB);
    const body = await c.req.json();
    const id = `ful-${Date.now()}`;
    await db.insert(schema.fuelLogs).values({
      id,
      vehicleId: body.vehicleId,
      date: body.date ?? new Date().toISOString(),
      odometer: body.odometer,
      liters: body.liters,
      cost: body.cost,
      station: body.station,
    });
    return c.json({ id, ok: true });
  });

  app.delete('/api/fuel-logs/:id', async (c) => {
    const db = getDb(c.env.DB);
    await db.delete(schema.fuelLogs).where(eq(schema.fuelLogs.id, c.req.param('id')));
    return c.json({ ok: true });
  });

  // Alerts
  app.get('/api/alerts', async (c) => {
    const db = getDb(c.env.DB);
    return c.json(await getAlerts(db));
  });

  app.put('/api/alerts/:id/resolve', async (c) => {
    const db = getDb(c.env.DB);
    await db.update(schema.alerts).set({ resolvedAt: new Date().toISOString() }).where(eq(schema.alerts.id, c.req.param('id')));
    return c.json({ ok: true });
  });

  // Safety scores
  app.get('/api/safety-scores', async (c) => {
    const db = getDb(c.env.DB);
    const drivers = await getDrivers(db);
    const events = await getSafetyEvents(db);
    const scores = drivers.map((d) => ({
      driverId: d.id,
      driverName: d.name,
      baseScore: d.safetyScore,
      calculatedScore: calculateSafetyScore(events.filter((e) => e.driverId === d.id)),
    }));
    return c.json(scores);
  });

  // Users
  app.get('/api/users', async (c) => {
    const db = getDb(c.env.DB);
    return c.json(await getUsers(db));
  });

  app.put('/api/users/:id/role', async (c) => {
    const db = getDb(c.env.DB);
    const body = await c.req.json();
    await db.update(schema.user).set({ role: body.role }).where(eq(schema.user.id, c.req.param('id')));
    return c.json({ ok: true });
  });

  // Inspections
  app.get('/api/inspections', async (c) => {
    const db = getDb(c.env.DB);
    return c.json(await getInspections(db));
  });

  // Reports — CSV export
  app.get('/api/reports/fuel-csv', async (c) => {
    const db = getDb(c.env.DB);
    const logs = await getFuelLogs(db);
    const vehicles = await getVehicles(db);
    const vById = Object.fromEntries(vehicles.map((v) => [v.id, v]));
    const header = 'Data,Veiculo,Odometro,Litros,Custo,Posto\n';
    const rows = logs.map((f) =>
      `${new Date(f.date).toLocaleDateString('pt-BR')},${vById[f.vehicleId]?.plate ?? f.vehicleId},${f.odometer},${f.liters},${f.cost.toFixed(2)},${f.station ?? ''}`
    ).join('\n');
    return new Response(header + rows, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename=combustivel.csv',
      },
    });
  });

  app.get('/api/reports/maintenance-csv', async (c) => {
    const db = getDb(c.env.DB);
    const records = await getMaintenance(db);
    const vehicles = await getVehicles(db);
    const vById = Object.fromEntries(vehicles.map((v) => [v.id, v]));
    const header = 'Veiculo,Tipo,Descricao,Custo,Data,Proximo Km,Proxima Data\n';
    const rows = records.map((m) =>
      `${vById[m.vehicleId]?.plate ?? m.vehicleId},${m.type},${m.description ?? ''},${m.cost?.toFixed(2) ?? '0'},${new Date(m.performedAt).toLocaleDateString('pt-BR')},${m.nextDueKm ?? ''},${m.nextDueDate ? new Date(m.nextDueDate).toLocaleDateString('pt-BR') : ''}`
    ).join('\n');
    return new Response(header + rows, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename=manutencao.csv',
      },
    });
  });

  app.get('/api/reports/trips-csv', async (c) => {
    const db = getDb(c.env.DB);
    const trips = await getTrips(db);
    const vehicles = await getVehicles(db);
    const drivers = await getDrivers(db);
    const vById = Object.fromEntries(vehicles.map((v) => [v.id, v]));
    const dById = Object.fromEntries(drivers.map((d) => [d.id, d]));
    const header = 'Veiculo,Motorista,Origem,Destino,Distancia Km,Status,Inicio\n';
    const rows = trips.map((t) =>
      `${vById[t.vehicleId]?.plate ?? t.vehicleId},${dById[t.driverId]?.name ?? t.driverId},${t.startAddress ?? ''},${t.endAddress ?? ''},${t.distanceKm ?? ''},${t.status},${t.startedAt ? new Date(t.startedAt).toLocaleDateString('pt-BR') : ''}`
    ).join('\n');
    return new Response(header + rows, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename=viagens.csv',
      },
    });
  });

  return app;
};
