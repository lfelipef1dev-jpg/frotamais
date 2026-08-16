interface Slice {
  label: string;
  value: number;
  color: string;
}

export default function DonutChart({ data, title, centerLabel, centerValue }: { data: Slice[]; title: string; centerLabel?: string; centerValue?: string }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="bg-brand-surface rounded-xl border border-brand-border p-5">
      <h3 className="font-bold text-brand-text mb-4">{title}</h3>
      <div className="flex items-center gap-6">
        <svg width="160" height="160" viewBox="0 0 160 160" className="flex-shrink-0">
          <circle cx="80" cy="80" r={radius} fill="none" stroke="#1A1A1A" strokeWidth="20" />
          {total > 0 && data.map((slice) => {
            const dash = (slice.value / total) * circumference;
            const circle = (
              <circle
                key={slice.label}
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke={slice.color}
                strokeWidth="20"
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-offset}
                transform="rotate(-90 80 80)"
              />
            );
            offset += dash;
            return circle;
          })}
          {centerValue && (
            <text x="80" y="76" textAnchor="middle" className="fill-brand-text" style={{ fontSize: '24px', fontWeight: 800 }}>
              {centerValue}
            </text>
          )}
          {centerLabel && (
            <text x="80" y="96" textAnchor="middle" className="fill-brand-text-secondary" style={{ fontSize: '12px' }}>
              {centerLabel}
            </text>
          )}
        </svg>
        <div className="space-y-2 flex-1">
          {data.map((d) => (
            <div key={d.label} className="flex items-center gap-2 text-sm">
              <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} aria-hidden="true" />
              <span className="text-brand-text-secondary flex-1">{d.label}</span>
              <span className="text-brand-text font-medium">{d.value.toLocaleString('pt-BR')}</span>
              <span className="text-brand-text-light text-xs">{total > 0 ? `${Math.round((d.value / total) * 100)}%` : ''}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
