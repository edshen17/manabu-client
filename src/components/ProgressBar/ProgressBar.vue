<template>
  <div class="flex justify-center mx-auto items-center mb-7">
    <button class="mb-1 md:mb-0" @click="$emit('step-backward')">
      <i class="fas fa-arrow-left pr-3 md:text-lg md:pr-4 lg:text-xl"></i>
    </button>
    <div class="relative w-10/12 lg:w-10/12 2xl:w-7/12">
      <div class="overflow-hidden h-2 text-xs flex rounded bg-green-200">
        <div
          :style="`width: ${progressPercent}%`"
          class="
            shadow-none
            flex flex-col
            text-center
            whitespace-nowrap
            text-white
            justify-center
            progress-bar-transition
            bg-green-500
          "
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
  props: {},
  data() {
    return {
      progressPercent: 0,
    };
  },
  computed: {},
  mounted() {
    return;
  },
  methods: {
    setProgressPercent(value: number): void {
      this.progressPercent = value;
    },
    emitStepBackward(): void {
      EventBus.$emit('step-backward');
    },
  },
});
</script>
