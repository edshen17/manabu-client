<template>
  <grid-select-layout :step-title="$t('onboarding.region')">
    <template v-slot:select>
      <v-select
        v-model="region"
        :options="selectRegions"
        label="name"
        :reduce="(region) => region.code"
      ></v-select>
    </template>
    <template v-slot:button>
      <grid-button :button-text="$t('onboarding.buttons.next')" @click="emitRegionSelection" />
    </template>
  </grid-select-layout>
</template>

<script lang="ts">
import Vue from 'vue';
import vSelect from 'vue-select';
import ct from 'countries-and-timezones';
import 'vue-select/dist/vue-select.css';
import GridBaseLayout from '../Layouts/GridBaseLayout.vue';
import { StringKeyObject } from '../../../../../server/types/custom';
import GridButton from '../Common/GridButton.vue';
import { EventBus } from '../../EventBus/EventBus';
import GridSelectLayout from '../Layouts/GridSelectLayout.vue';

export default Vue.extend({
  name: 'RegionStep',
  components: { GridBaseLayout, vSelect, GridButton, GridSelectLayout },
  data() {
    return {
      region: 'SG',
      timezone: '',
    };
  },
  computed: {
    selectRegions: {
      get(): { code: string; name: string }[] {
        const regions: StringKeyObject = ct.getAllCountries();
        const selectRegions = [];
        for (const code in regions) {
          const region = {
            code,
            name: `${regions[code].name} - ${code}`,
          };
          selectRegions.push(region);
        }
        return selectRegions;
      },
    },
  },
  mounted() {
    return;
  },
  methods: {
    emitRegionSelection(): void {
      EventBus.$emit('step-forward', { value: this.region, emittedValueName: 'region' });
    },
  },
});
</script>
