import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getSocket } from '@/lib/socket';
import { useAuthStore } from '@/store/auth-store';
import type { ChatSummary, Message } from '@/types';

export function useChatRoomSocket(chatId: string | undefined) {
  const queryClient = useQueryClient();
  const currentUserId = useAuthStore((s) => s.user?.id);
  const [peerTyping, setPeerTyping] = useState(false);

  useEffect(() => {
    if (!chatId) return;
    const socket = getSocket();

    socket.emit('chat:join', { chatId });

    const upsertMessage = (message: Message) => {
      queryClient.setQueryData<Message[]>(['messages', chatId], (old) => {
        if (!old) return [message];
        const idx = old.findIndex((m) => m.id === message.id);
        if (idx === -1) return [...old, message];
        const next = [...old];
        next[idx] = message;
        return next;
      });

      queryClient.setQueriesData<ChatSummary[]>({ queryKey: ['chats'] }, (old) =>
        old?.map((c) =>
          c.id === chatId
            ? {
                ...c,
                updatedAt: message.createdAt,
                lastMessage: {
                  id: message.id,
                  text: message.text,
                  deleted: message.deleted,
                  senderId: message.senderId,
                  status: message.status,
                  createdAt: message.createdAt,
                },
              }
            : c,
        ),
      );
    };

    const onNew = (message: Message) => {
      upsertMessage(message);
      if (message.senderId !== currentUserId) {
        socket.emit('chat:read', { chatId });
        setPeerTyping(false);
      }
    };

    const onUpdate = (message: Message) => upsertMessage(message);
    const onDelete = (message: Message) => upsertMessage(message);

    const onTypingStart = (data: { chatId: string }) => {
      if (data.chatId === chatId) setPeerTyping(true);
    };
    const onTypingStop = (data: { chatId: string }) => {
      if (data.chatId === chatId) setPeerTyping(false);
    };

    socket.on('message:new', onNew);
    socket.on('message:update', onUpdate);
    socket.on('message:delete', onDelete);
    socket.on('typing:start', onTypingStart);
    socket.on('typing:stop', onTypingStop);

    return () => {
      socket.emit('chat:leave', { chatId });
      socket.off('message:new', onNew);
      socket.off('message:update', onUpdate);
      socket.off('message:delete', onDelete);
      socket.off('typing:start', onTypingStart);
      socket.off('typing:stop', onTypingStop);
      setPeerTyping(false);
    };
  }, [chatId, currentUserId, queryClient]);

  return { peerTyping };
}
