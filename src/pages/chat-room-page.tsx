import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Send, X } from 'lucide-react';
import { chatsApi } from '@/lib/chats-api';
import { messagesApi } from '@/lib/messages-api';
import { getSocket } from '@/lib/socket';
import { useAuthStore } from '@/store/auth-store';
import { useChatRoomSocket } from '@/hooks/use-chat-room-socket';
import { Avatar, AvatarFallback, AvatarImage, OnlineDot } from '@/components/ui/avatar';
import { MessageBubble } from '@/components/chat/message-bubble';
import { TypingIndicator } from '@/components/chat/typing-indicator';
import { Textarea } from '@/components/ui/textarea';
import { initialsFrom, formatLastSeen } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { Message } from '@/types';

export default function ChatRoomPage() {
  const { t } = useTranslation();
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const currentUserId = useAuthStore((s) => s.user?.id);
  const { peerTyping } = useChatRoomSocket(chatId);

  const [draft, setDraft] = useState('');
  const [editing, setEditing] = useState<Message | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: chat } = useQuery({
    queryKey: ['chat', chatId],
    queryFn: () => chatsApi.getById(chatId!),
    enabled: !!chatId,
  });

  const { data: messages, isLoading } = useQuery({
    queryKey: ['messages', chatId],
    queryFn: () => messagesApi.history(chatId!),
    enabled: !!chatId,
  });

  useEffect(() => {
    if (chatId) messagesApi.markRead(chatId).catch(() => {});
  }, [chatId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages?.length, peerTyping]);

  const peer = chat?.peer;
  const peerName = peer?.displayName || peer?.username || t('chats.unknownUser');

  const statusLabel = useMemo(() => {
    if (peerTyping) return t('chatRoom.typing');
    if (peer?.isOnline) return t('chatRoom.online');
    if (peer?.lastSeenAt) return t('chatRoom.lastSeen', { time: formatLastSeen(peer.lastSeenAt) });
    return '';
  }, [peer, peerTyping, t]);

  function handleInputChange(value: string) {
    setDraft(value);
    if (!chatId) return;
    const socket = getSocket();
    socket.emit('typing:start', { chatId });
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => socket.emit('typing:stop', { chatId }), 1500);
  }

  function handleSend() {
    const text = draft.trim();
    if (!text || !chatId) return;
    const socket = getSocket();

    if (editing) {
      socket.emit('message:update', { messageId: editing.id, text });
      setEditing(null);
    } else {
      socket.emit('message:send', { chatId, text });
    }

    setDraft('');
    socket.emit('typing:stop', { chatId });
  }

  function handleDelete(message: Message) {
    getSocket().emit('message:delete', { messageId: message.id });
  }

  function handleEdit(message: Message) {
    setEditing(message);
    setDraft(message.text ?? '');
  }

  return (
    <div className="mx-auto flex h-dvh max-w-2xl flex-col md:border-x md:border-white/8">
      <header className="safe-top glass-soft z-10 flex items-center gap-3 px-3 pb-3 pt-6">
        <button
          onClick={() => navigate('/chats')}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink active:bg-white/10"
          aria-label={t('chatRoom.back')}
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <div className="relative">
          <Avatar>
            <AvatarImage src={peer?.avatarUrl ?? undefined} alt={peerName} />
            <AvatarFallback>{initialsFrom(peerName)}</AvatarFallback>
          </Avatar>
          <OnlineDot online={peer?.isOnline} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-ink">{peerName}</p>
          {statusLabel && (
            <p className={cn('text-xs', peerTyping ? 'text-primary-soft' : 'text-mist')}>{statusLabel}</p>
          )}
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 space-y-2.5 overflow-y-auto px-3 py-4">
        {isLoading && <p className="pt-10 text-center text-sm text-mist">{t('chatRoom.loading')}</p>}

        {!isLoading && messages?.length === 0 && (
          <p className="pt-16 text-center text-sm text-mist">
            {t('chatRoom.emptyState', { name: peerName })}
          </p>
        )}

        {messages?.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isOwn={message.senderId === currentUserId}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}

        {peerTyping && <TypingIndicator />}
      </div>

      <div className="safe-bottom px-3 pb-24 pt-2 md:pb-4">
        {editing && (
          <div className="glass-soft mb-2 flex items-center justify-between rounded-2xl px-3 py-2 text-xs text-mist">
            <span>{t('chatRoom.editingMessage')}</span>
            <button
              onClick={() => {
                setEditing(null);
                setDraft('');
              }}
              aria-label={t('chatRoom.cancelEdit')}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="glass flex items-end gap-2 rounded-3xl p-2">
          <Textarea
            value={draft}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={t('chatRoom.messagePlaceholder')}
            rows={1}
            className="max-h-32 min-h-[40px] border-none bg-transparent px-2 py-2 focus:bg-transparent"
          />
          <button
            onClick={handleSend}
            disabled={!draft.trim()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white disabled:opacity-40"
            aria-label={t('chatRoom.send')}
          >
            <Send className="h-[18px] w-[18px]" />
          </button>
        </div>
      </div>
    </div>
  );
}
