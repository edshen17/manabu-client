import { LocaleHandler } from './localeHandler';
import secureLs from 'secure-ls';
import { fallbackLocale } from '@/plugins/i18n';
import dayjs from 'dayjs';
import { StringKeyObject } from '@server/types/custom';
import { secureLsConfig } from '@/config/secureLsConfig';

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
