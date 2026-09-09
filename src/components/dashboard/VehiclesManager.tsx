import { useState } from 'react';
import { Plus, Search, Trash2, Pencil } from 'lucide-react';
import CrudModal from './CrudModal';
import { num, dateBR, VEHICLE_TYPE_LABELS, FUEL_TYPE_LABELS, VEHICLE_STATUS_LABELS } from '../../lib/format';

interface Vehicle {
  id: string;
  plate: string;
  make: string;
  model: string;
  year: number;
  type: string;
  status: string;
  fuelType: string;
  currentOdometer: number;
  fuelLevel: number;
  assignedDriverId: string | null;
  driverName?: string;
}

const VEHICLE_FIELDS = [
  { name: 'plate', label: 'Placa', type: 'text' as const, required: true },
  { name: 'make', label: 'Marca', type: 'text' as const, required: true },
  { name: 'model', label: 'Modelo', type: 'text' as const, required: true },
  { name: 'year', label: 'Ano', type: 'number' as const, required: true, defaultValue: 2024 },
  { name: 'type', label: 'Tipo', type: 'select' as const, required: true, options: [
    { value: 'car', label: 'Carro' }, { value: 'truck', label: 'Caminhão' },
    { value: 'van', label: 'Van' }, { value: 'motorcycle', label: 'Moto' },
  ]},
  { name: 'fuelType', label: 'Combustível', type: 'select' as const, required: true, options: [
    { value: 'gasoline', label: 'Gasolina' }, { value: 'flex', label: 'Flex' },
    { value: 'diesel', label: 'Diesel' }, { value: 'electric', label: 'Elétrico' },
  ]},
  { name: 'status', label: 'Status', type: 'select' as const, required: true, options: [
    { value: 'available', label: 'Disponível' }, { value: 'in_use', label: 'Em rota' },
    { value: 'maintenance', label: 'Manutenção' }, { value: 'unavailable', label: 'Indisponível' },
  ]},
  { name: 'currentOdometer', label: 'Odômetro (km)', type: 'number' as const, defaultValue: 0 },
  { name: 'fuelLevel', label: 'Nível de combustível (%)', type: 'number' as const, defaultValue: 100 },
];

export default function VehiclesManager({ initialVehicles }: { initialVehicles: Vehicle[] }) {
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Vehicle | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = vehicles.filter((v) => {
    if (statusFilter !== 'all' && v.status !== statusFilter) return false;
    const q = search.toLowerCase();
    if (q && !v.plate.toLowerCase().includes(q) && !v.make.toLowerCase().includes(q) && !v.model.toLowerCase().includes(q)) return false;
    return true;
  });

  const saveVehicle = async (data: Record<string, any>) => {
    const url = editing ? `/api/vehicles/${editing.id}` : '/api/vehicles';
    const res = await fetch(url, {
      method: editing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (json.ok) {
      window.location.reload();
    }
  };

  const deleteVehicle = async (id: string) => {
    await fetch(`/api/vehicles/${id}`, { method: 'DELETE' });
    setVehicles((prev) => prev.filter((v) => v.id !== id));
    setDeleteId(null);
  };

  const statusLabels: Record<string, string> = {
    in_use: 'Em rota', maintenance: 'Manutenção', unavailable: 'Indisponível', available: 'Disponível',
  };
  const statusColors: Record<string, string> = {
    in_use: 'bg-green-100 text-green-700', maintenance: 'bg-orange-100 text-orange-700',
    unavailable: 'bg-red-100 text-red-700', available: 'bg-slate-100 text-slate-700',
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-light" aria-hidden="true" />
          <input
            type="text"
            placeholder="Buscar por placa, marca ou modelo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-brand-border bg-white pl-9 pr-3 py-2.5 text-sm text-brand-text focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:border-brand-primary outline-none transition"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-brand-border bg-white px-3 py-2.5 text-sm text-brand-text focus-visible:ring-2 focus-visible:ring-brand-primary outline-none transition"
        >
          <option value="all">Todos os status</option>
          <option value="available">Disponível</option>
          <option value="in_use">Em rota</option>
          <option value="maintenance">Manutenção</option>
          <option value="unavailable">Indisponível</option>
        </select>
        <button
          onClick={() => { setEditing(null); setModalOpen(true); }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-primary text-white rounded-lg text-sm font-semibold hover:bg-brand-primary-600 transition min-h-12 shadow-sm"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          Adicionar veículo
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-brand-border overflow-x-auto shadow-sm">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-brand-text-secondary border-b border-brand-border bg-brand-bg">
              <th className="px-6 py-3.5 font-semibold">Placa</th>
              <th className="px-6 py-3.5 font-semibold">Veículo</th>
              <th className="px-6 py-3.5 font-semibold">Ano</th>
              <th className="px-6 py-3.5 font-semibold">Status</th>
              <th className="px-6 py-3.5 font-semibold">Motorista</th>
              <th className="px-6 py-3.5 font-semibold">Km</th>
              <th className="px-6 py-3.5 font-semibold">Combustível</th>
              <th className="px-6 py-3.5 font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((v) => (
              <tr key={v.id} className="border-b border-brand-border last:border-0 hover:bg-brand-bg/50 transition">
                <td className="px-6 py-3.5 font-semibold text-brand-text">
                  <a href={`/app/vehicles/${v.id}`} className="hover:text-brand-primary hover:underline">{v.plate}</a>
                </td>
                <td className="px-6 py-3.5 text-brand-text-secondary">{v.make} {v.model}</td>
                <td className="px-6 py-3.5 text-brand-text-secondary">{v.year}</td>
                <td className="px-6 py-3.5">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[v.status] ?? 'bg-slate-100 text-slate-700'}`}>
                    {statusLabels[v.status] ?? v.status}
                  </span>
                </td>
                <td className="px-6 py-3.5 text-brand-text-secondary">{v.driverName ?? '-'}</td>
                <td className="px-6 py-3.5 text-brand-text-secondary">{num(v.currentOdometer)} km</td>
                <td className="px-6 py-3.5 text-brand-text-secondary">{v.fuelLevel}%</td>
                <td className="px-6 py-3.5">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => { setEditing(v); setModalOpen(true); }}
                      className="inline-flex items-center gap-1 text-xs font-medium text-brand-primary hover:text-brand-primary-600 transition"
                      aria-label={`Editar ${v.plate}`}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Editar
                    </button>
                    <button
                      onClick={() => setDeleteId(v.id)}
                      className="inline-flex items-center gap-1 text-xs font-medium text-brand-danger hover:text-red-700 transition"
                      aria-label={`Remover ${v.plate}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remover
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="px-6 py-10 text-center text-brand-text-secondary">Nenhum veículo encontrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <CrudModal
        open={modalOpen}
        title={editing ? `Editar veículo ${editing.plate}` : 'Adicionar veículo'}
        submitLabel={editing ? 'Salvar alterações' : 'Salvar'}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        onSubmit={saveVehicle}
        initialValues={editing ?? undefined}
        fields={VEHICLE_FIELDS}
      />

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={() => setDeleteId(null)}>
          <div className="bg-white rounded-2xl border border-brand-border p-6 w-full max-w-sm shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-lg text-brand-text mb-2">Remover veículo?</h3>
            <p className="text-sm text-brand-text-secondary mb-5">Esta ação não pode ser desfeita.</p>
            <div className="flex gap-3">
              <button onClick={() => deleteVehicle(deleteId)} className="flex-1 rounded-lg bg-brand-danger px-4 py-2.5 font-semibold text-white hover:opacity-90 transition min-h-12">Remover</button>
              <button onClick={() => setDeleteId(null)} className="rounded-lg border border-brand-border px-4 py-2.5 font-medium text-brand-text hover:bg-brand-bg transition min-h-12">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
