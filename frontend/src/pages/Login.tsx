import { FormEvent, useState } from 'react';
import { ArrowRight, Bell, Cloud, Eye, EyeOff, Github, LockKeyhole, ShieldCheck } from 'lucide-react';
import { authApi } from '../api/client';
import { User } from '../types';
import RegisterModal from '../components/auth/RegisterModal';

const demoUser: User = {
  id: 0,
  username: 'demo',
  email: 'demo@aegisops.local',
  full_name: 'Demo Operator',
  role: 'Admin',
  is_active: true,
};

export default function Login({ onAuthenticated }: { onAuthenticated: (user: User) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(() => localStorage.getItem('aegis_remember_login') === 'true');

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const tokenResponse = await authApi.login(email, password);
      localStorage.setItem('aegis_token', tokenResponse.data.access_token);
      const userResponse = await authApi.getMe();
      onAuthenticated(userResponse.data);
    } catch (requestError: any) {
      localStorage.removeItem('aegis_token');
      setError(requestError.response?.status === 401 ? '이메일 또는 비밀번호가 올바르지 않습니다.' : '로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const unavailable = (feature: string) => setError(`${feature} 기능은 아직 준비 중입니다.`);
  const updateRemember = (checked: boolean) => {
    setRemember(checked);
    localStorage.setItem('aegis_remember_login', String(checked));
  };
  const fillDemo = () => {
    setEmail('demo@aegisops.local');
    setPassword('demo1234');
    setError('');
    localStorage.setItem('aegis_token', 'demo-token');
    onAuthenticated(demoUser);
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-brand-bg p-3">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.18),transparent_30%),radial-gradient(circle_at_80%_15%,rgba(14,165,233,0.12),transparent_28%),radial-gradient(circle_at_50%_90%,rgba(99,102,241,0.12),transparent_34%)]" />
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(148,163,184,.35)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,.35)_1px,transparent_1px)] [background-size:32px_32px]" />
      <div className="relative grid w-full max-w-6xl overflow-hidden rounded-xl border border-slate-700/50 bg-slate-950/75 shadow-2xl shadow-black/40 backdrop-blur lg:grid-cols-[1fr_0.9fr_0.9fr]">
        <section className="hidden flex-col justify-between border-r border-slate-800 bg-slate-950/60 p-6 lg:flex">
          <div>
            <div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-lg font-black text-white">A</span><h1 className="text-xl font-bold text-white">Aegis<span className="text-blue-400">Ops</span></h1></div>
            <div className="mt-8"><p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-400">Cloud Native Control Plane</p><h2 className="mt-3 text-3xl font-bold leading-tight text-white">Manage Infrastructure<br />From One Place.</h2><p className="mt-4 max-w-sm text-sm leading-6 text-brand-muted">Kubernetes, Docker, GitHub, API 상태를 대시보드, 알림 관리, Integrations 흐름으로 확인합니다.</p></div>
            <div className="mt-6 grid grid-cols-2 gap-2 text-xs text-slate-300">
              {['모니터링', '대시보드', '알림 관리', 'Integrations', 'Cloud Cost', '자동화'].map(item => <div key={item} className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/35 px-3 py-2"><Bell size={13} className="text-blue-400" />{item}</div>)}
            </div>
          </div>
          <div className="flex gap-5 text-xs text-brand-muted"><span className="flex items-center gap-2"><ShieldCheck size={14} className="text-green-400" />JWT 보안</span><span className="flex items-center gap-2"><Cloud size={14} className="text-blue-400" />Cloud Native</span></div>
        </section>
        <section className="p-6 sm:p-7"><div className="mb-5 lg:hidden"><h1 className="text-xl font-bold text-white">Aegis<span className="text-blue-400">Ops</span></h1><p className="mt-1 text-xs uppercase tracking-widest text-brand-muted">Cloud Native Control Plane</p></div><h2 className="text-xl font-bold text-white">운영 플랫폼 로그인</h2><p className="mt-1 text-sm text-brand-muted">계정으로 로그인하여 Dashboard에 접속하세요.</p>
          <form onSubmit={submit} className="mt-5 space-y-3.5"><label className="block text-sm text-brand-muted">이메일<input required type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15" /></label><label className="block text-sm text-brand-muted">비밀번호<div className="relative mt-1.5"><LockKeyhole size={15} className="absolute left-3 top-3 text-slate-500" /><input required autoComplete="current-password" type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-950 py-2.5 pl-9 pr-10 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15" /><button type="button" onClick={() => setShowPassword(current => !current)} aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'} className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></div></label>
            <div className="flex items-center justify-between gap-3"><label className="flex items-center gap-2 text-xs text-brand-muted"><input type="checkbox" checked={remember} onChange={event => updateRemember(event.target.checked)} className="h-3.5 w-3.5 rounded border-slate-700 bg-slate-950 accent-blue-500" />로그인 상태 유지</label><button type="button" onClick={() => unavailable('비밀번호 찾기')} className="text-xs text-blue-400 hover:text-blue-300">비밀번호를 잊으셨나요?</button></div>
            {error && <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>}{success && <p className="rounded-lg border border-green-500/20 bg-green-500/10 px-3 py-2 text-sm text-green-400">{success}</p>}
            <button disabled={loading} className="btn-primary flex w-full items-center justify-center gap-2 py-2.5 disabled:opacity-60">{loading ? '로그인 중...' : '로그인'}{!loading && <ArrowRight size={16} />}</button>
            <button type="button" onClick={fillDemo} className="w-full rounded-lg border border-blue-500/30 bg-blue-500/5 py-2.5 text-sm font-semibold text-blue-300 transition hover:bg-blue-500/10">데모 체험하기</button>
            <div className="flex items-center gap-3 text-[11px] uppercase tracking-wider text-brand-muted"><span className="h-px flex-1 bg-slate-800" />또는<span className="h-px flex-1 bg-slate-800" /></div>
            <button type="button" onClick={() => unavailable('GitHub 로그인')} className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-700 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-blue-500/50 hover:bg-blue-500/5"><Github size={16} />GitHub로 로그인</button>
            <div className="rounded-lg border border-slate-800 bg-slate-900/35 p-3 text-center text-sm text-brand-muted">계정이 없으신가요?<button type="button" onClick={() => setShowRegister(true)} className="ml-2 font-semibold text-blue-400 hover:text-blue-300">새 계정 생성</button></div>
            <p className="text-right text-[11px] text-slate-600">AegisOps v1.0.0-beta</p>
          </form>
        </section>
        <section className="hidden border-l border-slate-800 bg-slate-950/45 p-6 lg:block">
          <div>
            <p className="text-xs font-semibold text-white">시스템 상태</p>
            <div className="mt-3 grid gap-2 text-xs text-brand-muted">
              {['Kubernetes 정상', 'Docker 정상', 'GitHub 연결됨', 'API 응답 정상'].map(status => <span key={status} className="flex items-center justify-between rounded-lg border border-green-500/15 bg-green-500/5 px-3 py-2"><span>{status}</span><span className="h-1.5 w-1.5 rounded-full bg-green-400 shadow-[0_0_6px_#22c55e]" /></span>)}
            </div>
          </div>
          <div className="mt-8">
            <p className="text-xs font-semibold text-white">실시간 운영 현황</p>
            <div className="mt-3 grid gap-2">
              {[['12개', '활성 세션'], ['3개', '연결된 클러스터'], ['8개', '실행 중인 Agent'], ['24개', '처리된 이벤트']].map(([value, label]) => <div key={label} className="rounded-lg border border-slate-800 bg-slate-900/35 px-3 py-2"><p className="text-lg font-bold text-white">{value}</p><p className="text-xs text-brand-muted">{label}</p></div>)}
            </div>
          </div>
        </section>
      </div>
      {showRegister && <RegisterModal onClose={() => setShowRegister(false)} onSuccess={() => { setShowRegister(false); setSuccess('계정이 생성되었습니다.'); }} />}
    </main>
  );
}
