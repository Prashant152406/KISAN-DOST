import { create } from "zustand";
import { authApi } from "../services/authApi.js";

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // true until the initial /auth/me check resolves

  // Called once on app startup — see App.jsx
  initAuth: async () => {
    try {
      const res = await authApi.me();
      set({ user: res.data.data.user, isAuthenticated: true, isLoading: false });
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  logout: async () => {
    try {
      await authApi.logout();
    } finally {
      set({ user: null, isAuthenticated: false });
    }
  },

  logoutAll: async () => {
    try {
      await authApi.logoutAll();
    } finally {
      set({ user: null, isAuthenticated: false });
    }
  },
}));
