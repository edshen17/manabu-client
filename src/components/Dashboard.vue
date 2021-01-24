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
          v-if="userData.role == 'user' && !userData.teacherAppPending"
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
          v-if="userData.teacherAppPending"
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
              <label>My {{ languageCodeToText(formData.nonFluentLanguage, optionsSecondaryLanguage) }} level is</label>
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
    <div v-if="!loading" class="mt-5">
 <b-row>
   <b-col sm="2"></b-col>
    <b-col sm="3">
        <div class="card">
        <div class="card-body">
         <img v-if="userData.profileImage == ''"
          class="rounded-circle"
          id="dashboard-profile"
          alt="100x100"
          src='../../src/assets/images/no-profile.webp'
        />
        <img v-else
          id="dashboard-profile"
          class="rounded-circle"
          alt="100x100"
          :src="userData.profileImage"
        />
        <div class="text-center mt-2">
          <h5>{{ this.userData.name}}</h5>
          <div v-for="lang in userData.fluentLanguages.concat(userData.nonFluentLanguages)" :key="lang" class="mx-1" style="display: inline">
            {{ lang }}
            <span v-for="(n, i) in 5" :key="i" class="level" :class="languageLevelBars(lang, i)"></span>       
          </div>
        </div>
        <!-- {{this.userData}} -->
        </div>
      </div>
    </b-col>
    <b-col sm="5">
      <div v-if="appointments.length > 0">
        <div class="card mb-3" v-for="apt in appointments" :key="apt._id" :class="apt.status + '-card'">
          <div class="card-header">
            <span class="mt-2">Appointment with {{ apt.userData.name }} -- {{apt.status}}</span>
          </div>
          <div class="card-body">
            <img v-if="apt.userData.profileImage == ''"
                class="mini-image"
                alt="100x100"
                src='../../src/assets/images/no-profile.webp'
              />
              <img v-else
                class="mini-image"
                alt="100x100"
                :src="userData.profileImage"
              />
            <p>{{formatDate(apt.from, 'MMM DD @ h:mma')}}-{{formatDate(apt.to, 'h:mma')}} on Skype (teacher.username)</p>
            <p>Lesson plan:</p>
          </div>
        </div>
      </div>
      <div v-else>
        no appointments yet, find a teacher
      </div>
    

    </b-col>
    <b-col sm="2"></b-col>
        
  </b-row>
      
      <div>
        <edit-calendar hostedBy='5fe4ab8725e273284ca99bd8'></edit-calendar> 
        <!-- <view-calendar :reservedBy="userId" hostedBy='5fe4ab8725e273284ca99bd8' :reservationLength="60" :reservationSlotLimit="5" :rescheduleSlotLimit="5"></view-calendar> -->
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
// import axios from 'axios';
// import { required, minLength, email, between } from 'vuelidate/lib/validators'
import dayjs from 'dayjs'
import LayoutDefault from './layouts/LayoutDefault';
import TeacherDashboard from './TeacherDashboard';
import getUserData from '../assets/scripts/tokenGetter';
import getAppointments from '../assets/scripts/getAppointments';
import RegistrationForm from './steps/RegistrationForm';
import EditCalendar from './steps/EditCalendar';
import ViewCalendar from './steps/ViewCalendar';
import languageLevelBars from '../assets/scripts/languageLevelBars'
import fetchUserData from '../assets/scripts/fetchUserData'


export default {
    async mounted() {
        const user = await getUserData();
        const from = dayjs().toISOString()
        const to = dayjs().add(1, 'week').toISOString();
        this.userData = user.data;
        this.userId = this.userData._id;
        const isStudent = this.userData.role == 'user' && this.userData.teacherAppPending != true;
        this.appointments = await getAppointments(this.userId, isStudent, from, to);
        for (let i = 0; i < this.appointments.length; i++) {
          this.loading = true;
          if (isStudent) {
            this.appointments[i].userData = await fetchUserData(this.appointments[i].hostedBy);
          } else {
            this.appointments[i].userData = await fetchUserData(this.appointments[i].reservedBy);
          }
        }
        this.loading = false;
        const filledOutForm = !(this.userData.fluentLanguages.length == 0
        && this.userData.nonFluentLanguages.length == 0 && !this.userData.region && !this.userData.timezone);

        // teacher form
        if (this.userData.teacherAppPending && !filledOutForm) {
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
            appointments: [],
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
                    { value: 'A1', text: 'Beginner (A1)' },
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
        }
    },
    methods: {
    formatDate(dateStr, format){
      return dayjs(dateStr).format(format);
    },
    fetchUserData,
    languageLevelBars,
    languageCodeToText(lc, optionArr) {
      const language = optionArr.find(code => code.value == lc);
      if (language != undefined) {
        return language.text;
      }
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
@import '../../src/assets/css/styles.css';

.modal-header .close {
  display: none !important;
}

.d-flex .spinner-border {
  height: 3.5rem;
  width: 3.5rem;
}

</style>
