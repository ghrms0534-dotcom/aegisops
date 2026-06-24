import { useEffect, useState } from 'react';
import { Box, Cloud, Container, Network, Server } from 'lucide-react';
import { StatCard } from '../components/UI';
import { cloudApi } from '../api/client';

interface AwsResources {
  provider: string;
  type: string;
  status: string;
  live_connection: boolean;
  region: string;
  ec2: { total: number; running: number; stopped: number };
  vpcs: number;
  subnets: number;
  elastic_ips: number;
  load_balancers: number;
  eks_clusters: number;
  last_sync: string;
  note: string;
}

interface NcpResources {
  provider: string;
  type: string;
  status: string;
  live_connection: boolean;
  region: string;
  servers: { total: number; running: number; stopped: number };
  vpcs: number;
  subnets: number;
  public_ips: number;
  load_balancers: number;
  last_sync: string;
  note: string;
}

const topology = [
  { label: 'Frontend', detail: 'Vite · React', icon: Cloud },
  { label: 'API', detail: 'FastAPI', icon: Server },
  { label: 'Redis', detail: 'Queue', icon: Box },
  { label: 'Worker', detail: 'Agents', icon: Network },
  { label: 'Cluster', detail: 'Orchestration', icon: Container },
  { label: 'Pods', detail: 'Workloads', icon: Box },
];

const Metric = ({ label, value }: { label: string; value: string | number }) => (
  <div className="rounded-md bg-slate-900/50 px-2.5 py-2">
    <p className="text-[10px] text-brand-muted">{label}</p>
    <p className="mt-0.5 text-sm font-semibold text-white">{value}</p>
  </div>
);

export default function Infrastructure() {
  const [aws, setAws] = useState<AwsResources | null>(null);
  const [awsError, setAwsError] = useState('');
  const [ncp, setNcp] = useState<NcpResources | null>(null);
  const [ncpError, setNcpError] = useState('');

  useEffect(() => {
    cloudApi.getAws().then(response => setAws(response.data)).catch(error => setAwsError(error.message || 'AWS Provider 조회 실패'));
    cloudApi.getNcp().then(response => setNcp(response.data)).catch(error => setNcpError(error.message || 'NCP Provider 조회 실패'));
  }, []);

  return <div className="space-y-4">
    <div>
      <h3 className="text-lg font-semibold text-white">클라우드 리소스</h3>
      <p className="mt-0.5 text-xs text-brand-muted">Cloud Provider와 AegisOps 서비스 연결 구조를 확인합니다.</p>
    </div>

    <div className="grid gap-2.5 sm:grid-cols-3">
      <StatCard label="연결 서비스" value="14" icon={Network} />
      <StatCard label="정상 노드" value="8 / 9" icon={Server} />
      <StatCard label="실행 중 Pod" value="124" icon={Container} />
    </div>

    <section className="card">
      <div className="mb-3 flex items-center justify-between">
        <div><h4 className="font-semibold text-white">Service Architecture</h4><p className="mt-0.5 text-xs text-brand-muted">Traffic 및 작업 실행 경로</p></div>
        <span className="badge badge-success">Healthy</span>
      </div>
      <div className="grid gap-2 md:grid-cols-6">
        {topology.map((node, index) => <div key={node.label} className="relative rounded-lg border border-slate-700/60 bg-slate-900/65 p-2.5">
          {index < topology.length - 1 && <span className="pointer-events-none absolute -right-2 top-1/2 hidden h-px w-4 bg-blue-500/50 md:block" />}
          <div className="flex items-center gap-2"><span className="rounded-md bg-blue-500/10 p-1.5 text-blue-400"><node.icon size={15} /></span><div className="min-w-0"><h5 className="truncate text-xs font-medium text-white">{node.label}</h5><p className="truncate text-[10px] text-brand-muted">{node.detail}</p></div></div>
        </div>)}
      </div>
    </section>

    <section className="grid gap-3 xl:grid-cols-2">
      <article className="card border-amber-500/25">
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="flex items-center gap-2"><span className="rounded-md bg-blue-500/10 p-2 text-blue-400"><Cloud size={18} /></span><div><h4 className="font-semibold text-white">AWS Demo Provider</h4><p className="text-xs text-brand-muted">Simulated Cloud Infrastructure</p></div></div>
          <div className="flex gap-1.5"><span className="badge badge-warning">Demo Mode</span><span className="badge badge-warning">Simulation Mode</span></div>
        </div>
        {!aws && !awsError && <p className="text-xs text-brand-muted">AWS 데이터를 불러오는 중입니다.</p>}
        {awsError && <p className="text-xs text-red-400">{awsError}</p>}
        {aws && <div className="grid gap-2 sm:grid-cols-4">
          <Metric label="Region" value={aws.region} />
          <Metric label="EC2" value={`${aws.ec2.running}/${aws.ec2.total}`} />
          <Metric label="Network" value={`VPC ${aws.vpcs} · Subnet ${aws.subnets}`} />
          <Metric label="LB / EKS" value={`${aws.load_balancers} / ${aws.eks_clusters}`} />
        </div>}
      </article>

      <article className="card border-amber-500/25">
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="flex items-center gap-2"><span className="rounded-md bg-blue-500/10 p-2 text-blue-400"><Cloud size={18} /></span><div><h4 className="font-semibold text-white">NCP Demo Provider</h4><p className="text-xs text-brand-muted">Simulated Cloud Infrastructure</p></div></div>
          <div className="flex gap-1.5"><span className="badge badge-warning">Demo Mode</span><span className="badge badge-warning">Simulation Mode</span></div>
        </div>
        {!ncp && !ncpError && <p className="text-xs text-brand-muted">NCP 데이터를 불러오는 중입니다.</p>}
        {ncpError && <p className="text-xs text-red-400">{ncpError}</p>}
        {ncp && <div className="grid gap-2 sm:grid-cols-4">
          <Metric label="Region" value={ncp.region} />
          <Metric label="Servers" value={`${ncp.servers.running}/${ncp.servers.total}`} />
          <Metric label="Network" value={`VPC ${ncp.vpcs} · Subnet ${ncp.subnets}`} />
          <Metric label="Public IP / LB" value={`${ncp.public_ips} / ${ncp.load_balancers}`} />
        </div>}
      </article>
    </section>
  </div>;
}
