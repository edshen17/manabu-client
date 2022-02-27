<template>
  <grid-base-layout :step-title="stepTitle" class="relative">
    <div class="w-11/12 md:w-9/12 lg:w-6/12 mx-auto text-lg lg:text-xl" :class="mainClass">
      <slot name="main" />
    </div>
    <div :class="paddingClass"></div>
    <div class="uppercase md:text-lg flex justify-center items-center">
      <slot name="button" />
    </div>
  </grid-base-layout>
</template>

<script lang="ts">
import Vue from 'vue';
import GridBaseLayout from './GridBaseLayout.vue';

export default Vue.extend({
  name: 'GridButtonLayout',
  components: { GridBaseLayout },
  props: {
    stepTitle: {
      type: String,
      required: true,
    },
    mainClass: {
      type: String,
      required: false,
      default: '',
    },
    paddingClass: {
      type: String,
      required: false,
      default: 'h-30v lg:h-40v',
    },
  },
  data() {
    return {};
  },
  computed: {},
  mounted() {
    return;
  },
  methods: {},
});
</script>
