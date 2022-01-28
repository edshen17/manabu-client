<template>
  <div>
    <button
      v-for="appointment in visibleAppointments"
      :key="appointment._id"
      class="shadow-md rounded-lg bg-white mb-4 h-auto w-full hover:bg-gray-100 text-left"
    >
      <div
        class="border-l-4 w-full h-full rounded-sm px-4 pt-3 pb-5 border-solid"
        :class="{
          'border-green-300 ': appointment.status == 'pending',
          'border-black': appointment.status == 'completed',
          'border-green-600': appointment.status == 'confirmed',
          'border-red-300': appointment.status == 'cancelled',
        }"
      >
        <p class="leading-relaxed uppercase text-gray-600 tracking-wide">
          {{ $t(`appointment.status.${appointment.status}`) }}
        </p>
        <div class="flex">
          <div class="flex flex-col flex-1">
            <div class="text-xl">
              {{ formatDate({ date: appointment.startDate, formatString: 'MMM D' }) }}
              <span v-if="locale != 'ja'">@</span>
              {{ formatDate({ date: appointment.startDate, dateFormat: DATE_FORMAT.HOUR }) }}
            </div>
            <p class="text-sm text-gray-400 py-1">
              {{ $t(`localeCode.${appointment.packageTransactionData.lessonLanguage}`) }} /
              {{
                $t('calendar.duration', {
                  duration: appointment.packageTransactionData.lessonDuration,
                })
              }}
            </p>
          </div>
          <img
            v-if="appointments[0]"
            :src="appointments[0].hostedByData.profileImageUrl"
            class="rounded-full h-12"
          />
        </div>
      </div>
    </button>
  </div>
</template>

<script lang="ts">
import { makeDateMixin } from '@/mixins/date';
import { AppointmentDoc } from '@server/models/Appointment';
import Vue from 'vue';
import { mapGetters } from 'vuex';

export default Vue.extend({
  name: 'AppointmentCards',
  components: {},
  mixins: [makeDateMixin],
  props: {
    // prop: {
    //   type: String,
    //   default: '',
    //   required: true,
    // },
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      appointments: 'appointment/entityStateData',
      locale: 'user/locale',
    }),
    visibleAppointments: {
      get(): AppointmentDoc[] {
        const visibleAppointments = this.appointments.slice(0, 3);
        return visibleAppointments;
      },
    },
  },
  async created() {
    await this.$store.dispatch('appointment/getEntityStateData');
  },
  methods: {},
});
</script>
