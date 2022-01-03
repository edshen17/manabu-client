<template>
  <div data-app class="select-none calendar">
    <v-sheet height="64" class="flex flex-wrap mx-auto">
      <v-toolbar flat>
        <v-btn
          outlined
          class="mx-4"
          color="grey darken-2"
          @click="focusDate({ date: today, calendarView })"
        >
          {{ $t('calendar.today') }}</v-btn
        >
        <v-btn fab text small color="grey darken-2" @click="moveCalendar('backward')">
          <v-icon small> mdi-chevron-left </v-icon>
        </v-btn>
        <v-btn fab text small color="grey darken-2" @click="moveCalendar('forward')">
          <v-icon small> mdi-chevron-right </v-icon>
        </v-btn>
        <v-toolbar-title v-if="$refs.calendar && !isMobile" class="mx-4">
          {{ $refs.calendar.title }}
        </v-toolbar-title>
        <v-menu bottom right>
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-show="!isMobile" outlined color="grey darken-2" v-bind="attrs" v-on="on">
              <span>{{ calendarViewData[calendarView].text }}</span>
              <v-icon right> mdi-menu-down </v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="(value, propertyName) in calendarViewData"
              v-show="(!isMobile && value.showIfDesktop) || (isMobile && value.showIfMobile)"
              :key="propertyName"
              @click="calendarView = propertyName"
            >
              <v-list-item-title>{{ value.text }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-toolbar>
    </v-sheet>
    <v-calendar
      ref="calendar"
      v-model="calendarFocusDate"
      style="overflow: hidden"
      :class="calendarClass"
      :type="calendarView"
      :locale="locale"
      :events="events"
      color="primary"
      event-text-color="white"
      @mousedown:event="onMouseDownEvent"
      @mousedown:time="onMouseDownTime"
      @mousemove:time="onMouseMoveTime"
      @mouseup:time="onMouseUpTime"
      @mouseup:event="onMouseUpEvent"
      @mouseleave.native="onMouseLeaveNative"
      @click:date="focusDate({ date: today, calendarView: 'day' })"
    >
      <template v-slot:event="{ event, timed }">
        <slot name="event" :event="event" :timed="timed" />
      </template>
      <template v-slot:day-body="{ date, week }">
        <div
          class="v-current-time"
          :class="{ first: date === week[0].date }"
          :style="{ top: nowY }"
        ></div>
      </template>
    </v-calendar>
    <slot name="menu" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { StringKeyObject } from '../../../../server/types/custom';
import dayjs from 'dayjs';
import { mapGetters } from 'vuex';

enum CALENDAR_VIEW {
  DAY = 'day',
  WEEK = 'week',
}

export default Vue.extend({
  name: 'BaseCalendar',
  components: {},
  props: {
    events: {
      default: () => [],
      required: false,
      type: Array,
    },
    calendarClass: {
      default: 'w-screen h-screen text-white',
      required: false,
      type: String,
    },
  },
  data() {
    return {
      calendarView: CALENDAR_VIEW.WEEK,
      calendarFocusDate: '',
      isCalendarReady: false,
      currentTime: {
        hour: 0,
        minute: 0,
      },
      intervalTimerId: 0 as any,
    };
  },
  computed: {
    ...mapGetters({
      locale: 'user/locale',
    }),
    calendarViewData: {
      get(): StringKeyObject {
        const calendarViewData = {
          week: {
            text: this.$t('calendar.week'),
            showIfDesktop: true,
            showIfMobile: false,
          },
          day: {
            text: this.$t('calendar.day'),
            showIfDesktop: true,
            showIfMobile: true,
          },
        };
        return calendarViewData;
      },
    },
    today: {
      get(): string {
        const today = dayjs().format('YYYY-MM-DD');
        return today;
      },
    },
    calendarRef: {
      get(): any {
        return this.isCalendarReady ? this.$refs.calendar : null;
      },
    },
    nowY: {
      get(): string {
        return this.calendarRef ? this.calendarRef.timeToY(this.currentTime) + 'px' : '-10px';
      },
    },
  },
  watch: {
    isMobile: function (newValue) {
      this.onMobile(newValue);
    },
  },
  async created() {
    const isMobile = (this as any).isMobile;
    this.onMobile(isMobile);
    this.intervalTimerId = setInterval(() => {
      this.setCurrentTime();
    }, 5 * 60 * 1000);
  },
  mounted() {
    this.isCalendarReady = true;
    this.setCurrentTime();
  },
  destroyed() {
    clearInterval(this.intervalTimerId);
  },
  methods: {
    onMobile(isMobile: boolean): void {
      isMobile ? (this.calendarView = CALENDAR_VIEW.DAY) : (this.calendarView = CALENDAR_VIEW.WEEK);
    },
    focusDate({ date, calendarView }: { date: string; calendarView: CALENDAR_VIEW }): void {
      this.calendarFocusDate = date;
      this.calendarView = calendarView;
    },
    moveCalendar(direction: 'backward' | 'forward'): void {
      const isMovingForward = direction == 'forward';
      const calendar = this.$refs.calendar as any;
      isMovingForward ? calendar.next() : calendar.prev();
    },
    setCurrentTime(): void {
      this.currentTime = {
        hour: dayjs().hour(),
        minute: dayjs().minute(),
      };
    },
    onMouseDownEvent({ event, timed }: any): void {
      this.$emit('mousedown:event', { event, timed });
    },
    onMouseDownTime(tms: StringKeyObject): void {
      this.$emit('mousedown:time', tms);
    },
    onMouseMoveTime(tms: StringKeyObject): void {
      this.$emit('mousemove:time', tms);
    },
    onMouseUpTime(): void {
      this.$emit('mouseup:time');
    },
    onMouseUpEvent({ nativeEvent, event }: any): void {
      this.$emit('mouseup:event', { nativeEvent, event });
    },
    onMouseLeaveNative(): void {
      this.$emit('mouseleave.native');
    },
  },
});
</script>
