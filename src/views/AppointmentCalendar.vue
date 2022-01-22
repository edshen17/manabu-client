<template>
  <div class="flex justify-center items-center h-screen bg-gray-50">
    <div class="w-full md:w-8/12 md:rounded-lg h-full md:h-5/6 bg-white md:py-8">
      <div class="flex flex-wrap md:flex-nowrap h-full">
        <div class="md:w-4/12">
          <p>Lesson Details</p>
          <p>x Lessons left to reserve</p>
        </div>
        <div class="md:w-4/12">
          <v-date-picker
            v-model="calendarFocusDateModel"
            :locale="locale"
            :full-width="true"
            class="h-96"
            :allowed-dates="isAllowedDate"
            @update:picker-date="getAvailableTimes"
          ></v-date-picker>
          <div class="inline-flex items-center text-gray-600">
            <i class="fas fa-globe-americas"></i>
            <p class="my-3 mx-2">{{ currentUserTimezone }} ({{ now }})</p>
            <p></p>
          </div>
        </div>
        <div class="flex-grow overflow-y-auto no-scrollbar">
          <div class="flex flex-col justify-center items-center">
            <button
              v-for="timeslot in visibleTimeslots"
              :key="timeslot.startDate.toISOString()"
              class="border-solid border border-blue-400 rounded-md text-xl p-2 w-9/12 mb-3"
            >
              {{ timeslot.formattedTime }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import dayjs from 'dayjs';
import Vue from 'vue';
import { AvailableTimeDoc } from '../../../server/models/AvailableTime';
import { StringKeyObject } from '../../../server/types/custom';
import { makeCalendarMixin } from '../mixins/calendar';
import { makeAvailableTimeRepository } from '../repositories/availableTime';
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
  },
  data() {
    return {
      calendarFocusDate: '',
      events: [] as StringKeyObject[],
      intervalTimerId: 0 as any,
      now: '',
    };
  },
  computed: {
    ...mapGetters({
      locale: 'user/locale',
    }),
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
          while (startDate.isBefore(endDate) || startDate.isSame(endDate)) {
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
          endDate: startMonth.add(startMonth.daysInMonth() - 1, 'days').toString(),
        },
        isAbsolutePath: true,
      });
      const { availableTimes } = data;
      for (const availableTime of availableTimes as AvailableTimeDoc[]) {
        const isExistingEvent = this.events.some((event) => {
          return event._id == availableTime._id;
        });
        if (!isExistingEvent) {
          const { startDate, endDate } = availableTime;
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
  },
});
</script>
