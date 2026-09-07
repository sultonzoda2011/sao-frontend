import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Check, CheckCheck } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage, OnlineDot } from '@/components/ui/avatar';
import { formatChatTime, initialsFrom } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { ChatSummary } from '@/types';

export function ChatListItem({ chat, currentUserId }: { chat: ChatSummary; currentUserId?: string }) {
  const { t } = useTranslation();
  const peer = chat.peer;
  const name = peer?.displayName || peer?.username || t('chats.unknownUser');
  const last = chat.lastMessage;
  const isOwn = last?.senderId === currentUserId;
  const unread = !!last && !isOwn && last.status !== 'READ';

  let preview = t('chats.noMessages');
  if (last) {
    if (last.deleted) preview = t('chats.deletedMessage');
    else preview = last.text ?? '';
    if (isOwn && !last.deleted) preview = `${t('chats.you')}: ${preview}`;
  }

  return (
    <Link
      to={`/chats/${chat.id}`}
      className="flex items-center gap-3 rounded-3xl px-3 py-3 transition-colors active:bg-white/5"
    >
      <div className="relative">
        <Avatar className="h-12 w-12">
          <AvatarImage src={peer?.avatarUrl ?? undefined} alt={name} />
          <AvatarFallback>{initialsFrom(name)}</AvatarFallback>
        </Avatar>
        <OnlineDot online={peer?.isOnline} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <span className="truncate font-semibold text-ink">{name}</span>
          {last && (
            <span className={cn('shrink-0 text-[11px]', unread ? 'text-primary-soft' : 'text-mist')}>
              {formatChatTime(last.createdAt)}
            </span>
          )}
        </div>
        <div className="mt-0.5 flex items-center gap-1">
          {isOwn && last && !last.deleted && (
            last.status === 'READ' ? (
              <CheckCheck className="h-3.5 w-3.5 shrink-0 text-primary-soft" />
            ) : (
              <Check className="h-3.5 w-3.5 shrink-0 text-mist" />
            )
          )}
          <p className={cn('truncate text-[13px]', unread ? 'font-medium text-ink' : 'text-mist')}>
            {preview}
          </p>
          {unread && <span className="ml-auto h-2 w-2 shrink-0 rounded-full bg-primary" />}
        </div>
      </div>
    </Link>
  );
}
