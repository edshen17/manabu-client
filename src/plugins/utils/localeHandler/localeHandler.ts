import { StringKeyObject } from '@server/types/custom';
import { LocaleMessages } from 'vue-i18n';

class LocaleHandler {
  private _secureLs!: any;
  private _dayjs!: any;
  private _fallbackLocale!: string;
  private _dateLocales!: StringKeyObject;
  public secureLsConfig: StringKeyObject = {
    isCompression: false,
    encodingType: 'aes',
    encryptionSecret: process.env.VUE_APP_LS_ENCRYPTION_SECRET,
  };

  public getStartingLocale = (SUPPORTED_LOCALES: {}, fallbackLocale: string): string => {
    const storedLocale = this.getStoredLocale();
    if (storedLocale) {
      return storedLocale;
    }
    const browserLocale = this.getBrowserLocale({ countryCodeOnly: true });
    if (browserLocale && Object.values(SUPPORTED_LOCALES).includes(browserLocale)) {
      return browserLocale;
    } else {
      return fallbackLocale;
    }
  };

  public getStoredLocale = (): string => {
    try {
      const secureLsConfig = this.secureLsConfig;
      const localStorage = new this._secureLs(secureLsConfig);
      const storedLocale = JSON.parse(localStorage.get('user')).user.userData.settings.locale;
      return storedLocale;
    } catch (err) {
      return this._fallbackLocale;
    }
  };

  public getBrowserLocale = (options = {}): string | undefined => {
    const defaultOptions = { countryCodeOnly: false };
    const opt = { ...defaultOptions, ...options };
    const navigatorLocale =
      navigator.languages !== undefined ? navigator.languages[0] : navigator.language;
    if (!navigatorLocale) {
      return undefined;
    }
    const trimmedLocale = opt.countryCodeOnly
      ? navigatorLocale.trim().split(/-|_/)[0]
      : navigatorLocale.trim();
    return trimmedLocale;
  };

  public loadDateLocale = (locale: string): void => {
    this._dateLocales[locale]().then(() => this._dayjs.locale(locale));
    this._dayjs.locale(locale); // set original locale
  };

  public loadLocaleMessages = (): LocaleMessages => {
    const locales = require.context('../../../locales', true, /[A-Za-z0-9-_,\s]+\.json$/i);
    const messages: LocaleMessages = {};
    locales.keys().forEach((key) => {
      const matched = key.match(/([A-Za-z0-9-_]+)\./i);
      if (matched && matched.length > 1) {
        const locale = matched[1];
        messages[locale] = locales(key);
      }
    });
    return messages;
  };

  public init = (initParams: {
    secureLs: any;
    dayjs: any;
    fallbackLocale: string;
    dateLocales: StringKeyObject;
  }): this => {
    const { secureLs, dayjs, fallbackLocale, dateLocales } = initParams;
    this._secureLs = secureLs;
    this._dayjs = dayjs;
    this._fallbackLocale = fallbackLocale;
    this._dateLocales = dateLocales;
    return this;
  };
}

export { LocaleHandler };
