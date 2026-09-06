import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Search, X, Clock } from 'lucide-react';
import { usersApi } from '@/lib/users-api';
import { chatsApi } from '@/lib/chats-api';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage, OnlineDot } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { initialsFrom } from '@/lib/format';

export default function SearchPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  const [startingId, setStartingId] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim()), 300);
    return () => clearTimeout(t);
  }, [query]);

  const { data: results, isFetching } = useQuery({
    queryKey: ['user-search', debounced],
    queryFn: () => usersApi.search(debounced),
    enabled: debounced.length > 0,
  });

  const { data: history } = useQuery({
    queryKey: ['search-history'],
    queryFn: usersApi.searchHistory,
    enabled: debounced.length === 0,
  });

  async function handleSelectUser(userId: string) {
    setStartingId(userId);
    try {
      const chat = await chatsApi.createOrGet(userId);
      queryClient.invalidateQueries({ queryKey: ['chats'] });
      navigate(`/chats/${chat.id}`);
    } finally {
      setStartingId(null);
    }
  }

  async function removeHistoryItem(id: string) {
    await usersApi.deleteSearchHistoryItem(id);
    queryClient.invalidateQueries({ queryKey: ['search-history'] });
  }

  return (
    <div className="flex h-full flex-col">
      <header className="safe-top px-5 pb-3 pt-6">
        <h1 className="mb-3 font-[family-name:var(--font-display)] text-2xl font-extrabold">Поиск</h1>
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-mist" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Имя пользователя или email"
            className="pl-11"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-mist"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-3 pb-28">
        {debounced.length === 0 && (
          <div className="px-2">
            {history && history.length > 0 && (
              <>
                <p className="mb-1 px-2 text-xs font-semibold uppercase tracking-wide text-mist/70">
                  Недавние запросы
                </p>
                <div className="flex flex-col">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 rounded-2xl px-2 py-2.5 text-sm text-ink"
                    >
                      <Clock className="h-4 w-4 shrink-0 text-mist" />
                      <button className="flex-1 truncate text-left" onClick={() => setQuery(item.query)}>
                        {item.query}
                      </button>
                      <button
                        onClick={() => removeHistoryItem(item.id)}
                        className="text-mist hover:text-ink"
                        aria-label="Удалить из истории"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {debounced.length > 0 && isFetching && (
          <div className="flex flex-col gap-3 px-2 pt-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <Skeleton className="h-3.5 w-1/2" />
              </div>
            ))}
          </div>
        )}

        {debounced.length > 0 && !isFetching && results?.length === 0 && (
          <p className="px-2 pt-10 text-center text-sm text-mist">Никого не нашлось</p>
        )}

        <div className="flex flex-col">
          {results?.map((user) => {
            const name = user.displayName || user.username;
            return (
              <button
                key={user.id}
                onClick={() => handleSelectUser(user.id)}
                disabled={startingId === user.id}
                className="flex items-center gap-3 rounded-3xl px-2 py-2.5 text-left transition-colors active:bg-white/5 disabled:opacity-50"
              >
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={user.avatarUrl ?? undefined} alt={name} />
                    <AvatarFallback>{initialsFrom(name)}</AvatarFallback>
                  </Avatar>
                  <OnlineDot online={user.isOnline} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-ink">{name}</p>
                  <p className="truncate text-[13px] text-mist">@{user.username}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
