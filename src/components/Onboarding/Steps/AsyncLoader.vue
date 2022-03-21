<template>
  <div data-app>
    <grid-button-layout :step-title="$t('onboarding.loading')">
      <template #main>
        <div class="hero container max-w-screen-lg mx-auto pb-10 flex justify-center">
          <v-progress-circular
            class="mx-auto"
            :rotate="90"
            :size="120"
            :width="15"
            :value="progress"
          >
            {{ progress }}
          </v-progress-circular>
        </div>
      </template>
    </grid-button-layout>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import GridButtonLayout from '../Layouts/GridButtonLayout.vue';

export default Vue.extend({
  name: 'AsyncLoader',
  components: { GridButtonLayout },
  props: {
    progressPercent: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {};
  },
  computed: {
    progress: {
      get(): number {
        const progress = this.progressPercent >= 100 ? 100 : this.progressPercent;
        return progress;
      },
    },
  },
  mounted() {
    return;
  },
  methods: {},
});
</script>
