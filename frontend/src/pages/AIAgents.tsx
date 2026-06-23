import { Activity, Bot, Box, GitBranch, Github, Rocket, Server } from 'lucide-react';
import { StatCard } from '../components/UI';

const agents = [
  { name: 'Kubernetes Agent', icon: Server, status: 'Active', task: 'kubectl get pods', latency: '0.3s', last: '2분 전', action: 'Pod 상태 조회' },
  { name: 'Docker Agent', icon: Box, status: 'Active', task: 'docker inspect api', latency: '0.2s', last: '1분 전', action: 'Container Health Check' },
  { name: 'Git Agent', icon: GitBranch, status: 'Idle', task: '대기 중', latency: '0.1s', last: '8분 전', action: 'main Branch 동기화' },
  { name: 'GitHub Agent', icon: Github, status: 'Active', task: 'Review PR #142', latency: '0.6s', last: '3분 전', action: 'Pull Request 분석' },
  { name: 'Deployment Agent', icon: Rocket, status: 'Idle', task: 'Pipeline 대기', latency: '0.4s', last: '12분 전', action: 'Production 배포 완료' },
  { name: 'Monitoring Agent', icon: Activity, status: 'Error', task: 'Metrics 재연결', latency: '2.8s', last: '방금 전', action: 'Prometheus timeout' },
];

export default function AIAgents() {
  return <div className="space-y-6">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><h3 className="text-xl font-semibold text-white">Agent Runtime</h3><p className="mt-1 text-sm text-brand-muted">Infrastructure Runtime Agent별 실행 상태와 최근 작업을 확인합니다.</p></div><div className="flex gap-2"><span className="badge badge-success">Runtime Ready</span><span className="badge badge-warning">Model Provider Disabled</span></div></div>
    <div className="grid gap-4 sm:grid-cols-3"><StatCard label="Running Runtime Agents" value="3" icon={Bot} /><StatCard label="Idle Runtime Agents" value="2" icon={Activity} /><StatCard label="Error Runtime Agents" value="1" icon={Server} /></div>
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{agents.map(agent => <article key={agent.name} className="card hover:border-blue-500/40">
      <div className="flex items-start justify-between"><span className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-2.5 text-blue-400"><agent.icon size={20} /></span><span className={`badge ${agent.status === 'Active' ? 'badge-success' : agent.status === 'Error' ? 'badge-danger' : 'badge-warning'}`}>{agent.status}</span></div>
      <h4 className="mt-4 font-semibold text-white">{agent.name}</h4><p className="mt-1 text-xs text-brand-muted">Last Action · {agent.action}</p>
      <dl className="mt-5 grid grid-cols-2 gap-3 rounded-lg bg-slate-900/50 p-3 text-xs"><div><dt className="text-brand-muted">Current Task</dt><dd className="mt-1 truncate font-medium text-slate-200">{agent.task}</dd></div><div><dt className="text-brand-muted">Response Time</dt><dd className="mt-1 font-medium text-slate-200">{agent.latency}</dd></div><div className="col-span-2"><dt className="text-brand-muted">Last Run</dt><dd className="mt-1 font-medium text-slate-200">{agent.last}</dd></div></dl>
    </article>)}</div>
  </div>;
}
