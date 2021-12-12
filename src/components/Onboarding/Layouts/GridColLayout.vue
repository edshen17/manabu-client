<template>
  <grid-base-layout :step-title="stepTitle">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-4 md:gap-y-14 place-items-center">
      <slot />
    </div>
  </grid-base-layout>
</template>

<script lang="ts">
import Vue from 'vue';
import GridBaseLayout from './GridBaseLayout.vue';

export default Vue.extend({
  name: 'GridColLayout',
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
