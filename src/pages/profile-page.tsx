import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { authApi } from '@/lib/auth-api';
import { disconnectSocket } from '@/lib/socket';
import { AvatarUploader } from '@/components/profile/avatar-uploader';
import { EditProfileDialog } from '@/components/profile/edit-profile-dialog';
import { ChangePasswordDialog } from '@/components/profile/change-password-dialog';
import { LanguageSwitcher } from '@/components/profile/language-switcher';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function ProfilePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const clearSession = useAuthStore((s) => s.clearSession);

  async function handleLogout() {
    try {
      await authApi.logout();
    } catch {
      // ignore network errors on logout
    }
    disconnectSocket();
    clearSession();
    navigate('/login', { replace: true });
  }

  const name = user?.displayName || user?.username || '';

  return (
    <div className="flex h-full flex-col">
      <header className="safe-top px-5 pb-3 pt-6">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-extrabold">
          {t('profile.title')}
        </h1>
      </header>

      <div className="flex-1 overflow-y-auto px-5 pb-28 md:pb-6">
        <div className="glass mb-6 flex flex-col items-center gap-3 rounded-3xl px-6 py-8">
          <AvatarUploader />
          <div className="text-center">
            <p className="font-[family-name:var(--font-display)] text-lg font-bold">{name}</p>
            <p className="text-sm text-mist">@{user?.username}</p>
          </div>
          {user?.bio && <p className="text-center text-sm text-mist">{user.bio}</p>}
        </div>

        <div className="flex flex-col gap-2.5">
          <EditProfileDialog />
          <ChangePasswordDialog />

          <LanguageSwitcher />

          <Separator className="my-2" />

          <Button variant="danger" onClick={handleLogout} className="w-full justify-start md:hidden">
            <LogOut className="h-4 w-4" /> {t('nav.logout')}
          </Button>
        </div>

        <div className="mt-8 text-center text-xs text-mist/60">{user?.email}</div>
      </div>
    </div>
  );
}
