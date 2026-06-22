import React, { useState, useEffect } from 'react';
import { DataTable, FilterSelect, PageToolbar, StatCard } from '../components/UI';
import { KeyRound, ShieldCheck, UserCheck, Users } from 'lucide-react';
import { adminApi } from '../api/client';

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    adminApi.getUsers().then(res => setUsers(res.data));
    adminApi.getAuditLogs().then(res => setLogs(res.data));
  }, []);

  return (
    <div className="space-y-8">
      <div><h3 className="text-xl font-semibold text-white">Admin Access Control</h3><p className="mt-1 text-sm text-brand-muted">사용자, Role 및 접근 권한을 관리합니다.</p></div>
      <PageToolbar action={<button className="btn-primary text-xs">사용자 추가</button>}><FilterSelect><option>전체 Role</option><option>Admin</option><option>DevOps</option><option>Viewer</option></FilterSelect><FilterSelect><option>전체 계정 상태</option><option>Active</option><option>Disabled</option></FilterSelect></PageToolbar>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="전체 사용자" value={`${users.length}`} icon={Users} /><StatCard label="활성 계정" value="3" icon={UserCheck} /><StatCard label="Role 수" value="3" icon={ShieldCheck} /><StatCard label="접근 정책" value="12" icon={KeyRound} /></div>
      <div>
        <h3 className="text-lg font-semibold mb-4">사용자 관리</h3>
        <DataTable 
          headers={['Username', 'Full Name', 'Role', 'Status']}
          data={users}
          renderRow={(user) => (
            <>
              <td className="px-4 py-3 font-medium">{user.username}</td>
              <td className="px-4 py-3">{user.full_name}</td>
              <td className="px-4 py-3 text-brand-muted">{user.role}</td>
              <td className="px-4 py-3">
                <span className={`badge ${user.is_active ? 'badge-success' : 'badge-danger'}`}>
                  {user.is_active ? 'Active' : 'Disabled'}
                </span>
              </td>
            </>
          )}
        />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">시스템 Audit Log</h3>
        <DataTable 
          headers={['User', 'Action', 'Target', 'Timestamp', 'Status']}
          data={logs}
          renderRow={(log) => (
            <>
              <td className="px-4 py-3 font-medium">{log.user_id}</td>
              <td className="px-4 py-3">{log.action}</td>
              <td className="px-4 py-3 text-brand-muted">{log.target}</td>
              <td className="px-4 py-3 text-brand-muted">{log.timestamp}</td>
              <td className="px-4 py-3">
                <span className="text-xs">{log.status}</span>
              </td>
            </>
          )}
        />
      </div>
    </div>
  );
};

export default Admin;
