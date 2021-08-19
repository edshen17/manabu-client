import { StringKeyObject } from '@server/types/custom';

class LocaleHandler {
  private _secureLs!: any;
  private _fallbackLocale!: string;
  public secureLsConfig: StringKeyObject = {
    isCompression: false,
    encodingType: 'aes',
    encryptionSecret: process.env.VUE_APP_LS_ENCRYPTION_SECRET,
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

  public getBrowserLocale = (options = {}) => {
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

  public init = (initParams: { secureLs: any; fallbackLocale: string }): this => {
    const { secureLs, fallbackLocale } = initParams;
    this._secureLs = secureLs;
    this._fallbackLocale = fallbackLocale;
    return this;
  };
}

export { LocaleHandler };
