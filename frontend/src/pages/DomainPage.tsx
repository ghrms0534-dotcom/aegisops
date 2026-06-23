import { Activity, ArrowRight } from 'lucide-react';


export default function DomainPage({ title, description, status = 'Module Ready' }: { title: string; description: string; status?: string }) {
  return <div className="space-y-6"><div><h3 className="text-xl font-semibold text-white">{title}</h3><p className="mt-1 text-sm text-brand-muted">{description}</p></div><section className="card flex min-h-[240px] flex-col items-center justify-center text-center"><span className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-4 text-blue-400"><Activity size={26} /></span><h4 className="mt-5 font-semibold text-white">{status}</h4><p className="mt-2 max-w-md text-sm leading-6 text-brand-muted">데이터 소스가 연결되면 이 운영 영역에 실시간 상태와 실행 기록이 표시됩니다.</p><span className="mt-5 inline-flex items-center gap-2 text-xs text-blue-400">Operational domain <ArrowRight size={13} /></span></section></div>;
}
