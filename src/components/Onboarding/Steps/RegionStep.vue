<template>
  <div data-app>
    <grid-button-layout :step-title="$t('onboarding.region')">
      <template v-slot:main>
        <component
          :is="selectRegionComponent"
          v-model="selectedRegion"
          outlined
          dense
          auto
          :cache-items="true"
          :hide-no-data="true"
          :items="selectRegions"
        />
      </template>
      <template v-slot:button>
        <grid-button
          :button-text="$t('button.onboarding.next')"
          class="absolute bottom-0"
          @click="emitStepForward"
        />
      </template>
    </grid-button-layout>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import ct from 'countries-and-timezones';
import { StringKeyObject } from '../../../../../server/types/custom';
import GridButton from '../Common/GridButton.vue';
import { EventBus } from '../../EventBus/EventBus';
import GridButtonLayout from '../Layouts/GridButtonLayout.vue';
import { VAutocomplete, VSelect } from 'vuetify/lib';

export default Vue.extend({
  name: 'RegionStep',
  components: { GridButton, GridButtonLayout, VAutocomplete, VSelect },
  props: {
    region: {
      type: String,
      required: true,
    },
    userData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      selectedRegion: this.region || this.userData.region || 'SG',
    };
  },
  computed: {
    selectRegions: {
      get(): { text: string; value: string }[] {
        const regions: StringKeyObject = ct.getAllCountries();
        const selectRegions = [];
        for (const code in regions) {
          const selectRegion = {
            value: code,
            text: `${regions[code].name} - ${code}`,
          };
          selectRegions.push(selectRegion);
        }
        return selectRegions;
      },
    },
    selectRegionComponent: {
      get(): string {
        const selectRegionComponent = (this as any).isMobile ? 'VSelect' : 'VAutocomplete';
        return selectRegionComponent;
      },
    },
  },
  mounted() {
    return;
  },
  methods: {
    emitStepForward(): void {
      EventBus.$emit('step-forward', { value: this.selectedRegion, emittedValueName: 'region' });
    },
  },
});
</script>
