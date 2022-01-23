<template>
  <button
    class="border-solid border-2 rounded-md mb-5 hover:bg-gray-100 w-full"
    @click="$emit('click', pkg)"
  >
    <div class="m-4 text-left">
      <p class="text-lg capitalize" :style="{ color: getRandomColor(pkg.name) }">
        {{ getPackageTitle(pkg) }}
      </p>
      <p class="mt-2 text-gray-600">{{ getPackageDescription(pkg) }}</p>
      <div
        v-if="exchangeRates && exchangeRates.SGD && showPrice"
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

<script lang="ts">
import Vue from 'vue';
import { TranslateResult } from 'vue-i18n';
import { PackageDoc } from '../../../../server/models/Package';
import { makeExchangeRateMixin } from '../../mixins/exchangeRate';
import randomColor from 'randomcolor';
import { mapGetters } from 'vuex';

export default Vue.extend({
  name: 'TeacherPackageButton',
  components: {},
  mixins: [makeExchangeRateMixin],
  props: {
    teacher: {
      type: Object,
      required: true,
    },
    pkg: {
      type: Object,
      required: true,
    },
    showPrice: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      currency: 'user/currency',
    }),
  },
  mounted() {
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
