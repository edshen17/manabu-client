import SecureLS from 'secure-ls';
import { secureLsConfig } from '@/config/secureLsConfig';
import { getBrowserLocale } from './getBrowserLocale';
import { fallbackLocale } from '../i18n';

const getStoredLocale = (): string => {
  try {
    const ls = new SecureLS(secureLsConfig);
    let storedLocale = null;
    storedLocale = JSON.parse(ls.get('user')).userData.settings.locale;
    return storedLocale;
  } catch (err) {
    return fallbackLocale;
  }
};

export const getStartingLocale = (SUPPORTED_LOCALES: {}, fallbackLocale: string): string => {
  const storedLocale = getStoredLocale();
  if (storedLocale) {
    return storedLocale;
  }
  const browserLocale = getBrowserLocale({ countryCodeOnly: true });
  if (browserLocale && Object.values(SUPPORTED_LOCALES).includes(browserLocale)) {
    return browserLocale;
  } else {
    return fallbackLocale;
  }
};
