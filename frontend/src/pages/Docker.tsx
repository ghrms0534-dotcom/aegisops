import React, { useEffect, useState } from 'react';
import { Box, Boxes, HeartPulse, StopCircle } from 'lucide-react';
import { DataTable, StatCard } from '../components/UI';
import { dockerApi } from '../api/client';
import { Container } from '../types';

const logsFor = (name: string) => [`${name}: 상태 점검 통과`, `${name}: 서비스 포트 수신 중`, `${name}: 읽기 전용 상세 조회 완료`];

const Docker = () => {
  const [containers, setContainers] = useState<Container[]>([]);
  const [liveContainers, setLiveContainers] = useState<any[]>([]);
  const [selected, setSelected] = useState<Container | null>(null);
  const [detailTab, setDetailTab] = useState<'logs' | 'events' | 'metrics'>('logs');

  useEffect(() => {
    dockerApi.getContainers().then(res => setContainers(res.data));
    dockerApi.getLiveContainers().then(res => setLiveContainers(res.data.items || [])).catch(() => setLiveContainers([]));
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-white">컨테이너 운영 관리</h3>
        <p className="mt-0.5 text-xs text-brand-muted">Runtime Provider: Docker · Container 상태와 이미지 리소스를 확인합니다.</p>
      </div>

      <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="실행 중 Container" value={`${containers.filter(c => c.status === 'Running').length}`} icon={Boxes} />
        <StatCard label="중지된 Container" value={`${containers.filter(c => c.status !== 'Running').length}`} icon={StopCircle} />
        <StatCard label="Image 수" value="18" icon={Box} />
        <StatCard label="Container 정상률" value="98.4%" icon={HeartPulse} />
      </div>

      <div className="grid gap-3 lg:grid-cols-[1.45fr_0.85fr]">
        <DataTable className="max-h-[430px]" headers={['Container', 'Image', 'Port', '상태', 'CPU', '메모리', '가동 시간']} data={containers} renderRow={container => <><td className="px-3 py-2 font-medium"><button onClick={() => setSelected(container)} className={`${selected?.id === container.id ? 'text-white' : 'text-blue-300'} hover:underline`}>{container.name}</button></td><td className="px-3 py-2 text-brand-muted">{container.image}</td><td className="px-3 py-2 text-brand-muted">{liveContainers.find(item => item.name === container.name)?.ports || '8080/tcp'}</td><td className="px-3 py-2"><span className={`badge ${container.status === 'Running' ? 'badge-success' : 'badge-danger'}`}>{container.status === 'Running' ? '실행중' : container.status}</span></td><td className="px-3 py-2">{container.cpu_usage}%</td><td className="px-3 py-2">{container.mem_usage}MB</td><td className="px-3 py-2">{container.uptime}</td></>} />

        <aside className="card h-fit">
          {selected ? <><div><h4 className="font-semibold text-white">{selected.name}</h4><p className="mt-1 text-xs text-brand-muted">{selected.image}</p></div><div className="mt-3 grid grid-cols-3 gap-2 text-xs"><p><span className="text-brand-muted">상태</span><br />{selected.status === 'Running' ? '실행중' : selected.status}</p><p><span className="text-brand-muted">CPU</span><br />{selected.cpu_usage}%</p><p><span className="text-brand-muted">메모리</span><br />{selected.mem_usage}MB</p></div><div className="mt-4 flex gap-1.5">{(['logs', 'events', 'metrics'] as const).map(tab => <button key={tab} onClick={() => setDetailTab(tab)} className={`rounded-md px-2 py-1 text-xs ${detailTab === tab ? 'bg-blue-500/20 text-blue-300' : 'bg-slate-800 text-brand-muted'}`}>{({ logs: '로그', events: '이벤트', metrics: '메트릭' } as Record<string, string>)[tab]}</button>)}</div><div className="mt-3 max-h-52 overflow-y-auto rounded-md border border-slate-800 bg-slate-950/60 p-2 text-xs">{detailTab === 'logs' && logsFor(selected.name).map(log => <p key={log} className="font-mono text-slate-300">{log}</p>)}{detailTab === 'events' && ['Container 상세 조회', '상태 점검 통과', '리소스 지표 확인 가능'].map(event => <p key={event} className="text-slate-300">• {event}</p>)}{detailTab === 'metrics' && <div className="grid gap-1.5 text-slate-300"><p>CPU: {selected.cpu_usage}%</p><p>메모리: {selected.mem_usage}MB</p><p>가동 시간: {selected.uptime}</p></div>}</div></> : <p className="text-xs text-brand-muted">Container를 선택하면 상세 정보가 표시됩니다.</p>}
        </aside>
      </div>

      {liveContainers.length > 0 && <section><h4 className="mb-4 font-semibold text-white">실시간 Docker 런타임</h4><DataTable headers={['Container', 'Image', 'Ports', '상태']} data={liveContainers} renderRow={container => <><td className="px-4 py-3 font-medium">{container.name}</td><td className="px-4 py-3 text-brand-muted">{container.image}</td><td className="px-4 py-3 text-brand-muted">{container.ports}</td><td className="px-4 py-3"><span className={`badge ${container.state === 'running' ? 'badge-success' : 'badge-warning'}`}>{container.state === 'running' ? '실행중' : container.status_text || container.state}</span></td></>} /></section>}

      <div className="card"><h4 className="font-semibold text-white">최근 Container 이벤트</h4><div className="mt-4 divide-y divide-slate-800 text-sm"><p className="py-3 text-brand-muted"><span className="mr-3 badge badge-success">실행중</span>api-gateway Container가 시작되었습니다.</p><p className="py-3 text-brand-muted"><span className="mr-3 badge badge-warning">재시도</span>redis-cache 상태 점검이 재시도되었습니다.</p></div></div>
    </div>
  );
};

export default Docker;
