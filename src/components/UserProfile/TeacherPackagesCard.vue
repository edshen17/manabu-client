<template>
  <left-card-layout data-app>
    <p class="justify-center p-6 mx-auto text-2xl">{{ $t('userProfile.teacher.lessonPlans') }}</p>
    <div v-for="pkg in visiblePackages" :key="pkg._id" class="px-6 mx-auto">
      <teacher-package-button :pkg="pkg" :teacher="teacher" @click="onPackageClick" />
    </div>
    <v-dialog
      v-model="showDialog"
      persistent
      :retain-focus="false"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
      class="h-auto"
    >
      <v-card>
        <div class="flex flex-col h-auto">
          <div class="py-8 md:py-6 text-2xl font-bold border-b-2 border-gray-200">
            <div v-show="isMobile" class="flex items-center w-full">
              <button class="mx-6">
                <i class="fas fa-times cursor-pointer" @click="onCloseDialog"></i>
              </button>
              <h5 class="capitalize">{{ stepTitle }}</h5>
            </div>
            <div v-show="!isMobile" class="flex">
              <h5 class="flex-1 text-center capitalize">{{ stepTitle }}</h5>
              <button class="absolute mx-6 md:mx-10">
                <i class="fas fa-times cursor-pointer" @click="onCloseDialog"></i>
              </button>
            </div>
          </div>
          <div class="mt-5 mb-3">
            <progress-bar :step-index="stepIndex" :step-total="4" />
          </div>
          <div class="mt-3 md:mt-7">
            <div v-show="stepIndex == 0" class="flex h-full">
              <div class="mb-4 justify-center items-center mx-auto">
                <div
                  v-for="dialogPkg in visiblePackages"
                  :key="dialogPkg._id"
                  :class="dialogButtonClass"
                >
                  <teacher-package-button
                    :pkg="dialogPkg"
                    :teacher="teacher"
                    :show-price="false"
                    @click="onPackageClick"
                  />
                </div>
              </div>
            </div>
            <div v-show="stepIndex == 1" class="flex h-full mx-4 justify-center">
              <div :class="dialogButtonClass">
                <lesson-duration-button
                  v-for="lessonDuration in lessonDurations"
                  :key="lessonDuration"
                  :pkg="selectedPackage"
                  :teacher="teacher"
                  :lesson-duration="lessonDuration"
                  @click="onLessonDurationClick"
                />
              </div>
            </div>
            <appointment-calendar
              v-show="stepIndex == 2"
              :hosted-by-id="teacher._id"
              :duration="selectedLessonDuration"
              :pkg="selectedPackage"
              :appointment-amount="selectedPackage.lessonAmount || 0"
              @submit-timeslots="onSubmitTimeslots"
            />
            <payment-card
              v-show="stepIndex == 3"
              :teacher="teacher"
              :timeslots="selectedTimeslots"
              :duration="selectedLessonDuration"
              :pkg="selectedPackage"
            />
          </div>
        </div>
      </v-card>
    </v-dialog>
  </left-card-layout>
</template>

<script lang="ts">
import Vue from 'vue';
import { PackageDoc } from '../../../../server/models/Package';
import { mapGetters } from 'vuex';
import ProgressBar from '../ProgressBar/ProgressBar.vue';
import TeacherPackageButton from './TeacherPackageButton.vue';
import AppointmentCalendar from '../Calendar/AppointmentCalendar.vue';
import { EventBus } from '../EventBus/EventBus';
import { TranslateResult } from 'vue-i18n';
import LessonDurationButton from './LessonDurationButton.vue';
import { StringKeyObject } from '../../../../server/types/custom';
import PaymentCard from './PaymentCard.vue';
import { ls } from '@/store/plugins';
import LeftCardLayout from './Layouts/LeftCardLayout.vue';

export default Vue.extend({
  name: 'TeacherPackagesCard',
  components: {
    ProgressBar,
    TeacherPackageButton,
    AppointmentCalendar,
    LessonDurationButton,
    PaymentCard,
    LeftCardLayout,
  },
  props: {
    teacher: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      showDialog: false,
      stepIndex: 0,
      selectedPackage: {} as StringKeyObject,
      selectedLessonDuration: 60,
      selectedTimeslots: [] as string[],
      selectedPackagePrice: 0,
    };
  },
  computed: {
    ...mapGetters({
      currency: 'user/currency',
    }),
    dialogButtonClass: {
      get(): string {
        const dialogButtonClass = 'w-11/12 md:w-6/12 lg:w-4/12 mx-auto';
        return dialogButtonClass;
      },
    },
    visiblePackages: {
      get(): PackageDoc[] {
        const visiblePackages = this.teacher.teacherData.packages.filter((pkg: PackageDoc) => {
          return pkg.isOffering;
        });
        return visiblePackages;
      },
    },
    lessonDurations: {
      get(): number[] {
        const lessonDurations = this.selectedPackage ? this.selectedPackage.lessonDurations : [];
        return lessonDurations;
      },
    },
    stepTitle: {
      get(): TranslateResult | string {
        const stepTitles = [
          this.$t('userProfile.teacher.lessonSelection.choose'),
          this.$t('userProfile.teacher.lessonSelection.options'),
          this.$t('userProfile.teacher.lessonSelection.times'),
          'Payment',
        ];
        return stepTitles[this.stepIndex];
      },
    },
  },
  created() {
    EventBus.$on('step-backward', this.handleStepBackward());
    const paymentData = ls.get('paymentData');
    if (paymentData) {
      const { timeslots, duration, pkg } = paymentData;
      this.selectedPackage = timeslots;
      this.selectedLessonDuration = duration;
      this.selectedPackage = pkg;
      this.stepIndex = 3;
      this.showDialog = true;
    }
    return;
  },
  methods: {
    onSubmitTimeslots(timeslots: string[]): void {
      this.selectedTimeslots = timeslots;
      this.stepIndex++;
    },
    onPackageClick(pkg: PackageDoc): void {
      this.showDialog = true;
      this.stepIndex = 1;
      this.selectedPackage = pkg;
    },
    onLessonDurationClick(lessonDurationObj: StringKeyObject): void {
      const { lessonDuration, packagePrice } = lessonDurationObj;
      this.stepIndex++;
      this.selectedLessonDuration = lessonDuration;
      this.selectedPackagePrice = packagePrice;
    },
    onCloseDialog(): void {
      this.selectedPackage = {};
      this.stepIndex = 0;
      this.showDialog = false;
      ls.remove('paymentData');
    },
    handleStepBackward(): () => void {
      const self = this;
      return function () {
        self.stepIndex--;
      };
    },
  },
});
</script>
