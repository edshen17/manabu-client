import { StringKeyObject } from '@server/types/custom';
import { LocaleMessages } from 'vue-i18n';

class LocaleHandler {
  private _secureLs!: any;
  private _dayjs!: any;
  private _fallbackLocale!: string;
  private _dateLocales!: StringKeyObject;
  private _secureLsConfig!: StringKeyObject;

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
      const secureLsConfig = this._secureLsConfig;
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

  // pass i18n because otherwise circular dependency
  public updateLocale = (props: { i18n: any; locale: string }): void => {
    const { i18n, locale } = props;
    i18n.locale = locale;
    this.loadDateLocale(locale);
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
    secureLsConfig: StringKeyObject;
  }): this => {
    const { secureLs, dayjs, fallbackLocale, dateLocales, secureLsConfig } = initParams;
    this._secureLs = secureLs;
    this._dayjs = dayjs;
    this._fallbackLocale = fallbackLocale;
    this._dateLocales = dateLocales;
    this._secureLsConfig = secureLsConfig;
    return this;
  };
}

export { LocaleHandler };
