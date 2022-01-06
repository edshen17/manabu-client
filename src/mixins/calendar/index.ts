import { makeDateFormatHandler } from '@/plugins/i18n/utils/dateFormatHandler';
import { EVENT_TYPE } from '@/types/Calendar';
import { StringKeyObject } from '@server/types/custom';
import dayjs from 'dayjs';
import { TranslateResult } from 'vue-i18n';

const dateFormatHandler = makeDateFormatHandler;

enum DATE_FORMAT {
  DAY_HOUR = 'dayHour',
  HOUR = 'hour',
  HOUR_WITH_DURATION = 'hourWithDuration',
  ABRIDGED_DATE = 'abridgedDate',
}

enum AUTOCOMPLETE_DATE_FORMAT {
  HOUR = 'h:mma',
  DEFAULT = 'M/D/YYYY@h:mma',
}

const makeCalendarMixin = {
  data() {
    return {
      DATE_FORMAT,
      AUTOCOMPLETE_DATE_FORMAT,
    };
  },
  methods: {
    getEventTitle(event: StringKeyObject): TranslateResult {
      const self: any = this;
      const isAvailableTime =
        event.attributes && event.attributes.type == EVENT_TYPE.AVAILABLE_TIME;
      const eventTitle = isAvailableTime
        ? self.$t('calendar.availableTime')
        : self.$t('calendar.appointment');
      return eventTitle;
    },
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

export { makeCalendarMixin };
