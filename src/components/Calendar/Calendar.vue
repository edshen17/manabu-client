<template>
  <div data-app>
    <v-sheet height="64" class="flex flex-wrap mx-auto">
      <v-toolbar flat>
        <v-btn outlined class="mx-4" color="grey darken-2" @click="setToday">
          Today / translate</v-btn
        >
        <v-btn fab text small color="grey darken-2" @click="prev">
          <v-icon small> mdi-chevron-left </v-icon>
        </v-btn>
        <v-btn fab text small color="grey darken-2" @click="next">
          <v-icon small> mdi-chevron-right </v-icon>
        </v-btn>
        <v-toolbar-title v-if="$refs.calendar" class="mx-4">
          {{ $refs.calendar.title }}
        </v-toolbar-title>
        <v-menu bottom right>
          <template v-slot:activator="{ on, attrs }">
            <v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
              <span>{{ typeToLabel[type] }}</span>
              <v-icon right> mdi-menu-down </v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="type = 'day'">
              <v-list-item-title>Day /translate</v-list-item-title>
            </v-list-item>
            <v-list-item @click="type = 'week'">
              <v-list-item-title>Week /translate</v-list-item-title>
            </v-list-item>
            <v-list-item @click="type = '4day'">
              <v-list-item-title>4 days /translate</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-toolbar>
    </v-sheet>
    <v-calendar
      ref="calendar"
      v-model="focus"
      style="overflow: hidden"
      class="w-screen h-screen text-white"
      color="blue"
      :type="type"
      :events="events"
      :event-color="getEventColor"
      event-text-color="white"
      @click:date="viewDay"
      @click:event="showEvent"
      @change="getEvents"
      @mousedown:event="startDrag"
      @mousedown:time="startTime"
      @mousemove:time="mouseMove"
      @mouseup:time="endDrag"
      @mouseup:event="openPopup"
      @touchend:event="openPopup"
      @mouseleave.native="cancelDrag"
    >
      <template v-slot:event="{ event, timed, eventSummary }">
        <div class="v-event-draggable" v-html="eventSummary()"></div>
        <div v-if="timed" class="v-event-drag-bottom" @mousedown.stop="extendBottom(event)"></div>
      </template>
      <template v-slot:day-body="{ date, week }">
        <div
          class="v-current-time"
          :class="{ first: date === week[0].date }"
          :style="{ top: nowY }"
        ></div>
      </template>
    </v-calendar>
    <v-menu
      v-model="selectedOpen"
      :close-on-content-click="false"
      :activator="selectedElement"
      :offset-x="type != 'day'"
      max-width="700px"
    >
      <v-card color="grey lighten-4" flat>
        <v-toolbar :color="selectedEvent.color" dark>
          <v-btn icon>
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon>
            <v-icon>mdi-heart</v-icon>
          </v-btn>
          <v-btn icon>
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <span v-html="selectedEvent.details"></span>
        </v-card-text>
        <v-card-actions>
          <v-btn text color="secondary" @click="selectedOpen = false"> Cancel </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { TranslateResult } from 'vue-i18n';
import { mapGetters } from 'vuex';
import { StringKeyObject } from '../../../../server/types/custom';

export default Vue.extend({
  name: 'Calendar',
  components: {},
  props: {},
  data() {
    return {
      ready: false,
      events: [] as StringKeyObject[],
      colors: [
        '#2196F3',
        '#3F51B5',
        '#673AB7',
        '#00BCD4',
        '#4CAF50',
        '#FF9800',
        '#757575',
      ] as any[],
      names: [] as string[],
      dragEvent: null as any,
      dragStart: null as any,
      dragTime: 0 as any,
      createEvent: null as any,
      createStart: null as any,
      extendOriginal: null as any,
      today: new Date().toISOString().substr(0, 10),
      focus: new Date().toISOString().substr(0, 10),
      type: 'week',
      typeToLabel: {
        week: 'Week',
        day: 'Day',
        '4day': '4 Days',
      },
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
    };
  },
  computed: {
    ...mapGetters({
      userData: 'user/entityStateData',
    }),
    cal: {
      get(): any {
        return this.ready ? this.$refs.calendar : null;
      },
    },
    nowY: {
      get(): string {
        return this.cal ? this.cal.timeToY(this.cal.times.now) + 'px' : '-10px';
      },
    },
    availableTimeTextLocale: {
      get(): TranslateResult {
        return this.$t('calendar.availableTime');
      },
    },
  },
  mounted() {
    this.ready = true;
  },
  methods: {
    viewDay({ date }: { date: string }) {
      this.focus = date;
      this.type = 'day';
    },
    setToday() {
      this.focus = this.today;
    },
    prev() {
      (this.$refs.calendar as any).prev();
    },
    next() {
      (this.$refs.calendar as any).next();
    },
    test() {
      console.log('touchstart event');
    },
    showEvent({ nativeEvent, event }: any) {
      if (this.selectedOpen) {
        this.selectedOpen = false;
        requestAnimationFrame(() =>
          requestAnimationFrame(() => this.openPopup({ nativeEvent, event }))
        );
      } else {
        this.openPopup({ nativeEvent, event });
      }
      nativeEvent.stopPropagation();
    },
    openPopup({ nativeEvent, event }: any) {
      this.selectedEvent = event;
      this.selectedElement = nativeEvent.target;
      requestAnimationFrame(() => requestAnimationFrame(() => (this.selectedOpen = true)));
    },
    getCurrentTime() {
      return this.cal ? this.cal.times.now.hour * 60 + this.cal.times.now.minute : 0;
    },
    scrollToTime() {
      const time = this.getCurrentTime();
      const first = Math.max(0, time - (time % 30) - 30);
      this.cal.scrollToTime(first);
    },
    updateTime() {
      setInterval(() => this.cal.updateTimes(), 60 * 1000);
    },
    startDrag({ event, timed }: any) {
      if (event && timed) {
        this.dragEvent = event;
        this.dragTime = null;
        this.extendOriginal = null;
      }
    },
    startTime(tms: StringKeyObject) {
      const mouse = this.toTime(tms);
      this.selectedOpen = false;
      this.selectedEvent = {};
      this.selectedElement = null;
      if (this.dragEvent && this.dragTime === null) {
        const start = this.dragEvent.start;
        this.dragTime = mouse - start;
      } else {
        this.createStart = this.roundTime(mouse);
        this.createEvent = {
          name: this.availableTimeTextLocale,
          color: this.rndElement(this.colors),
          start: this.createStart,
          end: this.createStart + 60 * 60 * 1000,
          timed: true,
        };
        this.events.push(this.createEvent);
      }
    },
    extendBottom(event: any) {
      this.createEvent = event;
      this.createStart = event.start;
      this.extendOriginal = event.end;
    },
    mouseMove(tms: any) {
      const mouse = this.toTime(tms);
      if (this.dragEvent && this.dragTime !== null) {
        const start = this.dragEvent.start;
        const end = this.dragEvent.end;
        const duration = end - start;
        const newStartTime = mouse - this.dragTime;
        const newStart = this.roundTime(newStartTime);
        const newEnd = newStart + duration;
        this.dragEvent.start = newStart;
        this.dragEvent.end = newEnd;
      } else if (this.createEvent && this.createStart !== null) {
        const mouseRounded = this.roundTime(mouse, false);
        const min = Math.min(mouseRounded, this.createStart);
        const max = Math.max(mouseRounded, this.createStart);
        this.createEvent.start = min;
        this.createEvent.end = max;
      }
    },
    endDrag() {
      this.dragTime = null;
      this.dragEvent = null;
      this.createEvent = null;
      this.createStart = null;
      this.extendOriginal = null;
    },
    cancelDrag() {
      if (this.createEvent) {
        if (this.extendOriginal) {
          this.createEvent.end = this.extendOriginal;
        } else {
          const i = this.events.indexOf(this.createEvent);
          if (i !== -1) {
            this.events.splice(i, 1);
          }
        }
      }
      this.createEvent = null;
      this.createStart = null;
      this.dragTime = null;
      this.dragEvent = null;
    },
    roundTime(time: number, down = true) {
      const roundTo = 30; // minutes
      const roundDownTime = roundTo * 60 * 1000;
      return down ? time - (time % roundDownTime) : time + (roundDownTime - (time % roundDownTime));
    },
    toTime(tms: any) {
      return new Date(tms.year, tms.month - 1, tms.day, tms.hour, tms.minute).getTime();
    },
    getEventColor(event: any): any {
      const rgb = parseInt(event.color.substring(1), 16);
      const r = (rgb >> 16) & 0xff;
      const g = (rgb >> 8) & 0xff;
      const b = (rgb >> 0) & 0xff;
      return event === this.dragEvent
        ? `rgba(${r}, ${g}, ${b}, 0.7)`
        : event === this.createEvent
        ? `rgba(${r}, ${g}, ${b}, 0.7)`
        : event.color;
    },
    getEvents({ start, end }: any) {
      // const events = [];
      // const min = new Date(`${start.date}T00:00:00`).getTime();
      // const max = new Date(`${end.date}T23:59:59`).getTime();
      // const days = (max - min) / 86400000;
      // const eventCount = this.rnd(days, days + 20);
      // for (let i = 0; i < eventCount; i++) {
      //   const timed = this.rnd(0, 3) !== 0;
      //   const firstTimestamp = this.rnd(min, max);
      //   const secondTimestamp = this.rnd(2, timed ? 8 : 288) * 900000;
      //   const start = firstTimestamp - (firstTimestamp % 900000);
      //   const end = start + secondTimestamp;
      //   events.push({
      //     name: this.rndElement(this.names),
      //     color: this.rndElement(this.colors),
      //     start,
      //     end,
      //     timed,
      //   });
      // }
      // this.events = events;
    },
    rnd(a: number, b: number) {
      return Math.floor((b - a + 1) * Math.random()) + a;
    },
    rndElement(arr: number[]) {
      return arr[this.rnd(0, arr.length - 1)];
    },
  },
});
</script>

<style lang="scss">
.v-event-draggable {
  padding-left: 6px;
}

.v-event-timed {
  user-select: none;
  -webkit-user-select: none;
}

.v-event-drag-bottom {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 4px;
  height: 4px;
  cursor: ns-resize;

  &::after {
    display: none;
    position: absolute;
    left: 50%;
    height: 4px;
    border-top: 1px solid white;
    border-bottom: 1px solid white;
    width: 16px;
    margin-left: -8px;
    opacity: 0.8;
    content: '';
  }

  &:hover::after {
    display: block;
  }
}

.v-current-time {
  height: 2px;
  background-color: #ea4335;
  position: absolute;
  left: -1px;
  right: 0;
  pointer-events: none;

  &.first::before {
    content: '';
    position: absolute;
    background-color: #ea4335;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-top: -5px;
    margin-left: -6.5px;
  }
}
</style>
