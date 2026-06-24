import { CheckCircle2, GitPullRequest, ShieldAlert, Timer } from 'lucide-react';
import { DataTable, StatCard } from '../components/UI';

const prs = [
  { title: 'Add dashboard AI context', repo: 'aegisops-platform', source: 'feature/ai-context', target: 'main', status: '리뷰 필요', reviewer: 'devops-lead', checks: '3/4 통과' },
  { title: 'Compact cloud resources page', repo: 'aegisops-frontend', source: 'ui/cloud-compact', target: 'develop', status: '승인됨', reviewer: 'frontend-owner', checks: '4/4 통과' },
  { title: 'Patch auth token refresh', repo: 'aegisops-platform', source: 'hotfix/auth-token', target: 'main', status: '차단됨', reviewer: 'security', checks: '2/4 통과' },
];

const badge = (status: string) => status === '승인됨' ? 'badge-success' : status === '차단됨' ? 'badge-danger' : 'badge-warning';

export default function PullRequests() {
  return <div className="space-y-4">
    <div><h3 className="text-lg font-semibold text-white">Pull Request</h3><p className="mt-0.5 text-xs text-brand-muted">코드 변경 검토, 대상 Branch, Reviewer, Check 상태를 확인합니다.</p></div>
    <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="열린 PR" value="3" icon={GitPullRequest} /><StatCard label="승인됨" value="1" icon={CheckCircle2} /><StatCard label="리뷰 중" value="1" icon={Timer} /><StatCard label="차단됨" value="1" icon={ShieldAlert} /></div>
    <DataTable headers={['제목', '저장소', 'Source → Target', '상태', 'Reviewer', 'Checks']} data={prs} renderRow={pr => <><td className="px-3 py-2 font-medium text-white">{pr.title}</td><td className="px-3 py-2 text-brand-muted">{pr.repo}</td><td className="px-3 py-2 text-brand-muted">{pr.source} → {pr.target}</td><td className="px-3 py-2"><span className={`badge ${badge(pr.status)}`}>{pr.status}</span></td><td className="px-3 py-2 text-brand-muted">{pr.reviewer}</td><td className="px-3 py-2 text-brand-muted">{pr.checks}</td></>} />
  </div>;
}
