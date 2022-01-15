<template>
  <div data-app>
    <grid-button-layout :step-title="$t('onboarding.timezone')">
      <template v-slot:main>
        <v-autocomplete
          v-model="timezoneModel"
          outlined
          dense
          auto
          :cache-items="true"
          :hide-no-data="true"
          :items="selectTimezones"
        />
      </template>
      <template v-slot:button>
        <grid-button
          :button-text="$t('button.onboarding.next')"
          class="absolute bottom-0"
          @click="emitRegionSelection"
        />
      </template>
    </grid-button-layout>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import ct from 'countries-and-timezones';
import GridBaseLayout from '../Layouts/GridBaseLayout.vue';
import GridButton from '../Common/GridButton.vue';
import { EventBus } from '../../EventBus/EventBus';
import GridButtonLayout from '../Layouts/GridButtonLayout.vue';

export default Vue.extend({
  name: 'TimezoneStep',
  components: { GridBaseLayout, GridButton, GridButtonLayout },
  props: {
    region: {
      type: String,
      required: true,
    },
    timezone: {
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
      selectedTimezone: '',
    };
  },
  computed: {
    timezoneModel: {
      get(): string {
        const isDbTimezoneValid = this.isValidTimezone(this.userData.timezone);
        const isSavedTimezoneValid = this.isValidTimezone(this.timezone);
        let timezoneModel;
        if (isDbTimezoneValid) {
          timezoneModel = this.userData.timezone;
        } else if (isSavedTimezoneValid) {
          timezoneModel = this.timezone;
        } else {
          timezoneModel = this.selectTimezones[0].value;
        }
        return timezoneModel;
      },
      set(value: string): void {
        this.selectedTimezone = value;
      },
    },
    selectTimezones: {
      get(): { text: string; value: string }[] {
        const timezones: string[] = ct.getCountry(this.region)!.timezones;
        const selectTimezones = [];
        for (let i = 0; i < timezones.length; i++) {
          const timezone = timezones[i];
          const selectTimezone = {
            text: timezone,
            value: timezone,
          };
          selectTimezones.push(selectTimezone);
        }
        return selectTimezones;
      },
    },
  },
  mounted() {
    this.selectedTimezone = this.timezoneModel;
  },
  methods: {
    emitRegionSelection(): void {
      EventBus.$emit('step-forward', {
        value: this.selectedTimezone,
        emittedValueName: 'timezone',
      });
    },
    isValidTimezone(timezone: string): boolean {
      const isValidTimezone =
        this.selectTimezones.filter((selectTimezone: { text: string; value: string }) => {
          return selectTimezone.value == timezone;
        }).length > 0;
      return isValidTimezone;
    },
  },
});
</script>
