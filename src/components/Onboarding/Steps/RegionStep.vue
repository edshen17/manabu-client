<template>
  <grid-base-layout :step-title="$t('onboarding.region')">
    <v-select
      v-model="country"
      :options="selectCountries"
      label="name"
      :reduce="(country) => country.code"
      class="w-11/12 md:w-9/12 lg:w-6/12 mx-auto text-lg lg:text-xl mb-96"
    ></v-select>
    <button
      class="
        mt-28
        py-2
        flex
        w-full
        md:w-9/12
        lg:w-6/12
        mx-auto
        border-solid border
        rounded-lg
        bg-green-700
        text-white
        justify-center
        text-uppercase
      "
    >
      next
    </button>
  </grid-base-layout>
</template>

<script lang="ts">
import Vue from 'vue';
import vSelect from 'vue-select';
import ct from 'countries-and-timezones';
import 'vue-select/dist/vue-select.css';
import GridBaseLayout from '../Layouts/GridBaseLayout.vue';
import { StringKeyObject } from '../../../../../server/types/custom';

export default Vue.extend({
  name: 'RegionStep',
  components: { GridBaseLayout, vSelect },
  data() {
    return {
      country: 'SG',
      timezone: '',
    };
  },
  computed: {
    selectCountries: {
      get(): { code: string; name: string }[] {
        const countries: StringKeyObject = ct.getAllCountries();
        const selectCountries = [];
        for (const code in countries) {
          const country = {
            code,
            name: `${countries[code].name} - ${code}`,
          };
          selectCountries.push(country);
        }
        return selectCountries;
      },
    },
  },
  mounted() {
    return;
  },
  methods: {},
});
</script>
