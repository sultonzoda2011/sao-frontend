import { create } from 'zustand';
import type { PublicUser } from '@/types';

const TOKEN_KEY = 'sao_access_token';
const USER_KEY = 'sao_user';

interface AuthState {
  user: PublicUser | null;
  accessToken: string | null;
  isHydrated: boolean;
  setSession: (user: PublicUser, accessToken: string) => void;
  updateUser: (user: Partial<PublicUser>) => void;
  clearSession: () => void;
}

function loadUser(): PublicUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as PublicUser) : null;
  } catch {
    return null;
  }
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: loadUser(),
  accessToken: localStorage.getItem(TOKEN_KEY),
  isHydrated: true,

  setSession: (user, accessToken) => {
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    set({ user, accessToken });
  },

  updateUser: (partial) => {
    const current = get().user;
    if (!current) return;
    const merged = { ...current, ...partial };
    localStorage.setItem(USER_KEY, JSON.stringify(merged));
    set({ user: merged });
  },

  clearSession: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    set({ user: null, accessToken: null });
  },
}));
