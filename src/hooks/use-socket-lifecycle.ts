import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth-store';
import { connectSocket, disconnectSocket, getSocket } from '@/lib/socket';
import type { ChatSummary } from '@/types';

export function useSocketLifecycle() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!accessToken) {
      disconnectSocket();
      return;
    }

    const socket = connectSocket();

    const onOnline = ({ userId }: { userId: string }) => {
      queryClient.setQueriesData<ChatSummary[]>({ queryKey: ['chats'] }, (old) =>
        old?.map((c) => (c.peer?.id === userId ? { ...c, peer: { ...c.peer!, isOnline: true } } : c)),
      );
    };

    const onOffline = ({ userId, lastSeenAt }: { userId: string; lastSeenAt: string }) => {
      queryClient.setQueriesData<ChatSummary[]>({ queryKey: ['chats'] }, (old) =>
        old?.map((c) =>
          c.peer?.id === userId ? { ...c, peer: { ...c.peer!, isOnline: false, lastSeenAt } } : c,
        ),
      );
    };

    socket.on('user:online', onOnline);
    socket.on('user:offline', onOffline);

    return () => {
      socket.off('user:online', onOnline);
      socket.off('user:offline', onOffline);
    };
  }, [accessToken, queryClient]);
}

export { getSocket };
