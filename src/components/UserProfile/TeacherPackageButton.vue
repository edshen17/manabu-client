<template>
  <dialog-button @click="$emit('click', pkg)">
    <template v-slot:title>
      <p class="text-lg capitalize" :style="{ color: getRandomColor(pkg.name) }">
        {{ getPackageTitle(pkg) }}
      </p>
    </template>
    <template v-slot:body>
      <p class="mt-2 text-gray-600">{{ getPackageDescription(pkg) }}</p>
      <price-pill v-show="showPrice" :price="packagePrice || ''" />
    </template>
  </dialog-button>
</template>

<script lang="ts">
import Vue from 'vue';
import { TranslateResult } from 'vue-i18n';
import { PackageDoc } from '../../../../server/models/Package';
import { makeExchangeRateMixin } from '../../mixins/exchangeRate';
import randomColor from 'randomcolor';
import DialogButton from './DialogButton.vue';
import PricePill from './PricePill.vue';

export default Vue.extend({
  name: 'TeacherPackageButton',
  components: { DialogButton, PricePill },
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
  asyncComputed: {
    packagePrice: {
      async get() {
        const { formattedTotal } = await (this as any).getPackagePriceData({
          teacher: this.teacher,
          pkg: this.pkg,
          lessonDuration: 60,
        });
        return formattedTotal;
      },
    },
  },
  mounted() {
    return;
  },
  methods: {
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
