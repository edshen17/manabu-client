<template>
  <div class="flex justify-center items-center h-screen bg-gray-50">
    <div class="w-full md:w-8/12 md:rounded-lg h-full md:h-5/6 bg-white">
      <div class="flex flex-wrap md:flex-nowrap h-full">
        <div class="w-4/12">
          <p>Lesson Details</p>
          <p>x Lessons left to reserve</p>
        </div>
        <v-date-picker
          v-model="calendarFocusDateModel"
          :full-width="true"
          class="w-96 h-96"
          :allowed-dates="isAllowedDate"
          @update:picker-date="getAvailableTimes"
          @change="test"
        ></v-date-picker>
        <div class="flex-grow m-2">
          <button class="border-solid border border-blue-400 rounded-md text-xl p-2 w-full">
            10:15am
          </button>
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
import { makeAvailableTimeRepository } from '../repositories/availableTime';
const availableTimeRepository = makeAvailableTimeRepository;
const DAY_FORMAT = 'YYYY-MM-DD';
const MONTH_FORMAT = 'YYYY-MM';

export default Vue.extend({
  name: 'ReservationCalendar',
  components: {},
  props: {
    user: {
      type: Object,
      required: false,
      default: () => ({}),
    },
  },
  data() {
    return {
      calendarFocusDate: '',
      events: [] as StringKeyObject[],
    };
  },
  computed: {
    userId: {
      get(): string {
        const userId = this.$route.params.userId || this.user._id;
        return userId;
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
  },
  mounted() {
    return;
  },
  methods: {
    async getAvailableTimes(month: string): Promise<void> {
      const startMonth = dayjs(month, MONTH_FORMAT);
      const { data } = await availableTimeRepository.get({
        path: `/users/${this.userId}/availableTimes`,
        query: {
          startDate: startMonth.toString(),
          endDate: startMonth.add(startMonth.daysInMonth() - 1, 'days').toString(),
        },
        isAbsolutePath: true,
      });
      const { availableTimes } = data;
      for (const availableTime of availableTimes as AvailableTimeDoc[]) {
        const { startDate, endDate } = availableTime;
        const event = {
          ...availableTime,
          formattedStartDate: dayjs(startDate).format(DAY_FORMAT),
          formattedEndDate: dayjs(endDate).format(DAY_FORMAT),
        };
        this.events.push(event);
      }
    },
    isAllowedDate(date: string): boolean {
      const isAllowedDate = this.events.some((availableTime) => {
        return availableTime.formattedStartDate == date;
      });
      return isAllowedDate;
    },
    test(t: any) {
      console.log('change', t);
    },
  },
});
</script>
