<template>
  <text-input-layout
    :step-title="$t('onboarding.paymentData.title')"
    :input-value="email"
    :input-placeholder-text="$t('onboarding.paymentData.placeholder')"
    :input-error-text="$t('error.onboarding.paymentData')"
    :input-model-vuelidate-obj="inputModelVuelidateObj"
    @update:prop="onInputChange"
    @step-forward="onStepForward"
  />
</template>

<script lang="ts">
import Vue from 'vue';
import { StringKeyObject } from '../../../../../server/types/custom';
import TextInputLayout from '../Layouts/TextInputLayout.vue';
import { required, email } from 'vuelidate/lib/validators';
import { EventBus } from '../../EventBus/EventBus';

export default Vue.extend({
  name: 'PaymentEmailStep',
  components: { TextInputLayout },
  props: {
    userData: {
      type: Object,
      required: true,
    },
    payoutEmail: {
      type: String,
      required: false,
      default: '',
    },
  },
  data() {
    return {
      email:
        this.payoutEmail ||
        this.userData.teacherData.settings.payoutData.email ||
        this.userData.email ||
        '',
    };
  },
  computed: {
    inputModelVuelidateObj: {
      get(): StringKeyObject {
        return {
          inputModel: {
            required,
            email,
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
      this.email = value;
    },
    onStepForward(): void {
      EventBus.$emit('step-forward', {
        value: this.email,
        emittedValueName: 'payoutEmail',
      });
    },
  },
});
</script>
