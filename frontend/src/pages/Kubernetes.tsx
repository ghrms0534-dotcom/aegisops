import React, { useState, useEffect } from 'react';
import { ChartPanel, DataTable, FilterSelect, PageToolbar, StatCard } from '../components/UI';
import { Boxes, CheckCircle2, Cpu, Server } from 'lucide-react';
import { k8sApi } from '../api/client';
import { Cluster, Pod } from '../types';

const Kubernetes = () => {
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [selectedCluster, setSelectedCluster] = useState<number | null>(null);
  const [pods, setPods] = useState<Pod[]>([]);

  useEffect(() => {
    k8sApi.getClusters().then(res => setClusters(res.data));
  }, []);

  useEffect(() => {
    if (selectedCluster !== null) {
      // In this mock, we just fetch pods for the first namespace of the cluster
      // In a real app we'd first fetch namespaces
      k8sApi.getPods(selectedCluster).then(res => setPods(res.data));
    }
  }, [selectedCluster]);

  const handleRestart = async (id: number) => {
    await k8sApi.restartPod(id);
    alert('Pod restart triggered');
    // Refresh pods
    if (selectedCluster !== null) k8sApi.getPods(selectedCluster).then(res => setPods(res.data));
  };

  return (
    <div className="space-y-6">
      <div><h3 className="text-xl font-semibold text-white">Kubernetes Dashboard</h3><p className="mt-1 text-sm text-brand-muted">Cluster Workload와 Pod 상태를 관리합니다.</p></div>
      <PageToolbar action={<button className="btn-primary text-xs">새로고침</button>}><FilterSelect><option>전체 Cluster</option>{clusters.map(c => <option key={c.id}>{c.name}</option>)}</FilterSelect><FilterSelect><option>전체 Namespace</option><option>default</option><option>kube-system</option></FilterSelect></PageToolbar>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="Cluster" value={`${clusters.length}`} icon={Server} /><StatCard label="실행 중 Pod" value={`${pods.length || 24}`} icon={Boxes} /><StatCard label="정상 Workload" value="18 / 20" icon={CheckCircle2} /><StatCard label="평균 CPU" value="46%" icon={Cpu} /></div>
      <div className="grid gap-4 md:grid-cols-2"><ChartPanel title="Cluster CPU 사용량" value="46%" percent={46} /><ChartPanel title="Cluster Memory 사용량" value="61%" percent={61} color="bg-violet-500" /></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card">
          <h4 className="text-sm font-bold text-white mb-4">Cluster 선택</h4>
          <div className="space-y-2">
            {clusters.map(c => (
              <button 
                key={c.id} 
                onClick={() => setSelectedCluster(c.id)}
                className={`w-full text-left p-3 rounded-md transition-colors ${selectedCluster === c.id ? 'bg-brand-accent text-slate-900' : 'bg-slate-800 hover:bg-slate-700'}`}
              >
                <p className="font-medium">{c.name}</p>
                <p className="text-xs opacity-70">{c.region} • {c.status}</p>
              </button>
            ))}
          </div>
        </div>
        <div className="lg:col-span-2">
          {selectedCluster ? (
            <>
              <h4 className="text-sm font-bold text-white mb-4">Cluster {selectedCluster}의 Pod</h4>
              <DataTable 
                headers={['Pod Name', 'Status', 'Restarts', 'CPU', 'Mem']}
                data={pods}
                renderRow={(pod) => (
                  <>
                    <td className="px-4 py-3 font-medium">{pod.name}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${pod.status === 'Running' ? 'badge-success' : 'badge-danger'}`}>
                        {pod.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">{pod.restarts}</td>
                    <td className="px-4 py-3">{pod.cpu_limit}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <span>{pod.mem_limit}</span>
                        <button onClick={() => handleRestart(pod.id)} className="text-brand-accent text-xs hover:underline">Restart</button>
                      </div>
                    </td>
                  </>
                )}
              />
            </>
          ) : (
            <div className="h-64 flex items-center justify-center text-brand-muted italic">
              Select a cluster to view pods
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Kubernetes;
