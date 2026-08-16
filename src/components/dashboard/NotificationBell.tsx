import { useState, useEffect } from 'react';

interface Alert {
  id: string;
  severity: string;
  details: string;
  triggeredAt: string;
  resolvedAt: string | null;
  vehiclePlate?: string;
}

export default function NotificationBell({ initialAlerts }: { initialAlerts: Alert[] }) {
  const [open, setOpen] = useState(false);
  const pending = initialAlerts.filter((a) => !a.resolvedAt);
  const critical = pending.filter((a) => a.severity === 'critical');

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg hover:bg-brand-bg transition min-h-12 min-w-12 flex items-center justify-center"
        aria-label={`Notificacoes: ${pending.length} pendentes`}
      >
        <svg className="w-5 h-5 text-brand-text-secondary" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
        {pending.length > 0 && (
          <span className={`absolute top-1 right-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center ${critical.length > 0 ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'}`}>
            {pending.length}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-80 bg-brand-surface border border-brand-border rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto">
            <div className="px-4 py-3 border-b border-brand-border">
              <p className="font-bold text-sm text-brand-text">Notificacoes</p>
              <p className="text-xs text-brand-text-secondary">{pending.length} pendentes</p>
            </div>
            <div className="divide-y divide-brand-border">
              {pending.map((a) => (
                <div key={a.id} className="px-4 py-3 hover:bg-brand-bg transition">
                  <div className="flex items-start gap-2">
                    <span className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${a.severity === 'critical' ? 'bg-red-500' : a.severity === 'high' ? 'bg-orange-500' : 'bg-yellow-500'}`} aria-hidden="true" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-brand-text truncate">{a.details}</p>
                      <p className="text-xs text-brand-text-secondary mt-0.5">
                        {a.vehiclePlate ?? ''} &bull; {new Date(a.triggeredAt).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {pending.length === 0 && (
                <div className="px-4 py-8 text-center text-sm text-brand-text-secondary">Nenhuma notificacao pendente.</div>
              )}
            </div>
            <div className="px-4 py-3 border-t border-brand-border">
              <a href="/app/alerts" className="text-sm font-medium text-brand-accent hover:text-brand-accent-hover">Ver todos os alertas</a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
