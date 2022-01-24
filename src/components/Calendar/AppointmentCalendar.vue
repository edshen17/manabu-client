<template>
  <div class="flex justify-center items-center h-auto">
    <div class="w-full md:w-8/12 lg:rounded-lg h-full">
      <div class="flex flex-wrap lg:flex-nowrap h-full">
        <div class="lg:w-4/12">
          <p>Lesson Details</p>
          <p>Light Plan / {{ duration }} mins</p>
          <p>{{ lessonAmount }} Lessons left to reserve</p>
        </div>
        <div class="lg:w-4/12">
          <v-date-picker
            v-model="calendarFocusDateModel"
            :locale="locale"
            :full-width="true"
            :events="colorDate"
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
                'bg-indigo-500 text-white': selectedTimeslots.includes(
                  timeslot.startDate.toISOString()
                ),
              }"
              @click="onTimeslotClick(timeslot)"
            >
              {{ timeslot.formattedTime }}
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
dayjs.extend(utc);
dayjs.extend(timezone);
const availableTimeRepository = makeAvailableTimeRepository;
const DAY_FORMAT = 'YYYY-MM-DD';
const MONTH_FORMAT = 'YYYY-MM';
export default Vue.extend({
  name: 'AppointmentCalendar',
  components: {},
  mixins: [makeCalendarMixin],
  props: {
    hostedByData: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    duration: {
      type: Number,
      required: false,
      default: 60,
    },
    pkg: {
      type: Object,
      required: true,
      default: () => ({}),
    },
    packageTransaction: {
      type: Object,
      required: false,
      default: () => ({}),
    },
  },
  data() {
    return {
      calendarFocusDate: '',
      events: [] as StringKeyObject[],
      intervalTimerId: 0 as any,
      now: '',
      selectedTimeslots: [] as string[],
      arrayEvents: [] as any,
    };
  },
  computed: {
    ...mapGetters({
      locale: 'user/locale',
    }),
    selectedDays: {
      get(): string[] {
        const selectedDays = this.selectedTimeslots.map((startDateKey) => {
          return dayjs(startDateKey).format(DAY_FORMAT);
        });
        return selectedDays;
      },
    },
    hostedById: {
      get(): string {
        const hostedById = this.$route.params.userId || this.hostedByData._id;
        return hostedById;
      },
    },
    currentUserTimezone: {
      get(): string {
        const currentUserTimezone = dayjs.tz.guess();
        return currentUserTimezone;
      },
    },
    appointmentDuration: {
      get(): number {
        const queryDuration = this.$route.query.duration as string;
        const isValidQueryDuration = this.isValidDuration(queryDuration);
        const appointmentDuration = isValidQueryDuration ? parseInt(queryDuration) : this.duration;
        return appointmentDuration;
      },
    },
    lessonAmount: {
      get(): number {
        const remainingAppointments = this.packageTransaction.remainingAppointments;
        const packageAmount = this.pkg.lessonAmount;
        const lessonAmount =
          (remainingAppointments ? remainingAppointments : packageAmount) -
          this.selectedTimeslots.length;
        return lessonAmount;
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
      get(): StringKeyObject[] {
        const currentDayAvailableTimes = this.events.filter((availableTime) => {
          return availableTime.formattedStartDate == this.calendarFocusDateModel;
        });
        const visibleTimeslots = [];
        const self = this as any;
        for (const availableTime of currentDayAvailableTimes) {
          let startDate = dayjs(availableTime.startDate);
          const endDate = dayjs(availableTime.endDate).subtract(
            this.appointmentDuration,
            'minutes'
          );
          const now = dayjs();
          const isPast = startDate.isBefore(now);
          while ((startDate.isBefore(endDate) || startDate.isSame(endDate)) && !isPast) {
            const formattedTime = self.formatDate({
              date: startDate.toDate(),
              dateFormat: self.DATE_FORMAT.HOUR,
            });
            const visibleTimeSlot = {
              formattedTime,
              startDate: startDate.toDate(),
              endDate: startDate.add(this.appointmentDuration, 'minutes'),
            };
            visibleTimeslots.push(visibleTimeSlot);
            startDate = startDate.add(30, 'minutes');
          }
        }
        return visibleTimeslots;
      },
    },
  },
  created() {
    const self = this as any;
    this.intervalTimerId = setInterval(() => {
      self.setCurrentTime();
    }, 1 * 10 * 1000);
  },
  mounted() {
    this.setCurrentTime();
    this.arrayEvents = [...Array(6)].map(() => {
      const day = Math.floor(Math.random() * 30);
      const d = new Date();
      d.setDate(day);
      return d.toISOString().substr(0, 10);
    });
  },
  destroyed() {
    clearInterval(this.intervalTimerId);
  },
  methods: {
    colorDate(date: string): string[] | boolean {
      const returnType = this.selectedDays.includes(date) ? ['bg-pink-500'] : false;
      return returnType;
    },
    async getAvailableTimes(month: string): Promise<void> {
      const startMonth = dayjs(month, MONTH_FORMAT);
      const { data } = await availableTimeRepository.get({
        path: `/users/${this.hostedById}/availableTimes`,
        query: {
          startDate: startMonth.toString(),
          endDate: startMonth.add(startMonth.daysInMonth() - 1, 'days').toString(),
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
      })!;
      this.calendarFocusDateModel = newFocusDate.formattedStartDate;
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
    isValidDuration(duration: string): boolean {
      const validDurations = [30, 60, 90];
      const isValidDuration = validDurations.includes(parseInt(duration));
      return isValidDuration;
    },
    onTimeslotClick(timeslot: StringKeyObject): void {
      const startDateKey = timeslot.startDate.toISOString();
      const isSelected = this.selectedTimeslots.some((ts) => {
        return ts == startDateKey;
      });
      if (!isSelected && this.lessonAmount > 0) {
        this.selectedTimeslots.push(startDateKey);
      } else {
        this.selectedTimeslots = this.selectedTimeslots.filter((ts) => {
          return ts != startDateKey;
        });
      }
    },
  },
});
</script>
