<template>
    <div class ="Dashboard">   
        <b-modal id="student-reg" size="lg" :no-close-on-backdrop="true" :hide-footer="true">
            <template #modal-title>
                <div>
                    Welcome to Manabu! Let us know about you!
                </div>
            </template>
            <student-registration v-on:student-reg-submit="hideModal"></student-registration>
        </b-modal> 
        <div v-if="userData"> <!--change here: if current-view = admin... from select dropdown-->
            <div class="student-dashboard" v-show="userData.data.role == 'user' || userData.data.role == 'admin'">
                <div>
                    stuff
                </div>
            </div>
        <teacher-dashboard v-if="userData.data.role == 'teacher'">
            <p v-if="userData">{{userData.data}}</p>
        </teacher-dashboard>
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
import getUserData from '../assets/scripts/tokenGetter'
import StudentRegistration from './steps/StudentRegistration.vue';

export default {
    async mounted() {
        this.userData = await getUserData();
        this.loading = false;
        
        // user has not filled out registration form, so show form
        if (this.userData.data.learnedLanguages.length == 0 && this.userData.data.learningLanguages.length == 0 && !this.userData.data.region && !this.userData.data.timezone) { 
            this.showModal();
        }
    },
    components: {
        TeacherDashboard,
        StudentRegistration
    },
    name: 'Dashboard',
    async created() {
        this.$emit('update:layout', LayoutDefault);
    },
    data() {
        return {
            userObj: '',
            userData: null,
            host: 'http://localhost:5000/api',
            loading: true,
        }
    },
    methods: {
    showModal() {
        this.$bvModal.show('student-reg')
    },
    hideModal() {
        this.$bvModal.hide('student-reg')
    }
    },
}
</script>

<style lang="css">
/* @import '../../src/assets/css/styles.css'; */
.modal-header .close {
  display:none !important;
}

.d-flex .spinner-border {
    height: 3.5rem;
    width: 3.5rem;
}

</style>