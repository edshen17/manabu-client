<template>
  <div data-app>
    <grid-button-layout :step-title="stepTitle">
      <template v-slot:main>
        <form class="mb-0 space-y-6">
          <div>
            <input
              v-model="contactMethodId"
              v-focus="true"
              type="text"
              :placeholder="
                $t('onboarding.contactMethodIdInput', {
                  contactMethod: $t(`onboarding.contactMethods.${contactMethodName}`),
                })
              "
              class="form-border mx-auto place-items-center"
              @keydown.enter.prevent="handleEnterKeyPress"
            />
            <p v-show="$v.contactMethodId.$error" class="vuelidate-error mt-2">
              {{
                $t('error.onboarding.contactMethodId', {
                  contactMethod: $t(`onboarding.contactMethods.${contactMethodName}`),
                })
              }}
            </p>
          </div>
        </form>
      </template>
      <template v-slot:button>
        <grid-button
          :button-text="$t('onboarding.buttons.next')"
          class="absolute bottom-0"
          @click="handleEnterKeyPress"
        />
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
import { focus } from 'vue-focus';
import { required } from 'vuelidate/lib/validators';

export default Vue.extend({
  name: 'ContactMethodIdStep',
  components: { GridBaseLayout, GridButton, GridButtonLayout },
  directives: { focus },
  props: {
    stepTitle: {
      type: String,
      required: true,
    },
    contactMethodName: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      contactMethodId: '',
    };
  },
  computed: {},
  mounted() {
    return;
  },
  methods: {
    handleEnterKeyPress(): void {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.emitContactMethodId();
      }
    },
    emitContactMethodId(): void {
      EventBus.$emit('step-forward', {
        value: this.contactMethodId,
        emittedValueName: 'contactMethodId',
      });
    },
  },
  validations: {
    contactMethodId: {
      required,
    },
  },
});
</script>
