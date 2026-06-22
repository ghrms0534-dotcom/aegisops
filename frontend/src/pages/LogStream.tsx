import React, { useState, useEffect } from 'react';
import { FilterSelect, PageToolbar, StatCard } from '../components/UI';
import { AlertTriangle, Info, Radio, Search } from 'lucide-react';

const LogStream = () => {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3300/ws/logs');
    ws.onmessage = (event) => {
      setLogs(prev => [...prev.slice(-49), event.data]);
    };
    return () => ws.close();
  }, []);

  return (
    <div className="flex h-full flex-col gap-6">
      <div><h3 className="text-xl font-semibold text-white">Logs Explorer</h3><p className="mt-1 text-sm text-brand-muted">서비스 로그를 검색하고 실시간 Stream을 확인합니다.</p></div>
      <PageToolbar action={<button className="btn-primary flex items-center gap-2 text-xs"><Search size={14} />로그 검색</button>}><input aria-label="로그 검색" placeholder="메시지 또는 Trace ID 검색" className="min-w-[240px] rounded-lg border border-slate-700/60 bg-slate-950/70 px-3 py-2 text-xs outline-none focus:border-blue-500/60" /><FilterSelect><option>전체 Severity</option><option>Error</option><option>Warning</option><option>Info</option></FilterSelect><FilterSelect><option>전체 Service</option><option>api-gateway</option><option>worker</option></FilterSelect></PageToolbar>
      <div className="grid gap-4 sm:grid-cols-3"><StatCard label="Error 로그" value="12" icon={AlertTriangle} /><StatCard label="Warning 로그" value="38" icon={AlertTriangle} /><StatCard label="Info 로그" value="1,248" icon={Info} /></div>
      <div className="card min-h-[420px] flex-1 overflow-y-auto border-slate-800 bg-black/80 p-4 font-mono text-sm">
        <div className="flex items-center gap-2 mb-4 text-brand-muted border-b border-slate-800 pb-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="ml-2 flex items-center gap-2 text-xs"><Radio size={12} className="text-green-400" />실시간 Log Stream</span>
        </div>
        <div className="space-y-1">
          {logs.length === 0 && <p className="text-slate-600 italic">Waiting for logs...</p>}
          {logs.map((log, i) => (
            <div key={i} className="flex gap-3">
              <span className="text-slate-600 select-none">[{new Date().toLocaleTimeString()}]</span>
              <span className={log.includes('ERROR') ? 'text-red-400' : log.includes('WARN') ? 'text-yellow-400' : 'text-green-400'}>
                {log}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LogStream;
