import Vue from 'vue';
import VueI18n from 'vue-i18n';
import { StringKeyObject } from '@server/types/custom/';
import { makeLocaleHandler } from '../utils/localeHandler';

Vue.use(VueI18n);

const SUPPORTED_LOCALES: StringKeyObject = Object.freeze({
  en: 'English',
  ja: '日本語',
});
const localeHandler = makeLocaleHandler;
const fallbackLocale = process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en';
const locale = localeHandler.getStartingLocale(SUPPORTED_LOCALES, fallbackLocale);
localeHandler.loadDateLocale(locale);

export default new VueI18n({
  locale,
  fallbackLocale,
  messages: localeHandler.loadLocaleMessages(),
});

export { SUPPORTED_LOCALES, fallbackLocale, locale };
