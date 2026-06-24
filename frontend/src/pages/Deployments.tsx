import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Clock3, Rocket, XCircle } from 'lucide-react';
import { DataTable, FilterSelect, PageToolbar, StatCard } from '../components/UI';
import { deployApi } from '../api/client';

type Deployment = { id: number | string; name: string; version: string; status: string; environment: string; created_at: string };

const statusLabel = (status: string) => status === 'Success' ? '성공' : status === 'Failed' ? '실패' : status === 'Running' ? '진행 중' : status;
const statusBadge = (status: string) => status === 'Success' ? 'badge-success' : status === 'Failed' ? 'badge-danger' : 'badge-warning';

export default function Deployments() {
  const [history, setHistory] = useState<Deployment[]>([]);
  const [environment, setEnvironment] = useState('전체');
  const [status, setStatus] = useState('전체');
  const [toast, setToast] = useState('');
  const [running, setRunning] = useState(false);

  useEffect(() => {
    deployApi.getHistory().then(res => setHistory(res.data.map((item: any) => ({ ...item, environment: item.environment || 'Production' }))));
  }, []);

  const filtered = useMemo(() => history.filter(item => (environment === '전체' || item.environment === environment) && (status === '전체' || item.status === status)), [history, environment, status]);

  const simulateDeploy = () => {
    if (!window.confirm('Demo 배포 시뮬레이션을 실행할까요? 실제 배포 명령은 실행되지 않습니다.')) return;
    setRunning(true);
    setToast('Demo 배포 시뮬레이션 실행 중...');
    window.setTimeout(() => {
      setHistory(prev => [{ id: `demo-${Date.now()}`, name: 'payment-api', version: 'demo-2.9.0', status: 'Success', environment: 'Production', created_at: new Date().toISOString() }, ...prev]);
      setRunning(false);
      setToast('Demo 배포 시뮬레이션 완료 · 실제 인프라는 변경되지 않았습니다.');
    }, 900);
  };

  return <div className="space-y-6">
    <div><h3 className="text-xl font-semibold text-white">배포 관리</h3><p className="mt-1 text-sm text-brand-muted">Deployment, Rollback, Release History와 Health Verification 상태를 확인합니다.</p></div>
    <PageToolbar action={<button onClick={simulateDeploy} disabled={running} className="btn-primary text-sm disabled:opacity-60">{running ? 'Demo 실행 중...' : '새 배포 Demo'}</button>}><FilterSelect value={environment} onChange={event => setEnvironment(event.target.value)}><option>전체</option><option>Production</option><option>Staging</option></FilterSelect><FilterSelect value={status} onChange={event => setStatus(event.target.value)}><option>전체</option><option>Success</option><option>Failed</option><option>Running</option></FilterSelect></PageToolbar>
    {toast && <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 px-3 py-2 text-xs text-blue-300">{toast}</div>}
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="배포 성공률" value="99.2%" icon={CheckCircle2} /><StatCard label="마지막 배포" value="4분 전" icon={Clock3} /><StatCard label="실패한 배포" value={`${history.filter(item => item.status === 'Failed').length}`} icon={XCircle} /><StatCard label="진행 중 Pipeline" value={`${history.filter(item => item.status === 'Running').length}`} icon={Rocket} /></div>
    <div className="card"><div className="flex items-center justify-between"><h4 className="font-semibold text-white">Release Timeline</h4><span className="badge badge-success">Production</span></div><div className="mt-5 grid grid-cols-4 gap-2 text-center text-xs"><div className="rounded-lg bg-green-500/10 p-3 text-green-400">Build 완료</div><div className="rounded-lg bg-green-500/10 p-3 text-green-400">Test 통과</div><div className="rounded-lg bg-blue-500/10 p-3 text-blue-400">Deploy 진행</div><div className="rounded-lg bg-slate-800 p-3 text-brand-muted">Verify 대기</div></div></div>
    <DataTable headers={['ID', 'App 이름', 'Version', '환경', '상태', '시간']} data={filtered} renderRow={dep => <><td className="px-4 py-3">{dep.id}</td><td className="px-4 py-3 font-medium">{dep.name}</td><td className="px-4 py-3">{dep.version}</td><td className="px-4 py-3 text-brand-muted">{dep.environment}</td><td className="px-4 py-3"><span className={`badge ${statusBadge(dep.status)}`}>{statusLabel(dep.status)}</span></td><td className="px-4 py-3 text-brand-muted">{new Date(dep.created_at).toLocaleString()}</td></>} />
  </div>;
}
