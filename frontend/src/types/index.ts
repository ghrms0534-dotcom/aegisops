export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: 'Admin' | 'DevOps Engineer' | 'Viewer';
  is_active: boolean;
}

export interface Cluster {
  id: number;
  name: string;
  region: string;
  status: 'Online' | 'Offline' | 'Degraded';
  cpu_usage: number;
  mem_usage: number;
  version: string;
}

export interface Pod {
  id: number;
  name: string;
  status: 'Running' | 'Pending' | 'Failed';
  restarts: number;
  cpu_limit: string;
  mem_limit: string;
}

export interface Container {
  id: number;
  name: string;
  image: string;
  status: 'Running' | 'Stopped' | 'Paused';
  cpu_usage: number;
  mem_usage: number;
  uptime: string;
}

export interface Alert {
  id: number;
  severity: 'Critical' | 'Warning' | 'Info';
  message: string;
  source: string;
  created_at: string;
  is_read: boolean;
}
