import { useQuery } from '@tanstack/react-query';
import { MessageCircleOff, SquarePen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { chatsApi } from '@/lib/chats-api';
import { useAuthStore } from '@/store/auth-store';
import { ChatListItem } from '@/components/chat/chat-list-item';
import { Skeleton } from '@/components/ui/skeleton';

export default function ChatsListPage() {
  const currentUserId = useAuthStore((s) => s.user?.id);
  const { data: chats, isLoading } = useQuery({
    queryKey: ['chats'],
    queryFn: chatsApi.list,
    refetchInterval: 20_000,
  });

  return (
    <div className="flex h-full flex-col">
      <header className="safe-top flex items-center justify-between px-5 pb-3 pt-6">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-extrabold">Чаты</h1>
        <Link
          to="/search"
          className="flex h-10 w-10 items-center justify-center rounded-full glass-soft text-ink active:scale-95"
          aria-label="Новый чат"
        >
          <SquarePen className="h-[18px] w-[18px]" />
        </Link>
      </header>

      <div className="flex-1 overflow-y-auto px-3 pb-28">
        {isLoading && (
          <div className="flex flex-col gap-3 px-2 pt-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="mb-2 h-3.5 w-1/3" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && chats?.length === 0 && (
          <div className="flex flex-col items-center gap-3 px-8 pt-24 text-center">
            <div className="glass-soft flex h-16 w-16 items-center justify-center rounded-full">
              <MessageCircleOff className="h-7 w-7 text-mist" />
            </div>
            <p className="font-[family-name:var(--font-display)] text-base font-bold">Пока пусто</p>
            <p className="text-sm text-mist">
              Найдите собеседника на вкладке поиска и начните первый диалог.
            </p>
            <Link to="/search" className="mt-2 text-sm font-semibold text-cyan">
              Найти пользователя
            </Link>
          </div>
        )}

        <div className="flex flex-col gap-0.5">
          {chats?.map((chat) => (
            <ChatListItem key={chat.id} chat={chat} currentUserId={currentUserId} />
          ))}
        </div>
      </div>
    </div>
  );
}
