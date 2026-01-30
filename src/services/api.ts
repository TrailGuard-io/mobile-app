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
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  },
  
  register: async (email: string, password: string, name?: string) => {
    const response = await api.post('/api/auth/register', { email, password, name });
    return response.data;
  },
};

export const rescueService = {
  getMyRescues: async () => {
    const response = await api.get('/api/rescue/my');
    return response.data;
  },
  
  getAllRescues: async () => {
    const response = await api.get('/api/rescue/all');
    return response.data;
  },
  
  requestRescue: async (latitude: number, longitude: number, message?: string) => {
    const response = await api.post('/api/rescue/request', {
      latitude,
      longitude,
      message,
    });
    return response.data;
  },
  
  updateRescueStatus: async (rescueId: number, status: string) => {
    const response = await api.patch(`/api/rescue/${rescueId}/status`, { status });
    return response.data;
  },
};

export const teamService = {
  getAllTeams: async () => {
    const response = await api.get('/api/teams');
    return response.data;
  },
  
  getTeamById: async (teamId: number) => {
    const response = await api.get(`/api/teams/${teamId}`);
    return response.data;
  },
  
  createTeam: async (teamData: {
    name: string;
    description?: string;
    isPublic: boolean;
    maxMembers: number;
  }) => {
    const response = await api.post('/api/teams', teamData);
    return response.data;
  },
  
  updateTeam: async (teamId: number, teamData: {
    name?: string;
    description?: string;
    isPublic?: boolean;
    maxMembers?: number;
  }) => {
    const response = await api.put(`/api/teams/${teamId}`, teamData);
    return response.data;
  },
  
  joinTeam: async (teamId: number) => {
    const response = await api.post(`/api/teams/${teamId}/join`);
    return response.data;
  },
  
  leaveTeam: async (teamId: number) => {
    const response = await api.post(`/api/teams/${teamId}/leave`);
    return response.data;
  },
  
  getTeamMessages: async (teamId: number) => {
    const response = await api.get(`/api/teams/${teamId}/messages`);
    return response.data;
  },
  
  sendTeamMessage: async (teamId: number, content: string) => {
    const response = await api.post(`/api/teams/${teamId}/messages`, { content });
    return response.data;
  },
};

export const expeditionService = {
  getAllExpeditions: async (filters?: {
    difficulty?: string;
    status?: string;
    teamId?: number;
  }) => {
    const params = new URLSearchParams();
    if (filters?.difficulty) params.append('difficulty', filters.difficulty);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.teamId) params.append('teamId', filters.teamId.toString());
    
    const response = await api.get(`/api/expeditions?${params.toString()}`);
    return response.data;
  },
  
  getExpeditionById: async (expeditionId: number) => {
    const response = await api.get(`/api/expeditions/${expeditionId}`);
    return response.data;
  },
  
  createExpedition: async (expeditionData: {
    title: string;
    description?: string;
    startDate: string;
    endDate?: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    maxParticipants: number;
    cost?: number;
    isPremium: boolean;
    startLat?: number;
    startLng?: number;
    endLat?: number;
    endLng?: number;
    route?: Array<{ lat: number; lng: number; name?: string }>;
    teamId?: number;
  }) => {
    const response = await api.post('/api/expeditions', expeditionData);
    return response.data;
  },
  
  updateExpedition: async (expeditionId: number, expeditionData: any) => {
    const response = await api.put(`/api/expeditions/${expeditionId}`, expeditionData);
    return response.data;
  },
  
  joinExpedition: async (expeditionId: number) => {
    const response = await api.post(`/api/expeditions/${expeditionId}/join`);
    return response.data;
  },
  
  leaveExpedition: async (expeditionId: number) => {
    const response = await api.post(`/api/expeditions/${expeditionId}/leave`);
    return response.data;
  },
  
  updateMemberStatus: async (expeditionId: number, memberId: number, status: string) => {
    const response = await api.post(`/api/expeditions/${expeditionId}/members/${memberId}/status`, { status });
    return response.data;
  },
  
  getExpeditionMessages: async (expeditionId: number) => {
    const response = await api.get(`/api/expeditions/${expeditionId}/messages`);
    return response.data;
  },
  
  sendExpeditionMessage: async (expeditionId: number, content: string) => {
    const response = await api.post(`/api/expeditions/${expeditionId}/messages`, { content });
    return response.data;
  },
};

export const subscriptionService = {
  getPlans: async () => {
    const response = await api.get('/api/subscriptions/plans');
    return response.data;
  },
  
  getCurrentSubscription: async () => {
    const response = await api.get('/api/subscriptions/current');
    return response.data;
  },
  
  createSubscription: async (type: 'premium' | 'pro', paymentId: string) => {
    const response = await api.post('/api/subscriptions', { type, paymentId });
    return response.data;
  },
  
  cancelSubscription: async () => {
    const response = await api.post('/api/subscriptions/cancel');
    return response.data;
  },
  
  getSubscriptionHistory: async () => {
    const response = await api.get('/api/subscriptions/history');
    return response.data;
  },
};

export default api;