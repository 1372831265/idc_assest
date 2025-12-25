import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.log('[API] No token found in localStorage');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      
      if (status === 401) {
        const currentPath = window.location.pathname;
        console.log('[API] 401 error, current path:', currentPath);
        
        if (!currentPath.startsWith('/login')) {
          const savedToken = localStorage.getItem('token');
          if (savedToken) {
            console.log('[API] Token exists but got 401, might be expired');
          }
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      }
      
      return Promise.reject(data.message || '请求失败');
    }
    
    if (error.code === 'ECONNABORTED') {
      return Promise.reject('请求超时，请稍后重试');
    }
    
    return Promise.reject('网络错误，请检查网络连接');
  }
);

export const authAPI = {
  checkAdmin: () => api.get('/auth/check-admin'),
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/password', data)
};

export const userAPI = {
  list: (params) => api.get('/users', { params }),
  all: () => api.get('/users/all'),
  get: (userId) => api.get(`/users/${userId}`),
  create: (data) => api.post('/users', data),
  update: (userId, data) => api.put(`/users/${userId}`, data),
  resetPassword: (userId, data) => api.put(`/users/${userId}/password`, data),
  delete: (userId) => api.delete(`/users/${userId}`),
  uploadAvatar: (userId, file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return api.post(`/users/${userId}/avatar`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  deleteAvatar: (userId) => api.delete(`/users/${userId}/avatar`)
};

export const roleAPI = {
  list: (params) => api.get('/roles', { params }),
  all: () => api.get('/roles/all'),
  get: (roleId) => api.get(`/roles/${roleId}`),
  create: (data) => api.post('/roles', data),
  update: (roleId, data) => api.put(`/roles/${roleId}`, data),
  delete: (roleId) => api.delete(`/roles/${roleId}`),
  initRoles: () => api.post('/roles/init-roles')
};

export const loginHistoryAPI = {
  list: (params) => api.get('/login-history', { params }),
  getByUser: (userId, params) => api.get(`/login-history/user/${userId}`, { params }),
  delete: (id) => api.delete(`/login-history/${id}`),
  clear: (data) => api.delete('/login-history', { data })
};

export const operationLogAPI = {
  list: (params) => api.get('/operation-logs', { params }),
  getActions: () => api.get('/operation-logs/actions'),
  getModules: () => api.get('/operation-logs/modules'),
  delete: (id) => api.delete(`/operation-logs/${id}`),
  clear: (data) => api.delete('/operation-logs', { data })
};

export default api;
