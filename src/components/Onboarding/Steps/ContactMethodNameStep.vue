<template>
  <grid-col-layout :step-title="stepTitle">
    <div v-for="contactMethod in contactMethods" :key="contactMethod.value">
      <button
        class="
          flex flex-col
          items-center
          bg-gray-800
          py-14
          px-24
          md:px-14
          rounded-lg
          cursor-pointer
          select-none
          focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50
        "
        @click="emitStepForward(contactMethod.value)"
      >
        <span
          class="
            inline-flex
            items-center
            font-medium
            rounded
            px-4
            py-3
            leading-4
            text-primary-100
            m-3
          "
          :style="{ 'background-color': contactMethod.backgroundHex }"
        >
          <i :class="contactMethod.iconClass" :style="{ color: contactMethod.logoHex }"></i>
        </span>
        <p class="flex justify-center text-white py-2">
          {{ contactMethod.name }}
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
  name: 'ContactMethodNameStep',
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
