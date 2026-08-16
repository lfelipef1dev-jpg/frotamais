export const v1 = crypto.randomUUID();
export const v2 = crypto.randomUUID();
export const v3 = crypto.randomUUID();
export const v4 = crypto.randomUUID();
export const v5 = crypto.randomUUID();
export const v6 = crypto.randomUUID();
export const v7 = crypto.randomUUID();
export const v8 = crypto.randomUUID();

export const d1 = crypto.randomUUID();
export const d2 = crypto.randomUUID();
export const d3 = crypto.randomUUID();
export const d4 = crypto.randomUUID();
export const d5 = crypto.randomUUID();
export const d6 = crypto.randomUUID();

export const vehiclesData = [
  { id: v1, plate: 'ABC-1234', make: 'Volkswagen', model: 'Gol 1.6 MSI', year: 2020, type: 'car', status: 'available', fuelType: 'gasoline', currentOdometer: 48750, fuelLevel: 82, currentLat: -23.5505, currentLng: -46.6333, lastLocationUpdate: '2026-08-15T14:30:00.000Z' },
  { id: v2, plate: 'BCD2E34', make: 'Fiat', model: 'Uno Attractive', year: 2019, type: 'car', status: 'in_use', fuelType: 'flex', currentOdometer: 62300, fuelLevel: 45, currentLat: -22.9068, currentLng: -43.1729, assignedDriverId: d1, lastLocationUpdate: '2026-08-16T09:15:00.000Z' },
  { id: v3, plate: 'CDE-3456', make: 'Ford', model: 'Ranger XLT', year: 2021, type: 'truck', status: 'available', fuelType: 'diesel', currentOdometer: 31500, fuelLevel: 90, currentLat: -19.9167, currentLng: -43.9345, lastLocationUpdate: '2026-08-16T08:00:00.000Z' },
  { id: v4, plate: 'DEF4G56', make: 'Chevrolet', model: 'S10 LTZ', year: 2022, type: 'truck', status: 'maintenance', fuelType: 'diesel', currentOdometer: 27800, fuelLevel: 30, currentLat: -25.4284, currentLng: -49.2733, lastLocationUpdate: '2026-08-14T17:45:00.000Z' },
  { id: v5, plate: 'EFG-5678', make: 'Mercedes-Benz', model: 'Sprinter 415', year: 2023, type: 'van', status: 'available', fuelType: 'diesel', currentOdometer: 15600, fuelLevel: 95, currentLat: -30.0346, currentLng: -51.2177, lastLocationUpdate: '2026-08-16T07:30:00.000Z' },
  { id: v6, plate: 'FGH6H78', make: 'Iveco', model: 'Daily 35S14', year: 2021, type: 'van', status: 'in_use', fuelType: 'diesel', currentOdometer: 41200, fuelLevel: 60, currentLat: -12.9714, currentLng: -38.5014, assignedDriverId: d2, lastLocationUpdate: '2026-08-16T10:00:00.000Z' },
  { id: v7, plate: 'GHI-7890', make: 'Scania', model: 'R 440', year: 2018, type: 'truck', status: 'available', fuelType: 'diesel', currentOdometer: 128500, fuelLevel: 78, currentLat: -3.7319, currentLng: -38.5267, lastLocationUpdate: '2026-08-15T16:20:00.000Z' },
  { id: v8, plate: 'HIJ8I90', make: 'Hyundai', model: 'HR 2.5 TCI', year: 2020, type: 'truck', status: 'unavailable', fuelType: 'diesel', currentOdometer: 54000, fuelLevel: 12, currentLat: -15.7939, currentLng: -47.8828, lastLocationUpdate: '2026-08-13T11:10:00.000Z' },
];

export const driversData = [
  { id: d1, name: 'Joao Carlos Silva', licenseNumber: '01234567890', licenseExpiry: '2028-05-20T00:00:00.000Z', phone: '+55 11 91234-5678', status: 'active', currentVehicleId: v2, safetyScore: 95, totalTrips: 142, totalKm: 28450 },
  { id: d2, name: 'Maria Fernanda Lima', licenseNumber: '09876543210', licenseExpiry: '2027-11-15T00:00:00.000Z', phone: '+55 21 98765-4321', status: 'active', currentVehicleId: v6, safetyScore: 98, totalTrips: 98, totalKm: 19500 },
  { id: d3, name: 'Pedro Henrique Souza', licenseNumber: '05544332211', licenseExpiry: '2029-03-10T00:00:00.000Z', phone: '+55 31 99887-7665', status: 'active', safetyScore: 88, totalTrips: 210, totalKm: 42100 },
  { id: d4, name: 'Ana Paula Ribeiro', licenseNumber: '01122334455', licenseExpiry: '2026-12-05T00:00:00.000Z', phone: '+55 41 96655-4433', status: 'active', safetyScore: 92, totalTrips: 76, totalKm: 15200 },
  { id: d5, name: 'Roberto Almeida Costa', licenseNumber: '07788990011', licenseExpiry: '2030-07-22T00:00:00.000Z', phone: '+55 51 93322-1100', status: 'inactive', safetyScore: 100, totalTrips: 0, totalKm: 0 },
  { id: d6, name: 'Fernanda Gomes Oliveira', licenseNumber: '06655443322', licenseExpiry: '2028-09-18T00:00:00.000Z', phone: '+55 71 94433-2211', status: 'active', safetyScore: 96, totalTrips: 55, totalKm: 11000 },
];

export const tripsData = [
  { id: crypto.randomUUID(), vehicleId: v2, driverId: d1, status: 'completed', startAddress: 'Avenida Paulista, 1000, Sao Paulo, SP', startLat: -23.5617, startLng: -46.656, endAddress: 'Rua das Laranjeiras, 300, Rio de Janeiro, RJ', endLat: -22.9284, endLng: -43.1762, startedAt: '2026-08-14T08:00:00.000Z', completedAt: '2026-08-14T13:30:00.000Z', distanceKm: 430, durationMinutes: 330, fuelUsedLiters: 38.5 },
  { id: crypto.randomUUID(), vehicleId: v6, driverId: d2, status: 'completed', startAddress: 'Rua Augusta, 500, Sao Paulo, SP', startLat: -23.5552, startLng: -46.6582, endAddress: 'Praca da Liberdade, Belo Horizonte, MG', endLat: -19.9321, endLng: -43.938, startedAt: '2026-08-15T06:30:00.000Z', completedAt: '2026-08-15T12:00:00.000Z', distanceKm: 585, durationMinutes: 330, fuelUsedLiters: 52 },
  { id: crypto.randomUUID(), vehicleId: v3, driverId: d3, status: 'completed', startAddress: 'Rua 24 Horas, Curitiba, PR', startLat: -25.441, startLng: -49.2768, endAddress: 'Avenida Beira-Mar, Florianopolis, SC', endLat: -27.5954, endLng: -48.548, startedAt: '2026-08-13T09:00:00.000Z', completedAt: '2026-08-13T15:45:00.000Z', distanceKm: 300, durationMinutes: 405, fuelUsedLiters: 42 },
  { id: crypto.randomUUID(), vehicleId: v5, driverId: d4, status: 'completed', startAddress: 'Avenida Boa Viagem, Recife, PE', startLat: -8.1255, startLng: -34.9009, endAddress: 'Praia de Iracema, Fortaleza, CE', endLat: -3.7183, endLng: -38.5427, startedAt: '2026-08-12T05:00:00.000Z', completedAt: '2026-08-12T13:20:00.000Z', distanceKm: 730, durationMinutes: 500, fuelUsedLiters: 85 },
  { id: crypto.randomUUID(), vehicleId: v7, driverId: d3, status: 'in_progress', startAddress: 'Rodovia Presidente Dutra, Sao Paulo, SP', startLat: -23.5336, startLng: -46.6253, endAddress: 'Avenida das Americas, Rio de Janeiro, RJ', endLat: -23.0004, endLng: -43.3657, startedAt: '2026-08-16T06:00:00.000Z', distanceKm: 280 },
  { id: crypto.randomUUID(), vehicleId: v1, driverId: d6, status: 'completed', startAddress: 'Setor Comercial Sul, Brasilia, DF', startLat: -15.7934, startLng: -47.8829, endAddress: 'Avenida Goias, Goiania, GO', endLat: -16.6869, endLng: -49.2648, startedAt: '2026-08-11T07:00:00.000Z', completedAt: '2026-08-11T11:30:00.000Z', distanceKm: 210, durationMinutes: 270, fuelUsedLiters: 16.8 },
];

export const maintenanceData = [
  { id: crypto.randomUUID(), vehicleId: v4, type: 'oil_change', description: 'Troca de oleo lubrificante e filtro', cost: 450.9, performedAt: '2026-08-14T08:00:00.000Z', performedBy: 'Auto Mecanica Brasil', nextDueKm: 33000, nextDueDate: '2026-11-14T00:00:00.000Z' },
  { id: crypto.randomUUID(), vehicleId: v2, type: 'tire_change', description: 'Substituicao dos quatro pneus', cost: 1850, performedAt: '2026-08-10T10:00:00.000Z', performedBy: 'PneuCenter Sao Paulo', nextDueKm: 70000, nextDueDate: '2027-02-10T00:00:00.000Z' },
  { id: crypto.randomUUID(), vehicleId: v7, type: 'brake_service', description: 'Revisao e troca de pastilhas de freio', cost: 920.5, performedAt: '2026-08-05T13:00:00.000Z', performedBy: 'Scania Service Center', nextDueKm: 135000, nextDueDate: '2026-12-05T00:00:00.000Z' },
  { id: crypto.randomUUID(), vehicleId: v6, type: 'inspection', description: 'Inspecao geral e ajustes preventivos', cost: 320, performedAt: '2026-08-01T09:00:00.000Z', performedBy: 'Iveco Concessionaria BH', nextDueKm: 45000, nextDueDate: '2026-11-01T00:00:00.000Z' },
];

export const fuelLogsData = [
  { id: crypto.randomUUID(), vehicleId: v1, date: '2026-08-15T09:00:00.000Z', odometer: 48680, liters: 42.5, cost: 287.7, station: 'Shell - Sao Paulo, SP' },
  { id: crypto.randomUUID(), vehicleId: v2, date: '2026-08-14T07:30:00.000Z', odometer: 62080, liters: 38, cost: 257.5, station: 'Ipiranga - Rio de Janeiro, RJ' },
  { id: crypto.randomUUID(), vehicleId: v3, date: '2026-08-13T08:45:00.000Z', odometer: 31300, liters: 55, cost: 412.5, station: 'BR - Curitiba, PR' },
  { id: crypto.randomUUID(), vehicleId: v5, date: '2026-08-12T06:00:00.000Z', odometer: 15400, liters: 72, cost: 540, station: 'Petrobras - Recife, PE' },
  { id: crypto.randomUUID(), vehicleId: v6, date: '2026-08-11T07:15:00.000Z', odometer: 41050, liters: 45, cost: 337.5, station: 'Shell - Salvador, BA' },
  { id: crypto.randomUUID(), vehicleId: v7, date: '2026-08-10T05:30:00.000Z', odometer: 128200, liters: 420, cost: 3150, station: 'Ipiranga - Porto Alegre, RS' },
];

export const alertsData = [
  { id: crypto.randomUUID(), vehicleId: v4, type: 'maintenance_due', severity: 'high', details: 'Veiculo agendado para manutencao preventiva de freios', triggeredAt: '2026-08-16T07:00:00.000Z' },
  { id: crypto.randomUUID(), vehicleId: v2, type: 'low_fuel', severity: 'medium', details: 'Nivel de combustivel abaixo de 50% durante viagem ativa', triggeredAt: '2026-08-16T09:30:00.000Z', resolvedAt: '2026-08-16T10:15:00.000Z' },
  { id: crypto.randomUUID(), vehicleId: v8, type: 'geofence', severity: 'low', details: 'Veiculo permanece fora da area autorizada ha mais de 72 horas', triggeredAt: '2026-08-15T08:00:00.000Z' },
  { id: crypto.randomUUID(), vehicleId: v7, type: 'speeding', severity: 'critical', details: 'Excesso de velocidade detectado na BR-116, velocidade 95 km/h', triggeredAt: '2026-08-16T08:45:00.000Z', resolvedAt: '2026-08-16T09:00:00.000Z' },
];
