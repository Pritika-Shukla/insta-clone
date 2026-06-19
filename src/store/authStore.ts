import { create } from 'zustand';
import { storage } from '../services/storage';
import { AUTH_KEY } from '../constants';
import type { AuthUser, AuthState } from '../types';

export const useAuthStore = create<AuthState>(set => ({
  isLoggedIn: null,
  name: '',
  email: '',

  hydrate: async () => {
    const data = await storage.get<AuthUser>(AUTH_KEY);
    if (data) {
      set({ isLoggedIn: true, name: data.name, email: data.email });
    } else {
      set({ isLoggedIn: false });
    }
  },

  login: async (name: string, email: string) => {
    await storage.set<AuthUser>(AUTH_KEY, { name, email });
    set({ isLoggedIn: true, name, email });
  },

  logout: async () => {
    await storage.remove(AUTH_KEY);
    set({ isLoggedIn: false, name: '', email: '' });
  },
}));
