import { create } from 'zustand';
import { persist } from 'zustand/middleware';
interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  profession: string;
  location: string;
  avatar: string | null;
  createdAt: string;
}
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (userData: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    profession: string;
    location: string;
    avatar?: string | null;
  }) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  deleteAccount: () => Promise<void>;
  checkAuth: () => Promise<void>;
}
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      login: async (username, password) => {
        set({ isLoading: true });
        try {
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
          });
          const data = await res.json();
          if (!res.ok) {
            set({ isLoading: false });
            return false;
          }
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
          });
          return true;
        } catch (error) {
          set({ isLoading: false });
          return false;
        }
      },
      register: async (userData) => {
        set({ isLoading: true });
        try {
          const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
          });
          const data = await res.json();
          if (!res.ok) {
            set({ isLoading: false });
            return false;
          }
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
          });
          return true;
        } catch (error) {
          set({ isLoading: false });
          return false;
        }
      },
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },
      updateProfile: async (updates) => {
        const token = get().token;
        if (!token) return;
        const res = await fetch('/api/users/me', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(updates),
        });
        const data = await res.json();
        if (res.ok) {
          set({ user: data.user });
        }
      },
      deleteAccount: async () => {
        const token = get().token;
        if (!token) return;
        await fetch('/api/users/me', {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        set({ user: null, token: null, isAuthenticated: false });
      },
      checkAuth: async () => {
        const token = get().token;
        if (!token) return;
        try {
          const res = await fetch('/api/auth/me', {
            headers: { 'Authorization': `Bearer ${token}` },
          });
          if (!res.ok) {
            set({ user: null, token: null, isAuthenticated: false });
            return;
          }
          const data = await res.json();
          set({ user: data.user, isAuthenticated: true });
        } catch (error) {
          set({ user: null, token: null, isAuthenticated: false });
        }
      },
    }),
    { name: 'agroklinik-auth' }
  )
);