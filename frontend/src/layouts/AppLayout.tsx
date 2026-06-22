import React from 'react';
import { LayoutDashboard, ShieldAlert, Container, Server, GitBranch, Activity, Terminal, Settings, UserCircle, ChevronDown, Cloud, Search, LogOut } from 'lucide-react';
import { User } from '../types';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'k8s', label: 'Kubernetes', icon: Server },
  { id: 'docker', label: 'Docker', icon: Container },
  { id: 'deployments', label: 'Deployments', icon: Activity },
  { id: 'git', label: 'Git', icon: GitBranch },
  { id: 'logs', label: 'Logs', icon: Terminal },
  { id: 'alerts', label: 'Alerts', icon: ShieldAlert },
  { id: 'admin', label: 'Admin', icon: UserCircle },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const pageMeta: Record<string, { section: string; title: string; description: string }> = {
  dashboard: { section: 'Overview', title: 'Dashboard', description: '전체 인프라 상태와 최근 운영 현황' },
  k8s: { section: 'Kubernetes', title: 'Cluster Overview', description: 'Cluster, Namespace, Workload 상태 관리' },
  docker: { section: 'Docker', title: 'Container Runtime', description: 'Container 실행 상태와 이미지 현황' },
  deployments: { section: 'Deployments', title: 'Release Pipeline', description: '배포 Pipeline 및 릴리스 이력' },
  git: { section: 'Git', title: 'Repository', description: 'Branch, Commit 및 Repository 변경 사항' },
  monitoring: { section: 'Monitoring', title: 'System Telemetry', description: '실시간 시스템 리소스 지표' },
  logs: { section: 'Logs', title: 'Live Explorer', description: '서비스 로그 검색 및 실시간 Stream' },
  alerts: { section: 'Alerts', title: 'Incident Center', description: '활성 경고와 Incident 대응 현황' },
  admin: { section: 'Admin', title: 'Access Control', description: '사용자, Role 및 접근 권한 관리' },
  settings: { section: 'Settings', title: 'Configuration', description: 'Environment 및 Integration 설정' },
};

export const AppLayout: React.FC<{ children: React.ReactNode, activePage: string, setActivePage: (id: string) => void, user: User, onLogout: () => void }> = ({ children, activePage, setActivePage, user, onLogout }) => {
  const meta = pageMeta[activePage] || pageMeta.dashboard;
  const initials = user.username.slice(0, 2).toUpperCase();
  const roleLabel = { Viewer: '조회 전용', 'DevOps Engineer': '운영 담당자', Admin: '관리자' }[user.role];

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text">
      <aside className="fixed inset-y-0 left-0 z-30 flex w-[72px] flex-col border-r border-slate-800/80 bg-brand-sidebar md:w-[260px]">
        <div className="flex h-20 items-center border-b border-slate-800/80 px-4 md:px-6">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 font-black text-white shadow-lg shadow-blue-950/60">A</div>
          <div className="ml-3 hidden md:block">
            <h1 className="text-lg font-bold tracking-tight text-white">Aegis<span className="text-blue-400">Ops</span></h1>
            <p className="text-[10px] uppercase tracking-[0.18em] text-brand-muted">Control Plane</p>
          </div>
        </div>
        
        <nav className="flex-1 space-y-1 overflow-y-auto p-3 md:p-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              title={item.label}
              className={`flex w-full items-center justify-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors md:justify-start ${
                activePage === item.id ? 'bg-blue-600/15 text-blue-400 ring-1 ring-inset ring-blue-500/20' : 'text-brand-muted hover:bg-slate-800/70 hover:text-white'
              }`}
            >
              <item.icon size={18} />
              <span className="hidden text-sm font-medium md:block">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="border-t border-slate-800/80 bg-slate-900/40 p-3 md:p-4">
          <div className="flex items-center justify-center gap-3 md:justify-start md:px-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-bold text-white">
              {initials}
            </div>
            <div className="hidden flex-1 overflow-hidden md:block">
              <p className="text-xs font-medium truncate">{user.username}</p>
              <p className="text-[10px] text-brand-muted truncate">{roleLabel}</p>
            </div>
            <button onClick={onLogout} title="Logout" aria-label="Logout" className="rounded-lg p-2 text-brand-muted transition hover:bg-red-500/10 hover:text-red-400"><LogOut size={16} /></button>
          </div>
        </div>
      </aside>

      <main className="min-h-screen pl-[72px] md:pl-[260px]">
        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-800/80 bg-brand-header/95 px-4 backdrop-blur md:px-8">
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-brand-muted">AegisOps <span className="px-1 text-slate-600">/</span> {meta.section}</p>
            <div className="flex items-baseline gap-3"><h2 className="truncate text-lg font-semibold text-white">{meta.title}</h2><p className="hidden truncate text-xs text-brand-muted xl:block">{meta.description}</p></div>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <div className="hidden items-center gap-2 rounded-lg border border-slate-700/60 bg-slate-900/60 px-3 py-2 text-xs text-brand-muted lg:flex"><Search size={14} /> Search resources</div>
            <button className="hidden items-center gap-2 rounded-lg border border-slate-700/60 bg-slate-900/60 px-3 py-2 text-xs font-medium text-slate-200 sm:flex"><Cloud size={14} className="text-blue-400" /> 운영 Environment <ChevronDown size={13} /></button>
            <div className="flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1.5 text-xs font-medium text-green-400">
              <span className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
              <span className="hidden sm:inline">Backend 연결됨</span><span className="sm:hidden">Online</span>
            </div>
          </div>
        </header>
        <div className="mx-auto w-full max-w-[1600px] p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};
