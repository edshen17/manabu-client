<template>
  <div>
    <input
      ref="inputRef"
      v-focus="true"
      :disabled="isDisabled"
      type="text"
      class="form-border"
      min="0"
      @change="validateInput"
    />
    <p v-show="$v.value.$error" class="vuelidate-error mt-3">
      {{ $t('error.currencyInput') }}
    </p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { useCurrencyInput } from 'vue-currency-input';
import { StringKeyObject } from '../../../../server/types/custom';
import { required, minValue, integer } from 'vuelidate/lib/validators';
import { focus } from 'vue-focus';

export default Vue.extend({
  name: 'CurrencyInput',
  components: {},
  directives: { focus },
  props: {
    value: {
      default: 0,
      required: true,
    },
    options: {
      type: Object,
      required: false,
      default(): StringKeyObject {
        return {};
      },
    },
    isDisabled: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  setup(props: StringKeyObject) {
    const { inputRef } = useCurrencyInput(props.options);
    return { inputRef };
  },
  data() {
    return {};
  },
  computed: {},
  mounted() {
    return;
  },
  methods: {
    validateInput(): void {
      this.$v.$touch();
    },
  },
  validations: {
    value: {
      required,
      minValue: minValue(0),
      integer,
    },
  },
});
</script>
