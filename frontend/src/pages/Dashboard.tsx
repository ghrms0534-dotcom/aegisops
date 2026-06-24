import { useCallback, useEffect, useRef, useState } from 'react';
import { AlertTriangle, Box, CheckCircle2, Cpu, GitBranch, HardDrive, MemoryStick, Network, Server, Workflow } from 'lucide-react';

import { dashboardApi } from '../api/client';
import { DataTable, StatCard, TimeSeriesPanel } from '../components/UI';
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
const detail = (state: SourceState) => state.status === 'ok' ? `출처: ${state.source}` : state.error || '조회 실패';

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

const seedAlerts = [
  { level: 'Critical', title: '젠킨스 실패', detail: 'production-deploy 빌드 실패' },
  { level: 'Warning', title: '높은 메모리 사용량', detail: '메모리 사용량이 경고 기준을 넘었습니다.' },
  { level: 'Warning', title: '높은 CPU 사용량', detail: '로컬 런타임의 CPU 사용량이 증가 중입니다.' },
  { level: 'Info', title: '동기화 대기', detail: 'GitOps 동기화 검증을 기다리는 중입니다.' },
];
const seedLogs = [
  '[jenkins] production-deploy 빌드 실패',
  '[kubernetes] 파드 목록 갱신',
  '[docker] 컨테이너 런타임 요약 갱신',
  '[git] 저장소 상태 확인',
  '[prometheus] 모의 지표 수집',
];
const trend = [31, 36, 34, 42, 47, 45, 53, 49, 55, 51, 58, 62];

const severityLabel = (level: string) => ({ Critical: '위험', Warning: '경고', Info: '정보', error: '위험', warning: '경고', info: '정보' }[level] || level);

const Dashboard = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(true);
  const [refreshFailed, setRefreshFailed] = useState(false);
  const [changedServices, setChangedServices] = useState<string[]>([]);
  const [updatedAt, setUpdatedAt] = useState<Record<string, string>>({});
  const [recentEvents, setRecentEvents] = useState<DashboardEvent[]>([]);
  const [alerts, setAlerts] = useState(seedAlerts);
  const [logs, setLogs] = useState(seedLogs);
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

  const addLog = useCallback((message: string) => {
    setLogs(previous => [`[${new Date().toLocaleTimeString()}] ${message}`, ...previous].slice(0, 30));
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
    addLog(`[${latestEvent.service}] ${latestEvent.message}`);
    if (latestEvent.severity !== 'info') {
      setAlerts(previous => [{ level: latestEvent.severity === 'error' ? 'Critical' : 'Warning', title: latestEvent.message, detail: latestEvent.service }, ...previous].slice(0, 8));
    }
    markChanges([latestEvent.service], latestEvent.timestamp, [latestEvent]);
  }, [latestEvent, markChanges, addLog]);

  useEffect(() => () => {
    if (highlightTimer.current !== null) window.clearTimeout(highlightTimer.current);
  }, []);

  useEffect(() => {
    if (!overview) return;
    localStorage.setItem('aegis_dashboard_context', JSON.stringify({
      updated_at: overview.updated_at,
      cluster_status: overview.summary.cluster,
      pods: overview.summary.pods,
      cpu_usage: overview.summary.system.cpu_percent,
      memory_usage: overview.summary.system.memory_percent,
      containers: overview.summary.containers,
      services: overview.services,
      recent_events: recentEvents.slice(0, 10),
      alerts: alerts.slice(0, 10),
      api_status: overview.status,
      agent_status: liveStatus,
    }));
  }, [overview, recentEvents, alerts, liveStatus]);

  const summary = overview?.summary;

  if (!summary && !error) return <div className="flex min-h-[360px] items-center justify-center text-brand-muted"><span className="mr-3 h-2.5 w-2.5 animate-pulse rounded-full bg-blue-500" />로컬 Runtime 상태를 조회하는 중입니다.</div>;
  if (!summary) return <div className="card border-red-500/30 text-red-400"><h3 className="font-semibold">Dashboard 연결 실패</h3><p className="mt-2 text-sm">{error}</p></div>;

  const cardUpdated = (service: string) => updatedAt[service] ? `최종 업데이트: ${new Date(updatedAt[service]).toLocaleTimeString()}` : '업데이트 대기 중';
  const cardDetail = (service: string, base = '') => `${base ? `${base} · ` : ''}${cardUpdated(service)}${changedServices.includes(service) ? ' · 상태 변경' : ''}`;
  const lastEvent = recentEvents[0] ? `마지막 이벤트: ${new Date(recentEvents[0].timestamp).toLocaleTimeString()}` : '이벤트 대기 중';
  const liveLabel = liveStatus === 'connected' ? '실시간 연결됨' : liveStatus === 'reconnecting' ? '재연결 중...' : liveStatus === 'fallback' ? '폴링 대체 동작 중' : '실시간 연결 끊김';
  const liveBadge = liveStatus === 'connected' ? 'badge-success' : liveStatus === 'disconnected' ? 'badge-danger' : 'badge-warning';

  const deploymentRate = summary.deployments.total ? (summary.deployments.available / summary.deployments.total) * 100 : 0;
  const rows = [
    { name: 'Kubernetes 파드', state: summary.pods, value: `${summary.pods.running} / ${summary.pods.total} 실행 중` },
    { name: 'Docker 컨테이너', state: summary.containers, value: `${summary.containers.running} 실행 중` },
    { name: 'Kubernetes 배포', state: summary.deployments, value: `${summary.deployments.available} / ${summary.deployments.total} 사용 가능` },
    { name: 'Git 저장소', state: summary.git, value: `${summary.git.branch || '-'} · ${summary.git.modified_files}개 수정됨` },
    { name: 'Kubernetes 클러스터', state: summary.cluster, value: `${summary.cluster.context || '-'} · ${summary.cluster.nodes}개 노드` },
  ];
  const failures = rows.filter(row => row.state.status !== 'ok');

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div><h1 className="text-xl font-bold tracking-tight text-white">Dashboard</h1><p className="mt-0.5 text-xs text-brand-muted">Infrastructure Operations Overview</p></div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-brand-muted"><span className={`badge ${liveBadge}`}>{liveLabel}</span>{refreshing && <span className="badge badge-warning">갱신 중...</span>}{changedServices.length > 0 && <span className="badge badge-warning">상태 변경</span>}{refreshFailed && <span className="text-red-400">데이터를 일시적으로 사용할 수 없습니다.</span>}<span>{lastEvent}</span></div>
      </div>

      <div className="grid grid-cols-2 gap-2 xl:grid-cols-4">
        <StatCard label="CPU 사용량" value={display(summary.system, `${summary.system.cpu_percent.toFixed(1)}%`)} icon={Cpu} detail={cardDetail('system', detail(summary.system))} highlight={changedServices.includes('system')} onClick={() => onNavigate('monitoring')} />
        <StatCard label="메모리 사용량" value={display(summary.system, `${summary.system.memory_percent.toFixed(1)}%`)} icon={MemoryStick} detail={cardDetail('system', detail(summary.system))} highlight={changedServices.includes('system')} onClick={() => onNavigate('monitoring')} />
        <StatCard label="디스크 사용량" value={display(summary.system, `${summary.system.disk_percent.toFixed(1)}%`)} icon={HardDrive} detail={cardDetail('system', detail(summary.system))} highlight={changedServices.includes('system')} onClick={() => onNavigate('monitoring')} />
        <StatCard label="네트워크" value="72Mbps" icon={Network} detail={cardDetail('system', '추세')} onClick={() => onNavigate('monitoring')} />
      </div>

      <div className="grid gap-2 md:grid-cols-4"><TimeSeriesPanel title="CPU" value={`${summary.system.cpu_percent.toFixed(1)}%`} data={trend} /><TimeSeriesPanel title="메모리" value={`${summary.system.memory_percent.toFixed(1)}%`} data={trend.map(v => v + 9)} color="bg-violet-500" /><TimeSeriesPanel title="디스크" value={`${summary.system.disk_percent.toFixed(1)}%`} data={trend.map(v => v - 11)} color="bg-cyan-500" /><TimeSeriesPanel title="네트워크" value="72Mbps" data={trend.map(v => v + 18)} color="bg-emerald-500" /></div>

      <div className="grid grid-cols-2 gap-2 xl:grid-cols-6">
        <StatCard label="파드" value={display(summary.pods, `${summary.pods.running}/${summary.pods.total}`)} icon={Server} detail={cardUpdated('kubernetes')} onClick={() => onNavigate('k8s')} />
        <StatCard label="컨테이너" value={display(summary.containers, String(summary.containers.running))} icon={Box} detail={cardUpdated('docker')} onClick={() => onNavigate('docker')} />
        <StatCard label="배포 성공률" value={display(summary.deployments, summary.deployments.total ? `${deploymentRate.toFixed(1)}%` : '0/0')} icon={CheckCircle2} detail={cardUpdated('kubernetes')} onClick={() => onNavigate('deployments')} />
        <StatCard label="Git 브랜치" value={display(summary.git, summary.git.branch || 'detached')} icon={GitBranch} detail={`${summary.git.modified_files}개 수정`} onClick={() => onNavigate('git')} />
        <StatCard label="Jenkins" value={`${overview.services.jenkins.jobs_total} jobs`} icon={Workflow} detail={overview.services.jenkins.last_build_result} onClick={() => onNavigate('workflows')} />
        <StatCard label="알림" value={`${alerts.length}개`} icon={AlertTriangle} detail="위험 · 경고 · 정보" onClick={() => onNavigate('alerts')} />
      </div>

      <section className="card">
        <h3 className="font-semibold text-white">AI 분석 요약</h3>
        <div className="mt-3 grid gap-2 text-xs md:grid-cols-3">
          <p className="rounded-md border border-slate-800 bg-slate-900/40 px-2 py-1.5 text-slate-300">주요 위험: {alerts.filter(alert => alert.level !== 'Info').length}건 · Jenkins/리소스 경고 우선 확인</p>
          <p className="rounded-md border border-slate-800 bg-slate-900/40 px-2 py-1.5 text-slate-300">추천 탐색: 알림 → 로그 → 클러스터/Container 상세 순서</p>
          <p className="rounded-md border border-blue-500/20 bg-blue-500/5 px-2 py-1.5 text-blue-300">실제 인프라 변경 없이 상태 조회 중심으로 표시합니다.</p>
        </div>
      </section>

      <section className="grid gap-2 xl:grid-cols-2">
        <div className="card h-[260px] overflow-hidden"><div className="mb-2.5 flex items-center justify-between"><h3 className="font-semibold text-white">알림 센터</h3><span className="text-xs text-brand-muted">위험 / 경고 / 정보</span></div><div className="max-h-[210px] space-y-1.5 overflow-y-auto pr-1">{alerts.map((alert, index) => <div key={`${alert.title}-${index}`} className="flex items-center gap-2 rounded-md border border-slate-700/40 bg-slate-900/35 px-2 py-1.5 text-xs"><span className={`badge ${alert.level === 'Critical' ? 'badge-danger' : alert.level === 'Warning' ? 'badge-warning' : 'badge-success'}`}>{severityLabel(alert.level)}</span><div className="min-w-0"><p className="truncate text-slate-200">{alert.title}</p><p className="truncate text-[11px] text-brand-muted">{alert.detail}</p></div></div>)}</div></div>
        <div className="card h-[260px] overflow-hidden"><div className="mb-2.5 flex items-center justify-between"><h3 className="font-semibold text-white">라이브 로그</h3><span className="text-xs text-brand-muted">{logs.length}줄</span></div><div className="max-h-[220px] space-y-0.5 overflow-y-auto rounded-md border border-slate-800 bg-slate-950/60 p-2 font-mono text-[11px] text-slate-300">{logs.map((line, index) => <p key={`${line}-${index}`} className="whitespace-pre-wrap break-words">{line}</p>)}</div></div>
      </section>

      <section className="card max-h-[300px] overflow-hidden"><div className="mb-2.5 flex items-center justify-between"><div><h3 className="font-semibold text-white">최근 이벤트</h3><p className="mt-0.5 text-[11px] text-brand-muted">실제 값이 변경된 이벤트만 표시합니다.</p></div><span className="text-xs text-brand-muted">{recentEvents.length} / 20</span></div>{recentEvents.length ? <div className="max-h-60 space-y-1.5 overflow-y-auto pr-1">{recentEvents.map(event => <div key={`${event.timestamp}-${event.service}`} className="flex items-center gap-2 rounded-md border border-slate-700/40 bg-slate-900/35 px-2 py-1.5 text-xs"><span className={`h-2 w-2 shrink-0 rounded-full ${event.severity === 'error' ? 'bg-red-500' : event.severity === 'warning' ? 'bg-amber-400' : 'bg-blue-400'}`} /><span className="shrink-0 text-[11px] text-brand-muted">[{new Date(event.timestamp).toLocaleTimeString()}]</span><span className="min-w-0 flex-1 truncate text-slate-200" title={event.message}>{event.message}</span><span className={`badge ${event.severity === 'error' ? 'badge-danger' : event.severity === 'warning' ? 'badge-warning' : 'badge-success'}`}>{event.service}</span></div>)}</div> : <p className="text-xs text-brand-muted">상태 변경 이벤트를 기다리는 중입니다.</p>}</section>

      <section>
          <div className="mb-2.5 flex items-center justify-between">
            <div><h3 className="font-semibold text-white">Live Runtime Sources</h3><p className="mt-1 text-xs text-brand-muted">read-only 로컬 명령 조회 결과</p></div>
            <span className={`badge ${failures.length ? 'badge-warning' : 'badge-success'}`}>{failures.length ? `${failures.length}개 소스 실패` : '모든 소스 연결됨'}</span>
          </div>
          <DataTable 
            headers={['리소스', '출처', '상태', '실시간 값', '오류']}
            data={rows}
            renderRow={(row) => (
              <>
                <td className="px-3 py-2 font-medium text-white">{row.name}</td>
                <td className="px-3 py-2 text-brand-muted">{row.state.source}</td>
                <td className="px-3 py-2"><span className={`badge ${row.state.status === 'ok' ? 'badge-success' : 'badge-danger'}`}>{row.state.status === 'ok' ? '연결됨' : '연결 실패'}</span></td>
                <td className="px-3 py-2">{row.state.status === 'ok' ? row.value : '-'}</td>
                <td className="max-w-xs truncate px-3 py-2 text-[11px] text-red-400" title={row.state.error || ''}>{row.state.error || '-'}</td>
              </>
            )}
          />
      </section>

      {failures.length > 0 && <section className="card border-amber-500/25"><h3 className="font-semibold text-amber-400">부분 연결 실패</h3><p className="mt-2 text-sm text-brand-muted">실패한 도구의 가짜 값은 표시하지 않습니다. Docker Desktop, kind 클러스터 또는 Git 실행 상태를 확인하세요.</p></section>}
      </div>
  );
};

export default Dashboard;
