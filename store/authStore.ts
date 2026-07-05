import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  profession: string;
  location: string;
  avatar: string | null;
  createdAt: Date;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id' | 'createdAt'>) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  deleteAccount: () => void;
}

const professionEmojis: Record<string, string> = {
  'Çiftçi': '👨‍🌾',
  'Ziraat Mühendisi': '🌾',
  'Botanikçi': '🌿',
  'Hobi Bahçıvanı': '🪴',
  'Tarım Teknisyeni': '🛠️',
  'Veteriner': '🐄',
  'Öğrenci': '📚',
  'Diğer': '🌱',
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (username, password) => {
        set({ isLoading: true });
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Demo: herhangi bir kullanıcı adı/şifre ile giriş yap
        const demoUser: User = {
          id: 'demo-user-123',
          firstName: 'Demo',
          lastName: 'Kullanıcı',
          profession: 'Çiftçi',
          location: 'Antalya, Türkiye',
          avatar: '👨‍🌾',
          createdAt: new Date(),
        };
        
        set({ user: demoUser, isAuthenticated: true, isLoading: false });
        return true;
      },

      register: async (userData) => {
        set({ isLoading: true });
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const newUser: User = {
          ...userData,
          id: crypto.randomUUID(),
          avatar: userData.avatar || professionEmojis[userData.profession] || '🌱',
          createdAt: new Date(),
        };
        
        set({ user: newUser, isAuthenticated: true, isLoading: false });
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      updateProfile: (updates) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...updates } });
        }
      },

      deleteAccount: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    { name: 'agroklinik-auth' }
  )
);
