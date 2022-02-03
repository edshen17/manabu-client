<template>
  <div>
    <vue-topprogress ref="topProgress"></vue-topprogress>
    <two-card-layout v-if="appointmentData" right-card-class="max-h-36">
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
                  <img :src="userEdgeData.profileImageUrl" class="rounded-full h-12" />
                </router-link>
                <div class="flex flex-col px-2 text-sm">
                  <p class="text-lg">{{ userEdgeData.name }}</p>
                  <p class="text-gray-400 uppercase tracking-wide">
                    {{ userEdgeData.role }}
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
      <template v-slot:right-cards>
        <div class="flex flex-col m-5 space-y-5">
          <button
            v-if="!isTeacher"
            class="rounded-lg text-white py-2 text-center"
            :class="{
              'bg-gray-200 ': isAppointmentCancelled,
              'bg-indigo-500': !isAppointmentCancelled,
            }"
            :disabled="isAppointmentCancelled"
            @click="
              $router.push({
                name: 'ExtendedAppointmentCalendar',
                params: {
                  packageTransaction: appointmentData.packageTransactionData,
                  userId: appointmentData.hostedById,
                  packageTransactionId: appointmentData.packageTransactionData._id,
                  reschedulingAppointment: appointmentData,
                },
              })
            "
          >
            {{ $t('button.appointment.reschedule') }}
          </button>
          <button
            v-else
            class="rounded-lg text-white py-2 text-center"
            :class="{
              'bg-gray-200 ': isAppointmentConfirmed || isAppointmentCancelled,
              'bg-green-700': !isAppointmentConfirmed && !isAppointmentCancelled,
            }"
            :disabled="isAppointmentConfirmed || isAppointmentCancelled"
            @click="confirmAppointment"
          >
            {{ $t('button.common.confirm') }}
          </button>
          <button
            class="rounded-lg text-white py-2 text-center"
            :class="{
              'bg-gray-200 ': isAppointmentCancelled,
              'bg-gray-700': !isAppointmentCancelled,
            }"
            :disabled="isAppointmentCancelled"
            @click="cancelAppointment"
          >
            {{ $t('button.common.cancel') }}
          </button>
        </div>
      </template>
    </two-card-layout>
  </div>
</template>

<script lang="ts">
import LeftCardLayout from '@/components/UserProfile/Layouts/LeftCardLayout.vue';
import TwoCardLayout from '@/components/UserProfile/Layouts/TwoCardLayout.vue';
import { makeDateMixin } from '@/mixins/date';
import { makePackageMixin } from '@/mixins/package';
import { makeAppointmentRepository } from '@/repositories/appointment';
import { AppointmentDoc } from '@server/models/Appointment';
import { StringKeyObject } from '@server/types/custom';
import Vue from 'vue';
import { TranslateResult } from 'vue-i18n';
import { vueTopprogress } from 'vue-top-progress';
import { mapGetters } from 'vuex';
const appointmentRepository = makeAppointmentRepository;

export default Vue.extend({
  name: 'AppointmentCard',
  components: {
    TwoCardLayout,
    LeftCardLayout,
    vueTopprogress,
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
    return {
      appointmentModel: {} as StringKeyObject,
    };
  },
  asyncComputed: {
    appointmentData: {
      async get(): Promise<any> {
        let appointmentData;
        if (this.appointmentModel._id) {
          appointmentData = this.appointmentModel;
        } else if (this.appointment._id) {
          appointmentData = this.appointment;
        } else {
          this.appointmentModel = await this.getAppointment();
          appointmentData = this.appointmentModel;
        }
        return appointmentData;
      },
    },
  },
  computed: {
    ...mapGetters({
      userData: 'user/entityStateData',
      isTeacher: 'user/isTeacher',
    }),
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
              title: this.$t('onboarding.package.lessonDuration'),
              text: this.$t('appointment.lessonDuration', {
                lessonDuration: self.appointmentData.packageTransactionData.lessonDuration,
              }),
            },
            {
              title: this.teacherAccount,
              text: self.appointmentData.locationData.hostedByContactMethod.address,
            },
          ],
          [
            {
              title: this.$t(`appointment.status.title`),
              text: this.$t(`appointment.status.${self.appointmentData.status}`),
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
    userEdgeData: {
      get(): { name: string; role: TranslateResult; profileImageUrl: string } {
        const self = this as any;
        const isHostedBy = this.userData._id == self.appointmentData.hostedById;
        const { hostedByData, reservedByData } = self.appointmentData;
        const userEdgeData = isHostedBy
          ? {
              name: reservedByData.name,
              role: this.$t('userProfile.role.user'),
              profileImageUrl: reservedByData.profileImageUrl,
            }
          : {
              name: hostedByData.name,
              role: this.$t(`userProfile.teacher.${hostedByData.teacherData.type}`),
              profileImageUrl: hostedByData.profileImageUrl,
            };
        return userEdgeData;
      },
    },
    isAppointmentCancelled: {
      get(): boolean {
        const self = this as any;
        const isAppointmentCancelled = self.appointmentData.status == 'cancelled';
        return isAppointmentCancelled;
      },
    },
    isAppointmentConfirmed: {
      get(): boolean {
        const self = this as any;
        const isAppointmentConfirmed = self.appointmentData.status == 'confirmed';
        return isAppointmentConfirmed;
      },
    },
  },
  mounted() {
    return;
  },
  methods: {
    async getAppointment(): Promise<AppointmentDoc> {
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
    async cancelAppointment(): Promise<void> {
      await this.updateAppointment('cancelled');
    },
    async confirmAppointment(): Promise<void> {
      await this.updateAppointment('confirmed');
    },
    async updateAppointment(status: string): Promise<void> {
      const self = this as any;
      self.$refs.topProgress.start();
      const appointment = await this.$store.dispatch('appointment/updateAppointment', {
        appointmentId: self.appointmentData._id,
        updateParams: {
          status: status,
        },
      });
      this.appointmentModel = appointment;
      self.$refs.topProgress.done();
    },
  },
});
</script>
