import { useState } from 'react';
import { Cable, Globe2, Moon, Radio } from 'lucide-react';
import { FilterSelect, PageToolbar, StatCard } from '../components/UI';

export default function Settings() {
  const [environment, setEnvironment] = useState('Production');
  const [logLevel, setLogLevel] = useState('INFO');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const save = () => {
    setSaving(true);
    setToast('설정 Demo 저장 중...');
    window.setTimeout(() => {
      setSaving(false);
      setToast(`${environment} / ${logLevel} 설정이 Demo로 저장되었습니다.`);
    }, 700);
  };

  return <div className="max-w-5xl space-y-6">
    <div><h3 className="text-xl font-semibold text-white">설정</h3><p className="mt-1 text-sm text-brand-muted">Environment와 기본 연결 설정을 관리합니다.</p></div>
    <PageToolbar action={<button onClick={save} disabled={saving} className="btn-primary text-xs disabled:opacity-60">{saving ? '저장 중...' : '설정 Demo 저장'}</button>}><FilterSelect value={environment} onChange={event => setEnvironment(event.target.value)}><option>Production</option><option>Staging</option><option>Local</option></FilterSelect></PageToolbar>
    {toast && <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 px-3 py-2 text-xs text-blue-300">{toast}</div>}
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="API 상태" value="연결됨" icon={Globe2} /><StatCard label="WebSocket 상태" value="연결됨" icon={Radio} /><StatCard label="Integration" value="4" icon={Cable} /><StatCard label="Theme" value="Dark" icon={Moon} /></div>
    <div className="card space-y-4"><div className="grid gap-4 sm:grid-cols-2"><div className="flex flex-col gap-2"><label className="text-sm font-medium text-brand-muted">API URL</label><input readOnly value="http://localhost:8000/api" className="rounded-lg border border-slate-700 bg-slate-900 p-2 text-sm text-slate-300" /></div><div className="flex flex-col gap-2"><label className="text-sm font-medium text-brand-muted">WebSocket URL</label><input readOnly value="ws://localhost:8000/ws" className="rounded-lg border border-slate-700 bg-slate-900 p-2 text-sm text-slate-300" /></div></div><div className="grid gap-4 sm:grid-cols-2"><div className="flex flex-col gap-2"><label className="text-sm font-medium text-brand-muted">Environment</label><select value={environment} onChange={event => setEnvironment(event.target.value)} className="rounded border border-slate-700 bg-slate-900 p-2 text-sm"><option>Production</option><option>Staging</option><option>Local</option></select></div><div className="flex flex-col gap-2"><label className="text-sm font-medium text-brand-muted">Log Level</label><select value={logLevel} onChange={event => setLogLevel(event.target.value)} className="rounded border border-slate-700 bg-slate-900 p-2 text-sm"><option>DEBUG</option><option>INFO</option><option>WARNING</option><option>ERROR</option></select></div></div><div className="flex items-center gap-3 pt-4"><input type="checkbox" id="alerts" defaultChecked /><label htmlFor="alerts" className="text-sm">위험 알림 Email Notification 활성화</label></div><button onClick={save} disabled={saving} className="btn-primary mt-4 w-fit px-8 text-sm disabled:opacity-60">{saving ? '저장 중...' : '설정 Demo 저장'}</button></div>
  </div>;
}
