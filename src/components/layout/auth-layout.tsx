import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

export function AuthLayout({ children }: { children: ReactNode }) {
  const { t } = useTranslation();

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden px-6 py-10">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/25 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 rounded-full bg-primary/15 blur-[100px]" />

      <div className="relative w-full max-w-sm">
        <div className="mb-10 text-center">
          <div className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-xl font-[family-name:var(--font-display)] font-extrabold text-white">
            SA
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-extrabold tracking-tight">
            {t('app.name')} Messenger
          </h1>
          <p className="mt-1 text-sm text-mist">{t('app.tagline')}</p>
        </div>

        <div className="glass rounded-3xl p-6">{children}</div>
      </div>
    </div>
  );
}
