import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  solveVRP,
  type Location,
  type Vehicle,
} from '../../lib/routing';

interface RouteStop {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

interface RouteVehicle {
  id: string;
  name: string;
}

interface RoutePlannerProps {
  stops: RouteStop[];
  vehicles: RouteVehicle[];
  depot?: RouteStop;
}

const ROUTE_COLORS = [
  '#3b82f6',
  '#ef4444',
  '#22c55e',
  '#f59e0b',
  '#8b5cf6',
  '#ec4899',
];

export default function RoutePlanner({ stops, vehicles, depot }: RoutePlannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const [result, setResult] = useState<ReturnType<typeof solveVRP> | null>(null);
  const [calculating, setCalculating] = useState(false);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [-14.235, -51.9253],
      zoom: 4,
      scrollWheelZoom: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  const calculateRoutes = () => {
    setCalculating(true);

    setTimeout(() => {
      const locations: Location[] = stops.map((s) => ({
        id: s.id,
        lat: s.lat,
        lng: s.lng,
        name: s.name,
      }));

      const vrpVehicles: Vehicle[] = vehicles.map((v) => ({ id: v.id, name: v.name }));
      const depotLocation: Location | undefined = depot
        ? { id: depot.id, lat: depot.lat, lng: depot.lng, name: depot.name }
        : undefined;

      const vrpResult = solveVRP(locations, vrpVehicles, {
        depot: depotLocation,
        useTwoOpt: true,
        twoOptIterations: 50,
      });

      setResult(vrpResult);
      renderRoutes(vrpResult);
      setCalculating(false);
    }, 50);
  };

  const renderRoutes = (vrpResult: ReturnType<typeof solveVRP>) => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    map.eachLayer((layer) => {
      if (layer instanceof L.Polyline || layer instanceof L.Marker) {
        if (!(layer instanceof L.TileLayer)) {
          map.removeLayer(layer);
        }
      }
    });

    vrpResult.routes.forEach((routeData, index) => {
      const color = ROUTE_COLORS[index % ROUTE_COLORS.length];
      const coords = routeData.route.orderedLocations.map((l) => [l.lat, l.lng]) as [number, number][];

      if (coords.length > 1) {
        L.polyline(coords, { color, weight: 3, opacity: 0.8 }).addTo(map);
      }

      routeData.route.orderedLocations.forEach((loc, i) => {
        const isStart = i === 0;
        const isEnd = i === routeData.route.orderedLocations.length - 1;

        const icon = L.divIcon({
          className: 'route-marker',
          html: `<div style="
            background: ${isStart ? '#22c55e' : isEnd ? '#ef4444' : color};
            width: ${isStart || isEnd ? '20px' : '14px'};
            height: ${isStart || isEnd ? '20px' : '14px'};
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          "></div>`,
          iconSize: isStart || isEnd ? [20, 20] : [14, 14],
          iconAnchor: isStart || isEnd ? [10, 10] : [7, 7],
        });

        L.marker([loc.lat, loc.lng], { icon })
          .addTo(map)
          .bindPopup(`<strong>${loc.name || loc.id}</strong><br>${isStart ? 'Inicio' : isEnd ? 'Fim' : `Parada ${i}`}`);
      });

      if (coords.length > 0) {
        const bounds = L.latLngBounds(coords);
        map.fitBounds(bounds, { padding: [40, 40] });
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="font-bold text-brand-text">Roteirizacao VRP</h3>
          <p className="text-sm text-brand-text-secondary">
            Algoritmo Nearest Neighbor + refinamento 2-opt. Distancias haversine reais.
          </p>
        </div>
        <button
          type="button"
          onClick={calculateRoutes}
          disabled={calculating}
          className="rounded-lg bg-brand-accent px-4 py-2.5 font-semibold text-brand-bg transition hover:bg-brand-accent-hover disabled:opacity-60 min-h-12"
        >
          {calculating ? 'Calculando...' : 'Calcular rotas otimizadas'}
        </button>
      </div>

      <div
        ref={containerRef}
        className="w-full rounded-lg overflow-hidden border border-brand-border"
        style={{ height: '500px' }}
      />

      {result && (
        <div className="bg-brand-surface border border-brand-border rounded-lg p-4">
          <h4 className="font-semibold text-brand-text mb-3">Resultado da roteirizacao</h4>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {result.routes.map((r, i) => (
              <div key={r.vehicle.id} className="border border-brand-border rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="inline-block w-3 h-3 rounded-full"
                    style={{ background: ROUTE_COLORS[i % ROUTE_COLORS.length] }}
                    aria-hidden="true"
                  />
                  <span className="font-medium text-sm text-brand-text">{r.vehicle.name}</span>
                </div>
                <p className="text-xs text-brand-text-secondary">
                  {r.route.orderedLocations.length} paradas
                </p>
                <p className="text-xs text-brand-text-secondary">
                  {r.route.totalDistanceKm.toFixed(1)} km total
                </p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm font-semibold text-brand-text">
            Distancia total da frota: {result.totalDistanceKm.toFixed(1)} km
          </p>
        </div>
      )}
    </div>
  );
}
