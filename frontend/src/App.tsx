import React, { useCallback, useEffect, useState } from 'react';
import { AppLayout } from './layouts/AppLayout';
import Dashboard from './pages/Dashboard';
import LogStream from './pages/LogStream';
import Kubernetes from './pages/Kubernetes';
import Docker from './pages/Docker';
import Deployments from './pages/Deployments';
import Git from './pages/Git';
import Monitoring from './pages/Monitoring';
import Alerts from './pages/Alerts';
import Admin from './pages/Admin';
import Settings from './pages/Settings';
import Login from './pages/Login';
import { authApi } from './api/client';
import { User } from './types';

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
      case 'dashboard': return <Dashboard />;
      case 'k8s': return <Kubernetes />;
      case 'docker': return <Docker />;
      case 'deployments': return <Deployments />;
      case 'git': return <Git />;
      case 'monitoring': return <Monitoring />;
      case 'logs': return <LogStream />;
      case 'alerts': return <Alerts />;
      case 'admin': return <Admin />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <AppLayout activePage={activePage} setActivePage={setActivePage} user={user} onLogout={logout}>
      {renderPage()}
    </AppLayout>
  );
}

export default App;
