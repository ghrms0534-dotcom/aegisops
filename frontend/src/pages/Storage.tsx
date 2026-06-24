import { Archive, Database, HardDrive, Server } from 'lucide-react';
import { DataTable, StatCard } from '../components/UI';

const pvcVolumes = [
  { name: 'postgres-data-pvc', status: 'Bound', capacity: '80Gi' },
  { name: 'redis-cache-pvc', status: 'Bound', capacity: '20Gi' },
  { name: 'logs-archive-pvc', status: 'Pending', capacity: '120Gi' },
];

const dockerVolumes = [
  { name: 'aegisops_db_data', status: 'Active', size: '18.4GB' },
  { name: 'aegisops_logs', status: 'Active', size: '7.2GB' },
  { name: 'aegisops_cache', status: 'Idle', size: '2.1GB' },
];

const health = [
  { item: 'Disk I/O', value: '128MB/s', status: 'Healthy' },
  { item: 'Volume 연결 상태', value: '8 / 9 연결됨', status: 'Warning' },
  { item: '읽기 속도', value: '420MB/s', status: 'Healthy' },
  { item: '쓰기 속도', value: '210MB/s', status: 'Healthy' },
];

const backups = [
  { item: '최근 백업', value: '2026-06-23 02:00' },
  { item: '백업 결과', value: '완료' },
  { item: '다음 백업 일정', value: '2026-06-24 02:00' },
  { item: '백업 크기', value: '42.8GB' },
];

const events = [
  'postgres-data-pvc 용량 점검이 완료되었습니다.',
  'logs-archive-pvc가 Storage Class 연결을 기다리고 있습니다.',
  '야간 Backup 작업이 정상 완료되었습니다.',
  'Docker Volume aegisops_cache가 대기 상태로 표시되었습니다.',
];

const badge = (status: string) => status === 'Bound' || status === 'Active' || status === 'Healthy' || status === 'Completed' ? 'badge-success' : status === 'Pending' || status === 'Warning' ? 'badge-warning' : 'badge-danger';
const label = (status: string) => ({ Bound: '연결됨', Active: '활성', Idle: '대기', Pending: '대기 중', Healthy: '정상', Warning: '주의', Completed: '완료' }[status] || status);

export default function Storage() {
  return <div className="space-y-4">
    <div><h3 className="text-lg font-semibold text-white">스토리지 운영 상태</h3><p className="mt-0.5 text-xs text-brand-muted">디스크, Kubernetes Volume, Docker Volume, Backup 상태를 확인합니다.</p></div>

    <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="전체 용량" value="2.0TB" icon={HardDrive} />
      <StatCard label="사용 중 용량" value="1.28TB" icon={Database} />
      <StatCard label="남은 용량" value="720GB" icon={Server} />
      <StatCard label="디스크 사용률" value="64%" icon={Archive} />
    </div>

    <div className="grid gap-3 xl:grid-cols-2">
      <section>
        <h4 className="mb-2 font-semibold text-white">Kubernetes Volume 상태</h4>
        <DataTable headers={['PVC 이름', '상태', '용량']} data={pvcVolumes} renderRow={row => <><td className="px-3 py-2 font-medium text-white">{row.name}</td><td className="px-3 py-2"><span className={`badge ${badge(row.status)}`}>{label(row.status)}</span></td><td className="px-3 py-2 text-brand-muted">{row.capacity}</td></>} />
      </section>

      <section>
        <h4 className="mb-2 font-semibold text-white">Docker Volume 상태</h4>
        <DataTable headers={['Volume 이름', '상태', '크기']} data={dockerVolumes} renderRow={row => <><td className="px-3 py-2 font-medium text-white">{row.name}</td><td className="px-3 py-2"><span className={`badge ${badge(row.status)}`}>{label(row.status)}</span></td><td className="px-3 py-2 text-brand-muted">{row.size}</td></>} />
      </section>
    </div>

    <div className="grid gap-3 xl:grid-cols-2">
      <section>
        <h4 className="mb-2 font-semibold text-white">스토리지 상태 점검</h4>
        <DataTable headers={['항목', '값', '상태']} data={health} renderRow={row => <><td className="px-3 py-2 font-medium text-white">{row.item}</td><td className="px-3 py-2 text-brand-muted">{row.value}</td><td className="px-3 py-2"><span className={`badge ${badge(row.status)}`}>{label(row.status)}</span></td></>} />
      </section>

      <section>
        <h4 className="mb-2 font-semibold text-white">백업 상태</h4>
        <DataTable headers={['항목', '값']} data={backups} renderRow={row => <><td className="px-3 py-2 font-medium text-white">{row.item}</td><td className="px-3 py-2 text-brand-muted">{row.value}</td></>} />
      </section>
    </div>

    <section className="card">
      <h4 className="mb-2 font-semibold text-white">최근 스토리지 이벤트</h4>
      <div className="grid gap-1.5 text-xs text-brand-muted">{events.map(event => <p key={event} className="rounded-md border border-slate-800 bg-slate-900/40 px-2 py-1.5">{event}</p>)}</div>
    </section>
  </div>;
}
