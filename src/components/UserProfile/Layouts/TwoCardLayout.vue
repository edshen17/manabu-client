<template>
  <div class="bg-gray-50 h-auto lg:min-h-screen">
    <div class="flex flex-wrap lg:flex-nowrap w-full lg:w-9/12 mx-auto lg:py-7">
      <div class="w-full lg:w-8/12 lg:mx-2">
        <slot name="left-cards"></slot>
      </div>
      <!-- justify-center items-center flex mx-auto -->
      <div
        class="w-full lg:w-4/12 lg:mx-3 sticky top-24 rounded-lg bg-white shadow-md my-5 lg:my-0"
        :class="rightCardClass"
      >
        <slot name="right-cards"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'TwoCardLayout',
  components: {},
  props: {
    rightCardClass: {
      type: String,
      default: 'max-h-96',
      required: false,
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
