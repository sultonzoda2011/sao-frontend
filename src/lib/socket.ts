import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/auth-store';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (socket) return socket;

  const token = useAuthStore.getState().accessToken;
  socket = io(import.meta.env.VITE_WS_URL, {
    auth: { token },
    autoConnect: false,
    transports: ['websocket'],
  });

  return socket;
}

export function connectSocket() {
  const s = getSocket();
  if (!s.connected) {
    // refresh token in case it changed since the socket instance was created
    s.auth = { token: useAuthStore.getState().accessToken };
    s.connect();
  }
  return s;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}
