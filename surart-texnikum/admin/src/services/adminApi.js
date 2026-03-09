import axios from 'axios';
const adminApi = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api' });
adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
adminApi.interceptors.response.use((r) => r, (error) => {
  if (error.response?.status === 401) { localStorage.removeItem('admin_token'); location.href = '/admin/login'; }
  return Promise.reject(error);
});
export default adminApi;
