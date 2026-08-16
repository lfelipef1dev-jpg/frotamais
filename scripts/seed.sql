-- Seed ilustrativo do Frotamais — dados simulados brasileiros
-- Nenhum dado real. Placas, motoristas e CNHs sao ficticios.

-- Vehicles (8)
INSERT INTO vehicles (id, plate, make, model, year, type, status, fuel_type, current_odometer, fuel_level, current_lat, current_lng, assigned_driver_id, last_location_update) VALUES
  ('veh-0001', 'ABC-1234', 'Volkswagen', 'Gol 1.6 MSI', 2020, 'car', 'available', 'gasoline', 48750, 82, -23.5505, -46.6333, NULL, '2026-08-15T14:30:00.000Z'),
  ('veh-0002', 'BCD2E34', 'Fiat', 'Uno Attractive', 2019, 'car', 'in_use', 'flex', 62300, 45, -22.9068, -43.1729, 'drv-0001', '2026-08-16T09:15:00.000Z'),
  ('veh-0003', 'CDE-3456', 'Ford', 'Ranger XLT', 2021, 'truck', 'available', 'diesel', 31500, 90, -19.9167, -43.9345, NULL, '2026-08-16T08:00:00.000Z'),
  ('veh-0004', 'DEF4G56', 'Chevrolet', 'S10 LTZ', 2022, 'truck', 'maintenance', 'diesel', 27800, 30, -25.4284, -49.2733, NULL, '2026-08-14T17:45:00.000Z'),
  ('veh-0005', 'EFG-5678', 'Mercedes-Benz', 'Sprinter 415', 2023, 'van', 'available', 'diesel', 15600, 95, -30.0346, -51.2177, NULL, '2026-08-16T07:30:00.000Z'),
  ('veh-0006', 'FGH6H78', 'Iveco', 'Daily 35S14', 2021, 'van', 'in_use', 'diesel', 41200, 60, -12.9714, -38.5014, 'drv-0002', '2026-08-16T10:00:00.000Z'),
  ('veh-0007', 'GHI-7890', 'Scania', 'R 440', 2018, 'truck', 'available', 'diesel', 128500, 78, -3.7319, -38.5267, NULL, '2026-08-15T16:20:00.000Z'),
  ('veh-0008', 'HIJ8I90', 'Hyundai', 'HR 2.5 TCI', 2020, 'truck', 'unavailable', 'diesel', 54000, 12, -15.7939, -47.8828, NULL, '2026-08-13T11:10:00.000Z');

-- Drivers (6)
INSERT INTO drivers (id, name, license_number, license_expiry, phone, status, current_vehicle_id, safety_score, total_trips, total_km) VALUES
  ('drv-0001', 'Joao Carlos Silva', '01234567890', '2028-05-20T00:00:00.000Z', '+55 11 91234-5678', 'active', 'veh-0002', 95, 142, 28450),
  ('drv-0002', 'Maria Fernanda Lima', '09876543210', '2027-11-15T00:00:00.000Z', '+55 21 98765-4321', 'active', 'veh-0006', 98, 98, 19500),
  ('drv-0003', 'Pedro Henrique Souza', '05544332211', '2029-03-10T00:00:00.000Z', '+55 31 99887-7665', 'active', NULL, 88, 210, 42100),
  ('drv-0004', 'Ana Paula Ribeiro', '01122334455', '2026-12-05T00:00:00.000Z', '+55 41 96655-4433', 'active', NULL, 92, 76, 15200),
  ('drv-0005', 'Roberto Almeida Costa', '07788990011', '2030-07-22T00:00:00.000Z', '+55 51 93322-1100', 'inactive', NULL, 100, 0, 0),
  ('drv-0006', 'Fernanda Gomes Oliveira', '06655443322', '2028-09-18T00:00:00.000Z', '+55 71 94433-2211', 'active', NULL, 96, 55, 11000);

-- Trips (6)
INSERT INTO trips (id, vehicle_id, driver_id, status, start_address, start_lat, start_lng, end_address, end_lat, end_lng, started_at, completed_at, distance_km, duration_minutes, fuel_used_liters) VALUES
  ('trp-0001', 'veh-0002', 'drv-0001', 'completed', 'Avenida Paulista, 1000, Sao Paulo, SP', -23.5617, -46.656, 'Rua das Laranjeiras, 300, Rio de Janeiro, RJ', -22.9284, -43.1762, '2026-08-14T08:00:00.000Z', '2026-08-14T13:30:00.000Z', 430, 330, 38.5),
  ('trp-0002', 'veh-0006', 'drv-0002', 'completed', 'Rua Augusta, 500, Sao Paulo, SP', -23.5552, -46.6582, 'Praca da Liberdade, Belo Horizonte, MG', -19.9321, -43.938, '2026-08-15T06:30:00.000Z', '2026-08-15T12:00:00.000Z', 585, 330, 52),
  ('trp-0003', 'veh-0003', 'drv-0003', 'completed', 'Rua 24 Horas, Curitiba, PR', -25.441, -49.2768, 'Avenida Beira-Mar, Florianopolis, SC', -27.5954, -48.548, '2026-08-13T09:00:00.000Z', '2026-08-13T15:45:00.000Z', 300, 405, 42),
  ('trp-0004', 'veh-0005', 'drv-0004', 'completed', 'Avenida Boa Viagem, Recife, PE', -8.1255, -34.9009, 'Praia de Iracema, Fortaleza, CE', -3.7183, -38.5427, '2026-08-12T05:00:00.000Z', '2026-08-12T13:20:00.000Z', 730, 500, 85),
  ('trp-0005', 'veh-0007', 'drv-0003', 'in_progress', 'Rodovia Presidente Dutra, Sao Paulo, SP', -23.5336, -46.6253, 'Avenida das Americas, Rio de Janeiro, RJ', -23.0004, -43.3657, '2026-08-16T06:00:00.000Z', NULL, 280, NULL, NULL),
  ('trp-0006', 'veh-0001', 'drv-0006', 'completed', 'Setor Comercial Sul, Brasilia, DF', -15.7934, -47.8829, 'Avenida Goias, Goiania, GO', -16.6869, -49.2648, '2026-08-11T07:00:00.000Z', '2026-08-11T11:30:00.000Z', 210, 270, 16.8);

-- Maintenance (4)
INSERT INTO maintenance (id, vehicle_id, type, description, cost, performed_at, performed_by, next_due_km, next_due_date) VALUES
  ('mnt-0001', 'veh-0004', 'oil_change', 'Troca de oleo lubrificante e filtro', 450.90, '2026-08-14T08:00:00.000Z', 'Auto Mecanica Brasil', 33000, '2026-11-14T00:00:00.000Z'),
  ('mnt-0002', 'veh-0002', 'tire_change', 'Substituicao dos quatro pneus', 1850.00, '2026-08-10T10:00:00.000Z', 'PneuCenter Sao Paulo', 70000, '2027-02-10T00:00:00.000Z'),
  ('mnt-0003', 'veh-0007', 'brake_service', 'Revisao e troca de pastilhas de freio', 920.50, '2026-08-05T13:00:00.000Z', 'Scania Service Center', 135000, '2026-12-05T00:00:00.000Z'),
  ('mnt-0004', 'veh-0006', 'inspection', 'Inspecao geral e ajustes preventivos', 320.00, '2026-08-01T09:00:00.000Z', 'Iveco Concessionaria BH', 45000, '2026-11-01T00:00:00.000Z');

-- Fuel logs (6)
INSERT INTO fuel_logs (id, vehicle_id, date, odometer, liters, cost, station) VALUES
  ('ful-0001', 'veh-0001', '2026-08-15T09:00:00.000Z', 48680, 42.5, 287.70, 'Shell - Sao Paulo, SP'),
  ('ful-0002', 'veh-0002', '2026-08-14T07:30:00.000Z', 62080, 38.0, 257.50, 'Ipiranga - Rio de Janeiro, RJ'),
  ('ful-0003', 'veh-0003', '2026-08-13T08:45:00.000Z', 31300, 55.0, 412.50, 'BR - Curitiba, PR'),
  ('ful-0004', 'veh-0005', '2026-08-12T06:00:00.000Z', 15400, 72.0, 540.00, 'Petrobras - Recife, PE'),
  ('ful-0005', 'veh-0006', '2026-08-11T07:15:00.000Z', 41050, 45.0, 337.50, 'Shell - Salvador, BA'),
  ('ful-0006', 'veh-0007', '2026-08-10T05:30:00.000Z', 128200, 420.0, 3150.00, 'Ipiranga - Porto Alegre, RS');

-- Alerts (4)
INSERT INTO alerts (id, vehicle_id, type, severity, details, triggered_at, resolved_at) VALUES
  ('alr-0001', 'veh-0004', 'maintenance_due', 'high', 'Veiculo agendado para manutencao preventiva de freios', '2026-08-16T07:00:00.000Z', NULL),
  ('alr-0002', 'veh-0002', 'low_fuel', 'medium', 'Nivel de combustivel abaixo de 50% durante viagem ativa', '2026-08-16T09:30:00.000Z', '2026-08-16T10:15:00.000Z'),
  ('alr-0003', 'veh-0008', 'geofence', 'low', 'Veiculo permanece fora da area autorizada ha mais de 72 horas', '2026-08-15T08:00:00.000Z', NULL),
  ('alr-0004', 'veh-0007', 'speeding', 'critical', 'Excesso de velocidade detectado na BR-116, velocidade 95 km/h', '2026-08-16T08:45:00.000Z', '2026-08-16T09:00:00.000Z');

-- Safety events (10) — base para calculo real do safety score
INSERT INTO safety_events (id, driver_id, vehicle_id, type, severity, speed, speed_limit, lat, lng, occurred_at) VALUES
  ('sev-0001', 'drv-0001', 'veh-0002', 'speeding', 'medium', 95, 80, -22.9, -43.17, '2026-08-14T10:30:00.000Z'),
  ('sev-0002', 'drv-0001', 'veh-0002', 'harsh_braking', 'low', NULL, NULL, -22.95, -43.20, '2026-08-14T11:15:00.000Z'),
  ('sev-0003', 'drv-0002', 'veh-0006', 'harsh_acceleration', 'low', NULL, NULL, -19.9, -43.93, '2026-08-15T08:00:00.000Z'),
  ('sev-0004', 'drv-0003', 'veh-0003', 'speeding', 'high', 110, 80, -25.5, -49.27, '2026-08-13T14:00:00.000Z'),
  ('sev-0005', 'drv-0003', 'veh-0007', 'speeding', 'critical', 95, 60, -23.0, -43.36, '2026-08-16T08:45:00.000Z'),
  ('sev-0006', 'drv-0003', 'veh-0003', 'harsh_cornering', 'medium', NULL, NULL, -27.5, -48.54, '2026-08-13T15:00:00.000Z'),
  ('sev-0007', 'drv-0004', 'veh-0005', 'harsh_braking', 'low', NULL, NULL, -3.7, -38.54, '2026-08-12T12:00:00.000Z'),
  ('sev-0008', 'drv-0006', 'veh-0001', 'speeding', 'low', 85, 80, -16.6, -49.26, '2026-08-11T10:00:00.000Z'),
  ('sev-0009', 'drv-0001', 'veh-0002', 'harsh_cornering', 'low', NULL, NULL, -22.92, -43.18, '2026-08-14T12:00:00.000Z'),
  ('sev-0010', 'drv-0002', 'veh-0006', 'speeding', 'low', 88, 80, -19.92, -43.94, '2026-08-15T09:30:00.000Z');

-- Inspections (8) — DVIR pre e pos viagem
INSERT INTO inspections (id, vehicle_id, driver_id, type, status, defects, notes, odometer, performed_at) VALUES
  ('ins-0001', 'veh-0002', 'drv-0001', 'pre', 'approved', NULL, 'Veiculo em condicoes adequadas para viagem', 62080, '2026-08-14T07:45:00.000Z'),
  ('ins-0002', 'veh-0002', 'drv-0001', 'post', 'approved', NULL, 'Sem danos apos viagem Sao Paulo-Rio', 62300, '2026-08-14T13:35:00.000Z'),
  ('ins-0003', 'veh-0006', 'drv-0002', 'pre', 'approved', NULL, 'Pneus e luzes verificados', 41050, '2026-08-15T06:20:00.000Z'),
  ('ins-0004', 'veh-0003', 'drv-0003', 'pre', 'failed', 'Farol direito nao funciona; pneu dianteiro desgastado', 'Necessita reparo antes de viagem', 31300, '2026-08-13T08:50:00.000Z'),
  ('ins-0005', 'veh-0005', 'drv-0004', 'pre', 'approved', NULL, 'Tudo OK para viagem longa', 15400, '2026-08-12T05:45:00.000Z'),
  ('ins-0006', 'veh-0007', 'drv-0003', 'pre', 'approved', NULL, 'Caminhao em ordem', 128200, '2026-08-16T05:50:00.000Z'),
  ('ins-0007', 'veh-0001', 'drv-0006', 'post', 'approved', NULL, 'Veiculo retornou sem avarias', 48750, '2026-08-11T11:40:00.000Z'),
  ('ins-0008', 'veh-0004', 'drv-0004', 'pre', 'failed', 'Vazamento de oleo detectado; freios com ruido', 'Encaminhado para manutencao', 27800, '2026-08-14T07:30:00.000Z');

-- Geofences (3) — areas de controle
INSERT INTO geofences (id, name, type, center_lat, center_lng, radius, color, active, created_at) VALUES
  ('geo-0001', 'Centro de Distribuicao SP', 'depot', -23.5617, -46.656, 500, '#4CAF50', 1, '2026-08-01T00:00:00.000Z'),
  ('geo-0002', 'Area Restrita Centro RJ', 'restricted', -22.9068, -43.1729, 300, '#F44336', 1, '2026-08-01T00:00:00.000Z'),
  ('geo-0003', 'Hub Logistico BH', 'depot', -19.9167, -43.9345, 800, '#2196F3', 1, '2026-08-01T00:00:00.000Z');
