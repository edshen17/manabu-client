<template>
  <div
    class="
      m-auto
      grid grid-cols-12
      text-red-800 text-lg
      px-6
      py-2
      my-6
      border-0
      rounded
      relative
      mb-4
      bg-red-200
      w-11/12
      md:w-6/12
      align-middle
    "
    :class="mainClass"
  >
    <span class="mr-8 col-span-11 text-left">
      <slot />
    </span>
    <button
      class="
        absolute
        bg-transparent
        text-xl
        font-semibold
        leading-none
        right-0
        top-0
        py-3
        mr-6
        outline-none
        focus:outline-none
        col-span-1
      "
      @click="popupClose"
    >
      <i class="fas fa-times"></i>
    </button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'PopupAlert',
  props: {
    mainClass: {
      type: String,
      default: '',
    },
    alertIcon: {
      type: String,
      default: '',
    },
  },
  methods: {
    popupClose() {
      this.$emit('popup-close');
    },
  },
});
</script>
