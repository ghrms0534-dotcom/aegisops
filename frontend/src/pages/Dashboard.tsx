import { useCallback, useEffect, useRef, useState } from 'react';
import { Box, CheckCircle2, Cpu, GitBranch, HardDrive, MemoryStick, Network, Server, Workflow } from 'lucide-react';

import { dashboardApi } from '../api/client';
import { DataTable, StatCard } from '../components/UI';
import { DashboardEvent, useDashboardWebSocket } from '../hooks/useDashboardWebSocket';

interface SourceState {
  source: string;
  status: 'ok' | 'error';
  error: string | null;
}

interface Summary {
  pods: SourceState & { total: number; running: number; failed: number };
  containers: SourceState & { running: number };
  deployments: SourceState & { total: number; available: number };
  system: SourceState & { cpu_percent: number; memory_percent: number; disk_percent: number };
  git: SourceState & { branch: string | null; modified_files: number };
  cluster: SourceState & { context: string | null; nodes: number };
}

interface Overview {
  status: 'healthy' | 'degraded';
  updated_at: string;
  summary: Summary;
  services: {
    github: { status: string; repositories: number };
    prometheus: { status: string; cpu_usage: string; memory_usage: string; pods_running: number; nodes: number };
    docker: { status: string; containers_running: number };
    kubernetes: { status: string; pods_running: number; nodes: number };
    jenkins: { status: string; jobs_total: number; last_build_result: string };
    cloud: { status: string; provider: string };
  };
}

const display = (state: SourceState, value: string) => state.status === 'ok' ? value : '연결 실패';
const detail = (state: SourceState) => state.status === 'ok' ? `source: ${state.source}` : state.error || '조회 실패';

const snapshots = (overview: Overview) => ({
  kubernetes: { pods: overview.summary.pods, deployments: overview.summary.deployments, cluster: overview.summary.cluster, service: overview.services.kubernetes },
  docker: { summary: overview.summary.containers, service: overview.services.docker },
  github: overview.services.github,
  prometheus: overview.services.prometheus,
  jenkins: overview.services.jenkins,
  cloud: overview.services.cloud,
  system: { metrics: overview.summary.system, status: overview.status },
  git: overview.summary.git,
});

function ResourceGauge({ label, value, state, color, updated, onClick }: { label: string; value: number; state: SourceState; color: string; updated: string; onClick: () => void }) {
  return <div className="card cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500/50" onClick={onClick} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onClick(); } }} role="button" tabIndex={0}><div className="flex items-center justify-between"><p className="text-sm font-medium text-slate-200">{label}</p><span className="text-lg font-bold text-white">{state.status === 'ok' ? `${value.toFixed(1)}%` : '연결 실패'}</span></div><div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-800"><div className={`h-full rounded-full ${state.status === 'ok' ? color : 'bg-red-500'}`} style={{ width: `${state.status === 'ok' ? Math.min(value, 100) : 100}%` }} /></div><p className={`mt-3 truncate text-xs ${state.status === 'ok' ? 'text-brand-muted' : 'text-red-400'}`}>{detail(state)} · {updated}</p></div>;
}

const Dashboard = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(true);
  const [refreshFailed, setRefreshFailed] = useState(false);
  const [changedServices, setChangedServices] = useState<string[]>([]);
  const [updatedAt, setUpdatedAt] = useState<Record<string, string>>({});
  const [recentEvents, setRecentEvents] = useState<DashboardEvent[]>([]);
  const overviewRef = useRef<Overview | null>(null);
  const requestInFlight = useRef(false);
  const eventSnapshots = useRef<Record<string, string>>({});
  const highlightTimer = useRef<number | null>(null);
  const { status: liveStatus, latestEvent } = useDashboardWebSocket();

  const markChanges = useCallback((services: string[], timestamp: string, events: DashboardEvent[]) => {
    if (!services.length) return;
    setChangedServices(services);
    setUpdatedAt(previous => {
      const next = { ...previous };
      services.forEach(service => { next[service] = timestamp; });
      return next;
    });
    if (events.length) setRecentEvents(previous => [...events, ...previous].slice(0, 20));
    if (highlightTimer.current !== null) window.clearTimeout(highlightTimer.current);
    highlightTimer.current = window.setTimeout(() => setChangedServices([]), 1000);
  }, []);

  const refresh = useCallback(() => {
    if (requestInFlight.current) return;
    requestInFlight.current = true;
    setRefreshing(true);
    dashboardApi.getOverview().then(response => {
      const next: Overview = response.data;
      const previous = overviewRef.current;
      if (previous) {
        const before = snapshots(previous);
        const after = snapshots(next);
        const changed = Object.keys(after).filter(service => JSON.stringify(before[service as keyof typeof before]) !== JSON.stringify(after[service as keyof typeof after]));
        markChanges(changed, next.updated_at, changed.map(service => ({
          type: 'dashboard_status_changed', service, status: service in next.services ? next.services[service as keyof Overview['services']].status : next.status,
          severity: 'info', message: `${service} data updated`, timestamp: next.updated_at, data: {},
        })));
      } else {
        setUpdatedAt(Object.fromEntries(Object.keys(snapshots(next)).map(service => [service, next.updated_at])));
      }
      overviewRef.current = next;
      setOverview(next);
      setError('');
      setRefreshFailed(false);
    }).catch(requestError => {
      setError(requestError.response?.data?.detail || requestError.message || 'Dashboard 조회 실패');
      setRefreshFailed(true);
    }).finally(() => {
      requestInFlight.current = false;
      setRefreshing(false);
    });
  }, [markChanges]);

  useEffect(() => {
    if (liveStatus === 'connected') return;
    refresh();
    const interval = window.setInterval(refresh, 10000);
    return () => window.clearInterval(interval);
  }, [liveStatus, refresh]);

  useEffect(() => {
    if (!latestEvent) return;
    const current = overviewRef.current;
    if (!current) return;
    const serviceExists = Boolean(current && latestEvent.service in current.services);
    const currentService = serviceExists ? current!.services[latestEvent.service as keyof Overview['services']] : null;
    const comparable = currentService ? Object.fromEntries(['status', ...Object.keys(latestEvent.data)].map(key => [key, key === 'status' ? currentService.status : (currentService as Record<string, unknown>)[key]])) : null;
    const nextComparable = { status: latestEvent.status, ...latestEvent.data };
    const before = currentService ? JSON.stringify(comparable) : eventSnapshots.current[latestEvent.service] || '';
    const after = JSON.stringify(nextComparable);
    eventSnapshots.current[latestEvent.service] = after;
    if (before === after) return;

    if (current && serviceExists) {
      const service = latestEvent.service as keyof Overview['services'];
      let summary = current.summary;
      if (service === 'docker' && typeof latestEvent.data.containers_running === 'number') {
        summary = { ...summary, containers: { ...summary.containers, running: latestEvent.data.containers_running } };
      }
      if (service === 'kubernetes') {
        summary = {
          ...summary,
          pods: { ...summary.pods, running: typeof latestEvent.data.pods_running === 'number' ? latestEvent.data.pods_running : summary.pods.running },
          cluster: { ...summary.cluster, nodes: typeof latestEvent.data.nodes === 'number' ? latestEvent.data.nodes : summary.cluster.nodes },
        };
      }
      const next = {
        ...current,
        summary,
        services: {
          ...current.services,
          [service]: { ...current.services[service], status: latestEvent.status, ...latestEvent.data },
        },
      } as Overview;
      overviewRef.current = next;
      setOverview(next);
    }
    markChanges([latestEvent.service], latestEvent.timestamp, [latestEvent]);
  }, [latestEvent, markChanges]);

  useEffect(() => () => {
    if (highlightTimer.current !== null) window.clearTimeout(highlightTimer.current);
  }, []);

  const summary = overview?.summary;

  if (!summary && !error) return <div className="flex min-h-[360px] items-center justify-center text-brand-muted"><span className="mr-3 h-2.5 w-2.5 animate-pulse rounded-full bg-blue-500" />로컬 Runtime 상태를 조회하는 중입니다.</div>;
  if (!summary) return <div className="card border-red-500/30 text-red-400"><h3 className="font-semibold">Dashboard 연결 실패</h3><p className="mt-2 text-sm">{error}</p></div>;

  const cardUpdated = (service: string) => updatedAt[service] ? `Last updated: ${new Date(updatedAt[service]).toLocaleTimeString()}` : 'Waiting for update';
  const cardDetail = (service: string, base = '') => `${base ? `${base} · ` : ''}${cardUpdated(service)}${changedServices.includes(service) ? ' · Status changed' : ''}`;
  const lastEvent = recentEvents[0] ? `Last event: ${new Date(recentEvents[0].timestamp).toLocaleTimeString()}` : 'Waiting for events';
  const liveLabel = liveStatus === 'connected' ? 'Live Connected' : liveStatus === 'reconnecting' ? 'Reconnecting...' : liveStatus === 'fallback' ? 'Polling fallback active' : 'Live Disconnected';
  const liveBadge = liveStatus === 'connected' ? 'badge-success' : liveStatus === 'disconnected' ? 'badge-danger' : 'badge-warning';

  const deploymentRate = summary.deployments.total ? (summary.deployments.available / summary.deployments.total) * 100 : 0;
  const runtimeSources = [
    summary.pods.status === 'ok' && summary.cluster.status === 'ok',
    summary.containers.status === 'ok',
    summary.git.status === 'ok',
    summary.system.status === 'ok',
  ];
  const connectedRuntimeSources = runtimeSources.filter(Boolean).length;
  const rows = [
    { name: 'Kubernetes Pods', state: summary.pods, value: `${summary.pods.running} / ${summary.pods.total} running` },
    { name: 'Docker Containers', state: summary.containers, value: `${summary.containers.running} running` },
    { name: 'Kubernetes Deployments', state: summary.deployments, value: `${summary.deployments.available} / ${summary.deployments.total} available` },
    { name: 'Git Repository', state: summary.git, value: `${summary.git.branch || '-'} · ${summary.git.modified_files} modified` },
    { name: 'Kubernetes Cluster', state: summary.cluster, value: `${summary.cluster.context || '-'} · ${summary.cluster.nodes} nodes` },
  ];
  const failures = rows.filter(row => row.state.status !== 'ok');

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div><h1 className="text-2xl font-bold tracking-tight text-white">AI Operations Overview</h1><p className="mt-1 text-sm text-brand-muted">Windows 로컬 PC의 Docker, Kubernetes, Git 및 시스템 상태를 실시간으로 조회합니다.</p></div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-brand-muted"><span className={`badge ${liveBadge}`}>{liveLabel}</span>{refreshing && <span className="badge badge-warning">Refreshing...</span>}{changedServices.length > 0 && <span className="badge badge-warning">Status changed</span>}{refreshFailed && <span className="text-red-400">Data temporarily unavailable</span>}<span>{lastEvent}</span></div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active Pods" value={display(summary.pods, `${summary.pods.running} / ${summary.pods.total}`)} icon={Server} detail={cardDetail('kubernetes', detail(summary.pods))} highlight={changedServices.includes('kubernetes')} onClick={() => onNavigate('k8s')} />
        <StatCard label="Running Containers" value={display(summary.containers, String(summary.containers.running))} icon={Box} detail={cardDetail('docker', detail(summary.containers))} highlight={changedServices.includes('docker')} onClick={() => onNavigate('docker')} />
        <StatCard label="Deployment Success" value={display(summary.deployments, summary.deployments.total ? `${deploymentRate.toFixed(1)}%` : '0 / 0')} icon={CheckCircle2} detail={cardDetail('kubernetes', detail(summary.deployments))} highlight={changedServices.includes('kubernetes')} onClick={() => onNavigate('deployments')} />
        <StatCard label="CPU 사용량" value={display(summary.system, `${summary.system.cpu_percent.toFixed(1)}%`)} icon={Cpu} detail={cardDetail('system', detail(summary.system))} highlight={changedServices.includes('system')} onClick={() => onNavigate('monitoring')} />
        <StatCard label="Memory 사용량" value={display(summary.system, `${summary.system.memory_percent.toFixed(1)}%`)} icon={MemoryStick} detail={cardDetail('system', detail(summary.system))} highlight={changedServices.includes('system')} onClick={() => onNavigate('monitoring')} />
        <StatCard label="Disk 사용량" value={display(summary.system, `${summary.system.disk_percent.toFixed(1)}%`)} icon={HardDrive} detail={cardDetail('system', detail(summary.system))} highlight={changedServices.includes('system')} onClick={() => onNavigate('monitoring')} />
        <StatCard label="Git Branch" value={display(summary.git, summary.git.branch || 'detached')} icon={GitBranch} detail={cardDetail('git', detail(summary.git))} highlight={changedServices.includes('git')} onClick={() => onNavigate('git')} />
        <StatCard label="Modified Files" value={display(summary.git, String(summary.git.modified_files))} icon={Workflow} detail={cardDetail('git', detail(summary.git))} highlight={changedServices.includes('git')} onClick={() => onNavigate('git')} />
        <StatCard label="Runtime Sources" value={`${connectedRuntimeSources} / ${runtimeSources.length} connected`} icon={Network} detail={cardDetail('system', 'Kubernetes · Docker · Git · System')} onClick={() => onNavigate('k8s')} />
        <StatCard label="GitHub" value={overview.services.github.status === 'connected' ? 'Connected' : overview.services.github.status === 'configured' ? 'Configured' : 'Not Configured'} icon={GitBranch} detail={cardDetail('github')} highlight={changedServices.includes('github')} onClick={() => onNavigate('git')} />
        <StatCard label="Prometheus Metrics" value={`${overview.services.prometheus.cpu_usage} CPU · ${overview.services.prometheus.memory_usage} MEM`} icon={Cpu} detail={cardDetail('prometheus')} highlight={changedServices.includes('prometheus')} onClick={() => onNavigate('monitoring')} />
        <StatCard label="Jenkins CI/CD" value={`${overview.services.jenkins.jobs_total} jobs · ${overview.services.jenkins.last_build_result}`} icon={Workflow} detail={cardDetail('jenkins')} highlight={changedServices.includes('jenkins')} onClick={() => onNavigate('workflows')} />
        <StatCard label="Cloud Mock" value={overview.services.cloud.provider} icon={Network} detail={cardDetail('cloud')} highlight={changedServices.includes('cloud')} onClick={() => onNavigate('cloud_resources')} />
        <StatCard label="System Health" value={overview.status === 'healthy' ? 'Healthy' : 'Degraded'} icon={CheckCircle2} detail={cardDetail('system')} highlight={changedServices.includes('system')} onClick={() => onNavigate('monitoring')} />
      </div>

      <div className="grid gap-4 md:grid-cols-3"><ResourceGauge label="CPU Usage" value={summary.system.cpu_percent} state={summary.system} color="bg-blue-500" updated={cardUpdated('system')} onClick={() => onNavigate('monitoring')} /><ResourceGauge label="Memory Usage" value={summary.system.memory_percent} state={summary.system} color="bg-violet-500" updated={cardUpdated('system')} onClick={() => onNavigate('monitoring')} /><ResourceGauge label="Disk Usage" value={summary.system.disk_percent} state={summary.system} color="bg-cyan-500" updated={cardUpdated('system')} onClick={() => onNavigate('monitoring')} /></div>

      <section className="card"><div className="mb-4 flex items-center justify-between"><div><h3 className="font-semibold text-white">Recent Events</h3><p className="mt-1 text-xs text-brand-muted">실제 값이 변경된 이벤트만 표시합니다.</p></div><span className="text-xs text-brand-muted">{recentEvents.length} / 20</span></div>{recentEvents.length ? <div className="space-y-2">{recentEvents.map(event => <div key={`${event.timestamp}-${event.service}`} className="flex items-center gap-3 rounded-lg border border-slate-700/40 bg-slate-900/35 px-3 py-2 text-sm"><span className={`h-2 w-2 shrink-0 rounded-full ${event.severity === 'error' ? 'bg-red-500' : event.severity === 'warning' ? 'bg-amber-400' : 'bg-blue-400'}`} /><span className="shrink-0 text-xs text-brand-muted">[{new Date(event.timestamp).toLocaleTimeString()}]</span><span className="min-w-0 flex-1 truncate text-slate-200" title={event.message}>{event.message}</span><span className={`badge ${event.severity === 'error' ? 'badge-danger' : event.severity === 'warning' ? 'badge-warning' : 'badge-success'}`}>{event.service}</span></div>)}</div> : <p className="text-sm text-brand-muted">상태 변경 이벤트를 기다리는 중입니다.</p>}</section>

      <section>
          <div className="mb-4 flex items-center justify-between">
            <div><h3 className="font-semibold text-white">Live Runtime Sources</h3><p className="mt-1 text-xs text-brand-muted">read-only 로컬 명령 조회 결과</p></div>
            <span className={`badge ${failures.length ? 'badge-warning' : 'badge-success'}`}>{failures.length ? `${failures.length} source failed` : 'All sources online'}</span>
          </div>
          <DataTable 
            headers={['Resource', 'Source', 'Status', 'Live Value', 'Error']}
            data={rows}
            renderRow={(row) => (
              <>
                <td className="px-4 py-4 font-medium text-white">{row.name}</td>
                <td className="px-4 py-4 text-brand-muted">{row.state.source}</td>
                <td className="px-4 py-4"><span className={`badge ${row.state.status === 'ok' ? 'badge-success' : 'badge-danger'}`}>{row.state.status === 'ok' ? 'Connected' : '연결 실패'}</span></td>
                <td className="px-4 py-4">{row.state.status === 'ok' ? row.value : '-'}</td>
                <td className="max-w-xs truncate px-4 py-4 text-xs text-red-400" title={row.state.error || ''}>{row.state.error || '-'}</td>
              </>
            )}
          />
      </section>

      {failures.length > 0 && <section className="card border-amber-500/25"><h3 className="font-semibold text-amber-400">부분 연결 실패</h3><p className="mt-2 text-sm text-brand-muted">실패한 도구의 가짜 값은 표시하지 않습니다. Docker Desktop, kind Cluster 또는 Git 실행 상태를 확인하세요.</p></section>}
      </div>
  );
};

export default Dashboard;
