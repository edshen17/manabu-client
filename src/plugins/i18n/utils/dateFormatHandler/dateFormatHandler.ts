class DateFormatHandler {
  private _dayjs!: any;
  public formatDate = (props: { date: Date; formatString: string }): string => {
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
