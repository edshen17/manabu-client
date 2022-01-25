<template>
  <div class="bg-white h-auto mx-4 lg:mx-0">
    <vue-topprogress ref="topProgress"></vue-topprogress>
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
        <div class="h-auto w-full">
          <div class="flex m-4">
            <img :src="teacher.profileImageUrl" class="rounded-full h-16" />
            <div class="mx-4">
              <p class="text-lg">{{ teacher.name }}</p>
              <p>{{ getPackageName(pkg) }} / {{ duration }} mins</p>
              <p>{{ pkg.lessonAmount }} lessons</p>
              <p></p>
            </div>
          </div>
          <div v-if="packagePriceData">
            <div class="flex">
              <p class="flex-1 mx-4">Subtotal</p>
              <p class="mx-8">{{ packagePriceData.formattedSubTotal }}</p>
            </div>
            <div class="flex">
              <p class="flex-1 mx-4">Processing Fee</p>
              <p class="mx-8">{{ packagePriceData.formattedProcessingFee }}</p>
            </div>
            <div class="flex">
              <p class="flex-1 mx-4">Total</p>
              <p class="mx-8">{{ packagePriceData.formattedTotal }}</p>
            </div>
          </div>
          <div class="flex w-full">
            <button
              class="rounded-lg my-4 py-2 text-white w-full mx-5"
              :class="{
                'bg-indigo-500': !isPaymentButtonDisabled,
                'bg-gray-200 text-white-200': isPaymentButtonDisabled,
              }"
              @click="onPaymentClick"
            >
              Pay Now
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { makePackageMixin } from '../../mixins/package';
import DialogButton from './DialogButton.vue';
import { makePackageTransactionCheckoutRepository } from '@/repositories/checkout/packageTransaction';
import { StringKeyObject } from '@server/types/custom';
import { ls } from '@/store/plugins';
import { mapGetters } from 'vuex';
import { vueTopprogress } from 'vue-top-progress';
const packageTransactionCheckoutRepository = makePackageTransactionCheckoutRepository;

export default Vue.extend({
  name: 'PaymentCard',
  components: { DialogButton, vueTopprogress },
  mixins: [makePackageMixin],
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
    ...mapGetters({
      isLoggedIn: 'user/isLoggedIn',
    }),
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
    isPaymentButtonDisabled: {
      get(): boolean {
        const isPaymentButtonDisabled = this.selectedPaymentGateway.length == 0;
        return isPaymentButtonDisabled;
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
  created() {
    const paymentData = ls.get('paymentData');
    if (paymentData) {
      const { paymentGateway } = paymentData;
      this.selectedPaymentGateway = paymentGateway;
    }
  },
  methods: {
    onPaymentGatewayClick(paymentGateway: StringKeyObject): void {
      this.selectedPaymentGateway = paymentGateway.name;
    },
    async onPaymentClick(): Promise<void> {
      if (this.isLoggedIn) {
        (this as any).$refs.topProgress.start();
        const packageTransactionCheckoutRes = await packageTransactionCheckoutRepository.create({
          query: {
            paymentGateway: this.selectedPaymentGateway,
          },
          payload: {
            teacherId: this.teacher.teacherData._id,
            packageId: this.pkg._id,
            lessonDuration: this.duration,
            lessonLanguage: this.teacher.teacherData.teachingLanguages[0].code,
          },
        });
        (this as any).$refs.topProgress.done();
        const { data } = packageTransactionCheckoutRes;
        const { redirectUrl } = data;
        window.location.href = redirectUrl;
      } else {
        ls.set('paymentData', {
          teacher: this.teacher,
          timeslots: this.timeslots,
          duration: this.duration,
          pkg: this.pkg,
          paymentGateway: this.selectedPaymentGateway,
        });
        this.$router.push('/signup');
      }
    },
  },
});
</script>
