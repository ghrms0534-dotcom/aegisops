import { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, LockKeyhole, ShieldAlert, ShieldCheck } from 'lucide-react';
import { DataTable, FilterSelect, PageToolbar, StatCard } from '../components/UI';

const events = [
  { event: '로그인 실패 시도', source: 'Auth Gateway', status: '경고', count: 12, time: '3분 전' },
  { event: '허가되지 않은 API 접근', source: 'API Backend', status: '위험', count: 3, time: '8분 전' },
  { event: 'Container 권한 상승 시도', source: 'Docker Agent', status: '안전', count: 0, time: '24분 전' },
  { event: '비정상 Pod 재시작', source: 'Kubernetes Agent', status: '경고', count: 7, time: '31분 전' },
  { event: '의심스러운 Deployment 활동', source: 'Deployment Agent', status: '안전', count: 0, time: '1시간 전' },
];

export default function Security() {
  const [status, setStatus] = useState('전체');
  const [source, setSource] = useState('전체');
  const filtered = useMemo(() => events.filter(event => (status === '전체' || event.status === status) && (source === '전체' || event.source === source)), [status, source]);
  return <div className="space-y-6">
    <div><h3 className="text-xl font-semibold text-white">보안 모니터링</h3><p className="mt-1 text-sm text-brand-muted">인증, API, Workload 보안 이벤트를 감시합니다.</p></div>
    <PageToolbar><FilterSelect value={status} onChange={event => setStatus(event.target.value)}><option>전체</option><option>위험</option><option>경고</option><option>안전</option></FilterSelect><FilterSelect value={source} onChange={event => setSource(event.target.value)}><option>전체</option>{Array.from(new Set(events.map(event => event.source))).map(item => <option key={item}>{item}</option>)}</FilterSelect></PageToolbar>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="위험 이벤트" value={`${filtered.filter(event => event.status === '위험').length}`} icon={ShieldAlert} /><StatCard label="경고" value={`${filtered.filter(event => event.status === '경고').length}`} icon={AlertTriangle} /><StatCard label="차단 요청" value="42" icon={LockKeyhole} /><StatCard label="안전 점검" value="1,284" icon={ShieldCheck} /></div>
    <section className="grid gap-4 lg:grid-cols-3"><div className="card lg:col-span-2"><div className="flex items-center justify-between"><h4 className="font-semibold text-white">보안 상태</h4><span className="badge badge-warning">주의 필요</span></div><div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-800"><div className="h-full w-[78%] rounded-full bg-gradient-to-r from-blue-600 to-cyan-400" /></div><div className="mt-3 flex justify-between text-xs text-brand-muted"><span>보안 점수</span><span className="font-semibold text-white">78 / 100</span></div></div><div className="card flex items-center gap-4"><span className="rounded-xl bg-green-500/10 p-4 text-green-400"><CheckCircle2 size={28} /></span><div><p className="text-sm text-brand-muted">시스템 상태</p><p className="mt-1 text-xl font-bold text-white">보호 중</p></div></div></section>
    <section><h4 className="mb-4 font-semibold text-white">보안 이벤트</h4><DataTable headers={['이벤트', '출처', '상태', '횟수', '최근 감지']} data={filtered} renderRow={event => <><td className="px-4 py-4 font-medium text-white">{event.event}</td><td className="px-4 py-4 text-brand-muted">{event.source}</td><td className="px-4 py-4"><span className={`badge ${event.status === '위험' ? 'badge-danger' : event.status === '경고' ? 'badge-warning' : 'badge-success'}`}>{event.status}</span></td><td className="px-4 py-4">{event.count}</td><td className="px-4 py-4 text-brand-muted">{event.time}</td></>} /></section>
  </div>;
}
