<template>
  <div data-app>
    <grid-button-layout :step-title="stepTitle">
      <template v-slot:main>
        <form class="mb-0 space-y-6">
          <div>
            <input
              v-model="inputModel"
              v-focus="true"
              type="text"
              :placeholder="inputPlaceholderText"
              class="form-border mx-auto place-items-center"
              @keydown.enter.prevent="handleEnterKeyPress"
            />
            <p v-show="$v.inputModel.$error" class="vuelidate-error mt-2">
              {{ inputErrorText }}
            </p>
          </div>
        </form>
      </template>
      <template v-slot:button>
        <grid-button
          :button-text="$t('button.onboarding.next')"
          class="absolute bottom-0"
          @click="handleEnterKeyPress"
        />
      </template>
    </grid-button-layout>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import GridButton from '../Common/GridButton.vue';
import GridButtonLayout from '../Layouts/GridButtonLayout.vue';
import { focus } from 'vue-focus';

export default Vue.extend({
  name: 'TextInputLayout',
  components: { GridButton, GridButtonLayout },
  directives: { focus },
  props: {
    stepTitle: {
      type: String,
      required: true,
    },
    inputValue: {
      type: String,
      required: true,
    },
    inputPlaceholderText: {
      type: String,
      required: true,
    },
    inputErrorText: {
      type: String,
      required: true,
    },
    inputModelVuelidateObj: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {};
  },
  computed: {
    inputModel: {
      get() {
        return (this as any).inputValue;
      },
      set(value) {
        (this as any).$emit('update:prop', value);
      },
    },
  },
  mounted() {
    return;
  },
  methods: {
    handleEnterKeyPress(): void {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.$emit('step-forward');
      }
    },
  },
  validations() {
    return this.inputModelVuelidateObj;
  },
});
</script>
