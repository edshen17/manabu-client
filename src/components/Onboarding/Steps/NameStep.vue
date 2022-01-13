<template>
  <text-input-layout
    :step-title="$t('onboarding.name.title')"
    :input-value="name"
    :input-placeholder-text="$t('onboarding.name.placeholder')"
    :input-error-text="$t('error.onboarding.name')"
    :input-model-vuelidate-obj="inputModelVuelidateObj"
    @update:prop="onInputChange"
    @step-forward="onStepForward"
  />
</template>

<script lang="ts">
import Vue from 'vue';
import { StringKeyObject } from '../../../../../server/types/custom';
import TextInputLayout from '../Layouts/TextInputLayout.vue';
import { required } from 'vuelidate/lib/validators';
import { EventBus } from '../../EventBus/EventBus';

export default Vue.extend({
  name: 'NameStep',
  components: { TextInputLayout },
  props: {
    userData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      name: this.userData.name || '',
    };
  },
  computed: {
    inputModelVuelidateObj: {
      get(): StringKeyObject {
        return {
          inputModel: {
            required,
          },
        };
      },
    },
  },
  mounted() {
    return;
  },
  methods: {
    onInputChange(value: string): void {
      this.name = value;
    },
    onStepForward(): void {
      EventBus.$emit('step-forward', {
        value: this.name,
        emittedValueName: 'name',
      });
    },
  },
});
</script>
