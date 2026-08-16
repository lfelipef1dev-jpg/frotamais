import { useEffect, useRef } from 'react';

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

export default function GeofenceMap({ geofences, vehicles }: { geofences: Geofence[]; vehicles: VehiclePos[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    import('leaflet').then((L) => {
      const map = L.map(containerRef.current!).setView([-15.7939, -47.8828], 4);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap',
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
      vehicles.forEach((v) => {
        const colors: Record<string, string> = {
          in_use: '#22C55E', maintenance: '#F97316', unavailable: '#EF4444', available: '#6B7280',
        };
        const marker = L.circleMarker([v.lat, v.lng], {
          radius: 6, color: colors[v.status] ?? '#6B7280', fillColor: colors[v.status] ?? '#6B7280', fillOpacity: 1, weight: 2,
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
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [geofences, vehicles]);

  return <div ref={containerRef} className="w-full h-[500px] rounded-xl border border-brand-border" role="application" aria-label="Mapa de geofences" />;
}
