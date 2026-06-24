import React, { useEffect, useState } from 'react';
import { Boxes, CheckCircle2, Cpu, Server } from 'lucide-react';
import { DataTable, StatCard, TimeSeriesPanel } from '../components/UI';
import { dashboardApi, k8sApi } from '../api/client';
import { Cluster, Pod } from '../types';

const trend = [32, 38, 35, 42, 48, 44, 51, 46, 53, 49, 57, 52];
const namespaces = ['default', 'kube-system', 'aegisops', 'monitoring'];
const nodeRows = [
  { name: 'Master Node', status: '정상', cpu: '42%', memory: '61%', pods: 18 },
  { name: 'Worker Node A', status: '정상', cpu: '37%', memory: '55%', pods: 14 },
  { name: 'Worker Node B', status: '정상', cpu: '48%', memory: '64%', pods: 16 },
];

const clusterName = (name: string) => ({ 'prod-us-east': 'Production Cluster', 'staging-eu-west': 'Staging Cluster' }[name] || name);
const podName = (name: string) => ({ 'api-gateway-v1': 'API Gateway Service', 'auth-service-a': 'Authentication Service' }[name] || name);
const nodeName = (index: number) => ['Master Node', 'Worker Node A', 'Worker Node B'][index % 3];

const podDetails = (pod: Pod, index = 0) => ({
  namespace: namespaces[index % namespaces.length],
  age: `${12 + index * 3}분`,
  node: nodeName(index),
  image: `aegisops/${pod.name}:demo`,
  events: ['노드 스케줄 완료', '로컬 캐시에서 이미지 확인', '컨테이너 시작'],
  logs: [`${podName(pod.name)}: 상태 점검 통과`, `${podName(pod.name)}: 요청 지연 42ms`, `${podName(pod.name)}: 로그 스트림 활성`],
});

const Kubernetes = () => {
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [selectedCluster, setSelectedCluster] = useState<number | null>(null);
  const [pods, setPods] = useState<Pod[]>([]);
  const [selectedPodId, setSelectedPodId] = useState<number | null>(null);
  const [detailTab, setDetailTab] = useState<'info' | 'logs' | 'events' | 'metrics'>('info');
  const [nodes, setNodes] = useState(0);

  useEffect(() => {
    k8sApi.getClusters().then(res => {
      setClusters(res.data);
      if (res.data[0]) setSelectedCluster(res.data[0].id);
    });
    dashboardApi.getOverview().then(res => setNodes(res.data.services.kubernetes.nodes)).catch(() => setNodes(0));
  }, []);

  useEffect(() => {
    if (selectedCluster !== null) {
      k8sApi.getPods(selectedCluster).then(res => setPods(res.data));
      setSelectedPodId(null);
      setDetailTab('info');
    }
  }, [selectedCluster]);

  const selectedPod = pods.find(pod => pod.id === selectedPodId) || null;
  const selectedDetail = selectedPod ? podDetails(selectedPod, pods.indexOf(selectedPod)) : null;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-white">클러스터 운영 관리</h3>
        <p className="mt-0.5 text-xs text-brand-muted">Provider: Kubernetes · 클러스터 Workload와 Pod 상태를 확인합니다.</p>
      </div>

      <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="클러스터 수" value={`${clusters.length}`} icon={Server} />
        <StatCard label="실행 중 Pod" value={`${pods.length}`} icon={Boxes} />
        <StatCard label="노드 수" value={`${nodes}`} icon={CheckCircle2} />
        <StatCard label="평균 CPU" value="46%" icon={Cpu} />
      </div>

      <div className="grid gap-2 md:grid-cols-4">
        <TimeSeriesPanel title="CPU" value="46%" data={trend} />
        <TimeSeriesPanel title="메모리" value="61%" data={trend.map(v => v + 12)} color="bg-violet-500" />
        <TimeSeriesPanel title="디스크" value="38%" data={trend.map(v => v - 8)} color="bg-cyan-500" />
        <TimeSeriesPanel title="네트워크" value="72Mbps" data={trend.map(v => v + 22)} color="bg-emerald-500" />
      </div>

      <section>
        <h4 className="mb-1.5 font-semibold text-white">노드 상태</h4>
        <DataTable className="max-h-44" headers={['name', '상태', 'cpu', '메모리', 'pods']} data={nodeRows} renderRow={node => <><td className="px-3 py-2 font-medium text-white">{node.name}</td><td className="px-3 py-2"><span className="badge badge-success">{node.status}</span></td><td className="px-3 py-2">{node.cpu}</td><td className="px-3 py-2">{node.memory}</td><td className="px-3 py-2">{node.pods}</td></>} />
      </section>

      <div className={selectedPod ? 'grid grid-cols-1 gap-2 lg:grid-cols-[1.5fr_0.9fr]' : 'grid grid-cols-1 gap-2'}>
        <div>
          <div className="mb-2 grid gap-2 md:grid-cols-2">
            <div className="card">
              <h4 className="mb-2 text-sm font-bold text-white">클러스터 목록</h4>
              <div className="space-y-1.5">
                {clusters.map(cluster => <button key={cluster.id} onClick={() => setSelectedCluster(cluster.id)} className={`w-full rounded-md px-2 py-1.5 text-left text-xs transition-colors ${selectedCluster === cluster.id ? 'bg-brand-accent text-slate-950' : 'bg-slate-800 hover:bg-slate-700'}`}><span className="font-medium">{clusterName(cluster.name)}</span><span className="ml-2 opacity-70">{cluster.region}</span></button>)}
              </div>
            </div>
            <div className="card">
              <h4 className="mb-2 text-sm font-bold text-white">네임스페이스</h4>
              <div className="flex flex-wrap gap-1.5">{namespaces.map(ns => <span key={ns} className="badge badge-success">{ns}</span>)}</div>
            </div>
          </div>

          {selectedCluster ? (
            <>
              <h4 className="mb-2 text-sm font-bold text-white">파드 상태</h4>
              <DataTable className="max-h-[340px]" headers={['name', 'namespace', '상태', 'restarts', 'cpu', '메모리', 'age', 'node']} data={pods.map((pod, index) => ({ ...pod, detail: podDetails(pod, index) }))} renderRow={pod => <><td className="px-3 py-2 font-medium"><button onClick={() => setSelectedPodId(pod.id)} className={`${selectedPod?.id === pod.id ? 'text-white' : 'text-blue-300'} hover:underline`}>{podName(pod.name)}</button></td><td className="px-3 py-2 text-brand-muted">{pod.detail.namespace}</td><td className="px-3 py-2"><span className={`badge ${pod.status === 'Running' ? 'badge-success' : 'badge-danger'}`}>{pod.status === 'Running' ? '실행중' : pod.status}</span></td><td className="px-3 py-2">{pod.restarts}</td><td className="px-3 py-2">{pod.cpu_limit}</td><td className="px-3 py-2">{pod.mem_limit}</td><td className="px-3 py-2 text-brand-muted">{pod.detail.age}</td><td className="px-3 py-2 text-brand-muted">{pod.detail.node}</td></>} />
            </>
          ) : <div className="card text-xs text-brand-muted">클러스터를 선택하면 Pod 목록이 표시됩니다.</div>}
        </div>

        {selectedPod && selectedDetail && (
          <aside className="card h-fit">
            <div><h4 className="font-semibold text-white">{podName(selectedPod.name)}</h4><p className="mt-1 text-xs text-brand-muted">{selectedDetail.namespace} · {selectedDetail.node}</p></div>
            <div className="mt-3 flex gap-1.5">{(['info', 'logs', 'events', 'metrics'] as const).map(tab => <button key={tab} onClick={() => setDetailTab(tab)} className={`rounded-md px-2 py-1 text-xs ${detailTab === tab ? 'bg-blue-500/20 text-blue-300' : 'bg-slate-800 text-brand-muted'}`}>{({ info: '정보', logs: '로그', events: '이벤트', metrics: '메트릭' } as Record<string, string>)[tab]}</button>)}</div>
            <div className="mt-3 max-h-56 overflow-y-auto rounded-md border border-slate-800 bg-slate-950/60 p-2 text-xs">
              {detailTab === 'info' && <div className="grid gap-1.5 text-slate-300"><p>image: {selectedDetail.image}</p><p>상태: {selectedPod.status === 'Running' ? '실행중' : selectedPod.status}</p><p>재시작: {selectedPod.restarts}</p></div>}
              {detailTab === 'logs' && selectedDetail.logs.map(log => <p key={log} className="font-mono text-slate-300">{log}</p>)}
              {detailTab === 'events' && selectedDetail.events.map(event => <p key={event} className="text-slate-300">• {event}</p>)}
              {detailTab === 'metrics' && <div className="grid gap-1.5 text-slate-300"><p>CPU: {selectedPod.cpu_limit}</p><p>메모리: {selectedPod.mem_limit}</p><p>Age: {selectedDetail.age}</p></div>}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

export default Kubernetes;
