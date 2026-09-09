const TZ = 'America/Sao_Paulo';

const brlFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const numFormatter = new Intl.NumberFormat('pt-BR');

/** Moeda brasileira: R$ 4.985,20 */
export function brl(value: number): string {
  return brlFormatter.format(value);
}

/** Número com separador de milhar: 128.500 */
export function num(value: number): string {
  return numFormatter.format(value);
}

/** Data: 16/08/2026 (sempre fuso de Brasília) */
export function dateBR(value: string | Date | number): string {
  return new Date(value).toLocaleDateString('pt-BR', { timeZone: TZ });
}

/** Data e hora: 16/08/2026 07:00 (sempre fuso de Brasília) */
export function dateTimeBR(value: string | Date | number): string {
  return new Date(value).toLocaleString('pt-BR', { timeZone: TZ });
}

/** Corrige termos sem acentuação vindos de dados legados do banco. */
const PT_FIXES: [RegExp, string][] = [
  [/\boleo\b/gi, 'óleo'],
  [/\bOleo\b/g, 'Óleo'],
  [/\bRevisao\b/g, 'Revisão'],
  [/\brevisao\b/g, 'revisão'],
  [/\bInspecao\b/g, 'Inspeção'],
  [/\binspecao\b/g, 'inspeção'],
  [/\bMecanica\b/g, 'Mecânica'],
  [/\bmecanica\b/g, 'mecânica'],
  [/\bVeiculo\b/g, 'Veículo'],
  [/\bveiculo\b/g, 'veículo'],
  [/\bmanutencao\b/gi, 'manutenção'],
  [/\bNivel\b/g, 'Nível'],
  [/\bnivel\b/g, 'nível'],
  [/\barea\b/g, 'área'],
  [/\bArea\b/g, 'Área'],
  [/\bConcessionaria\b/g, 'Concessionária'],
  [/\bconcessionaria\b/g, 'concessionária'],
  [/\bprevencao\b/gi, 'prevenção'],
  [/\bcombustivel\b/gi, 'combustível'],
  [/\bSubstituicao\b/g, 'Substituição'],
  [/\bsubstituicao\b/g, 'substituição'],
  // "ha" como verbo haver (há) — quase sempre erro de acento em pt-BR
  [/\bha\b(?=\s+\d|\s+mais|\s+cerca)/g, 'há'],
  // Cidades e nomes próprios comuns
  [/\bSao Paulo\b/g, 'São Paulo'],
  [/\bSao\b/g, 'São'],
  [/\bBrasilia\b/g, 'Brasília'],
  [/\bGoiania\b/g, 'Goiânia'],
  [/\bGoias\b/g, 'Goiás'],
  [/\bJoao\b/g, 'João'],
  [/\bPraca\b/g, 'Praça'],
  [/\bpraca\b/g, 'praça'],
  [/\bAvenida\b/g, 'Avenida'],
  [/\bAmericas\b/g, 'Américas'],
  [/\bBelem\b/g, 'Belém'],
  [/\bMaceio\b/g, 'Maceió'],
  [/\bCuritiba\b/g, 'Curitiba'],
  [/\bRecife\b/g, 'Recife'],
];

export function fixPt(text: string | null | undefined): string {
  if (!text) return text ?? '';
  let out = text;
  for (const [re, rep] of PT_FIXES) out = out.replace(re, rep);
  return out;
}

export const VEHICLE_TYPE_LABELS: Record<string, string> = {
  car: 'Carro',
  truck: 'Caminhão',
  van: 'Van',
  motorcycle: 'Moto',
};

export const FUEL_TYPE_LABELS: Record<string, string> = {
  gasoline: 'Gasolina',
  flex: 'Flex',
  diesel: 'Diesel',
  electric: 'Elétrico',
};

export const VEHICLE_STATUS_LABELS: Record<string, string> = {
  available: 'Disponível',
  in_use: 'Em rota',
  maintenance: 'Manutenção',
  unavailable: 'Indisponível',
};

export const TRIP_STATUS_LABELS: Record<string, string> = {
  scheduled: 'Agendada',
  in_progress: 'Em andamento',
  completed: 'Concluída',
  cancelled: 'Cancelada',
};

export const SEVERITY_LABELS: Record<string, string> = {
  critical: 'Crítico',
  high: 'Alto',
  medium: 'Médio',
  low: 'Baixo',
};

export const ALERT_TYPE_LABELS: Record<string, string> = {
  maintenance_due: 'Manutenção',
  low_fuel: 'Combustível baixo',
  geofence: 'Geofence',
  speeding: 'Excesso de velocidade',
};

export const SAFETY_EVENT_LABELS: Record<string, string> = {
  harsh_braking: 'Frenagem brusca',
  harsh_acceleration: 'Aceleração brusca',
  speeding: 'Excesso de velocidade',
  sharp_turn: 'Curva brusca',
  idle: 'Ociosidade',
};

export const GEOFENCE_TYPE_LABELS: Record<string, string> = {
  depot: 'Centro de distribuição',
  restricted: 'Área restrita',
  allowed: 'Área permitida',
  customer: 'Cliente',
};

export const MAINTENANCE_TYPE_LABELS: Record<string, string> = {
  oil_change: 'Troca de óleo',
  brake_service: 'Freios',
  inspection: 'Inspeção',
  tire_rotation: 'Pneus',
  general: 'Geral',
};

export const INSPECTION_TYPE_LABELS: Record<string, string> = {
  pre: 'Pré-viagem',
  post: 'Pós-viagem',
};
