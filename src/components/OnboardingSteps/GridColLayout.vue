<template>
  <div class="container w-11/12 mx-auto">
    <h2 class="flex justify-center text-2xl font-bold my-4 pb-8 lg:text-3xl lg:my-16">
      {{ stepTitle }}
    </h2>
    <div
      class="
        grid grid-cols-1
        md:grid-cols-3
        gap-y-6 gap-x-4
        md:gap-y-14
        lg:gap-y-32 lg:gap-x-96
        place-items-center
      "
    >
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'GridColLayout',
  components: {},
  props: {
    stepTitle: {
      type: String,
      default: '',
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
