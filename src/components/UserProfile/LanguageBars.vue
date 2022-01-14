<template>
  <div class="flex mt-1">
    <p class="mb-1 text-sm uppercase">{{ languageCode }}</p>
    <div
      v-for="index in languageCodeValue.C2"
      :key="index"
      class="h-3 w-1 mt-1 rounded-lg"
      :class="{
        'mx-1': index % 2 == 1,
        'bg-red-500': index - 1 < languageCodeValue[languageLevel],
        'bg-red-300': index - 1 >= languageCodeValue[languageLevel],
      }"
    ></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { StringKeyObject } from '../../../../server/types/custom';

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
    languageCodeValue: {
      get(): StringKeyObject {
        const languageCodeValue = {
          A1: 0,
          A2: 1,
          B1: 2,
          B2: 3,
          C1: 4,
          C2: 5,
        };
        return languageCodeValue;
      },
    },
  },
  mounted() {
    return;
  },
  methods: {},
});
</script>
