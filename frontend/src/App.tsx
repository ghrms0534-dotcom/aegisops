import React, { useCallback, useEffect, useState } from 'react';
import { AppLayout } from './layouts/AppLayout';
import Dashboard from './pages/Dashboard';
import LogStream from './pages/LogStream';
import Kubernetes from './pages/Kubernetes';
import Docker from './pages/Docker';
import Deployments from './pages/Deployments';
import Git from './pages/Git';
import Branches from './pages/Branches';
import PullRequests from './pages/PullRequests';
import Releases from './pages/Releases';
import Automation from './pages/Automation';
import Monitoring from './pages/Monitoring';
import Alerts from './pages/Alerts';
import Admin from './pages/Admin';
import AuditLogs from './pages/AuditLogs';
import Settings from './pages/Settings';
import AIAgents from './pages/AIAgents';
import Workflows from './pages/Workflows';
import Infrastructure from './pages/Infrastructure';
import Security from './pages/Security';
import Events from './pages/Events';
import Integrations from './pages/Integrations';
import Networking from './pages/Networking';
import Storage from './pages/Storage';
import Assistant from './pages/Assistant';
import DomainPage from './pages/DomainPage';
import Login from './pages/Login';
import { authApi } from './api/client';
import { User } from './types';

const demoUser: User = {
  id: 0,
  username: 'demo',
  email: 'demo@aegisops.local',
  full_name: 'Demo Operator',
  role: 'Admin',
  is_active: true,
};

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [user, setUser] = useState<User | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('aegis_token');
    setUser(null);
    setActivePage('dashboard');
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('aegis_token');
    if (!token) {
      setIsCheckingAuth(false);
      return;
    }
    if (token === 'demo-token') {
      setUser(demoUser);
      setIsCheckingAuth(false);
      return;
    }
    authApi.getMe()
      .then(response => setUser(response.data))
      .catch(logout)
      .finally(() => setIsCheckingAuth(false));
  }, [logout]);

  useEffect(() => {
    window.addEventListener('aegis:unauthorized', logout);
    return () => window.removeEventListener('aegis:unauthorized', logout);
  }, [logout]);

  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-bg text-brand-muted">
        <div className="flex items-center gap-3"><span className="h-3 w-3 animate-pulse rounded-full bg-blue-500" />인증 정보를 확인하는 중입니다.</div>
      </div>
    );
  }

  if (!user) return <Login onAuthenticated={setUser} />;

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard onNavigate={setActivePage} />;
      case 'k8s': return <Kubernetes />;
      case 'docker': return <Docker />;
      case 'cloud_resources': return <Infrastructure />;
      case 'deployments': return <Deployments />;
      case 'git': return <Git />;
      case 'agents': return <AIAgents />;
      case 'workflows': return <Workflows />;
      case 'infrastructure': return <Infrastructure />;
      case 'monitoring': return <Monitoring />;
      case 'logs': return <LogStream />;
      case 'alerts': return <Alerts />;
      case 'security': return <Security />;
      case 'events': return <Events />;
      case 'integrations': return <Integrations />;
      case 'compliance': return <Security />;
      case 'audit_logs': return <AuditLogs />;
      case 'execution_history': return <Events />;
      case 'agent_workflows': return <Workflows />;
      case 'admin': return <Admin />;
      case 'settings': return <Settings />;
      case 'assistant': return <Assistant />;
      case 'networking': return <Networking />;
      case 'storage': return <Storage />;
      case 'branches': return <Branches />;
      case 'pull_requests': return <PullRequests />;
      case 'releases': return <Releases />;
      case 'gitops': return <DomainPage title="GitOps" description="선언형 배포 동기화 상태를 관리합니다." />;
      case 'automation': return <Automation />;
      case 'observability_dashboards': return <DomainPage title="Dashboards" description="운영 지표와 상태 화면을 구성합니다." />;
      case 'secrets': return <DomainPage title="Secrets" description="민감 정보와 접근 상태를 안전하게 관리합니다." />;
      case 'memory': return <DomainPage title="Memory" description="Agent 실행 Context와 운영 Memory 상태를 관리합니다." />;
      case 'system_config': return <DomainPage title="System Config" description="AegisOps Runtime 시스템 구성을 관리합니다." />;
      default: return <Dashboard onNavigate={setActivePage} />;
    }
  };

  return (
    <AppLayout activePage={activePage} setActivePage={setActivePage} user={user} onLogout={logout}>
      {renderPage()}
    </AppLayout>
  );
}

export default App;
