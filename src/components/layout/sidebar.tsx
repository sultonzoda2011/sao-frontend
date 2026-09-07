import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MessageCircle, Search, UserRound, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth-store';
import { authApi } from '@/lib/auth-api';
import { disconnectSocket } from '@/lib/socket';

export function Sidebar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const clearSession = useAuthStore((s) => s.clearSession);

  const tabs = [
    { to: '/chats', label: t('nav.chats'), icon: MessageCircle },
    { to: '/search', label: t('nav.search'), icon: Search },
    { to: '/profile', label: t('nav.profile'), icon: UserRound },
  ];

  async function handleLogout() {
    try {
      await authApi.logout();
    } catch {
      // ignore
    }
    disconnectSocket();
    clearSession();
    navigate('/login', { replace: true });
  }

  return (
    <aside className="sticky top-0 hidden h-dvh w-[248px] shrink-0 flex-col border-r border-white/8 px-3 py-6 md:flex lg:w-[280px]">
      <div className="mb-8 flex items-center gap-2.5 px-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm font-extrabold text-white">
          SA
        </div>
        <span className="font-[family-name:var(--font-display)] text-lg font-extrabold">
          {t('app.name')}
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {tabs.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3.5 rounded-2xl px-3.5 py-3 text-[15px] font-medium transition-colors',
                isActive ? 'bg-white/8 text-ink' : 'text-mist hover:bg-white/5 hover:text-ink',
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon className="h-6 w-6" strokeWidth={isActive ? 2.3 : 1.9} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3.5 rounded-2xl px-3.5 py-3 text-[15px] font-medium text-mist transition-colors hover:bg-white/5 hover:text-danger"
      >
        <LogOut className="h-6 w-6" strokeWidth={1.9} />
        {t('nav.logout')}
      </button>
    </aside>
  );
}
