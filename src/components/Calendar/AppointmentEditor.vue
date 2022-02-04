<template>
  <div data-app>
    <v-menu
      :offset-y="isMobile"
      :close-on-content-click="false"
      :close-on-click="true"
      :min-width="menuWidth"
      :left="showMenuOnLeft"
      offset-x
    >
      <template v-slot:activator="{ on, attrs }">
        <slot name="activator" :on="on" :attrs="attrs" />
      </template>
      <v-card color="grey lighten-4" flat>
        <v-card-text>
          <div class="flex">
            <div class="flex-grow">
              <p class="text-black text-lg tracking-wide inline">
                {{ getEventTitle(selectedEvent) }}
              </p>
            </div>
            <!-- <button v-if="isSelectedEventSaved" class="float-right" @click="$emit('event:delete')">
              <i class="fas fa-trash-alt text-lg"></i>
            </button> -->
          </div>
          thing
        </v-card-text>
        <v-card-actions>
          <v-btn text color="secondary" class="m-0 animate-pulse" @click="$emit('event:save')">
            <span class="text-blue-600">{{ $t('button.common.save') }}</span>
          </v-btn>
          <v-btn text color="secondary" @click="$emit('event:cancel')">
            {{ $t('button.common.cancel') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { TranslateResult } from 'vue-i18n';
import { StringKeyObject } from '../../../../server/types/custom';
import { makeDateFormatHandler } from '../../plugins/i18n/utils/dateFormatHandler';
import { EVENT_TYPE } from '../../types/Calendar';
import { makeCalendarMixin } from '../../mixins/calendar';
import { mapGetters } from 'vuex';
import dayjs from 'dayjs';

const dateFormatHandler = makeDateFormatHandler;
const calendarMixin = makeCalendarMixin;

export default Vue.extend({
  name: 'AppointmentEditor',
  components: {},
  mixins: [calendarMixin],
  props: {
    selectedEventCoord: {
      type: Object,
      default: () => ({ x: 0, y: 0 }),
      required: true,
    },
    selectedEvent: {
      type: Object,
      default: () => ({}),
      required: true,
    },
    eventId: {
      type: String,
      default: '',
      required: true,
    },
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      locale: 'user/locale',
    }),
    menuWidth: {
      get(): string {
        const menuWidth = '340px';
        return menuWidth;
      },
    },
    showMenuOnLeft: {
      get(): boolean {
        const windowWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        const showMenuOnLeft = this.selectedEventCoord.x > windowWidth / 2;
        return showMenuOnLeft;
      },
    },
  },
  mounted() {
    return;
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
        formatString || this.$t(`dateFormat.${dateFormat}`, translationProps);
      const formattedDate = dateFormatHandler.formatDate({
        date,
        formatString: dateFormatString,
      });
      return formattedDate;
    },
  },
});
</script>

<style lang="scss" scoped>
@import '../../assets/scss/calendar.scss';
</style>
