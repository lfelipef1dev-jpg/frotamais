export interface KPICardProps {
  label: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
}

export function KPICard({ label, value, trend, trendUp }: KPICardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-brand-border shadow-sm hover:shadow-md transition duration-300">
      <p className="text-sm text-brand-text-secondary font-medium">{label}</p>
      <p className="text-2xl font-extrabold text-brand-text mt-2">{value}</p>
      {trend && (
        <p className={`text-xs mt-2 font-semibold inline-flex items-center gap-1 ${trendUp ? 'text-brand-accent' : 'text-brand-warning'}`}>
          <span>{trendUp ? '▲' : '▼'}</span>
          {trend}
        </p>
      )}
    </div>
  );
}
