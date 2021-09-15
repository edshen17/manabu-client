<template>
  <grid-list-layout
    :step-title="stepTitle"
    :list-items="languageLevels"
    parent-name="language-level"
    :emitted-value-name="emittedValueName"
  />
</template>

<script lang="ts">
import Vue from 'vue';
import GridListLayout, { ListItems } from './GridListLayout.vue';

export default Vue.extend({
  name: 'LanguageLevelStep',
  components: { GridListLayout },
  props: {
    stepTitle: {
      type: String,
      default: '',
      required: true,
    },
    emittedValueName: {
      type: String,
      default: '',
      required: true,
    },
  },
  data() {
    return {};
  },
  computed: {
    languageLevels: {
      get(): ListItems {
        const languageLevels = [
          { value: 'A1', content: this.$t('onboarding.languageLevels.beginner') },
          { value: 'A2', content: this.$t('onboarding.languageLevels.elementary') },
          { value: 'B1', content: this.$t('onboarding.languageLevels.intermediate') },
          { value: 'B2', content: this.$t('onboarding.languageLevels.upperIntermediate') },
          { value: 'C1', content: this.$t('onboarding.languageLevels.advanced') },
          { value: 'C2', content: this.$t('onboarding.languageLevels.proficient') },
        ];
        return languageLevels;
      },
    },
  },
  mounted() {
    return;
  },
  methods: {},
});
</script>
