import { Hono } from 'hono';
import { getDb } from '../db/client';
import { getFleetSummary, getVehicles, getDrivers, getTrips, getMaintenance, getFuelLogs, getAlerts, getSafetyEvents } from '../db/queries';
import { calculateSafetyScore } from '../lib/safety-score';

export const createApp = () => {
  const app = new Hono<{ Bindings: Env }>();

  app.get('/api/health', (c) => c.json({ ok: true, source: 'd1' }));

  app.get('/api/fleet-summary', async (c) => {
    const db = getDb(c.env.DB);
    const summary = await getFleetSummary(db);
    return c.json(summary);
  });

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

  app.get('/api/drivers', async (c) => {
    const db = getDb(c.env.DB);
    return c.json(await getDrivers(db));
  });

  app.get('/api/trips', async (c) => {
    const db = getDb(c.env.DB);
    return c.json(await getTrips(db));
  });

  app.get('/api/maintenance', async (c) => {
    const db = getDb(c.env.DB);
    return c.json(await getMaintenance(db));
  });

  app.get('/api/fuel-logs', async (c) => {
    const db = getDb(c.env.DB);
    return c.json(await getFuelLogs(db));
  });

  app.get('/api/alerts', async (c) => {
    const db = getDb(c.env.DB);
    return c.json(await getAlerts(db));
  });

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

  return app;
};
