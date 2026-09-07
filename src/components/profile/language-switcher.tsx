import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';
import { supportedLanguages } from '@/i18n';
import { cn } from '@/lib/utils';

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  return (
    <div className="glass-soft rounded-2xl px-4 py-3.5">
      <div className="mb-2.5 flex items-center gap-2 text-[13px] font-medium text-mist">
        <Languages className="h-4 w-4" />
        {t('profile.language')}
      </div>
      <div className="flex gap-2">
        {supportedLanguages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => i18n.changeLanguage(lang.code)}
            className={cn(
              'flex-1 rounded-xl px-3 py-2 text-[13px] font-semibold transition-colors',
              i18n.language === lang.code
                ? 'bg-primary text-white'
                : 'bg-white/5 text-mist hover:bg-white/10 hover:text-ink',
            )}
          >
            {lang.label}
          </button>
        ))}
      </div>
    </div>
  );
}
