<template>
  <div class="rounded-lg shadow-md mt-5 h-auto pb-2 bg-white">
    <p class="justify-center p-6 mx-auto text-2xl">{{ $t('userProfile.teacher.lessonPlans') }}</p>
    <div v-for="pkg in visiblePackages" :key="pkg._id" class="px-6 mx-auto">
      <button class="border-solid border-2 rounded-md mb-5 hover:bg-gray-100">
        <div class="m-4 text-left">
          <p class="text-lg" :style="{ color: getRandomColor(pkg.name) }">
            {{ getPackageTitle(pkg) }}
          </p>
          <p class="mt-2 text-gray-600">
            {{ getPackageDescription(pkg) }}
          </p>
          <div
            class="
              py-1
              w-24
              mt-3
              shadow-md
              bg-blue-400
              no-underline
              rounded-full
              text-white
              font-semibold
              text-sm text-center
            "
          >
            ~75+ SGD
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

export default Vue.extend({
  name: 'LessonPlanCard',
  components: {},
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
    visiblePackages: {
      get(): PackageDoc[] {
        const visiblePackages = this.user.teacherData.packages.filter((pkg: PackageDoc) => {
          return pkg.isOffering;
        });
        return visiblePackages;
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
