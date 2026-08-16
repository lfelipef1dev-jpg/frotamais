import { DurableObject } from 'cloudflare:workers';

interface VehiclePosition {
  id: string;
  lat: number;
  lng: number;
  speed: number;
  heading: number;
  timestamp: number;
}

interface FleetAlert {
  id: string;
  vehicleId: string;
  type: string;
  severity: string;
  message: string;
  timestamp: number;
}

interface SSEMessage {
  event: string;
  data: unknown;
}

const INITIAL_VEHICLES = [
  { id: 'veh-0001', lat: -23.5505, lng: -46.6333 },
  { id: 'veh-0002', lat: -22.9068, lng: -43.1729 },
  { id: 'veh-0003', lat: -19.9167, lng: -43.9345 },
  { id: 'veh-0004', lat: -25.4284, lng: -49.2733 },
  { id: 'veh-0005', lat: -30.0346, lng: -51.2177 },
  { id: 'veh-0006', lat: -12.9714, lng: -38.5014 },
  { id: 'veh-0007', lat: -3.7319, lng: -38.5267 },
  { id: 'veh-0008', lat: -15.7939, lng: -47.8828 },
];

export class FleetTracker extends DurableObject {
  private vehicles: Map<string, VehiclePosition> = new Map();
  private alerts: FleetAlert[] = [];
  private connections: Set<WritableStreamDefaultWriter<Uint8Array>> = new Set();
  private encoder = new TextEncoder();
  private simulationActive = false;

  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
    this.ctx.blockConcurrencyWhile(async () => {
      const storedVehicles = await this.ctx.storage.get<Record<string, VehiclePosition>>('vehicles');
      if (storedVehicles) {
        this.vehicles = new Map(Object.entries(storedVehicles));
      }
      const storedAlerts = await this.ctx.storage.get<FleetAlert[]>('alerts');
      if (storedAlerts) {
        this.alerts = storedAlerts;
      }
    });
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname.endsWith('/stream')) {
      return this.handleStream(request);
    }
    if (url.pathname.endsWith('/update') && request.method === 'POST') {
      return this.handleUpdate(request);
    }
    if (url.pathname.endsWith('/simulate') && request.method === 'POST') {
      return this.handleSimulation(request);
    }

    return new Response('Not found', { status: 404 });
  }

  private handleStream(request: Request): Response {
    const { readable, writable } = new TransformStream<Uint8Array, Uint8Array>();
    const writer = writable.getWriter();
    this.connections.add(writer);

    writer.closed.then(() => {
      this.connections.delete(writer);
    });

    this.sendEvent(writer, {
      event: 'initial',
      data: {
        vehicles: Array.from(this.vehicles.values()),
        alerts: this.alerts.slice(-10),
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  private async handleUpdate(request: Request): Promise<Response> {
    const update = (await request.json()) as VehiclePosition;
    this.vehicles.set(update.id, update);
    await this.ctx.storage.put('vehicles', Object.fromEntries(this.vehicles));

    if (update.speed > 100) {
      const alert: FleetAlert = {
        id: crypto.randomUUID(),
        vehicleId: update.id,
        type: 'speeding',
        severity: update.speed > 120 ? 'critical' : 'high',
        message: `Veiculo ${update.id} acima do limite: ${Math.round(update.speed)} km/h`,
        timestamp: Date.now(),
      };
      this.alerts.push(alert);
      if (this.alerts.length > 100) this.alerts.shift();
      await this.ctx.storage.put('alerts', this.alerts);
      this.broadcast({ event: 'alert', data: alert });
    }

    this.broadcast({ event: 'position', data: update });
    return new Response('OK');
  }

  private async handleSimulation(request: Request): Promise<Response> {
    const body = (await request.json()) as { action: 'start' | 'stop' };

    if (body.action === 'start') {
      this.simulationActive = true;
      if (this.vehicles.size === 0) {
        for (const v of INITIAL_VEHICLES) {
          this.vehicles.set(v.id, {
            id: v.id,
            lat: v.lat,
            lng: v.lng,
            speed: 40 + Math.random() * 50,
            heading: Math.random() * 360,
            timestamp: Date.now(),
          });
        }
      }
      await this.ctx.storage.setAlarm(Date.now() + 3000);
      return new Response(JSON.stringify({ status: 'started' }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (body.action === 'stop') {
      this.simulationActive = false;
      await this.ctx.storage.deleteAlarm();
      return new Response(JSON.stringify({ status: 'stopped' }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response('Invalid action', { status: 400 });
  }

  async alarm(): Promise<void> {
    if (!this.simulationActive) return;

    for (const [id, pos] of this.vehicles) {
      const newPos: VehiclePosition = {
        id,
        lat: pos.lat + (Math.random() - 0.5) * 0.005,
        lng: pos.lng + (Math.random() - 0.5) * 0.005,
        speed: 30 + Math.random() * 70,
        heading: Math.random() * 360,
        timestamp: Date.now(),
      };
      this.vehicles.set(id, newPos);
      this.broadcast({ event: 'position', data: newPos });
    }

    await this.ctx.storage.put('vehicles', Object.fromEntries(this.vehicles));
    await this.ctx.storage.setAlarm(Date.now() + 3000);
  }

  private broadcast(message: SSEMessage): void {
    const payload = this.formatSSE(message);
    const encoded = this.encoder.encode(payload);
    const survivors = new Set<WritableStreamDefaultWriter<Uint8Array>>();

    for (const writer of this.connections) {
      try {
        writer.write(encoded);
        survivors.add(writer);
      } catch {
        try {
          writer.close();
        } catch {
          // ignore
        }
      }
    }
    this.connections = survivors;
  }

  private sendEvent(
    writer: WritableStreamDefaultWriter<Uint8Array>,
    message: SSEMessage
  ): void {
    const payload = this.formatSSE(message);
    writer.write(this.encoder.encode(payload));
  }

  private formatSSE(message: SSEMessage): string {
    return `event: ${message.event}\ndata: ${JSON.stringify(message.data)}\n\n`;
  }
}
