import { api } from '@/lib/api';
import type { ChatSummary } from '@/types';

export const chatsApi = {
  list: () => api.get<ChatSummary[]>('/chats').then((r) => r.data),

  createOrGet: (targetUserId: string) =>
    api.post<ChatSummary>('/chats', { targetUserId }).then((r) => r.data),

  getById: (id: string) => api.get<ChatSummary>(`/chats/${id}`).then((r) => r.data),
};
