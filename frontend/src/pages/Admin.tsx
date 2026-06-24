import { useMemo, useState } from 'react';
import { KeyRound, ShieldCheck, UserCheck, Users } from 'lucide-react';
import { DataTable, FilterSelect, PageToolbar, StatCard } from '../components/UI';

const users = [
  { username: 'admin', role: 'Admin', policy: '전체 접근', status: '활성' },
  { username: 'devops01', role: 'DevOps', policy: '워크로드 운영', status: '활성' },
  { username: 'viewer01', role: 'Viewer', policy: '읽기 전용', status: '활성' },
];
const policies = [
  { name: '전체 접근', scope: '모든 리소스', users: 1, risk: '높음' },
  { name: '워크로드 운영', scope: 'Kubernetes / Docker / Deployments', users: 1, risk: '중간' },
  { name: '읽기 전용', scope: 'Dashboard / Logs / Alerts', users: 1, risk: '낮음' },
];
const riskBadge = (risk: string) => risk === '낮음' ? 'badge-success' : risk === '중간' ? 'badge-warning' : 'badge-danger';

export default function Admin() {
  const [role, setRole] = useState('전체');
  const [risk, setRisk] = useState('전체');
  const filteredUsers = useMemo(() => users.filter(user => role === '전체' || user.role === role), [role]);
  const filteredPolicies = useMemo(() => policies.filter(policy => risk === '전체' || policy.risk === risk), [risk]);
  return <div className="space-y-4">
    <div><h3 className="text-lg font-semibold text-white">접근 제어</h3><p className="mt-0.5 text-xs text-brand-muted">사용자, 역할, 권한 정책을 확인합니다.</p></div>
    <PageToolbar><FilterSelect value={role} onChange={event => setRole(event.target.value)}><option>전체</option><option>Admin</option><option>DevOps</option><option>Viewer</option></FilterSelect><FilterSelect value={risk} onChange={event => setRisk(event.target.value)}><option>전체</option><option>낮음</option><option>중간</option><option>높음</option></FilterSelect></PageToolbar>
    <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="사용자" value={`${filteredUsers.length}`} icon={Users} /><StatCard label="활성 사용자" value={`${filteredUsers.filter(user => user.status === '활성').length}`} icon={UserCheck} /><StatCard label="역할" value="3" icon={ShieldCheck} /><StatCard label="권한 정책" value={`${filteredPolicies.length}`} icon={KeyRound} /></div>
    <section><h4 className="mb-2 font-semibold text-white">사용자 권한</h4><DataTable headers={['사용자', '역할', '권한 정책', '상태']} data={filteredUsers} renderRow={user => <><td className="px-3 py-2 font-medium text-white">{user.username}</td><td className="px-3 py-2 text-brand-muted">{user.role}</td><td className="px-3 py-2 text-brand-muted">{user.policy}</td><td className="px-3 py-2"><span className="badge badge-success">{user.status}</span></td></>} /></section>
    <section><h4 className="mb-2 font-semibold text-white">권한 정책</h4><DataTable headers={['정책', '범위', '사용자 수', '위험도']} data={filteredPolicies} renderRow={policy => <><td className="px-3 py-2 font-medium text-white">{policy.name}</td><td className="px-3 py-2 text-brand-muted">{policy.scope}</td><td className="px-3 py-2">{policy.users}</td><td className="px-3 py-2"><span className={`badge ${riskBadge(policy.risk)}`}>{policy.risk}</span></td></>} /></section>
  </div>;
}
