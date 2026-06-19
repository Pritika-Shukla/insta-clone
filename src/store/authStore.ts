import { create } from 'zustand';
import { storage } from '../services/storage';
import { AUTH_KEY } from '../constants';
import type { AuthUser, AuthState } from '../types';

export const useAuthStore = create<AuthState>(set => ({
  isLoggedIn: null,
  email: '',

  hydrate: async () => {
    const data = await storage.get<AuthUser>(AUTH_KEY);
    if (data) {
      set({ isLoggedIn: true, email: data.email });
    } else {
      set({ isLoggedIn: false });
    }
  },

  login: async (email: string) => {
    await storage.set<AuthUser>(AUTH_KEY, { email });
    set({ isLoggedIn: true, email });
  },

  logout: async () => {
    await storage.remove(AUTH_KEY);
    set({ isLoggedIn: false, email: '' });
  },
}));
