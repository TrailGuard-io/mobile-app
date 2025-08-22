import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserState {
  token: string | null;
  email: string | null;
  isLoading: boolean;
  setToken: (token: string) => Promise<void>;
  setEmail: (email: string) => void;
  loadToken: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  token: null,
  email: null,
  isLoading: true,
  
  setToken: async (token: string) => {
    await AsyncStorage.setItem('token', token);
    set({ token });
  },
  
  setEmail: (email: string) => {
    set({ email });
  },
  
  loadToken: async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      set({ token, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
    }
  },
  
  logout: async () => {
    await AsyncStorage.removeItem('token');
    set({ token: null, email: null });
  },
}));