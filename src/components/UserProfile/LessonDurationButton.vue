<template>
  <dialog-button>
    <template v-slot:title>
      <p class="text-lg">{{ lessonDuration }} mins x {{ pkg.lessonAmount }} lessons</p>
    </template>
    <template v-slot:body>
      <price-pill :price="packagePrice" />
    </template>
  </dialog-button>
</template>

<script lang="ts">
import Vue from 'vue';
import { makeExchangeRateMixin } from '../../mixins/exchangeRate';
import DialogButton from './DialogButton.vue';
import PricePill from './PricePill.vue';

export default Vue.extend({
  name: 'LessonDurationButton',
  components: { DialogButton, PricePill },
  mixins: [makeExchangeRateMixin],
  props: {
    pkg: {
      type: Object,
      required: true,
    },
    teacher: {
      type: Object,
      required: true,
    },
    lessonDuration: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {};
  },
  asyncComputed: {
    packagePrice: {
      async get() {
        const packagePrice = await (this as any).getPackagePrice({
          teacher: this.teacher,
          pkg: this.pkg,
          lessonDuration: this.lessonDuration,
        });
        return packagePrice;
      },
    },
  },
  mounted() {
    return;
  },
  methods: {},
});
</script>
