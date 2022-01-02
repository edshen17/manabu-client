<template>
  <div data-app>
    <grid-button-layout :step-title="$t('onboarding.loading')">
      <template v-slot:main>
        <div class="hero container max-w-screen-lg mx-auto pb-10 flex justify-center">
          <v-progress-circular
            class="mx-auto"
            :rotate="90"
            :size="120"
            :width="15"
            :value="progressPercent"
          >
            {{ progressPercent }}
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
  computed: {},
  mounted() {
    return;
  },
  methods: {},
});
</script>
