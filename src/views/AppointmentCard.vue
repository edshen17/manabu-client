<template>
  <two-card-layout v-if="appointmentData">
    <template v-slot:left-cards>
      <div
        class="border-solid border-l-4"
        :class="{
          'border-green-300 ': appointmentData.status == 'pending',
          'border-black': appointmentData.status == 'completed',
          'border-green-600': appointmentData.status == 'confirmed',
          'border-red-300': appointmentData.status == 'cancelled',
        }"
      >
        <left-card-layout class="rounded-l-none">
          <div v-if="appointmentData" class="px-4 py-3 flex flex-col">
            <div class="flex">
              <div class="flex flex-col">
                <p class="text-lg">
                  {{
                    formatDate({
                      date: appointmentData.startDate,
                      dateFormat: DATE_FORMAT.FULL_DATE,
                    })
                  }}
                </p>
                <p class="text-3xl py-1">
                  {{
                    formatDate({
                      date: appointmentData.startDate,
                      dateFormat: DATE_FORMAT.HOUR,
                    })
                  }}
                  /
                  {{
                    formatDate({
                      date: appointmentData.endDate,
                      dateFormat: DATE_FORMAT.HOUR,
                    })
                  }}
                </p>
              </div>
              <p>{{ getPackageName(appointmentData.packageTransactionData.packageData) }}</p>
            </div>
            <div class="flex py-4">
              <router-link
                :to="{ name: 'UserProfile', params: { userId: appointmentData.hostedById } }"
              >
                <img
                  :src="appointmentData.hostedByData.profileImageUrl"
                  class="rounded-full h-12"
                />
              </router-link>
              <div class="flex flex-col px-2 text-sm">
                <p class="text-lg">{{ appointmentData.hostedByData.name }}</p>
                <p class="text-gray-400 uppercase tracking-wide">
                  {{ $t(`userProfile.teacher.${appointmentData.hostedByData.teacherData.type}`) }}
                </p>
              </div>
              <p></p>
            </div>
            <div class="flex py-4">
              <div class="flex flex-col">
                <p class="text-gray-400 text-sm uppercase">language</p>
                <p>japanese</p>
              </div>
              <div class="flex flex-col">
                <p class="text-gray-400 text-sm uppercase">duration</p>
                <p>
                  {{
                    $t('calendar.duration', {
                      duration: appointmentData.packageTransactionData.lessonDuration,
                    })
                  }}
                </p>
              </div>
              <div class="flex flex-col">
                <p class="text-gray-400 text-sm uppercase">appointment id</p>
                <p>{{ $route.params.appointmentId }}</p>
              </div>
            </div>
            <div class="flex flex-col">
              <p>Communication Tool</p>
              <div class="flex">
                <div>skype</div>
                <div class="flex flex-col">
                  <p>Teacher account</p>
                  <p>id</p>
                </div>
                <div class="flex flex-col">
                  <p>student account</p>
                  <p>id</p>
                </div>
              </div>
            </div>
          </div>
        </left-card-layout>
      </div>
    </template>
  </two-card-layout>
</template>

<script lang="ts">
import LeftCardLayout from '@/components/UserProfile/Layouts/LeftCardLayout.vue';
import TwoCardLayout from '@/components/UserProfile/Layouts/TwoCardLayout.vue';
import { makeDateMixin } from '@/mixins/date';
import { makePackageMixin } from '@/mixins/package';
import { makeAppointmentRepository } from '@/repositories/appointment';
import Vue from 'vue';
const appointmentRepository = makeAppointmentRepository;

export default Vue.extend({
  name: 'AppointmentCard',
  components: {
    TwoCardLayout,
    LeftCardLayout,
  },
  mixins: [makeDateMixin, makePackageMixin],
  props: {
    appointment: {
      type: Object,
      default: () => ({}),
      required: false,
    },
  },
  data() {
    return {};
  },
  asyncComputed: {
    appointmentData: {
      async get(): Promise<any> {
        const appointmentData = this.appointment._id
          ? this.appointment
          : await this.getAppointment();
        return appointmentData;
      },
    },
  },
  mounted() {
    return;
  },
  methods: {
    async getAppointment() {
      const appointmentId = this.$route.params.appointmentId;
      const getAppointmentRes = await appointmentRepository.getById({
        _id: appointmentId,
        query: {},
      });
      const { data } = getAppointmentRes;
      const { appointment } = data;
      return appointment;
    },
  },
});
</script>
