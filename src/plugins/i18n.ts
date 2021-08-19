import Vue from 'vue';
import VueI18n from 'vue-i18n';
import { getStartingLocale } from './localeUtils/getStartingLocale';
import { loadLocaleMessages } from './localeUtils/loadLocaleMessages';
import { loadDayjsLocale } from './localeUtils/loadDayjsLocale';
import { StringKeyObject } from '@server/types/custom/index';

Vue.use(VueI18n);

const SUPPORTED_LOCALES: StringKeyObject = Object.freeze({
  en: 'English',
  ja: '日本語',
});

const fallbackLocale = process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en';
const locale = getStartingLocale(SUPPORTED_LOCALES, fallbackLocale);
loadDayjsLocale(locale);

export default new VueI18n({
  locale,
  fallbackLocale,
  messages: loadLocaleMessages(),
});

export { SUPPORTED_LOCALES, fallbackLocale, locale };
