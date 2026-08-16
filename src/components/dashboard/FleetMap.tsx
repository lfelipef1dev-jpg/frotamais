import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface VehiclePosition {
  id: string;
  lat: number;
  lng: number;
  speed?: number;
  heading?: number;
  timestamp?: number;
}

interface VehicleInfo {
  id: string;
  plate: string;
  make: string;
  model: string;
  status: string;
  fuelLevel: number;
  currentOdometer: number;
}

interface FleetMapProps {
  vehicles: VehicleInfo[];
  initialPositions: VehiclePosition[];
  center?: [number, number];
  zoom?: number;
  streamUrl?: string;
}

const createVehicleIcon = (status: string) => {
  const color =
    status === 'in_use' ? '#22c55e' :
    status === 'maintenance' ? '#f97316' :
    status === 'unavailable' ? '#ef4444' : '#3b82f6';

  return L.divIcon({
    className: 'vehicle-marker',
    html: `<div style="
      background: ${color};
      width: 18px;
      height: 18px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 6px rgba(0,0,0,0.4);
    "></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
};

export default function FleetMap({
  vehicles,
  initialPositions,
  center = [-14.235, -51.9253],
  zoom = 4,
  streamUrl = '/api/fleet/stream',
}: FleetMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center,
      zoom,
      scrollWheelZoom: true,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(map);

    mapRef.current = map;

    const positionsMap = new Map(initialPositions.map((p) => [p.id, p]));

    vehicles.forEach((vehicle) => {
      const pos = positionsMap.get(vehicle.id);
      if (!pos) return;

      const marker = L.marker([pos.lat, pos.lng], {
        icon: createVehicleIcon(vehicle.status),
      }).addTo(map);

      marker.bindPopup(`
        <div style="min-width: 180px;">
          <strong>${vehicle.plate}</strong><br>
          <span style="color: #666; font-size: 12px;">${vehicle.make} ${vehicle.model}</span>
          <hr style="margin: 6px 0; border: none; border-top: 1px solid #eee;">
          <div style="font-size: 12px;">
            <div>Status: <strong>${vehicle.status}</strong></div>
            <div>Combustivel: <strong>${vehicle.fuelLevel}%</strong></div>
            <div>Odometro: <strong>${vehicle.currentOdometer.toLocaleString('pt-BR')} km</strong></div>
          </div>
        </div>
      `);

      markersRef.current.set(vehicle.id, marker);
    });

    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current.clear();
    };
  }, [vehicles, initialPositions, center, zoom]);

  useEffect(() => {
    const eventSource = new EventSource(streamUrl);

    eventSource.addEventListener('position', (event) => {
      const pos = JSON.parse(event.data) as VehiclePosition;
      const marker = markersRef.current.get(pos.id);
      if (marker && mapRef.current) {
        marker.setLatLng([pos.lat, pos.lng]);
      }
    });

    eventSource.addEventListener('initial', () => {
      // Already handled by initial positions
    });

    return () => {
      eventSource.close();
    };
  }, [streamUrl]);

  return (
    <div
      ref={containerRef}
      className="h-full w-full rounded-lg overflow-hidden"
      style={{ minHeight: '400px' }}
    />
  );
}
