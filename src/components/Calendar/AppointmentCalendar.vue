<template>
  <div :class="mainClass">
    <div class="w-full md:w-8/12 lg:rounded-lg h-full">
      <div class="flex flex-wrap lg:flex-nowrap h-full">
        <div class="lg:w-4/12 mx-4 lg:mx-0">
          <div class="mb-5">
            <p class="text-xl pb-1">{{ $t('userProfile.teacher.lessonDetails') }}</p>
            <div class="text-gray-600 text-lg">
              <p class="py-1">
                {{ getPackageName(pkg) }} /
                {{ $t('userProfile.teacher.lessonDuration', { lessonDuration: duration }) }}
              </p>
              <p>{{ $t('userProfile.teacher.lessonAmount', { lessonAmount: reserveCount }) }}</p>
            </div>
          </div>
        </div>
        <div class="lg:w-4/12">
          <v-date-picker
            v-model="calendarFocusDateModel"
            :locale="locale"
            :full-width="true"
            event-color="bg-pink-500"
            :events="selectedDays"
            class="h-96"
            :allowed-dates="isAllowedDate"
            @update:picker-date="getAvailableTimes"
          ></v-date-picker>
          <div class="flex justify-center my-2">
            <div class="inline-flex items-center text-gray-600">
              <i class="fas fa-globe-americas"></i>
              <p class="my-3 mx-2">{{ currentUserTimezone }} ({{ now }})</p>
            </div>
          </div>
        </div>
        <div class="flex-grow overflow-y-auto no-scrollbar">
          <div class="flex flex-col justify-center items-center mb-2">
            <button
              v-for="timeslot in visibleTimeslots"
              :key="timeslot.startDate.toISOString()"
              class="border-solid border border-blue-400 rounded-md text-xl p-2 w-9/12 mb-3"
              :class="{
                'bg-indigo-500 text-white': isTimeslotSelected(timeslot),
                'opacity-20 bg-gray-200': isTimeslotDisabled(timeslot),
              }"
              :disabled="isTimeslotDisabled(timeslot)"
              @click="onTimeslotClick(timeslot)"
            >
              {{ timeslot.formattedDate }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <button
      v-show="selectedTimeslots.length > 0"
      class="
        rounded-full
        bg-green-500
        h-14
        w-14
        md:h-16 md:w-16
        fixed
        p-0
        bottom-4
        right-4
        md:bottom-5 md:right-10
        z-10
      "
      @click="$emit('submit-timeslots', emittedTimeslots)"
    >
      <i class="fas fa-arrow-right text-white"></i>
    </button>
  </div>
</template>

<script lang="ts">
import dayjs from 'dayjs';
import Vue from 'vue';
import { AvailableTimeDoc } from '../../../../server/models/AvailableTime';
import { StringKeyObject } from '../../../../server/types/custom';
import { makeCalendarMixin } from '../../mixins/calendar';
import { makeAvailableTimeRepository } from '../../repositories/availableTime';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { mapGetters } from 'vuex';
import { makePackageMixin } from '@/mixins/package';
dayjs.extend(utc);
dayjs.extend(timezone);

type Timeslot = { startDate: Date; endDate: Date; formattedDate: string };
type CompactTimeslot = Omit<Timeslot, 'formattedDate'>;

const availableTimeRepository = makeAvailableTimeRepository;
const DAY_FORMAT = 'YYYY-MM-DD';
const MONTH_FORMAT = 'YYYY-MM';
export default Vue.extend({
  name: 'AppointmentCalendar',
  components: {},
  mixins: [makeCalendarMixin, makePackageMixin],
  props: {
    mainClass: {
      type: String,
      required: false,
      default: 'flex justify-center items-center h-auto lg:h-screen',
    },
    hostedById: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    appointmentAmount: {
      type: Number,
      required: true,
    },
    pkg: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      calendarFocusDate: '',
      events: [] as StringKeyObject[],
      intervalTimerId: 0 as any,
      now: '',
      selectedTimeslots: [] as Timeslot[],
    };
  },
  computed: {
    ...mapGetters({
      locale: 'user/locale',
    }),
    emittedTimeslots: {
      get(): CompactTimeslot[] {
        const emittedTimeslots = this.selectedTimeslots.map((timeslot) => {
          const { formattedDate, ...ts } = timeslot;
          return ts;
        });
        return emittedTimeslots;
      },
    },
    selectedDays: {
      get(): string[] {
        const selectedDays = this.selectedTimeslots.map((timeslot) => {
          const startDateKey = timeslot.startDate.toISOString();
          return dayjs(startDateKey).format(DAY_FORMAT);
        });
        return selectedDays;
      },
    },
    disabledTimeslots: {
      get(): Timeslot[] {
        const disabledTimeslots = [];
        for (const timeslot of this.selectedTimeslots) {
          for (let i = -(this.duration / 30) + 1; i < this.duration / 30; i++) {
            const minMultiplier = 30 * i;
            const startDate = dayjs(timeslot.startDate).add(minMultiplier, 'minutes').toDate();
            const endDate = dayjs(timeslot.endDate).add(minMultiplier, 'minutes').toDate();
            const formattedDate = this.formatTimeslotDate(startDate);
            const isTimeslotSelected = formattedDate == timeslot.formattedDate;
            if (!isTimeslotSelected) {
              const disabledTimeslot = {
                formattedDate,
                startDate,
                endDate,
              };
              disabledTimeslots.push(disabledTimeslot);
            }
          }
        }
        return disabledTimeslots;
      },
    },
    currentUserTimezone: {
      get(): string {
        const currentUserTimezone = dayjs.tz.guess();
        return currentUserTimezone;
      },
    },
    reserveCount: {
      get(): number {
        const reserveCount = this.appointmentAmount - this.selectedTimeslots.length;
        return reserveCount;
      },
    },
    calendarFocusDateModel: {
      get(): string {
        if (this.calendarFocusDate) {
          return this.calendarFocusDate;
        } else if (this.events.length > 0) {
          return this.events[0].formattedStartDate;
        } else {
          return '';
        }
      },
      set(date: string) {
        this.calendarFocusDate = date;
      },
    },
    visibleTimeslots: {
      get(): Timeslot[] {
        const currentDayAvailableTimes = this.events.filter((availableTime) => {
          return availableTime.formattedStartDate == this.calendarFocusDateModel;
        });
        const visibleTimeslots = [];
        const self = this as any;
        for (const availableTime of currentDayAvailableTimes) {
          let startDate = dayjs(availableTime.startDate);
          const endDate = dayjs(availableTime.endDate).subtract(this.duration, 'minutes');
          const now = dayjs();
          const isPast = startDate.isBefore(now);
          while ((startDate.isBefore(endDate) || startDate.isSame(endDate)) && !isPast) {
            const formattedDate = self.formatDate({
              date: startDate.toDate(),
              dateFormat: self.DATE_FORMAT.HOUR,
            });
            const visibleTimeSlot = {
              formattedDate,
              startDate: startDate.toDate(),
              endDate: startDate.add(this.duration, 'minutes').toDate(),
            };
            visibleTimeslots.push(visibleTimeSlot);
            startDate = startDate.add(30, 'minutes');
          }
        }
        return visibleTimeslots;
      },
    },
  },
  watch: {
    duration: function () {
      this.selectedTimeslots = [];
    },
  },
  created() {
    const self = this as any;
    this.intervalTimerId = setInterval(() => {
      self.setCurrentTime();
    }, 1 * 10 * 1000);
    this.setCurrentTime();
  },
  destroyed() {
    clearInterval(this.intervalTimerId);
  },
  methods: {
    async getAvailableTimes(month: string): Promise<void> {
      const startMonth = dayjs(month, MONTH_FORMAT);
      const { data } = await availableTimeRepository.get({
        path: `/users/${this.hostedById}/availableTimes`,
        query: {
          startDate: startMonth.toString(),
          endDate: startMonth.add(40, 'days').toString(),
        },
        isAbsolutePath: true,
      });
      const { availableTimes } = data;
      for (const availableTime of availableTimes as AvailableTimeDoc[]) {
        const isExistingEvent = this.events.some((event) => {
          return event._id == availableTime._id;
        });
        const { startDate, endDate } = availableTime;
        const now = dayjs();
        const isPast = dayjs(startDate).isBefore(now);
        const isSameDay = dayjs(startDate).isSame(now, 'day');
        if (!isExistingEvent && !isPast && !isSameDay) {
          const event = {
            ...availableTime,
            formattedStartDate: dayjs(startDate).format(DAY_FORMAT),
            formattedEndDate: dayjs(endDate).format(DAY_FORMAT),
          };
          this.events.push(event);
        }
      }
      const newFocusDate = this.events.find((availableTime) => {
        return dayjs(availableTime.startDate).isAfter(startMonth);
      });
      this.calendarFocusDateModel = newFocusDate ? newFocusDate.formattedStartDate : '';
    },
    isAllowedDate(date: string): boolean {
      const isAllowedDate = this.events.some((availableTime) => {
        return availableTime.formattedStartDate == date;
      });
      return isAllowedDate;
    },
    setCurrentTime(): void {
      const self = this as any;
      this.now = self.formatDate({
        date: new Date(),
        dateFormat: self.DATE_FORMAT.HOUR,
      });
    },
    isTimeslotSelected(timeslot: Timeslot): boolean {
      const isTimeslotSelected = this.selectedTimeslots.some((ts) => {
        return ts.startDate.toISOString() == timeslot.startDate.toISOString();
      });
      return isTimeslotSelected;
    },
    onTimeslotClick(timeslot: Timeslot): void {
      const startDateKey = timeslot.startDate.toISOString();
      const isSelected = this.isTimeslotSelected(timeslot);
      if (!isSelected && this.reserveCount > 0) {
        this.selectedTimeslots.push(timeslot);
      } else {
        this.selectedTimeslots = this.selectedTimeslots.filter((ts) => {
          return ts.startDate.toISOString() != startDateKey;
        });
      }
    },
    formatTimeslotDate(date: Date): string {
      const self = this as any;
      const formattedDate = self.formatDate({
        date: date,
        dateFormat: self.DATE_FORMAT.HOUR,
      });
      return formattedDate;
    },
    isTimeslotDisabled(timeslot: Timeslot): boolean {
      const isTimeslotDisabled = this.disabledTimeslots.some((ts) => {
        return ts.formattedDate == timeslot.formattedDate;
      });
      return isTimeslotDisabled;
    },
  },
});
</script>
