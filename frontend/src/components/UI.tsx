import React from 'react';
import { ArrowDownRight, ArrowUpRight, LucideIcon } from 'lucide-react';

export const PageToolbar: React.FC<{ children?: React.ReactNode, action?: React.ReactNode }> = ({ children, action }) => (
  <div className="flex flex-col gap-2 rounded-lg border border-slate-700/40 bg-slate-900/35 p-2 sm:flex-row sm:items-center sm:justify-between">
    <div className="flex flex-wrap items-center gap-1.5">{children}</div>
    {action && <div className="flex items-center gap-1.5">{action}</div>}
  </div>
);

export const FilterSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({ children, className = '', ...props }) => (
  <select className={`rounded-md border border-slate-700/60 bg-slate-950/70 px-2 py-1.5 text-[11px] text-slate-200 outline-none transition focus:border-blue-500/60 ${className}`} {...props}>{children}</select>
);

export const ChartPanel: React.FC<{ title: string; value: string; percent: number; color?: string }> = ({ title, value, percent, color = 'bg-blue-500' }) => (
  <div className="card">
    <div className="flex items-center justify-between"><p className="text-xs font-medium text-slate-200">{title}</p><span className="text-base font-bold text-white">{value}</span></div>
    <div className="mt-3 flex h-14 items-end gap-1" aria-label={`${title} ${value}`}>
      {[35, 48, 42, 61, 52, 69, percent].map((height, index) => <span key={index} className={`flex-1 rounded-t-sm ${color}`} style={{ height: `${Math.max(12, height)}%`, opacity: index === 6 ? 1 : 0.3 }} />)}
    </div>
    <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-800"><div className={`h-full rounded-full ${color}`} style={{ width: `${percent}%` }} /></div>
  </div>
);

export const TimeSeriesPanel: React.FC<{ title: string; value: string; data: number[]; color?: string }> = ({ title, value, data, color = 'bg-blue-500' }) => {
  const max = Math.max(...data, 1);
  return <div className="card"><div className="flex items-center justify-between"><p className="text-[11px] font-medium text-slate-200">{title}</p><span className="text-sm font-bold text-white">{value}</span></div><div className="mt-2 flex h-12 items-end gap-0.5">{data.map((point, index) => <span key={index} className={`flex-1 rounded-t-sm ${color}`} style={{ height: `${Math.max(8, (point / max) * 100)}%`, opacity: index === data.length - 1 ? 1 : 0.35 + index / data.length / 2 }} />)}</div></div>;
};

export const StatCard: React.FC<{ label: string, value: string, trend?: string, trendUp?: boolean, icon?: LucideIcon, detail?: string, highlight?: boolean, onClick?: () => void }> = ({ label, value, trend, trendUp, icon: Icon, detail, highlight, onClick }) => (
  <div onClick={onClick} onKeyDown={event => { if (onClick && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); onClick(); } }} role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined} className={`card group hover:border-blue-500/40 hover:bg-slate-800/80 ${highlight ? 'border-l-2 border-l-blue-400' : ''} ${onClick ? 'cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500/50' : ''}`}>
    <div className="flex items-start justify-between gap-2">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-brand-muted">{label}</p>
      {Icon && <span className="rounded-md border border-blue-500/20 bg-blue-500/10 p-1.5 text-blue-400"><Icon size={14} /></span>}
    </div>
    <div className="mt-2 flex items-end gap-1.5">
      <span className="text-lg font-bold tracking-tight text-white">{value}</span>
      {trend && (
        <span className={`mb-0.5 flex items-center text-xs font-medium ${trendUp === false ? 'text-red-400' : 'text-green-400'}`}>
          {trendUp === false ? <ArrowDownRight size={13} /> : <ArrowUpRight size={13} />}{trend}
        </span>
      )}
    </div>
    {detail && <p className={`mt-2 truncate text-[11px] ${value === '연결 실패' ? 'text-red-400' : 'text-brand-muted'}`} title={detail}>{detail}</p>}
  </div>
);

export const DataTable: React.FC<{ headers: string[], data: any[], renderRow: (row: any) => React.ReactNode, className?: string }> = ({ headers, data, renderRow, className = '' }) => (
  <div className={`card overflow-auto p-0 ${className}`}>
    <table className="w-full min-w-[640px] text-left text-xs">
      <thead className="border-b border-slate-700/50 bg-slate-900/60 text-[11px] font-bold uppercase tracking-wider text-brand-muted">
        <tr>
          {headers.map(h => <th key={h} className="px-3 py-2">{h}</th>)}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-800/80">
        {data.map((row, i) => (
          <tr key={i} className="transition-colors hover:bg-slate-800/50">
            {renderRow(row)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
