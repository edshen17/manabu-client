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
              <v-list-item-title>{{ $t('calendar.day') }}</v-list-item-title>
            </v-list-item>
            <v-list-item @click="type = 'week'">
              <v-list-item-title>{{ $t('calendar.week') }}</v-list-item-title>
            </v-list-item>
            <v-list-item @click="type = '4day'">
              <v-list-item-title>{{ $t('calendar.fourDays') }}</v-list-item-title>
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
      @mousedown:time="createEvent"
      @mousemove:time="mouseMove"
      @mouseup:time="endDrag"
      @mouseup:event="onMouseUp"
      @touchend:event="onMouseUp"
      @mouseleave.native="cancelDrag"
    >
      <template v-slot:event="{ event, timed }">
        <div :ref="event.attributes.id">
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
      :close-on-click="false"
      :activator="selectedElement"
      offset-x
      :left="showSelectedEventMenuOnLeft"
      :transition="false"
      min-width="400px"
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
              v-if="getSelectedEventCreationStatus(selectedEvent) == 'saved'"
              class="float-right"
              @click="deleteEvent(selectedEvent.attributes.id)"
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
            <v-autocomplete
              v-show="autoCompleteVisibility.start"
              ref="autoCompleteStart"
              v-model="autoCompleteStartModel"
              auto-select-first
              dense
              :hide-no-data="true"
              append-icon=""
              class="w-14"
              :menu-props="autoCompleteMenuProps"
              :items="autoCompleteStartIntervals"
              @input="onAutoCompleteInput($event, 'start')"
            >
            </v-autocomplete>
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
            <v-autocomplete
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
              @input="onAutoCompleteInput($event, 'End')"
            ></v-autocomplete>
          </div>
        </v-card-text>
        <v-card-actions v-show="wasSelectedEventEdited(selectedEvent)">
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

dayjs.extend(customParseFormat);

export default Vue.extend({
  name: 'Calendar',
  props: {},
  data() {
    return {
      ready: false,
      datePickerDate: new Date().toISOString().substr(0, 10),
      menu: false,
      modal: false,
      showDatePicker: false,
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
      createdEvent: null as any,
      createStart: null as any,
      extendOriginal: null as any,
      today: '',
      calendarFocusDate: '',
      type: 'week',
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
    cal: {
      get(): any {
        return this.ready ? this.$refs.calendar : null;
      },
    },
    typeToLabel: {
      get(): StringKeyObject {
        return {
          week: this.$t('calendar.week'),
          day: this.$t('calendar.day'),
          '4day': this.$t('calendar.fourDays'),
        };
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
          let startTime = dayjs(selectedEventStart);
          let endTime = startTime.add(1, 'day');
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
  },
  mounted() {
    this.ready = true;
  },
  methods: {
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
    resetAutoCompleteStartVisibility(event?: any): void {
      const isClickingInput = event && event.target.tagName == 'INPUT';
      if (!isClickingInput) {
        this.autoCompleteVisibility.start = false;
      }
    },
    resetAutoCompleteEndVisibility(event?: any): void {
      const isClickingInput = event && event.target.tagName == 'INPUT';
      if (!isClickingInput) {
        this.autoCompleteVisibility.end = false;
      }
    },
    toggleAutoCompleteStartVisibility(event: any): void {
      this._toggleAutoCompleteVisibility({ type: 'start', refName: 'autoCompleteStart', event });
    },
    toggleAutoCompleteEndVisibility(event: any): void {
      this._toggleAutoCompleteVisibility({ type: 'end', refName: 'autoCompleteEnd', event });
    },
    _toggleAutoCompleteVisibility(props: { type: string; refName: string; event: any }): void {
      const { type, refName, event } = props;
      this.autoCompleteVisibility[type] = !this.autoCompleteVisibility[type];
      if (event.path[0].id.includes('TimeBtn')) {
        const inputField = (this.$refs[refName] as any).$refs.input;
        setTimeout(() => {
          inputField.click();
        });
      }
    },
    cancelEvent(): void {
      const wasEventSaved = this.selectedEvent.attributes.creationStatus == 'saved';
      const selectedEventId = this.selectedEvent.attributes.id;
      if (!wasEventSaved) {
        this.deleteEvent(selectedEventId);
      } else {
        const originalEvent = this.selectedEvent.attributes.originalEvent;
        this.selectedEvent.start = originalEvent.start;
        this.selectedEvent.end = originalEvent.end;
        this._showSelectedEventPopup(false);
      }
      this.showSelectedEventMenu = false;
    },
    deleteEvent(eventId: string) {
      //delete in db if saved, else just filter out
      this.events = this.events.filter((event) => {
        return event.attributes.id != eventId;
      });
      this.showSelectedEventMenu = false;
    },
    saveEvent(): void {
      this.selectedEvent.attributes.creationStatus = 'saved';
      this.selectedEvent.attributes.originalEvent = {
        start: this.selectedEvent.start,
        end: this.selectedEvent.end,
      };
      this.showSelectedEventMenu = false;
      // save to db
    },
    getEventTitle(event: any): TranslateResult {
      const isAvailableTime = event.attributes && event.attributes.type == 'availableTime';
      const eventTitle = isAvailableTime
        ? this.$t('calendar.availableTime')
        : this.$t('calendar.appointment');
      return eventTitle;
    },
    getSelectedEventCreationStatus(): string {
      let selectedEventCreationStatus = '';
      if (this.selectedEvent.attributes) {
        selectedEventCreationStatus = this.selectedEvent.attributes.creationStatus;
      }
      return selectedEventCreationStatus;
    },
    wasSelectedEventEdited(): boolean {
      if (this.selectedEvent.attributes) {
        const selectedEvent = this.selectedEvent;
        const selectedEventAttributes = selectedEvent.attributes;
        const wasSelectedEventEdited =
          selectedEventAttributes.creationStatus == 'pending' ||
          !(
            selectedEvent.start == selectedEventAttributes.originalEvent.start &&
            selectedEvent.end == selectedEventAttributes.originalEvent.end
          );
        return wasSelectedEventEdited;
      }
      return false;
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
      (this.$refs.calendar as any).prev();
    },
    next(): void {
      (this.$refs.calendar as any).next();
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
    scrollToTime(): void {
      const time = this.getCurrentTime();
      const first = Math.max(0, time - (time % 30) - 30);
      this.cal.scrollToTime(first);
    },
    updateTime(): void {
      setInterval(() => this.cal.updateTimes(), 60 * 1000);
    },
    startMouseDrag({ event, timed }: any): void {
      if (event && timed) {
        this.dragEvent = event;
        this.dragTime = null;
        this.extendOriginal = null;
      }
      this.selectedEvent = event;
    },
    createEvent(tms: StringKeyObject): void {
      const mouse = this.toTime(tms);
      this.selectedElement = null;
      this.showSelectedEventMenu = false;
      const isClickingExistingEvent = this.dragEvent && this.dragTime === null;
      if (isClickingExistingEvent) {
        const start = this.dragEvent.start;
        this.dragTime = mouse - start;
      } else {
        this.createStart = this.roundTime(mouse);
        const newEvent = {
          color: this.rndElement(this.colors),
          start: this.createStart,
          end: this.createStart + 60 * 60 * 1000,
          timed: true,
          attributes: {
            id: cryptoRandomString({ length: 20 }),
            creationStatus: 'pending',
            type: 'availableTime',
            originalEvent: {
              start: this.createStart,
              end: this.createStart + 60 * 60 * 1000,
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
      if (this.dragEvent && this.dragTime !== null) {
        const start = this.dragEvent.start;
        const end = this.dragEvent.end;
        const duration = end - start;
        const newStartTime = mouse - this.dragTime;
        const newStart = this.roundTime(newStartTime);
        const newEnd = newStart + duration;
        this.dragEvent.start = newStart;
        this.dragEvent.end = newEnd;
      } else if (this.createdEvent && this.createStart !== null) {
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
    getEvents({ start, end }: any): void {
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
    rnd(a: number, b: number): number {
      return Math.floor((b - a + 1) * Math.random()) + a;
    },
    rndElement(arr: number[]): number {
      return arr[this.rnd(0, arr.length - 1)];
    },
  },
});
</script>

<style lang="scss" scoped>
.vs__no-options {
  display: none !important;
}

.calendar .v-text-field.v-input--dense {
  max-width: 120px;
}

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
