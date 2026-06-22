import React, { useState, useEffect } from 'react';
import { DataTable, FilterSelect, PageToolbar, StatCard } from '../components/UI';
import { CheckCircle2, Clock3, Rocket, XCircle } from 'lucide-react';
import { deployApi } from '../api/client';

const Deployments = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    deployApi.getHistory().then(res => setHistory(res.data));
  }, []);

  const handleTrigger = async () => {
    const app = prompt('App Name:');
    const ver = prompt('Version:');
    if (app && ver) {
      await deployApi.trigger({ app_name: app, version: ver });
      alert('Deployment triggered!');
    }
  };

  return (
    <div className="space-y-6">
      <div><h3 className="text-xl font-semibold text-white">Deployment Pipeline</h3><p className="mt-1 text-sm text-brand-muted">릴리스 상태와 배포 이력을 추적합니다.</p></div>
      <PageToolbar action={<button onClick={handleTrigger} className="btn-primary text-sm">새 릴리스 배포</button>}><FilterSelect><option>전체 Environment</option><option>Production</option><option>Staging</option></FilterSelect><FilterSelect><option>전체 상태</option><option>Success</option><option>Failed</option></FilterSelect></PageToolbar>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="배포 성공률" value="99.2%" icon={CheckCircle2} /><StatCard label="마지막 배포" value="4분 전" icon={Clock3} /><StatCard label="실패한 배포" value="2" icon={XCircle} /><StatCard label="진행 중 Pipeline" value="1" icon={Rocket} /></div>
      <div className="card"><div className="flex items-center justify-between"><h4 className="font-semibold text-white">Release Timeline</h4><span className="badge badge-success">Production</span></div><div className="mt-5 grid grid-cols-4 gap-2 text-center text-xs"><div className="rounded-lg bg-green-500/10 p-3 text-green-400">Build 완료</div><div className="rounded-lg bg-green-500/10 p-3 text-green-400">Test 통과</div><div className="rounded-lg bg-blue-500/10 p-3 text-blue-400">Deploy 진행</div><div className="rounded-lg bg-slate-800 p-3 text-brand-muted">Verify 대기</div></div></div>
      <DataTable 
        headers={['ID', 'App Name', 'Version', 'Status', 'Timestamp']}
        data={history}
        renderRow={(dep) => (
          <>
            <td className="px-4 py-3">{dep.id}</td>
            <td className="px-4 py-3 font-medium">{dep.name}</td>
            <td className="px-4 py-3">{dep.version}</td>
            <td className="px-4 py-3">
              <span className={`badge ${dep.status === 'Success' ? 'badge-success' : 'badge-danger'}`}>
                {dep.status}
              </span>
            </td>
            <td className="px-4 py-3 text-brand-muted">{new Date(dep.created_at).toLocaleString()}</td>
          </>
        )}
      />
    </div>
  );
};

export default Deployments;
