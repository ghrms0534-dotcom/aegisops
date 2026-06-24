import { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, History, ShieldAlert } from 'lucide-react';
import { DataTable, FilterSelect, PageToolbar, StatCard } from '../components/UI';

const logs = [
  { user: 'admin', action: 'LOGIN', target: 'AegisOps Console', timestamp: '2026-06-24 09:12:04', status: '성공', risk: '낮음' },
  { user: 'devops01', action: 'VIEW_POD_LOGS', target: 'payment-api', timestamp: '2026-06-24 09:18:31', status: '성공', risk: '낮음' },
  { user: 'viewer01', action: 'ACCESS_DENIED', target: 'Deployments', timestamp: '2026-06-24 09:22:10', status: '차단됨', risk: '중간' },
  { user: 'admin', action: 'TOKEN_REFRESH', target: 'JWT Session', timestamp: '2026-06-24 09:30:44', status: '성공', risk: '낮음' },
];
const riskBadge = (risk: string) => risk === '낮음' ? 'badge-success' : risk === '중간' ? 'badge-warning' : 'badge-danger';
const statusBadge = (status: string) => status === '성공' ? 'badge-success' : status === '차단됨' ? 'badge-warning' : 'badge-danger';

export default function AuditLogs() {
  const [status, setStatus] = useState('전체');
  const [risk, setRisk] = useState('전체');
  const filtered = useMemo(() => logs.filter(log => (status === '전체' || log.status === status) && (risk === '전체' || log.risk === risk)), [status, risk]);
  return <div className="space-y-4">
    <div><h3 className="text-lg font-semibold text-white">감사 로그</h3><p className="mt-0.5 text-xs text-brand-muted">사용자 작업, 대상 리소스, 상태와 위험도를 확인합니다.</p></div>
    <PageToolbar><FilterSelect value={status} onChange={event => setStatus(event.target.value)}><option>전체</option><option>성공</option><option>차단됨</option></FilterSelect><FilterSelect value={risk} onChange={event => setRisk(event.target.value)}><option>전체</option><option>낮음</option><option>중간</option><option>높음</option></FilterSelect></PageToolbar>
    <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="감사 이벤트" value={`${filtered.length}`} icon={History} /><StatCard label="성공" value={`${filtered.filter(log => log.status === '성공').length}`} icon={CheckCircle2} /><StatCard label="차단됨" value={`${filtered.filter(log => log.status === '차단됨').length}`} icon={ShieldAlert} /><StatCard label="위험 이벤트" value={`${filtered.filter(log => log.risk !== '낮음').length}`} icon={AlertTriangle} /></div>
    <DataTable headers={['사용자', '작업', '대상', '시간', '상태', '위험도']} data={filtered} renderRow={log => <><td className="px-3 py-2 font-medium text-white">{log.user}</td><td className="px-3 py-2 text-brand-muted">{log.action}</td><td className="px-3 py-2 text-brand-muted">{log.target}</td><td className="px-3 py-2 text-brand-muted">{log.timestamp}</td><td className="px-3 py-2"><span className={`badge ${statusBadge(log.status)}`}>{log.status}</span></td><td className="px-3 py-2"><span className={`badge ${riskBadge(log.risk)}`}>{log.risk}</span></td></>} />
  </div>;
}
