<template>
  <button
    class="border-solid border-2 rounded-md mb-5 hover:bg-gray-100 w-full"
    @click="$emit('click')"
  >
    <div class="m-4 text-left">
      <slot name="title"></slot>
      <slot name="body"></slot>
    </div>
  </button>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'DialogButton',
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
