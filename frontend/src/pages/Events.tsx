import { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Clock3, Loader2, XCircle } from 'lucide-react';
import { FilterSelect, PageToolbar, StatCard } from '../components/UI';

const events = [
  { time: '14:13', title: 'Deployment 완료', detail: 'payment-api v2.8.1 · Production', status: 'Success', icon: CheckCircle2 },
  { time: '14:12', title: 'Health Check 통과', detail: '12 / 12 endpoints healthy', status: 'Success', icon: CheckCircle2 },
  { time: '14:11', title: 'Kubernetes Rolling Update 시작', detail: 'Production Cluster · deployment/payment-api', status: 'Running', icon: Loader2 },
  { time: '14:11', title: 'Docker Build 완료', detail: 'registry.aegis.local/payment-api:2.8.1', status: 'Success', icon: CheckCircle2 },
  { time: '14:10', title: 'Deployment 시작', detail: 'Production Deploy Workflow', status: 'Running', icon: Loader2 },
  { time: '13:48', title: 'Pod 재시작 임계치 초과', detail: 'worker-7d9 · 5 restarts', status: 'Warning', icon: AlertTriangle },
  { time: '12:32', title: 'Image 보안 스캔 실패', detail: 'legacy-worker:old · 3 critical findings', status: 'Failed', icon: XCircle },
];

export default function Events() {
  const [status, setStatus] = useState('전체');
  const [range, setRange] = useState('최근 24시간');
  const filtered = useMemo(() => events.filter(event => status === '전체' || event.status === status), [status]);
  return <div className="space-y-6">
    <div><h3 className="text-xl font-semibold text-white">운영 이벤트</h3><p className="mt-1 text-sm text-brand-muted">인프라와 자동화 실행 이력을 시간순으로 확인합니다.</p></div>
    <PageToolbar><FilterSelect value={status} onChange={event => setStatus(event.target.value)}><option>전체</option><option>Success</option><option>Running</option><option>Warning</option><option>Failed</option></FilterSelect><FilterSelect value={range} onChange={event => setRange(event.target.value)}><option>최근 24시간</option><option>최근 7일</option></FilterSelect></PageToolbar>
    <div className="grid gap-4 sm:grid-cols-4"><StatCard label="전체 이벤트" value={`${filtered.length}`} icon={Clock3} /><StatCard label="성공" value={`${filtered.filter(item => item.status === 'Success').length}`} icon={CheckCircle2} /><StatCard label="실행중" value={`${filtered.filter(item => item.status === 'Running').length}`} icon={Loader2} /><StatCard label="확인 필요" value={`${filtered.filter(item => item.status === 'Warning' || item.status === 'Failed').length}`} icon={AlertTriangle} /></div>
    <section className="card"><div className="mb-6 flex items-center justify-between"><h4 className="font-semibold text-white">이벤트 타임라인</h4><span className="text-xs text-brand-muted">{range} · Production</span></div><div className="relative ml-3 border-l border-slate-700/70 pl-7">{filtered.map((event, index) => <article key={`${event.time}-${event.title}`} className={index < filtered.length - 1 ? 'pb-7' : ''}><span className={`absolute -left-[13px] flex h-6 w-6 items-center justify-center rounded-full border bg-brand-card ${event.status === 'Success' ? 'border-green-500/40 text-green-400' : event.status === 'Running' ? 'border-blue-500/40 text-blue-400' : event.status === 'Warning' ? 'border-amber-500/40 text-amber-400' : 'border-red-500/40 text-red-400'}`}><event.icon size={13} className={event.status === 'Running' ? 'animate-spin' : ''} /></span><div className="flex flex-col gap-2 rounded-lg border border-slate-800 bg-slate-900/35 p-4 sm:flex-row sm:items-center sm:justify-between"><div><div className="flex items-center gap-3"><time className="font-mono text-xs text-blue-400">{event.time}</time><h5 className="text-sm font-medium text-white">{event.title}</h5></div><p className="mt-2 text-xs text-brand-muted">{event.detail}</p></div><span className={`badge ${event.status === 'Success' ? 'badge-success' : event.status === 'Running' || event.status === 'Warning' ? 'badge-warning' : 'badge-danger'}`}>{event.status}</span></div></article>)}</div></section>
  </div>;
}
