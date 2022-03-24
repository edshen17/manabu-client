<template>
  <dialog-button @click="$emit('click', pkg)">
    <template #title>
      <div class="flex">
        <p class="text-lg capitalize flex-1" :style="{ color: getRandomColor(pkg.name) }">
          {{ getPackageName(pkg) }}
        </p>
        <p
          v-if="getPackageDiscount(pkg.lessonAmount).packageDiscount > 0"
          class="bg-red-400 text-white rounded-md py-2 px-3 text-sm"
        >
          {{
            $t('userProfile.teacher.lessonSelection.discount', {
              formattedDiscount: getPackageDiscount(pkg.lessonAmount).formattedDiscount,
            })
          }}
        </p>
      </div>
    </template>
    <template #body>
      <p class="mt-2 text-gray-600">{{ getPackageDescription(pkg) }}</p>
      <price-pill v-show="showPrice" :price="packagePrice || ''" />
    </template>
  </dialog-button>
</template>

<script lang="ts">
import Vue from 'vue';
import { makePackageMixin } from '../../mixins/package';
import randomColor from 'randomcolor';
import DialogButton from './DialogButton.vue';
import PricePill from './PricePill.vue';

export default Vue.extend({
  name: 'TeacherPackageButton',
  components: { DialogButton, PricePill },
  mixins: [makePackageMixin],
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
        const { formattedSubTotal } = await (this as any).getPackagePriceData({
          teacher: this.teacher,
          pkg: this.pkg,
          lessonDuration: 60,
        });
        return formattedSubTotal;
      },
    },
  },
  mounted() {
    return;
  },
  methods: {
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
