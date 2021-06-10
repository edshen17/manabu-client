import dayjs from 'dayjs';
const dayJsLocales: { [key: string]: () => Promise<any> } = {
  ja: () => import('dayjs/locale/ja'),
  en: () => import('dayjs/locale/en'),
};

export const loadDayjsLocale = (locale: string) => {
  dayJsLocales[locale]().then(() => dayjs.locale(locale));
  dayjs.locale(locale); // set original locale
};
