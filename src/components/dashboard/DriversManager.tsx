import { useState } from 'react';
import CrudModal from './CrudModal';

interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  licenseExpiry: string;
  phone: string;
  status: string;
  safetyScore: number;
  totalTrips: number;
  totalKm: number;
  calculatedScore?: number;
}

export default function DriversManager({ initialDrivers }: { initialDrivers: Driver[] }) {
  const [drivers, setDrivers] = useState(initialDrivers);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = drivers.filter((d) => {
    const q = search.toLowerCase();
    if (q && !d.name.toLowerCase().includes(q) && !d.phone.toLowerCase().includes(q) && !d.licenseNumber.toLowerCase().includes(q)) return false;
    return true;
  });

  const addDriver = async (data: Record<string, any>) => {
    const res = await fetch('/api/drivers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (json.ok) window.location.reload();
  };

  const deleteDriver = async (id: string) => {
    await fetch(`/api/drivers/${id}`, { method: 'DELETE' });
    setDrivers((prev) => prev.filter((d) => d.id !== id));
    setDeleteId(null);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <input
          type="text"
          placeholder="Buscar por nome, telefone ou CNH..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-48 rounded-lg border border-brand-border bg-brand-surface px-3 py-2 text-sm text-brand-text focus-visible:ring-2 focus-visible:ring-brand-accent outline-none"
        />
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-semibold hover:bg-brand-primary-600 transition min-h-12"
        >
          <svg className="w-4 h-4" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" /></svg>
          Adicionar motorista
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((d) => (
          <div key={d.id} className="bg-brand-surface rounded-xl p-5 border border-brand-border hover:border-brand-primary transition">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold">
                {d.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
              </div>
              <div className="flex-1">
                <a href={`/app/drivers/${d.id}`} className="font-bold text-brand-text hover:text-brand-accent">{d.name}</a>
                <p className="text-xs text-brand-text-secondary">{d.phone}</p>
              </div>
              <button
                onClick={() => setDeleteId(d.id)}
                className="text-xs text-red-400 hover:text-red-300 transition"
                aria-label={`Remover ${d.name}`}
              >
                Remover
              </button>
            </div>
            <div className="text-sm text-brand-text-secondary space-y-1">
              <p>Score: <span className="font-semibold text-brand-text">{d.calculatedScore ?? d.safetyScore}/100</span></p>
              <p>Viagens: {d.totalTrips} | {d.totalKm.toLocaleString('pt-BR')} km</p>
              <p>CNH: {new Date(d.licenseExpiry).toLocaleDateString('pt-BR')}</p>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full text-center text-brand-text-secondary py-8">Nenhum motorista encontrado.</p>
        )}
      </div>

      <CrudModal
        open={modalOpen}
        title="Adicionar motorista"
        onClose={() => setModalOpen(false)}
        onSubmit={addDriver}
        fields={[
          { name: 'name', label: 'Nome completo', type: 'text', required: true },
          { name: 'licenseNumber', label: 'CNH', type: 'text', required: true },
          { name: 'licenseExpiry', label: 'Validade CNH', type: 'date', required: true },
          { name: 'phone', label: 'Telefone', type: 'text', required: true },
          { name: 'status', label: 'Status', type: 'select', required: true, options: [
            { value: 'active', label: 'Ativo' }, { value: 'inactive', label: 'Inativo' },
          ]},
        ]}
      />

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setDeleteId(null)}>
          <div className="bg-brand-surface rounded-xl border border-brand-border p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-lg text-brand-text mb-2">Remover motorista?</h3>
            <p className="text-sm text-brand-text-secondary mb-4">Esta acao nao pode ser desfeita.</p>
            <div className="flex gap-3">
              <button onClick={() => deleteDriver(deleteId)} className="flex-1 rounded-lg bg-red-500 px-4 py-2.5 font-semibold text-white hover:bg-red-600 transition min-h-12">Remover</button>
              <button onClick={() => setDeleteId(null)} className="rounded-lg border border-brand-border px-4 py-2.5 font-medium text-brand-text hover:bg-brand-bg transition min-h-12">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
