<template>
  <div class="rounded-lg shadow-md mt-5 h-auto pb-2 bg-white" data-app>
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
            <div class="flex static">
              <h5 class="flex-1 text-center capitalize">{{ stepTitle }}</h5>
              <div class="absolute mx-4 md:mx-10">
                <i class="fas fa-times cursor-pointer" @click="onCloseDialog"></i>
              </div>
            </div>
          </div>
          <div class="mt-5 mb-3">
            <progress-bar :step-index="stepIndex" :step-total="4" />
          </div>
          <div v-show="stepIndex == 0" class="flex h-full mt-3 md:mt-7">
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
          <div
            v-show="stepIndex == 1"
            class="flex h-full bg-white mt-3 md:mt-7 mx-4 justify-center"
          >
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
            :hosted-by-data="teacher"
            :duration="selectedLessonDuration"
          />
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { PackageDoc } from '../../../../server/models/Package';
import { makeExchangeRateMixin } from '../../mixins/exchangeRate';
import { mapGetters } from 'vuex';
import ProgressBar from '../ProgressBar/ProgressBar.vue';
import TeacherPackageButton from './TeacherPackageButton.vue';
import AppointmentCalendar from '../../views/AppointmentCalendar.vue';
import { EventBus } from '../EventBus/EventBus';
import { TranslateResult } from 'vue-i18n';
import LessonDurationButton from './LessonDurationButton.vue';

export default Vue.extend({
  name: 'TeacherPackagesCard',
  components: { ProgressBar, TeacherPackageButton, AppointmentCalendar, LessonDurationButton },
  mixins: [makeExchangeRateMixin],
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
      selectedPackage: null as any,
      selectedLessonDuration: 60,
    };
  },
  computed: {
    ...mapGetters({
      currency: 'user/currency',
    }),
    dialogButtonClass: {
      get(): string {
        const dialogButtonClass = 'w-11/12 md:w-4/12 mx-auto';
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
      get(): TranslateResult {
        const stepTitles = [
          this.$t('userProfile.teacher.lessonSelection.choose'),
          this.$t('userProfile.teacher.lessonSelection.options'),
          this.$t('userProfile.teacher.lessonSelection.times'),
        ];
        return stepTitles[this.stepIndex];
      },
    },
  },
  mounted() {
    EventBus.$on('step-backward', this.handleStepBackward());
  },
  methods: {
    onPackageClick(pkg: PackageDoc): void {
      this.showDialog = true;
      this.stepIndex = 1;
      this.selectedPackage = pkg;
    },
    onLessonDurationClick(lessonDuration: number): void {
      this.stepIndex++;
      this.selectedLessonDuration = lessonDuration;
    },
    onCloseDialog(): void {
      this.selectedPackage = null;
      this.stepIndex = 0;
      this.showDialog = false;
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
