import { api } from '@/lib/api';
import type { AuthResponse } from '@/types';

export const authApi = {
  register: (data: { email: string; username: string; password: string; displayName?: string }) =>
    api.post<AuthResponse>('/auth/register', data).then((r) => r.data),

  login: (data: { login: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', data).then((r) => r.data),

  logout: () => api.post('/auth/logout').then((r) => r.data),
};
