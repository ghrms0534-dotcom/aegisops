import { CheckCircle2, Clock3, GitBranch, Rocket, Workflow } from 'lucide-react';
import { DataTable, StatCard } from '../components/UI';
import { ProviderSection } from '../components/ProviderSection';

const steps = ['Git Pull', 'Docker Build', 'Image Push', 'Kubernetes Deploy', 'Health Check', 'Deployment Success'];
const runs = [
  { name: 'Production Deploy', step: 'Kubernetes Deploy', status: 'Running', duration: '24 sec', executed: '방금 전' },
  { name: 'Staging Release', step: 'Deployment Success', status: 'Success', duration: '1m 18s', executed: '18분 전' },
  { name: 'Nightly Image Build', step: 'Docker Build', status: 'Failed', duration: '42 sec', executed: '2시간 전' },
];

export default function Workflows() {
  return <div className="space-y-6">
    <div><h3 className="text-xl font-semibold text-white">CI/CD Pipeline Management</h3><p className="mt-1 text-sm text-brand-muted">운영 자동화 Pipeline의 진행 상태를 추적합니다.</p></div>
    <div className="grid gap-4 sm:grid-cols-3"><StatCard label="실행 중 Workflow" value="1" icon={Workflow} /><StatCard label="오늘 완료" value="18" icon={CheckCircle2} /><StatCard label="평균 소요 시간" value="58s" icon={Clock3} /></div>
    <section className="card"><div className="flex items-center justify-between"><div><h4 className="font-semibold text-white">Production Deploy</h4><p className="mt-1 text-xs text-brand-muted">현재 자동화 Pipeline</p></div><span className="badge badge-success">Running</span></div>
      <div className="mt-6 grid gap-2 md:grid-cols-6">{steps.map((step, index) => <div key={step} className="relative"><div className={`rounded-lg border p-3 text-center text-xs font-medium ${index < 3 ? 'border-green-500/25 bg-green-500/10 text-green-400' : index === 3 ? 'border-blue-500/30 bg-blue-500/10 text-blue-400' : 'border-slate-700 bg-slate-900 text-brand-muted'}`}>{index === 0 ? <GitBranch size={15} className="mx-auto mb-2" /> : index === 5 ? <Rocket size={15} className="mx-auto mb-2" /> : <span className="mb-2 block text-[10px]">0{index + 1}</span>}{step}</div></div>)}</div>
    </section>
    <section><h4 className="mb-4 font-semibold text-white">최근 Workflow 실행</h4><DataTable headers={['Workflow Name', 'Current Step', 'Status', 'Duration', 'Last Execution']} data={runs} renderRow={run => <><td className="px-4 py-4 font-medium text-white">{run.name}</td><td className="px-4 py-4 text-brand-muted">{run.step}</td><td className="px-4 py-4"><span className={`badge ${run.status === 'Success' ? 'badge-success' : run.status === 'Failed' ? 'badge-danger' : 'badge-warning'}`}>{run.status}</span></td><td className="px-4 py-4">{run.duration}</td><td className="px-4 py-4 text-brand-muted">{run.executed}</td></>} /></section>
    <ProviderSection title="Connected Automation Providers" kind="Automation Provider" names={['Jenkins', 'GitHub Actions', 'ArgoCD']} />
  </div>;
}
