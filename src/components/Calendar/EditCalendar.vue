<template>
  <div>
    <base-calendar
      :events="events"
      :calendar-focus-date="calendarFocusDate"
      @change="getEvents"
      @mousedown:event="onMouseDownEvent"
      @mousedown:time="onMouseDownTime"
      @mousemove:time="onMouseMoveTime"
      @mouseup:time="onMouseUpTime"
      @mouseup:event="onMouseUpEvent"
      @mouseleave:event="onMouseLeaveNative"
      @click:event="onMouseUpEvent"
      @touchstart:event="onMouseDownEvent"
      @touchend:time="onMouseUpTime"
      @touchend:event="onMouseUpEvent"
      @update:calendar-focus-date="onCalendarFocusDateUpdate"
    >
      <template #event="{ event, timed }">
        <available-time-editor
          v-if="event.attributes.type == 'availableTime'"
          :event-id="event.attributes._id"
          :show-editor="showEditor"
          :selected-event-coord="selectedEventCoord"
          :selected-event="selectedEvent"
          :is-selected-event-saved="isSelectedEventSaved"
          :date-picker-date="datePickerDate"
          @event:save="saveAvailableTime"
          @event:cancel="cancelAvailableTime"
          @event:delete="
            deleteAvailableTime({ eventId: selectedEvent.attributes._id, deleteFromDb: true })
          "
          @date-picker:change="onDatePickerChange"
          @auto-complete-start:change="onAutoCompleteStartChange"
          @auto-complete-end:change="onAutoCompleteEndChange"
        >
          <template #activator="{ on, attrs }">
            <div :class="{ 'opacity-60': isPast(event.start) }" v-bind="attrs" v-on="on">
              <div class="v-event-draggable">
                <span>
                  {{ getEventTitle(event) }}
                </span>
                <br />
                <span
                  >{{ formatDate({ date: event.start, dateFormat: DATE_FORMAT.HOUR }) }} -
                  {{ formatDate({ date: event.end, dateFormat: DATE_FORMAT.HOUR }) }}</span
                >
              </div>
              <div
                v-if="timed"
                :class="{ 'v-event-drag-bottom': !isMobile }"
                @mousedown.stop="extendBottom(event)"
              ></div>
            </div>
          </template>
        </available-time-editor>
        <appointment-editor
          v-if="event.attributes.type != 'availableTime'"
          :selected-event-coord="selectedEventCoord"
          :selected-event="selectedEvent"
          @event:confirm="updateAppointment($event, 'confirmed')"
          @event:cancel="updateAppointment($event, 'cancelled')"
        >
          <template #activator="{ on, attrs }">
            <div :class="{ 'opacity-60': isPast(event.start) }" v-bind="attrs" v-on="on">
              <div class="v-event-draggable">
                <span>
                  {{ getEventTitle(event) }}
                </span>
                <br />
                <span
                  >{{ formatDate({ date: event.start, dateFormat: DATE_FORMAT.HOUR }) }} -
                  {{ formatDate({ date: event.end, dateFormat: DATE_FORMAT.HOUR }) }}</span
                >
              </div>
            </div>
          </template>
        </appointment-editor>
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
import AvailableTimeEditor from './AvailableTimeEditor.vue';
import { EVENT_TYPE, EVENT_CREATION_STATUS } from '../../types/Calendar';
import { makeCalendarMixin } from '../../mixins/calendar';
import cryptoRandomString from 'crypto-random-string';
import cloneDeep from 'clone-deep';
import { AVAILABLE_TIME_CONFLIT_HANDLER_ERROR } from '../../../../server/components/usecases/utils/availableTimeConflictHandler/availableTimeConflictHandler';
import { makeAppointmentRepository } from '@/repositories/appointment';
import { AppointmentDoc } from '@server/models/Appointment';
import AppointmentEditor from './AppointmentEditor.vue';

const availableTimeRepository = makeAvailableTimeRepository;
const appointmentRepository = makeAppointmentRepository;

enum EVENT_COLOR {
  AVAILABLE_TIME = '#3F51B5',
  PENDING = '#81c784',
  COMPLETED = '#212121',
  CONFIRMED = '#43a047',
  CANCELLED = '#e57373',
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
      event?: AppointmentDoc | AvailableTimeDoc;
    };
  };
};

type GetEventParams = {
  start: StringKeyObject;
  end: StringKeyObject;
};

export default Vue.extend({
  name: 'EditCalendar',
  components: { BaseCalendar, AvailableTimeEditor, AppointmentEditor },
  mixins: [makeCalendarMixin],
  props: {
    userId: {
      type: String,
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
      showEditor: false,
      selectedEvent: {} as EventObject,
      selectedEventCoord: {
        x: 0,
        y: 0,
      },
      calendarFocusDate: '',
      datePickerDate: new Date().toISOString().substr(0, 10),
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
  errorCaptured(err: StringKeyObject): boolean {
    const errMsg = err.response.data.err;
    switch (errMsg) {
      case AVAILABLE_TIME_CONFLIT_HANDLER_ERROR.INVALID_DURATION:
        err.message = 'error.calendar.unevenAppointment';
        break;
      case AVAILABLE_TIME_CONFLIT_HANDLER_ERROR.INVALID_TIME:
        err.message = 'error.calendar.badStartAvailableTime';
        break;
      case AVAILABLE_TIME_CONFLIT_HANDLER_ERROR.OVERLAP:
        err.message = 'error.calendar.overlapAvailableTime';
        break;
    }
    this.cancelAvailableTime();
    return true;
  },
  methods: {
    async getEvents({ start, end }: GetEventParams): Promise<void> {
      const availableTimes = await this.getAvailableTimes({ start, end });
      const appointments = await this.getAppointments({ start, end });
      this._processEvents({ events: availableTimes, type: EVENT_TYPE.AVAILABLE_TIME });
      this._processEvents({ events: appointments, type: EVENT_TYPE.APPOINTMENT });
    },
    async getAvailableTimes({ start, end }: GetEventParams): Promise<AvailableTimeDoc[]> {
      const { startDate, endDate } = this._getWeekEdgeDates({ start, end });
      const { data } = await availableTimeRepository.get({
        path: `/users/${this.userId}/availableTimes`,
        query: {
          startDate,
          endDate,
        },
        isAbsolutePath: true,
      });
      const { availableTimes } = data;
      return availableTimes;
    },
    async getAppointments({ start, end }: GetEventParams): Promise<AppointmentDoc[]> {
      const { startDate, endDate } = this._getWeekEdgeDates({ start, end });
      const { data } = await appointmentRepository.get({
        path: `/users/${this.userId}/appointments`,
        query: {
          startDate,
          endDate,
        },
        isAbsolutePath: true,
      });
      const { appointments } = data;
      return appointments;
    },
    _getWeekEdgeDates({ start, end }: GetEventParams): {
      startDate: string;
      endDate: string;
    } {
      const weekEdgeDates = {
        startDate: dayjs(start.date, 'YYYY-MM-DD')
          .hour(0)
          .minute(0)
          .second(0)
          .millisecond(0)
          .toString(),
        endDate: dayjs(end.date, 'YYYY-MM-DD')
          .add(1, 'day')
          .hour(0)
          .minute(0)
          .second(0)
          .millisecond(0)
          .toString(),
      };
      return weekEdgeDates;
    },
    _processEvents(props: { events: AppointmentDoc[] | AvailableTimeDoc[]; type: EVENT_TYPE }) {
      const { events, type } = props;
      for (const event of events) {
        const isExistingEvent = this.events.some((evt) => {
          return evt.attributes._id == event._id;
        });
        if (!isExistingEvent) {
          const start = this._convertToUnixMs(event.startDate);
          const end = this._convertToUnixMs(event.endDate);
          const evt = {
            color: this._getEventColor(event),
            start,
            end,
            timed: true,
            attributes: {
              _id: event._id,
              creationStatus: EVENT_CREATION_STATUS.SAVED,
              type,
              originalEvent: {
                start,
                end,
                event,
              },
            },
          };
          this.events.push(evt);
        }
      }
    },
    _getEventColor(event: AppointmentDoc | AvailableTimeDoc): EVENT_COLOR {
      const isAppointment = 'status' in event;
      let eventColor = EVENT_COLOR.AVAILABLE_TIME;
      if (isAppointment) {
        switch ((event as AppointmentDoc).status) {
          case 'pending':
            eventColor = EVENT_COLOR.PENDING;
            break;
          case 'completed':
            eventColor = EVENT_COLOR.COMPLETED;
            break;
          case 'confirmed':
            eventColor = EVENT_COLOR.CONFIRMED;
            break;
          case 'cancelled':
            eventColor = EVENT_COLOR.CANCELLED;
            break;
          default:
            break;
        }
      }
      return eventColor;
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
      this._showEditor(false);
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
      event: EventObject;
      nativeEvent: StringKeyObject;
    }): void {
      this.selectedEventCoord.x = nativeEvent.clientX;
      this.selectedEventCoord.y = nativeEvent.clientY;
      this.selectedEvent = event;
      this._showEditor(true);
    },
    _showEditor(showEditor: boolean): void {
      requestAnimationFrame(() => (this.showEditor = showEditor));
    },
    extendBottom(event: EventObject): void {
      const { start, end } = event;
      this.createEvent = event;
      this.createStart = start;
      this.extendOriginal = end;
    },
    onMouseMoveTime(tms: StringKeyObject): void {
      const mouse = this.convertToMs(tms);
      const isMovingEvent = this.dragEvent && this.dragTime !== null;
      const isExtendingEvent = this.createEvent && this.createStart !== null;
      const isAppointment =
        (this.dragEvent && this.dragEvent.attributes.type == EVENT_TYPE.APPOINTMENT) ||
        (this.createEvent && this.createEvent.attributes.type == EVENT_TYPE.APPOINTMENT);
      if (isAppointment) {
        return;
      }
      if (isMovingEvent) {
        const start = this.dragEvent!.start;
        const end = this.dragEvent!.end;
        const duration = end - start;
        const newStartTime = mouse - this.dragTime!;
        const newStart = this.roundTime(newStartTime);
        const newEnd = newStart + duration;
        const isValidDate = this._isValidDate({ start: newStart, end: newEnd });
        if (isValidDate) {
          this.dragEvent!.start = newStart;
          this.dragEvent!.end = newEnd;
        }
        this._showEditor(false);
      } else if (isExtendingEvent) {
        const mouseRounded = this.roundTime(mouse, false);
        const min = Math.min(mouseRounded, this.createStart!);
        const max = Math.max(mouseRounded, this.createStart!);
        const isValidDate = this._isValidDate({ start: min, end: max });
        if (isValidDate) {
          this.createEvent!.start = min;
          this.createEvent!.end = max;
        }
        this._showEditor(false);
      }
    },
    _isValidDate(props: { start: Date | number; end: Date | number }): boolean {
      const { start, end } = props;
      const isSameDay = dayjs(start).isSame(end, 'day');
      const isSameDate = dayjs(start).isSame(end);
      const isEndMidnight = dayjs(end).hour() == 0 && dayjs(end).minute() == 0;
      const isValidDate = (isSameDay || (isSameDay && isEndMidnight)) && !isSameDate;
      return isValidDate;
    },
    onMouseUpTime(): void {
      this.dragTime = null;
      this.dragEvent = null;
      this.createEvent = null;
      this.createStart = null;
      this.extendOriginal = null;
      this._showEditor(true);
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
    async saveAvailableTime(): Promise<void> {
      const start = this.selectedEvent.start;
      const end = this.selectedEvent.end;
      const originalEventBeforeSave = cloneDeep(this.selectedEvent.attributes.originalEvent);
      this.selectedEvent.attributes.originalEvent = {
        start,
        end,
      };
      this._showEditor(false);
      try {
        if (!this.isSelectedEventSaved) {
          this.selectedEvent.attributes.creationStatus = EVENT_CREATION_STATUS.SAVED;
          await this._saveAvailableTime({ start, end });
        } else {
          await this._updateAvailableTime({ start, end });
        }
      } catch (err) {
        this._undoSaveAvailableTime(originalEventBeforeSave);
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
    async updateAppointment(event: EventObject, status: string): Promise<void> {
      const appointment = await this.$store.dispatch('appointment/updateAppointment', {
        appointmentId: event.attributes._id,
        updateParams: {
          status,
        },
      });
      event.attributes.originalEvent.event = appointment;
      event.color = this._getEventColor(appointment);
      this.$store.dispatch('appointment/resetEntityState');
      await this.$store.dispatch('appointment/getEntityStateData');
    },
    async _updateAvailableTime(props: { start: number; end: number }) {
      const { start, end } = props;
      await availableTimeRepository.updateById({
        _id: this.selectedEvent.attributes._id,
        updateParams: {
          startDate: dayjs(start).toDate(),
          endDate: dayjs(end).toDate(),
        },
      });
    },
    _undoSaveAvailableTime(originalEventBeforeSave: EventObject['attributes']['originalEvent']) {
      if (!this.selectedEvent.attributes._id) {
        this.selectedEvent.attributes.creationStatus = EVENT_CREATION_STATUS.PENDING;
      }
      this.selectedEvent.attributes.originalEvent = originalEventBeforeSave;
    },
    async cancelAvailableTime(): Promise<void> {
      const eventId = this.selectedEvent.attributes._id;
      const originalEvent = this.selectedEvent.attributes.originalEvent;
      this.selectedEvent.start = originalEvent.start;
      this.selectedEvent.end = originalEvent.end;
      if (!this.isSelectedEventSaved) {
        this.deleteAvailableTime({ eventId, deleteFromDb: false });
      } else {
        const newFocusDate = (this as any).formatDate({
          date: this.selectedEvent.start,
          formatString: 'YYYY-MM-DD',
        });
        this.calendarFocusDate = newFocusDate;
      }
      this._showEditor(false);
    },
    async deleteAvailableTime(props: { eventId: string; deleteFromDb: boolean }): Promise<void> {
      const { eventId, deleteFromDb } = props;
      if (deleteFromDb) {
        availableTimeRepository.deleteById(eventId);
      }
      this.events = this.events.filter((event) => {
        return event.attributes._id != eventId;
      });
      this._showEditor(false);
    },
    onDatePickerChange(value: string): void {
      const selectedEventStart = dayjs(this.selectedEvent.start);
      const selectedEventEnd = dayjs(this.selectedEvent.end);
      const newStartTime = dayjs(value)
        .hour(selectedEventStart.hour())
        .minute(selectedEventStart.minute());
      let newEndTime = dayjs(value).hour(selectedEventEnd.hour()).minute(selectedEventEnd.minute());
      const isValidDate = this._isValidDate({
        start: newStartTime.toDate(),
        end: newEndTime.toDate(),
      });
      if (!isValidDate) {
        newEndTime = newStartTime.add(1, 'day').hour(0).minute(0);
      }
      this._updateSelectedEvent({
        field: 'start',
        value: this._convertToUnixMs(newStartTime.toDate()),
      });
      this._updateSelectedEvent({
        field: 'end',
        value: this._convertToUnixMs(newEndTime.toDate()),
      });
      const newFocusDate = (this as any).formatDate({
        date: this.selectedEvent.start,
        formatString: 'YYYY-MM-DD',
      });
      this.calendarFocusDate = newFocusDate;
      this.datePickerDate = newFocusDate;
    },
    _updateSelectedEvent(props: { field: string; value: unknown }): void {
      const { field, value } = props;
      (this.selectedEvent as StringKeyObject)[field] = value;
      this._showEditor(true);
    },
    onCalendarFocusDateUpdate(value: string): void {
      this.calendarFocusDate = value;
    },
    onAutoCompleteStartChange(value: string): void {
      const selectedEventStart = dayjs(this.selectedEvent.start);
      const selectedEventEnd = dayjs(this.selectedEvent.end);
      const newStartTime = dayjs(value, (this as any).AUTOCOMPLETE_DATE_FORMAT.DEFAULT);
      const diff = newStartTime.diff(selectedEventStart);
      const newEndTime = selectedEventEnd.add(diff);
      const isValidDate = this._isValidDate({
        start: newStartTime.toDate(),
        end: newEndTime.toDate(),
      });
      this._updateSelectedEvent({
        field: 'start',
        value: this._convertToUnixMs(newStartTime.toDate()),
      });
      if (newStartTime.isAfter(selectedEventStart)) {
        const diff = newStartTime.diff(selectedEventStart);
        const newEndTime = selectedEventEnd.add(diff);
        this._updateSelectedEvent({ field: 'end', value: newEndTime.toDate() });
      }
      if (!isValidDate) {
        this._updateSelectedEvent({
          field: 'end',
          value: this._convertToUnixMs(newStartTime.add(1, 'day').hour(0).minute(0).toDate()),
        });
      }
    },
    onAutoCompleteEndChange(value: string): void {
      const newEndTime = dayjs(value, (this as any).AUTOCOMPLETE_DATE_FORMAT.DEFAULT);
      this._updateSelectedEvent({
        field: 'end',
        value: this._convertToUnixMs(newEndTime.toDate()),
      });
    },
  },
});
</script>

<style lang="scss" scoped>
@import '../../assets/scss/calendar.scss';
</style>
