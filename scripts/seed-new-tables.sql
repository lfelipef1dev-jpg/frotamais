-- Seed apenas das novas tabelas (inspections e geofences)
-- As tabelas existentes (vehicles, drivers, etc) ja tem dados

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
