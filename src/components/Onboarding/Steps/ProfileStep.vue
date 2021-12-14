<template>
  <div data-app>
    <grid-button-layout :step-title="stepTitle">
      <template v-slot:main>
        <profile-image :user-data="userData" />
      </template>
      <template v-slot:button>
        <grid-button :button-text="$t('onboarding.buttons.next')" class="absolute bottom-0" />
      </template>
    </grid-button-layout>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import GridBaseLayout from '../Layouts/GridBaseLayout.vue';
import GridButton from '../Common/GridButton.vue';
import { EventBus } from '../../EventBus/EventBus';
import GridButtonLayout from '../Layouts/GridButtonLayout.vue';
import ProfileCard from '../../UserProfile/ProfileCard.vue';
import ProfileImage from '../../UserProfile/ProfileImage.vue';

export default Vue.extend({
  name: 'ProfileStep',
  components: { GridBaseLayout, GridButton, GridButtonLayout, ProfileCard, ProfileImage },
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
    return {
      profileBio: '',
    };
  },
  computed: {},
  mounted() {
    return;
  },
  methods: {
    emitStepForward(): void {
      EventBus.$emit('step-forward', {
        value: this.profileBio,
        emittedValueName: 'profileBio',
      });
    },
  },
});
</script>
