import { useMemo, useState } from 'react';
import { Activity, Bot, Box, GitBranch, Github, Rocket, Server } from 'lucide-react';
import { FilterSelect, PageToolbar, StatCard } from '../components/UI';

const initialAgents = [
  { name: 'Kubernetes Agent', icon: Server, status: '활성', task: 'kubectl get pods', latency: '0.3s', last: '2분 전', action: 'Pod 상태 조회' },
  { name: 'Docker Agent', icon: Box, status: '활성', task: 'docker inspect api', latency: '0.2s', last: '1분 전', action: 'Container 상태 점검' },
  { name: 'Git Agent', icon: GitBranch, status: '대기', task: '대기 중', latency: '0.1s', last: '8분 전', action: 'main Branch 동기화' },
  { name: 'GitHub Agent', icon: Github, status: '활성', task: 'Review PR #142', latency: '0.6s', last: '3분 전', action: 'Pull Request 분석' },
  { name: 'Deployment Agent', icon: Rocket, status: '대기', task: 'Pipeline 대기', latency: '0.4s', last: '12분 전', action: 'Production Deploy 완료' },
  { name: 'Monitoring Agent', icon: Activity, status: '오류', task: 'Metrics 재연결', latency: '2.8s', last: '방금 전', action: 'Prometheus timeout' },
];

export default function AIAgents() {
  const [agents, setAgents] = useState(initialAgents);
  const [status, setStatus] = useState('전체');
  const [running, setRunning] = useState('');
  const [toast, setToast] = useState('');
  const filtered = useMemo(() => agents.filter(agent => status === '전체' || agent.status === status), [agents, status]);
  const simulate = (name: string) => {
    if (!window.confirm(`${name} Demo 작업을 실행할까요? 실제 명령은 실행되지 않습니다.`)) return;
    setRunning(name);
    setToast(`${name} Demo 작업 실행 중...`);
    window.setTimeout(() => {
      setAgents(prev => prev.map(agent => agent.name === name ? { ...agent, status: '활성', last: '방금 전', action: 'Demo 작업 완료' } : agent));
      setRunning('');
      setToast(`${name} Demo 작업 완료 · 실제 인프라는 변경되지 않았습니다.`);
    }, 800);
  };

  return <div className="space-y-6">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><h3 className="text-xl font-semibold text-white">Agent Runtime</h3><p className="mt-1 text-sm text-brand-muted">Infrastructure Runtime Agent별 실행 상태와 최근 작업을 확인합니다.</p></div><div className="flex gap-2"><span className="badge badge-success">Runtime 준비됨</span><span className="badge badge-warning">Model Provider 비활성</span></div></div>
    <PageToolbar><FilterSelect value={status} onChange={event => setStatus(event.target.value)}><option>전체</option><option>활성</option><option>대기</option><option>오류</option></FilterSelect></PageToolbar>
    {toast && <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 px-3 py-2 text-xs text-blue-300">{toast}</div>}
    <div className="grid gap-4 sm:grid-cols-3"><StatCard label="실행 중인 Agent" value={`${agents.filter(agent => agent.status === '활성').length}`} icon={Bot} /><StatCard label="대기 중인 Agent" value={`${agents.filter(agent => agent.status === '대기').length}`} icon={Activity} /><StatCard label="오류 Agent" value={`${agents.filter(agent => agent.status === '오류').length}`} icon={Server} /></div>
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{filtered.map(agent => <article key={agent.name} className="card hover:border-blue-500/40"><div className="flex items-start justify-between"><span className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-2.5 text-blue-400"><agent.icon size={20} /></span><span className={`badge ${agent.status === '활성' ? 'badge-success' : agent.status === '오류' ? 'badge-danger' : 'badge-warning'}`}>{agent.status}</span></div><h4 className="mt-4 font-semibold text-white">{agent.name}</h4><p className="mt-1 text-xs text-brand-muted">최근 작업 · {agent.action}</p><dl className="mt-5 grid grid-cols-2 gap-3 rounded-lg bg-slate-900/50 p-3 text-xs"><div><dt className="text-brand-muted">현재 작업</dt><dd className="mt-1 truncate font-medium text-slate-200">{agent.task}</dd></div><div><dt className="text-brand-muted">응답 시간</dt><dd className="mt-1 font-medium text-slate-200">{agent.latency}</dd></div><div><dt className="text-brand-muted">최근 실행</dt><dd className="mt-1 font-medium text-slate-200">{agent.last}</dd></div><div><dt className="text-brand-muted">동작</dt><dd className="mt-1"><button onClick={() => simulate(agent.name)} disabled={running === agent.name} className="text-blue-400 hover:underline disabled:opacity-60">{running === agent.name ? '실행 중' : 'Demo 실행'}</button></dd></div></dl></article>)}</div>
  </div>;
}
