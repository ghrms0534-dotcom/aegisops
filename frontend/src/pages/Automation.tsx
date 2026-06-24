import { useMemo, useState } from 'react';
import { AlertTriangle, Bot, CheckCircle2, PlayCircle } from 'lucide-react';
import { DataTable, FilterSelect, PageToolbar, StatCard } from '../components/UI';

const initialRunbooks = [
  { name: 'Pod 재시작 조사', trigger: 'Alert: restart count > 3', target: 'Kubernetes Pod', lastRun: '10분 전', result: '완료', risk: '중간' },
  { name: 'Deployment 검증', trigger: 'Deploy 이후', target: 'Production Cluster', lastRun: '24분 전', result: '경고', risk: '높음' },
  { name: 'Docker 런타임 점검', trigger: '예약 실행', target: 'Docker Engine', lastRun: '1시간 전', result: '완료', risk: '낮음' },
  { name: 'GitHub Token 감사', trigger: '수동 검토', target: 'GitHub API', lastRun: '3시간 전', result: '실패', risk: '높음' },
];

const riskBadge = (risk: string) => risk === '낮음' ? 'badge-success' : risk === '중간' ? 'badge-warning' : 'badge-danger';
const resultBadge = (result: string) => result === '완료' ? 'badge-success' : result === '경고' ? 'badge-warning' : 'badge-danger';

export default function Automation() {
  const [runbooks, setRunbooks] = useState(initialRunbooks);
  const [risk, setRisk] = useState('전체');
  const [result, setResult] = useState('전체');
  const [toast, setToast] = useState('');
  const [running, setRunning] = useState('');
  const filtered = useMemo(() => runbooks.filter(item => (risk === '전체' || item.risk === risk) && (result === '전체' || item.result === result)), [runbooks, risk, result]);

  const simulate = (name: string) => {
    if (!window.confirm(`${name} Demo 실행을 시작할까요? 실제 명령은 실행되지 않습니다.`)) return;
    setRunning(name);
    setToast(`${name} Demo 실행 중...`);
    window.setTimeout(() => {
      setRunbooks(prev => prev.map(item => item.name === name ? { ...item, lastRun: '방금 전', result: '완료' } : item));
      setRunning('');
      setToast(`${name} Demo 완료 · 실제 인프라는 변경되지 않았습니다.`);
    }, 800);
  };

  return <div className="space-y-4">
    <div><h3 className="text-lg font-semibold text-white">자동화</h3><p className="mt-0.5 text-xs text-brand-muted">운영 Runbook, Trigger, 대상, 최근 실행 결과와 위험도를 확인합니다.</p></div>
    <PageToolbar><FilterSelect value={risk} onChange={event => setRisk(event.target.value)}><option>전체</option><option>낮음</option><option>중간</option><option>높음</option></FilterSelect><FilterSelect value={result} onChange={event => setResult(event.target.value)}><option>전체</option><option>완료</option><option>경고</option><option>실패</option></FilterSelect></PageToolbar>
    {toast && <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 px-3 py-2 text-xs text-blue-300">{toast}</div>}
    <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="Runbook" value={`${runbooks.length}`} icon={Bot} /><StatCard label="완료" value={`${runbooks.filter(item => item.result === '완료').length}`} icon={CheckCircle2} /><StatCard label="검토 필요" value={`${runbooks.filter(item => item.result !== '완료').length}`} icon={AlertTriangle} /><StatCard label="수동 실행" value="Demo" icon={PlayCircle} /></div>
    <DataTable headers={['Runbook 이름', 'Trigger', '대상', '최근 실행', '결과', '위험도', '동작']} data={filtered} renderRow={runbook => <><td className="px-3 py-2 font-medium text-white">{runbook.name}</td><td className="px-3 py-2 text-brand-muted">{runbook.trigger}</td><td className="px-3 py-2 text-brand-muted">{runbook.target}</td><td className="px-3 py-2 text-brand-muted">{runbook.lastRun}</td><td className="px-3 py-2"><span className={`badge ${resultBadge(runbook.result)}`}>{runbook.result}</span></td><td className="px-3 py-2"><span className={`badge ${riskBadge(runbook.risk)}`}>{runbook.risk}</span></td><td className="px-3 py-2"><button onClick={() => simulate(runbook.name)} disabled={running === runbook.name} className="text-xs text-blue-400 hover:underline disabled:opacity-60">{running === runbook.name ? '실행 중' : 'Demo 실행'}</button></td></>} />
  </div>;
}
