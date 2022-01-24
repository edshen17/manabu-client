<template>
  <dialog-button @click="$emit('click', { lessonDuration, packagePrice })">
    <template v-slot:title>
      <p class="text-lg">
        {{
          $t('userProfile.teacher.lessonSelection.price', {
            lessonDuration,
            lessonAmount: pkg.lessonAmount,
          })
        }}
      </p>
    </template>
    <template v-slot:body>
      <price-pill :price="packagePrice || ''" />
    </template>
  </dialog-button>
</template>

<script lang="ts">
import Vue from 'vue';
import { StringKeyObject } from '../../../../server/types/custom';
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
      async get(): Promise<StringKeyObject> {
        const { formattedTotal } = await (this as any).getPackagePriceData({
          teacher: this.teacher,
          pkg: this.pkg,
          lessonDuration: this.lessonDuration,
        });
        return formattedTotal;
      },
    },
  },
  mounted() {
    return;
  },
  methods: {},
});
</script>
