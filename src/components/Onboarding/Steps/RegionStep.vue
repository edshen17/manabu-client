<template>
  <grid-base-layout :step-title="$t('onboarding.region')">
    <v-select
      v-model="country"
      :options="selectCountries"
      label="name"
      :reduce="(country) => country.code"
      class="w-11/12 md:w-9/12 lg:w-6/12 mx-auto text-lg lg:text-xl"
    ></v-select>
    <grid-button class="mt-96" :button-text="$t('onboarding.buttons.next')" @click="test" />
  </grid-base-layout>
</template>

<script lang="ts">
import Vue from 'vue';
import vSelect from 'vue-select';
import ct from 'countries-and-timezones';
import 'vue-select/dist/vue-select.css';
import GridBaseLayout from '../Layouts/GridBaseLayout.vue';
import { StringKeyObject } from '../../../../../server/types/custom';
import GridButton from '../Common/GridButton.vue';

export default Vue.extend({
  name: 'RegionStep',
  components: { GridBaseLayout, vSelect, GridButton },
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
  methods: {
    test(): void {
      console.log('hi');
    },
  },
});
</script>
