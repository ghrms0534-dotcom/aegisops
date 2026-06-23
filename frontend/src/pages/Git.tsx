import React, { useState, useEffect } from 'react';
import { DataTable, FilterSelect, PageToolbar, StatCard } from '../components/UI';
import { Braces, FileDiff, GitBranch, GitCommit } from 'lucide-react';
import { gitApi } from '../api/client';

const Git = () => {
  const [repos, setRepos] = useState([]);
  const [live, setLive] = useState<any>(null);

  useEffect(() => {
    gitApi.getRepositories().then(res => setRepos(res.data));
    gitApi.getLiveStatus().then(res => setLive(res.data)).catch(() => setLive(null));
  }, []);

  return (
    <div className="space-y-6">
      <div><h3 className="text-xl font-semibold text-white">Repositories</h3><p className="mt-1 text-sm text-brand-muted">Branch, Commit, Pull Request와 Repository Sync 상태를 확인합니다.</p></div>
      <PageToolbar action={<button className="btn-primary text-xs">새로고침</button>}><FilterSelect><option>전체 Repository</option>{repos.map((repo: any) => <option key={repo.name}>{repo.name}</option>)}</FilterSelect><FilterSelect><option>main Branch</option><option>develop Branch</option></FilterSelect></PageToolbar>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="현재 Branch" value={live?.branch || 'main'} icon={GitBranch} /><StatCard label="최신 Commit" value={live?.recent_commit || '조회 대기'} icon={GitCommit} /><StatCard label="변경된 파일" value={`${live?.modified_files ?? 0}`} icon={FileDiff} /><StatCard label="Remote" value={`${live?.remotes?.length ?? 0}`} icon={Braces} /></div>
      <DataTable 
        headers={['Repository', 'Branch', 'Last Commit', 'PR Status']}
        data={repos}
        renderRow={(repo) => (
          <>
            <td className="px-4 py-3 font-medium">{repo.name}</td>
            <td className="px-4 py-3">{repo.branch}</td>
            <td className="px-4 py-3 text-brand-muted">{repo.last_commit}</td>
            <td className="px-4 py-3">
              <span className={`badge ${repo.pr_status === 'Merged' ? 'badge-success' : 'badge-warning'}`}>
                {repo.pr_status}
              </span>
            </td>
          </>
        )}
      />
      {live?.files?.length > 0 && <div className="card"><h4 className="font-semibold text-white">Modified Files</h4><div className="mt-4 space-y-2 text-sm text-brand-muted">{live.files.map((file: string) => <p key={file} className="font-mono text-xs">{file}</p>)}</div></div>}
      <div className="card"><h4 className="font-semibold text-white">Git Operation Log</h4><div className="mt-4 space-y-3 text-sm text-brand-muted"><p><span className="mr-3 text-green-400">PUSH</span>main Branch에 3개 Commit 반영 · 8분 전</p><p><span className="mr-3 text-blue-400">MERGE</span>feature/alerts Pull Request 병합 · 42분 전</p></div></div>
    </div>
  );
};

export default Git;
