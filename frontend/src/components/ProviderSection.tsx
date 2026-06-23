import { useEffect, useState } from 'react';
import { Cloud, Plug, ShieldCheck } from 'lucide-react';

import { githubApi, integrationApi, jenkinsApi } from '../api/client';

interface ProviderStatus {
  name: string;
  status: 'ok' | 'not_configured' | 'unavailable';
  summary: { configured: boolean; mode?: string };
}

interface JenkinsData {
  mode: string;
  jobs: { name: string; status: string; last_build: number }[];
  builds: { job: string; build_number: number; result: string }[];
  pipelines: { name: string; stages: { name: string; status: string }[] }[];
}

const providerLabels: Record<string, string> = {
  AWS: 'Cloud',
  NCP: 'Cloud',
  Prometheus: 'Monitoring',
  Grafana: 'Monitoring',
  Jenkins: 'CI/CD',
  ArgoCD: 'GitOps',
  'GitHub Actions': 'Source Control',
};

export function ProviderSection({ title, kind, names }: { title: string; kind: string; names: string[] }) {
  const [providers, setProviders] = useState<ProviderStatus[] | null>(null);
  const [githubStatus, setGithubStatus] = useState('Checking...');
  const [repositoryCount, setRepositoryCount] = useState(0);
  const [jenkins, setJenkins] = useState<JenkinsData | null>(null);
  const [jenkinsError, setJenkinsError] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    integrationApi.getStatus()
      .then(response => setProviders(response.data.integrations.filter((item: ProviderStatus) => names.includes(item.name))))
      .catch(requestError => setError(requestError.message || 'Provider 상태 조회 실패'));
    if (names.includes('GitHub Actions')) {
      githubApi.getStatus()
        .then(response => {
          setGithubStatus(response.data.status);
          setRepositoryCount(response.data.repositories);
        })
        .catch(() => setGithubStatus('Authentication Failed'));
    }
    if (names.includes('Jenkins')) {
      Promise.all([jenkinsApi.getStatus(), jenkinsApi.getJobs(), jenkinsApi.getBuilds(), jenkinsApi.getPipelines()])
        .then(([status, jobs, builds, pipelines]) => setJenkins({
          mode: status.data.mode,
          jobs: jobs.data.jobs,
          builds: builds.data.builds,
          pipelines: pipelines.data.pipelines,
        }))
        .catch(() => setJenkinsError(true));
    }
  }, [names.join('|')]);

  return <section><div className="mb-4"><h4 className="font-semibold text-white">{title}</h4><p className="mt-1 text-xs text-brand-muted">{kind} 연결 상태</p></div>
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{names.map(name => {
      const provider = providers?.find(item => item.name === name);
      const isGitHub = name === 'GitHub Actions';
      const isJenkins = name === 'Jenkins';
      const label = isGitHub ? githubStatus : isJenkins ? jenkinsError ? 'Disconnected' : jenkins ? 'Mock Mode' : 'Checking...' : error ? 'Disconnected' : !provider ? 'Checking...' : provider.summary.mode === 'mock' ? 'Mock Mode' : provider.status === 'ok' ? 'Connected' : provider.status === 'unavailable' ? 'Disconnected' : 'Ready to Connect';
      const displayName = name === 'GitHub Actions' ? 'GitHub' : name;
      const badgeClass = isGitHub ? githubStatus === 'Connected' ? 'badge-success' : githubStatus === 'Authentication Failed' ? 'badge-danger' : 'badge-warning' : isJenkins ? jenkinsError ? 'badge-danger' : 'badge-warning' : provider?.status === 'ok' ? 'badge-success' : error || provider?.status === 'unavailable' ? 'badge-danger' : 'badge-warning';
      return <article key={name} className="card flex items-center gap-4 hover:border-blue-500/40"><span className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-2.5 text-blue-400">{kind === 'Cloud Provider' ? <Cloud size={20} /> : provider?.status === 'ok' ? <ShieldCheck size={20} /> : <Plug size={20} />}</span><div className="min-w-0 flex-1"><h5 className="font-medium text-white">{displayName}</h5><p className="mt-1 text-xs text-brand-muted">{providerLabels[name] || kind}</p><p className="mt-2 text-xs text-slate-300">Status: {label}</p>{isGitHub && githubStatus === 'Connected' && <p className="mt-1 text-xs text-slate-300">Repositories: {repositoryCount}</p>}{isJenkins && jenkins && <div className="mt-3 space-y-2 border-t border-slate-700/50 pt-3 text-xs text-slate-300"><div><p className="font-medium text-white">Jobs</p>{jenkins.jobs.map(job => <p key={job.name} className="mt-1 break-words">{job.name} · {job.status} · #{job.last_build}</p>)}</div><div><p className="font-medium text-white">Recent Builds</p>{jenkins.builds.map(build => <p key={`${build.job}-${build.build_number}`} className="mt-1 break-words">{build.job} #{build.build_number} · {build.result}</p>)}</div><div><p className="font-medium text-white">Pipelines</p>{jenkins.pipelines.map(pipeline => <p key={pipeline.name} className="mt-1 break-words">{pipeline.name}: {pipeline.stages.map(stage => `${stage.name} (${stage.status})`).join(' · ')}</p>)}</div></div>}</div><span className={`badge ${badgeClass}`}>{label}</span></article>;
    })}</div>
  </section>;
}
