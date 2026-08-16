import { useState } from 'react';
import CrudModal from './CrudModal';

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

export default function VehiclesManager({ initialVehicles }: { initialVehicles: Vehicle[] }) {
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = vehicles.filter((v) => {
    if (statusFilter !== 'all' && v.status !== statusFilter) return false;
    const q = search.toLowerCase();
    if (q && !v.plate.toLowerCase().includes(q) && !v.make.toLowerCase().includes(q) && !v.model.toLowerCase().includes(q)) return false;
    return true;
  });

  const addVehicle = async (data: Record<string, any>) => {
    const res = await fetch('/api/vehicles', {
      method: 'POST',
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
    in_use: 'Em rota', maintenance: 'Manutencao', unavailable: 'Indisponivel', available: 'Disponivel',
  };
  const statusColors: Record<string, string> = {
    in_use: 'bg-green-100 text-green-700', maintenance: 'bg-orange-100 text-orange-700',
    unavailable: 'bg-red-100 text-red-700', available: 'bg-slate-100 text-slate-700',
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <input
          type="text"
          placeholder="Buscar por placa, marca ou modelo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-48 rounded-lg border border-brand-border bg-brand-surface px-3 py-2 text-sm text-brand-text focus-visible:ring-2 focus-visible:ring-brand-accent outline-none"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-brand-border bg-brand-surface px-3 py-2 text-sm text-brand-text focus-visible:ring-2 focus-visible:ring-brand-accent outline-none"
        >
          <option value="all">Todos os status</option>
          <option value="available">Disponivel</option>
          <option value="in_use">Em rota</option>
          <option value="maintenance">Manutencao</option>
          <option value="unavailable">Indisponivel</option>
        </select>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-semibold hover:bg-brand-primary-600 transition min-h-12"
        >
          <svg className="w-4 h-4" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" /></svg>
          Adicionar veiculo
        </button>
      </div>

      <div className="bg-brand-surface rounded-xl border border-brand-border overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-brand-text-secondary border-b border-brand-border bg-brand-bg">
              <th className="px-6 py-3 font-medium">Placa</th>
              <th className="px-6 py-3 font-medium">Veiculo</th>
              <th className="px-6 py-3 font-medium">Ano</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Motorista</th>
              <th className="px-6 py-3 font-medium">Km</th>
              <th className="px-6 py-3 font-medium">Combustivel</th>
              <th className="px-6 py-3 font-medium">Acoes</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((v) => (
              <tr key={v.id} className="border-b border-brand-border last:border-0 hover:bg-brand-bg transition">
                <td className="px-6 py-3 font-medium text-brand-text">
                  <a href={`/app/vehicles/${v.id}`} className="hover:text-brand-accent">{v.plate}</a>
                </td>
                <td className="px-6 py-3 text-brand-text-secondary">{v.make} {v.model}</td>
                <td className="px-6 py-3 text-brand-text-secondary">{v.year}</td>
                <td className="px-6 py-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${statusColors[v.status] ?? 'bg-slate-100 text-slate-700'}`}>
                    {statusLabels[v.status] ?? v.status}
                  </span>
                </td>
                <td className="px-6 py-3 text-brand-text-secondary">{v.driverName ?? '-'}</td>
                <td className="px-6 py-3 text-brand-text-secondary">{v.currentOdometer.toLocaleString('pt-BR')} km</td>
                <td className="px-6 py-3 text-brand-text-secondary">{v.fuelLevel}%</td>
                <td className="px-6 py-3">
                  <button
                    onClick={() => setDeleteId(v.id)}
                    className="text-xs text-red-400 hover:text-red-300 transition"
                    aria-label={`Remover ${v.plate}`}
                  >
                    Remover
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="px-6 py-8 text-center text-brand-text-secondary">Nenhum veiculo encontrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <CrudModal
        open={modalOpen}
        title="Adicionar veiculo"
        onClose={() => setModalOpen(false)}
        onSubmit={addVehicle}
        fields={[
          { name: 'plate', label: 'Placa', type: 'text', required: true },
          { name: 'make', label: 'Marca', type: 'text', required: true },
          { name: 'model', label: 'Modelo', type: 'text', required: true },
          { name: 'year', label: 'Ano', type: 'number', required: true, defaultValue: 2024 },
          { name: 'type', label: 'Tipo', type: 'select', required: true, options: [
            { value: 'car', label: 'Carro' }, { value: 'truck', label: 'Caminhao' },
            { value: 'van', label: 'Van' }, { value: 'motorcycle', label: 'Moto' },
          ]},
          { name: 'fuelType', label: 'Combustivel', type: 'select', required: true, options: [
            { value: 'gasoline', label: 'Gasolina' }, { value: 'flex', label: 'Flex' },
            { value: 'diesel', label: 'Diesel' }, { value: 'electric', label: 'Eletrico' },
          ]},
          { name: 'status', label: 'Status', type: 'select', required: true, options: [
            { value: 'available', label: 'Disponivel' }, { value: 'in_use', label: 'Em rota' },
            { value: 'maintenance', label: 'Manutencao' }, { value: 'unavailable', label: 'Indisponivel' },
          ]},
          { name: 'currentOdometer', label: 'Odometro (km)', type: 'number', defaultValue: 0 },
          { name: 'fuelLevel', label: 'Nivel combustivel (%)', type: 'number', defaultValue: 100 },
        ]}
      />

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setDeleteId(null)}>
          <div className="bg-brand-surface rounded-xl border border-brand-border p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-lg text-brand-text mb-2">Remover veiculo?</h3>
            <p className="text-sm text-brand-text-secondary mb-4">Esta acao nao pode ser desfeita.</p>
            <div className="flex gap-3">
              <button onClick={() => deleteVehicle(deleteId)} className="flex-1 rounded-lg bg-red-500 px-4 py-2.5 font-semibold text-white hover:bg-red-600 transition min-h-12">Remover</button>
              <button onClick={() => setDeleteId(null)} className="rounded-lg border border-brand-border px-4 py-2.5 font-medium text-brand-text hover:bg-brand-bg transition min-h-12">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
