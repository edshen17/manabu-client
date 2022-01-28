import { EVENT_TYPE } from '@/types/Calendar';
import { StringKeyObject } from '@server/types/custom';
import { TranslateResult } from 'vue-i18n';
import { makeDateMixin } from '../date';

const makeCalendarMixin = {
  mixins: [makeDateMixin],
  data() {
    return {};
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
  },
};

export { makeCalendarMixin };
