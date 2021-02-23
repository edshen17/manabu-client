<template>
  <div class="settings mt-4">
    <b-alert
      :show="dismissCountDown"
      dismissible
      variant="success"
      @dismissed="dismissCountDown=0"
      @dismiss-count-down="countDownChanged"
      class="mx-5"
    >
      Profile updated successfully!
    </b-alert>
    <b-row>
      <b-col md="2"></b-col>
      <b-col md="3">
        <div class="card mb-3" v-if="userData">
          <div class="card-body">
            <ul class="list-group list-group-flush profile-list">
              <li class="list-group-item">
                <b-link @click="viewingCard = 'General'">General</b-link>
              </li>
              <li class="list-group-item">
                <b-link @click="viewingCard = 'Payment'">Payment</b-link>
              </li>
            </ul>
          </div>
        </div>
      </b-col>
      <b-col md="5">
        <div class="card mb-3" v-if="userData">
          <div class="card-body">
            <div class="form-group">
              <div v-show="viewingCard == 'General'">
                <div class="form-group">
                  <label><b>Currency</b></label>
                  <b-form-select
                    v-model="selected.currency"
                    :options="options.currency"
                    size="md"
                    class="mt-1"
                    @change="updateSettings"
                  ></b-form-select>
                </div>
              </div>
            </div>
            <div v-show="viewingCard == 'Payment'">p</div>
          </div>
        </div>
      </b-col>
      <b-col md="2"></b-col>
    </b-row>
  </div>
</template>
<script>
import axios from 'axios';
import LayoutDefault from './layouts/LayoutDefault';
import formatString from '../assets/scripts/formatString';
import store from '../store/store';
export default {
    name: 'Settings',
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
    created() {
        this.$emit('update:layout', LayoutDefault);
    },
    data() {
        return {
          dismissSecs: 2,
        dismissCountDown: 0,
            host: 'api',
            userData: null,
            viewingCard: 'General',
            options: {
                fluentLanguage: [
                { value: null, text: 'Please select an option' },
                { value: 'a', text: 'This is First option' },
                { value: 'b', text: 'Selected Option' },
                { value: { C: '3PO' }, text: 'This is an option with object value' },
                { value: 'd', text: 'This one is disabled', disabled: true }
                ],
                nonFluentLanguage: [
                { value: null, text: 'Please select an option' },
                { value: 'a', text: 'This is First option' },
                { value: 'b', text: 'Selected Option' },
                { value: { C: '3PO' }, text: 'This is an option with object value' },
                { value: 'd', text: 'This one is disabled', disabled: true }
                ],
                timezone: [
                { value: null, text: 'Please select an option' },
                { value: 'a', text: 'This is First option' },
                { value: 'b', text: 'Selected Option' },
                { value: { C: '3PO' }, text: 'This is an option with object value' },
                { value: 'd', text: 'This one is disabled', disabled: true }
                ],
                currency: [
                { value: 'SGD', text: '$ SGD' },
                { value: 'USD', text: '$ USD' },
                { value: 'JPY', text: '¥ JPY' },
                ]
            },
            selected: {
                timezone: null,
                currency: 'SGD',
            }
        }
    },
    methods: {
      updateSettings() {
        const updatedSettings = {
          currency: this.selected.currency,
        }
        axios.put(`${this.host}/user/${this.userData._id}/updateProfile`, { settings: updatedSettings }, { headers: {
                'X-Requested-With': 'XMLHttpRequest'
              }}).then((res) => {
                if (res.status == 200) {
                  this.showAlert()
                }
              }).catch((err) => { console.log(err) })
      },
      countDownChanged(dismissCountDown) {
        this.dismissCountDown = dismissCountDown
      },
      showAlert() {
        this.dismissCountDown = this.dismissSecs
      }
    },
    mounted() {
        this.userData = this.storeUserData;
        this.selected.currency = this.userData.settings.currency || 'SGD'
    },
}
</script>

<style lang="css">
@import "../../src/assets/css/styles.css";
</style>
