import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Ghost } from 'lucide-react';

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="glass-soft flex h-16 w-16 items-center justify-center rounded-full">
        <Ghost className="h-7 w-7 text-mist" />
      </div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-extrabold">404</h1>
      <p className="text-sm text-mist">
        {t('app.name')} — {t('chats.empty.title')}
      </p>
      <Link to="/chats" className="mt-2 text-sm font-semibold text-primary-soft hover:underline">
        {t('chatRoom.back')}
      </Link>
    </div>
  );
}
