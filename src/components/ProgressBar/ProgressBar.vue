<template>
  <div class="flex justify-center mx-auto items-center">
    <div class="h-6">
      <button v-show="stepIndex > 0" @click="emitStepBackward">
        <i class="fas fa-arrow-left pr-3 md:text-2xl md:pr-4 text-xl"></i>
      </button>
    </div>

    <div class="relative w-10/12 lg:w-10/12 2xl:w-7/12">
      <div class="overflow-hidden h-2 text-xs flex rounded bg-green-200">
        <div
          :style="`width: ${progressPercent}%`"
          class="shadow-none text-center whitespace-nowrap text-white justify-center progress-bar-transition bg-green-500"
        ></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { EventBus } from '../EventBus/EventBus';

export default Vue.extend({
  name: 'ProgressBar',
  components: {},
  props: {
    stepIndex: {
      type: Number,
      required: true,
    },
    stepTotal: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {};
  },
  computed: {
    progressPercent: {
      get(): number {
        const progressPercent = (this.stepIndex / this.stepTotal) * 100;
        return progressPercent;
      },
    },
  },
  mounted() {
    return;
  },
  methods: {
    emitStepBackward(): void {
      if (this.stepIndex > 0) {
        EventBus.$emit('step-backward');
      }
    },
  },
});
</script>
