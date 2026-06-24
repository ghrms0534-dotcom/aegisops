import { FormEvent, useState } from 'react';
import { X } from 'lucide-react';
import { authApi, RegisterData } from '../../api/client';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

const emptyForm: RegisterData & { confirmPassword: string } = {
  username: '', email: '', password: '', confirmPassword: '', role: 'viewer',
};

export default function RegisterModal({ onClose, onSuccess }: Props) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (field: keyof typeof form, value: string) => setForm(current => ({ ...current, [field]: value }));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    if (Object.values(form).some(value => !value)) return setError('모든 필드를 입력해주세요.');
    if (form.password.length < 4) return setError('비밀번호는 4자리 이상이어야 합니다.');
    if (form.password !== form.confirmPassword) return setError('비밀번호가 일치하지 않습니다.');
    setLoading(true);
    try {
      const { confirmPassword: _, ...data } = form;
      await authApi.register(data);
      onSuccess();
    } catch (requestError: any) {
      const detail = requestError.response?.data?.detail;
      setError(detail === 'Username already registered' ? '이미 사용 중인 사용자 이름입니다.' : detail === 'Email already registered' ? '이미 사용 중인 이메일입니다.' : detail || '계정을 생성하지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="register-title">
      <form onSubmit={submit} className="card w-full max-w-lg space-y-4 p-5 shadow-2xl shadow-black/50">
        <div className="flex items-start justify-between"><div><h2 id="register-title" className="text-lg font-bold text-white">계정 생성</h2><p className="mt-1 text-xs text-brand-muted">이메일과 4자리 이상 비밀번호로 AegisOps 계정을 만듭니다.</p></div><button type="button" onClick={onClose} aria-label="닫기" className="rounded-lg p-1.5 text-brand-muted hover:bg-slate-800 hover:text-white"><X size={17} /></button></div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm text-brand-muted">사용자 이름<input required value={form.username} onChange={e => update('username', e.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-blue-500" /></label>
          <label className="text-sm text-brand-muted">이메일<input required type="email" value={form.email} onChange={e => update('email', e.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-blue-500" /></label>
          <label className="text-sm text-brand-muted">비밀번호<input required type="password" value={form.password} onChange={e => update('password', e.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-blue-500" /></label>
          <label className="text-sm text-brand-muted">비밀번호 확인<input required type="password" value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-blue-500" /></label>
          <label className="text-sm text-brand-muted sm:col-span-2">권한<select value={form.role} onChange={e => update('role', e.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-blue-500"><option value="viewer">조회 전용</option><option value="devops">운영 담당자</option><option value="admin">관리자</option></select></label>
        </div>
        {error && <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>}
        <div className="flex justify-end gap-3"><button type="button" onClick={onClose} className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800">취소</button><button disabled={loading} className="btn-primary text-sm disabled:opacity-60">{loading ? '생성 중...' : '계정 생성'}</button></div>
      </form>
    </div>
  );
}
