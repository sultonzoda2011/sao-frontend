export interface PublicUser {
  id: string;
  email: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  isOnline?: boolean;
  lastSeenAt?: string;
}

export interface SearchUser {
  id: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  isOnline: boolean;
}

export type MessageStatus = 'SENT' | 'DELIVERED' | 'READ';

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string | null;
  deleted: boolean;
  isEdited: boolean;
  status: MessageStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ChatPeer {
  id: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  isOnline: boolean;
  lastSeenAt: string;
}

export interface ChatSummary {
  id: string;
  isGroup: boolean;
  updatedAt: string;
  peer: ChatPeer | null;
  lastMessage: {
    id: string;
    text: string | null;
    deleted: boolean;
    senderId: string;
    status: MessageStatus;
    createdAt: string;
  } | null;
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  createdAt: string;
}

export interface AuthResponse {
  user: PublicUser;
  accessToken: string;
}
