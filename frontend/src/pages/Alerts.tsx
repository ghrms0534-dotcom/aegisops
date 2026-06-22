import React, { useState, useEffect } from 'react';
import { DataTable, FilterSelect, PageToolbar, StatCard } from '../components/UI';
import { AlertOctagon, AlertTriangle, CheckCircle2, Siren } from 'lucide-react';
import { alertApi } from '../api/client';
import { Alert } from '../types';

const Alerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    alertApi.getAlerts().then(res => setAlerts(res.data));
  }, []);

  const handleMarkRead = async (id: number) => {
    await alertApi.markRead(id);
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, is_read: true } : a));
  };

  return (
    <div className="space-y-6">
      <div><h3 className="text-xl font-semibold text-white">Alerts & Incidents</h3><p className="mt-1 text-sm text-brand-muted">활성 경고와 Incident 대응 상태를 관리합니다.</p></div>
      <PageToolbar action={<button className="btn-primary text-xs">새로고침</button>}><FilterSelect><option>전체 Severity</option><option>Critical</option><option>Warning</option></FilterSelect><FilterSelect><option>활성 Alerts</option><option>해결됨</option></FilterSelect></PageToolbar>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="치명적 Alerts" value={`${alerts.filter(a => a.severity === 'Critical').length}`} icon={AlertOctagon} /><StatCard label="경고 Alerts" value={`${alerts.filter(a => a.severity === 'Warning').length}`} icon={AlertTriangle} /><StatCard label="해결된 Alerts" value={`${alerts.filter(a => a.is_read).length}`} icon={CheckCircle2} /><StatCard label="활성 Incidents" value="2" icon={Siren} /></div>
      <DataTable 
        headers={['Severity', 'Message', 'Source', 'Timestamp', 'Status']}
        data={alerts}
        renderRow={(alert) => (
          <>
            <td className="px-4 py-3">
              <span className={`badge ${alert.severity === 'Critical' ? 'badge-danger' : alert.severity === 'Warning' ? 'badge-warning' : 'badge-success'}`}>
                {alert.severity}
              </span>
            </td>
            <td className="px-4 py-3 font-medium">{alert.message}</td>
            <td className="px-4 py-3 text-brand-muted">{alert.source}</td>
            <td className="px-4 py-3 text-brand-muted">{alert.created_at}</td>
            <td className="px-4 py-3">
              {!alert.is_read ? (
                <button onClick={() => handleMarkRead(alert.id)} className="text-brand-accent text-xs hover:underline">Mark Read</button>
              ) : (
                <span className="text-slate-600 text-xs">Read</span>
              )}
            </td>
          </>
        )}
      />
      <div className="card"><h4 className="font-semibold text-white">Alert Timeline</h4><div className="mt-4 border-l border-slate-700 pl-4 text-sm text-brand-muted"><p className="pb-4"><span className="text-red-400">13:42</span> API Gateway latency Critical Alert 발생</p><p><span className="text-green-400">12:18</span> Memory Warning Alert 해결됨</p></div></div>
    </div>
  );
};

export default Alerts;
