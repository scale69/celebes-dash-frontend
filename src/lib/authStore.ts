// lib/authStore.ts
import { create } from "zustand";
import { User } from "@/types/data";

interface AuthState {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setAccessToken: (token: string) => void;
  setUser: (user: User) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,

  setAccessToken: (token) => set({ accessToken: token, isAuthenticated: true }),

  setUser: (user) => set({ user }),

  clearAuth: () =>
    set({ accessToken: null, user: null, isAuthenticated: false }),
}));
