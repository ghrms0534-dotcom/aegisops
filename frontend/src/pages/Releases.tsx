import { PackageCheck, Rocket, Tag, Timer } from 'lucide-react';
import { DataTable, StatCard } from '../components/UI';

const releases = [
  { version: 'v1.4.2', repo: 'aegisops-platform', tag: 'release-1.4.2', env: 'Production', status: 'Deploy 완료', deployed: '2026-06-24 09:20' },
  { version: 'v1.5.0-beta', repo: 'aegisops-frontend', tag: 'beta-1.5.0', env: 'Staging', status: '검증 중', deployed: '2026-06-24 10:15' },
  { version: 'v1.3.9', repo: 'infra-runbooks', tag: 'runbook-1.3.9', env: 'Production', status: 'Rollback 준비됨', deployed: '2026-06-23 18:40' },
];

const badge = (status: string) => status === 'Deploy 완료' ? 'badge-success' : status === '검증 중' ? 'badge-warning' : 'badge-danger';

export default function Releases() {
  return <div className="space-y-4">
    <div><h3 className="text-lg font-semibold text-white">Release</h3><p className="mt-0.5 text-xs text-brand-muted">버전, Tag, 환경별 Release 상태와 Deploy 시간을 확인합니다.</p></div>
    <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="Release" value="3" icon={Rocket} /><StatCard label="Production" value="2" icon={PackageCheck} /><StatCard label="Tag" value="3" icon={Tag} /><StatCard label="검증 중" value="1" icon={Timer} /></div>
    <DataTable headers={['버전', '저장소', 'Tag', '환경', 'Release 상태', 'Deploy 시간']} data={releases} renderRow={release => <><td className="px-3 py-2 font-medium text-white">{release.version}</td><td className="px-3 py-2 text-brand-muted">{release.repo}</td><td className="px-3 py-2 text-brand-muted">{release.tag}</td><td className="px-3 py-2 text-brand-muted">{release.env}</td><td className="px-3 py-2"><span className={`badge ${badge(release.status)}`}>{release.status}</span></td><td className="px-3 py-2 text-brand-muted">{release.deployed}</td></>} />
  </div>;
}
