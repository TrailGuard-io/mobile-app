import axios from 'axios';
import { useUserStore } from '../store/userStore';
import { API_BASE_URL } from '../config/api.config';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = useUserStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await useUserStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  register: async (email: string, password: string, name?: string) => {
    const response = await api.post('/auth/register', { email, password, name });
    return response.data;
  },
};

export const rescueService = {
  getMyRescues: async () => {
    const response = await api.get('/rescue/my');
    return response.data;
  },
  
  getAllRescues: async () => {
    const response = await api.get('/rescue/all');
    return response.data;
  },
  
  requestRescue: async (latitude: number, longitude: number, message?: string) => {
    const response = await api.post('/rescue/request', {
      latitude,
      longitude,
      message,
    });
    return response.data;
  },
  
  updateRescueStatus: async (rescueId: number, status: string) => {
    const response = await api.patch(`/rescue/${rescueId}/status`, { status });
    return response.data;
  },
};

export default api;