import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Info, Radio } from 'lucide-react';
import { FilterSelect, PageToolbar, StatCard } from '../components/UI';

const serviceOptions = ['전체', 'api-gateway', 'worker', 'jenkins'];

export default function LogStream() {
  const [logs, setLogs] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [severity, setSeverity] = useState('전체');
  const [service, setService] = useState('전체');

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000/ws/logs');
    ws.onmessage = event => setLogs(prev => [...prev.slice(-49), event.data]);
    return () => ws.close();
  }, []);

  const filtered = useMemo(() => logs.filter(log => {
    const severityOk = severity === '전체' || log.toLowerCase().includes(severity.toLowerCase());
    const serviceOk = service === '전체' || log.toLowerCase().includes(service.toLowerCase());
    const queryOk = !query || log.toLowerCase().includes(query.toLowerCase());
    return severityOk && serviceOk && queryOk;
  }), [logs, query, severity, service]);

  return <div className="flex h-full flex-col gap-6">
    <div><h3 className="text-xl font-semibold text-white">로그 탐색</h3><p className="mt-1 text-sm text-brand-muted">서비스 로그를 검색하고 실시간 Stream을 확인합니다.</p></div>
    <PageToolbar><input aria-label="로그 검색" value={query} onChange={event => setQuery(event.target.value)} placeholder="메시지 또는 Trace ID 검색" className="min-w-[240px] rounded-lg border border-slate-700/60 bg-slate-950/70 px-3 py-2 text-xs outline-none focus:border-blue-500/60" /><FilterSelect value={severity} onChange={event => setSeverity(event.target.value)}><option>전체</option><option>ERROR</option><option>WARN</option><option>INFO</option></FilterSelect><FilterSelect value={service} onChange={event => setService(event.target.value)}>{serviceOptions.map(option => <option key={option}>{option}</option>)}</FilterSelect></PageToolbar>
    <div className="grid gap-4 sm:grid-cols-3"><StatCard label="Error 로그" value={`${logs.filter(log => log.includes('ERROR')).length}`} icon={AlertTriangle} /><StatCard label="Warning 로그" value={`${logs.filter(log => log.includes('WARN')).length}`} icon={AlertTriangle} /><StatCard label="Info 로그" value={`${logs.filter(log => log.includes('INFO')).length}`} icon={Info} /></div>
    <div className="card min-h-[420px] flex-1 overflow-y-auto border-slate-800 bg-black/80 p-4 font-mono text-sm"><div className="mb-4 flex items-center gap-2 border-b border-slate-800 pb-2 text-brand-muted"><div className="h-3 w-3 rounded-full bg-red-500" /><div className="h-3 w-3 rounded-full bg-yellow-500" /><div className="h-3 w-3 rounded-full bg-green-500" /><span className="ml-2 flex items-center gap-2 text-xs"><Radio size={12} className="text-green-400" />실시간 Log Stream</span></div><div className="space-y-1">{filtered.length === 0 && <p className="italic text-slate-600">표시할 로그가 없습니다.</p>}{filtered.map((log, i) => <div key={`${log}-${i}`} className="flex gap-3"><span className="select-none text-slate-600">[{new Date().toLocaleTimeString()}]</span><span className={log.includes('ERROR') ? 'text-red-400' : log.includes('WARN') ? 'text-yellow-400' : 'text-green-400'}>{log}</span></div>)}</div></div>
  </div>;
}
