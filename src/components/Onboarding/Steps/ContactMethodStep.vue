<template>
  <grid-col-layout :step-title="stepTitle">
    <div v-for="contactMethod in contactMethods" :key="contactMethod.text">
      <button
        class="
          bg-gray-800
          py-14
          px-24
          md:px-14
          lg:px-24
          rounded-lg
          cursor-pointer
          select-none
          focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50
        "
        @click="emitStepForward(contactMethod.text)"
      >
        <button
          class="inline-flex items-center font-medium rounded px-4 py-3 leading-4 text-primary-100"
          :style="{ 'background-color': contactMethod.backgroundHex }"
        >
          <i :class="contactMethod.iconClass" :style="{ color: contactMethod.logoHex }"></i>
        </button>
        <p class="flex justify-center text-white py-2">
          {{ contactMethod.text }}
        </p>
      </button>
    </div>
  </grid-col-layout>
</template>

<script lang="ts">
import Vue from 'vue';
import GridColLayout from '../Layouts/GridColLayout.vue';
import { EventBus } from '../../EventBus/EventBus';

export default Vue.extend({
  name: 'ContactMethodStep',
  components: { GridColLayout },
  props: {
    stepTitle: {
      type: String,
      default: '',
      required: true,
    },
    emittedValueName: {
      type: String,
      default: '',
      required: true,
    },
    contactMethods: {
      type: Array,
      default: (): {}[] => [],
      required: true,
    },
  },
  data() {
    return {};
  },
  computed: {},
  mounted() {
    return;
  },
  methods: {
    emitStepForward(value: string): void {
      EventBus.$emit('step-forward', { value, emittedValueName: this.emittedValueName });
    },
  },
});
</script>
