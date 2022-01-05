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
      @mouseleave.native="onMouseLeaveNative"
      @click:event="onMouseUpEvent"
      @touchstart:event="onMouseDownEvent"
      @touchend:time="onMouseUpTime"
      @touchend:event="onMouseUpEvent"
    >
      <template v-slot:event="{ event, timed }">
        <event-editor
          :event-id="event.attributes._id"
          :show-event-editor="showEventEditor"
          :event-editor-coord="eventEditorCoord"
          :selected-event="selectedEvent"
          :is-selected-event-saved="isSelectedEventSaved"
          @event:save="saveEvent"
          @event:cancel="cancelEvent"
          @event:delete="deleteEvent({ eventId: selectedEvent.attributes._id, deleteFromDb: true })"
        >
          <template v-slot:activator="{ on, attrs }">
            <div :class="{ 'opacity-60': isPast(event.start) }" v-bind="attrs" v-on="on">
              <div class="v-event-draggable">
                <span>
                  {{ getEventTitle(event) }}
                </span>
                <br />
                <span
                  >{{ formatDate({ date: event.start, dateFormat: 'hour' }) }} -
                  {{ formatDate({ date: event.end, dateFormat: 'hour' }) }}</span
                >
              </div>
              <div
                v-if="timed"
                :class="{ 'v-event-drag-bottom': !isMobile }"
                @mousedown.stop="extendBottom(event)"
              ></div>
            </div>
          </template>
        </event-editor>
      </template>
    </base-calendar>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { StringKeyObject } from '../../../../server/types/custom';
import BaseCalendar from './BaseCalendar.vue';
import dayjs from 'dayjs';
import { makeAvailableTimeRepository } from '../../repositories/availableTime/index';
import { AvailableTimeDoc } from '../../../../server/models/AvailableTime';
import EventEditor from './EventEditor.vue';
import { EVENT_TYPE, EVENT_CREATION_STATUS } from '../../types/Calendar';
import { makeCalendarMixin } from '../../mixins/calendar';
import cryptoRandomString from 'crypto-random-string';
import cloneDeep from 'clone-deep';

const availableTimeRepository = makeAvailableTimeRepository;
const calendarMixin = makeCalendarMixin;

enum EVENT_COLOR {
  AVAILABLE_TIME = '#3F51B5',
}

type EventObject = {
  color: EVENT_COLOR;
  start: number;
  end: number;
  timed: boolean;
  attributes: {
    _id: string;
    creationStatus: EVENT_CREATION_STATUS;
    type: EVENT_TYPE;
    originalEvent: {
      start: number;
      end: number;
    };
  };
};

export default Vue.extend({
  name: 'EditCalendar',
  components: { BaseCalendar, EventEditor },
  mixins: [calendarMixin],
  props: {
    userId: {
      type: String,
      default: '',
      required: true,
    },
  },
  data() {
    return {
      events: [] as EventObject[],
      dragTime: null as number | null,
      dragEvent: null as null | StringKeyObject,
      dragStart: null as null | number,
      createEvent: null as null | EventObject,
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
    isSelectedEventSaved: {
      get(): boolean {
        const { attributes, start, end } = this.selectedEvent;
        let isSelectedEventSaved = false;
        if (attributes) {
          const { creationStatus, originalEvent } = attributes;
          isSelectedEventSaved =
            creationStatus == EVENT_CREATION_STATUS.SAVED &&
            start == originalEvent.start &&
            end == originalEvent.end;
        }
        return isSelectedEventSaved;
      },
    },
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
          const start = this._convertToUnixMs(availableTime.startDate);
          const end = this._convertToUnixMs(availableTime.endDate);
          const event = {
            color: EVENT_COLOR.AVAILABLE_TIME,
            start,
            end,
            timed: true,
            attributes: {
              _id: availableTime._id,
              creationStatus: EVENT_CREATION_STATUS.SAVED,
              type: EVENT_TYPE.AVAILABLE_TIME,
              originalEvent: {
                start,
                end,
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
    _convertToUnixMs(date: Date | string | number): number {
      return dayjs(date).unix() * 1000;
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
        this._deletePendingEvents();
        this.createStart = this.roundTime(mouse);
        const start = this._convertToUnixMs(this.createStart);
        const end = this._convertToUnixMs(dayjs(this.createStart).add(60, 'minutes').toDate());
        this.createEvent = {
          color: EVENT_COLOR.AVAILABLE_TIME,
          start,
          end,
          timed: true,
          attributes: {
            _id: cryptoRandomString({ length: 20 }),
            creationStatus: EVENT_CREATION_STATUS.PENDING,
            type: EVENT_TYPE.AVAILABLE_TIME,
            originalEvent: {
              start,
              end,
            },
          },
        };
        this.selectedEvent = this.createEvent;
        this.events.push(this.createEvent);
      }
    },
    _deletePendingEvents(): void {
      this.events = this.events.filter((event) => {
        return event.attributes.creationStatus != 'pending';
      });
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
      this._showEventEditor(true);
    },
    _showEventEditor(showEventEditor: boolean): void {
      this.showEventEditor = false;
      requestAnimationFrame(() => (this.showEventEditor = showEventEditor));
    },
    extendBottom(event: EventObject): void {
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
        const isValidDate = this._isValidDate({ start: newStart, end: newEnd });
        if (isValidDate) {
          this.dragEvent.start = newStart;
          this.dragEvent.end = newEnd;
        }
        this._showEventEditor(false);
      } else if (this.createEvent && this.createStart !== null) {
        const mouseRounded = this.roundTime(mouse, false);
        const min = Math.min(mouseRounded, this.createStart);
        const max = Math.max(mouseRounded, this.createStart);
        const isValidDate = this._isValidDate({ start: min, end: max });
        if (isValidDate) {
          this.createEvent.start = min;
          this.createEvent.end = max;
        }
        this._showEventEditor(false);
      }
    },
    _isValidDate(props: { start: Date | number; end: Date | number }): boolean {
      const { start, end } = props;
      const isSameDay = dayjs(start).date() == dayjs(end).date();
      const isEndMidnight = dayjs(end).hour() == 0 && dayjs(end).minute() == 0;
      const isValidDate = isSameDay || isEndMidnight;
      return isValidDate;
    },
    onMouseUpTime(): void {
      this.dragTime = null;
      this.dragEvent = null;
      this.createEvent = null;
      this.createStart = null;
      this.extendOriginal = null;
      this._showEventEditor(true);
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
    async saveEvent(): Promise<void> {
      const start = this.selectedEvent.start;
      const end = this.selectedEvent.end;
      const originalEventBeforeSave = cloneDeep(this.selectedEvent.attributes.originalEvent);
      this.selectedEvent.attributes.originalEvent = {
        start,
        end,
      };
      this._showEventEditor(false);
      try {
        if (!this.isSelectedEventSaved) {
          this.selectedEvent.attributes.creationStatus = EVENT_CREATION_STATUS.SAVED;
          await this._saveAvailableTime({ start, end });
        } else {
          await this._updateAvailableTime({ start, end });
        }
      } catch (err) {
        this._undoSaveEvent(originalEventBeforeSave);
        throw err;
      }
    },
    async _saveAvailableTime(props: { start: number; end: number }): Promise<void> {
      const { start, end } = props;
      const payload = {
        hostedById: this.userId,
        startDate: dayjs(start).toDate(),
        endDate: dayjs(end).toDate(),
      };
      const { data } = await availableTimeRepository.create({
        payload,
        query: {},
      });
      this.selectedEvent.attributes._id = data.availableTime._id;
    },
    async _updateAvailableTime(props: { start: Date; end: Date }) {
      const { start, end } = props;
      await availableTimeRepository.updateById({
        _id: this.selectedEvent.attributes._id,
        updateParams: {
          startDate: dayjs(start).toDate(),
          endDate: dayjs(end).toDate(),
        },
      });
    },
    _undoSaveEvent(originalEventBeforeSave: StringKeyObject) {
      this.selectedEvent.attributes.originalEvent = originalEventBeforeSave;
    },
    async cancelEvent(): Promise<void> {
      const eventId = this.selectedEvent.attributes._id;
      const originalEvent = this.selectedEvent.attributes.originalEvent;
      this.selectedEvent.start = originalEvent.start;
      this.selectedEvent.end = originalEvent.end;
      if (!this.isSelectedEventSaved) {
        this.deleteEvent({ eventId, deleteFromDb: false });
      }
      this._showEventEditor(false);
    },
    async deleteEvent(props: { eventId: string; deleteFromDb: boolean }): Promise<void> {
      const { eventId, deleteFromDb } = props;
      if (deleteFromDb) {
        availableTimeRepository.deleteById(eventId);
      }
      this.events = this.events.filter((event) => {
        return event.attributes._id != eventId;
      });
      this._showEventEditor(false);
    },
  },
  errorCaptured(err: StringKeyObject): boolean {
    const errMsg = err.response.data.err;
    switch (errMsg) {
      case 'Your timeslot duration must be divisible by 30 minutes.':
        err.message = 'error.calendar.unevenAppointment';
      case 'Timeslots must begin at the start of the hour or 30 minutes into the hour.':
        err.message = 'error.calendar.badStartAvailableTime';
      case 'You cannot have timeslots that overlap.':
        err.message = 'error.calendar.overlapAvailableTime';
    }
    this.cancelEvent();
    return true;
  },
});
</script>

<style lang="scss" scoped>
@import '../../assets/scss/calendar.scss';
</style>
