import React from 'react';
import { ArrowDownRight, ArrowUpRight, LucideIcon } from 'lucide-react';

export const PageToolbar: React.FC<{ children?: React.ReactNode, action?: React.ReactNode }> = ({ children, action }) => (
  <div className="flex flex-col gap-3 rounded-xl border border-slate-700/40 bg-slate-900/35 p-3 sm:flex-row sm:items-center sm:justify-between">
    <div className="flex flex-wrap items-center gap-2">{children}</div>
    {action && <div className="flex items-center gap-2">{action}</div>}
  </div>
);

export const FilterSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({ children, className = '', ...props }) => (
  <select className={`rounded-lg border border-slate-700/60 bg-slate-950/70 px-3 py-2 text-xs text-slate-200 outline-none transition focus:border-blue-500/60 ${className}`} {...props}>{children}</select>
);

export const ChartPanel: React.FC<{ title: string; value: string; percent: number; color?: string }> = ({ title, value, percent, color = 'bg-blue-500' }) => (
  <div className="card">
    <div className="flex items-center justify-between"><p className="text-sm font-medium text-slate-200">{title}</p><span className="text-lg font-bold text-white">{value}</span></div>
    <div className="mt-5 flex h-20 items-end gap-1" aria-label={`${title} ${value}`}>
      {[35, 48, 42, 61, 52, 69, percent].map((height, index) => <span key={index} className={`flex-1 rounded-t-sm ${color}`} style={{ height: `${Math.max(12, height)}%`, opacity: index === 6 ? 1 : 0.3 }} />)}
    </div>
    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-800"><div className={`h-full rounded-full ${color}`} style={{ width: `${percent}%` }} /></div>
  </div>
);

export const StatCard: React.FC<{ label: string, value: string, trend?: string, trendUp?: boolean, icon?: LucideIcon, detail?: string, highlight?: boolean, onClick?: () => void }> = ({ label, value, trend, trendUp, icon: Icon, detail, highlight, onClick }) => (
  <div onClick={onClick} onKeyDown={event => { if (onClick && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); onClick(); } }} role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined} className={`card group hover:border-blue-500/40 hover:bg-slate-800/80 ${highlight ? 'border-l-2 border-l-blue-400' : ''} ${onClick ? 'cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500/50' : ''}`}>
    <div className="flex items-start justify-between gap-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-brand-muted">{label}</p>
      {Icon && <span className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-2 text-blue-400"><Icon size={17} /></span>}
    </div>
    <div className="mt-4 flex items-end gap-2">
      <span className="text-2xl font-bold tracking-tight text-white">{value}</span>
      {trend && (
        <span className={`mb-0.5 flex items-center text-xs font-medium ${trendUp === false ? 'text-red-400' : 'text-green-400'}`}>
          {trendUp === false ? <ArrowDownRight size={13} /> : <ArrowUpRight size={13} />}{trend}
        </span>
      )}
    </div>
    {detail && <p className={`mt-3 truncate text-xs ${value === '연결 실패' ? 'text-red-400' : 'text-brand-muted'}`} title={detail}>{detail}</p>}
  </div>
);

export const DataTable: React.FC<{ headers: string[], data: any[], renderRow: (row: any) => React.ReactNode }> = ({ headers, data, renderRow }) => (
  <div className="card overflow-x-auto p-0">
    <table className="w-full min-w-[640px] text-left text-sm">
      <thead className="border-b border-slate-700/50 bg-slate-900/60 text-[11px] font-bold uppercase tracking-wider text-brand-muted">
        <tr>
          {headers.map(h => <th key={h} className="px-4 py-3">{h}</th>)}
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
