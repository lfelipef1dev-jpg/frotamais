interface DataPoint {
  label: string;
  value: number;
  color?: string;
}

export default function BarChart({ data, title, unit }: { data: DataPoint[]; title: string; unit?: string }) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const barWidth = 100 / Math.max(data.length, 1);

  return (
    <div className="bg-brand-surface rounded-xl border border-brand-border p-5">
      <h3 className="font-bold text-brand-text mb-4">{title}</h3>
      <div className="space-y-3">
        {data.map((d) => (
          <div key={d.label}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-brand-text-secondary">{d.label}</span>
              <span className="text-brand-text font-medium">{d.value.toLocaleString('pt-BR')}{unit ? ` ${unit}` : ''}</span>
            </div>
            <div className="h-3 bg-brand-bg rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${(d.value / maxValue) * 100}%`,
                  backgroundColor: d.color ?? '#3B82F6',
                }}
              />
            </div>
          </div>
        ))}
        {data.length === 0 && (
          <p className="text-sm text-brand-text-secondary text-center py-4">Sem dados disponiveis.</p>
        )}
      </div>
    </div>
  );
}
