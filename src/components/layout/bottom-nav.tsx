import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MessageCircle, Search, UserRound } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const { t } = useTranslation();
  const tabs = [
    { to: '/chats', label: t('nav.chats'), icon: MessageCircle },
    { to: '/search', label: t('nav.search'), icon: Search },
    { to: '/profile', label: t('nav.profile'), icon: UserRound },
  ];

  return (
    <nav className="safe-bottom glass-soft fixed inset-x-0 bottom-0 z-40 border-t border-white/10 md:hidden">
      <div className="mx-auto flex max-w-md items-center justify-around px-6 py-2.5">
        {tabs.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className="flex flex-1 flex-col items-center py-1.5" aria-label={label}>
            {({ isActive }) => (
              <Icon
                className={cn('h-[26px] w-[26px] transition-all', isActive ? 'text-primary' : 'text-mist')}
                strokeWidth={isActive ? 2.4 : 1.9}
              />
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
