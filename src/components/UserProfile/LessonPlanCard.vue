<template>
  <div class="rounded-lg shadow-md mt-5 h-auto pb-2 bg-white" data-app>
    <p class="justify-center p-6 mx-auto text-2xl">{{ $t('userProfile.teacher.lessonPlans') }}</p>
    <div v-for="pkg in visiblePackages" :key="pkg._id" class="px-6 mx-auto">
      <v-dialog v-model="showDialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        <template v-slot:activator="{ on, attrs }">
          <button
            class="border-solid border-2 rounded-md mb-5 hover:bg-gray-100"
            v-bind="attrs"
            v-on="on"
          >
            <div class="m-4 text-left">
              <p class="text-lg" :style="{ color: getRandomColor(pkg.name) }">
                {{ getPackageTitle(pkg) }}
              </p>
              <p class="mt-2 text-gray-600">{{ getPackageDescription(pkg) }}</p>
              <div
                v-if="exchangeRates && exchangeRates.SGD"
                class="
                  py-1
                  mt-3
                  w-24
                  shadow-md
                  bg-blue-400
                  no-underline
                  rounded-full
                  text-white
                  font-semibold
                  text-sm text-center
                "
              >
                ~{{ getPackagePrice(pkg.lessonAmount).toLocaleString() }}+ {{ currency }}
              </div>
            </div>
          </button>
        </template>
        <!-- <div class="bg-red-500 h-screen">
          <div class="h-20 flex text-2xl w-full justify-center items-center bg-white font-bold">
            <div>Choose your lesson plan</div>
          </div>
          <div class="flex justify-center items-center bg-green-500 flex-grow">sasa</div>
        </div> -->
        <div class="flex flex-col h-screen bg-white">
          <div class="py-8 md:py-6 text-2xl font-bold border-b-2 border-gray-200">
            <!-- <div class="flex">
              <p>Choose your lesson plan</p>
              <div class="float-right">sa</div>
            </div> -->
            <div class="flex static">
              <h5 class="flex-1 text-center">Choose your lesson plan</h5>
              <div class="absolute px-10">
                <i class="fas fa-times cursor-pointer" @click="showDialog = false"></i>
              </div>
            </div>
          </div>
          <div class="mt-5">
            <progress-bar :step-index="0" />
          </div>
          <div class="flex justify-center items-center flex-grow">sa</div>
        </div>
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

export default Vue.extend({
  name: 'LessonPlanCard',
  components: { ProgressBar },
  mixins: [makeExchangeRateMixin],
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      showDialog: false,
    };
  },
  computed: {
    ...mapGetters({
      currency: 'user/currency',
    }),
    visiblePackages: {
      get(): PackageDoc[] {
        const visiblePackages = this.user.teacherData.packages.filter((pkg: PackageDoc) => {
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
      const priceData = this.user.teacherData.priceData;
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
          : pkg.description!;
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
