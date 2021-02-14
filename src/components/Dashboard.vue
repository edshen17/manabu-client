<template>
  <div class="Dashboard">
    <b-modal
      id="edit-pic"
      size="lg"
      :no-close-on-backdrop="true"
      v-if="userData"
      title="Edit profile image"
    >
      <img
        v-show="!isEditingImage"
        class="dashboard-profile no-cursor"
        alt="100x100"
        :src="imageSourceEdit(userData.profileImage)"
      />
      <preview
        class="no-cursor preview"
        v-show="isEditingImage"
        :width="200"
        :height="200"
        :image="profileImage.previewCropperImage.image"
        :coordinates="profileImage.previewCropperImage.coordinates"
      />
      <cropper
        v-show="isEditingImage"
        class="cropper mt-4"
        :debounce="false"
        stencil-component="circle-stencil"
        :src="profileImage.cropperImage"
        @change="change"
      />
      <template #modal-footer>
        <b-button @click="resetCanvas"> Exit </b-button>
        <label
          class="btn btn-primary"
          v-show="!isEditingImage"
        >
          <i class="fa fa-image"></i> Upload image
          <input
            type="file"
            style="display: none"
            name="image"
            ref="file"
            @change="selectFile($event, 'img')"
            accept="image/*"
          />
        </label>
        <b-button variant="primary" v-show="isEditingImage" @click="saveProfileImage"> Save </b-button>
      </template>
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
          v-on:form-submitted="onFormSubmit"
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
          v-on:form-submitted="onFormSubmit"
          submitButtonText="Submit"
          :formData="formData"
          endpoint="/user"
          v-if="userData.teacherAppPending"
        >
          <template v-slot:uniqueSelect>
            <div class="form-group">
              <label>I am a</label>
              <b-form-select
                v-model="formData.teacherType"
                :options="optionsTeacherType"
                size="md"
              ></b-form-select>
            </div>
             <div class="form-group" v-show="formData.teacherType == 'licensed'">
              <label for="license">Upload a PDF of your teaching license (if you cannot find it now, email it to us).</label>
              <input type="file" class="form-control-file" id="license" accept="application/pdf" @change="selectFile($event, 'pdf')">
            </div>
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
        <b-col md="2"></b-col>
        <b-col md="3">
          <div class="card profile-card mb-3" v-if="userData">
            <div class="card-body">
              <div class="picture-container">
                <img
                  class="dashboard-profile"
                  alt="100x100"
                  :src="imageSourceEdit(userData.profileImage)"
                  @mouseover="isHoveringPic = true"
                  @mouseleave="isHoveringPic = false"
                  @click="editProfile"
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
              <div class="mt-2 mb-0" v-show="!isEditingBio" style="cursor: pointer" @click="startEditBio" v-html="formatBio(userData.profileBio)"></div>
                <quill-editor ref="quillEditor"
                  class="my-3"
                  v-show="isEditingBio"
                  v-model="editedBio"
                  @change="ensureMaxChars($event)"
                  ></quill-editor>
                <span v-show="isEditingBio" :class="{ danger: this.maxInputLength - this.editedBio.replace(/<[^>]*>?/gm, '').length == 0 }">
                  {{this.maxInputLength - this.editedBio.replace(/<[^>]*>?/gm, '').length }} characters remaining
                </span>
                <b-button variant="primary" class="float-right mt-3" v-show="isEditingBio" @click="saveBio"> Save </b-button>
                <b-button variant="secondary" class="mr-2 float-right mt-3" v-show="isEditingBio" @click="cancelBio"> Cancel </b-button>
            </div>
          </div>
          <div class="card profile-card mb-3" v-if="userData">
            <div class="card-body">
              <ul class="list-group list-group-flush profile-list">
                <li class="list-group-item"><b-link v-scroll-to="'#edit-calendar'">My calendar</b-link></li>
                <li class="list-group-item"><b-link :to="`/user/${this.userId}`">View public profile</b-link></li>
              </ul>
            </div>
          </div>
        </b-col>
        <b-col md="5">
          <div v-if="userData.teacherAppPending">
            <div class="card mb-3">
              <div class="card-header">
                <span class="mt-2" >
                  To get approved for teaching, make an 1 hour appointment with Misaki
                </span>
              </div>
              <div class="card-body">
                <p>
                  Misaki will be interviewing you about your experience in teaching Japanese, etc.
                </p>
                <b-button variant="info" @click="adminTeacherTrans">Schedule appointment</b-button>
              </div>
            </div>
          </div>
            <div v-if="appointments.length > 0">
              <div
                class="card mb-3"
                v-for="apt in appointments"
                :key="apt._id"
                :class="apt.status + '-card'"
              >
                <div class="card-header">
                  <span class="mt-2" >Appointment with {{ apt.userData.name }} --
                    {{apt.status}}
                  </span>
                </div>
                <div class="card-body">
                  <img
                    class="mini-image"
                    alt="100x100"
                    :src="imageSourceEdit(apt.userData.profileImage)"
                  />
                  <p>
                    {{formatDate(apt.from, 'MMM DD @ h:mma')

                    }}-{{formatDate(apt.to, 'h:mma')}} on Skype (teacher.username)
                  </p>
                  <p>Appointment agenda:</p>
                </div>
              </div>
            </div>
            <div v-else>
              no appointments yet, find teacher
            </div>
        </b-col>
        <b-col md="2"></b-col>
      </b-row>

      <div>
        <edit-calendar :hostedBy="userData._id" v-if="userData.role == 'teacher' || userData.role == 'admin'" id="edit-calendar"></edit-calendar>
      </div>
    </div>
    <div v-else class="d-flex justify-content-center my-4">
      <b-spinner label="Loading..."></b-spinner>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import dayjs from 'dayjs'
import LayoutDefault from './layouts/LayoutDefault';
import myUserData from '../assets/scripts/tokenGetter';
import getAppointments from '../assets/scripts/getAppointments';
import RegistrationForm from './steps/RegistrationForm';
import EditCalendar from './steps/EditCalendar';
import ViewCalendar from './steps/ViewCalendar';
import languageLevelBars from '../assets/scripts/languageLevelBars'
import fetchUserData from '../assets/scripts/fetchUserData'
import imageSourceEdit from '../assets/scripts/imageSourceEdit'
import { store, storeMethods } from '../store/store'
import { Cropper, Preview } from "vue-advanced-cropper";
import 'vue-advanced-cropper/dist/style.css';
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
      components: {
        Cropper,
        Preview,
        RegistrationForm,
        EditCalendar,
        ViewCalendar,
    },
    name: 'Dashboard',
    created() {
        this.$emit('update:layout', LayoutDefault);
    },
   data() {
        return {
            profileImage: {
              original: null,
              updated: null,
              cropperImage: null,
              previewCropperImage: {
                image: null,
                canvas: null,
              },
            },
            adminToTeacherPkgId: '601b440caa3c3a4380857080',
            adminId: '5ffd141ad1948a0e6c7de492',
            isEditingImage: false,
            isEditingBio: false,
            editedBio: '',
            isHoveringPic: false,
            userData: null,
            userId: '',
            appointments: [],
            formData: {
                nonFluentLanguage: 'JP',
                fluentLanguage: 'EN',
                level: 'B2',
                teacherType: 'unlicensed',
                license: null,
            },
            host: 'http://localhost:5000/api',
            loading: true,
            maxInputLength: 2000,
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
                optionsTeacherType: [
                    { value: 'unlicensed', text: 'unlicensed teacher' },
                    { value: 'licensed', text: 'licensed/professional teacher' },
                ],
        }
    },
    async mounted() {
      setTimeout(() => {
        console.log(store.userData, "dashboard")
      }, 500)
        const user = await myUserData();
        const from = dayjs().toISOString()
        const to = dayjs().add(1, 'week').toISOString();
        this.userData = user.data;
        this.userId = this.userData._id;
        this.profileImage.original = this.userData.profileImage;
        this.editedBio = this.userData.profileBio.trim();
        this.appointments = await getAppointments(this.userId, from, to);
        for (let i = 0; i < this.appointments.length; i++) {
          if (this.appointments[i].hostedBy == this.userId) {
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

    methods: {
      ensureMaxChars({ text }) {
        if (text.length > this.maxInputLength) {
          const quillRef = this.$refs.quillEditor.quill
          quillRef.deleteText(this.maxInputLength, quillRef.getLength());
        }
      },
      // used when user clicks on their profile
      startEditBio() {
        this.isEditingBio = true;
        setTimeout(() => { 
          const quillRef = this.$refs.quillEditor.quill
          quillRef.setSelection(quillRef.getLength());
        })
        
      },
      cancelBio() {
        this.isEditingBio = false;
        this.editedBio = this.userData.profileBio;
      },
      saveBio() {
        axios
            .put(
              `${this.host}/user/${this.userData._id}/updateProfile`,
              { profileBio: this.editedBio.trim() },
              { headers: {
                'X-Requested-With': 'XMLHttpRequest'
              }}
            )
            .then((res) => {
              if (res.status == 200) {
                this.isEditingBio = false;
                this.userData.profileBio = this.editedBio.trim();
              }
            })
            .catch((err) => {
              // if err, alert
              console.log(err);
            });
      },
      formatBio(bio) {
        if (!bio) {
          let defaultBio = '';
          if (this.userData.role == 'teacher' || this.userData.teacherAppPending) {
            
            defaultBio = `<p><strong>About Me</strong></p><ul><li>Where are you from? Your hobbies?</li></ul><p><strong>My qualifications</strong></p><ul><li>How long have you been teaching for? What are your qualifications/do you have a teaching license?</li></ul><p><strong>How I teach</strong></p><ul><li>How do you teach students?</li></ul>`
            this.editedBio = defaultBio;
          } else {
            defaultBio = 'Click here to write about yourself or your goals.';
          }
          this.userData.profileBio = defaultBio;
          return defaultBio
        } else {
            if (bio.length < 350) return bio;
            return `${bio.substring(0, 350)}<em>...</em>`;
        }
      },
      saveProfileImage() {
        this.$bvModal.hide('edit-pic');
        this.isEditingImage = false;
        try {
          const metaData = {
            contentType: "image/png",
          };
          const storageRef = app.storage().ref();
          const imageRef = storageRef.child(
            `images/${this.userData._id}_profilePic.png`
          );
          this.canvas.toBlob(async (blob) => {
            await imageRef.put(blob, metaData);
            const downloadUrl = await imageRef.getDownloadURL();
            axios
              .put(
                `${this.host}/user/${this.userData._id}/updateProfile`,
                { profileImage: downloadUrl },
                { headers: {
                  'X-Requested-With': 'XMLHttpRequest'
                }}
              )
              .then((res) => {
                if (res.status == 200) {
                  this.userData.profileImage = downloadUrl;
                }
              })
              .catch((err) => {
                // if err, alert
                console.log(err);
              });
          });
        } catch (error) {
          console.log(error);
        }
      },
      resetCanvas() {
        this.canvas = null;
        this.profileImage.previewCropperImage.image = { width: 0, height: 0};
        this.profileImage.previewCropperImage.canvas = null;
        this.profileImage.cropperImage = null;
        this.$bvModal.hide('edit-pic');
        this.isEditingImage = false;
      },
      change({ coordinates, image, canvas }) {
        this.canvas = canvas;
        this.profileImage.previewCropperImage = {
          coordinates,
          image,
        }
      },
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
      async onFormSubmit() {
          this.$bvModal.hide('reg-form');
          if (this.formData.license != null) {
            const storageRef = app.storage().ref();
            const fileRef = storageRef.child(
              `teachingLicenses/${this.userData._id}_license.png`
            );

            await fileRef.put(this.formData.license);
            const downloadUrl = await fileRef.getDownloadURL();
            axios
              .put(
                `${this.host}/teacher/${this.userData._id}/updateProfile`,
                { licensePath: downloadUrl, teacherType: 'licensed' },
                { headers: {
                  'X-Requested-With': 'XMLHttpRequest'
                }}
              )
              .catch((err) => {
                // if err, alert
                console.log(err);
              });
          }
      },
      selectFile(event, fileType) {
        // Reference to the DOM input element
        const input = event.target;
        // Ensure that you have a file before attempting to read it
        if (input.files && input.files[0]) {
          if (fileType == 'img') {
            // create a new FileReader to read this image and convert to base64 format
            const reader = new FileReader();
            // Define a callback function to run, when FileReader finishes its job
            reader.onload = (e) => {
              // Read image as base64 and set to imageData
              this.profileImage.cropperImage = e.target.result;
            };
            // Start the reader job - read file as a data url (base64 format)
            reader.readAsDataURL(input.files[0]);
            this.isEditingImage = !this.isEditingImage;
          }
           else if (fileType == 'pdf') {
            this.formData.license = input.files[0];
          }
        }
      },
      // create transaction between admin and teacher
      adminTeacherTrans() {
        const adminToTeacher = {
          hostedBy: this.adminId,
          packageId: this.adminToTeacherPkgId,
          reservedBy: this.userData._id,
          terminationDate: dayjs().add(1, 'month').toDate(),
          remainingAppointments: 1,
          remainingReschedules: 5,
          reservationLength: 60,
        }
        axios.post(`${this.host}/transaction/createPackageTransaction`, adminToTeacher, { headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }}).then((res) => {
              if (res.status == 200) {
                this.$router.push(`/calendar/${adminToTeacher.hostedBy}/${res.data._id}`);
              }
            }).catch((err) => {
              console.log(err)
            })
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
  background: #ddd;
}
</style>
