import { makeDateFormatHandler } from '@/plugins/i18n/utils/dateFormatHandler';
import { EVENT_TYPE } from '@/types/Calendar';
import { StringKeyObject } from '@server/types/custom';
import { TranslateResult } from 'vue-i18n';
import { makeDateMixin } from '../date';

const dateFormatHandler = makeDateFormatHandler;

const makeCalendarMixin = {
  mixins: [makeDateMixin],
  data() {
    return {};
  },
  methods: {
    formatDate(props: {
      date: Date | number;
      dateFormat?: string;
      formatString?: string;
      translationProps?: StringKeyObject;
    }): string {
      const { date, dateFormat, formatString, translationProps } = props;
      const dateFormatString: TranslateResult | string =
        formatString || (this as any).$t(`dateFormat.${dateFormat}`, translationProps);
      const formattedDate = dateFormatHandler.formatDate({
        date,
        formatString: dateFormatString,
      });
      return formattedDate;
    },
    getEventTitle(event: StringKeyObject): TranslateResult {
      const self: any = this;
      const isAvailableTime =
        event.attributes && event.attributes.type == EVENT_TYPE.AVAILABLE_TIME;
      const eventTitle = isAvailableTime
        ? self.$t('calendar.availableTime')
        : self.$t('calendar.appointment');
      return eventTitle;
    },
  },
};

export { makeCalendarMixin };
