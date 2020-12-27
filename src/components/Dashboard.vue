<template>
  <div class="Dashboard">
    <b-modal
      id="reg-form"
      size="lg"
      :no-close-on-backdrop="true"
      :hide-footer="true"
    >
      <template #modal-title>
        <div>Welcome to Manabu! Let us know about you!</div>
      </template>
      <div v-if="userData">
        <registration-form
          v-on:form-submitted="hideModal"
          submitButtonText="Submit"
          :formData="formData"
          endpoint="/user"
          v-if="userData.data.role == 'user' && !userData.data.teacherAppPending"
        >
          <template v-slot:uniqueSelect>
            <div class="form-group">
              <label>Target Language</label>
              <b-form-select
                v-model="formData.nonFluentLanguage"
                :options="optionsPrimaryLanguage"
                size="md"
                :userId="userId"
              ></b-form-select>
            </div>
            <div class="form-group">
              <label>Target Language Level</label>
              <b-form-select
                v-model="formData.level"
                :options="optionsLevel"
                size="md"
                :select-size="3"
              ></b-form-select>
            </div>
            <div class="form-group">
              <label>Native Language</label>
              <b-form-select
                v-model="formData.fluentLanguage"
                :options="optionsSecondaryLanguage"
                size="md"
              ></b-form-select>
            </div>
          </template>
        </registration-form>
        <registration-form
          v-on:form-submitted="hideModal"
          submitButtonText="Submit"
          :formData="formData"
          endpoint="/user"
          v-if="userData.data.teacherAppPending"
        >
          <template v-slot:uniqueSelect>
            <div class="form-group">
              <label>I will be teaching</label>
              <b-form-select
                v-model="formData.fluentLanguage"
                :options="optionsPrimaryLanguage"
                size="md"
                :userId="userId"
              ></b-form-select>
            </div>
            <div class="form-group">
              <label>I can also speak</label>
              <b-form-select
                v-model="formData.nonFluentLanguage"
                :options="optionsSecondaryLanguage"
                size="md"
              ></b-form-select>
            </div>
            <div class="form-group">
              <label>My {{ formData.nonFluentLanguage }} level is</label>
              <b-form-select
                v-model="formData.level"
                :options="optionsLevel"
                size="md"
                :select-size="3"
              ></b-form-select>
            </div>
          </template>
        </registration-form>
      </div>
    </b-modal>
    <div v-if="userData">
      <div
        class="student-dashboard"
        v-show="userData.data.role == 'user' && !userData.data.teacherAppPending"
      >
        <div>
          {{userData.data}}
        </div>
      </div>

      <teacher-dashboard v-if="userData.data.role == 'teacher'">
      </teacher-dashboard>

      <!-- View for new teachers-->
      <div
        v-show="userData.data.role == 'user' && userData.data.teacherAppPending"
      >
        <!-- <edit-calendar :userId="userId"></edit-calendar> -->
        <view-calendar :userId="userId"></view-calendar>
      </div>
    </div>
    <div v-else>
      <div class="d-flex justify-content-center my-4">
        <b-spinner label="Loading..."></b-spinner>
      </div>
    </div>
  </div>
</template>

<script>
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import { required, minLength, email, between } from 'vuelidate/lib/validators'
import LayoutDefault from './layouts/LayoutDefault';
import TeacherDashboard from './TeacherDashboard';
import getUserData from '../assets/scripts/tokenGetter';
import RegistrationForm from './steps/RegistrationForm';
import EditCalendar from './steps/EditCalendar';
import ViewCalendar from './steps/ViewCalendar';
import { Kalendar } from 'kalendar-vue';

export default {
    async mounted() {
        this.userData = await getUserData();
        this.userId = this.userData.data._id;
        this.loading = false;
        const filledOutForm = !(this.userData.data.fluentLanguages.length == 0
        && this.userData.data.nonFluentLanguages.length == 0 && !this.userData.data.region && !this.userData.data.timezone)

        // teacher form
        if (this.userData.data.teacherAppPending && !filledOutForm) {
            this.formData.nonFluentLanguage = 'EN',
            this.formData.fluentLanguage = 'JP',
            this.showModal();
        }

        // user has not filled out registration form, so show form
        else if (!filledOutForm) {
            this.showModal();
        }
    },
    components: {
        TeacherDashboard,
        RegistrationForm,
        Kalendar,
        EditCalendar,
        ViewCalendar,
    },
    name: 'Dashboard',
    async created() {
        this.$emit('update:layout', LayoutDefault);
    },
    data() {
        return {
            userData: null,
            userId: '',
            formData: {
                nonFluentLanguage: 'JP',
                fluentLanguage: 'EN',
                level: 'B2',
            },
            host: 'http://localhost:5000/api',
            loading: true,
            optionsPrimaryLanguage: [
                    { value: 'JP', text: 'Japanese' },
                    { value: null, text: 'Other languages coming soon!', disabled: true }
                ],
                optionsLevel: [
                    { value: 'A2', text: 'Elementary (A2)' },
                    { value: 'B1', text: 'Intermediate (B1)' },
                    { value: 'B2', text: 'Upper Intermediate (B2)' },
                    { value: 'C1', text: 'Advanced (C1)' },
                    { value: 'C2', text: 'Proficient (C2)' },
                ],
                optionsSecondaryLanguage: [
                    { value: 'EN', text: 'English' },
                    { value: 'CN', text: 'Chinese' },
                    { value: 'KR', text: 'Korean' },
                ],
                calendar_settings: {
                    style: 'material_design',
                    view_type: 'week',
                    cell_height: 10,
                    scrollToNow: false,
                    start_day: new Date().toISOString(),
                    read_only: true,
                    day_starts_at: 0,
                    day_ends_at: 24,
                    overlap: false,
                    past_event_creation: false
                },
        }
    },
    methods: {
    reserveSlot() {
        alert('revers?')
    },
    showModal() {
        this.$bvModal.show('reg-form')
    },
    hideModal() {
        this.$bvModal.hide('reg-form')
        }
    },
}
</script>

<style lang="css">
/* @import '../../src/assets/css/styles.css'; */
.modal-header .close {
  display: none !important;
}

.d-flex .spinner-border {
  height: 3.5rem;
  width: 3.5rem;
}
</style>
