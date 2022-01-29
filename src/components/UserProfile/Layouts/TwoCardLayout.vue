<template>
  <div class="bg-gray-50 h-auto min-h-screen">
    <div class="flex flex-wrap lg:flex-nowrap w-full lg:w-9/12 mx-auto lg:py-7">
      <div class="w-full lg:w-8/12 lg:mx-2">
        <slot name="left-cards"></slot>
      </div>
      <div
        class="
          w-full
          lg:w-4/12 lg:mx-3
          max-h-96
          sticky
          top-24
          rounded-lg
          bg-white
          shadow-md
          my-5
          lg:my-0
        "
      >
        <div class="max-h-96 h-96">
          <slot name="right-cards"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'TwoCardLayout',
  components: {},
  props: {},
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
