import { useEffect, useMemo, useState } from 'react';
import { FilterSelect, PageToolbar, StatCard } from '../components/UI';
import { monitorApi, prometheusApi } from '../api/client';
import { ProviderSection } from '../components/ProviderSection';

export default function Monitoring() {
  const [metrics, setMetrics] = useState<any>(null);
  const [prometheus, setPrometheus] = useState<any>(null);
  const [source, setSource] = useState('전체');
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

  const showSystem = source === '전체' || source === 'System';
  const showPrometheus = source === '전체' || source === 'Prometheus';

  return <div className="space-y-6">
    <div><h3 className="text-xl font-semibold text-white">Metrics 수집</h3><p className="mt-1 text-sm text-brand-muted">시스템 지표와 Metrics Source 상태를 확인합니다.</p></div>
    <PageToolbar><FilterSelect value={source} onChange={event => setSource(event.target.value)}><option>전체</option><option>System</option><option>Prometheus</option><option>Grafana</option></FilterSelect></PageToolbar>
    {metrics && showSystem ? <><div className="grid grid-cols-1 gap-4 md:grid-cols-3"><StatCard label="CPU 사용률" value={`${metrics.cpu.toFixed(2)}%`} trend="안정" /><StatCard label="Memory 사용률" value={`${metrics.memory.toFixed(2)}%`} trend="상승" trendUp={false} /><StatCard label="Disk I/O" value={`${metrics.disk.toFixed(2)}%`} trend="낮음" /></div><div className="card"><h4 className="mb-4 text-sm font-bold uppercase text-brand-muted">서비스 상태</h4><div className="flex items-center justify-between"><p className="text-2xl font-bold">{metrics.services_healthy} / {metrics.services_total} <span className="text-sm font-normal text-brand-muted">정상 서비스</span></p><span className="badge badge-success">System 정상</span></div><div className="mt-4 text-xs text-brand-muted">Uptime: {metrics.uptime}</div></div></> : showSystem && <div className={`card text-sm ${metricsError ? 'border-red-500/30 text-red-400' : 'text-brand-muted'}`}>{metricsError || 'Telemetry 로딩 중...'}</div>}
    {prometheus && showPrometheus && <section><h4 className="mb-4 font-semibold text-white">Prometheus Metrics 상세</h4><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5"><StatCard label="CPU" value={prometheus.cpu_usage} /><StatCard label="Memory" value={prometheus.memory_usage} /><StatCard label="실행 중 Pod" value={`${prometheus.pods_running}`} /><StatCard label="Node 수" value={`${prometheus.nodes}`} /><StatCard label="상태" value={prometheus.status} /></div></section>}
    {(source === '전체' || source === 'Prometheus' || source === 'Grafana') && <ProviderSection title="Metrics Source" kind="Metrics Provider" names={source === 'Grafana' ? ['Grafana'] : source === 'Prometheus' ? ['Prometheus'] : ['Prometheus', 'Grafana']} />}
  </div>;
}
