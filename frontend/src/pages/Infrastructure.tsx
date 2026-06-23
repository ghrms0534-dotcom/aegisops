import { useEffect, useState } from 'react';
import { ArrowDown, Box, Cloud, Container, Network, Server } from 'lucide-react';
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
  { label: 'API Backend', detail: 'FastAPI · 8000', icon: Server },
  { label: 'Redis Queue', detail: 'Task Broker', icon: Box },
  { label: 'Worker Agent', detail: '6 Agents Active', icon: Network },
  { label: 'Orchestration Cluster', detail: '2 Clusters', icon: Container },
  { label: 'Pods', detail: '124 Running', icon: Box },
];

export default function Infrastructure() {
  const [aws, setAws] = useState<AwsResources | null>(null);
  const [awsError, setAwsError] = useState('');
  const [ncp, setNcp] = useState<NcpResources | null>(null);
  const [ncpError, setNcpError] = useState('');

  useEffect(() => {
    cloudApi.getAws().then(response => setAws(response.data)).catch(requestError => setAwsError(requestError.message || 'AWS Mock Provider 조회 실패'));
    cloudApi.getNcp().then(response => setNcp(response.data)).catch(requestError => setNcpError(requestError.message || 'NCP Mock Provider 조회 실패'));
  }, []);

  return <div className="space-y-6">
    <div><h3 className="text-xl font-semibold text-white">Cloud Infrastructure Management</h3><p className="mt-1 text-sm text-brand-muted">Cloud 리소스와 AegisOps 서비스 연결 구조를 관리합니다.</p></div>
    <div className="grid gap-4 sm:grid-cols-3"><StatCard label="Connected Services" value="14" icon={Network} /><StatCard label="Healthy Nodes" value="8 / 9" icon={Server} /><StatCard label="Running Pods" value="124" icon={Container} /></div>
    <section className="card overflow-hidden"><div className="mb-6 flex items-center justify-between"><div><h4 className="font-semibold text-white">Service Architecture</h4><p className="mt-1 text-xs text-brand-muted">Traffic 및 작업 실행 경로</p></div><span className="badge badge-success">Healthy</span></div>
      <div className="mx-auto flex max-w-3xl flex-col items-center">{topology.map((node, index) => <div key={node.label} className="flex w-full flex-col items-center"><div className="flex w-full max-w-md items-center gap-4 rounded-xl border border-slate-700/60 bg-slate-900/65 p-4 shadow-lg shadow-black/10 transition hover:border-blue-500/40"><span className="rounded-lg bg-blue-500/10 p-3 text-blue-400"><node.icon size={20} /></span><div className="flex-1"><h5 className="font-medium text-white">{node.label}</h5><p className="mt-1 text-xs text-brand-muted">{node.detail}</p></div><span className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" /></div>{index < topology.length - 1 && <div className="flex h-10 items-center text-blue-500/60"><ArrowDown size={18} /></div>}</div>)}</div>
    </section>
    <section><div className="mb-4"><h4 className="font-semibold text-white">AWS Demo Provider</h4><p className="mt-1 text-xs text-brand-muted">데모용 클라우드 인프라 상태</p></div>
      {!aws && !awsError && <div className="card text-sm text-brand-muted">AWS Mock 데이터를 불러오는 중입니다.</div>}
      {awsError && <div className="card border-red-500/30 text-sm text-red-400">{awsError}</div>}
      {aws && <article className="card border-amber-500/25"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><div className="flex items-center gap-3"><span className="rounded-lg bg-blue-500/10 p-3 text-blue-400"><Cloud size={22} /></span><div><h5 className="text-lg font-semibold text-white">{aws.provider}</h5><p className="text-xs text-brand-muted">{aws.type}</p></div></div></div><div className="flex flex-wrap gap-2"><span className="badge badge-warning">Mock Mode</span><span className="badge badge-warning">Demo Environment</span></div></div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><div className="rounded-lg bg-slate-900/50 p-3"><p className="text-xs text-brand-muted">Region</p><p className="mt-1 font-semibold text-white">{aws.region}</p></div><div className="rounded-lg bg-slate-900/50 p-3"><p className="text-xs text-brand-muted">EC2 Instances</p><p className="mt-1 font-semibold text-white">{aws.ec2.total}</p><p className="mt-1 text-xs text-green-400">Running {aws.ec2.running} · Stopped {aws.ec2.stopped}</p></div><div className="rounded-lg bg-slate-900/50 p-3"><p className="text-xs text-brand-muted">Network</p><p className="mt-1 font-semibold text-white">VPC {aws.vpcs} · Subnets {aws.subnets}</p><p className="mt-1 text-xs text-brand-muted">Elastic IPs {aws.elastic_ips}</p></div><div className="rounded-lg bg-slate-900/50 p-3"><p className="text-xs text-brand-muted">Managed Resources</p><p className="mt-1 font-semibold text-white">Load Balancers {aws.load_balancers}</p><p className="mt-1 text-xs text-brand-muted">EKS Clusters {aws.eks_clusters} · {aws.last_sync}</p></div></div>
        <p className="mt-5 rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm font-medium text-amber-400">Demo Cloud Environment</p>
      </article>}
    </section>
    <section><div className="mb-4"><h4 className="font-semibold text-white">NCP Demo Provider</h4><p className="mt-1 text-xs text-brand-muted">데모용 클라우드 인프라 상태</p></div>
      {!ncp && !ncpError && <div className="card text-sm text-brand-muted">NCP Mock 데이터를 불러오는 중입니다.</div>}
      {ncpError && <div className="card border-red-500/30 text-sm text-red-400">{ncpError}</div>}
      {ncp && <article className="card border-amber-500/25"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><div className="flex items-center gap-3"><span className="rounded-lg bg-blue-500/10 p-3 text-blue-400"><Cloud size={22} /></span><div><h5 className="text-lg font-semibold text-white">{ncp.provider}</h5><p className="text-xs text-brand-muted">{ncp.type}</p></div></div></div><div className="flex flex-wrap gap-2"><span className="badge badge-warning">Mock Mode</span><span className="badge badge-warning">Demo Environment</span></div></div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><div className="rounded-lg bg-slate-900/50 p-3"><p className="text-xs text-brand-muted">Region</p><p className="mt-1 font-semibold text-white">{ncp.region}</p></div><div className="rounded-lg bg-slate-900/50 p-3"><p className="text-xs text-brand-muted">Servers</p><p className="mt-1 font-semibold text-white">{ncp.servers.total}</p><p className="mt-1 text-xs text-green-400">Running {ncp.servers.running} · Stopped {ncp.servers.stopped}</p></div><div className="rounded-lg bg-slate-900/50 p-3"><p className="text-xs text-brand-muted">Network</p><p className="mt-1 font-semibold text-white">VPC {ncp.vpcs} · Subnets {ncp.subnets}</p><p className="mt-1 text-xs text-brand-muted">Public IPs {ncp.public_ips}</p></div><div className="rounded-lg bg-slate-900/50 p-3"><p className="text-xs text-brand-muted">Load Balancers</p><p className="mt-1 font-semibold text-white">{ncp.load_balancers}</p><p className="mt-1 text-xs text-brand-muted">{ncp.last_sync}</p></div></div>
        <p className="mt-5 rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm font-medium text-amber-400">Demo Cloud Environment</p>
      </article>}
    </section>
  </div>;
}
