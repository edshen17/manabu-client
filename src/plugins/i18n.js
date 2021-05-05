import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { dateTimeFormats } from '../locales/formats/dataTimeFormats'
import SecureEncryptedStorage from "secure-ls";
import SecureLsConfig from '../config/secureLs.config';
const encryptedStorage = new SecureEncryptedStorage(SecureLsConfig);
Vue.use(VueI18n)

export function loadLocaleMessages() {
  const locales = require.context(
    '@/locales',
    true,
    /[A-Za-z0-9-_,\s]+\.json$/i
  )
  const messages = {}
  locales.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i)
    if (matched && matched.length > 1) {
      const locale = matched[1]
      messages[locale] = locales(key)
    }
  })
  return messages
}

export function checkDefaultLanguage() {
  let matched = null
  let languages = Object.getOwnPropertyNames(loadLocaleMessages())
  languages.forEach(lang => {
    if (lang === navigator.language) {
      matched = lang
    }
  })
  if (!matched) {
    languages.forEach(lang => {
      let languagePartiaencryptedStorage = navigator.language.split('-')[0]
      if (lang === languagePartiaencryptedStorage) {
        matched = lang
      }
    })
  }
  if (!matched) {
    languages.forEach(lang => {
      let languagePartiaencryptedStorage = navigator.language.split('-')[0]
      if (lang.split('-')[0] === languagePartiaencryptedStorage) {
        matched = lang
      }
    })
  }
  return matched
}
let storedLocale = null;
try { // get stored locale 
  storedLocale = JSON.parse(encryptedStorage.get('metaData')).user.data.settings.locale
} catch(err) {
}

export const languages = Object.getOwnPropertyNames(loadLocaleMessages())
export const selectedLocale = storedLocale || checkDefaultLanguage() || process.env.VUE_APP_I18N_LOCALE || 'en'

export default new VueI18n({
  dateTimeFormats,
  locale: selectedLocale,
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
  messages: loadLocaleMessages()
})