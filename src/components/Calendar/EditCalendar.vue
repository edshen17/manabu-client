<template>
  <div>
    <base-calendar
      :events="events"
      @change="getEvents"
      @mousedown:event="onMouseDownEvent"
      @mousedown:time="onMouseDownTime"
      @mousemove:time="onMouseMoveTime"
      @mouseup:time="onMouseUpTime"
      @mouseup:event="onMouseUpEvent"
      @click:event="onMouseUpEvent"
      @mouseleave.native="onMouseLeaveNative"
    >
      <template v-slot:event="{ event, timed }">
        <div>
          <div class="v-event-draggable">
            {{ event }}
            {{ timed }}
          </div>
          <div v-if="timed" class="v-event-drag-bottom" @mousedown.stop="extendBottom(event)"></div>
        </div>
      </template>
      <template v-slot:menu>
        <event-editor :show-event-editor="showEventEditor" :event-editor-coord="eventEditorCoord" />
      </template>
    </base-calendar>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { StringKeyObject } from '../../../../server/types/custom';
import BaseCalendar from './BaseCalendar.vue';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { makeAvailableTimeRepository } from '../../repositories/availableTime/index';
import { AvailableTimeDoc } from '../../../../server/models/AvailableTime';
import EventEditor from './EventEditor.vue';

const availableTimeRepository = makeAvailableTimeRepository;

enum EVENT_COLOR {
  AVAILABLE_TIME = '#3F51B5',
}

export default Vue.extend({
  name: 'EditCalendar',
  components: { BaseCalendar, EventEditor },
  props: {
    userId: {
      type: String,
      default: '',
      required: true,
    },
  },
  data() {
    return {
      events: [] as StringKeyObject[],
      dragTime: null as number | null,
      dragEvent: null as null | StringKeyObject,
      dragStart: null as null | number,
      createEvent: null as null | StringKeyObject,
      createStart: null as null | number,
      extendOriginal: null as null | number,
      showEventEditor: false,
      selectedEvent: {} as StringKeyObject,
      eventEditorCoord: {
        x: 0,
        y: 0,
      },
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
  methods: {
    async getEvents({
      start,
      end,
    }: {
      start: StringKeyObject;
      end: StringKeyObject;
    }): Promise<void> {
      const availableTimes = await this.getAvailableTimes({ start, end });
      for (const availableTime of availableTimes) {
        const isExistingEvent = this.events.some((event) => {
          return event.attributes._id == availableTime._id;
        });
        if (!isExistingEvent) {
          const event = {
            color: EVENT_COLOR.AVAILABLE_TIME,
            start: dayjs(availableTime.startDate).unix() * 1000,
            end: dayjs(availableTime.endDate).unix() * 1000,
            timed: true,
            attributes: {
              _id: availableTime._id,
              creationStatus: 'saved',
              type: 'availableTime',
              originalEvent: {
                start: dayjs(availableTime.startDate).unix() * 1000,
                end: dayjs(availableTime.endDate).unix() * 1000,
              },
            },
          };
          this.events.push(event);
        }
      }
    },
    async getAvailableTimes({
      start,
      end,
    }: {
      start: StringKeyObject;
      end: StringKeyObject;
    }): Promise<AvailableTimeDoc[]> {
      const { data } = await availableTimeRepository.getById({
        _id: this.userId,
        customResourcePath: `/users/${this.userId}/availableTimes`,
        query: {
          startDate: dayjs(start.date, 'YYYY-MM-DD').toString(),
          endDate: dayjs(end.date, 'YYYY-MM-DD').add(1, 'day').toString(),
        },
      });
      const { availableTimes } = data;
      return availableTimes;
    },
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
          start: dayjs(this.createStart).toDate(),
          end: dayjs(this.createStart).add(60, 'minutes').toDate(),
          timed: true,
        };
        this.events.push(this.createEvent);
      }
    },
    onMouseUpEvent({
      event,
      nativeEvent,
    }: {
      event: StringKeyObject;
      nativeEvent: StringKeyObject;
    }): void {
      this.eventEditorCoord.x = nativeEvent.clientX;
      this.eventEditorCoord.y = nativeEvent.clientY;
      this.selectedEvent = event;
      this.$nextTick(() => {
        this.showEventEditor = true;
      });
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
