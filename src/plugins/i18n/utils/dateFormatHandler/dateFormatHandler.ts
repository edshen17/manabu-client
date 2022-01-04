import { TranslateResult } from 'vue-i18n';

class DateFormatHandler {
  private _dayjs!: any;

  public formatDate = (props: { date: Date; formatString: string | TranslateResult }): string => {
    const { date, formatString } = props;
    const formattedDate = this._dayjs(date).format(formatString);
    return formattedDate;
  };

  public init = (initParams: { dayjs: any }): this => {
    const { dayjs } = initParams;
    this._dayjs = dayjs;
    return this;
  };
}

export { DateFormatHandler };
