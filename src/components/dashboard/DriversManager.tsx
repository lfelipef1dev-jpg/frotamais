import { useState } from 'react';
import { Plus, Search, Trash2, Pencil, User } from 'lucide-react';
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

const DRIVER_FIELDS = [
  { name: 'name', label: 'Nome completo', type: 'text' as const, required: true },
  { name: 'licenseNumber', label: 'CNH', type: 'text' as const, required: true },
  { name: 'licenseExpiry', label: 'Validade da CNH', type: 'date' as const, required: true },
  { name: 'phone', label: 'Telefone', type: 'text' as const, required: true },
  { name: 'status', label: 'Status', type: 'select' as const, required: true, options: [
    { value: 'active', label: 'Ativo' }, { value: 'inactive', label: 'Inativo' },
  ]},
];

export default function DriversManager({ initialDrivers }: { initialDrivers: Driver[] }) {
  const [drivers, setDrivers] = useState(initialDrivers);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Driver | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = drivers.filter((d) => {
    const q = search.toLowerCase();
    if (q && !d.name.toLowerCase().includes(q) && !d.phone.toLowerCase().includes(q) && !d.licenseNumber.toLowerCase().includes(q)) return false;
    return true;
  });

  const saveDriver = async (data: Record<string, any>) => {
    const url = editing ? `/api/drivers/${editing.id}` : '/api/drivers';
    const res = await fetch(url, {
      method: editing ? 'PUT' : 'POST',
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

  const scoreColor = (score: number) => {
    if (score >= 80) return 'text-brand-accent';
    if (score >= 50) return 'text-brand-warning';
    return 'text-brand-danger';
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-light" aria-hidden="true" />
          <input
            type="text"
            placeholder="Buscar por nome, telefone ou CNH..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-brand-border bg-white pl-9 pr-3 py-2.5 text-sm text-brand-text focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:border-brand-primary outline-none transition"
          />
        </div>
        <button
          onClick={() => { setEditing(null); setModalOpen(true); }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-primary text-white rounded-lg text-sm font-semibold hover:bg-brand-primary-600 transition min-h-12 shadow-sm"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          Adicionar motorista
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((d) => {
          const initials = d.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
          const score = d.calculatedScore ?? d.safetyScore;
          return (
            <div key={d.id} className="bg-white rounded-2xl p-5 border border-brand-border hover:border-brand-primary hover:shadow-md transition duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-primary to-brand-primary-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  {initials || <User className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <a href={`/app/drivers/${d.id}`} className="font-bold text-brand-text hover:text-brand-primary truncate block">{d.name}</a>
                  <p className="text-xs text-brand-text-secondary">{d.phone}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => { setEditing(d); setModalOpen(true); }}
                    className="text-brand-primary hover:text-brand-primary-600 transition p-1.5 rounded-lg hover:bg-brand-bg"
                    aria-label={`Editar ${d.name}`}
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteId(d.id)}
                    className="text-brand-danger hover:text-red-700 transition p-1.5 rounded-lg hover:bg-red-50"
                    aria-label={`Remover ${d.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="text-sm text-brand-text-secondary space-y-2">
                <p className="flex justify-between"><span>Score de segurança</span> <span className={`font-bold ${scoreColor(score)}`}>{score}/100</span></p>
                <p className="flex justify-between"><span>Viagens</span> <span className="font-semibold text-brand-text">{d.totalTrips}</span></p>
                <p className="flex justify-between"><span>Km total</span> <span className="font-semibold text-brand-text">{d.totalKm.toLocaleString('pt-BR')} km</span></p>
                <p className="flex justify-between"><span>CNH válida até</span> <span className="font-semibold text-brand-text">{new Date(d.licenseExpiry).toLocaleDateString('pt-BR')}</span></p>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p className="col-span-full text-center text-brand-text-secondary py-10">Nenhum motorista encontrado.</p>
        )}
      </div>

      <CrudModal
        open={modalOpen}
        title={editing ? `Editar ${editing.name}` : 'Adicionar motorista'}
        submitLabel={editing ? 'Salvar alterações' : 'Salvar'}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        onSubmit={saveDriver}
        initialValues={editing ? { ...editing, licenseExpiry: editing.licenseExpiry?.slice(0, 10) } : undefined}
        fields={DRIVER_FIELDS}
      />

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={() => setDeleteId(null)}>
          <div className="bg-white rounded-2xl border border-brand-border p-6 w-full max-w-sm shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-lg text-brand-text mb-2">Remover motorista?</h3>
            <p className="text-sm text-brand-text-secondary mb-5">Esta ação não pode ser desfeita.</p>
            <div className="flex gap-3">
              <button onClick={() => deleteDriver(deleteId)} className="flex-1 rounded-lg bg-brand-danger px-4 py-2.5 font-semibold text-white hover:opacity-90 transition min-h-12">Remover</button>
              <button onClick={() => setDeleteId(null)} className="rounded-lg border border-brand-border px-4 py-2.5 font-medium text-brand-text hover:bg-brand-bg transition min-h-12">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
