<template>
  <div class="rounded-lg shadow-md mt-5 h-auto pb-2 bg-white" data-app>
    <p class="justify-center p-6 mx-auto text-2xl">{{ $t('userProfile.teacher.lessonPlans') }}</p>
    <div v-for="pkg in visiblePackages" :key="pkg._id" class="px-6 mx-auto">
      <v-dialog
        v-model="showDialog"
        persistent
        :retain-focus="false"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
      >
        <template v-slot:activator="{ on, attrs }">
          <teacher-package-button :pkg="pkg" :teacher="teacher" :attrs="attrs" :on="on" />
        </template>
        <v-card>
          <div class="flex flex-col h-auto bg-white">
            <div class="py-8 md:py-6 text-2xl font-bold border-b-2 border-gray-200">
              <div class="flex static">
                <h5 class="flex-1 text-center">Choose your lesson plan</h5>
                <div class="absolute px-10">
                  <i class="fas fa-times cursor-pointer" @click="showDialog = false"></i>
                </div>
              </div>
            </div>
            <div class="mt-5">
              <progress-bar :step-index="stepIndex" :step-total="4" />
            </div>
            <div class="flex justify-center items-center h-full bg-white">
              <div>
                <div
                  v-for="dialogPkg in visiblePackages"
                  :key="dialogPkg._id"
                  class="w-2/6 mx-auto"
                >
                  <teacher-package-button :pkg="dialogPkg" :teacher="teacher" :show-price="false" />
                </div>
              </div>
            </div>
          </div>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { TranslateResult } from 'vue-i18n';
import { PackageDoc } from '../../../../server/models/Package';
import randomColor from 'randomcolor';
import { makeExchangeRateMixin } from '../../mixins/exchangeRate';
import { mapGetters } from 'vuex';
import ProgressBar from '../ProgressBar/ProgressBar.vue';
import TeacherPackageButton from './TeacherPackageButton.vue';

export default Vue.extend({
  name: 'TeacherPackagesCard',
  components: { ProgressBar, TeacherPackageButton },
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
      events: [],
      stepIndex: 0,
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
  async mounted() {
    return;
  },
  methods: {
    getPackagePrice(lessonAmount: number): number {
      const priceData = this.teacher.teacherData.priceData;
      const { hourlyRate, currency } = priceData;
      const convertedHourlyRate = (this as any).convert({
        amount: hourlyRate,
        sourceCurrency: currency,
        targetCurrency: this.currency,
        isRounding: true,
      });
      const packagePrice = convertedHourlyRate * lessonAmount;
      return packagePrice;
    },
    getPackageTitle(pkg: PackageDoc): TranslateResult | string {
      const packageTitle =
        pkg.type == 'default'
          ? this.$t(`userProfile.teacher.lessonTypes.${pkg.name}.title`)
          : pkg.name;
      return packageTitle;
    },
    getPackageDescription(pkg: PackageDoc): TranslateResult | string {
      const packageDescription =
        pkg.type == 'default'
          ? this.$t(`userProfile.teacher.lessonTypes.${pkg.name}.description`)
          : pkg.description! ||
            `With this plan, you will receive ${
              pkg.lessonAmount
            } personalized lessons, which is about ${Math.ceil(
              pkg.lessonAmount / 4
            )} lessons every week.`;
      return packageDescription;
    },
    getRandomColor(seed: string) {
      const color = randomColor({
        luminosity: 'dark',
        seed,
      });
      return color;
    },
  },
});
</script>
