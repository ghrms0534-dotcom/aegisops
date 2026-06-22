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
  updateStatus: (id: number, status: string) => api.patch(`/docker/containers/${id}/status?status=${status}`),
};

export const deployApi = {
  getHistory: () => api.get('/deployments/history'),
  trigger: (data: any) => api.post('/deployments/trigger', data),
};

export const gitApi = {
  getRepositories: () => api.get('/git/repositories'),
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

export default api;
