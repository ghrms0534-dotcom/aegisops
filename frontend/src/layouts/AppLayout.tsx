import React from 'react';
import {
  Activity,
  Bot,
  Cloud,
  Container,
  GitBranch,
  GitCommit,
  GitPullRequest,
  HardDrive,
  History,
  LayoutDashboard,
  ListTree,
  LogOut,
  Network,
  Plug,
  Rocket,
  Server,
  Settings,
  ShieldAlert,
  Terminal,
  UserCircle,
  Workflow,
} from 'lucide-react';
import { User } from '../types';

const menuGroups = [
  { label: 'Overview', items: [{ id: 'dashboard', label: '대시보드', icon: LayoutDashboard }, { id: 'assistant', label: 'AI Assistant', icon: Bot }] },
  { label: 'Infrastructure', items: [{ id: 'k8s', label: '클러스터', icon: Server }, { id: 'docker', label: '컨테이너', icon: Container }, { id: 'cloud_resources', label: '클라우드 리소스', icon: Cloud }, { id: 'networking', label: '네트워크', icon: Network }, { id: 'storage', label: '스토리지', icon: HardDrive }] },
  { label: 'Source Control', items: [{ id: 'git', label: '저장소', icon: GitBranch }, { id: 'branches', label: '브랜치 관리', icon: GitCommit }, { id: 'pull_requests', label: 'Pull Request', icon: GitPullRequest }, { id: 'releases', label: '릴리즈', icon: Rocket }] },
  { label: 'Delivery', items: [{ id: 'workflows', label: '파이프라인', icon: Workflow }, { id: 'deployments', label: '배포 관리', icon: Rocket }, { id: 'automation', label: '자동화', icon: Activity }] },
  { label: 'Observability', items: [{ id: 'monitoring', label: 'Metrics', icon: Activity }, { id: 'logs', label: '로그', icon: Terminal }, { id: 'alerts', label: '알림', icon: ShieldAlert }, { id: 'events', label: '이벤트', icon: ListTree }] },
  { label: 'Security', items: [{ id: 'admin', label: '접근 제어', icon: UserCircle }, { id: 'audit_logs', label: '감사 로그', icon: History }] },
  { label: 'AI Runtime', items: [{ id: 'agents', label: '작업 실행', icon: Bot }, { id: 'execution_history', label: '실행 이력', icon: History }, { id: 'agent_workflows', label: '워크플로우', icon: Workflow }] },
  { label: 'Configuration', items: [{ id: 'settings', label: '설정', icon: Settings }, { id: 'integrations', label: '연동 관리', icon: Plug }] },
];

const pageMeta: Record<string, { section: string; title: string; description: string }> = {
  dashboard: { section: 'Overview', title: 'Dashboard', description: 'Infrastructure Operations Overview' },
  assistant: { section: 'Overview', title: 'AI Assistant', description: '운영 분석과 실행 지원을 위한 Assistant 영역입니다.' },
  k8s: { section: 'Infrastructure', title: '클러스터', description: 'Cluster, Namespace, Workload 상태를 확인합니다.' },
  docker: { section: 'Infrastructure', title: '컨테이너', description: 'Container 런타임 상태와 리소스를 확인합니다.' },
  cloud_resources: { section: 'Infrastructure', title: '클라우드 리소스', description: 'Cloud Provider와 인프라 리소스 상태를 확인합니다.' },
  networking: { section: 'Infrastructure', title: '네트워크', description: 'Network 경로와 서비스 접근 상태를 확인합니다.' },
  storage: { section: 'Infrastructure', title: '스토리지', description: 'Volume과 저장소 상태를 확인합니다.' },
  git: { section: 'Source Control', title: '저장소', description: 'Branch, Commit, Pull Request와 Sync 상태를 확인합니다.' },
  branches: { section: 'Source Control', title: '브랜치 관리', description: 'Branch 상태와 변경 흐름을 확인합니다.' },
  pull_requests: { section: 'Source Control', title: 'Pull Requests', description: '코드 검토와 병합 상태를 확인합니다.' },
  releases: { section: 'Source Control', title: '릴리즈', description: 'Release 버전과 배포 준비 상태를 확인합니다.' },
  workflows: { section: 'Delivery', title: '파이프라인', description: '자동화 Pipeline 실행 상태를 확인합니다.' },
  deployments: { section: 'Delivery', title: '배포 관리', description: '배포, 롤백, Health Verification 상태를 확인합니다.' },
  automation: { section: 'Delivery', title: '자동화', description: '운영 자동화 작업과 실행 정책을 확인합니다.' },
  monitoring: { section: 'Observability', title: 'Metrics', description: '시스템 지표와 Metrics Source 상태를 확인합니다.' },
  logs: { section: 'Observability', title: '로그', description: '운영 로그와 실시간 Stream을 확인합니다.' },
  alerts: { section: 'Observability', title: '알림', description: '활성 경고와 Incident 상태를 확인합니다.' },
  events: { section: 'Observability', title: '이벤트', description: '운영 이벤트와 자동화 실행 이력을 확인합니다.' },
  admin: { section: 'Security', title: '접근 제어', description: '사용자 Role과 접근 권한을 관리합니다.' },
  audit_logs: { section: 'Security', title: '감사 로그', description: '사용자와 시스템 감사 기록을 확인합니다.' },
  agents: { section: 'AI Runtime', title: '작업 실행', description: 'Runtime Agent 상태와 현재 작업을 확인합니다.' },
  execution_history: { section: 'AI Runtime', title: '실행 이력', description: 'Agent 실행과 운영 이벤트 이력을 확인합니다.' },
  agent_workflows: { section: 'AI Runtime', title: '워크플로우', description: 'Agent 기반 운영 Workflow를 확인합니다.' },
  settings: { section: 'Configuration', title: '설정', description: 'Environment와 시스템 설정을 관리합니다.' },
  integrations: { section: 'Configuration', title: '연동 관리', description: 'Provider 연결 상태를 확인합니다.' },
};

export const AppLayout: React.FC<{
  children: React.ReactNode;
  activePage: string;
  setActivePage: (id: string) => void;
  user: User;
  onLogout: () => void;
}> = ({ children, activePage, setActivePage, user, onLogout }) => {
  const meta = pageMeta[activePage] || pageMeta.dashboard;
  const initials = user.username.slice(0, 2).toUpperCase();
  const roleLabel = { Viewer: '조회 전용', 'DevOps Engineer': '운영 담당자', Admin: '관리자' }[user.role];

  return (
    <div className="h-screen overflow-hidden bg-brand-bg text-brand-text">
      <aside className="fixed inset-y-0 left-0 z-30 flex h-screen w-[56px] flex-col border-r border-slate-800/80 bg-brand-sidebar md:w-[210px]">
        <div className="flex h-12 items-center border-b border-slate-800/80 px-2.5 md:px-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-sm font-black text-white shadow-lg shadow-blue-950/60">A</div>
          <div className="ml-2.5 hidden md:block">
            <h1 className="text-base font-bold tracking-tight text-white">Aegis<span className="text-blue-400">Ops</span></h1>
            <p className="text-[10px] uppercase tracking-[0.18em] text-brand-muted">INFRA OPERATIONS CENTER</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-2">
          {menuGroups.map((group, groupIndex) => <div key={group.label} className={groupIndex ? 'mt-2 border-t border-slate-800/70 pt-2' : ''}>
            <p className="mb-1 hidden px-2 text-[8px] font-semibold uppercase tracking-[0.14em] text-slate-600 md:block">{group.label}</p>
            <div className="space-y-0.5">{group.items.map(item => {
              const Icon = item.icon;
              return <button key={item.id} onClick={() => setActivePage(item.id)} title={item.label} className={`flex w-full items-center justify-center gap-2 rounded-md px-2 py-1 text-left transition-colors md:justify-start ${activePage === item.id ? 'bg-blue-600/15 text-blue-400 ring-1 ring-inset ring-blue-500/20' : 'text-brand-muted hover:bg-slate-800/70 hover:text-white'}`}><Icon size={14} /><span className="hidden text-[11px] font-medium md:block">{item.label}</span></button>;
            })}</div>
          </div>)}
        </nav>

        <div className="border-t border-slate-800/80 bg-slate-900/40 p-2.5 md:p-3">
          <div className="flex items-center justify-center gap-2 md:justify-start md:px-1">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-[11px] font-bold text-white">{initials}</div>
            <div className="hidden flex-1 overflow-hidden md:block"><p className="truncate text-xs font-medium">{user.username}</p><p className="truncate text-[10px] text-brand-muted">{roleLabel}</p></div>
            <button onClick={onLogout} title="Logout" aria-label="Logout" className="rounded-lg p-1.5 text-brand-muted transition hover:bg-red-500/10 hover:text-red-400"><LogOut size={14} /></button>
          </div>
        </div>
      </aside>

      <main className="h-screen overflow-hidden pl-[56px] md:pl-[210px]">
        <header className="flex h-10 items-center justify-between border-b border-slate-800/80 bg-brand-header/95 px-3 backdrop-blur md:px-4">
          <div className="min-w-0">
            <p className="truncate text-[10px] font-medium text-brand-muted">AegisOps <span className="px-1 text-slate-600">/</span> {meta.section}</p>
            <div className="flex items-baseline gap-2"><h2 className="truncate text-sm font-semibold text-white">{meta.title}</h2><p className="hidden truncate text-[11px] text-brand-muted xl:block">{meta.description}</p></div>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-1.5 md:gap-2">
            <span className="hidden rounded-full border border-blue-500/20 bg-blue-500/10 px-2 py-1 text-[11px] font-medium text-blue-400 lg:inline-flex">클러스터: 프로덕션</span>
            {['API 온라인', '에이전트 준비됨', '클러스터 정상'].map(status => <span key={status} className="inline-flex items-center gap-1 rounded-full border border-green-500/20 bg-green-500/10 px-2 py-1 text-[10px] font-medium text-green-400"><span className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_6px_#22c55e]" />{status}</span>)}
          </div>
        </header>
        <div className="h-[calc(100vh-2.5rem)] overflow-y-auto p-2.5 md:p-3">{children}</div>
      </main>
    </div>
  );
};
