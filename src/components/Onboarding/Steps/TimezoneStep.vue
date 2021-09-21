<template>
  <grid-base-layout :step-title="$t('onboarding.timezone')">
    <v-select
      v-model="timezone"
      :options="selectTimezones"
      label="timezone"
      class="w-11/12 md:w-9/12 lg:w-6/12 mx-auto text-lg lg:text-xl"
    ></v-select>
    <div class="h-40v md:h-30v lg:h-40v"></div>
    <grid-button
      class="uppercase md:text-lg"
      :button-text="$t('onboarding.buttons.next')"
      @click="emitTimezoneSelection"
    />
  </grid-base-layout>
</template>

<script lang="ts">
import Vue from 'vue';
import vSelect from 'vue-select';
import ct from 'countries-and-timezones';
import 'vue-select/dist/vue-select.css';
import GridBaseLayout from '../Layouts/GridBaseLayout.vue';
import GridButton from '../Common/GridButton.vue';
import { EventBus } from '../../EventBus/EventBus';

export default Vue.extend({
  name: 'TimezoneStep',
  components: { GridBaseLayout, vSelect, GridButton },
  props: {
    region: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      timezone: '',
    };
  },
  computed: {
    selectTimezones: {
      get(): string[] | undefined {
        if (this.region) {
          const selectTimezones = ct.getCountry(this.region)!.timezones;
          return selectTimezones;
        }
        return undefined;
      },
    },
  },
  watch: {
    region: function () {
      this.timezone = this.selectTimezones![0];
    },
  },
  mounted() {
    return;
  },
  methods: {
    emitTimezoneSelection(): void {
      EventBus.$emit('step-forward', { value: this.timezone, emittedValueName: 'timezone' });
    },
  },
});
</script>
