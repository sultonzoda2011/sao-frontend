import i18n from '@/i18n';

function localeTag(): string {
  switch (i18n.language) {
    case 'en':
      return 'en-US';
    case 'tg':
      return 'tg-TJ';
    default:
      return 'ru-RU';
  }
}

export function formatChatTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  if (isToday) {
    return date.toLocaleTimeString(localeTag(), { hour: '2-digit', minute: '2-digit' });
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return i18n.t('time.yesterday');

  return date.toLocaleDateString(localeTag(), { day: '2-digit', month: '2-digit' });
}

export function formatLastSeen(iso?: string): string {
  if (!iso) return '';
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return i18n.t('time.justNow');
  if (diffMin < 60) return i18n.t('time.minutesAgo', { count: diffMin });
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return i18n.t('time.hoursAgo', { count: diffH });
  return date.toLocaleDateString(localeTag(), { day: '2-digit', month: '2-digit' });
}

export function initialsFrom(name: string): string {
  return name.trim().slice(0, 2).toUpperCase();
}
