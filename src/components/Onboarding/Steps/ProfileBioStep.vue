<template>
  <div data-app>
    <grid-button-layout :step-title="stepTitle">
      <template #main>
        <div data-app>
          <tiptap-vuetify
            :key="$vuetify.lang.current"
            ref="editor"
            v-model="bio"
            :extensions="extensions"
            class="w-full mx-auto"
          />
          <p v-show="$v.bio.$error" class="vuelidate-error ml-6 mt-3">
            {{ $t('error.onboarding.profileBio') }}
          </p>
        </div>
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
import GridButton from '../Common/GridButton.vue';
import GridButtonLayout from '../Layouts/GridButtonLayout.vue';
import { EventBus } from '../../EventBus/EventBus';
import { required } from 'vuelidate/lib/validators';

export default Vue.extend({
  name: 'ProfileBioStep',
  components: { TiptapVuetify, GridButton, GridButtonLayout },
  props: {
    stepTitle: {
      type: String,
      required: true,
    },
    profileBio: {
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
      extensions: [History, Bold, Underline, Italic, ListItem, BulletList, OrderedList],
      bio: this.profileBio || this.userData.profileBio || '',
    };
  },
  computed: {},
  watch: {
    bio: function (newVal) {
      const isEmpty = newVal == '<p></p>';
      if (isEmpty) {
        this.bio = '';
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
        EventBus.$emit('step-forward', { value: this.bio, emittedValueName: 'profileBio' });
      }
    },
  },
  validations: {
    bio: {
      required,
    },
  },
});
</script>
