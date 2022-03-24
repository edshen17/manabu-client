<template>
  <div data-app>
    <grid-button-layout :step-title="stepTitle">
      <template #main>
        <form class="mb-0 space-y-6">
          <div>
            <input
              v-model="id"
              v-focus="true"
              type="text"
              :placeholder="
                $t('onboarding.contactMethodIdInput', {
                  contactMethod: $t(`contactMethod.${contactMethodName}`),
                })
              "
              class="form-border mx-auto place-items-center"
              @keydown.enter.prevent="handleEnterKeyPress"
            />
            <p v-show="$v.id.$error" class="vuelidate-error mt-2">
              {{
                $t('error.onboarding.contactMethodId', {
                  contactMethod: $t(`contactMethod.${contactMethodName}`),
                })
              }}
            </p>
          </div>
        </form>
      </template>
      <template #button>
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
import { EventBus } from '../../EventBus/EventBus';
import GridButtonLayout from '../Layouts/GridButtonLayout.vue';
import { focus } from 'vue-focus';
import { required } from 'vuelidate/lib/validators';

export default Vue.extend({
  name: 'ContactMethodIdStep',
  components: { GridButton, GridButtonLayout },
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
    contactMethodId: {
      type: String,
      required: false,
    },
    userData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      id: '',
    };
  },
  computed: {},
  mounted() {
    const contactMethods = this.userData.contactMethods;
    const savedContactMethodId = contactMethods.length > 0 ? contactMethods[0].address : '';
    this.id = this.contactMethodId || savedContactMethodId || '';
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
        value: this.id,
        emittedValueName: 'contactMethodId',
      });
    },
  },
  validations: {
    id: {
      required,
    },
  },
});
</script>
