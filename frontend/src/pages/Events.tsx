import { AlertTriangle, CheckCircle2, Clock3, Loader2, XCircle } from 'lucide-react';
import { FilterSelect, PageToolbar, StatCard } from '../components/UI';

const events = [
  { time: '14:13', title: 'Deployment Completed', detail: 'payment-api v2.8.1 · Production', status: 'Success', icon: CheckCircle2 },
  { time: '14:12', title: 'Health Check Passed', detail: '12 / 12 endpoints healthy', status: 'Success', icon: CheckCircle2 },
  { time: '14:11', title: 'Kubernetes Rolling Update Started', detail: 'prod-us-east · deployment/payment-api', status: 'Running', icon: Loader2 },
  { time: '14:11', title: 'Docker Build Completed', detail: 'registry.aegis.local/payment-api:2.8.1', status: 'Success', icon: CheckCircle2 },
  { time: '14:10', title: 'Deployment Started', detail: 'Production Deploy Workflow', status: 'Running', icon: Loader2 },
  { time: '13:48', title: 'Pod Restart Threshold Exceeded', detail: 'worker-7d9 · 5 restarts', status: 'Warning', icon: AlertTriangle },
  { time: '12:32', title: 'Image Security Scan Failed', detail: 'legacy-worker:old · 3 critical findings', status: 'Failed', icon: XCircle },
];

export default function Events() {
  return <div className="space-y-6">
    <div><h3 className="text-xl font-semibold text-white">Operations Events</h3><p className="mt-1 text-sm text-brand-muted">인프라와 자동화 실행 이력을 시간순으로 확인합니다.</p></div>
    <PageToolbar action={<button className="btn-primary text-xs">새로고침</button>}><FilterSelect><option>전체 Status</option><option>Success</option><option>Running</option><option>Warning</option><option>Failed</option></FilterSelect><FilterSelect><option>최근 24시간</option><option>최근 7일</option></FilterSelect></PageToolbar>
    <div className="grid gap-4 sm:grid-cols-4"><StatCard label="Total Events" value="128" icon={Clock3} /><StatCard label="Success" value="104" icon={CheckCircle2} /><StatCard label="Running" value="3" icon={Loader2} /><StatCard label="Attention" value="21" icon={AlertTriangle} /></div>
    <section className="card"><div className="mb-6 flex items-center justify-between"><h4 className="font-semibold text-white">Event Timeline</h4><span className="text-xs text-brand-muted">Today · Production</span></div><div className="relative ml-3 border-l border-slate-700/70 pl-7">{events.map((event, index) => <article key={`${event.time}-${event.title}`} className={index < events.length - 1 ? 'pb-7' : ''}><span className={`absolute -left-[13px] flex h-6 w-6 items-center justify-center rounded-full border bg-brand-card ${event.status === 'Success' ? 'border-green-500/40 text-green-400' : event.status === 'Running' ? 'border-blue-500/40 text-blue-400' : event.status === 'Warning' ? 'border-amber-500/40 text-amber-400' : 'border-red-500/40 text-red-400'}`}><event.icon size={13} className={event.status === 'Running' ? 'animate-spin' : ''} /></span><div className="flex flex-col gap-2 rounded-lg border border-slate-800 bg-slate-900/35 p-4 sm:flex-row sm:items-center sm:justify-between"><div><div className="flex items-center gap-3"><time className="font-mono text-xs text-blue-400">{event.time}</time><h5 className="text-sm font-medium text-white">{event.title}</h5></div><p className="mt-2 text-xs text-brand-muted">{event.detail}</p></div><span className={`badge ${event.status === 'Success' ? 'badge-success' : event.status === 'Running' || event.status === 'Warning' ? 'badge-warning' : 'badge-danger'}`}>{event.status}</span></div></article>)}</div></section>
  </div>;
}
