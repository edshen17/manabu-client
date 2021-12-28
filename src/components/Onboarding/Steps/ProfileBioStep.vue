<template>
  <div data-app>
    <grid-button-layout :step-title="stepTitle">
      <template v-slot:main>
        <div data-app>
          <tiptap-vuetify
            :key="$vuetify.lang.current"
            ref="editor"
            v-model="profileBio"
            :extensions="extensions"
            class="w-full mx-auto"
          />
          <p v-show="$v.profileBio.$error" class="vuelidate-error ml-6 mt-3">
            you must write an profile
          </p>
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
import { required } from 'vuelidate/lib/validators';

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
  watch: {
    profileBio: function (newVal) {
      const isEmpty = newVal == '<p></p>';
      if (isEmpty) {
        this.profileBio = '';
      }
    },
  },
  mounted() {
    return;
  },
  methods: {
    emitStepForward(): void {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        EventBus.$emit('step-forward', { value: this.profileBio, emittedValueName: 'profileBio' });
      }
    },
  },
  validations: {
    profileBio: {
      required,
    },
  },
});
</script>
