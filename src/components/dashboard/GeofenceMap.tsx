import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Geofence {
  id: string;
  name: string;
  type: string;
  centerLat: number;
  centerLng: number;
  radius: number;
  color: string;
  active: boolean;
}

interface VehiclePos {
  id: string;
  plate: string;
  status: string;
  lat: number;
  lng: number;
}

interface GeofenceMapProps {
  geofences: Geofence[];
  vehicles: VehiclePos[];
}

export default function GeofenceMap({ geofences, vehicles }: GeofenceMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [-15.7939, -47.8828],
      zoom: 4,
      scrollWheelZoom: true,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(map);

    mapRef.current = map;

    // Draw geofences
    geofences.forEach((g) => {
      const color = g.active ? g.color : '#6B7280';
      const circle = L.circle([g.centerLat, g.centerLng], {
        radius: g.radius,
        color,
        fillColor: color,
        fillOpacity: 0.15,
        weight: 2,
        dashArray: g.active ? undefined : '5, 5',
      }).addTo(map);
      circle.bindPopup(`<b>${g.name}</b><br/>Tipo: ${g.type}<br/>Raio: ${g.radius}m<br/>Status: ${g.active ? 'Ativo' : 'Inativo'}`);
    });

    // Draw vehicles
    const statusColors: Record<string, string> = {
      in_use: '#22C55E', maintenance: '#F97316', unavailable: '#EF4444', available: '#6B7280',
    };
    vehicles.forEach((v) => {
      const marker = L.circleMarker([v.lat, v.lng], {
        radius: 6,
        color: statusColors[v.status] ?? '#6B7280',
        fillColor: statusColors[v.status] ?? '#6B7280',
        fillOpacity: 1,
        weight: 2,
      }).addTo(map);
      marker.bindPopup(`<b>${v.plate}</b><br/>Status: ${v.status}`);
    });

    // Fit bounds to show all
    if (geofences.length > 0 || vehicles.length > 0) {
      const bounds = L.latLngBounds([
        ...geofences.map((g) => [g.centerLat, g.centerLng] as [number, number]),
        ...vehicles.map((v) => [v.lat, v.lng] as [number, number]),
      ]);
      map.fitBounds(bounds, { padding: [40, 40] });
    }

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full rounded-lg overflow-hidden"
      style={{ height: '500px' }}
      role="application"
      aria-label="Mapa de geofences"
    />
  );
}
