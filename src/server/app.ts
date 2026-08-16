import { Hono } from 'hono';
import { vehiclesData, driversData, tripsData, maintenanceData, fuelLogsData, alertsData } from '../data/seed';

export const createApp = () => {
  const app = new Hono();

  app.get('/api/health', (c) => c.json({ ok: true }));

  app.get('/api/fleet-summary', (c) => {
    const active = vehiclesData.filter((v) => v.status === 'in_use' || v.status === 'available').length;
    const maintenance = vehiclesData.filter((v) => v.status === 'maintenance').length;
    const unavailable = vehiclesData.filter((v) => v.status === 'unavailable').length;
    const totalKm = vehiclesData.reduce((acc, v) => acc + v.currentOdometer, 0);
    const critical = alertsData.filter((a) => a.severity === 'critical' && !a.resolvedAt).length;

    return c.json({
      totalVehicles: vehiclesData.length,
      activeVehicles: active,
      inMaintenance: maintenance,
      unavailable,
      totalKm,
      criticalAlerts: critical,
    });
  });

  app.get('/api/vehicles', (c) => c.json(vehiclesData));
  app.get('/api/vehicles/:id', (c) => {
    const v = vehiclesData.find((x) => x.id === c.req.param('id'));
    return v ? c.json(v) : c.json({ error: 'not found' }, 404);
  });
  app.get('/api/drivers', (c) => c.json(driversData));
  app.get('/api/trips', (c) => c.json(tripsData));
  app.get('/api/maintenance', (c) => c.json(maintenanceData));
  app.get('/api/fuel-logs', (c) => c.json(fuelLogsData));
  app.get('/api/alerts', (c) => c.json(alertsData));

  return app;
};
