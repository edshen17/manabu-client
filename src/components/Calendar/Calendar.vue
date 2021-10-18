<template>
  <div data-app class="select-none calendar">
    <v-sheet height="64" class="flex flex-wrap mx-auto">
      <v-toolbar flat>
        <v-btn outlined class="mx-4" color="grey darken-2" @click="setToday">
          {{ $t('calendar.today') }}</v-btn
        >
        <v-btn fab text small color="grey darken-2" @click="prev">
          <v-icon small> mdi-chevron-left </v-icon>
        </v-btn>
        <v-btn fab text small color="grey darken-2" @click="next">
          <v-icon small> mdi-chevron-right </v-icon>
        </v-btn>
        <v-toolbar-title v-if="$refs.calendar && !isMobile" class="mx-4">
          {{ $refs.calendar.title }}
        </v-toolbar-title>
        <v-menu bottom right>
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-show="!isMobile" outlined color="grey darken-2" v-bind="attrs" v-on="on">
              <span>{{ typeToLabel[type].text }}</span>
              <v-icon right> mdi-menu-down </v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="(value, propertyName) in typeToLabel"
              v-show="(!isMobile && value.showIfDesktop) || (isMobile && value.showIfMobile)"
              :key="propertyName"
              @click="type = propertyName"
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
      class="w-screen h-screen text-white"
      :type="type"
      color="primary"
      :events="events"
      :event-color="getEventColor"
      :locale="locale"
      event-text-color="white"
      @click:date="viewDay"
      @click:event="onEventClick"
      @change="getEvents"
      @mousedown:event="startMouseDrag"
      @mousedown:time="onMouseDownTime"
      @mousemove:time="mouseMove"
      @mouseup:time="endDrag"
      @mouseup:event="onMouseUp"
      @mouseleave.native="cancelDrag"
    >
      <template v-slot:event="{ event, timed }">
        <div :ref="event.attributes.id" :class="{ 'opacity-60': isPast(event.start) }">
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
          <div v-if="timed" class="v-event-drag-bottom" @mousedown.stop="extendBottom(event)"></div>
        </div>
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
      v-model="showSelectedEventMenu"
      :close-on-content-click="false"
      :close-on-click="true"
      :activator="selectedElement"
      offset-x
      :offset-y="isMobile"
      :left="showSelectedEventMenuOnLeft"
      :min-width="menuWidth"
    >
      <v-card color="grey lighten-4" flat>
        <v-card-text>
          <div class="flex">
            <div class="flex-grow">
              <p class="text-black text-lg tracking-wide inline">
                {{ getEventTitle(selectedEvent) }}
              </p>
            </div>
            <button
              v-if="isSelectedEventSaved"
              class="float-right"
              @click="deleteEvent({ eventId: selectedEvent.attributes.id, deleteFromDb: true })"
            >
              <i class="fas fa-trash-alt text-lg"></i>
            </button>
          </div>
          <div class="flex flex-wrap content-start">
            <v-menu
              v-model="showDatePicker"
              :close-on-content-click="false"
              :nudge-right="40"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <button
                  class="inline cursor-pointer hover:bg-gray-100 opacity-90 py-2"
                  v-bind="attrs"
                  v-on="on"
                >
                  {{ formatDate({ date: selectedEvent.start, dateFormat: 'abridgedDate' }) }}
                </button>
              </template>
              <v-date-picker
                v-model="datePickerDate"
                no-title
                scrollable
                :locale="locale"
                @input="showDatePicker = false"
                @change="onDatePickerChange"
              ></v-date-picker>
            </v-menu>
            <p class="mx-1 py-1 text-lg font-bold">⋅</p>
            <button
              v-show="!autoCompleteVisibility.start"
              id="startTimeBtn"
              v-click-outside="resetAutoCompleteStartVisibility"
              class="inline cursor-pointer hover:bg-gray-100 opacity-90 py-2"
              @click="toggleAutoCompleteStartVisibility"
            >
              {{ formatDate({ date: selectedEvent.start, dateFormat: 'hour' }) }}
            </button>
            <component
              :is="selectTimeElement"
              v-show="autoCompleteVisibility.start"
              ref="autoCompleteStart"
              v-model="autoCompleteStartModel"
              auto-select-first
              dense
              :hide-no-data="true"
              append-icon=""
              :menu-props="autoCompleteMenuProps"
              class="w-14"
              :items="autoCompleteStartIntervals"
              @input="onAutoCompleteInput($event, 'start')"
            ></component>
            <p class="mx-1 py-1 text-lg font-thin">-</p>
            <button
              v-show="!autoCompleteVisibility.end"
              id="endTimeBtn"
              v-click-outside="resetAutoCompleteEndVisibility"
              class="
                inline
                cursor-pointer
                hover:bg-gray-100
                focus:border-red-300 focus:ring-red-300
                py-2
                mr-3
              "
              @click="toggleAutoCompleteEndVisibility"
            >
              {{ formatDate({ date: selectedEvent.end, dateFormat: 'hour' }) }}
            </button>
            <component
              :is="selectTimeElement"
              v-show="autoCompleteVisibility.end"
              ref="autoCompleteEnd"
              v-model="autoCompleteEndModel"
              auto-select-first
              dense
              :hide-no-data="true"
              append-icon=""
              :menu-props="autoCompleteMenuProps"
              class="w-14"
              :items="autoCompleteEndIntervals"
              @input="onAutoCompleteInput($event, 'end')"
            ></component>
          </div>
        </v-card-text>
        <v-card-actions v-show="!isSelectedEventSaved">
          <v-btn text color="secondary" class="m-0 animate-pulse" @click="saveEvent">
            <span class="text-blue-600">{{ $t('calendar.save') }}</span>
          </v-btn>
          <v-btn text color="secondary" @click="cancelEvent">
            {{ $t('calendar.cancel') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import cloneDeep from 'clone-deep';
import cryptoRandomString from 'crypto-random-string';
import { TranslateResult } from 'vue-i18n';
import { mapGetters } from 'vuex';
import { StringKeyObject } from '../../../../server/types/custom';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { makeDateFormatHandler } from '../../plugins/i18n/utils/dateFormatHandler';
import { VAutocomplete, VSelect } from 'vuetify/lib';
import { makeAvailableTimeRepository } from '../../repositories/availableTime/index';
import { AvailableTimeDoc } from '../../../../server/models/AvailableTime';
const availableTimeRepository = makeAvailableTimeRepository;

dayjs.extend(customParseFormat);

export default Vue.extend({
  name: 'Calendar',
  components: { VAutocomplete, VSelect },
  props: {
    userId: {
      type: String,
      default: '',
      required: true,
    },
  },
  data() {
    return {
      ready: false,
      datePickerDate: new Date().toISOString().substr(0, 10),
      menu: false,
      modal: false,
      showDatePicker: false,
      currentTime: {
        hour: 0,
        minute: 0,
      },
      color: {
        availableTimeColor: '#3F51B5',
      },
      intervalTimerId: 0 as any,
      events: [] as StringKeyObject[],
      names: [] as string[],
      dragEvent: null as any,
      dragStart: null as any,
      dragTime: 0 as any,
      createdEvent: null as any,
      createStart: null as any,
      extendOriginal: null as any,
      today: '',
      calendarFocusDate: '',
      type: '',
      selectedEvent: {} as StringKeyObject,
      selectedElement: null as any,
      showSelectedEventMenu: false,
      autoCompleteVisibility: {
        start: false,
        end: false,
      } as StringKeyObject,
      dateFormatHandler: makeDateFormatHandler,
    };
  },
  computed: {
    ...mapGetters({
      locale: 'user/locale',
    }),
    menuWidth: {
      get(): string {
        const menuWidth = (this as any).isMobile ? '350px' : '400px';
        return menuWidth;
      },
    },
    selectTimeElement: {
      get(): string {
        const timeElement = (this as any).isMobile ? 'VSelect' : 'VAutocomplete';
        return timeElement;
      },
    },
    cal: {
      get(): any {
        return this.ready ? this.$refs.calendar : null;
      },
    },
    typeToLabel: {
      get(): StringKeyObject {
        return {
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
      },
    },
    nowY: {
      get(): string {
        return this.cal ? this.cal.timeToY(this.currentTime) + 'px' : '-10px';
      },
    },
    autoCompleteStartIntervals: {
      get(): StringKeyObject[] {
        const selectedEventStart = this.selectedEvent.start;
        let startTime = dayjs(selectedEventStart).hour(0).minute(0);
        const endTime = startTime.add(1, 'day');
        const startIntervals = [];
        while (startTime.isBefore(endTime)) {
          const formattedTime = startTime.format('h:mma');
          const time = {
            text: formattedTime,
            value: startTime.format('D h:mma'),
          };
          startIntervals.push(time);
          startTime = startTime.add(30, 'minutes');
        }
        return startIntervals;
      },
    },
    autoCompleteEndIntervals: {
      get(): StringKeyObject[] {
        const endIntervals: StringKeyObject[] = [];
        const selectedEventStart = this.selectedEvent.start;
        const selectedEventEnd = this.selectedEvent.end;
        const hasSelectedEvent = selectedEventStart && selectedEventEnd;
        if (hasSelectedEvent) {
          let startTime = dayjs(selectedEventStart).add(30, 'minutes');
          let endTime = startTime.add(23.5, 'hours');
          while (startTime.isBefore(endTime)) {
            const diffBetweenSelectedEventStart =
              startTime.diff(selectedEventStart, 'minutes') / 60;
            const formattedTime = this.formatDate({
              date: startTime.toDate(),
              dateFormat: 'hourWithDuration',
              translationProps: { hours: diffBetweenSelectedEventStart },
            });
            const time = {
              text: formattedTime,
              value: startTime.format('D h:mma'),
            };
            endIntervals.push(time);
            startTime = startTime.add(30, 'minutes');
          }
        }
        return endIntervals;
      },
    },
    autoCompleteStartModel: {
      get(): string {
        const selectedEventStart = this.selectedEvent.start;
        return selectedEventStart
          ? this.formatDate({ date: selectedEventStart, formatString: 'D h:mma' })
          : '';
      },
      set(val: string): void {
        return;
      },
    },
    autoCompleteEndModel: {
      get(): string {
        const selectedEventEnd = this.selectedEvent.end;
        return selectedEventEnd
          ? this.formatDate({ date: selectedEventEnd, formatString: 'D h:mma' })
          : '';
      },
      set(val: string): void {
        return;
      },
    },
    autoCompleteMenuProps: {
      get(): StringKeyObject {
        const autoCompleteMenuProps = {
          closeOnClick: true,
          closeOnContentClick: true,
          transition: false,
        };
        return autoCompleteMenuProps;
      },
    },
    showSelectedEventMenuOnLeft: {
      get(): boolean {
        let showSelectedEventMenuOnLeft = false;
        if (this.selectedElement) {
          const windowWidth = Math.max(
            document.documentElement.clientWidth,
            window.innerWidth || 0
          );
          const selectedElementPositions = this.selectedElement.getBoundingClientRect();
          const selectedElementX = selectedElementPositions.left;
          showSelectedEventMenuOnLeft = selectedElementX > windowWidth / 2;
        }
        return showSelectedEventMenuOnLeft;
      },
    },
    isSelectedEventSaved: {
      get(): boolean {
        const { attributes, start, end } = this.selectedEvent;
        let isSelectedEventSaved = false;
        if (attributes) {
          const { creationStatus, originalEvent } = attributes;
          isSelectedEventSaved =
            creationStatus == 'saved' && start == originalEvent.start && end == originalEvent.end;
        }
        return isSelectedEventSaved;
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
    }, 60 * 1000);
  },
  async mounted() {
    this.ready = true;
    this.setCurrentTime();
  },
  destroyed() {
    this.clearIntervals();
  },
  methods: {
    clearIntervals() {
      clearInterval(this.intervalTimerId);
    },
    setCurrentTime() {
      this.currentTime = {
        hour: dayjs().hour(),
        minute: dayjs().minute(),
      };
    },
    isPast(start: Date) {
      const isPast = dayjs(start).isBefore(dayjs());
      return isPast;
    },
    onMobile(isMobile: boolean): void {
      isMobile ? (this.type = 'day') : (this.type = 'week');
    },
    formatDate(props: {
      date: Date;
      dateFormat?: string;
      formatString?: string;
      translationProps?: StringKeyObject;
    }): string {
      const { date, dateFormat, formatString, translationProps } = props;
      const dateFormatString: any =
        formatString || this.$t(`dateFormat.${dateFormat}`, translationProps);
      const formattedDate = this.dateFormatHandler.formatDate({
        date,
        formatString: dateFormatString,
      });
      return formattedDate;
    },
    onDatePickerChange(): void {
      const selectedEventStart = dayjs(this.selectedEvent.start);
      const selectedEventEnd = dayjs(this.selectedEvent.end);
      const newStartTime = dayjs(this.datePickerDate)
        .hour(selectedEventStart.hour())
        .minute(selectedEventStart.minute())
        .toDate();
      const newEndTime = dayjs(this.datePickerDate)
        .hour(selectedEventEnd.hour())
        .minute(selectedEventEnd.minute())
        .toDate();
      this._updateSelectedEvent({ field: 'start', value: newStartTime });
      this._updateSelectedEvent({ field: 'end', value: newEndTime });
    },
    _updateSelectedEvent(props: { field: string; value: unknown }): void {
      const { field, value } = props;
      this.selectedEvent[field] = value;
      this._showSelectedEventPopup(true);
    },
    _showSelectedEventPopup(showSelectedEventMenu: boolean): void {
      this.showSelectedEventMenu = false;
      setTimeout(() => {
        // need this timeout or else new calendar element isn't rendered yet...
        this.selectedElement = this.$refs[this.selectedEvent.attributes.id];
        requestAnimationFrame(() =>
          requestAnimationFrame(() => (this.showSelectedEventMenu = showSelectedEventMenu))
        );
      });
      this.calendarFocusDate = this.formatDate({
        date: this.selectedEvent.start,
        formatString: 'YYYY-MM-DD',
      });
    },
    onAutoCompleteInput(value: string, type: string): void {
      const isStartDate = type == 'start';
      const selectedEventStart = dayjs(this.selectedEvent.start);
      const selectedEventEnd = dayjs(this.selectedEvent.end);
      const isValidDateStr = dayjs(value, 'D h:mma', true).isValid();
      const newDate = dayjs(value, 'D h:mma');
      if (!isValidDateStr) {
        return;
      }
      if (!isStartDate) {
        const newEndTime = selectedEventEnd
          .day(newDate.day())
          .hour(newDate.hour())
          .minute(newDate.minute());
        this._updateSelectedEvent({ field: 'end', value: newEndTime.toDate() });
      } else {
        const newStartTime = selectedEventStart.hour(newDate.hour()).minute(newDate.minute());
        this._updateSelectedEvent({ field: 'start', value: newStartTime.toDate() });
        if (newStartTime.isAfter(selectedEventStart)) {
          const diff = newStartTime.diff(selectedEventStart);
          const newEndTime = selectedEventEnd.add(diff);
          this._updateSelectedEvent({ field: 'end', value: newEndTime.toDate() });
        }
      }
      this.resetAutoCompleteVisibility();
    },
    resetAutoCompleteVisibility(): void {
      this.resetAutoCompleteStartVisibility();
      this.resetAutoCompleteEndVisibility();
    },
    resetAutoCompleteStartVisibility(nativeEvent?: any): void {
      const isClickingInput = nativeEvent && nativeEvent.target.tagName == 'INPUT';
      if (!isClickingInput) {
        this.autoCompleteVisibility.start = false;
      }
    },
    resetAutoCompleteEndVisibility(nativeEvent?: any): void {
      const isClickingInput = nativeEvent && nativeEvent.target.tagName == 'INPUT';
      if (!isClickingInput) {
        this.autoCompleteVisibility.end = false;
      }
    },
    toggleAutoCompleteStartVisibility(nativeEvent: any): void {
      this._toggleAutoCompleteVisibility({
        type: 'start',
        refName: 'autoCompleteStart',
        nativeEvent,
      });
    },
    toggleAutoCompleteEndVisibility(nativeEvent: any): void {
      this._toggleAutoCompleteVisibility({ type: 'end', refName: 'autoCompleteEnd', nativeEvent });
    },
    _toggleAutoCompleteVisibility(props: {
      type: string;
      refName: string;
      nativeEvent: any;
    }): void {
      const { type, refName, nativeEvent } = props;
      this.autoCompleteVisibility[type] = !this.autoCompleteVisibility[type];
      if (nativeEvent.target.id.includes('TimeBtn')) {
        const inputField = (this.$refs[refName] as any).$refs.input;
        setTimeout(() => {
          inputField.click();
        });
      }
    },
    async cancelEvent(): Promise<void> {
      const eventId = this.selectedEvent.attributes.id;
      if (!this.isSelectedEventSaved) {
        this.deleteEvent({ eventId, deleteFromDb: false });
      }
      const originalEvent = this.selectedEvent.attributes.originalEvent;
      this.selectedEvent.start = originalEvent.start;
      this.selectedEvent.end = originalEvent.end;
      this._showSelectedEventPopup(false);
    },
    async deleteEvent(props: { eventId: string; deleteFromDb: boolean }): Promise<void> {
      const { eventId, deleteFromDb } = props;
      if (deleteFromDb) {
        availableTimeRepository.deleteById(eventId);
      }
      this.events = this.events.filter((event) => {
        return event.attributes.id != eventId;
      });
      this.showSelectedEventMenu = false;
    },
    async saveEvent(): Promise<void> {
      const start = this.selectedEvent.start;
      const end = this.selectedEvent.end;
      this.showSelectedEventMenu = false;
      this.selectedEvent.attributes.originalEvent = {
        start,
        end,
      };
      if (!this.isSelectedEventSaved) {
        await this._saveAvailableTime({ start, end });
      } else {
        await this._updateAvailableTime({ start, end });
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
      this.selectedEvent.attributes.creationStatus = 'saved';
      this.selectedEvent.attributes.id = data.availableTime._id;
    },
    async _updateAvailableTime(props: { start: Date; end: Date }) {
      const { start, end } = props;
      await availableTimeRepository.updateById({
        _id: this.selectedEvent.attributes.id,
        updateParams: {
          startDate: dayjs(start).toDate(),
          endDate: dayjs(end).toDate(),
        },
      });
    },
    getEventTitle(event: any): TranslateResult {
      const isAvailableTime = event.attributes && event.attributes.type == 'availableTime';
      const eventTitle = isAvailableTime
        ? this.$t('calendar.availableTime')
        : this.$t('calendar.appointment');
      return eventTitle;
    },
    // below are the vuetify calendar methods
    viewDay({ date }: { date: string }): void {
      this.calendarFocusDate = date;
      this.type = 'day';
    },
    setToday(): void {
      this.calendarFocusDate = this.today;
    },
    prev(): void {
      this._moveCalendar('backward');
    },
    next(): void {
      this._moveCalendar('forward');
    },
    _moveCalendar(direction: string) {
      const isMovingForward = direction == 'forward';
      const calendar = this.$refs.calendar as any;
      isMovingForward ? calendar.next() : calendar.prev();
      this.showSelectedEventMenu = false;
      this.events = this.events.filter((event) => {
        return event.attributes.creationStatus != 'pending';
      });
    },
    onEventClick({ nativeEvent, event }: any): void {
      this.onMouseUp({ nativeEvent, event });
      nativeEvent.stopPropagation();
    },
    onMouseUp({ nativeEvent, event }: any): void {
      this.selectedEvent = event;
      this.selectedElement = nativeEvent.target;
      requestAnimationFrame(() => requestAnimationFrame(() => (this.showSelectedEventMenu = true)));
      this.events = this.events.filter((event) => {
        return (
          event.attributes.id == this.selectedEvent.attributes.id ||
          event.attributes.creationStatus != 'pending'
        );
      });
    },
    getCurrentTime(): number {
      return this.cal ? this.cal.times.now.hour * 60 + this.cal.times.now.minute : 0;
    },
    startMouseDrag({ event, timed }: any): void {
      if (event && timed) {
        this.dragEvent = event;
        this.dragTime = null;
        this.extendOriginal = null;
      }
      this.selectedEvent = event;
    },
    onMouseDownTime(tms: StringKeyObject): void {
      const mouse = this.toTime(tms);
      this.selectedElement = null;
      this.showSelectedEventMenu = false;
      const isClickingExistingEvent = this.dragEvent && this.dragTime === null;
      if (isClickingExistingEvent) {
        const start = this.dragEvent.start;
        this.dragTime = mouse - start;
      } else {
        this.createStart = this.roundTime(mouse);
        const start = this.createStart;
        const end = this.createStart + 60 * 60 * 1000;
        const newEvent = {
          color: this.color.availableTimeColor,
          start,
          end,
          timed: true,
          attributes: {
            id: cryptoRandomString({ length: 20 }),
            creationStatus: 'pending',
            type: 'availableTime',
            originalEvent: {
              start,
              end,
            },
          },
        };
        this.createdEvent = cloneDeep(newEvent);
        this.selectedEvent = this.createdEvent;
        this.events.push(this.createdEvent);
        this.events = this.events.filter((event) => {
          return (
            event.attributes.id == this.selectedEvent.attributes.id ||
            event.attributes.creationStatus != 'pending'
          );
        });
      }
      this.resetAutoCompleteVisibility();
    },
    extendBottom(event: any): void {
      this.createdEvent = event;
      this.createStart = event.start;
      this.extendOriginal = event.end;
    },
    mouseMove(tms: any): void {
      const mouse = this.toTime(tms);
      const isMovingEvent = this.dragEvent && this.dragTime !== null;
      const isExtendingEvent = this.createdEvent && this.createStart !== null;
      if (isMovingEvent) {
        const start = this.dragEvent.start;
        const end = this.dragEvent.end;
        const duration = end - start;
        const newStartTime = mouse - this.dragTime;
        const newStart = this.roundTime(newStartTime);
        const newEnd = newStart + duration;
        this.dragEvent.start = newStart;
        this.dragEvent.end = newEnd;
      } else if (isExtendingEvent) {
        const mouseRounded = this.roundTime(mouse, false);
        const min = Math.min(mouseRounded, this.createStart);
        const max = Math.max(mouseRounded, this.createStart);
        this.createdEvent.start = min;
        this.createdEvent.end = max;
      }
    },
    endDrag(): void {
      this._showSelectedEventPopup(true);
      this.dragTime = null;
      this.dragEvent = null;
      this.createdEvent = null;
      this.createStart = null;
      this.extendOriginal = null;
    },
    cancelDrag(): void {
      if (this.createdEvent) {
        if (this.extendOriginal) {
          this.createdEvent.end = this.extendOriginal;
        } else {
          const i = this.events.indexOf(this.createdEvent);
          if (i !== -1) {
            this.events.splice(i, 1);
          }
        }
      }
      this.createdEvent = null;
      this.createStart = null;
      this.dragTime = null;
      this.dragEvent = null;
    },
    roundTime(time: number, down = true): number {
      const roundTo = 30; // minutes
      const roundDownTime = roundTo * 60 * 1000;
      return down ? time - (time % roundDownTime) : time + (roundDownTime - (time % roundDownTime));
    },
    toTime(tms: any): number {
      return new Date(tms.year, tms.month - 1, tms.day, tms.hour, tms.minute).getTime();
    },
    getEventColor(event: any): string {
      const rgb = parseInt(event.color.substring(1), 16);
      const r = (rgb >> 16) & 0xff;
      const g = (rgb >> 8) & 0xff;
      const b = (rgb >> 0) & 0xff;
      return event === this.dragEvent
        ? `rgba(${r}, ${g}, ${b}, 0.7)`
        : event === this.createdEvent
        ? `rgba(${r}, ${g}, ${b}, 0.7)`
        : event.color;
    },
    async getEvents({
      start,
      end,
    }: {
      start: StringKeyObject;
      end: StringKeyObject;
    }): Promise<void> {
      const availableTimes = await this.getAvailableTimes({ start, end });
      availableTimes.forEach((availableTime) => {
        const isSeenEvent = this.events.some((event) => {
          return event.attributes.id == availableTime._id;
        });
        if (!isSeenEvent) {
          const event = {
            color: this.color.availableTimeColor,
            start: dayjs(availableTime.startDate).unix() * 1000,
            end: dayjs(availableTime.endDate).unix() * 1000,
            timed: true,
            attributes: {
              id: availableTime._id,
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
      });
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
  },
  errorCaptured(err: Error): boolean {
    console.log(err); // set translation err.message = 'error.___'
    return true;
  },
});
</script>

<style lang="scss" scoped>
@import '../../assets/scss/calendar.scss';
</style>
