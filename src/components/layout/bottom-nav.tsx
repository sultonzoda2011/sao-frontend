import { NavLink } from 'react-router-dom';
import { MessageCircle, Search, UserRound } from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  { to: '/chats', label: 'Чаты', icon: MessageCircle },
  { to: '/search', label: 'Поиск', icon: Search },
  { to: '/profile', label: 'Профиль', icon: UserRound },
];

export function BottomNav() {
  return (
    <nav className="safe-bottom fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-3">
      <div className="glass flex w-full max-w-sm items-center justify-around rounded-[28px] px-2 py-2">
        {tabs.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex flex-1 flex-col items-center gap-1 rounded-3xl py-2 text-[11px] font-medium transition-colors',
                isActive ? 'text-ink' : 'text-mist hover:text-ink/80',
              )
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-full transition-all',
                    isActive && 'accent-gradient shadow-[0_6px_16px_-4px_rgba(76,201,240,0.6)]',
                  )}
                >
                  <Icon className={cn('h-[19px] w-[19px]', isActive && 'text-[#050710]')} strokeWidth={2.3} />
                </span>
                {label}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
