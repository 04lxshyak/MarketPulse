import axios from 'axios';
import { getToken, clearToken } from '../utils/auth';

// Create a configured Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401s globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and force logout on 401 Unauthorized
      clearToken();
      window.dispatchEvent(new Event('unauthorized'));
    }
    return Promise.reject(error);
  }
);

export default api;
