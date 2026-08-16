import { useState, useEffect } from 'react';

interface AlertItem {
  id: string;
  vehicleId: string;
  type: string;
  severity: string;
  details: string;
  triggeredAt: string;
  resolvedAt: string | null;
  vehiclePlate?: string;
}

export default function AlertsManager({ initialAlerts }: { initialAlerts: AlertItem[] }) {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [filter, setFilter] = useState<'all' | 'pending' | 'resolved'>('all');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');

  const filtered = alerts.filter((a) => {
    if (filter === 'pending' && a.resolvedAt) return false;
    if (filter === 'resolved' && !a.resolvedAt) return false;
    if (severityFilter !== 'all' && a.severity !== severityFilter) return false;
    return true;
  });

  const resolveAlert = async (id: string) => {
    try {
      await fetch(`/api/alerts/${id}/resolve`, { method: 'PUT' });
      setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, resolvedAt: new Date().toISOString() } : a));
    } catch {
      // ignore
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex gap-1 bg-brand-surface rounded-lg border border-brand-border p-1">
          {(['all', 'pending', 'resolved'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition min-h-9 ${filter === f ? 'bg-brand-primary text-white' : 'text-brand-text-secondary hover:bg-brand-bg'}`}
            >
              {f === 'all' ? 'Todos' : f === 'pending' ? 'Pendentes' : 'Resolvidos'}
            </button>
          ))}
        </div>
        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value as any)}
          className="bg-brand-surface border border-brand-border rounded-lg px-3 py-1.5 text-sm text-brand-text focus-visible:ring-2 focus-visible:ring-brand-accent outline-none"
        >
          <option value="all">Todas as severidades</option>
          <option value="critical">Critico</option>
          <option value="high">Alto</option>
          <option value="medium">Medio</option>
          <option value="low">Baixo</option>
        </select>
      </div>

      <div className="space-y-3">
        {filtered.map((a) => (
          <div key={a.id} className="bg-brand-surface rounded-xl p-4 border border-brand-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <span className={`w-3 h-3 mt-1 rounded-full flex-shrink-0 ${a.severity === 'critical' ? 'bg-red-500' : a.severity === 'high' ? 'bg-orange-500' : 'bg-yellow-500'}`} aria-hidden="true" />
              <div>
                <p className="font-medium text-brand-text">{a.details}</p>
                <p className="text-xs text-brand-text-secondary mt-1">{a.vehiclePlate ?? a.vehicleId} &bull; {new Date(a.triggeredAt).toLocaleString('pt-BR')}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${a.resolvedAt ? 'bg-green-100 text-green-700' : a.severity === 'critical' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                {a.resolvedAt ? 'Resolvido' : 'Pendente'}
              </span>
              {!a.resolvedAt && (
                <button
                  onClick={() => resolveAlert(a.id)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 transition min-h-9"
                >
                  Resolver
                </button>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-brand-text-secondary py-8">Nenhum alerta encontrado.</p>
        )}
      </div>
    </div>
  );
}
