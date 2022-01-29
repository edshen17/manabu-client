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
          <div v-if="appointmentData" class="px-4 py-4 flex flex-col">
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
            <div class="grid grid-cols-1 md:grid-cols-3 gap-0">
              <div v-for="(column, i) in columnData" :key="i">
                <div v-for="(innerData, j) in columnData[i]" :key="j">
                  <div class="py-2 md:py-5">
                    <p class="text-gray-400 text-sm uppercase">
                      {{ innerData.title }}
                    </p>
                    <p>{{ innerData.text }}</p>
                  </div>
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
import { StringKeyObject } from '@server/types/custom';
import Vue from 'vue';
import { TranslateResult } from 'vue-i18n';
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
  computed: {
    columnData: {
      get(): StringKeyObject[] {
        const self = this as any;
        const columnData = [
          [
            {
              title: this.$t('appointment.language'),
              text: this.$t(
                `localeCode.${self.appointmentData.packageTransactionData.lessonLanguage}`
              ),
            },
            {
              title: this.$t('appointment.commTool'),
              text: this.$t(`contactMethod.${self.appointmentData.locationData.name}`),
            },
          ],
          [
            {
              title: this.$t('appointment.lessonDuration'),
              text: this.$t('calendar.duration', {
                duration: self.appointmentData.packageTransactionData.lessonDuration,
              }),
            },
            {
              title: this.teacherAccount,
              text: self.appointmentData.locationData.hostedByContactMethod.address,
            },
          ],
          [
            {
              title: this.$t('appointment.id'),
              text: this.$route.params.appointmentId,
            },
            {
              title: this.studentAccount,
              text: self.appointmentData.locationData.reservedByContactMethod.address,
            },
          ],
        ];
        return columnData;
      },
    },
    teacherAccount: {
      get(): TranslateResult {
        const teacherAccount = this.getAccountId(true);
        return teacherAccount;
      },
    },
    studentAccount: {
      get(): TranslateResult {
        const studentAccount = this.getAccountId(false);
        return studentAccount;
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
    getAccountId(isHostedBy: boolean): TranslateResult {
      const self = this as any;
      const locationData = self.appointmentData.locationData;
      const isAlternate = locationData.name && locationData.name == 'alternative';
      const contactMethod = isHostedBy
        ? locationData.hostedByContactMethod
        : locationData.reservedByContactMethod;
      const accountTitle = isHostedBy
        ? this.$t('appointment.teacherAccount')
        : this.$t('appointment.studentAccount');
      const studentAccount = isAlternate
        ? `${accountTitle} (${this.$t(`contactMethod.${contactMethod.name}`)})`
        : accountTitle;
      return studentAccount;
    },
  },
});
</script>
