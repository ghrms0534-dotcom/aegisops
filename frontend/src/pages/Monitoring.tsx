import React, { useState, useEffect } from 'react';
import { StatCard } from '../components/UI';
import { monitorApi } from '../api/client';

const Monitoring = () => {
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      const res = await monitorApi.getMetrics();
      setMetrics(res.data);
    };
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!metrics) return <div className="text-brand-muted">Loading telemetry...</div>;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">System Telemetry</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="CPU Usage" value={`${metrics.cpu.toFixed(2)}%`} trend="Stable" />
        <StatCard label="Memory Usage" value={`${metrics.memory.toFixed(2)}%`} trend="Rising" trendUp={false} />
        <StatCard label="Disk I/O" value={`${metrics.disk.toFixed(2)}%`} trend="Low" />
      </div>
      <div className="card">
        <h4 className="text-sm font-bold uppercase text-brand-muted mb-4">Service Status</h4>
        <div className="flex justify-between items-center">
          <p className="text-2xl font-bold">{metrics.services_healthy} / {metrics.services_total} <span className="text-sm font-normal text-brand-muted">services healthy</span></p>
          <span className="badge badge-success">System Operational</span>
        </div>
        <div className="mt-4 text-xs text-brand-muted">Uptime: {metrics.uptime}</div>
      </div>
    </div>
  );
};

export default Monitoring;
