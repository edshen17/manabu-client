<template>
  <div class="settings mt-4">
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
                  <label>Target Language</label>
                  <b-form-select
                    v-model="selected.currency"
                    :options="options.currency"
                    size="md"
                    class="mt-1"
                  ></b-form-select>
                </div>
                <div class="form-group">
                  <label>Fluent Language</label>
                  <b-form-select
                    v-model="selected.currency"
                    :options="options.currency"
                    size="md"
                    class="mt-1"
                  ></b-form-select>
                </div>
                <div class="form-group">
                  <label>Currency</label>
                  <b-form-select
                    v-model="selected.currency"
                    :options="options.currency"
                    size="md"
                    class="mt-1"
                  ></b-form-select>
                </div>
                <div class="form-group">
                  <label>Region/Timezone</label>
                  <b-form-select
                    v-model="selected.currency"
                    :options="options.currency"
                    size="md"
                    class="mt-1"
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
                { value: null, text: 'Please select an option' },
                { value: 'a', text: 'This is First option' },
                { value: 'b', text: 'Selected Option' },
                { value: { C: '3PO' }, text: 'This is an option with object value' },
                { value: 'd', text: 'This one is disabled', disabled: true }
                ]
            },
            selected: {
                timezone: null,
                currency: null,
            }
        }
    },
    methods: {},
    mounted() {
        this.userData = this.storeUserData;
    },
}
</script>

<style lang="css">
@import "../../src/assets/css/styles.css";
</style>
