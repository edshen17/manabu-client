import Vue from 'vue';
import VueI18n from 'vue-i18n';
import { getStartingLocale } from './localeUtils/getStartingLocale';
import { loadLocaleMessages } from './localeUtils/loadLocaleMessages';
import { loadDayjsLocale } from './localeUtils/loadDayjsLocale';

export const SUPPORTED_LOCALES: { [key: string]: string } = Object.freeze({
  en: 'English',
  ja: '日本語',
});

Vue.use(VueI18n);
export const fallbackLocale = process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en';
export const locale = getStartingLocale(SUPPORTED_LOCALES, fallbackLocale);
loadDayjsLocale(locale);

export default new VueI18n({
  locale,
  fallbackLocale,
  messages: loadLocaleMessages(),
});
