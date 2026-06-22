import { FormEvent, useState } from 'react';
import { ArrowRight, Cloud, LockKeyhole, ShieldCheck } from 'lucide-react';
import { authApi } from '../api/client';
import { User } from '../types';
import RegisterModal from '../components/auth/RegisterModal';

export default function Login({ onAuthenticated }: { onAuthenticated: (user: User) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

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

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-brand-bg p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.16),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.10),transparent_35%)]" />
      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-950/70 shadow-2xl shadow-black/40 backdrop-blur lg:grid-cols-2">
        <section className="hidden flex-col justify-between border-r border-slate-800 bg-slate-950/60 p-10 lg:flex">
          <div><div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-xl font-black text-white">A</span><h1 className="text-2xl font-bold text-white">Aegis<span className="text-blue-400">Ops</span></h1></div><div className="mt-20"><p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-400">Cloud Native Control Plane</p><h2 className="mt-4 text-4xl font-bold leading-tight text-white">인프라 운영을 위한<br />하나의 안전한 공간.</h2><p className="mt-5 max-w-sm leading-7 text-brand-muted">Kubernetes, Container, 배포와 시스템 상태를 통합 관리하세요.</p></div></div>
          <div className="flex gap-6 text-xs text-brand-muted"><span className="flex items-center gap-2"><ShieldCheck size={15} className="text-green-400" />JWT Secure</span><span className="flex items-center gap-2"><Cloud size={15} className="text-blue-400" />Cloud Native</span></div>
        </section>
        <section className="p-7 sm:p-10 lg:p-12"><div className="mb-8 lg:hidden"><h1 className="text-2xl font-bold text-white">Aegis<span className="text-blue-400">Ops</span></h1><p className="mt-1 text-xs uppercase tracking-widest text-brand-muted">Cloud Native Control Plane</p></div><h2 className="text-2xl font-bold text-white">Welcome back</h2><p className="mt-2 text-sm text-brand-muted">계정으로 로그인하여 Control Plane에 접속하세요.</p>
          <form onSubmit={submit} className="mt-8 space-y-5"><label className="block text-sm text-brand-muted">이메일<input required type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15" /></label><label className="block text-sm text-brand-muted">비밀번호<div className="relative mt-2"><LockKeyhole size={16} className="absolute left-4 top-3.5 text-slate-500" /><input required autoComplete="current-password" type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-950 py-3 pl-11 pr-4 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15" /></div></label>
            {error && <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>}{success && <p className="rounded-lg border border-green-500/20 bg-green-500/10 px-3 py-2 text-sm text-green-400">{success}</p>}
            <button disabled={loading} className="btn-primary flex w-full items-center justify-center gap-2 py-3 disabled:opacity-60">{loading ? '로그인 중...' : '로그인'}{!loading && <ArrowRight size={17} />}</button><div className="text-center text-sm text-brand-muted">계정이 없으신가요?</div><button type="button" onClick={() => setShowRegister(true)} className="w-full rounded-lg border border-slate-700 py-3 text-sm font-semibold text-slate-200 transition hover:border-blue-500/50 hover:bg-blue-500/5">계정 생성</button>
          </form>
        </section>
      </div>
      {showRegister && <RegisterModal onClose={() => setShowRegister(false)} onSuccess={() => { setShowRegister(false); setSuccess('계정이 생성되었습니다.'); }} />}
    </main>
  );
}
