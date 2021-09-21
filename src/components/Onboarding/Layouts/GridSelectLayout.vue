<template>
  <grid-base-layout :step-title="stepTitle">
    <div class="w-11/12 md:w-9/12 lg:w-6/12 mx-auto text-lg lg:text-xl">
      <slot name="select" />
    </div>
    <div class="h-40v md:h-30v lg:h-40v"></div>
    <div class="uppercase md:text-lg">
      <slot name="button" />
    </div>
  </grid-base-layout>
</template>

<script lang="ts">
import Vue from 'vue';
import GridBaseLayout from '../Layouts/GridBaseLayout.vue';

export default Vue.extend({
  name: 'GridSelectLayout',
  components: { GridBaseLayout },
  props: {
    stepTitle: {
      type: String,
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
  methods: {},
});
</script>
