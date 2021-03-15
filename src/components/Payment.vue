<template>
  <div class="Payment mt-5" v-if="!loading">
      <b-container fluid>
      <b-row>
        <b-col lg="2"></b-col>
        <b-col lg="5" style="z-index: 100">
          <div class="card profile-card mb-3 shadow border-0">
            <div class="card-body">
              <h3 class="mb-3">Payment Method</h3>
              <div v-for="method in paymentMethods" :key="method.method">
                <div
                  class="card profile-card mb-3 shadow border-0"
                >
                  <div class="card-body price-card" @click="selectedMethod = method.method" :class="{ 'active-card': method.method == selectedMethod }">
                    <h4 class="text-muted font-weight-light">
                      {{ method.method }}
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </b-col>
        <b-col lg="3" class="button-wrapper">
          <div class="sticky-top">
            <div class="card profile-card mb-3 shadow border-0">
              <h5 class="font-weight-light mt-3 mx-3">
               <img
                    class="mid-image mr-3 mb-3"
                    alt="100x100"
                    :src="imageSourceEdit(validatedData.teacherData.profileImage)"
                />
                <div class='payment-card' style="display: block">
                    <h4>{{ validatedData.teacherData.name }}</h4>
                    <p class='text-capitalize light-bold'> {{ validatedData.selectedPlan }} plan ({{ validatedData.selectedDuration }} minutes)</p>
                    <h5 class="mt-5">Subtotal</h5>
                    <h5>Processing fee</h5>
                    <h5>Total</h5>
                </div>
              </h5>
              <b-button
                variant="dark"
                class="mx-3 my-3 manabu-blue"
                >BOOK NOW</b-button
              >
            </div>
          </div>
        </b-col>
        <b-col lg="2"></b-col>
      </b-row>
    </b-container>
  </div>
  <div v-else>
      <div class="d-flex justify-content-center my-4">
        <b-spinner label="Loading..."></b-spinner>
      </div>
    </div>
</template>
<script>
import LayoutDefault from './layouts/LayoutDefault';
import imageSourceEdit from '../assets/scripts/imageSourceEdit';

import axios from 'axios';
export default {
    name: 'Payment',
    created() {
        this.$emit('update:layout', LayoutDefault);
    },
    props: {
        transactionData: Object,
    },
    data() {
        return {
            loading: true,
            host: '/api',
            paymentMethods: [
                {
                    method: 'Credit / Debit Card'
                },
                {
                    method: 'PayPal'
                }
            ],
            selectedMethod: null,
            validatedData: null,
        }
    },
    methods: {
        imageSourceEdit,
    },
    mounted() {
        try {
            const transactionData = this.transactionData || JSON.parse(localStorage.getItem('transactionData'));
            if (transactionData) {
                const { hostedBy, reservedBy, selectedPlan, selectedDuration, selectedSubscription, selectedPackageId } = transactionData
                return axios.get(`${this.host}/utils/verifyTransactionData`, { params: { hostedBy, reservedBy, selectedPlan, selectedDuration, selectedSubscription, selectedPackageId } }, { headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }}).then((res) => {
                    if (res.status == 200) {
                        this.loading = false;
                        this.validatedData = res.data
                        console.log(this.validatedData)
                    } else {
                        //err
                    }
                });

            } else { // err

            }
        } catch(err) {
           console.log(err)
        }
    }
}
</script>

<style lang="css">
@import "../../src/assets/css/styles.css";
</style>
