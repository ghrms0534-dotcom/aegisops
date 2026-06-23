import React, { useState, useEffect } from 'react';
import { StatCard } from '../components/UI';
import { monitorApi, prometheusApi } from '../api/client';
import { ProviderSection } from '../components/ProviderSection';

const Monitoring = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [prometheus, setPrometheus] = useState<any>(null);
  const [metricsError, setMetricsError] = useState('');

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await monitorApi.getMetrics();
        setMetrics(res.data);
        setMetricsError('');
        prometheusApi.getMetrics().then(prometheusRes => setPrometheus(prometheusRes.data)).catch(() => setPrometheus(null));
      } catch {
        setMetricsError('Telemetry를 불러올 수 없습니다.');
      }
    };
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div><h3 className="text-xl font-semibold text-white">Metrics Collection</h3><p className="mt-1 text-sm text-brand-muted">시스템 지표와 Metrics Source 상태를 확인합니다.</p></div>
      {metrics ? <><div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
      </div></> : <div className={`card text-sm ${metricsError ? 'border-red-500/30 text-red-400' : 'text-brand-muted'}`}>{metricsError || 'Loading telemetry...'}</div>}
      {prometheus && <section><h4 className="mb-4 font-semibold text-white">Prometheus Metrics Detail</h4><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5"><StatCard label="CPU" value={prometheus.cpu_usage} /><StatCard label="Memory" value={prometheus.memory_usage} /><StatCard label="Running Pods" value={`${prometheus.pods_running}`} /><StatCard label="Nodes" value={`${prometheus.nodes}`} /><StatCard label="Status" value={prometheus.status} /></div></section>}
      <ProviderSection title="Metrics Source" kind="Metrics Provider" names={['Prometheus', 'Grafana']} />
    </div>
  );
};

export default Monitoring;
