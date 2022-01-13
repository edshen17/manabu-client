<template>
  <grid-col-layout :step-title="stepTitle">
    <div v-for="languageOffering in languageOfferings" :key="languageOffering.languageCode">
      <button
        class="
          flex flex-col
          items-center
          bg-gray-800
          py-8
          px-16
          rounded-lg
          cursor-pointer
          select-none
          focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50
        "
        :disabled="!languageOffering.isTeachable"
        :class="{
          'opacity-40': !languageOffering.isTeachable,
          'hover:bg-gray-700': languageOffering.isTeachable,
        }"
        :title="languageOffering.isTeachable ? '' : $t('onboarding.comingSoon')"
        @click="emitStepForward(languageOffering.languageCode)"
      >
        <flag-icon icon-class="text-6xl rounded-md" :country-code="languageOffering.countryCode" />
        <p class="flex justify-center text-white py-2">
          {{ languageOffering.name }}
        </p>
      </button>
    </div>
  </grid-col-layout>
</template>

<script lang="ts">
import Vue from 'vue';
import 'flag-icon-css/css/flag-icon.css';
import FlagIcon from '../../FlagIcon/FlagIcon.vue';
import GridColLayout from '../Layouts/GridColLayout.vue';
import { EventBus } from '../../EventBus/EventBus';

export default Vue.extend({
  name: 'LanguageNameStep',
  components: { FlagIcon, GridColLayout },
  props: {
    stepTitle: {
      type: String,
      default: '',
      required: true,
    },
    languageOfferings: {
      type: Array,
      default: (): {}[] => [],
      required: true,
    },
    emittedValueName: {
      type: String,
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
    emitStepForward(value: string): void {
      EventBus.$emit('step-forward', { value, emittedValueName: this.emittedValueName });
    },
  },
});
</script>
