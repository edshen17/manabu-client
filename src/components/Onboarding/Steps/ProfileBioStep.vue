<template>
  <div data-app>
    <grid-button-layout :step-title="stepTitle">
      <template v-slot:main>
        <div data-app>
          <tiptap-vuetify
            :key="$vuetify.lang.current"
            v-model="profileBio"
            :extensions="extensions"
            class="w-full mx-auto"
          />
        </div>
      </template>
      <template v-slot:button>
        <grid-button
          :button-text="$t('onboarding.buttons.next')"
          class="absolute bottom-0"
          @click="emitStepForward"
        />
      </template>
    </grid-button-layout>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {
  TiptapVuetify,
  Bold,
  Italic,
  Underline,
  BulletList,
  OrderedList,
  ListItem,
  History,
} from 'tiptap-vuetify';
import GridBaseLayout from '../Layouts/GridBaseLayout.vue';
import GridButton from '../Common/GridButton.vue';
import GridButtonLayout from '../Layouts/GridButtonLayout.vue';
import { EventBus } from '../../EventBus/EventBus';

export default Vue.extend({
  name: 'ProfileBioStep',
  components: { TiptapVuetify, GridBaseLayout, GridButton, GridButtonLayout },
  props: {
    stepTitle: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      extensions: [History, Bold, Underline, Italic, ListItem, BulletList, OrderedList],
      profileBio: '',
    };
  },
  computed: {},
  mounted() {
    return;
  },
  methods: {
    emitStepForward(): void {
      EventBus.$emit('step-forward', { value: this.profileBio, emittedValueName: 'profileBio' });
    },
  },
});
</script>
