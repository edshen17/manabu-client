<template>
  <dialog-button>
    <template v-slot:title>
      <p class="text-lg">30 mins x 12 lessons</p>
    </template>
    <template v-slot:body>
      <price-pill price="130 SGD" />
    </template>
  </dialog-button>
</template>

<script lang="ts">
import Vue from 'vue';
import DialogButton from './DialogButton.vue';
import PricePill from './PricePill.vue';

export default Vue.extend({
  name: 'LessonDurationButton',
  components: { DialogButton, PricePill },
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
