import { Braces, CheckCircle2, FileDiff, GitBranch } from 'lucide-react';
import { DataTable, StatCard } from '../components/UI';

const repos = [
  { name: 'aegisops-platform', branch: 'main', commit: 'feat: add AI operator context', pr: '병합됨', sync: '동기화됨' },
  { name: 'aegisops-frontend', branch: 'develop', commit: 'fix: compact cloud resource ui', pr: '리뷰 필요', sync: '2개 뒤처짐' },
  { name: 'infra-runbooks', branch: 'main', commit: 'docs: update incident checklist', pr: '열림', sync: '동기화됨' },
];

const badge = (value: string) => value === '동기화됨' || value === '병합됨' ? 'badge-success' : value.includes('뒤처짐') || value === '리뷰 필요' ? 'badge-warning' : 'badge-danger';

export default function Git() {
  return <div className="space-y-4">
    <div><h3 className="text-lg font-semibold text-white">저장소</h3><p className="mt-0.5 text-xs text-brand-muted">저장소 Sync, 기본 Branch, 최근 Commit, Pull Request 상태를 확인합니다.</p></div>
    <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="저장소" value="3" icon={Braces} /><StatCard label="동기화됨" value="2" icon={CheckCircle2} /><StatCard label="열린 PR" value="2" icon={GitBranch} /><StatCard label="변경 파일" value="7" icon={FileDiff} /></div>
    <DataTable headers={['저장소명', '기본 Branch', '최근 Commit', 'PR 상태', 'Sync 상태']} data={repos} renderRow={repo => <><td className="px-3 py-2 font-medium text-white">{repo.name}</td><td className="px-3 py-2 text-brand-muted">{repo.branch}</td><td className="px-3 py-2 text-brand-muted">{repo.commit}</td><td className="px-3 py-2"><span className={`badge ${badge(repo.pr)}`}>{repo.pr}</span></td><td className="px-3 py-2"><span className={`badge ${badge(repo.sync)}`}>{repo.sync}</span></td></>} />
    <section className="card"><h4 className="font-semibold text-white">Git 작업 이력</h4><div className="mt-3 space-y-2 text-sm text-brand-muted"><p><span className="mr-3 text-green-400">PUSH</span>main Branch에 Commit 3개 반영 · 8분 전</p><p><span className="mr-3 text-blue-400">MERGE</span>feature/alerts Pull Request 병합 · 42분 전</p></div></section>
  </div>;
}
