import { Activity, AlertTriangle, CheckCircle2, Clock3, Network } from 'lucide-react';
import { DataTable, StatCard } from '../components/UI';

const connectivity = [
  { from: 'Frontend', to: 'API Backend', status: 'Healthy' },
  { from: 'API Backend', to: 'Redis Queue', status: 'Healthy' },
  { from: 'API Backend', to: 'Kubernetes API', status: 'Healthy' },
  { from: 'API Backend', to: 'GitHub API', status: 'Warning' },
  { from: 'Worker Agent', to: 'Docker Engine', status: 'Healthy' },
];

const ports = [
  { name: 'Frontend 포트', value: '3100', status: 'Open' },
  { name: 'Backend API 포트', value: '3300', status: 'Open' },
  { name: 'Redis 포트', value: '6379', status: 'Closed' },
  { name: 'Kubernetes API 포트', value: '6443', status: 'Open' },
  { name: 'WebSocket 엔드포인트', value: '/ws/dashboard', status: 'Open' },
];

const endpoints = [
  { path: '/api/health', code: 200, latency: '18ms', status: 'Healthy' },
  { path: '/api/k8s/clusters', code: 200, latency: '42ms', status: 'Healthy' },
  { path: '/api/docker/containers', code: 200, latency: '31ms', status: 'Healthy' },
  { path: '/api/github/repos', code: 401, latency: '64ms', status: 'Warning' },
  { path: '/ws/dashboard', code: 101, latency: '12ms', status: 'Healthy' },
];

const events = [
  'API Backend 응답속도가 42ms로 안정화되었습니다.',
  'GitHub API 인증 상태 확인이 필요합니다.',
  'WebSocket Dashboard 채널 연결이 수락되었습니다.',
  'Docker Engine 소켓 상태 점검이 정상입니다.',
];

const badge = (status: string) => status === 'Healthy' || status === 'Open' ? 'badge-success' : status === 'Closed' ? 'badge-danger' : 'badge-warning';
const label = (status: string) => ({ Healthy: '정상', Warning: '주의', Open: 'Open', Closed: 'Closed' }[status] || status);

export default function Networking() {
  return <div className="space-y-4">
    <div><h3 className="text-lg font-semibold text-white">네트워크 운영 상태</h3><p className="mt-0.5 text-xs text-brand-muted">서비스 연결 상태, 포트 상태, API 접근성을 확인합니다.</p></div>

    <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="포트 상태" value="4" icon={Network} />
      <StatCard label="API 정상 수" value="4 / 5" icon={CheckCircle2} />
      <StatCard label="평균 응답속도" value="33ms" icon={Clock3} />
      <StatCard label="오류 감지 수" value="1" icon={AlertTriangle} />
    </div>

    <section>
      <h4 className="mb-2 font-semibold text-white">서비스 연결 상태</h4>
      <DataTable headers={['출발 서비스', '대상 서비스', '상태']} data={connectivity} renderRow={row => <><td className="px-3 py-2 font-medium text-white">{row.from}</td><td className="px-3 py-2 text-brand-muted">{row.to}</td><td className="px-3 py-2"><span className={`badge ${badge(row.status)}`}>{label(row.status)}</span></td></>} />
    </section>

    <div className="grid gap-3 xl:grid-cols-2">
      <section>
        <h4 className="mb-2 font-semibold text-white">포트 상태</h4>
        <DataTable headers={['서비스명', '포트 / Endpoint', '상태']} data={ports} renderRow={row => <><td className="px-3 py-2 font-medium text-white">{row.name}</td><td className="px-3 py-2 text-brand-muted">{row.value}</td><td className="px-3 py-2"><span className={`badge ${badge(row.status)}`}>{label(row.status)}</span></td></>} />
      </section>

      <section>
        <h4 className="mb-2 font-semibold text-white">API 응답 상태</h4>
        <DataTable headers={['경로', '응답코드', '응답시간', '상태']} data={endpoints} renderRow={row => <><td className="px-3 py-2 font-mono text-xs text-white">{row.path}</td><td className="px-3 py-2">{row.code}</td><td className="px-3 py-2 text-brand-muted">{row.latency}</td><td className="px-3 py-2"><span className={`badge ${badge(row.status)}`}>{label(row.status)}</span></td></>} />
      </section>
    </div>

    <section className="card">
      <div className="mb-2 flex items-center gap-2"><Activity size={16} className="text-blue-400" /><h4 className="font-semibold text-white">최근 네트워크 이벤트</h4></div>
      <div className="grid gap-1.5 text-xs text-brand-muted">{events.map(event => <p key={event} className="rounded-md border border-slate-800 bg-slate-900/40 px-2 py-1.5">{event}</p>)}</div>
    </section>
  </div>;
}
