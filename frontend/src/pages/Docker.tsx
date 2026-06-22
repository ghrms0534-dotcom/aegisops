import React, { useState, useEffect } from 'react';
import { DataTable, FilterSelect, PageToolbar, StatCard } from '../components/UI';
import { Box, Boxes, StopCircle, HeartPulse } from 'lucide-react';
import { dockerApi } from '../api/client';
import { Container } from '../types';

const Docker = () => {
  const [containers, setContainers] = useState<Container[]>([]);

  useEffect(() => {
    dockerApi.getContainers().then(res => setContainers(res.data));
  }, []);

  const handleStatusChange = async (id: number, status: string) => {
    await dockerApi.updateStatus(id, status);
    // Refresh
    dockerApi.getContainers().then(res => setContainers(res.data));
  };

  return (
    <div className="space-y-6">
      <div><h3 className="text-xl font-semibold text-white">Docker Runtime</h3><p className="mt-1 text-sm text-brand-muted">Container 상태와 이미지 리소스를 관리합니다.</p></div>
      <PageToolbar action={<button className="btn-primary text-xs">새로고침</button>}><FilterSelect><option>전체 상태</option><option>Running</option><option>Stopped</option></FilterSelect><FilterSelect><option>전체 Host</option><option>docker-local</option></FilterSelect></PageToolbar>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="실행 중 Container" value={`${containers.filter(c => c.status === 'Running').length}`} icon={Boxes} /><StatCard label="중지된 Container" value={`${containers.filter(c => c.status !== 'Running').length}`} icon={StopCircle} /><StatCard label="Image 수" value="18" icon={Box} /><StatCard label="Container 정상률" value="98.4%" icon={HeartPulse} /></div>
      <DataTable 
        headers={['Container', 'Image', 'Status', 'CPU', 'Memory', 'Uptime', 'Actions']}
        data={containers}
        renderRow={(con) => (
          <>
            <td className="px-4 py-3 font-medium">{con.name}</td>
            <td className="px-4 py-3 text-brand-muted">{con.image}</td>
            <td className="px-4 py-3">
              <span className={`badge ${con.status === 'Running' ? 'badge-success' : 'badge-danger'}`}>
                {con.status}
              </span>
            </td>
            <td className="px-4 py-3">{con.cpu_usage}%</td>
            <td className="px-4 py-3">{con.mem_usage}MB</td>
            <td className="px-4 py-3">{con.uptime}</td>
            <td className="px-4 py-3">
               <div className="flex gap-2">
                 <button onClick={() => handleStatusChange(con.id, 'Running')} className="text-green-400 text-xs hover:underline">Start</button>
                 <button onClick={() => handleStatusChange(con.id, 'Stopped')} className="text-red-400 text-xs hover:underline">Stop</button>
               </div>
            </td>
          </>
        )}
      />
      <div className="card"><h4 className="font-semibold text-white">최근 Container 이벤트</h4><div className="mt-4 divide-y divide-slate-800 text-sm"><p className="py-3 text-brand-muted"><span className="mr-3 badge badge-success">Running</span>api-gateway Container가 시작되었습니다.</p><p className="py-3 text-brand-muted"><span className="mr-3 badge badge-warning">Restart</span>redis-cache 상태 검사가 재시도되었습니다.</p></div></div>
    </div>
  );
};

export default Docker;
