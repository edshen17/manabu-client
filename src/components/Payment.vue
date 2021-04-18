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
                  <div class="card-body price-card" @click="onMethodChange(method.method)" :class="{ 'active-card': method.method == selectedMethod }">
                    <h4 class="text-muted font-weight-light">
                      {{ method.method }}
                    </h4>
                  </div>
                </div>
                <div v-show="method.method == 'Credit / Debit Card' && selectedMethod == 'Credit / Debit Card'">
                  <credit-card-form></credit-card-form>
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
                    :src="imageSourceEdit(validatedData.teacherUserData.profileImage)"
                />
                <div class='payment-card' style="display: block">
                    <h4>{{ validatedData.teacherUserData.name }}</h4>
                    <p class='text-capitalize light-bold'> {{ validatedData.selectedPlan }} plan ({{ validatedData.selectedDuration }} minutes)</p>
                    <h5 class="mt-5">Subtotal: {{ subTotal.toFixed(2) }} {{userData.settings.currency}}</h5>
                    <h5>Processing fee: {{ (subTotal*(processingRate)).toFixed(2)  }} {{userData.settings.currency}}</h5>
                    <h5>Total: {{ (totalPrice * (1+processingRate)).toFixed(2) }} {{userData.settings.currency}}</h5>
                </div>
              </h5>
              <b-button
                variant="dark"
                class="mx-3 my-3 manabu-blue"
                :disabled="isDisabled"
                @click="proceedPayment"
                >PAY NOW</b-button
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
import CreditCardForm from './steps/CreditCardForm';
import imageSourceEdit from '../assets/scripts/imageSourceEdit';
import convertMoney from '../assets/scripts/convertMoney';
import store from '../store/store';
import axios from 'axios';
export default {
    name: 'Payment',
    components: {
      CreditCardForm,
    },
    created() {
        this.$emit('update:layout', LayoutDefault);
    },
    props: {
        transactionData: Object,
        myUserData: Object,
    },
        computed: {
      storeUserData: {
        get() {
          return store.getters.userData;
        },
        set(userData) {
          return userData;
        }
        }
    },
    data() {
        return {
            loading: true,
            isDisabled: true,
            host: '/api',
            paymentMethods: [
                // {
                //     method: 'Credit / Debit Card',
                //     processingRate: .03,
                // },
                {
                    method: 'PayPal',
                    processingRate: .03,
                }
            ],
            selectedMethod: null,
            validatedData: null,
            subTotal: 0,
            totalPrice:0,
            userData: null,
        }
    },
    methods: {
      onMethodChange(method) {
        this.selectedMethod = method; 
        this.isDisabled = false
        this.processingRate = this.paymentMethods.find((paymentMethod) => { return paymentMethod.method == method }).processingRate;
      },
        imageSourceEdit,
        proceedPayment() {
          let transactionData = this.transactionData;
          if (!transactionData) {
              try {
                 transactionData = JSON.parse(localStorage.getItem('transactionData'));
              } catch (err) {
                console.log('JSON Parse Error')
              }
            }
          transactionData.selectedMethod = this.selectedMethod;

          if (this.selectedMethod == 'PayPal') {
            axios.post('/api/pay', transactionData).then((res) => {
              if (res.status == 200) {
                window.location.href = res.data.redirectLink;
                return false;
              }
            }).catch((err) => { //err
              console.log(err);
            })
          }
        },
    },
    mounted() {
        try {
            const transactionData = this.transactionData || JSON.parse(localStorage.getItem('transactionData'));
            const myUserData = this.myUserData || this.storeUserData;
            this.userData = myUserData;
            if (transactionData) {
                const { hostedBy, reservedBy, selectedPlan, selectedDuration, selectedSubscription, selectedPackageId, selectedLanguage } = transactionData
                return axios.get(`${this.host}/utils/verifyTransactionData`, { params: { hostedBy, reservedBy, selectedPlan, selectedDuration, selectedSubscription, selectedPackageId, selectedLanguage, 'selectedMethod': null, } }, { headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }}).then((res) => {
                    if (res.status == 200) {
                        this.loading = false;
                        this.validatedData = res.data;
                        const { exchangeRate, transactionPrice } = res.data;
                        this.subTotal = convertMoney(transactionPrice, 'SGD', myUserData.settings.currency, true, exchangeRate)
                        this.processingRate = 0;
                        this.totalPrice = this.subTotal * (this.processingRate + 1)
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
