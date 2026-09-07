import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import ru from './locales/ru.json';
import en from './locales/en.json';
import tg from './locales/tg.json';

export const supportedLanguages = [
  { code: 'ru', label: 'Русский' },
  { code: 'en', label: 'English' },
  { code: 'tg', label: 'Тоҷикӣ' },
] as const;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ru: { translation: ru },
      en: { translation: en },
      tg: { translation: tg },
    },
    fallbackLng: 'ru',
    supportedLngs: ['ru', 'en', 'tg'],
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'sao_lang',
    },
  });

export default i18n;
