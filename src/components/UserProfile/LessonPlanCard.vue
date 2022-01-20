<template>
  <div class="rounded-lg shadow-md mt-5 h-auto pb-2 bg-white">
    <p class="justify-center p-6 mx-auto text-2xl">{{ $t('userProfile.teacher.lessonPlans') }}</p>
    <div v-for="pkg in visiblePackages" :key="pkg._id" class="px-6 mx-auto">
      <button class="border-solid border-2 rounded-md mb-5 hover:bg-gray-100">
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

export default Vue.extend({
  name: 'LessonPlanCard',
  components: {},
  mixins: [makeExchangeRateMixin],
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {};
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
