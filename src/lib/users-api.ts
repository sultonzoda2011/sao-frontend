import { api } from '@/lib/api';
import type { PublicUser, SearchHistoryItem, SearchUser } from '@/types';

export const usersApi = {
  me: () => api.get<PublicUser>('/users/me').then((r) => r.data),

  updateProfile: (data: { displayName?: string; bio?: string; username?: string }) =>
    api.patch<PublicUser>('/users/me', data).then((r) => r.data),

  updatePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.patch('/users/me/password', data).then((r) => r.data),

  uploadAvatar: (file: File) => {
    const form = new FormData();
    form.append('avatar', file);
    return api
      .patch<PublicUser>('/users/me/avatar', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data);
  },

  search: (q: string, saveHistory = true) =>
    api
      .get<SearchUser[]>('/users/search', { params: { q, saveHistory } })
      .then((r) => r.data),

  searchHistory: () => api.get<SearchHistoryItem[]>('/users/search/history').then((r) => r.data),

  clearSearchHistory: () => api.delete('/users/search/history').then((r) => r.data),

  deleteSearchHistoryItem: (id: string) =>
    api.delete(`/users/search/history/${id}`).then((r) => r.data),
};
