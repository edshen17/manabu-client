<template>
    <div class ="Dashboard">   
        <b-modal id="student-reg" size="lg" :no-close-on-backdrop="true" :hide-footer="true">
            <template #modal-title>
                <div>
                    Welcome to Manabu! Let us know about you!
                </div>
            </template>
            <registration-form v-on:form-submitted="hideModal" 
                submitButtonText='Submit' :formData="formData" endpoint="/user">
                <template v-slot:uniqueSelect>
                    <div class="form-group">
                                <label>Target Language</label>
                                <b-form-select v-model="formData.targetLanguage" :options="optionsLearningLanguage" size="md" :userId="userId"></b-form-select>
                            </div>
                            <div class="form-group">
                                <label>Target Language Level</label>
                                <b-form-select v-model="formData.level" :options="optionsLevel" size="md" :select-size="3"></b-form-select>
                            </div>
                            <div class="form-group">
                                <label>Native Language</label>
                                <b-form-select v-model="formData.nativeLanguage" :options="optionsNativeLanguage" size="md"></b-form-select>
                            </div> 
                </template>
            </registration-form>
        </b-modal> 
        <div v-if="userData">
            <div class="student-dashboard" v-show="userData.data.role == 'user' && !userData.data.teacherAppPending">
                <div>
                    {{userData.data}}
                </div>
            </div>
        <teacher-dashboard v-if="userData.data.role == 'teacher'">
            <p v-if="userData.data.teacherAppPending">{{userData.data}}</p>
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
import getUserData from '../assets/scripts/tokenGetter';
import RegistrationForm from './steps/RegistrationForm';

export default {
    async mounted() {
        this.userData = await getUserData();
        this.userId = this.userData.data._id;
        this.loading = false;

        // user has not filled out registration form, so show form
        if (this.userData.data.fluentLanguages.length == 0 && this.userData.data.nonFluentLanguages.length == 0 && !this.userData.data.region && !this.userData.data.timezone) { 
            this.showModal();
        }
    },
    components: {
        TeacherDashboard,
        RegistrationForm
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
                targetLanguage: 'JP',
                nativeLanguage: 'EN',
                level: 'C1',
            },
            host: 'http://localhost:5000/api',
            loading: true,
            optionsLearningLanguage: [
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
                optionsNativeLanguage: [
                    { value: 'EN', text: 'English' },
                    { value: 'JP', text: 'Japanese' },
                    { value: 'CN', text: 'Chinese' },
                    { value: 'KR', text: 'Korean' },
                    { value: 'other', text: 'Other' },
                ],
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