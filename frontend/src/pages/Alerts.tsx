import { useEffect, useMemo, useState } from 'react';
import { AlertOctagon, AlertTriangle, CheckCircle2, Siren } from 'lucide-react';
import { DataTable, FilterSelect, PageToolbar, StatCard } from '../components/UI';
import { alertApi } from '../api/client';
import { Alert } from '../types';

const severityText = (severity: Alert['severity']) => ({ Critical: '위험', Warning: '경고', Info: '정보' }[severity]);
const analyze = (alert: Alert) => ({
  severity: alert.severity,
  summary: `${alert.source}에서 '${alert.message}' 신호가 감지되었습니다.`,
  possibleCauses: ['최근 Deploy 이후 readiness 지연', '리소스 사용량 증가', '내부 의존 서비스 응답 지연'],
  evidence: ['최근 5분 경고 빈도 증가', 'Metrics trend 상승', 'Dashboard 이벤트와 시간대 일치'],
  recommendedActions: ['Retry Build', 'View Logs', 'Rollback', 'Scale Deployment'],
});

export default function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selected, setSelected] = useState<Alert | null>(null);
  const [severity, setSeverity] = useState('전체');
  const [readState, setReadState] = useState('전체');
  const [toast, setToast] = useState('');

  useEffect(() => { alertApi.getAlerts().then(res => setAlerts(res.data)); }, []);
  const filtered = useMemo(() => alerts.filter(alert => (severity === '전체' || alert.severity === severity) && (readState === '전체' || (readState === '확인됨') === alert.is_read)), [alerts, severity, readState]);
  const handleMarkRead = async (id: number) => { await alertApi.markRead(id); setAlerts(prev => prev.map(alert => alert.id === id ? { ...alert, is_read: true } : alert)); };
  const simulate = (action: string) => setToast(`${action} Demo 실행 완료 · 실제 인프라는 변경되지 않았습니다.`);
  const rca = selected ? analyze(selected) : null;

  return <div className="space-y-6">
    <div><h3 className="text-xl font-semibold text-white">알림 및 Incident</h3><p className="mt-1 text-sm text-brand-muted">활성 경고와 Incident 대응 상태를 확인합니다.</p></div>
    <PageToolbar><FilterSelect value={severity} onChange={event => setSeverity(event.target.value)}><option>전체</option><option>Critical</option><option>Warning</option><option>Info</option></FilterSelect><FilterSelect value={readState} onChange={event => setReadState(event.target.value)}><option>전체</option><option>미확인</option><option>확인됨</option></FilterSelect></PageToolbar>
    {toast && <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 px-3 py-2 text-xs text-blue-300">{toast}</div>}
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="위험 알림" value={`${alerts.filter(alert => alert.severity === 'Critical').length}`} icon={AlertOctagon} /><StatCard label="경고 알림" value={`${alerts.filter(alert => alert.severity === 'Warning').length}`} icon={AlertTriangle} /><StatCard label="확인된 알림" value={`${alerts.filter(alert => alert.is_read).length}`} icon={CheckCircle2} /><StatCard label="활성 Incident" value="2" icon={Siren} /></div>
    <DataTable headers={['심각도', '메시지', '출처', '시간', '상태']} data={filtered} renderRow={alert => <><td className="px-4 py-3"><span className={`badge ${alert.severity === 'Critical' ? 'badge-danger' : alert.severity === 'Warning' ? 'badge-warning' : 'badge-success'}`}>{severityText(alert.severity)}</span></td><td className="px-4 py-3 font-medium"><button onClick={() => setSelected(alert)} className="text-blue-300 hover:underline">{alert.message}</button></td><td className="px-4 py-3 text-brand-muted">{alert.source}</td><td className="px-4 py-3 text-brand-muted">{alert.created_at}</td><td className="px-4 py-3">{!alert.is_read ? <button onClick={() => handleMarkRead(alert.id)} className="text-xs text-brand-accent hover:underline">확인 처리</button> : <span className="text-xs text-slate-600">확인됨</span>}</td></>} />
    {rca && <section className="card border-blue-500/20"><div className="flex items-center justify-between"><div><h4 className="font-semibold text-white">AI 원인 분석</h4><p className="mt-1 text-xs text-brand-muted">{rca.summary}</p></div><span className={`badge ${rca.severity === 'Critical' ? 'badge-danger' : rca.severity === 'Warning' ? 'badge-warning' : 'badge-success'}`}>{severityText(rca.severity)}</span></div><div className="mt-4 grid gap-4 text-xs md:grid-cols-3"><div><p className="font-semibold text-white">가능한 원인</p>{rca.possibleCauses.map(item => <p key={item} className="mt-1 text-brand-muted">· {item}</p>)}</div><div><p className="font-semibold text-white">근거</p>{rca.evidence.map(item => <p key={item} className="mt-1 text-brand-muted">· {item}</p>)}</div><div><p className="font-semibold text-white">권장 조치</p>{rca.recommendedActions.map(action => <button key={action} onClick={() => simulate(action)} className="mr-1 mt-1 rounded-md border border-slate-700 px-2 py-1 text-brand-muted hover:border-blue-500/50 hover:text-blue-300">{action}</button>)}</div></div></section>}
    <div className="card"><h4 className="font-semibold text-white">알림 타임라인</h4><div className="mt-4 border-l border-slate-700 pl-4 text-sm text-brand-muted"><p className="pb-4"><span className="text-red-400">13:42</span> API Gateway latency 위험 알림 발생</p><p><span className="text-green-400">12:18</span> Memory 경고 알림 확인됨</p></div></div>
  </div>;
}
