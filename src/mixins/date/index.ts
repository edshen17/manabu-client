import { makeDateFormatHandler } from '@/plugins/i18n/utils/dateFormatHandler';
import { StringKeyObject } from '@server/types/custom';
import dayjs from 'dayjs';
import { TranslateResult } from 'vue-i18n';

const dateFormatHandler = makeDateFormatHandler;

enum DATE_FORMAT {
  DAY_HOUR = 'dayHour',
  HOUR = 'hour',
  HOUR_WITH_DURATION = 'hourWithDuration',
  ABRIDGED_DATE = 'abridgedDate',
  FULL_DATE = 'fullDate',
}

enum AUTOCOMPLETE_DATE_FORMAT {
  HOUR = 'h:mma',
  DEFAULT = 'M/D/YYYY@h:mma',
}

const makeDateMixin = {
  data() {
    return {
      DATE_FORMAT,
      AUTOCOMPLETE_DATE_FORMAT,
    };
  },
  methods: {
    formatDate(props: {
      date: Date;
      dateFormat?: string;
      formatString?: string;
      translationProps?: StringKeyObject;
    }): string {
      const self: any = this;
      const { date, dateFormat, formatString, translationProps } = props;
      const dateFormatString: TranslateResult | string =
        formatString || self.$t(`dateFormat.${dateFormat}`, translationProps);
      const formattedDate = dateFormatHandler.formatDate({
        date,
        formatString: dateFormatString,
      });
      return formattedDate;
    },
    isPast(start: Date): boolean {
      const isPast = dayjs(start).isBefore(dayjs());
      return isPast;
    },
  },
};

export { makeDateMixin };
