import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('aegis_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('aegis_token');
      window.dispatchEvent(new Event('aegis:unauthorized'));
    }
    return Promise.reject(error);
  },
);

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  role: 'viewer' | 'devops' | 'admin';
}

export const authApi = {
  login: (email: string, password: string) => api.post('/auth/login', new URLSearchParams({ username: email, password }), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  }),
  register: (data: RegisterData) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
};

export const k8sApi = {
  getClusters: () => api.get('/k8s/clusters'),
  getNamespaces: () => api.get('/k8s/namespaces'),
  getPods: (nsId: number) => api.get(`/k8s/pods?namespace_id=${nsId}`),
  restartPod: (id: number) => api.post(`/k8s/pods/${id}/restart`),
};

export const dockerApi = {
  getContainers: () => api.get('/docker/containers'),
  getLiveContainers: () => api.get('/docker/live/containers'),
  updateStatus: (id: number, status: string) => api.patch(`/docker/containers/${id}/status?status=${status}`),
};

export const deployApi = {
  getHistory: () => api.get('/deployments/history'),
  trigger: (data: any) => api.post('/deployments/trigger', data),
};

export const gitApi = {
  getRepositories: () => api.get('/git/repositories'),
  getLiveStatus: () => api.get('/git/live/status'),
};

export const monitorApi = {
  getMetrics: () => api.get('/monitoring/metrics'),
};

export const alertApi = {
  getAlerts: () => api.get('/alerts/'),
  markRead: (id: number) => api.patch(`/alerts/${id}/read`),
};

export const adminApi = {
  getUsers: () => api.get('/admin/users'),
  getAuditLogs: () => api.get('/admin/audit-logs'),
};

export const dashboardApi = {
  getSummary: () => api.get('/dashboard/summary'),
  getOverview: () => api.get('/dashboard/overview'),
};

export const integrationApi = {
  getStatus: () => api.get('/integrations/status'),
};

export const cloudApi = {
  getNcp: () => api.get('/cloud/ncp'),
  getAws: () => api.get('/cloud/aws'),
};

export const githubApi = {
  getStatus: () => api.get('/github/status'),
  getRepositories: () => api.get('/github/repos'),
};

export const jenkinsApi = {
  getStatus: () => api.get('/jenkins/status'),
  getJobs: () => api.get('/jenkins/jobs'),
  getBuilds: () => api.get('/jenkins/builds'),
  getPipelines: () => api.get('/jenkins/pipelines'),
};

export const prometheusApi = {
  getMetrics: () => api.get('/prometheus/metrics'),
};

export const actionApi = {
  simulate: (data: { actionType: string; targetType: string; targetName: string; namespace?: string }) => api.post('/actions/simulate', data),
};

export const aiApi = {
  analyze: (message: string, context?: unknown, history?: unknown) => api.post('/ai/analyze', { message, context, history }),
};

export default api;
