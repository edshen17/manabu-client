<template>
  <div class="Dashboard">
    <b-modal
      id="edit-pic"
      size="lg"
      :no-close-on-backdrop="true"
      v-if="userData"
    >
      <!-- <img :src="userData.profileImage"/> -->
      <cropper
        class="cropper"
        stencil-component="circle-stencil"
        minWidth="1000"
        maxWidth="1000"
        :stencil-props="{
          handlers: {},
          movable: false,
          scalable: false,
          aspectRatio: 1,
        }"
        image-restriction="stencil"
        :src="img"
      />
    </b-modal>
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
              <label
                >My
                {{ languageCodeToText(formData.nonFluentLanguage, optionsSecondaryLanguage) }}
                level is</label
              >
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
          <div class="card profile-card">
            <div class="card-body">
              <div class="picture-container">
                <i class="fas fa-edit profile-edit-icon" v-show="isHoveringPic"
                @mouseover="isHoveringPic = true" @mouseleave="isHoveringPic = false"
                @click="editProfile"></i>
                <img
                  id="dashboard-profile"
                  alt="100x100"
                  :src="imageSourceEdit(userData.profileImage, '/img/no-profile.849c29fe.webp')"
                  @mouseover="isHoveringPic = true" @mouseleave="isHoveringPic = false"
                  @click="editProfile"
                />
                 <input
                  type="file"
                  ref="file"
                  class="hide"
                  @change="selectImage($event)"
                  accept="image/*"
                />
              </div>
              <div class="text-center mt-2">
                <h5>{{ this.userData.name}}</h5>
                <div
                  v-for="lang in userData.fluentLanguages.concat(userData.nonFluentLanguages)"
                  :key="lang"
                  class="mx-1"
                  style="display: inline"
                >
                  {{ lang }}
                  <span
                    v-for="(n, i) in 5"
                    :key="i"
                    class="level"
                    :class="languageLevelBars(lang, i)"
                  ></span>
                </div>
              </div>
              <p class="mt-2">{{this.userData.profileBio}} Goals/etc here</p>
            </div>
          </div>
        </b-col>
        <b-col sm="5">
          <div v-if="appointments.length > 0">
            <div
              class="card mb-3"
              v-for="apt in appointments"
              :key="apt._id"
              :class="apt.status + '-card'"
            >
              <div class="card-header">
                <span class="mt-2"
                  >Appointment with {{ apt.userData.name }} --
                  {{apt.status}}</span
                >
              </div>
              <div class="card-body">
                <img
                  class="mini-image"
                  alt="100x100"
                  :src="imageSourceEdit(apt.userData.profileImage, '/img/no-profile.849c29fe.webp')"
                />
                <p>
                  {{formatDate(apt.from, 'MMM DD @ h:mma')
                  }}-{{formatDate(apt.to, 'h:mma')}} on Skype (teacher.username)
                </p>
                <p>Lesson plan:</p>
              </div>
            </div>
          </div>
          <div v-else>no appointments yet, find a teacher</div>
        </b-col>
        <b-col sm="2"></b-col>
      </b-row>

      <div>
        <!-- <edit-calendar hostedBy="5fe4ab8725e273284ca99bd8"></edit-calendar> -->
        <view-calendar :reservedBy="userId" hostedBy='5fe4ab8725e273284ca99bd8' :reservationLength="60" :reservationSlotLimit="5" :rescheduleSlotLimit="5"></view-calendar>
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
import getUserData from '../assets/scripts/tokenGetter';
import getAppointments from '../assets/scripts/getAppointments';
import RegistrationForm from './steps/RegistrationForm';
import EditCalendar from './steps/EditCalendar';
import ViewCalendar from './steps/ViewCalendar';
import languageLevelBars from '../assets/scripts/languageLevelBars'
import fetchUserData from '../assets/scripts/fetchUserData'
import imageSourceEdit from '../assets/scripts/imageSourceEdit'
import { Cropper } from "vue-advanced-cropper";
import firebase from 'firebase/app';
import 'firebase/storage';
const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID,
};
const app = firebase.initializeApp(firebaseConfig) 

export default {
    async mounted() {
      
        const storage = app.storage();
        const ref = storage.ref('path')
        console.log(ref)

        const user = await getUserData();
        const from = dayjs().toISOString()
        const to = dayjs().add(1, 'week').toISOString();
        this.userData = user.data;
        this.userId = this.userData._id;
        const isStudent = this.userData.role == 'user' && this.userData.teacherAppPending != true;
        const isTeacher = this.userData.role == 'teacher';
        this.appointments = await getAppointments(this.userId, isStudent, from, to);
        for (let i = 0; i < this.appointments.length; i++) {
          this.loading = true;
          if (isStudent) {
            this.appointments[i].userData = await fetchUserData(this.appointments[i].hostedBy);
          } else if (isTeacher) {
            this.appointments[i].userData = await fetchUserData(this.appointments[i].reservedBy);
          } else {
            this.appointments[i].userData = await fetchUserData(this.appointments[i].hostedBy);
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
        Cropper,
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
            img: 'https://images.pexels.com/photos/4323307/pexels-photo-4323307.jpeg',
            isEditingImage: false,
            image: null,
            isHoveringPic: false,
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
    editProfile() {
      this.$bvModal.show('edit-pic');
    },
    imageSourceEdit,
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
        },
    selectImage(event) {
      // Reference to the DOM input element
      const input = event.target;
      // Ensure that you have a file before attempting to read it
      if (input.files && input.files[0]) {
        // create a new FileReader to read this image and convert to base64 format
        const reader = new FileReader();
        // Define a callback function to run, when FileReader finishes its job
        reader.onload = (e) => {
          // Read image as base64 and set to imageData
          this.image = e.target.result;
        };
        // Start the reader job - read file as a data url (base64 format)
        reader.readAsDataURL(input.files[0]);
      }

      // this.$refs.file.value = "";
      // this.isEditingImage = !this.isEditingImage;
      // this.image = null;
    },
    },
}
</script>

<style lang="css">
@import "../../src/assets/css/styles.css";

.modal-header .close {
  display: none !important;
}

.d-flex .spinner-border {
  height: 3.5rem;
  width: 3.5rem;
}

.cropper {
  height: 500px;
	background: #DDD;
}
</style>
