<template>
  <div data-app>
    <grid-button-layout :step-title="$t('onboarding.teacherPriceData')">
      <template v-slot:main>
        <v-tooltip :disabled="isProTeacher" bottom>
          <template v-slot:activator="{ on, attrs }">
            <div v-bind="attrs" v-on="on">
              <currency-input
                :key="isProTeacher"
                v-model="teacherHourlyRate"
                :options="{ currency, valueRange: { min: 5 } }"
                :is-disabled="!isProTeacher"
              />
            </div>
          </template>
          <span>{{ $t('onboarding.teacherPriceDataTooltip') }}</span>
        </v-tooltip>
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
import GridButtonLayout from '../Layouts/GridButtonLayout.vue';
import { EventBus } from '../../EventBus/EventBus';
import GridButton from '../Common/GridButton.vue';
import CurrencyInput from '../../CurrencyInput/CurrencyInput.vue';
import { DEFAULT_CURRENCY } from '../../../../../server/constants';

export default Vue.extend({
  name: 'TeacherPriceDataStep',
  components: { GridButtonLayout, GridButton, CurrencyInput },
  props: {
    isProTeacher: {
      type: Boolean,
      required: true,
    },
    userData: {
      type: Object,
      required: true,
    },
    hourlyRate: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      teacherHourlyRate: this.hourlyRate || this.userData.teacherData.priceData.hourlyRate,
      currency: DEFAULT_CURRENCY,
    };
  },
  computed: {},
  // watch: {
  //   isProTeacher: function (newVal) {
  //     if (!newVal) {
  //       this.teacherHourlyRate = 30;
  //     }
  //   },
  // },
  mounted() {
    return;
  },
  methods: {
    emitStepForward(): void {
      if (this.teacherHourlyRate || this.teacherHourlyRate >= 0) {
        EventBus.$emit('step-forward', {
          value: this.teacherHourlyRate,
          emittedValueName: 'teacherHourlyRate',
        });
      }
    },
  },
});
</script>
