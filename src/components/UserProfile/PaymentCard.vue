<template>
  <div class="bg-white h-auto min-h-screen mx-4 lg:mx-0">
    <div class="flex flex-wrap lg:flex-nowrap w-full lg:w-9/12 mx-auto lg:py-1">
      <div class="w-full lg:w-8/12 lg:mx-2">
        <div class="rounded-lg border-solid border-2 h-auto bg-white">
          <div class="justify-center px-4 pt-4 mx-auto">
            <p class="text-2xl mb-4">Payment Method</p>
            <dialog-button
              v-for="paymentGateway in paymentGateways"
              :key="paymentGateway.name"
              class="my-1"
              :class="{
                'bg-indigo-100 hover:bg-indigo-100 border-indigo-300':
                  selectedPaymentGateway == paymentGateway.name,
              }"
              @click="onPaymentGatewayClick(paymentGateway)"
            >
              <template v-slot:title>
                <div class="inline-flex items-center text-gray-600">
                  <i class="fa-lg mx-2 w-6 md:w-8" :class="paymentGateway.iconClass"></i>
                  <p class="text-lg capitalize px-1">
                    {{ $t(`payment.gateway.${paymentGateway.name}`) }}
                  </p>
                </div>
              </template>
            </dialog-button>
          </div>
        </div>
      </div>
      <div
        class="
          w-full
          lg:w-4/12 lg:mx-3
          max-h-96
          sticky
          top-24
          rounded-lg
          bg-white
          border-solid border-2
          my-5
          lg:my-0
        "
      >
        <div class="max-h-96 h-96">
          <div class="flex">{{ packagePriceData }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { StringKeyObject } from '../../../../server/types/custom';
import { makeExchangeRateMixin } from '../../mixins/exchangeRate';
import DialogButton from './DialogButton.vue';

export default Vue.extend({
  name: 'PaymentCard',
  components: { DialogButton },
  mixins: [makeExchangeRateMixin],
  props: {
    teacher: {
      type: Object,
      required: true,
    },
    timeslots: {
      type: Array,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    pkg: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      selectedPaymentGateway: '',
    };
  },
  computed: {
    paymentGateways: {
      get(): StringKeyObject[] {
        const paymentGateways = [
          {
            name: 'paypal',
            iconClass: 'fab fa-paypal',
          },
          {
            name: 'stripe',
            iconClass: 'fas fa-credit-card',
          },
        ];
        return paymentGateways;
      },
    },
  },
  asyncComputed: {
    packagePriceData: {
      async get(): Promise<StringKeyObject> {
        const packagePriceData = await (this as any).getPackagePriceData({
          teacher: this.teacher,
          pkg: this.pkg,
          lessonDuration: this.duration,
          paymentGateway: this.selectedPaymentGateway,
        });
        return packagePriceData;
      },
    },
  },
  mounted() {
    return;
  },
  methods: {
    onPaymentGatewayClick(paymentGateway: StringKeyObject): void {
      this.selectedPaymentGateway = paymentGateway.name;
    },
  },
});
</script>
