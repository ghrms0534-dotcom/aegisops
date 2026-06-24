import { useMemo, useState } from 'react';
import { FilterSelect, PageToolbar } from '../components/UI';
import { ProviderSection } from '../components/ProviderSection';

const providers = ['AWS', 'NCP', 'Prometheus', 'Grafana', 'Jenkins', 'ArgoCD', 'GitHub Actions'];
const groups: Record<string, string[]> = {
  전체: providers,
  Cloud: ['AWS', 'NCP'],
  Observability: ['Prometheus', 'Grafana'],
  Delivery: ['Jenkins', 'ArgoCD', 'GitHub Actions'],
};

export default function Integrations() {
  const [group, setGroup] = useState('전체');
  const names = useMemo(() => groups[group] || providers, [group]);
  return <div className="space-y-6">
    <div><h3 className="text-xl font-semibold text-white">연동 관리</h3><p className="mt-1 text-sm text-brand-muted">Cloud, Observability, Delivery Provider 연결 상태를 확인합니다.</p></div>
    <PageToolbar><FilterSelect value={group} onChange={event => setGroup(event.target.value)}><option>전체</option><option>Cloud</option><option>Observability</option><option>Delivery</option></FilterSelect></PageToolbar>
    <ProviderSection title="Provider 연결" kind="Provider" names={names} />
  </div>;
}
