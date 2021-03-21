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
      Settings updated successfully!
    </b-alert>
    <b-row>
      <b-col md="2"></b-col>
      <b-col md="3">
        <div class="card mb-3 shadow border-0" v-if="userData">
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
        <div class="card mb-3 shadow border-0" v-if="userData">
          <div class="card-body">
            <div class="form-group">
              <div v-show="viewingCard == 'General'">
                <div class="form-group">
                  <label><b>Currency</b></label>
                  <b-form-select
                    v-model="selected.currency"
                    :options="options.currency"
                    size="md"
                    class="my-2"
                  ></b-form-select>
                  <label><b>Preferred Communication Tool</b></label>
                  <b-form-select
                    v-model="selected.commMethod.method"
                    :options="options.commMethod"
                    size="md"
                    @change="changeComms"
                  ></b-form-select>
                  <b-form-input class='mt-2' v-model="selected.commMethod.id" :placeholder="`${selected.commMethod.method} ID`"></b-form-input>
                </div>
              </div>
            </div>
            <div v-show="viewingCard == 'Payment'">p</div>
            <b-button @click="updateSettings" variant="primary" class="float-right"> Save Changes </b-button>
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
                commMethod: ['Line', 'Skype', 'Discord',],
                currency: [
                { value: 'SGD', text: '$ SGD' },
                { value: 'USD', text: '$ USD' },
                { value: 'JPY', text: '¥ JPY' },
                ]
            },
            selected: {
                currency: 'SGD',
                commMethod: {
                  method: '',
                  id: '',
                },
            }
        }
    },
    methods: {
      changeComms() {
        let newCommMethod = JSON.parse(JSON.stringify(this.userData.commMethods)).find((m) => { return m.method == this.selected.commMethod.method })
        if (!newCommMethod) {
          newCommMethod = {
                  method: this.selected.commMethod.method,
                  id: '',
                }
        }
        this.selected.commMethod = newCommMethod;
      },
      updateSettings() {
        if (this.selected.commMethod.method && this.selected.commMethod.id) {
         const updatedSettings = {
          currency: this.selected.currency,
        }
        axios.put(`${this.host}/user/${this.userData._id}/updateProfile`, { settings: updatedSettings, commMethods: this.selected.commMethod }, { headers: {
                'X-Requested-With': 'XMLHttpRequest'
              }}).then((res) => {
                if (res.status == 200) {
                  this.showAlert();
                  store.commit('setUserData', res.data);
                }
              }).catch((err) => { console.log(err) }) 
        } else {
          alert('Please input a value in the communication tool ID field')
        }
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
        this.selected.currency = this.userData.settings.currency || 'SGD';
        this.selected.commMethod = JSON.parse(JSON.stringify(this.userData.commMethods[0])) || {};
    },
}
</script>

<style lang="css">
@import "../../src/assets/css/styles.css";
</style>
