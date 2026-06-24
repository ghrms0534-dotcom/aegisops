import { AlertTriangle, GitBranch, ShieldCheck, Split } from 'lucide-react';
import { DataTable, StatCard } from '../components/UI';

const branches = [
  { name: 'main', ahead: 0, behind: 0, protected: '예', commit: 'a31f2c9', risk: '낮음' },
  { name: 'develop', ahead: 4, behind: 2, protected: '예', commit: 'b91aa18', risk: '중간' },
  { name: 'feature/ai-context', ahead: 7, behind: 1, protected: '아니오', commit: 'd4e8f10', risk: '중간' },
  { name: 'hotfix/auth-token', ahead: 1, behind: 6, protected: '아니오', commit: 'f77c902', risk: '높음' },
];

const riskBadge = (risk: string) => risk === '낮음' ? 'badge-success' : risk === '중간' ? 'badge-warning' : 'badge-danger';

export default function Branches() {
  return <div className="space-y-4">
    <div><h3 className="text-lg font-semibold text-white">Branch 관리</h3><p className="mt-0.5 text-xs text-brand-muted">Branch 동기화, 보호 정책, 변경 위험도를 확인합니다.</p></div>
    <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="Branch" value="4" icon={GitBranch} /><StatCard label="보호 Branch" value="2" icon={ShieldCheck} /><StatCard label="차이 발생" value="3" icon={Split} /><StatCard label="높은 위험" value="1" icon={AlertTriangle} /></div>
    <DataTable headers={['Branch 이름', '앞선 Commit', '뒤처진 Commit', '보호 여부', '최근 Commit', '위험도']} data={branches} renderRow={branch => <><td className="px-3 py-2 font-medium text-white">{branch.name}</td><td className="px-3 py-2">{branch.ahead}</td><td className="px-3 py-2">{branch.behind}</td><td className="px-3 py-2 text-brand-muted">{branch.protected}</td><td className="px-3 py-2 font-mono text-brand-muted">{branch.commit}</td><td className="px-3 py-2"><span className={`badge ${riskBadge(branch.risk)}`}>{branch.risk}</span></td></>} />
  </div>;
}
