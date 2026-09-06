import { api } from '@/lib/api';
import type { Message } from '@/types';

export const messagesApi = {
  history: (chatId: string, cursor?: string, limit = 30) =>
    api
      .get<Message[]>(`/chats/${chatId}/messages`, { params: { cursor, limit } })
      .then((r) => r.data),

  send: (chatId: string, text: string) =>
    api.post<Message>(`/chats/${chatId}/messages`, { text }).then((r) => r.data),

  markRead: (chatId: string) => api.post(`/chats/${chatId}/read`).then((r) => r.data),

  update: (id: string, text: string) =>
    api.patch<Message>(`/messages/${id}`, { text }).then((r) => r.data),

  remove: (id: string) => api.delete<Message>(`/messages/${id}`).then((r) => r.data),
};
