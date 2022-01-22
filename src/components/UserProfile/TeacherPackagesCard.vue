<template>
  <div class="rounded-lg shadow-md mt-5 h-auto pb-2 bg-white" data-app>
    <p class="justify-center p-6 mx-auto text-2xl">{{ $t('userProfile.teacher.lessonPlans') }}</p>
    <div v-for="pkg in visiblePackages" :key="pkg._id" class="px-6 mx-auto">
      <teacher-package-button
        :pkg="pkg"
        :teacher="teacher"
        :attrs="attrs"
        :on="on"
        @click="onPackageClick"
      />
      <v-dialog
        v-model="showDialog"
        persistent
        :retain-focus="false"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
      >
        <v-card>
          <div class="flex flex-col h-auto bg-white">
            <div class="py-8 md:py-6 text-2xl font-bold border-b-2 border-gray-200">
              <div class="flex static">
                <h5 class="flex-1 text-center">Choose your lesson plan</h5>
                <div class="absolute px-10">
                  <i class="fas fa-times cursor-pointer" @click="onCloseDialog"></i>
                </div>
              </div>
            </div>
            <div class="mt-5">
              <progress-bar :step-index="stepIndex" :step-total="4" />
            </div>
            <div v-show="stepIndex == 0" class="flex justify-center items-center h-full bg-white">
              <div>
                <div
                  v-for="dialogPkg in visiblePackages"
                  :key="dialogPkg._id"
                  class="w-2/6 mx-auto"
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
            <appointment-calendar
              v-show="stepIndex == 1"
              class="bg-white"
              :hosted-by-data="teacher"
            />
          </div>
        </v-card>
      </v-dialog>
    </div>
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

export default Vue.extend({
  name: 'TeacherPackagesCard',
  components: { ProgressBar, TeacherPackageButton, AppointmentCalendar },
  mixins: [makeExchangeRateMixin],
  props: {
    teacher: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      showDialog: true,
      stepIndex: 0,
      selectedPackage: null as any,
    };
  },
  computed: {
    ...mapGetters({
      currency: 'user/currency',
    }),
    visiblePackages: {
      get(): PackageDoc[] {
        const visiblePackages = this.teacher.teacherData.packages.filter((pkg: PackageDoc) => {
          return pkg.isOffering;
        });
        return visiblePackages;
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
