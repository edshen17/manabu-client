<template>
  <div data-app>
    <grid-button-layout :step-title="stepTitle">
      <template #main>
        <profile-image :user-data="userData" />
      </template>
      <template #button>
        <grid-button
          :button-text="$t('button.onboarding.next')"
          class="absolute bottom-0"
          @click="emitStepForward"
        />
      </template>
    </grid-button-layout>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import GridButton from '../Common/GridButton.vue';
import { EventBus } from '../../EventBus/EventBus';
import GridButtonLayout from '../Layouts/GridButtonLayout.vue';
import ProfileImage from '../../UserProfile/ProfileImage.vue';

export default Vue.extend({
  name: 'ProfileImageStep',
  components: { GridButton, GridButtonLayout, ProfileImage },
  props: {
    stepTitle: {
      type: String,
      required: true,
    },
    userData: {
      type: Object,
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
  methods: {
    emitStepForward(): void {
      EventBus.$emit('step-forward');
    },
  },
});
</script>
