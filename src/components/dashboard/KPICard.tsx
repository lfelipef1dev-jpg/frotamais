export interface KPICardProps {
  label: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
}

export function KPICard({ label, value, trend, trendUp }: KPICardProps) {
  return (
    <div className="bg-brand-surface rounded-xl p-5 border border-brand-border">
      <p className="text-sm text-brand-text-secondary">{label}</p>
      <p className="text-2xl font-extrabold text-brand-text mt-1">{value}</p>
      {trend && (
        <p className={`text-xs mt-2 font-medium ${trendUp ? 'text-brand-accent' : 'text-brand-warning'}`}>{trend}</p>
      )}
    </div>
  );
}
