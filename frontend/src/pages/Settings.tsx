import React from 'react';
import { FilterSelect, PageToolbar, StatCard } from '../components/UI';
import { Cable, Globe2, Moon, Radio } from 'lucide-react';

const Settings = () => {
  return (
    <div className="max-w-5xl space-y-6">
      <div><h3 className="text-xl font-semibold text-white">Settings</h3><p className="mt-1 text-sm text-brand-muted">Environment와 외부 연결 설정을 관리합니다.</p></div>
      <PageToolbar action={<button className="btn-primary text-xs">설정 저장</button>}><FilterSelect><option>운영 Environment</option><option>Staging Environment</option><option>Local Environment</option></FilterSelect></PageToolbar>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="API 상태" value="연결됨" icon={Globe2} /><StatCard label="WebSocket 상태" value="연결됨" icon={Radio} /><StatCard label="Integration" value="4" icon={Cable} /><StatCard label="Theme" value="Dark" icon={Moon} /></div>
      <div className="card space-y-4">
        <div className="grid gap-4 sm:grid-cols-2"><div className="flex flex-col gap-2"><label className="text-sm font-medium text-brand-muted">API URL</label><input readOnly value="http://localhost:3300/api" className="rounded-lg border border-slate-700 bg-slate-900 p-2 text-sm text-slate-300" /></div><div className="flex flex-col gap-2"><label className="text-sm font-medium text-brand-muted">WebSocket URL</label><input readOnly value="ws://localhost:3300/ws" className="rounded-lg border border-slate-700 bg-slate-900 p-2 text-sm text-slate-300" /></div></div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-brand-muted">Environment</label>
          <select className="bg-slate-900 border border-slate-700 p-2 rounded text-sm">
            <option>Production</option>
            <option>Staging</option>
            <option>Development</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-brand-muted">Log Level</label>
          <select className="bg-slate-900 border border-slate-700 p-2 rounded text-sm">
            <option>DEBUG</option>
            <option>INFO</option>
            <option>WARNING</option>
            <option>ERROR</option>
          </select>
        </div>
        <div className="flex items-center gap-3 pt-4">
          <input type="checkbox" id="alerts" defaultChecked />
          <label htmlFor="alerts" className="text-sm">Enable Email Notifications for Critical Alerts</label>
        </div>
        <button className="btn-primary text-sm w-fit px-8 mt-4">설정 저장</button>
      </div>
    </div>
  );
};

export default Settings;
