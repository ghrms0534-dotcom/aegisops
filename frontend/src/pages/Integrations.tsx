import { ProviderSection } from '../components/ProviderSection';

export default function Integrations() {
  return <div className="space-y-6">
    <div><h3 className="text-xl font-semibold text-white">Connected Providers</h3><p className="mt-1 text-sm text-brand-muted">Cloud, Observability 및 Delivery Provider 연결 상태를 관리합니다.</p></div>
    <ProviderSection title="Provider Connections" kind="Provider" names={['AWS', 'NCP', 'Prometheus', 'Grafana', 'Jenkins', 'ArgoCD', 'GitHub Actions']} />
  </div>;
}
