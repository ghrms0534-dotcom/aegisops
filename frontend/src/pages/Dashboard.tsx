import { StatCard, DataTable, ChartPanel, PageToolbar, FilterSelect } from '../components/UI';
import { Activity, BellRing, Box, CheckCircle2, Cpu, GitCommit, MemoryStick, Rocket, RotateCcw, Server } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Operations Overview</h1>
        <p className="mt-1 text-sm text-brand-muted">전체 인프라 상태와 배포 활동을 한눈에 확인합니다.</p>
      </div>

      <PageToolbar action={<button className="btn-primary text-xs">새로고침</button>}><FilterSelect><option>운영 Environment</option><option>Staging Environment</option><option>Local Environment</option></FilterSelect><FilterSelect><option>최근 1시간</option><option>최근 24시간</option></FilterSelect></PageToolbar>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <StatCard label="실행 중 Pod" value="124" trend="12%" trendUp icon={Server} />
        <StatCard label="활성 Container" value="458" trend="5%" trendUp icon={Box} />
        <StatCard label="배포 성공률" value="99.2%" trend="0.1%" trendUp={false} icon={CheckCircle2} />
        <StatCard label="Memory 사용량" value="64.2%" trend="2.4%" trendUp={false} icon={MemoryStick} />
        <StatCard label="CPU 사용량" value="42.8%" trend="3.1%" trendUp icon={Cpu} />
        <StatCard label="활성 Alerts" value="3" trend="2건 신규" trendUp={false} icon={BellRing} />
      </div>

      <div className="grid gap-4 md:grid-cols-2"><ChartPanel title="CPU 사용 추이" value="42.8%" percent={43} /><ChartPanel title="Memory 사용 추이" value="64.2%" percent={64} color="bg-violet-500" /></div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div><h3 className="font-semibold text-white">Cluster 현황</h3><p className="mt-1 text-xs text-brand-muted">Cluster별 리소스 사용량</p></div>
            <span className="badge badge-success">3 Cluster 정상</span>
          </div>
          <DataTable 
            headers={['Cluster', 'Region', 'Status', 'CPU', 'Memory']} 
            data={[
              { name: 'prod-us-east', region: 'us-east-1', status: 'Online', cpu: '42%', mem: '61%' },
              { name: 'staging-eu-west', region: 'eu-west-1', status: 'Degraded', cpu: '88%', mem: '92%' },
              { name: 'dev-local', region: 'local', status: 'Online', cpu: '12%', mem: '15%' },
            ]}
            renderRow={(row) => (
              <>
                <td className="px-4 py-4 font-medium text-white">{row.name}</td>
                <td className="px-4 py-3 text-brand-muted">{row.region}</td>
                <td className="px-4 py-3">
                  <span className={`badge ${row.status === 'Online' ? 'badge-success' : 'badge-danger'}`}>
                    {row.status}
                  </span>
                </td>
                <td className="px-4 py-3">{row.cpu}</td>
                <td className="px-4 py-3">{row.mem}</td>
              </>
            )}
          />
        </section>
        <section className="card">
          <div className="mb-5 flex items-center justify-between"><div><h3 className="font-semibold text-white">활성 Alerts</h3><p className="mt-1 text-xs text-brand-muted">확인이 필요한 항목</p></div><BellRing size={18} className="text-amber-400" /></div>
          <div className="space-y-2">
            {[
              { sev: 'Critical', msg: 'API Gateway Latency', color: 'text-red-400' },
              { sev: 'Warning', msg: 'Staging Node RAM', color: 'text-yellow-400' },
              { sev: 'Info', msg: 'Backup Completed', color: 'text-blue-400' },
            ].map((a, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg border border-slate-700/40 bg-slate-900/40 p-3">
                <div className={`mt-1.5 h-2 w-2 rounded-full ${a.color.replace('text', 'bg')}`} />
                <div>
                   <p className="text-xs font-bold uppercase text-brand-muted">{a.sev}</p>
                   <p className="text-sm">{a.msg}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section>
        <div className="mb-4"><h3 className="font-semibold text-white">최근 활동</h3><p className="mt-1 text-xs text-brand-muted">연결된 서비스의 최근 변경 사항</p></div>
        <div className="card grid gap-2 p-2 md:grid-cols-2 xl:grid-cols-4">
          {[
            { icon: Rocket, label: 'Deployment', text: 'payment-api deployed', meta: 'Production · 4m ago', color: 'text-blue-400 bg-blue-500/10' },
            { icon: Box, label: 'Docker', text: 'Image build completed', meta: 'v2.8.1 · 12m ago', color: 'text-cyan-400 bg-cyan-500/10' },
            { icon: RotateCcw, label: 'Kubernetes', text: 'Pod restart detected', meta: 'worker-7d9 · 18m ago', color: 'text-amber-400 bg-amber-500/10' },
            { icon: GitCommit, label: 'Git', text: 'Push to main branch', meta: 'a84d21f · 31m ago', color: 'text-violet-400 bg-violet-500/10' },
          ].map((item) => (
            <div key={item.label} className="flex gap-3 rounded-lg p-3 transition hover:bg-slate-800/60">
              <span className={`h-fit rounded-lg p-2 ${item.color}`}><item.icon size={16} /></span>
              <div className="min-w-0"><div className="flex items-center gap-2"><p className="text-sm font-medium text-white">{item.text}</p><Activity size={12} className="text-green-400" /></div><p className="mt-1 text-xs text-brand-muted">{item.label} · {item.meta}</p></div>
            </div>
          ))}
        </div>
      </section>
      </div>
  );
};

export default Dashboard;
