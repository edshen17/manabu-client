<template>
  <div class="text-white px-6 py-4 border-0 rounded relative mb-4 bg-pink-500" :class="mainClass">
    <span class="text-xl inline-block mr-5 align-middle">
      <i :class="alertIcon" />
    </span>
    <span class="inline-block align-middle mr-8">
      <slot />
    </span>
    <button
      class="
        absolute
        bg-transparent
        text-2xl
        font-semibold
        leading-none
        right-0
        top-0
        mt-4
        mr-6
        outline-none
        focus:outline-none
      "
    >
      <span>×</span>
    </button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'PopupAlert',
  props: {
    mainClass: String,
    alertIcon: String,
  },
});
</script>
