<template>
  <div class="flex mt-1">
    <p class="mb-1">JA</p>
    <div class="h-3 bg-red-500 w-1 mt-1 mx-1 rounded-lg"></div>
    <div class="h-3 bg-red-500 w-1 mt-1 rounded-lg"></div>
    <div class="h-3 bg-red-300 w-1 mt-1 mx-1 rounded-lg"></div>
    <div class="h-3 bg-red-300 w-1 mt-1 rounded-lg"></div>
    <div class="h-3 bg-red-300 w-1 mt-1 mx-1 rounded-lg"></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'LanguageBars',
  components: {},
  props: {
    languageLevel: {
      type: String,
      required: true,
    },
    languageCode: {
      type: String,
      required: true,
    },
  },
  data() {
    return {};
  },
  computed: {
    // prop: {
    //   get(): any {
    //     return;
    //   },
    // },
  },
  mounted() {
    return;
  },
  methods: {},
});
</script>
