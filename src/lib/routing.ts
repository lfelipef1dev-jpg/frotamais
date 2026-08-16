export interface Location {
  id: string;
  lat: number;
  lng: number;
  name?: string;
}

export interface RouteSegment {
  from: Location;
  to: Location;
  distanceKm: number;
}

export interface RouteResult {
  orderedLocations: Location[];
  totalDistanceKm: number;
  segments: RouteSegment[];
}

export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const toRad = (deg: number) => deg * (Math.PI / 180);
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function distanceBetween(loc1: Location, loc2: Location): number {
  return haversineDistance(loc1.lat, loc1.lng, loc2.lat, loc2.lng);
}

export function nearestNeighborTSP(
  locations: Location[],
  startLocation?: Location
): RouteResult {
  if (locations.length === 0) {
    return { orderedLocations: [], totalDistanceKm: 0, segments: [] };
  }
  if (locations.length === 1) {
    return { orderedLocations: [locations[0]], totalDistanceKm: 0, segments: [] };
  }

  const unvisited = [...locations];
  const ordered: Location[] = [];
  const segments: RouteSegment[] = [];
  let totalDistance = 0;

  let current = startLocation
    ? unvisited.find((loc) => loc.id === startLocation.id) || unvisited.shift()!
    : unvisited.shift()!;
  ordered.push(current);

  while (unvisited.length > 0) {
    let nearestIndex = 0;
    let nearestDistance = Infinity;

    for (let i = 0; i < unvisited.length; i++) {
      const dist = distanceBetween(current, unvisited[i]);
      if (dist < nearestDistance) {
        nearestDistance = dist;
        nearestIndex = i;
      }
    }

    const next = unvisited.splice(nearestIndex, 1)[0];
    ordered.push(next);
    segments.push({ from: current, to: next, distanceKm: nearestDistance });
    totalDistance += nearestDistance;
    current = next;
  }

  return { orderedLocations: ordered, totalDistanceKm: totalDistance, segments };
}

function twoOptSwap(route: Location[], i: number, j: number): Location[] {
  return [
    ...route.slice(0, i),
    ...route.slice(i, j + 1).reverse(),
    ...route.slice(j + 1),
  ];
}

function calculateTotalDistance(route: Location[]): number {
  let total = 0;
  for (let i = 0; i < route.length - 1; i++) {
    total += distanceBetween(route[i], route[i + 1]);
  }
  return total;
}

export function twoOptImprovement(
  route: Location[],
  maxIterations = 100
): Location[] {
  if (route.length <= 3) return [...route];

  let bestRoute = [...route];
  let bestDistance = calculateTotalDistance(bestRoute);
  let improved = true;
  let iterations = 0;

  while (improved && iterations < maxIterations) {
    improved = false;
    iterations++;

    for (let i = 0; i < bestRoute.length - 1; i++) {
      for (let j = i + 1; j < bestRoute.length; j++) {
        const newRoute = twoOptSwap(bestRoute, i, j);
        const newDistance = calculateTotalDistance(newRoute);

        if (newDistance < bestDistance) {
          bestRoute = newRoute;
          bestDistance = newDistance;
          improved = true;
        }
      }
    }
  }

  return bestRoute;
}

export function solveTSP(
  locations: Location[],
  options: {
    startLocation?: Location;
    useTwoOpt?: boolean;
    twoOptIterations?: number;
  } = {}
): RouteResult {
  const { startLocation, useTwoOpt = true, twoOptIterations = 100 } = options;

  const initialResult = nearestNeighborTSP(locations, startLocation);
  let orderedLocations = initialResult.orderedLocations;

  if (useTwoOpt && locations.length > 3) {
    orderedLocations = twoOptImprovement(orderedLocations, twoOptIterations);
  }

  const segments: RouteSegment[] = [];
  let totalDistance = 0;

  for (let i = 0; i < orderedLocations.length - 1; i++) {
    const dist = distanceBetween(orderedLocations[i], orderedLocations[i + 1]);
    segments.push({
      from: orderedLocations[i],
      to: orderedLocations[i + 1],
      distanceKm: dist,
    });
    totalDistance += dist;
  }

  return { orderedLocations, totalDistanceKm: totalDistance, segments };
}

export interface Vehicle {
  id: string;
  name: string;
  startLocation?: Location;
}

export interface VRPRoute {
  vehicle: Vehicle;
  route: RouteResult;
}

export interface VRPResult {
  routes: VRPRoute[];
  totalDistanceKm: number;
}

export function clusterStopsByVehicle(
  locations: Location[],
  vehicles: Vehicle[]
): Map<Vehicle, Location[]> {
  const clusters = new Map<Vehicle, Location[]>();
  vehicles.forEach((v) => clusters.set(v, []));

  if (vehicles.length === 0) return clusters;

  if (vehicles.length >= locations.length) {
    locations.forEach((loc, i) => {
      clusters.get(vehicles[i % vehicles.length])!.push(loc);
    });
    return clusters;
  }

  const centroids: Location[] = vehicles.map((v, i) => {
    return v.startLocation || locations[i] || locations[0];
  });

  locations.forEach((loc) => {
    let nearestVehicle = vehicles[0];
    let nearestDistance = Infinity;

    vehicles.forEach((vehicle, i) => {
      const centroid = centroids[i] || locations[0];
      const dist = haversineDistance(loc.lat, loc.lng, centroid.lat, centroid.lng);
      if (dist < nearestDistance) {
        nearestDistance = dist;
        nearestVehicle = vehicle;
      }
    });

    clusters.get(nearestVehicle)!.push(loc);
  });

  return clusters;
}

export function solveVRP(
  locations: Location[],
  vehicles: Vehicle[],
  options: {
    depot?: Location;
    useTwoOpt?: boolean;
    twoOptIterations?: number;
  } = {}
): VRPResult {
  const { depot, useTwoOpt = true, twoOptIterations = 100 } = options;

  const clusters = clusterStopsByVehicle(locations, vehicles);
  const routes: VRPRoute[] = [];
  let totalDistance = 0;

  clusters.forEach((stops, vehicle) => {
    if (stops.length === 0) {
      routes.push({
        vehicle,
        route: { orderedLocations: [], totalDistanceKm: 0, segments: [] },
      });
      return;
    }

    const stopsWithDepot = depot ? [depot, ...stops] : stops;
    const startLocation = vehicle.startLocation || depot || stops[0];

    const routeResult = solveTSP(stopsWithDepot, {
      startLocation,
      useTwoOpt,
      twoOptIterations,
    });

    routes.push({ vehicle, route: routeResult });
    totalDistance += routeResult.totalDistanceKm;
  });

  return { routes, totalDistanceKm: totalDistance };
}
