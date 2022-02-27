import { secureLsConfig } from '@/config/secureLsConfig';
import { fallbackLocale } from '@/plugins/i18n';
import { StringKeyObject } from '@server/types/custom';
import dayjs from 'dayjs';
import secureLs from 'secure-ls';
import { LocaleHandler } from './localeHandler';

const dateLocales: StringKeyObject = {
  ja: () => import('dayjs/locale/ja'),
  en: () => import('dayjs/locale/en'),
};

const makeLocaleHandler = new LocaleHandler().init({
  secureLs,
  fallbackLocale,
  dayjs,
  dateLocales,
  secureLsConfig,
});

export { makeLocaleHandler };
