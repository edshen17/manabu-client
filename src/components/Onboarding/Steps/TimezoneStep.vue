<template>
  <grid-select-layout :step-title="$t('onboarding.timezone')">
    <template v-slot:select>
      <v-select v-model="timezone" :options="selectTimezones" label="timezone"></v-select>
    </template>
    <template v-slot:button>
      <grid-button :button-text="$t('onboarding.buttons.next')" @click="emitTimezoneSelection" />
    </template>
  </grid-select-layout>
</template>

<script lang="ts">
import Vue from 'vue';
import vSelect from 'vue-select';
import ct from 'countries-and-timezones';
import 'vue-select/dist/vue-select.css';
import GridBaseLayout from '../Layouts/GridBaseLayout.vue';
import GridButton from '../Common/GridButton.vue';
import { EventBus } from '../../EventBus/EventBus';
import GridSelectLayout from '../Layouts/GridSelectLayout.vue';

export default Vue.extend({
  name: 'TimezoneStep',
  components: { GridBaseLayout, vSelect, GridButton, GridSelectLayout },
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
