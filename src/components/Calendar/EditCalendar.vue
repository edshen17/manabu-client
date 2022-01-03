<template>
  <div>
    <base-calendar
      :events="events"
      @mousedown:event="onMouseDownEvent"
      @mousedown:time="onMouseDownTime"
      @mousemove:time="onMouseMoveTime"
      @mouseup:time="onMouseUpTime"
      @mouseleave.native="onMouseLeaveNative"
    >
      <template v-slot:event="{ event, timed }">
        <div>
          <div class="v-event-draggable">
            {{ event }}
            {{ timed }}
            <!-- <span>
              {{ getEventTitle(event) }}
            </span>
            <br />
            <span
              >{{ formatDate({ date: event.start, dateFormat: 'hour' }) }} -
              {{ formatDate({ date: event.end, dateFormat: 'hour' }) }}</span
            > -->
          </div>
          <div v-if="timed" class="v-event-drag-bottom" @mousedown.stop="extendBottom(event)"></div>
        </div>
      </template>
    </base-calendar>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { StringKeyObject } from '../../../../server/types/custom';
import BaseCalendar from './BaseCalendar.vue';

export default Vue.extend({
  name: 'EditCalendar',
  components: { BaseCalendar },
  props: {
    // prop: {
    //   type: String,
    //   default: '',
    //   required: true,
    // },
  },
  data() {
    return {
      events: [] as StringKeyObject[],
      dragTime: null as any,
      dragEvent: null as any,
      dragStart: null as any,
      createEvent: null as any,
      createStart: null as any,
      extendOriginal: null as any,
    };
  },
  computed: {
    // prop: {
    //   get(): any {
    //     return;
    //   },
    // },
  },
  mounted() {
    return;
  },
  // created() {
  //   this.$emit('update:layout', LayoutDefault);
  // },
  methods: {
    onMouseDownEvent({ event, timed }: { event: StringKeyObject; timed: StringKeyObject }): void {
      if (event && timed) {
        this.dragEvent = event;
        this.dragTime = null;
        this.extendOriginal = null;
      }
    },
    onMouseDownTime(tms: StringKeyObject): void {
      const mouse = this.convertToMs(tms);
      if (this.dragEvent && this.dragTime === null) {
        const start = this.dragEvent.start;
        this.dragTime = mouse - start;
      } else {
        this.createStart = this.roundTime(mouse);
        this.createEvent = {
          name: `Event #${this.events.length}`,
          color: '#2196F3',
          start: this.createStart,
          end: this.createStart,
          timed: true,
        };
        this.events.push(this.createEvent);
      }
    },
    extendBottom(event: StringKeyObject): void {
      const { start, end } = event;
      this.createEvent = event;
      this.createStart = start;
      this.extendOriginal = end;
    },
    onMouseMoveTime(tms: StringKeyObject): void {
      const mouse = this.convertToMs(tms);
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
    onMouseUpTime(): void {
      this.dragTime = null;
      this.dragEvent = null;
      this.createEvent = null;
      this.createStart = null;
      this.extendOriginal = null;
    },
    onMouseLeaveNative(): void {
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
    roundTime(time: number, down = true): number {
      const roundTo = 30; // minutes
      const roundDownTime = roundTo * 60 * 1000;
      return down ? time - (time % roundDownTime) : time + (roundDownTime - (time % roundDownTime));
    },
    convertToMs(tms: StringKeyObject): number {
      return new Date(tms.year, tms.month - 1, tms.day, tms.hour, tms.minute).getTime();
    },
  },
});
</script>
<style lang="scss" scoped>
@import '../../assets/scss/calendar.scss';
</style>
