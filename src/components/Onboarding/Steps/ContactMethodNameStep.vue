<template>
  <grid-col-layout :step-title="stepTitle">
    <div v-for="contactMethod in contactMethods" :key="contactMethod.value">
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
        @click="emitStepForward(contactMethod.value)"
      >
        <span
          class="
            inline-flex
            items-center
            font-medium
            rounded
            px-4
            py-3
            leading-4
            text-primary-100
            m-3
          "
          :style="{ 'background-color': contactMethod.backgroundHex }"
        >
          <i :class="contactMethod.iconClass" :style="{ color: contactMethod.logoHex }"></i>
        </span>
        <p class="flex justify-center text-white py-2">
          {{ contactMethod.name }}
        </p>
      </button>
    </div>
  </grid-col-layout>
</template>

<script lang="ts">
import Vue from 'vue';
import GridColLayout from '../Layouts/GridColLayout.vue';
import { EventBus } from '../../EventBus/EventBus';
import { TranslateResult } from 'vue-i18n';

export default Vue.extend({
  name: 'ContactMethodNameStep',
  components: { GridColLayout },
  props: {
    stepTitle: {
      type: String,
      default: '',
      required: true,
    },
  },
  data() {
    return {};
  },
  computed: {
    contactMethods: {
      get(): {
        name: TranslateResult;
        iconClass: string;
        backgroundHex: string;
        logoHex: string;
      }[] {
        const contactMethods = [
          {
            name: this.$t('contactMethod.skype'),
            value: 'skype',
            iconClass: 'fab fa-skype fa-3x',
            logoHex: '#00AFF0',
            backgroundHex: '#FFF',
          },
          {
            name: this.$t('contactMethod.line'),
            iconClass: 'fab fa-line fa-3x',
            value: 'line',
            logoHex: '#00B900',
            backgroundHex: '#FFF',
          },
          {
            name: this.$t('contactMethod.discord'),
            iconClass: 'fab fa-discord fa-3x',
            logoHex: '#7289DA',
            value: 'discord',
            backgroundHex: '#FFF',
          },
          {
            name: this.$t('contactMethod.zoom'),
            iconClass: 'fas fa-video fa-2x',
            logoHex: '#FFF',
            value: 'zoom',
            backgroundHex: '#2D8CFF',
          },
        ];
        return contactMethods;
      },
    },
  },
  mounted() {
    return;
  },
  methods: {
    emitStepForward(value: string): void {
      EventBus.$emit('step-forward', { value, emittedValueName: 'contactMethodName' });
    },
  },
});
</script>
