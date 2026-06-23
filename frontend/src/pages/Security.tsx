import { AlertTriangle, CheckCircle2, LockKeyhole, ShieldAlert, ShieldCheck } from 'lucide-react';
import { DataTable, StatCard } from '../components/UI';

const events = [
  { event: 'Failed Login Attempts', source: 'Auth Gateway', status: 'Warning', count: 12, time: '3분 전' },
  { event: 'Unauthorized API Access', source: 'API Backend', status: 'Critical', count: 3, time: '8분 전' },
  { event: 'Container Privilege Escalation', source: 'Docker Agent', status: 'Safe', count: 0, time: '24분 전' },
  { event: 'Abnormal Pod Restart', source: 'Kubernetes Agent', status: 'Warning', count: 7, time: '31분 전' },
  { event: 'Suspicious Deployment Activity', source: 'Deployment Agent', status: 'Safe', count: 0, time: '1시간 전' },
];

export default function Security() {
  return <div className="space-y-6">
    <div><h3 className="text-xl font-semibold text-white">Security Monitoring</h3><p className="mt-1 text-sm text-brand-muted">인증, API 및 Workload 보안 이벤트를 감시합니다.</p></div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="Critical Events" value="3" icon={ShieldAlert} /><StatCard label="Warnings" value="19" icon={AlertTriangle} /><StatCard label="Blocked Requests" value="42" icon={LockKeyhole} /><StatCard label="Safe Checks" value="1,284" icon={ShieldCheck} /></div>
    <section className="grid gap-4 lg:grid-cols-3"><div className="card lg:col-span-2"><div className="flex items-center justify-between"><h4 className="font-semibold text-white">Security Posture</h4><span className="badge badge-warning">주의 필요</span></div><div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-800"><div className="h-full w-[78%] rounded-full bg-gradient-to-r from-blue-600 to-cyan-400" /></div><div className="mt-3 flex justify-between text-xs text-brand-muted"><span>보안 점수</span><span className="font-semibold text-white">78 / 100</span></div></div><div className="card flex items-center gap-4"><span className="rounded-xl bg-green-500/10 p-4 text-green-400"><CheckCircle2 size={28} /></span><div><p className="text-sm text-brand-muted">System Status</p><p className="mt-1 text-xl font-bold text-white">Protected</p></div></div></section>
    <section><h4 className="mb-4 font-semibold text-white">Security Events</h4><DataTable headers={['Event', 'Source', 'Status', 'Count', 'Last Detected']} data={events} renderRow={event => <><td className="px-4 py-4 font-medium text-white">{event.event}</td><td className="px-4 py-4 text-brand-muted">{event.source}</td><td className="px-4 py-4"><span className={`badge ${event.status === 'Critical' ? 'badge-danger' : event.status === 'Warning' ? 'badge-warning' : 'badge-success'}`}>{event.status}</span></td><td className="px-4 py-4">{event.count}</td><td className="px-4 py-4 text-brand-muted">{event.time}</td></>} /></section>
  </div>;
}
